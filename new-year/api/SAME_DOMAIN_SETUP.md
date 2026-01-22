# Running API on Same Domain Setup

Since you're using Cloudflare Tunnel pointing `code.anton-atom.com` to `localhost:5500`, here's how to set up the API on the same domain.

## Option 1: Update Cloudflare Tunnel Config (Recommended)

Update your `custom-server/config.yml` to route API requests to the API server:

```yaml
tunnel: cf6e0360-c586-47c2-aa89-70c221697d65
credentials-file: /Users/anton/Documents/GitHub/custom-server/cf6e0360-c586-47c2-aa89-70c221697d65.json
origincert: /Users/anton/Documents/GitHub/custom-server/cert.pem

ingress:
  # Route API requests to API server (port 8787)
  - hostname: code.anton-atom.com
    path: /count/new-year/api/*
    service: http://localhost:8787
  # Route everything else to your main server (port 5500)
  - hostname: code.anton-atom.com
    service: http://localhost:5500
  - service: http_status:404
```

Then:
1. Start the API server: `cd api && npm start` (runs on port 8787)
2. Restart Cloudflare Tunnel: `./start-tunnel.sh` or restart the tunnel
3. The API will be available at `https://code.anton-atom.com/count/new-year/api/*`

## Option 2: Combined Server (Simpler)

Create a combined server that serves both static files and API:

1. **Create combined server** (`server-combined.js` in project root):
```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5500;

// CORS
app.use(cors());
app.use(express.json());

// Import API routes from api/server.js or copy the API code here
// ... (API code from api/server.js)

// Serve static files
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

2. **Update tunnel config** to point to port 5500 (already done)
3. **Start the combined server** instead of your current server

## Option 3: Use Existing Server

If you already have a server running on port 5500, you can:

1. Add the API routes to that server
2. Or run the API server on a different port and use Option 1

## Quick Start (Option 1 - Recommended)

1. **Start API server:**
```bash
cd /Users/anton/Documents/GitHub/count/new-year/api
npm install
npm start
```

2. **Update Cloudflare Tunnel config** (see above)

3. **Restart tunnel:**
```bash
cd /Users/anton/Documents/GitHub/custom-server
./start-tunnel.sh
```

4. **Test:**
```bash
curl https://code.anton-atom.com/count/new-year/api/scores?limit=5
```

The game is already configured to use these endpoints!

