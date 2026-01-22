import { Input } from './input';
import { initLevel, type Brick } from './level';
import { collideBallRect, reflectOnBrick } from './physics';
import { POWERUP, SPEED, WORLD } from './config';
import { spawnPowerup, applyPowerup, type Powerup } from './powerups';
import { Leaderboard } from './leaderboard';
import { drawUI, drawGameOver } from './ui';

export type Ball = {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    stuck: boolean;
};

type Paddle = {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
    scale: number;
    widenUntil: number;
    stickyUntil: number;
};

type Session = {
    nonce: string | null;
    startedAt: number;
    hits: number;
    bricks: number;
};

export class Game {
    private ctx: CanvasRenderingContext2D;
    private input: Input;
    private dpr = Math.min(window.devicePixelRatio || 1, 2);
    private running = true;
    private gameOver = false;
    private score = 0;
    private session: Session = {
        nonce: null,
        startedAt: performance.now(),
        hits: 0,
        bricks: 0,
    };
    private paddle: Paddle = {
        x: WORLD.W / 2 - 60,
        y: WORLD.H - 28,
        w: 120,
        h: 16,
        speed: SPEED.PADDLE,
        scale: 1,
        widenUntil: 0,
        stickyUntil: 0,
    };
    private balls: Ball[] = [];
    private bricks: Brick[] = [];
    private powerups: Powerup[] = [];
    private lb = new Leaderboard();

    constructor(private canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D not supported');
        this.ctx = ctx;

        this.input = new Input(
            canvas,
            (nx) => {
                const pw = this.paddle.w * this.paddle.scale;
                this.paddle.x = nx * WORLD.W - pw / 2;
            },
            () => this.releaseOrAction()
        );

        window.addEventListener('resize', () => this.resize());
        this.resize();

        // Click to restart on game over
        canvas.addEventListener('click', () => {
            if (this.gameOver) {
                this.reset();
            }
        });

        this.reset();
    }

    async start(): Promise<void> {
        try {
            const nonce = await this.lb.startSession();
            this.session.nonce = nonce;
        } catch (err) {
            console.warn('Failed to start session:', err);
        }

        // Fetch top 5 scores from database
        try {
            await this.lb.fetchTop(5);
        } catch (err) {
            console.error('Failed to fetch top scores:', err);
        }

        this.loop();
    }

    private resize(): void {
        const wrap = this.canvas.parentElement;
        if (!wrap) return;

        // Full screen: use viewport dimensions
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.width = Math.floor(w * this.dpr);
        this.canvas.height = Math.floor(h * this.dpr);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    private reset(): void {
        this.score = 0;
        this.session = {
            nonce: this.session.nonce,
            startedAt: performance.now(),
            hits: 0,
            bricks: 0,
        };
        this.paddle = {
            x: WORLD.W / 2 - 60,
            y: WORLD.H - 28,
            w: 120,
            h: 16,
            speed: SPEED.PADDLE,
            scale: 1,
            widenUntil: 0,
            stickyUntil: 0,
        };
        this.balls = [
            {
                x: WORLD.W / 2,
                y: WORLD.H - 60,
                r: 8,
                vx: 3,      // Reduced from 4 - initial horizontal velocity
                vy: -4,     // Reduced from -6 - initial vertical velocity
                stuck: true,
            },
        ];
        this.bricks = initLevel();
        this.powerups = [];
        this.gameOver = false;
        this.running = true;
    }

    private releaseOrAction(): void {
        for (const b of this.balls) {
            if (b.stuck) {
                b.stuck = false;
            }
        }
        // Reserved for future laser power-up
    }

    private accumulator = 0;
    private last = performance.now();

    private loop = (): void => {
        const now = performance.now();
        let dt = (now - this.last) / 1000;
        this.last = now;

        const step = 1 / 120; // Fixed timestep at 120Hz
        this.accumulator += Math.min(dt, 0.1); // Cap dt to prevent spiral of death

        while (this.accumulator >= step) {
            this.update(step);
            this.accumulator -= step;
        }

        this.draw();
        requestAnimationFrame(this.loop);
    };

    private update(_dt: number): void {
        if (!this.running) return;

        const now = performance.now();

        // Keyboard control
        if (this.input.left) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.input.right) {
            this.paddle.x += this.paddle.speed;
        }

        const pw = this.paddle.w * this.paddle.scale;
        this.paddle.x = Math.max(0, Math.min(WORLD.W - pw, this.paddle.x));

        // Expire power-ups
        if (this.paddle.widenUntil && now > this.paddle.widenUntil) {
            this.paddle.scale = 1;
            this.paddle.widenUntil = 0;
        }
        if (this.paddle.stickyUntil && now > this.paddle.stickyUntil) {
            this.paddle.stickyUntil = 0;
        }

        // Update balls
        for (const b of this.balls) {
            if (b.stuck) {
                b.x = this.paddle.x + pw / 2;
                b.y = this.paddle.y - b.r - 0.1;
                continue;
            }

            // Fixed timestep: dt is constant (1/120), so we can use velocity directly
            b.x += b.vx;
            b.y += b.vy;

            // Wall collisions
            if (b.x < b.r || b.x > WORLD.W - b.r) {
                b.vx *= -1;
                b.x = Math.max(b.r, Math.min(WORLD.W - b.r, b.x));
            }
            if (b.y < b.r) {
                b.vy *= -1;
                b.y = b.r;
            }

            // Paddle collision
            const p = {
                x: this.paddle.x,
                y: this.paddle.y,
                w: pw,
                h: this.paddle.h,
            };

            if (collideBallRect(b, p) && b.vy > 0) {
                // Calculate hit offset from center [-1, 1]
                const hit = (b.x - (p.x + p.w / 2)) / (p.w / 2);
                const speed = Math.min(
                    SPEED.BALL_MAX,
                    Math.max(SPEED.BALL_MIN, Math.hypot(b.vx, b.vy))
                );
                const angle = hit * 0.9; // Max angle ~51 degrees
                b.vx = speed * Math.sin(angle);
                b.vy = -Math.abs(speed * Math.cos(angle));
                b.y = p.y - b.r - 0.1;
                this.session.hits++;

                // Sticky paddle: catch ball if power-up is active
                if (this.paddle.stickyUntil && now < this.paddle.stickyUntil) {
                    b.stuck = true;
                }
            }

            // Brick collisions
            for (const brick of this.bricks) {
                if (!brick.alive) continue;

                if (collideBallRect(b, brick)) {
                    reflectOnBrick(b, brick);
                    brick.hp -= 1;

                    if (brick.hp <= 0) {
                        brick.alive = false;
                        this.score += 50;
                        this.session.bricks++;
                        spawnPowerup(
                            this.powerups,
                            brick.x + brick.w / 2 - 9,
                            brick.y + brick.h / 2 - 9
                        );
                    } else {
                        this.score += 10;
                    }
                    break; // Only hit one brick per frame
                }
            }
        }

        // Remove lost balls
        this.balls = this.balls.filter((b) => b.y <= WORLD.H + 40);

        // Update power-ups
        for (const pu of this.powerups) {
            pu.y += pu.vy;

            const p = {
                x: this.paddle.x,
                y: this.paddle.y,
                w: pw,
                h: this.paddle.h,
            };

            const overlap =
                pu.x < p.x + p.w &&
                pu.x + pu.w > p.x &&
                pu.y < p.y + p.h &&
                pu.y + pu.h > p.y;

            if (pu.y > WORLD.H + 24) {
                pu.dead = true;
            }

            if (!pu.dead && overlap) {
                applyPowerup(pu.kind, this);
                pu.dead = true;
            }
        }

        this.powerups = this.powerups.filter((pu) => !pu.dead);

        // One life rule: game over when all balls are lost
        if (this.balls.length === 0 && !this.gameOver) {
            this.gameOver = true;
            this.running = false;
            this.lb.submitScoreFlow(this.score, this.session.nonce).catch(
                (err) => {
                    console.warn('Failed to submit score:', err);
                }
            );
        }
    }

