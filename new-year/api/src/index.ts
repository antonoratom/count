/**
 * Cloudflare Worker for Brick Breaker Leaderboard API
 * Uses D1 database for persistent storage
 */

interface Env {
    DB: D1Database;
}

interface ScoreEntry {
    name: string;
    score: number;
    created_at: string;
}

interface NonceEntry {
    nonce: string;
    created_at: number;
    used: number;
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // Debug logging
        console.log(`[${request.method}] ${path}`);

        try {
            // Route: GET /api/start - Generate session nonce
            if (path === '/api/start' && request.method === 'GET') {
                return handleStart(env);
            }

            // Route: GET /api/scores?limit=N - Get top scores
            if (path === '/api/scores' && request.method === 'GET') {
                const limit = parseInt(url.searchParams.get('limit') || '10', 10);
                return handleGetScores(env, limit);
            }

            // Route: POST /api/scores - Submit a score
            if (path === '/api/scores' && request.method === 'POST') {
                return handleSubmitScore(request, env);
            }

            // If no route matches, return 405 for unsupported methods on known paths
            if (path.startsWith('/api/')) {
                return new Response(
                    JSON.stringify({ 
                        error: 'Method Not Allowed', 
                        method: request.method, 
                        path: path,
                        allowed: path === '/api/scores' ? ['GET', 'POST'] : ['GET']
                    }), 
                    { 
                        status: 405, 
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                    }
                );
            }

            // Unknown path
            return new Response(
                JSON.stringify({ 
                    error: 'Not Found', 
                    method: request.method, 
                    path: path
                }), 
                { 
                    status: 404, 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                }
            );
        } catch (error) {
            console.error('Error:', error);
            return new Response(
                JSON.stringify({ ok: false, error: 'Internal server error' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }
    },
};

/**
 * Generate a session nonce and store it in D1
 * Nonces expire after 10 minutes and can only be used once
 */
async function handleStart(env: Env): Promise<Response> {
    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const createdAt = Date.now();

    try {
        await env.DB.prepare(
            `INSERT INTO nonces (nonce, created_at, used) VALUES (?, ?, 0)`
        )
            .bind(nonce, createdAt)
            .run();

        // Clean up old nonces (older than 10 minutes)
        await env.DB.prepare(
            `DELETE FROM nonces WHERE created_at < ? OR used = 1`
        )
            .bind(createdAt - 10 * 60 * 1000)
            .run();

        return new Response(JSON.stringify({ nonce }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating nonce:', error);
        return new Response(
            JSON.stringify({ ok: false, error: 'Failed to create session' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
}

/**
 * Get top N scores from database
 */
async function handleGetScores(env: Env, limit: number): Promise<Response> {
    const maxLimit = Math.min(limit, 100); // Cap at 100

    try {
        const result = await env.DB.prepare(
            `SELECT name, score, created_at 
             FROM scores 
             ORDER BY score DESC 
             LIMIT ?`
        )
            .bind(maxLimit)
            .all<ScoreEntry>();

        const scores = result.results.map((row) => ({
            name: row.name,
            score: row.score,
            created_at: new Date(row.created_at).toISOString(),
        }));

        return new Response(JSON.stringify(scores), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        return new Response(
            JSON.stringify({ ok: false, error: 'Failed to fetch scores' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
}

/**
 * Submit a score to the leaderboard
 * Validates nonce and prevents duplicate submissions
 */
async function handleSubmitScore(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json<{
            name: string;
            score: number;
            nonce: string | null;
        }>();

        // Validate name
        if (!body.name || typeof body.name !== 'string') {
            return new Response(
                JSON.stringify({ ok: false, error: 'Invalid name' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        const cleanName = body.name.trim().slice(0, 12);
        if (cleanName.length < 3) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: 'Name must be at least 3 characters',
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // Validate score
        if (
            typeof body.score !== 'number' ||
            body.score < 0 ||
            !Number.isFinite(body.score)
        ) {
            return new Response(
                JSON.stringify({ ok: false, error: 'Invalid score' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        const score = Math.floor(body.score);

        // Verify nonce if provided
        if (body.nonce) {
            const nonceCheck = await env.DB.prepare(
                `SELECT * FROM nonces WHERE nonce = ? AND used = 0 AND created_at > ?`
            )
                .bind(body.nonce, Date.now() - 10 * 60 * 1000)
                .first<NonceEntry>();

            if (!nonceCheck) {
                return new Response(
                    JSON.stringify({
                        ok: false,
                        error: 'Invalid or expired session',
                    }),
                    {
                        status: 400,
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            // Mark nonce as used
            await env.DB.prepare(`UPDATE nonces SET used = 1 WHERE nonce = ?`)
                .bind(body.nonce)
                .run();
        }

        // Insert score
        await env.DB.prepare(
            `INSERT INTO scores (name, score, created_at) VALUES (?, ?, ?)`
        )
            .bind(cleanName, score, Date.now())
            .run();

        return new Response(JSON.stringify({ ok: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error submitting score:', error);
        return new Response(
            JSON.stringify({ ok: false, error: 'Failed to submit score' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
}

