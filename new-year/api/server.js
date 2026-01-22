/**
 * Simple Express server for Brick Breaker Leaderboard
 * Runs on same domain as game via Cloudflare Tunnel
 * Uses SQLite for database
 */

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8787;

// Initialize SQLite database
const db = new Database(join(__dirname, 'leaderboard.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
  
  CREATE INDEX IF NOT EXISTS idx_score ON scores(score DESC);
  CREATE INDEX IF NOT EXISTS idx_created_at ON scores(created_at DESC);
  
  CREATE TABLE IF NOT EXISTS nonces (
    nonce TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0
  );
  
  CREATE INDEX IF NOT EXISTS idx_nonce_created ON nonces(created_at);
`);

// CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Helper functions
function handleStart(req, res) {
    try {
        const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
        const createdAt = Date.now();

        db.prepare('INSERT INTO nonces (nonce, created_at, used) VALUES (?, ?, 0)')
            .run(nonce, createdAt);

        // Clean up old nonces (older than 10 minutes)
        db.prepare('DELETE FROM nonces WHERE created_at < ? OR used = 1')
            .run(createdAt - 10 * 60 * 1000);

        res.json({ nonce });
    } catch (error) {
        console.error('Error creating nonce:', error);
        res.status(500).json({ ok: false, error: 'Failed to create session' });
    }
}

function handleGetScores(req, res) {
    try {
        const limit = Math.min(parseInt(req.query.limit || '10', 10), 100);

        const scores = db.prepare(`
            SELECT name, score, created_at 
            FROM scores 
            ORDER BY score DESC 
            LIMIT ?
        `).all(limit).map(row => ({
            name: row.name,
            score: row.score,
            created_at: new Date(row.created_at).toISOString(),
        }));

        res.json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ ok: false, error: 'Failed to fetch scores' });
    }
}

function handleSubmitScore(req, res) {
    try {
        const { name, score, nonce } = req.body;

        // Validate name
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ ok: false, error: 'Invalid name' });
        }

        const cleanName = name.trim().slice(0, 12);
        if (cleanName.length < 3) {
            return res.status(400).json({
                ok: false,
                error: 'Name must be at least 3 characters',
            });
        }

        // Validate score
        if (typeof score !== 'number' || score < 0 || !Number.isFinite(score)) {
            return res.status(400).json({ ok: false, error: 'Invalid score' });
        }

        const finalScore = Math.floor(score);

        // Verify nonce if provided
        if (nonce) {
            const nonceCheck = db.prepare(`
                SELECT * FROM nonces 
                WHERE nonce = ? AND used = 0 AND created_at > ?
            `).get(nonce, Date.now() - 10 * 60 * 1000);

            if (!nonceCheck) {
                return res.status(400).json({
                    ok: false,
                    error: 'Invalid or expired session',
                });
            }

            // Mark nonce as used
            db.prepare('UPDATE nonces SET used = 1 WHERE nonce = ?').run(nonce);
        }

        // Insert score
        db.prepare('INSERT INTO scores (name, score, created_at) VALUES (?, ?, ?)')
            .run(cleanName, finalScore, Date.now());

        res.json({ ok: true });
    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).json({ ok: false, error: 'Failed to submit score' });
    }
}

// Routes: Handle both /api/* and /count/new-year/api/*
app.get('/api/start', handleStart);
app.get('/count/new-year/api/start', handleStart);

app.get('/api/scores', handleGetScores);
app.get('/count/new-year/api/scores', handleGetScores);

app.post('/api/scores', handleSubmitScore);
app.post('/count/new-year/api/scores', handleSubmitScore);

app.listen(PORT, () => {
    console.log(`🚀 Brick Breaker Leaderboard API running on port ${PORT}`);
    console.log(`📊 Database: ${join(__dirname, 'leaderboard.db')}`);
    console.log(`🌐 Endpoints available at:`);
    console.log(`   https://code.anton-atom.com/count/new-year/api/start`);
    console.log(`   https://code.anton-atom.com/count/new-year/api/scores?limit=5`);
    console.log(`   https://code.anton-atom.com/count/new-year/api/scores (POST)`);
});
