-- D1 Database Schema for Brick Breaker Leaderboard

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

-- Index for fast score queries
CREATE INDEX IF NOT EXISTS idx_score ON scores(score DESC);

-- Index for date queries
CREATE INDEX IF NOT EXISTS idx_created_at ON scores(created_at DESC);

-- Nonces table for session tracking
CREATE TABLE IF NOT EXISTS nonces (
    nonce TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0
);

-- Index for nonce cleanup
CREATE INDEX IF NOT EXISTS idx_nonce_created ON nonces(created_at);

