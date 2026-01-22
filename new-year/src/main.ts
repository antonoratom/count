import { Game } from './game';

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init(): void {
    try {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const game = new Game(canvas);
        game.start().catch((err) => {
            console.error('Failed to start game:', err);
        });
    } catch (err) {
        console.error('Game initialization error:', err);
    }
}

