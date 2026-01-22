import { API_ENDPOINTS } from './config';

export type ScoreEntry = {
    name: string;
    score: number;
    created_at?: string;
};

export interface ILeaderboardAPI {
    start(): Promise<{ nonce: string }>;
    top(limit: number): Promise<ScoreEntry[]>;
    submit(data: {
        name: string;
        score: number;
        nonce: string | null;
    }): Promise<{ ok: boolean; error?: string }>;
}

/**
 * In-memory mock leaderboard for development.
 * TODO: Replace with HttpLeaderboardAPI when Cloudflare Worker is ready.
 */
class MockLeaderboardAPI implements ILeaderboardAPI {
    private data: ScoreEntry[] = [];

    async start(): Promise<{ nonce: string }> {
        return { nonce: Math.random().toString(36).slice(2) };
    }

    async top(limit: number): Promise<ScoreEntry[]> {
        return this.data
            .slice()
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    async submit(d: {
        name: string;
        score: number;
        nonce: string | null;
    }): Promise<{ ok: boolean; error?: string }> {
        if (!d.name || d.name.length < 3) {
            return { ok: false, error: 'invalid name' };
        }

        this.data.push({
            name: d.name,
            score: d.score,
            created_at: new Date().toISOString(),
        });

        return { ok: true };
    }
}

/**
 * HTTP-based leaderboard API for production.
 * TODO: Add HMAC signature verification for security.
 * TODO: Add rate limiting per IP.
 */
class HttpLeaderboardAPI implements ILeaderboardAPI {
    async start(): Promise<{ nonce: string }> {
        try {
            const r = await fetch(API_ENDPOINTS.START);
            if (!r.ok) {
                throw new Error(`Start failed: ${r.status} ${r.statusText}`);
            }
            return r.json();
        } catch (err) {
            console.error('API start error:', err);
            throw err;
        }
    }

    async top(limit: number): Promise<ScoreEntry[]> {
        try {
            // Build URL with limit parameter
            const baseUrl = API_ENDPOINTS.TOP.split('?')[0];
            const url = `${baseUrl}?limit=${limit}`;
            
            const r = await fetch(url);
            if (!r.ok) {
                throw new Error(`Top failed: ${r.status} ${r.statusText}`);
            }
            const data = await r.json();
            console.log(`Fetched ${data.length} scores from ${url}`);
            return data;
        } catch (err) {
            console.error('API top scores error:', err);
            throw err;
        }
    }

    async submit(d: {
        name: string;
        score: number;
        nonce: string | null;
    }): Promise<{ ok: boolean; error?: string }> {
        try {
            const r = await fetch(API_ENDPOINTS.SUBMIT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(d),
            });
            if (!r.ok) {
                const errorText = await r.text();
                throw new Error(`Submit failed: ${r.status} ${r.statusText} - ${errorText}`);
            }
            return r.json();
        } catch (err) {
            console.error('API submit error:', err);
            throw err;
        }
    }
}

export class Leaderboard {
    private api: ILeaderboardAPI;
    private topScores: ScoreEntry[] = [];

    constructor(useMock = false) {
        // Set to true for local development with mock server
        // Set to false to use real Cloudflare Worker API
        this.api = useMock
            ? new MockLeaderboardAPI()
            : new HttpLeaderboardAPI();
        
        // Log which API is being used
        console.log('Leaderboard API:', useMock ? 'MOCK (local)' : 'HTTP (real database)');
        if (!useMock) {
            console.log('API Endpoints:', API_ENDPOINTS);
        }
    }

    async startSession(): Promise<string> {
        const { nonce } = await this.api.start();
        return nonce;
    }

    async fetchTop(limit = 5): Promise<ScoreEntry[]> {
        try {
            this.topScores = await this.api.top(limit);
            console.log('Fetched top scores from API:', this.topScores);
            return this.topScores;
        } catch (err) {
            console.error('Failed to fetch top scores from API:', err);
            // Return empty array instead of cached scores to avoid showing stale data
            return [];
        }
    }

    getTopScores(): ScoreEntry[] {
        return this.topScores;
    }

    async submitScoreFlow(
        score: number,
        nonce: string | null
    ): Promise<void> {
        const name =
            typeof window !== 'undefined'
                ? prompt('Enter name for leaderboard (3–12 chars):', 'Player')
                : 'Player';

        if (!name) return;

        const clean = name.trim().slice(0, 12);

        try {
            const res = await this.api.submit({
                name: clean,
                score,
                nonce,
            });

            if (!res.ok) {
                alert('Submit failed: ' + (res.error || 'unknown'));
            } else {
                alert('Score submitted!');
                // Refresh top 5 scores after submission
                await this.fetchTop(5);
            }
        } catch (err) {
            alert('Submit failed: ' + (err instanceof Error ? err.message : 'unknown'));
        }
    }
}

