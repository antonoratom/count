import { SPEED } from './config';

export function collideBallRect(
    b: { x: number; y: number; r: number },
    r: { x: number; y: number; w: number; h: number }
): boolean {
    return (
        b.x + b.r > r.x &&
        b.x - b.r < r.x + r.w &&
        b.y + b.r > r.y &&
        b.y - b.r < r.y + r.h
    );
}

/**
 * Reflects ball off brick using previous position to determine collision axis.
 * Clamps speed to valid range.
 */
export function reflectOnBrick(
    b: { x: number; y: number; vx: number; vy: number },
    brick: { x: number; y: number; w: number; h: number }
): void {
    const prevX = b.x - b.vx;
    const prevY = b.y - b.vy;

    const wasLeft = prevX <= brick.x;
    const wasRight = prevX >= brick.x + brick.w;
    const wasAbove = prevY <= brick.y;
    const wasBelow = prevY >= brick.y + brick.h;

    // Determine which axis to reflect on based on previous position
    if ((wasLeft && !wasRight) || (wasRight && !wasLeft)) {
        b.vx *= -1;
    }
    if ((wasAbove && !wasBelow) || (wasBelow && !wasAbove)) {
        b.vy *= -1;
    }

    // Clamp speed to valid range
    const speed = Math.hypot(b.vx, b.vy);
    if (speed > 0) {
        const dirX = b.vx / speed;
        const dirY = b.vy / speed;
        const clamped = Math.min(
            SPEED.BALL_MAX,
            Math.max(SPEED.BALL_MIN, speed)
        );
        b.vx = dirX * clamped;
        b.vy = dirY * clamped;
    }
}

