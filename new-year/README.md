# Brick Breaker (Webflow-embed)

A lightweight Arkanoid/brick-breaker game built with vanilla TypeScript and HTML Canvas 2D, designed for easy embedding in Webflow sites.

## Features

- Single life gameplay (game over when all balls are lost)
- Ball physics with wall and paddle collisions
- Brick grid with destruction and scoring
- Power-ups: multiball, wider paddle, and sticky paddle
- Online leaderboard with mock API (ready for Cloudflare Workers + D1)
- Responsive canvas that scales to container
- Desktop (mouse/keyboard) and mobile (touch) controls

## Quick Start

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

### Mock Leaderboard Server (Optional)

To test the leaderboard functionality:

1. Start the mock server in a separate terminal:
   ```bash
   npm run mock-server
   ```

2. The server runs on http://localhost:8787

3. Update `src/config.ts` to use `useMock = false` in the Leaderboard constructor if you want to test HTTP endpoints.

## Build

```bash
npm run build
```

Output will be in the `dist/` directory. You can:
- Use `dist/index.html` + assets directly
- Host the bundle on a subdomain and embed via iframe in Webflow

## Deployment

The game is configured to be hosted at `/count/new-year/` on your server.

**Build and deploy:**
```bash
npm run build
```

Upload the contents of `dist/` folder to:
- `https://code.anton-atom.com/count/new-year/`

**File structure on server:**
```
/count/new-year/
  ├── index.html
  └── assets/
      ├── index.js
      └── index.css
```

## Webflow Integration

### Option A: Custom Code Embed

1. In Webflow, add an **Embed** block to your page
2. Paste the built HTML (from `dist/index.html`) and update script paths:
   ```html
   <div id="wrap">
       <canvas id="game" width="960" height="540"></canvas>
       <div id="overlay"></div>
   </div>
   <script type="module" src="https://code.anton-atom.com/count/new-year/assets/index.js"></script>
   ```
3. Add the CSS from `dist/assets/index.css` to your page's custom CSS or in a `<style>` tag
4. Publish your site

### Option B: Iframe Embed

1. Host the built app at `https://code.anton-atom.com/count/new-year/`
2. In Webflow, add an **Embed** block
3. Paste:
   ```html
   <iframe 
       src="https://code.anton-atom.com/count/new-year/" 
       width="100%" 
       height="600" 
       frameborder="0"
       style="max-width: 960px; aspect-ratio: 16/9;">
   </iframe>
   ```
4. Publish your site

## Game Controls

- **Desktop**: Move mouse to control paddle, or use Arrow Keys / A-D keys
- **Mobile**: Touch and drag to control paddle
- **Release ball**: Click/tap when ball is stuck to paddle (sticky power-up)

## Architecture

- **World units**: Fixed at 960×540, scales to container
- **Update loop**: Fixed timestep (120Hz) with render interpolation
- **Modules**:
  - `game.ts` - Main game state and loop
  - `input.ts` - Keyboard, mouse, and touch input
  - `physics.ts` - Collision detection and reflection
  - `powerups.ts` - Power-up spawning and effects
  - `level.ts` - Brick grid generation
  - `leaderboard.ts` - API interfaces and implementations
  - `ui.ts` - Score display and game over overlay

## Leaderboard API

The game includes a leaderboard system with two implementations:

1. **MockLeaderboardAPI** (default) - In-memory storage for development
2. **HttpLeaderboardAPI** - HTTP endpoints for production

### API Endpoints

- `GET /api/start` - Returns `{ nonce: string }` for session tracking
- `GET /api/scores?limit=N` - Returns top N scores: `[{ name, score, created_at }]`
- `POST /api/scores` - Submit score: `{ name, score, nonce }` → `{ ok, error? }`

## Production Setup (Cloudflare Workers + D1)

### High-level Steps

1. **Create Cloudflare Worker**:
   ```bash
   wrangler init brick-breaker-api
   ```

2. **Enable D1**:
   ```bash
   wrangler d1 create brickbreaker
   ```

3. **Database Schema**:
   ```sql
   CREATE TABLE scores (
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       score INTEGER NOT NULL,
       created_at INTEGER NOT NULL
   );
   
   CREATE INDEX idx_score ON scores(score DESC);
   ```

4. **Worker Endpoints**:
   - `GET /api/start` → Generate nonce, store in KV with TTL 10 min
   - `GET /api/scores?limit=N` → `SELECT * FROM scores ORDER BY score DESC LIMIT N`
   - `POST /api/scores` → Validate, verify nonce once, insert row

5. **Security** (TODO):
   - Rate-limit by IP (use Cloudflare built-in or Durable Objects)
   - Optional HMAC: `signature = HMAC_SHA256(SECRET, score|nonce|duration|hits|bricks)`
   - Verify nonce hasn't been used for duplicate submissions

6. **Configure CORS** for your site origin

7. **Update Config**:
   - Set `API_ENDPOINTS` in `src/config.ts` to your Worker URL
   - Switch `Leaderboard` constructor to `useMock = false`

## Power-ups

- **Widen** (40% chance): Increases paddle width by 25% (max 1.6x) for 20 seconds
- **Multiball** (40% chance): Clones each active ball with mirrored horizontal velocity
- **Sticky** (20% chance): Paddle catches balls for 15 seconds; click to release

Power-ups spawn with a 15% drop rate when bricks are destroyed.

## Technical Details

- **TypeScript**: Strict mode, no `any` unless justified
- **Canvas**: 2D rendering with device pixel ratio scaling
- **Physics**: Deterministic fixed timestep updates
- **Performance**: Optimized for 60 FPS on desktop, acceptable on mobile

## License

MIT

