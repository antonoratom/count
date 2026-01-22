// Cache DOM queries
const allDots = document.querySelectorAll('circle[data-id]');
const pulseDots = document.querySelectorAll('circle[custom-dot="pulse"]');

// Calculate distance between two points
const dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// Get random delay in milliseconds
const randDelay = (min, max) => (min + Math.random() * (max - min)) * 1000;

// Create water drop ripple effect
function ripple(pulseDot, maxDist = 100) {
  const pX = +pulseDot.dataset.x;
  const pY = +pulseDot.dataset.y;
  
  // Animate pulse dot
  pulseDot.classList.remove('pulsing');
  pulseDot.offsetWidth; // Force reflow once
  pulseDot.classList.add('pulsing');
  setTimeout(() => pulseDot.classList.remove('pulsing'), 1200);
  
  // Find and animate nearby dots
  allDots.forEach(dot => {
    if (dot === pulseDot) return;
    
    const d = dist(pX, pY, +dot.dataset.x, +dot.dataset.y);
    if (d > maxDist) return;
    
    const intensity = (1 - d / maxDist) ** 2;
    const scale = 1.02 + intensity * 0.18; // 1.02 to 1.2
    
    setTimeout(() => {
      dot.classList.remove('ripple-wave');
      dot.style.setProperty('--ripple-scale', scale);
      dot.classList.add('ripple-wave');
      
      setTimeout(() => {
        dot.classList.remove('ripple-wave');
        dot.style.removeProperty('--ripple-scale');
      }, 400);
    }, d / 0.15);
  });
}

// Initialize pulse dots with random timing
function init() {
  pulseDots.forEach(dot => {
    setTimeout(() => {
      ripple(dot);
      (function schedule() {
        setTimeout(() => {
          ripple(dot);
          schedule();
        }, randDelay(3, 8));
      })();
    }, randDelay(0, 3));
  });
}

// Start when ready
document.readyState === 'loading' 
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