    private draw(): void {
        const ctx = this.ctx;
        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, w, h);

        // Scale to world coordinates
        ctx.save();
        ctx.scale(w / WORLD.W, h / WORLD.H);

        // Draw bricks
        ctx.fillStyle = '#94a3b8';
        for (const brick of this.bricks) {
            if (!brick.alive) continue;
            ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        }

        // Draw paddle
        ctx.fillStyle = '#22d3ee';
        const pw = this.paddle.w * this.paddle.scale;
        ctx.fillRect(this.paddle.x, this.paddle.y, pw, this.paddle.h);

        // Draw balls
        ctx.fillStyle = '#f97316';
        for (const b of this.balls) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw power-ups
        for (const pu of this.powerups) {
            if (pu.kind === 'multi') {
                ctx.fillStyle = '#f43f5e';
            } else if (pu.kind === 'widen') {
                ctx.fillStyle = '#10b981';
            } else {
                ctx.fillStyle = '#eab308';
            }
            ctx.fillRect(pu.x, pu.y, pu.w, pu.h);
        }

        // Draw UI (in world coordinates, still scaled)
        drawUI(
            ctx,
            this.score,
            this.paddle.widenUntil > performance.now(),
            this.paddle.stickyUntil > performance.now()
        );

        // Draw game over overlay
        if (this.gameOver) {
            drawGameOver(ctx, this.score, this.lb.getTopScores());
        }

        ctx.restore();
    }

    // Public helpers for power-ups
    public widen(durationMs: number): void {
        this.paddle.scale = Math.min(
            this.paddle.scale + POWERUP.SCALE_STEP,
            POWERUP.SCALE_MAX
        );
        this.paddle.widenUntil = performance.now() + durationMs;
    }

    public sticky(durationMs: number): void {
        this.paddle.stickyUntil = performance.now() + durationMs;
    }

    public multiball(): void {
        const clones: Ball[] = [];
        for (const b of this.balls) {
            if (!b.stuck) {
                clones.push({
                    x: b.x,
                    y: b.y,
                    r: b.r,
                    vx: -b.vx,
                    vy: b.vy,
                    stuck: false,
                });
            }
        }
        this.balls.push(...clones);
    }

    // Expose reset for UI
    public onClickRestart(): void {
        if (this.gameOver) {
            this.reset();
        }
    }
}

