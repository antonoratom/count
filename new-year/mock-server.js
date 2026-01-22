/**
 * Simple mock server for leaderboard API testing.
 * Run with: npm run mock-server
 * 
 * TODO: Replace with Cloudflare Worker + D1 in production.
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8787;

// In-memory storage (reset on server restart)
const scores = [];
const nonces = new Set();

app.use(cors());
app.use(express.json());

// GET /api/start - Generate a session nonce
app.get('/api/start', (req, res) => {
    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    nonces.add(nonce);
    
    // Clean up old nonces (simple TTL simulation)
    setTimeout(() => nonces.delete(nonce), 10 * 60 * 1000); // 10 minutes
    
    res.json({ nonce });
});

// GET /api/scores?limit=N - Get top scores
app.get('/api/scores', (req, res) => {
    const limit = parseInt(req.query.limit || '10', 10);
    const sorted = scores
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    res.json(sorted);
});

// POST /api/scores - Submit a score
app.post('/api/scores', (req, res) => {
    const { name, score, nonce } = req.body;
    
    // Basic validation
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 12) {
        return res.status(400).json({ ok: false, error: 'Invalid name (3-12 chars required)' });
    }
    
    if (typeof score !== 'number' || score < 0 || !Number.isFinite(score)) {
        return res.status(400).json({ ok: false, error: 'Invalid score' });
    }
    
    // TODO: Verify nonce exists and hasn't been used (prevent duplicate submissions)
    // For now, we'll just check if it exists
    if (nonce && !nonces.has(nonce)) {
        console.warn(`Unknown nonce: ${nonce}`);
    }
    
    // Add score
    scores.push({
        name: name.trim().slice(0, 12),
        score: Math.floor(score),
        created_at: new Date().toISOString(),
    });
    
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Mock leaderboard server running on http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  GET  /api/start`);
    console.log(`  GET  /api/scores?limit=N`);
    console.log(`  POST /api/scores`);
});

