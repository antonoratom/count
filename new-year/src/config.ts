export const WORLD = { W: 960, H: 540 };

export const POWERUP = {
    DROP_RATE: 0.15,
    WIDEN_DURATION_MS: 20000,
    STICKY_DURATION_MS: 15000,
    SCALE_STEP: 0.25,
    SCALE_MAX: 1.6,
};

export const SPEED = {
    PADDLE: 8,        // Reduced from 12 - paddle movement speed
    BALL_MIN: 1,      // Reduced from 7 - minimum ball speed
    BALL_MAX: 2,      // Reduced from 11 - maximum ball speed
    POWERUP_FALL: 1, // Reduced from 2 - power-up falling speed
};

// API Endpoints - Running on same domain as game
export const API_ENDPOINTS = {
    START: 'https://code.anton-atom.com/count/new-year/api/start',
    TOP: 'https://code.anton-atom.com/count/new-year/api/scores?limit=5',
    SUBMIT: 'https://code.anton-atom.com/count/new-year/api/scores',
};

