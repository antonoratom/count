# Brick Breaker Leaderboard API

Cloudflare Worker with D1 database for the Brick Breaker game leaderboard.

## Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

Or use npx:
```bash
npx wrangler --version
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
cd api
npm install
npm run db:create
```

This will output a database ID. Copy it and paste it into `wrangler.toml`:

```toml
database_id = "your-database-id-here"
```

### 4. Initialize Database Schema

```bash
npm run db:migrate
```

### 5. Test Locally

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### 6. Deploy to Cloudflare

```bash
npm run deploy
```

After deployment, update the API endpoints in `/count/new-year/src/config.ts`:

```typescript
export const API_ENDPOINTS = {
    START: 'https://code.anton-atom.com/api/start',
    TOP: 'https://code.anton-atom.com/api/scores?limit=10',
    SUBMIT: 'https://code.anton-atom.com/api/scores',
};
```

## API Endpoints

### GET /api/start
Generates a session nonce for tracking submissions.

**Response:**
```json
{
  "nonce": "abc123xyz"
}
```

### GET /api/scores?limit=10
Returns top N scores.

**Response:**
```json
[
  {
    "name": "Player1",
    "score": 5000,
    "created_at": "2024-12-05T10:00:00.000Z"
  }
]
```

### POST /api/scores
Submits a new score.

**Request:**
```json
{
  "name": "Player1",
  "score": 5000,
  "nonce": "abc123xyz"
}
```

**Response:**
```json
{
  "ok": true
}
```

## Database Queries

Query top scores:
```bash
npm run db:query "SELECT * FROM scores ORDER BY score DESC LIMIT 10"
```

Query all nonces:
```bash
npm run db:query "SELECT * FROM nonces WHERE used = 0"
```

## Security Notes

- Nonces expire after 10 minutes
- Each nonce can only be used once
- Score validation (name 3-12 chars, score >= 0)
- CORS enabled for all origins (adjust in production if needed)

## Future Enhancements

- [ ] Rate limiting per IP
- [ ] HMAC signature verification
- [ ] Admin endpoint to view/manage scores
- [ ] Automatic cleanup of old scores

