// World Map Dots Generator - Optimized
class MapDotsImage {
  constructor() {
    // Main dots
    this.dotSize = 3.5;
    this.dotGap = 10;
    this.defaultDotSize = 4;
    this.defaultDotGap = 10;
    
    // Background dots
    this.bgDotSize = 1.5;
    this.bgDotGap = 20;
    
    // Edge smoothing
    this.edgeDotSizeMultiplier = 0.75;
    
    // Country regions (pixel coordinates based on viewBox 2600x1520)
    // Format: [xMin, xMax, yMin, yMax]
    this.redCountries = {
      norway: [1200, 1400, 120, 280],
      denmark: [1260, 1360, 260, 330],
      uk: [1000, 1180, 400, 630],
      netherlands: [1220, 1340, 440, 540],
      belgium: [1200, 1310, 510, 600],
      germany: [1270, 1460, 400, 670],
      france: [1150, 1400, 580, 800]
    };
    
    this.imageElement = null;
    this.svgContainer = null;
    this.dotsGroup = null;
    this.bgDotsGroup = null;
    this.imageData = null;
    this.cpuUsage = 0;
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.imageElement = document.querySelector('.img-map-item');
    if (!this.imageElement) return;
    
    this.imageElement.crossOrigin = 'anonymous';
    
    if (this.imageElement.complete && this.imageElement.naturalWidth > 0) {
      const src = this.imageElement.src;
      this.imageElement.src = '';
      this.imageElement.src = src;
    }
    
    this.imageElement.addEventListener('load', () => this.processImage());
  }
  
  processImage() {
    const parent = this.imageElement.parentElement;
    
    // Create SVG overlay
    this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgContainer.setAttribute('viewBox', `0 0 ${this.imageElement.naturalWidth} ${this.imageElement.naturalHeight}`);
    Object.assign(this.svgContainer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    });
    
    parent.style.position = 'relative';
    
    // Create dot groups
    this.bgDotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svgContainer.appendChild(this.bgDotsGroup);
    this.svgContainer.appendChild(this.dotsGroup);
    
    parent.appendChild(this.svgContainer);
    
