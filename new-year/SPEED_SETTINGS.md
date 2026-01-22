# Speed Settings Guide

All speed settings are located in **`src/config.ts`** in the `SPEED` object.

## Current Speed Settings (Reduced)

```typescript
export const SPEED = {
    PADDLE: 8,        // Reduced from 12 - paddle movement speed
    BALL_MIN: 5,      // Reduced from 7 - minimum ball speed
    BALL_MAX: 8,      // Reduced from 11 - maximum ball speed
    POWERUP_FALL: 1.5, // Reduced from 2 - power-up falling speed
};
```

## Initial Ball Velocity

Located in **`src/game.ts`** in the `reset()` method:

```typescript
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
```

## How to Adjust Speeds

1. **Paddle Speed** (`SPEED.PADDLE`): How fast the paddle moves left/right
   - Lower = slower paddle movement
   - Current: 8 (was 12)

2. **Ball Speed Range** (`SPEED.BALL_MIN` and `SPEED.BALL_MAX`):
   - Ball speed is clamped between these values during gameplay
   - Lower = slower ball movement
   - Current: 5-8 (was 7-11)

3. **Initial Ball Velocity** (`vx` and `vy` in `reset()`):
   - Controls the starting speed when ball is released
   - Current: vx=3, vy=-4 (was vx=4, vy=-6)

4. **Power-up Fall Speed** (`SPEED.POWERUP_FALL`):
   - How fast power-ups fall from destroyed bricks
   - Current: 1.5 (was 2)

## To Make Further Adjustments

1. Edit `src/config.ts` for paddle and ball speed limits
2. Edit `src/game.ts` line ~145 for initial ball velocity
3. Run `npm run build` to rebuild
4. Copy `dist/*` to `/count/new-year/` on your server

