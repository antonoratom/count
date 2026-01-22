import { POWERUP, SPEED } from './config';
import type { Game } from './game';

export type PowerupKind = 'multi' | 'widen' | 'sticky';

export type Powerup = {
    x: number;
    y: number;
    w: number;
    h: number;
    vy: number;
    kind: PowerupKind;
    dead?: boolean;
};

/**
 * Spawns a power-up with DROP_RATE chance at the given position.
 * Distribution: 40% widen, 40% multi, 20% sticky.
 */
export function spawnPowerup(
    list: Powerup[],
    x: number,
    y: number
): void {
    if (Math.random() > POWERUP.DROP_RATE) return;

    const roll = Math.random();
    let kind: PowerupKind = 'widen';

    if (roll < 0.4) {
        kind = 'widen';
    } else if (roll < 0.8) {
        kind = 'multi';
    } else {
        kind = 'sticky';
    }

    list.push({
        x,
        y,
        w: 18,
        h: 18,
        vy: SPEED.POWERUP_FALL,
        kind,
        dead: false,
    });
}

/**
 * Applies power-up effect to the game.
 * WIDEN: increases paddle scale for WIDEN_DURATION_MS
 * MULTI: clones each active non-stuck ball with mirrored vx
 * STICKY: enables sticky paddle for STICKY_DURATION_MS
 */
export function applyPowerup(kind: PowerupKind, game: Game): void {
    if (kind === 'widen') {
        game.widen(POWERUP.WIDEN_DURATION_MS);
    } else if (kind === 'multi') {
        game.multiball();
    } else if (kind === 'sticky') {
        game.sticky(POWERUP.STICKY_DURATION_MS);
    }
}

