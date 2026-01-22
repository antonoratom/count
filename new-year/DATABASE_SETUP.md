# Database Setup Guide

This guide will help you set up the Cloudflare Worker + D1 database for the leaderboard.

## Prerequisites

1. Cloudflare account (free tier works)
2. Node.js and npm installed
3. Wrangler CLI (Cloudflare's CLI tool)

## Step-by-Step Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

Or use npx (no global install needed):
```bash
npx wrangler --version
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Navigate to API Folder

```bash
cd /Users/anton/Documents/GitHub/count/new-year/api
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Create D1 Database

```bash
npm run db:create
```

Or manually:
```bash
wrangler d1 create brick-breaker-scores
```

**Important:** Copy the `database_id` from the output. It will look like:
```
✅ Created database brick-breaker-scores in region EEUR

[[d1_databases]]
binding = "DB"
database_name = "brick-breaker-scores"
database_id = "abc123def456..."  ← Copy this ID
```

### 6. Update wrangler.toml

Open `api/wrangler.toml` and paste the `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "brick-breaker-scores"
database_id = "your-database-id-here"  ← Paste the ID here
```

### 7. Initialize Database Schema

```bash
npm run db:migrate
```

Or manually:
```bash
wrangler d1 execute brick-breaker-scores --file=./schema.sql
```

### 8. Test Locally

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

Test the endpoints:
```bash
# Get a nonce
curl http://localhost:8787/api/start

# Get top scores
curl http://localhost:8787/api/scores?limit=10

# Submit a score (replace NONCE with actual nonce)
curl -X POST http://localhost:8787/api/scores \
  -H "Content-Type: application/json" \
  -d '{"name":"TestPlayer","score":1000,"nonce":"NONCE"}'
```

### 9. Deploy to Cloudflare

```bash
npm run deploy
```

Or manually:
```bash
wrangler deploy
```

After deployment, you'll get a URL like:
```
https://brick-breaker-leaderboard.your-subdomain.workers.dev
```

### 10. Configure Custom Domain (Optional)

If you want to use `code.anton-atom.com/api/*`, you'll need to:

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to Settings → Triggers → Custom Domains
4. Add `code.anton-atom.com` and configure the route pattern

Or update the routes in `wrangler.toml` (requires Cloudflare Pro plan for custom domains).

### 11. Update Game Configuration

Once deployed, the API endpoints in `src/config.ts` are already set to:
```typescript
START: 'https://code.anton-atom.com/api/start'
TOP: 'https://code.anton-atom.com/api/scores?limit=10'
SUBMIT: 'https://code.anton-atom.com/api/scores'
```

If you're using the default workers.dev domain, update these URLs.

### 12. Switch Game to Use Real API

The game is already configured to use the real API (not mock). In `src/leaderboard.ts`:

```typescript
constructor(useMock = false) {  // Already set to false
```

## Verify It's Working

1. Open the game in browser
2. Play and get a score
3. Submit your score
4. Check the leaderboard - your score should appear!

## Troubleshooting

### Database not found
- Make sure `database_id` is correct in `wrangler.toml`
- Verify database exists: `wrangler d1 list`

### CORS errors
- The worker already has CORS headers configured
- If issues persist, check browser console for specific errors

### Scores not saving
- Check Cloudflare Worker logs: `wrangler tail`
- Verify database schema was created: `wrangler d1 execute brick-breaker-scores --command "SELECT * FROM scores LIMIT 5"`

### Local development
- For local testing with mock server, set `useMock = true` in `leaderboard.ts`
- Or use `http://localhost:8787` endpoints in `config.ts` when running `npm run dev` in the api folder

## Useful Commands

```bash
# View worker logs
wrangler tail

# Query database
wrangler d1 execute brick-breaker-scores --command "SELECT * FROM scores ORDER BY score DESC LIMIT 10"

# Delete all scores (careful!)
wrangler d1 execute brick-breaker-scores --command "DELETE FROM scores"

# View nonces
wrangler d1 execute brick-breaker-scores --command "SELECT * FROM nonces"
```

## Next Steps

- [ ] Set up rate limiting
- [ ] Add HMAC signature verification for extra security
- [ ] Create admin panel to view/manage scores
- [ ] Add automatic cleanup of old scores