    this.loadImageData();
    this.setupControls();
    this.setupPerformanceMonitor();
  }
  
  loadImageData() {
    const canvas = document.createElement('canvas');
    canvas.width = this.imageElement.naturalWidth;
    canvas.height = this.imageElement.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return;
    
    try {
      ctx.drawImage(this.imageElement, 0, 0);
      this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.createDots();
      setTimeout(() => {
        this.imageElement.style.opacity = '0';
        this.imageElement.style.transition = 'opacity 0.5s';
      }, 100);
    } catch (error) {
      console.error('Failed to read image data:', error);
    }
  }
  
  createDots() {
    if (!this.imageData) return;
    
    const startTime = performance.now();
    
    this.dotsGroup.innerHTML = '';
    this.bgDotsGroup.innerHTML = '';
    
    const { data, width, height } = this.imageData;
    const mainFragment = document.createDocumentFragment();
    const bgFragment = document.createDocumentFragment();
    let mainCount = 0;
    let bgCount = 0;
    
    // Background dots
    for (let y = 0; y < height; y += this.bgDotGap) {
      for (let x = 0; x < width; x += this.bgDotGap) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        
        if (alpha > 80 && alpha <= 200) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x);
          circle.setAttribute('cy', y);
          circle.setAttribute('r', this.bgDotSize);
          circle.setAttribute('fill', `rgba(${data[index]},${data[index + 1]},${data[index + 2]},${alpha / 255})`);
          bgFragment.appendChild(circle);
          bgCount++;
        }
      }
    }
    
    // Main dots with edge detection
    const checkRadius = Math.max(2, Math.floor(this.dotGap / 2));
    for (let y = 0; y < height; y += this.dotGap) {
      for (let x = 0; x < width; x += this.dotGap) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        
        if (alpha > 200) {
          const isEdge = this.isEdge(x, y, width, height, data, checkRadius);
          const radius = isEdge ? this.dotSize * this.edgeDotSizeMultiplier : this.dotSize;
          
          // Check if dot is in a red country region
          const isRedCountry = this.isInRedCountry(x, y);
          const color = isRedCountry ? 'rgb(255, 0, 0)' : `rgb(${data[index]},${data[index + 1]},${data[index + 2]})`;
          
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x);
          circle.setAttribute('cy', y);
          circle.setAttribute('r', radius);
          circle.setAttribute('fill', color);
          mainFragment.appendChild(circle);
          mainCount++;
        }
      }
    }
    
    this.bgDotsGroup.appendChild(bgFragment);
    this.dotsGroup.appendChild(mainFragment);
    
    const renderTime = (performance.now() - startTime).toFixed(2);
    this.cpuUsage = Math.min(100, (renderTime / 16.67) * 100);
    this.updatePerformanceDisplay(renderTime, mainCount + bgCount);
  }
  
  isEdge(x, y, width, height, data, checkRadius) {
    for (let dy = -checkRadius; dy <= checkRadius; dy += checkRadius) {
      for (let dx = -checkRadius; dx <= checkRadius; dx += checkRadius) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (data[(ny * width + nx) * 4 + 3] < 200) return true;
        }
      }
    }
    return false;
  }
  
  isInRedCountry(x, y) {
    for (const country in this.redCountries) {
      const [xMin, xMax, yMin, yMax] = this.redCountries[country];
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        return true;
      }
    }
    return false;
  }
  
  setupPerformanceMonitor() {
    const monitor = document.createElement('div');
    monitor.className = 'performance-monitor';
    monitor.innerHTML = `
      <h4>Performance Monitor</h4>
      <div class="perf-item">
        <span class="perf-label">Render Time:</span>
        <span class="perf-value" id="render-time">-</span>
      </div>
      <div class="perf-item">
        <span class="perf-label">CPU Usage:</span>
        <span class="perf-value" id="cpu-usage">-</span>
      </div>
      <div class="perf-item">
        <span class="perf-label">Total Dots:</span>
        <span class="perf-value" id="total-dots">-</span>
      </div>
      <div class="perf-item">
        <span class="perf-label">FPS:</span>
        <span class="perf-value" id="fps-counter">60</span>
      </div>
    `;
    
    const controlsContainer = document.querySelector('.map-controls');
    if (controlsContainer) controlsContainer.appendChild(monitor);
    
    this.startFPSMonitoring();
  }
  
  startFPSMonitoring() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measure = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        const fpsEl = document.getElementById('fps-counter');
        if (fpsEl) {
          fpsEl.textContent = fps;
          fpsEl.style.color = fps < 30 ? '#e74c3c' : fps < 50 ? '#f39c12' : '#27ae60';
        }
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measure);
    };
    measure();
  }
  
  updatePerformanceDisplay(renderTime, totalDots) {
    const renderTimeEl = document.getElementById('render-time');
    const cpuUsageEl = document.getElementById('cpu-usage');
    const totalDotsEl = document.getElementById('total-dots');
    
    if (renderTimeEl) {
      renderTimeEl.textContent = `${renderTime}ms`;
      renderTimeEl.style.color = renderTime < 50 ? '#27ae60' : renderTime < 200 ? '#f39c12' : '#e74c3c';
    }
    
    if (cpuUsageEl) {
      cpuUsageEl.textContent = `${this.cpuUsage.toFixed(1)}%`;
      cpuUsageEl.style.color = this.cpuUsage < 30 ? '#27ae60' : this.cpuUsage < 70 ? '#f39c12' : '#e74c3c';
    }
    
    if (totalDotsEl) totalDotsEl.textContent = totalDots.toLocaleString();
  }
  
  setupControls() {
    const controls = {
      size: document.getElementById('dot-size'),
      gap: document.getElementById('dot-gap'),
      edge: document.getElementById('edge-size'),
      sizeVal: document.getElementById('size-value'),
      gapVal: document.getElementById('gap-value'),
      edgeVal: document.getElementById('edge-size-value'),
      reset: document.getElementById('reset-btn')
    };
    
    if (!controls.size || !controls.gap) return;
    
    controls.size.addEventListener('input', (e) => {
      this.dotSize = parseFloat(e.target.value);
      controls.sizeVal.textContent = this.dotSize;
      this.createDots();
    });
    
    controls.gap.addEventListener('input', (e) => {
      this.dotGap = parseFloat(e.target.value);
      controls.gapVal.textContent = this.dotGap;
      this.createDots();
    });
    
    if (controls.edge) {
      controls.edge.addEventListener('input', (e) => {
        this.edgeDotSizeMultiplier = parseFloat(e.target.value);
        controls.edgeVal.textContent = `${Math.round(this.edgeDotSizeMultiplier * 100)}%`;
        this.createDots();
      });
    }
    
    if (controls.reset) {
      controls.reset.addEventListener('click', () => {
        this.dotSize = this.defaultDotSize;
        this.dotGap = this.defaultDotGap;
        this.edgeDotSizeMultiplier = 0.75;
        
        controls.size.value = this.defaultDotSize;
        controls.gap.value = this.defaultDotGap;
        controls.sizeVal.textContent = this.defaultDotSize;
        controls.gapVal.textContent = this.defaultDotGap;
        
        if (controls.edge) {
          controls.edge.value = 0.75;
          controls.edgeVal.textContent = '75%';
        }
        
        this.createDots();
      });
    }
  }
}

// Initialize
new MapDotsImage();
