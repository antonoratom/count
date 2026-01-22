import { WORLD } from './config';
import type { ScoreEntry } from './leaderboard';

export function drawUI(
    ctx: CanvasRenderingContext2D,
    score: number,
    widenActive: boolean,
    stickyActive: boolean
): void {
    ctx.fillStyle = '#fff';
    ctx.font = '16px system-ui';
    ctx.fillText(`Score: ${score}`, 12, 22);

    if (widenActive) {
        ctx.fillStyle = '#10b981';
        ctx.fillText('Wide', 12, 44);
    }
    if (stickyActive) {
        ctx.fillStyle = '#eab308';
        ctx.fillText('Sticky', widenActive ? 70 : 12, 44);
    }
}

export function drawGameOver(
    ctx: CanvasRenderingContext2D,
    score: number,
    topScores: ScoreEntry[]
): void {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, WORLD.W, WORLD.H);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', WORLD.W / 2, WORLD.H / 2 - 120);

    ctx.font = '20px system-ui';
    ctx.fillText(`Final Score: ${score}`, WORLD.W / 2, WORLD.H / 2 - 80);

    if (topScores.length > 0) {
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('Top Scores', WORLD.W / 2, WORLD.H / 2 - 40);

        ctx.font = '14px system-ui';
        ctx.textAlign = 'left';
        const startY = WORLD.H / 2 - 10;
        const lineHeight = 20;
        const maxShow = Math.min(5, topScores.length);

        for (let i = 0; i < maxShow; i++) {
            const entry = topScores[i];
            const y = startY + i * lineHeight;
            ctx.fillText(
                `${i + 1}. ${entry.name}: ${entry.score}`,
                WORLD.W / 2 - 100,
                y
            );
        }
    }

    ctx.textAlign = 'center';
    ctx.font = '16px system-ui';
    ctx.fillText('Click to restart', WORLD.W / 2, WORLD.H / 2 + 100);
}

