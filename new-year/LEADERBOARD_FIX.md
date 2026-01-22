# Leaderboard Fix - Global Database Results

## Changes Made

1. **Changed default limit to 5** - Now fetches and displays top 5 scores
2. **Improved error logging** - Console will show API errors if the database isn't connected
3. **Ensured real API is used** - `useMock = false` by default

## The Problem

If you're seeing "local browser session results", it means:
- The Cloudflare Worker API is not deployed yet, OR
- The API endpoints are incorrect, OR
- There's a CORS/network error

## How to Verify

1. **Open browser console** (F12) when the game loads
2. Look for these log messages:
   - `Leaderboard API: HTTP (real database)` ✅ (correct)
   - `Leaderboard API: MOCK (local)` ❌ (wrong - using mock)
   - `API Endpoints: {...}` (shows which URLs are being used)
   - `Fetched X scores from https://...` (shows successful API call)
   - `API top scores error: ...` (shows if API call failed)

## If API Isn't Deployed Yet

The game will try to fetch from `https://code.anton-atom.com/api/scores` but if the Cloudflare Worker isn't deployed, you'll see:
- Empty leaderboard (no scores shown)
- Console errors about failed fetch

## Next Steps

1. **Deploy the Cloudflare Worker** (see `api/QUICK_START.md`)
2. **Verify API is working**:
   ```bash
   curl https://code.anton-atom.com/api/scores?limit=5
   ```
3. **Check browser console** for any errors
4. **Rebuild the game** after deploying:
   ```bash
   npm run build:deploy
   ```

## Testing Locally

If you want to test with the mock server while developing:

1. Start mock server: `npm run mock-server`
2. Update `src/config.ts` to use `http://localhost:8787`
3. Set `useMock = true` in `src/leaderboard.ts` constructor
4. Rebuild: `npm run build:deploy`

## Current Configuration

- **API Endpoints**: `https://code.anton-atom.com/api/*`
- **Using Mock**: `false` (uses real API)
- **Top Scores Limit**: 5
- **Error Handling**: Returns empty array if API fails (prevents showing stale data)

