# Troubleshooting 405 Error

## Error: "Submit failed: 405 - Method Not Allowed"

This error means the POST request to `/api/scores` is reaching the server, but the route isn't matching correctly.

## Possible Causes

1. **Worker not deployed** - The Cloudflare Worker might not be deployed yet
2. **Route pattern mismatch** - The custom domain routing might not be configured correctly
3. **Path normalization** - The path might have trailing slashes or case issues

## Solutions

### 1. Verify Worker is Deployed

```bash
cd api
wrangler deploy
```

Check the deployment output for the worker URL.

### 2. Test the API Directly

```bash
# Test GET (should work)
curl https://code.anton-atom.com/api/scores?limit=5

# Test POST (this is what's failing)
curl -X POST https://code.anton-atom.com/api/scores \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","score":100,"nonce":"test123"}'
```

### 3. Check Worker Logs

```bash
wrangler tail
```

Look for log messages showing the incoming requests.

### 4. Verify Custom Domain Routing

If using `code.anton-atom.com`, you need to configure the route in Cloudflare:

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to Settings → Triggers
4. Add route: `code.anton-atom.com/api/*`

**OR** use the default workers.dev domain and update the game config:

```typescript
// In src/config.ts
export const API_ENDPOINTS = {
    START: 'https://brick-breaker-leaderboard.YOUR_SUBDOMAIN.workers.dev/api/start',
    TOP: 'https://brick-breaker-leaderboard.YOUR_SUBDOMAIN.workers.dev/api/scores?limit=5',
    SUBMIT: 'https://brick-breaker-leaderboard.YOUR_SUBDOMAIN.workers.dev/api/scores',
};
```

### 5. Check Browser Console

Open browser console (F12) and look for:
- Network tab: Check the actual request being sent
- Console: Look for API error messages
- The request URL and method should match exactly

### 6. Temporary Fix: Use Mock Server

While debugging, you can use the local mock server:

1. Update `src/config.ts`:
```typescript
export const API_ENDPOINTS = {
    START: 'http://localhost:8787/api/start',
    TOP: 'http://localhost:8787/api/scores?limit=5',
    SUBMIT: 'http://localhost:8787/api/scores',
};
```

2. Start mock server:
```bash
npm run mock-server
```

3. Set `useMock = true` in `src/leaderboard.ts` constructor

4. Rebuild:
```bash
npm run build:deploy
```

## Expected Behavior

When working correctly:
- GET `/api/scores?limit=5` returns top 5 scores
- POST `/api/scores` accepts score submissions
- All requests return proper CORS headers
- Worker logs show incoming requests

## Still Not Working?

1. Check if the database is initialized:
```bash
wrangler d1 execute brick-breaker-scores --command "SELECT COUNT(*) FROM scores"
```

2. Verify the worker is receiving requests:
```bash
wrangler tail --format pretty
```

3. Test with a simple curl command to isolate the issue

