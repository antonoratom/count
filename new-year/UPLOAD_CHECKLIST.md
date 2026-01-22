# Upload Checklist - Fix 404 Errors

## The Problem

The errors show the game is calling:
- `https://code.anton-atom.com/api/start` ❌ (404)
- `https://code.anton-atom.com/api/scores` ❌ (404/405)

But it should call:
- `https://code.anton-atom.com/count/new-year/api/start` ✅
- `https://code.anton-atom.com/count/new-year/api/scores` ✅

## Solution

The built files are correct locally, but the server has OLD files. You need to:

### 1. Upload New Files

Upload these files from `/count/new-year/` to your server:

```
/count/new-year/
  ├── index.html          ← Upload this (updated)
  └── assets/
      ├── index.js        ← Upload this (has correct API paths)
      └── index.css       ← Upload this
```

### 2. Start API Server

Make sure the API server is running:

```bash
cd /Users/anton/Documents/GitHub/count/new-year/api
npm install  # if not done yet
npm start
```

The server should run on `localhost:8787`

### 3. Restart Cloudflare Tunnel

Restart your Cloudflare Tunnel so it picks up the new routing:

```bash
cd /Users/anton/Documents/GitHub/custom-server
# Stop existing tunnel, then:
./start-tunnel.sh
```

### 4. Clear Browser Cache

After uploading, hard refresh the page:
- **Chrome/Edge**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Firefox**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### 5. Verify

Check browser console - you should see:
- ✅ `GET https://code.anton-atom.com/count/new-year/api/start` (200 OK)
- ✅ `GET https://code.anton-atom.com/count/new-year/api/scores?limit=5` (200 OK)
- ✅ No more 404 errors

## Quick Test

After uploading, test the API directly:

```bash
curl https://code.anton-atom.com/count/new-year/api/scores?limit=5
```

Should return `[]` (empty array) or scores if any exist.

## If Still Not Working

1. **Check API server is running**: `curl http://localhost:8787/api/scores?limit=5`
2. **Check tunnel config**: Verify `/count/new-year/api/*` routes to `localhost:8787`
3. **Check file paths**: Make sure uploaded files match local files
4. **Check browser cache**: Try incognito/private window

