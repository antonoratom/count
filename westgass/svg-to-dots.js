// // ============================================
// // SVG Path to Filled Dots Converter
// // ============================================

// gsap.registerPlugin(ScrollTrigger);

// gsap.to("[first-project]", {
//     opacity: 0,
//     scale: 0.85,
//     scrollTrigger: {
//         trigger: "[projects-bl]",
//         start: "top 10%",
//         scrub: true
//     }
// });

// // ⚙️ CONFIGURATION - Adjust these values
// const CONFIG = {
//   dotSize: 1.25,             // ← Dot radius (1, 1.5, 2, 2.5, 3, etc.)
//   gap: 4.5,                  // ← Space between dots (2, 5, 10, 15, etc.)
//   colorTop: '#49C4D5',       // ← Top gradient color
//   colorBottom: '#BAE6EF',    // ← Bottom gradient color
//   opacity: 0.6               // ← Dot opacity (0.0 to 1.0)
// };

// // Interpolate between two colors based on position (0 to 1)
// function interpolateColor(color1, color2, factor) {
//   const c1 = parseInt(color1.slice(1), 16);
//   const c2 = parseInt(color2.slice(1), 16);
  
//   const r1 = (c1 >> 16) & 0xff;
//   const g1 = (c1 >> 8) & 0xff;
//   const b1 = c1 & 0xff;
  
//   const r2 = (c2 >> 16) & 0xff;
//   const g2 = (c2 >> 8) & 0xff;
//   const b2 = c2 & 0xff;
  
//   const r = Math.round(r1 + (r2 - r1) * factor);
//   const g = Math.round(g1 + (g2 - g1) * factor);
//   const b = Math.round(b1 + (b2 - b1) * factor);
  
//   return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
// }

// function convertToDotsPattern() {
//   const svgElements = document.querySelectorAll('svg[continent-svg]');
//   console.log(`Found ${svgElements.length} SVG(s) with [continent-svg]`);
  
//   let totalConverted = 0;
  
//   svgElements.forEach((svg, index) => {
//     const paths = svg.querySelectorAll('path');
//     console.log(`SVG ${index + 1}: Found ${paths.length} path(s)`);
    
//     if (paths.length === 0) return;
    
//     // Get SVG viewBox or dimensions for gradient calculation
//     const viewBox = svg.viewBox.baseVal;
//     const svgHeight = viewBox.height || parseFloat(svg.getAttribute('height')) || svg.getBoundingClientRect().height;
//     const svgTop = viewBox.y || 0;
    
//     const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//     dotsGroup.setAttribute('class', 'dots-pattern');
    
//     paths.forEach(path => {
//       const bbox = path.getBBox();
//       const svgPoint = svg.createSVGPoint();
      
//       for (let y = bbox.y; y < bbox.y + bbox.height; y += CONFIG.gap) {
//         for (let x = bbox.x; x < bbox.x + bbox.width; x += CONFIG.gap) {
//           svgPoint.x = x;
//           svgPoint.y = y;
          
//           if (path.isPointInFill(svgPoint)) {
//             // Calculate gradient position (0 = top, 1 = bottom)
//             const gradientPos = (y - svgTop) / svgHeight;
//             const color = interpolateColor(CONFIG.colorTop, CONFIG.colorBottom, gradientPos);
            
//             const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//             dot.setAttribute('cx', x);
//             dot.setAttribute('cy', y);
//             dot.setAttribute('r', CONFIG.dotSize);
//             dot.setAttribute('fill', color);
//             dot.setAttribute('opacity', CONFIG.opacity);
//             dotsGroup.appendChild(dot);
//           }
//         }
//       }
//     });
    
//     paths.forEach(p => p.remove());
//     svg.appendChild(dotsGroup);
//     totalConverted++;
//   });
  
//   console.log(`✓ Converted ${totalConverted} SVG(s) to dots`);
// }

// // Run when DOM is ready
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', convertToDotsPattern);
// } else {
//   convertToDotsPattern();
// }
