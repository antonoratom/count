# Simple Node.js Server Deployment

Since Cloudflare Workers setup can be complex, here's a simpler Node.js server that works anywhere.

## Quick Start (Local Testing)

1. **Install dependencies:**
```bash
cd api
npm install
```

2. **Start the server:**
```bash
npm start
```

The server will run on `http://localhost:8787`

3. **Update game config** to use localhost (for testing):
```typescript
// In /count/new-year/src/config.ts
export const API_ENDPOINTS = {
    START: 'http://localhost:8787/api/start',
    TOP: 'http://localhost:8787/api/scores?limit=5',
    SUBMIT: 'http://localhost:8787/api/scores',
};
```

4. **Rebuild game:**
```bash
cd ..
npm run build:deploy
```

## Deploy to Production

### Option 1: Railway (Easiest)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo, point to `/count/new-year/api` folder
4. Railway auto-detects Node.js and runs `npm start`
5. Get your URL: `https://your-app.railway.app`
6. Update game config with this URL

### Option 2: Render

1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Set:
   - **Root Directory:** `count/new-year/api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Get your URL and update game config

### Option 3: Fly.io

```bash
cd api
fly launch
# Follow prompts
fly deploy
```

### Option 4: Your Own Server

```bash
# On your server
cd /path/to/api
npm install
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start server.js --name brick-breaker-api
pm2 save
```

Then set up nginx reverse proxy or use the port directly.

## Update Game Config

After deploying, update `/count/new-year/src/config.ts`:

```typescript
export const API_ENDPOINTS = {
    START: 'https://your-deployed-url.com/api/start',
    TOP: 'https://your-deployed-url.com/api/scores?limit=5',
    SUBMIT: 'https://your-deployed-url.com/api/scores',
};
```

Then rebuild:
```bash
npm run build:deploy
```

## Database

The server uses SQLite (`leaderboard.db` file). For production, you might want to:
- Use PostgreSQL/MySQL instead
- Backup the database file regularly
- Use a managed database service

## Environment Variables

- `PORT` - Server port (default: 8787)

## That's It! 🎉

The server is much simpler than Cloudflare Workers and works on any Node.js hosting.

