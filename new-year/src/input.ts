export class Input {
    public left = false;
    public right = false;
    private dragging = false;

    constructor(
        canvas: HTMLCanvasElement,
        onMove: (normX: number) => void,
        onTap: () => void
    ) {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.left = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.right = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.left = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.right = false;
            }
        });

        canvas.addEventListener('pointerdown', (e) => {
            this.dragging = true;
            onTap();
            const rect = canvas.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            onMove(Math.max(0, Math.min(1, nx)));
        });

        canvas.addEventListener('pointerup', () => {
            this.dragging = false;
        });

        canvas.addEventListener('pointerleave', () => {
            this.dragging = false;
        });

        canvas.addEventListener('pointermove', (e) => {
            if (this.dragging || e.pointerType === 'mouse') {
                const rect = canvas.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width;
                onMove(Math.max(0, Math.min(1, nx)));
            }
        });
    }
}

