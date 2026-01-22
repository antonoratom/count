import { WORLD } from './config';

export type Brick = {
    x: number;
    y: number;
    w: number;
    h: number;
    alive: boolean;
    hp: number;
};

export function initLevel(): Brick[] {
    const rows = 6;
    const cols = 12;
    const pad = 6;
    const top = 60;

    const brickW = (WORLD.W - (cols + 1) * pad) / cols;
    const brickH = 24;

    const bricks: Brick[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            bricks.push({
                x: pad + c * (brickW + pad),
                y: top + r * (brickH + pad),
                w: brickW,
                h: brickH,
                alive: true,
                hp: 1,
            });
        }
    }

    return bricks;
}

