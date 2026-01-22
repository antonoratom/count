# Quick Start - Database Setup

## 1. Install Wrangler

```bash
npm install -g wrangler
# OR use npx (no install needed)
npx wrangler --version
```

## 2. Login to Cloudflare

```bash
wrangler login
```

## 3. Create Database

```bash
cd api
wrangler d1 create brick-breaker-scores
```

**Copy the `database_id` from output** and paste it into `wrangler.toml`:

```toml
database_id = "your-database-id-here"
```

## 4. Initialize Schema

```bash
wrangler d1 execute brick-breaker-scores --file=./schema.sql
```

## 5. Install & Deploy

```bash
npm install
npm run deploy
```

After deployment, you'll get a URL like:
```
https://brick-breaker-leaderboard.your-subdomain.workers.dev
```

## 6. Update Game Config

Update `/count/new-year/src/config.ts` with your worker URL:

```typescript
export const API_ENDPOINTS = {
    START: 'https://brick-breaker-leaderboard.your-subdomain.workers.dev/api/start',
    TOP: 'https://brick-breaker-leaderboard.your-subdomain.workers.dev/api/scores?limit=10',
    SUBMIT: 'https://brick-breaker-leaderboard.your-subdomain.workers.dev/api/scores',
};
```

Then rebuild the game:
```bash
cd ..
npm run build:deploy
```

## Done! 🎉

The leaderboard will now update dynamically for all players.

