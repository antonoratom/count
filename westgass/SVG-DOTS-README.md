# SVG Path to Dots Converter

Minimalistic script that converts SVG `<path>` elements to dotted outlines. Perfect for continent shapes, maps, and vector graphics.

## 📦 Files

- `svg-to-dots.js` - Main script (42 lines)
- `svg-dots-example.html` - Demo/test file

## 🚀 Quick Start

### 1. Add attribute to your SVG

```html
<svg continent-svg width="800" height="600">
  <!-- Your SVG content will be replaced with dots -->
</svg>
```

### 2. Include the script

```html
<script src="svg-to-dots.js"></script>
```

That's it! The SVG will be converted to dots automatically.

## ⚙️ Configuration

Open `svg-to-dots.js` and edit the `CONFIG` object (lines 6-11):

```javascript
const CONFIG = {
  dotSize: 1.5,              // ← DOT SIZE: Radius in pixels
  gap: 20,                   // ← GAP: Space between dots in pixels
  color: '#48C4D5',          // ← COLOR: Hex, rgb, or rgba
  opacity: 0.6               // ← OPACITY: 0.0 (transparent) to 1.0 (solid)
};
```

### Examples:

**Small, Dense Dots:**
```javascript
dotSize: 1,
gap: 10,
color: '#333333',
opacity: 0.8
```

**Large, Sparse Dots:**
```javascript
dotSize: 3,
gap: 30,
color: 'rgba(75, 145, 225, 0.5)',
opacity: 1
```

**Blue Glow Effect:**
```javascript
dotSize: 2,
gap: 15,
color: '#00BFFF',
opacity: 0.7
```

## 📐 How It Works

1. Finds all SVG elements with `[continent-svg]` attribute
2. Finds all `<path>` elements inside each SVG
3. Samples points along each path at intervals defined by `gap`
4. Creates dots at sampled points
5. Removes original paths and replaces with dots
6. Logs conversion count to console

## 🎨 Use Cases

- Convert continent/map SVGs to dotted style
- Create dotted backgrounds
- Generate dot grids for any SVG shape
- Match visual style with world map dots

## 💡 Tips

- **Performance:** Lower `gap` = more dots = slower rendering
  - `gap: 10` → ~10,000 dots in 1000x1000 SVG
  - `gap: 20` → ~2,500 dots in 1000x1000 SVG
  - `gap: 30` → ~1,100 dots in 1000x1000 SVG

- **Visibility:** Adjust `dotSize` relative to `gap`
  - Good ratio: `gap / dotSize ≈ 10-15`
  - Example: `gap: 20, dotSize: 1.5` = ratio 13.3 ✓

- **Color Harmony:** Match with your world map
  - Normal dots: `#48C4D5`
  - Pulse color: `#632C8F`
  - Ripple color: `#31AABB`

## 🔧 Advanced: Selective Conversion

To convert only specific SVGs:

```javascript
// Instead of all [continent-svg] elements
const svgElements = document.querySelectorAll('svg[continent-svg]');

// Target specific IDs or classes
const svgElements = document.querySelectorAll('#europe-map, .continent-svg');
```

## 📊 File Size

- **Script:** ~1.5 KB minified
- **No dependencies**
- **Pure vanilla JavaScript**

## 🌍 Example: Webflow Integration

```html
<!-- In Webflow Custom Code (Embed) -->
<svg continent-svg width="600" height="400" id="europe"></svg>

<script>
// Paste svg-to-dots.js content here
// Or host externally and load via src
</script>
```

---

**Created to complement the world map dots visualization** 🗺️
