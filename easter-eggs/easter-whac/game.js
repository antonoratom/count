/**
 * Easter Whac-A-Mole — vanilla embed for Webflow
 * Mounts into #ewm-root
 */
const CONFIG = {
  SUPABASE_URL: 'https://zsggcbrpkgetnbleuxuq.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_jiw6fkCt2DHY-bRm27_6mA_0WjAuD2v',
  GAME_DURATION_SEC: 15,
  HOLE_COUNT: 6,
  HOLE_MIN_SIZE_PX: 120,
  HOLE_MAX_SIZE_PX: 300,
  /** If `HOLE_COUNT === 6`: two **large**, two **medium**, two **small** (shuffled). */
  HOLE_SIZE_LARGE_FRAC: 0.92,
  HOLE_SIZE_MEDIUM_FRAC: 0.55,
  HOLE_SIZE_SMALL_FRAC: 0.2,
  /** When arena width exceeds this, hole widths are multiplied by `HOLE_WIDE_SCALE`. */
  HOLE_WIDE_VIEWPORT_PX: 1680,
  HOLE_WIDE_SCALE: 1.4,
  /**
   * Narrow viewports (typ. phone): hole **width** uses mobile bounds so holes stay small on screen.
   * When `arenaEl.clientWidth <= HOLE_MOBILE_BREAKPOINT_PX`, use `HOLE_*_MOBILE_*` instead of min/max above.
   * Set breakpoint `0` to always use desktop bounds; omit mobile keys if unused.
   */
  HOLE_MOBILE_BREAKPOINT_PX: 640,
  HOLE_MIN_SIZE_PX_MOBILE: 64,
  HOLE_MAX_SIZE_PX_MOBILE: 140,
  /**
   * Hole **placement box** (bounds for layout + characters);
   * height = width * (HOLE_ASPECT_HEIGHT / HOLE_ASPECT_WIDTH).
   */
  HOLE_ASPECT_WIDTH: 1,
  HOLE_ASPECT_HEIGHT: 1.1,
  /** White **oval ring** on screen: % of hole box width / height (see `game.css` vars). */
  HOLE_OVAL_WIDTH_PCT: 92,
  HOLE_OVAL_HEIGHT_PCT: 18,
  HOLE_OVAL_BORDER_PX: 1,
  /** Minimum gap (px) between hole bounding boxes; overlap test uses half on each side. */
  HOLE_LAYOUT_GAP_PX: 14,
  /** SVG/Lottie width as % of hole box (placeholders ignore this). */
  CHARACTER_WIDTH_PCT: 72,
  /**
   * Clip characters with SVG `#ewm-emerge-clip` (curved bottom = into the hole).
   * Set `false` to add `ewm-character-clip-off` on `#ewm-root` (no clip).
   */
  USE_CHARACTER_EMERGE_CLIP: true,
  /**
   * Clip path is drawn in **design** pixel space `EMERGE_CLIP_DESIGN_W` × `EMERGE_CLIP_DESIGN_H`
   * (same as your Figma frame / SVG viewBox). It is scaled into `objectBoundingBox` 0–1 at runtime.
   * When you paste a new `d`, set W/H to that artboard size so proportions stay correct.
   */
  EMERGE_CLIP_DESIGN_W: 145,
  EMERGE_CLIP_DESIGN_H: 159,
  EMERGE_CLIP_PATH_D:
    'M72.5 0C112.349 0 144.687 7.09496 144.996 15.873H145V142.873H144.996C144.998 142.915 145 142.958 145 143C145 151.837 112.541 159 72.5 159C32.4594 159 0 151.837 0 143C0 142.958 0.00241605 142.915 0.00390625 142.873H0V15.873H0.00390625C0.313164 7.09496 32.6514 0 72.5 0Z',
  ARENA_HEIGHT_PX: 560,
  /** Max arena height as a fraction of viewport height; must match `.ewm-arena { max-height: …vh }` in game.css. */
  ARENA_MAX_HEIGHT_VH: 0.75,
  /**
   * ### Spawn & visibility tuning (each hole runs its own timer)
   *
   * **Fewer spawns (less busy)** → raise **`SPAWN_INTERVAL_MS`** a lot (e.g. 900 → 1400–2000).
   * Per-hole interval is roughly `SPAWN_INTERVAL_MS ± SPAWN_JITTER_MS` (capped ≥120 ms in code).
   * Smaller **`SPAWN_JITTER_MS`** = more regular rhythm; larger = more random gaps.
   *
   * **Stay visible longer before they duck away** → raise **`PEEP_MIN_MS`** and **`PEEP_MAX_MS`**
   * (random pick each time). Example: 600–1400 → 1200–2500. Wider range = more variety in how long they peep.
   *
   * **Round length only** → **`GAME_DURATION_SEC`** (does not change spawn frequency or peep time).
   */
  /** Ms between spawn attempts for *this* hole (`± SPAWN_JITTER_MS`). ↑ = fewer spawns. */
  SPAWN_INTERVAL_MS: 1560,
  /** Random offset added to `SPAWN_INTERVAL_MS` (−jitter … +jitter). */
  SPAWN_JITTER_MS: 780,
  /** Auto-retreat after this many ms up (minimum). ↑ = stays longer if not hit. */
  PEEP_MIN_MS: 500,
  /** Auto-retreat after this many ms up (maximum). ↑ = stays longer if not hit. */
  PEEP_MAX_MS: 3800,
  BUNNY_CHANCE: 0.3,
  /** Max rabbits up at once (each hole spawns independently; extra bunny rolls become eggs). */
  MAX_BUNNIES_VISIBLE: 2,
  LEADERBOARD_SIZE: 5,
  /** Custom medal art (paths relative to `game.js` / `ASSET_BASE`). */
  LEADERBOARD_MEDAL_GOLD_SVG: 'assets/medal-gold.svg',
  LEADERBOARD_MEDAL_SILVER_SVG: 'assets/medal-silver.svg',
  LEADERBOARD_MEDAL_BRONZE_SVG: 'assets/medal-bronze.svg',
  LOTTIE_CDN_URL:
    'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js',
  STORAGE_KEY: 'ewm_leaderboard',
  /** Optional base for assets (same folder as game.js on CDN). Empty = derive from script URL. */
  ASSET_BASE: '',
  /** `true` = grey Egg/Rabbit blocks; `false` = use `ASSETS` (svg / lottie). */
  USE_PLACEHOLDER_CHARACTERS: false,

  /**
   * **Styling / QA only** — set to a screen id to open it on load (skip normal flow). Use `null` in production.
   * `'start' | 'game' | 'name' | 'leaderboard' | 'leaderboard-no-qualify'`
   */
  DEBUG_START_SCREEN: 'null',
  /** Sample score for `name`, `leaderboard`, `leaderboard-no-qualify`, and optional `game` HUD. */
  DEBUG_SAMPLE_SCORE: 17,
  /** When DEBUG_START_SCREEN is `'game'`: fake timer (ms left). Example 13250 → `00:13:25`. */
  DEBUG_GAME_REMAIN_MS: 13250,
};

function applyHostSupabaseOverrides() {
  if (typeof window === 'undefined') return;
  const ext = window.__EWM_SUPABASE__;
  if (!ext || typeof ext !== 'object') return;
  if (typeof ext.url === 'string' && ext.url.trim()) {
    CONFIG.SUPABASE_URL = ext.url.trim();
  }
  if (typeof ext.anonKey === 'string' && ext.anonKey.trim()) {
    CONFIG.SUPABASE_ANON_KEY = ext.anonKey.trim();
  }
}

const ASSETS = {
  bunnies: [
    { id: 'bunny-1', type: 'svg', src: 'assets/bunny-1.svg' },
    { id: 'bunny-2', type: 'svg', src: 'assets/bunny-2.svg' },
  ],
  eggs: [
    { id: 'egg-1', type: 'svg', src: 'assets/egg-1.svg' },
    { id: 'egg-2', type: 'svg', src: 'assets/egg-2.svg' },
    { id: 'egg-3', type: 'svg', src: 'assets/egg-3.svg' },
    { id: 'egg-4', type: 'svg', src: 'assets/egg-4.svg' },
    { id: 'egg-5', type: 'svg', src: 'assets/egg-5.svg' },
  ],
};

let score = 0;
let timeLeft = CONFIG.GAME_DURATION_SEC;
let gameRunning = false;
/** requestAnimationFrame id while round countdown runs (see Figma clock 00:13:25) */
let timerInterval = null;
let gameEndAt = 0;
let lastRemainMs = 0;
/** @type {number[]} */
let spawnIntervals = [];
/** Bunny characters currently in play (counts toward `MAX_BUNNIES_VISIBLE`; decremented on retreat/hit/failed load). */
let bunniesInPlay = 0;
let lottieLoaded = false;

const TRANSITION_MS = 380;

function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function holeWidthScaleForArena(arenaW) {
  return arenaW > CONFIG.HOLE_WIDE_VIEWPORT_PX ? CONFIG.HOLE_WIDE_SCALE : 1;
}

/** @returns {{ min: number, max: number }} */
function effectiveHoleBounds(arenaW) {
  const bp = CONFIG.HOLE_MOBILE_BREAKPOINT_PX;
  if (
    bp != null &&
    bp > 0 &&
    arenaW > 0 &&
    arenaW <= bp &&
    CONFIG.HOLE_MIN_SIZE_PX_MOBILE != null &&
    CONFIG.HOLE_MAX_SIZE_PX_MOBILE != null
  ) {
    return {
      min: CONFIG.HOLE_MIN_SIZE_PX_MOBILE,
      max: CONFIG.HOLE_MAX_SIZE_PX_MOBILE,
    };
  }
  return {
    min: CONFIG.HOLE_MIN_SIZE_PX,
    max: CONFIG.HOLE_MAX_SIZE_PX,
  };
}

/**
 * Six holes: two large, two medium, two small (order shuffled). Other `HOLE_COUNT` → random widths.
 * @returns {number[]}
 */
function buildShuffledHoleWidths(arenaW) {
  const bounds = effectiveHoleBounds(arenaW);
  const n = CONFIG.HOLE_COUNT;
  if (n !== 6) {
    console.warn(
      '[ewm] HOLE_COUNT is',
      n,
      '(expected 6 for 2× large + 2× medium + 2× small); using random widths.'
    );
    return Array.from({ length: n }, () =>
      randInt(bounds.min, bounds.max)
    );
  }
  const mult = holeWidthScaleForArena(arenaW);
  const span = bounds.max - bounds.min;
  const base = (frac) =>
    Math.round((bounds.min + span * frac) * mult);
  const wLarge = base(CONFIG.HOLE_SIZE_LARGE_FRAC);
  const wMed = base(CONFIG.HOLE_SIZE_MEDIUM_FRAC);
  const wSmall = base(CONFIG.HOLE_SIZE_SMALL_FRAC);
  const cap = Math.max(bounds.min, Math.floor(arenaW * 0.42));
  const clamp = (w) =>
    Math.min(Math.max(w, bounds.min), Math.min(bounds.max, cap));
  return shuffleArray([
    clamp(wLarge),
    clamp(wLarge),
    clamp(wMed),
    clamp(wMed),
    clamp(wSmall),
    clamp(wSmall),
  ]);
}


/**
 * Cap each hole width so its box fits in the arena (2D placement can use space more
 * efficiently than forcing a full row/column of summed widths).
 * @param {number[]} widths
 * @param {number} arenaW
 * @param {number} arenaH
 * @returns {number[]}
 */
function clampHoleWidthsToViewport(widths, arenaW, arenaH) {
  if (!widths.length || arenaW <= 0 || arenaH <= 0) return widths;
  const aspect = CONFIG.HOLE_ASPECT_HEIGHT / CONFIG.HOLE_ASPECT_WIDTH;
  const maxW = Math.min(
    Math.max(4, arenaW),
    Math.max(4, arenaH / aspect)
  );
  return widths.map((w) =>
    Math.max(4, Math.min(Math.round(w), Math.floor(maxW)))
  );
}

function getScriptBaseUrl() {
  const cur =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : Array.from(document.getElementsByTagName('script'))
          .map((s) => s.src)
          .filter((src) => src && /\/game\.js(\?|$)/.test(src))
          .pop();
  if (!cur) return '';
  return new URL('.', cur).href;
}

function resolveAssetSrc(relativePath) {
  const base = CONFIG.ASSET_BASE || getScriptBaseUrl();
  if (!base) return relativePath;
  try {
    return new URL(relativePath, base).href;
  } catch {
    return relativePath;
  }
}

/** Any `DEBUG_START_SCREEN` value → layout QA mode: inline SVG in DOM (clipPath), static demo characters in arena. */
function isDebugEmbed() {
  const s = CONFIG.DEBUG_START_SCREEN;
  return s != null && String(s).trim() !== '';
}

/**
 * Fetch an SVG file and return an imported `<svg>` node for the document.
 * @param {string} relativeOrAbsoluteSrc — path as in `ASSETS` (.e.g. `assets/egg-1.svg`)
 */
function importSvgElementFromText(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const el = doc.querySelector('svg');
  if (!el) throw new Error('No <svg> root');
  return document.importNode(el, true);
}

async function fetchAndImportSvg(relativeOrAbsoluteSrc) {
  const url = resolveAssetSrc(relativeOrAbsoluteSrc);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SVG ${res.status}`);
  const text = await res.text();
  const svg = importSvgElementFromText(text);
  svg.classList.add('ewm-character__svg-root');
  svg.setAttribute('focusable', 'false');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  return svg;
}

/** Debug: swap `<img class="ewm-leaderboard__medal">` for inline `<svg>` so DevTools can edit defs. */
async function replaceLeaderboardMedalImgsWithInlineSvg(root) {
  if (!isDebugEmbed() || !root) return;
  const imgs = root.querySelectorAll('img.ewm-leaderboard__medal');
  for (const img of imgs) {
    try {
      const res = await fetch(img.currentSrc || img.src);
      if (!res.ok) continue;
      const text = await res.text();
      const svg = importSvgElementFromText(text);
      svg.classList.add('ewm-leaderboard__medal');
      svg.setAttribute('focusable', 'false');
      img.replaceWith(svg);
    } catch (e) {
      console.warn('[ewm] leaderboard medal inline SVG failed', e);
    }
  }
}

/**
 * @param {HTMLElement} charEl
 * @param {{ type: string, src: string }} asset
 * @returns {Promise<boolean>} true if inline SVG was appended
 */
async function appendInlineSvgAsset(charEl, asset) {
  if (asset.type !== 'svg') return false;
  try {
    const svg = await fetchAndImportSvg(asset.src);
    charEl.appendChild(svg);
    return true;
  } catch (e) {
    console.warn('[ewm] inline SVG failed; using <img>', asset.src, e);
    return false;
  }
}

function needsLottie() {
  const all = [...ASSETS.bunnies, ...ASSETS.eggs];
  return all.some((a) => a.type === 'lottie');
}

function ensureLottie() {
  if (!needsLottie()) return Promise.resolve();
  if (window.bodymovin || window.lottie) {
    lottieLoaded = true;
    return Promise.resolve();
  }
  if (lottieLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = CONFIG.LOTTIE_CDN_URL;
    s.async = true;
    s.onload = () => {
      lottieLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('Lottie load failed'));
    document.head.appendChild(s);
  });
}

function supabaseHeaders() {
  return {
    apikey: CONFIG.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

function readLocalLeaderboard() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocalLeaderboard(rows) {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

async function fetchLeaderboard() {
  const limit = CONFIG.LEADERBOARD_SIZE;
  if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
    const url = new URL('/rest/v1/leaderboard', CONFIG.SUPABASE_URL);
    url.searchParams.set('select', 'name,score');
    url.searchParams.set('order', 'score.desc');
    url.searchParams.set('limit', String(limit));
    try {
      const res = await fetch(url.toString(), { headers: supabaseHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) return json;
      }
    } catch {
      /* fallback */
    }
  }
  const local = readLocalLeaderboard();
  return [...local]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map((r) => ({ name: r.name, score: r.score }));
}

async function submitScore(name, scoreVal) {
  const row = { name, score: scoreVal };
  if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
    const url = new URL('/rest/v1/leaderboard', CONFIG.SUPABASE_URL);
    const res = await fetch(url.toString(), {
      method: 'POST',
      /** @type {HeadersInit} */
      headers: {
        ...supabaseHeaders(),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
  }
  const local = readLocalLeaderboard();
  local.push({ ...row, created_at: new Date().toISOString() });
  writeLocalLeaderboard(local);
}

function qualifiesForLeaderboard(playerScore, board) {
  if (board.length < CONFIG.LEADERBOARD_SIZE) return true;
  const lowest = board[board.length - 1].score;
  return playerScore > lowest;
}

/**
 * @param {number[]} [widthsIn] — if omitted, uses `buildShuffledHoleWidths(arenaW)`.
 * @returns {{ x: number, y: number, width: number, height: number }[]}
 */
function generateHolePositions(arenaW, arenaH, widthsIn) {
  const gap = Math.max(8, CONFIG.HOLE_LAYOUT_GAP_PX || 24);
  const inflate = gap / 2;
  const result = [];
  const widths =
    widthsIn && widthsIn.length === CONFIG.HOLE_COUNT
      ? widthsIn
      : buildShuffledHoleWidths(arenaW);

  const fitsInArena = (x, y, w, h) =>
    x >= -0.5 &&
    y >= -0.5 &&
    x + w <= arenaW + 0.5 &&
    y + h <= arenaH + 0.5;

  const overlaps = (x, y, w, h) => {
    const L = x - inflate;
    const T = y - inflate;
    const R = x + w + inflate;
    const B = y + h + inflate;
    for (const p of result) {
      const pL = p.x - inflate;
      const pT = p.y - inflate;
      const pR = p.x + p.width + inflate;
      const pB = p.y + p.height + inflate;
      if (!(R <= pL || L >= pR || B <= pT || T >= pB)) return true;
    }
    return false;
  };

  const tryPlaceHole = (w, h) => {
    if (w > arenaW || h > arenaH) return false;
    const maxX = Math.max(0, arenaW - w);
    const maxY = Math.max(0, arenaH - h);

    for (let attempt = 0; attempt < 500; attempt++) {
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      if (!overlaps(x, y, w, h) && fitsInArena(x, y, w, h)) {
        result.push({ x, y, width: w, height: h });
        return true;
      }
    }

    const steps = 16;
    for (let gy = 0; gy < steps; gy++) {
      for (let gx = 0; gx < steps; gx++) {
        const x = (gx / (steps - 1 || 1)) * maxX;
        const y = (gy / (steps - 1 || 1)) * maxY;
        if (!overlaps(x, y, w, h) && fitsInArena(x, y, w, h)) {
          result.push({ x, y, width: w, height: h });
          return true;
        }
      }
    }

    const step = Math.max(4, Math.floor(gap / 3));
    for (let y = 0; y <= maxY; y += step) {
      for (let x = 0; x <= maxX; x += step) {
        if (!overlaps(x, y, w, h) && fitsInArena(x, y, w, h)) {
          result.push({ x, y, width: w, height: h });
          return true;
        }
      }
    }

    for (let y = 0; y <= maxY; y += 1) {
      for (let x = 0; x <= maxX; x += 1) {
        if (!overlaps(x, y, w, h) && fitsInArena(x, y, w, h)) {
          result.push({ x, y, width: w, height: h });
          return true;
        }
      }
    }

    return false;
  };

  for (let i = 0; i < CONFIG.HOLE_COUNT; i++) {
    const w = widths[i];
    const h = w * (CONFIG.HOLE_ASPECT_HEIGHT / CONFIG.HOLE_ASPECT_WIDTH);
    if (tryPlaceHole(w, h)) continue;

    const bottom = result.reduce((m, p) => Math.max(m, p.y + p.height), 0);
    const yStack = bottom > 0 ? bottom + gap : 0;
    if (
      !overlaps(0, yStack, w, h) &&
      fitsInArena(0, yStack, w, h)
    ) {
      result.push({ x: 0, y: yStack, width: w, height: h });
      continue;
    }

    const maxYFallback = Math.max(0, arenaH - h);
    let placedFallback = false;
    for (let y = yStack; y <= maxYFallback && !placedFallback; y += gap) {
      for (let x = 0; x <= Math.max(0, arenaW - w); x += 2) {
        if (!overlaps(x, y, w, h) && fitsInArena(x, y, w, h)) {
          result.push({ x, y, width: w, height: h });
          placedFallback = true;
          break;
        }
      }
    }
    if (!placedFallback) {
      console.warn(
        '[ewm] Hole',
        i,
        'could not be placed without overlap; arena may be too small.'
      );
    }
  }

  return result;
}

let rootEl = null;
let flowEl = null;
let gameWrapEl = null;
let hudScoreEl = null;
let hudTimerEl = null;
let arenaEl = null;

function escapeSvgAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Builds hidden defs SVG: path stays in design space; scale maps it to objectBoundingBox 0–1. */
function buildEmergeClipDefsSvg() {
  const w = CONFIG.EMERGE_CLIP_DESIGN_W;
  const h = CONFIG.EMERGE_CLIP_DESIGN_H;
  if (!(w > 0) || !(h > 0)) {
    console.warn('[ewm] EMERGE_CLIP_DESIGN_W/H must be positive');
  }
  const sx = 1 / Math.max(w, 1e-9);
  const sy = 1 / Math.max(h, 1e-9);
  const d = CONFIG.EMERGE_CLIP_PATH_D;
  return `
    <svg class="ewm-defs" width="1" height="1" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="ewm-emerge-clip" clipPathUnits="objectBoundingBox">
          <path transform="scale(${sx},${sy})" d="${escapeSvgAttr(d)}" />
        </clipPath>
      </defs>
    </svg>
  `;
}

applyHostSupabaseOverrides();
if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
  console.info('[ewm] Supabase leaderboard enabled');
}

function mountSkeleton() {
  rootEl.innerHTML = `
    <!-- Outside .ewm-shell (overflow:hidden) so <clipPath> resolves reliably; 1×1 SVG for WebKit. -->
    ${buildEmergeClipDefsSvg()}
    <div class="ewm-shell" role="dialog" aria-modal="true" aria-label="Easter mini-game">
      <header class="ewm-header">
        <span class="ewm-header__timer" aria-live="polite"></span>
        <span class="ewm-header__score" aria-live="polite"></span>
      </header>
      <div class="ewm-body">
        <div id="ewm-flow" class="ewm-flow"></div>
        <div id="ewm-game-wrap" class="ewm-game-wrap" hidden>
          <div id="ewm-arena" class="ewm-arena"></div>
        </div>
      </div>
      <footer class="ewm-footer">
        <button type="button" class="ewm-close-trigger" id="ewm-close-btn" aria-label="Close game">
          <span class="ewm-close-trigger__icon" aria-hidden="true">×</span>
        </button>
      </footer>
    </div>
  `;
  flowEl = rootEl.querySelector('#ewm-flow');
  gameWrapEl = rootEl.querySelector('#ewm-game-wrap');
  hudTimerEl = rootEl.querySelector('.ewm-header__timer');
  hudScoreEl = rootEl.querySelector('.ewm-header__score');
  arenaEl = rootEl.querySelector('#ewm-arena');
  bindCloseButton();
  applyVisualConfig();
}

function applyVisualConfig() {
  if (!rootEl) return;
  rootEl.style.setProperty(
    '--ewm-hole-oval-width-pct',
    String(CONFIG.HOLE_OVAL_WIDTH_PCT)
  );
  rootEl.style.setProperty(
    '--ewm-hole-oval-height-pct',
    String(CONFIG.HOLE_OVAL_HEIGHT_PCT)
  );
  rootEl.style.setProperty(
    '--ewm-hole-oval-border-px',
    `${CONFIG.HOLE_OVAL_BORDER_PX}px`
  );
  rootEl.style.setProperty(
    '--ewm-character-width-pct',
    String(CONFIG.CHARACTER_WIDTH_PCT)
  );
  rootEl.classList.toggle(
    'ewm-character-clip-off',
    CONFIG.USE_CHARACTER_EMERGE_CLIP === false
  );
}

function bindCloseButton() {
  const btn = rootEl.querySelector('#ewm-close-btn');
  if (!btn || btn.dataset.ewmBound) return;
  btn.dataset.ewmBound = '1';
  btn.addEventListener('click', closeEmbed);
}

/** Hides full-screen shell. Listen: `window.addEventListener('ewm:close', …)`. Reopen from host page: `ewmReopen()` global or `document.querySelector('#ewm-root').removeAttribute('data-ewm-closed')` then trigger your open UI. */
function closeEmbed() {
  if (!rootEl) return;
  resetGame();
  rootEl.dataset.ewmClosed = 'true';
  window.dispatchEvent(new CustomEvent('ewm:close', { bubbles: true }));
}

function showFlowScreen() {
  if (flowEl) flowEl.hidden = false;
  if (gameWrapEl) gameWrapEl.hidden = true;
  if (rootEl) {
    rootEl.classList.remove('ewm-state-playing');
    rootEl.classList.add('ewm-state-menu');
  }
}

function showGameScreen() {
  if (flowEl) flowEl.hidden = true;
  if (gameWrapEl) gameWrapEl.hidden = false;
  if (rootEl) {
    rootEl.classList.remove('ewm-state-menu');
    rootEl.classList.add('ewm-state-playing');
  }
}

/** Figma: 00:15:00 → 00:13:25 (MM:SS:centiseconds-style third field) */
function formatHudClock(remainMs) {
  const rm = Math.max(0, remainMs);
  const totalCs = Math.min(9999, Math.ceil(rm / 10));
  const sec = Math.floor(totalCs / 100);
  const cs = totalCs % 100;
  return `00:${String(sec).padStart(2, '0')}:${String(cs).padStart(2, '0')}`;
}

/**
 * @param {number} [remainMs] — milliseconds left in round; omit to derive from timeLeft
 */
function updateHUD(remainMs) {
  if (hudScoreEl)
    hudScoreEl.textContent = `Eggs: ${Math.max(0, score)}`;
  if (hudTimerEl) {
    const rm =
      remainMs != null
        ? remainMs
        : gameRunning
          ? lastRemainMs
          : Math.max(0, Math.min(CONFIG.GAME_DURATION_SEC * 1000, timeLeft * 1000));
    hudTimerEl.textContent = formatHudClock(rm);
  }
}

function showStartScreen() {
  showFlowScreen();
  flowEl.innerHTML = `
    <div class="ewm-screen ewm-screen--start">
      <div class="ewm-main">
        <h2 class="ewm-main__title">Collect eggs</h2>
        <p class="ewm-main__description">
          Fill the bucket with as many eggs in ${CONFIG.GAME_DURATION_SEC} sec by hitting them. Be careful with bunnies, as they can steal your eggs.
        </p>
        <button type="button" class="ewm-main__button" id="ewm-start-btn">
          Start the game
        </button>
      </div>
    </div>
  `;
  score = 0;
  timeLeft = CONFIG.GAME_DURATION_SEC;
  lastRemainMs = CONFIG.GAME_DURATION_SEC * 1000;
  updateHUD(CONFIG.GAME_DURATION_SEC * 1000);
  flowEl.querySelector('#ewm-start-btn').addEventListener('click', startGame);
}

function clearGameTimer() {
  if (timerInterval != null) {
    cancelAnimationFrame(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  clearGameTimer();
  gameEndAt = Date.now() + CONFIG.GAME_DURATION_SEC * 1000;
  const tick = () => {
    if (!gameRunning) return;
    const remain = gameEndAt - Date.now();
    if (remain <= 0) {
      timeLeft = 0;
      lastRemainMs = 0;
      updateHUD(0);
      timerInterval = null;
      endGame();
      return;
    }
    timeLeft = Math.ceil(remain / 1000);
    lastRemainMs = remain;
    updateHUD(remain);
    timerInterval = requestAnimationFrame(tick);
  };
  timerInterval = requestAnimationFrame(tick);
}

function releaseBunnySlot(charEl) {
  if (charEl.dataset.type === 'bunny') {
    bunniesInPlay = Math.max(0, bunniesInPlay - 1);
  }
}

function retreatCharacter(charEl, holeEl) {
  if (!charEl.parentNode) return;
  releaseBunnySlot(charEl);
  const peep = charEl.querySelector('.ewm-character__peep');
  if (peep) peep.classList.remove('ewm-character--up');
  window.setTimeout(() => {
    if (charEl.parentNode) charEl.remove();
    if (holeEl) delete holeEl.dataset.occupied;
  }, TRANSITION_MS);
}

function spawnScorePop(arenaRect, clientX, clientY, delta) {
  if (!arenaEl) return;
  const pop = document.createElement('div');
  pop.className =
    'ewm-score-pop ' +
    (delta > 0 ? 'ewm-score-pop--plus' : 'ewm-score-pop--minus');
  pop.textContent = delta > 0 ? '+1' : '−1';
  const ax = clientX - arenaRect.left;
  const ay = clientY - arenaRect.top;
  pop.style.left = `${ax}px`;
  pop.style.top = `${ay}px`;
  arenaEl.appendChild(pop);
  window.setTimeout(() => pop.remove(), 900);
}

function handleHit(charEl, holeEl, type) {
  const debugStatic = charEl.classList.contains('ewm-character--debug-static');
  const allowScore =
    gameRunning || (isDebugEmbed() && debugStatic);
  if (!allowScore) return;

  const arenaRect = arenaEl.getBoundingClientRect();
  const cr = charEl.getBoundingClientRect();
  const cx = cr.left + cr.width / 2;
  const cy = cr.top + cr.height / 2;

  if (type === 'egg') {
    score += 1;
    spawnScorePop(arenaRect, cx, cy, 1);
  } else {
    score = Math.max(0, score - 1);
    spawnScorePop(arenaRect, cx, cy, -1);
  }
  updateHUD();

  if (debugStatic) {
    const peep = charEl.querySelector('.ewm-character__peep');
    if (peep) {
      const hadBob = peep.classList.contains('ewm-character__peep--bob');
      peep.classList.remove('ewm-character__peep--bob');
      peep.classList.remove('ewm-character--hit');
      void peep.offsetWidth;
      peep.classList.add('ewm-character--hit');
      window.setTimeout(() => {
        peep.classList.remove('ewm-character--hit');
        if (hadBob) peep.classList.add('ewm-character__peep--bob');
        charEl.dataset.hit = 'false';
      }, 400);
    } else {
      charEl.dataset.hit = 'false';
    }
    return;
  }

  const peepLive = charEl.querySelector('.ewm-character__peep');
  if (peepLive) {
    peepLive.classList.remove('ewm-character--up');
    peepLive.classList.add('ewm-character--hit');
  }
  releaseBunnySlot(charEl);
  window.setTimeout(() => {
    if (charEl.parentNode) charEl.remove();
    if (holeEl) delete holeEl.dataset.occupied;
  }, 400);
}

function spawnCharacter(holeEl, holeW) {
  if (!gameRunning || holeEl.dataset.occupied === 'true') return;

  let isBunny = Math.random() < CONFIG.BUNNY_CHANCE;
  if (isBunny && bunniesInPlay >= CONFIG.MAX_BUNNIES_VISIBLE) {
    isBunny = false;
  }
  if (isBunny) {
    bunniesInPlay += 1;
  }

  holeEl.dataset.occupied = 'true';

  const charEl = document.createElement('div');
  charEl.className = isBunny
    ? 'ewm-character ewm-character--rabbit'
    : 'ewm-character ewm-character--egg';
  charEl.dataset.type = isBunny ? 'bunny' : 'egg';

  const peepEl = document.createElement('div');
  peepEl.className = 'ewm-character__peep';
  charEl.appendChild(peepEl);

  let retreatTimer = null;
  const scheduleRetreat = () => {
    const peepMs = randInt(CONFIG.PEEP_MIN_MS, CONFIG.PEEP_MAX_MS);
    retreatTimer = window.setTimeout(() => {
      retreatCharacter(charEl, holeEl);
    }, peepMs);
  };

  const onInteract = (e) => {
    e.stopPropagation();
    if (!gameRunning || charEl.dataset.hit === 'true') return;
    charEl.dataset.hit = 'true';
    if (retreatTimer) {
      clearTimeout(retreatTimer);
      retreatTimer = null;
    }
    handleHit(charEl, holeEl, charEl.dataset.type);
  };

  peepEl.addEventListener('click', onInteract);

  const finishMount = () => {
    holeEl.appendChild(charEl);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        peepEl.classList.add('ewm-character--up');
      });
    });
    scheduleRetreat();
  };

  if (CONFIG.USE_PLACEHOLDER_CHARACTERS) {
    const ph = document.createElement('div');
    ph.className = 'ewm-character__placeholder';
    ph.textContent = isBunny ? 'Rabbit' : 'Egg';
    peepEl.appendChild(ph);
    finishMount();
    return;
  }

  const pool = isBunny ? ASSETS.bunnies : ASSETS.eggs;
  const asset = pool[Math.floor(Math.random() * pool.length)];

  if (asset.type === 'lottie') {
    ensureLottie()
      .then(() => {
        const container = document.createElement('div');
        container.className = 'ewm-character__lottie';
        peepEl.appendChild(container);
        const lm = window.bodymovin || window.lottie;
        if (lm && typeof lm.loadAnimation === 'function') {
          lm.loadAnimation({
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: resolveAssetSrc(asset.src),
          });
        }
        finishMount();
      })
      .catch(() => {
        if (isBunny) {
          bunniesInPlay = Math.max(0, bunniesInPlay - 1);
        }
        delete holeEl.dataset.occupied;
      });
  } else {
    const mountImg = () => {
      const img = document.createElement('img');
      img.src = resolveAssetSrc(asset.src);
      img.alt = '';
      img.draggable = false;
      peepEl.appendChild(img);
      finishMount();
    };
    if (isDebugEmbed()) {
      appendInlineSvgAsset(peepEl, asset).then((ok) => {
        if (ok) finishMount();
        else mountImg();
      });
    } else {
      mountImg();
    }
  }
}

/**
 * @param {{ withSpawns?: boolean }} [options] — `withSpawns: false` for static layout (e.g. DEBUG_START_SCREEN game).
 */
function buildArena(options = {}) {
  spawnIntervals.forEach(clearInterval);
  spawnIntervals = [];
  bunniesInPlay = 0;
  arenaEl.innerHTML = '';

  const arenaW = arenaEl.clientWidth;
  const holeBounds = effectiveHoleBounds(arenaW);
  const gap = Math.max(8, CONFIG.HOLE_LAYOUT_GAP_PX || 24);
  const aspect = CONFIG.HOLE_ASPECT_HEIGHT / CONFIG.HOLE_ASPECT_WIDTH;
  const maxHoleH = holeBounds.max * aspect;
  const minStackH =
    CONFIG.HOLE_COUNT * maxHoleH + (CONFIG.HOLE_COUNT - 1) * gap;
  const vh =
    typeof CONFIG.ARENA_MAX_HEIGHT_VH === 'number' &&
    CONFIG.ARENA_MAX_HEIGHT_VH > 0
      ? CONFIG.ARENA_MAX_HEIGHT_VH
      : 0.75;
  const arenaMaxPx =
    typeof window !== 'undefined' && window.innerHeight > 0
      ? Math.floor(window.innerHeight * vh)
      : CONFIG.ARENA_HEIGHT_PX;
  let arenaH = Math.max(
    holeBounds.min * 2,
    arenaEl.clientHeight || CONFIG.ARENA_HEIGHT_PX,
    minStackH
  );
  arenaH = Math.min(arenaH, arenaMaxPx);
  arenaEl.style.minHeight = '';

  const baseWidths = buildShuffledHoleWidths(arenaW);
  let lo = 0.1;
  let hi = 1;
  let best = { widths: [], positions: [] };
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    const widths = clampHoleWidthsToViewport(
      baseWidths.map((w) => Math.max(4, Math.round(w * mid))),
      arenaW,
      arenaH
    );
    const trial = generateHolePositions(arenaW, arenaH, widths);
    if (trial.length >= CONFIG.HOLE_COUNT) {
      best = { widths, positions: trial };
      lo = mid;
    } else {
      hi = mid;
    }
  }
  let positions = best.positions;
  if (!positions || positions.length < CONFIG.HOLE_COUNT) {
    for (let f = 0.09; f >= 0.04; f -= 0.008) {
      const widths = clampHoleWidthsToViewport(
        baseWidths.map((w) => Math.max(4, Math.round(w * f))),
        arenaW,
        arenaH
      );
      const trial = generateHolePositions(arenaW, arenaH, widths);
      if (trial.length >= CONFIG.HOLE_COUNT) {
        best = { widths, positions: trial };
        positions = trial;
        break;
      }
    }
  }
  if (!positions || positions.length < CONFIG.HOLE_COUNT) {
    const widths = clampHoleWidthsToViewport(
      baseWidths.map((w) => Math.max(4, Math.round(w * 0.06))),
      arenaW,
      arenaH
    );
    positions = generateHolePositions(arenaW, arenaH, widths);
  }

  positions.forEach((pos) => {
    const hole = document.createElement('div');
    hole.className = 'ewm-hole';
    hole.style.left = `${pos.x}px`;
    hole.style.top = `${pos.y}px`;
    hole.style.width = `${pos.width}px`;
    hole.style.height = `${pos.height}px`;

    const oval = document.createElement('div');
    oval.className = 'ewm-hole__oval';
    oval.setAttribute('aria-hidden', 'true');
    hole.appendChild(oval);
    arenaEl.appendChild(hole);

    if (options.withSpawns !== false) {
      const jitterRange = CONFIG.SPAWN_JITTER_MS;
      const base =
        CONFIG.SPAWN_INTERVAL_MS + (Math.random() * 2 - 1) * jitterRange;
      const id = window.setInterval(() => {
        if (!gameRunning) return;
        spawnCharacter(hole, pos.width);
      }, Math.max(120, base));
      spawnIntervals.push(id);
    }
  });

  if (options.withSpawns === false && isDebugEmbed()) {
    seedDebugArenaCharacters();
  }
}

/**
 * Debug game screen: one character per hole. Outer `.ewm-character--debug-static` = static clip shell;
 * inner `.ewm-character__peep` moves (bob) and receives clicks; graphic is a child of peep.
 */
function seedDebugArenaCharacters() {
  if (!arenaEl) return;
  const holes = arenaEl.querySelectorAll('.ewm-hole');
  holes.forEach((holeEl, i) => {
    const isBunny = i % 2 === 1;
    const pool = isBunny ? ASSETS.bunnies : ASSETS.eggs;
    const asset = pool[i % pool.length];

    holeEl.dataset.occupied = 'true';
    const charEl = document.createElement('div');
    charEl.className = isBunny
      ? 'ewm-character ewm-character--rabbit ewm-character--debug-static'
      : 'ewm-character ewm-character--egg ewm-character--debug-static';
    charEl.dataset.type = isBunny ? 'bunny' : 'egg';

    const peepEl = document.createElement('div');
    peepEl.className = 'ewm-character__peep';
    charEl.appendChild(peepEl);

    const onInteract = (e) => {
      e.stopPropagation();
      if (charEl.dataset.hit === 'true') return;
      charEl.dataset.hit = 'true';
      handleHit(charEl, holeEl, charEl.dataset.type);
    };
    peepEl.addEventListener('click', onInteract);

    const startBobAfterEnter = () => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        peepEl.classList.add('ewm-character__peep--bob');
      };
      const onEnter = (e) => {
        if (e.propertyName !== 'transform') return;
        peepEl.removeEventListener('transitionend', onEnter);
        finish();
      };
      peepEl.addEventListener('transitionend', onEnter);
      window.setTimeout(() => {
        peepEl.removeEventListener('transitionend', onEnter);
        finish();
      }, 500);
    };

    const showUp = () => {
      holeEl.appendChild(charEl);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          peepEl.classList.add('ewm-character--up');
          startBobAfterEnter();
        });
      });
    };

    if (CONFIG.USE_PLACEHOLDER_CHARACTERS) {
      const ph = document.createElement('div');
      ph.className = 'ewm-character__placeholder';
      ph.textContent = isBunny ? 'Rabbit' : 'Egg';
      peepEl.appendChild(ph);
      showUp();
      return;
    }

    if (asset.type === 'lottie') {
      ensureLottie()
        .then(() => {
          const container = document.createElement('div');
          container.className = 'ewm-character__lottie';
          peepEl.appendChild(container);
          const lm = window.bodymovin || window.lottie;
          if (lm && typeof lm.loadAnimation === 'function') {
            lm.loadAnimation({
              container,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: resolveAssetSrc(asset.src),
            });
          }
          showUp();
        })
        .catch(() => {
          delete holeEl.dataset.occupied;
        });
      return;
    }

    appendInlineSvgAsset(peepEl, asset).then((ok) => {
      if (!ok) {
        const img = document.createElement('img');
        img.src = resolveAssetSrc(asset.src);
        img.alt = '';
        img.draggable = false;
        peepEl.appendChild(img);
      }
      showUp();
    });
  });
}

function resetGame() {
  clearGameTimer();
  spawnIntervals.forEach(clearInterval);
  spawnIntervals = [];
  if (arenaEl) arenaEl.innerHTML = '';
  bunniesInPlay = 0;
  score = 0;
  timeLeft = CONFIG.GAME_DURATION_SEC;
  gameRunning = false;
  updateHUD(CONFIG.GAME_DURATION_SEC * 1000);
}

function startGame() {
  resetGame();
  gameRunning = true;
  rootEl.removeAttribute('data-ewm-closed');
  showGameScreen();
  lastRemainMs = CONFIG.GAME_DURATION_SEC * 1000;
  updateHUD(CONFIG.GAME_DURATION_SEC * 1000);
  requestAnimationFrame(() => {
    buildArena();
    startTimer();
  });
}

function showNamePrompt(finalScore) {
  showFlowScreen();
  score = finalScore;
  lastRemainMs = 0;
  updateHUD(0);
  const eggWord = finalScore === 1 ? 'egg' : 'eggs';
  flowEl.innerHTML = `
    <div class="ewm-screen ewm-screen--name ewm-leaderboard-entry">
      <div class="ewm-main">
        <h2 class="ewm-leaderboard-entry__title">
          You've collected<br />
          ${finalScore} ${eggWord} and got<br />
          to the leaderboard
        </h2>
        <form class="ewm-leaderboard-entry__form" id="ewm-name-form">
          <label class="ewm-leaderboard-entry__label" for="ewm-name-input">Enter your name</label>
          <input
            class="ewm-leaderboard-entry__input"
            id="ewm-name-input"
            name="name"
            type="text"
            maxlength="32"
            autocomplete="nickname"
            placeholder="Enter your name"
            required
          />
          <button type="submit" class="ewm-leaderboard-entry__button">To the leaderboard</button>
        </form>
        <p class="ewm-error" id="ewm-name-error" hidden></p>
      </div>
    </div>
  `;
  const form = flowEl.querySelector('#ewm-name-form');
  const input = flowEl.querySelector('#ewm-name-input');
  const errEl = flowEl.querySelector('#ewm-name-error');
  input.focus();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.hidden = true;
    const name = String(input.value || '').trim();
    if (!name) return;
    try {
      await submitScore(name, finalScore);
      const board = await fetchLeaderboard();
      showLeaderboard(board, name, finalScore);
    } catch (err) {
      errEl.textContent =
        err instanceof Error ? err.message : 'Could not submit. Try again.';
      errEl.hidden = false;
    }
  });
}

function showLeaderboard(board, playerName, playerScore) {
  showFlowScreen();
  if (playerScore != null) score = playerScore;
  lastRemainMs = 0;
  updateHUD(0);

  const sub =
    playerName != null && playerScore != null && String(playerName).trim()
      ? `<p class="ewm-screen__body">Nice work, <strong>${escapeHtml(String(playerName).trim())}</strong>!</p>`
      : '';

  const rows = board
    .map((row, i) => {
      const highlight =
        playerName != null &&
        row.name === playerName &&
        Number(row.score) === Number(playerScore);
      return `
      <div class="ewm-leaderboard__row${highlight ? ' ewm-leaderboard__row--highlight' : ''}">
        ${leaderboardRankHtml(i)}
        <span class="ewm-leaderboard__name">${escapeHtml(row.name)}</span>
        <span class="ewm-leaderboard__score">${escapeHtml(String(row.score))}</span>
      </div>`;
    })
    .join('');

  flowEl.innerHTML = `
    <div class="ewm-screen ewm-screen--leaderboard">
      <div class="ewm-main">
        <h2 class="ewm-screen__title">Leaderboard</h2>
        ${sub || `<p class="ewm-screen__body">Top ${CONFIG.LEADERBOARD_SIZE} egg collectors.</p>`}
        <div class="ewm-leaderboard" role="list">
          ${rows || '<p class="ewm-screen__body">No scores yet — be the first!</p>'}
        </div>
        <div class="ewm-screen__actions">
          <button type="button" class="ewm-btn ewm-button--restart" id="ewm-play-again">Restart the game</button>
        </div>
      </div>
    </div>
  `;
  flowEl.querySelector('#ewm-play-again').addEventListener('click', () => {
    resetGame();
    showStartScreen();
  });
  void replaceLeaderboardMedalImgsWithInlineSvg(flowEl);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function leaderboardMedalImgHtml(svgPath) {
  const p = svgPath == null ? '' : String(svgPath).trim();
  if (!p) return '';
  const url = resolveAssetSrc(p);
  return `<img class="ewm-leaderboard__medal" src="${escapeHtml(url)}" alt="" loading="lazy" decoding="async" />`;
}

/** Ranks 1–3: custom SVG from `CONFIG.LEADERBOARD_MEDAL_*`; 4+ no rank glyph. */
function leaderboardRankHtml(index) {
  const n = index + 1;
  if (n === 1) {
    return `<span class="ewm-leaderboard__rank">${leaderboardMedalImgHtml(CONFIG.LEADERBOARD_MEDAL_GOLD_SVG)}</span>`;
  }
  if (n === 2) {
    return `<span class="ewm-leaderboard__rank">${leaderboardMedalImgHtml(CONFIG.LEADERBOARD_MEDAL_SILVER_SVG)}</span>`;
  }
  if (n === 3) {
    return `<span class="ewm-leaderboard__rank">${leaderboardMedalImgHtml(CONFIG.LEADERBOARD_MEDAL_BRONZE_SVG)}</span>`;
  }
  return '<span class="ewm-leaderboard__rank ewm-leaderboard__rank--empty" aria-hidden="true"></span>';
}

async function endGame() {
  gameRunning = false;
  clearGameTimer();
  spawnIntervals.forEach(clearInterval);
  spawnIntervals = [];
  if (arenaEl) arenaEl.innerHTML = '';

  const finalScore = Math.max(0, score);

  let board = [];
  try {
    board = await fetchLeaderboard();
  } catch {
    board = [];
  }

  if (qualifiesForLeaderboard(finalScore, board)) {
    showNamePrompt(finalScore);
  } else {
    const summary =
      finalScore === 1
        ? `You've collected ${finalScore} egg`
        : `You've collected ${finalScore} eggs`;
    showLeaderboardScreenNoQualify(board, summary, finalScore);
  }
}

function showLeaderboardScreenNoQualify(board, summaryText, finalScore) {
  showFlowScreen();
  score = finalScore;
  lastRemainMs = 0;
  updateHUD(0);
  const rows = board
    .map((row, i) => {
      return `
      <div class="ewm-leaderboard__row">
        ${leaderboardRankHtml(i)}
        <span class="ewm-leaderboard__name">${escapeHtml(row.name)}</span>
        <span class="ewm-leaderboard__score">${escapeHtml(String(row.score))}</span>
      </div>`;
    })
    .join('');

  flowEl.innerHTML = `
    <div class="ewm-screen ewm-screen--leaderboard">
      <div class="ewm-main">
        <h2 class="ewm-screen__title">${escapeHtml(summaryText)}</h2>
        <p class="ewm-screen__body">
          That's not enough to get to the leaderboard, but you can always give it one more chance
        </p>
        <div class="ewm-leaderboard" role="list">
          ${rows || '<p class="ewm-screen__body">No scores yet.</p>'}
        </div>
        <div class="ewm-screen__actions">
          <button type="button" class="ewm-btn ewm-button--restart" id="ewm-play-again">Restart the game</button>
        </div>
      </div>
    </div>
  `;
  flowEl.querySelector('#ewm-play-again').addEventListener('click', () => {
    resetGame();
    showStartScreen();
  });
  void replaceLeaderboardMedalImgsWithInlineSvg(flowEl);
}

/** Static rows for `leaderboard` / `leaderboard-no-qualify` debug screens. */
function debugMockLeaderboard() {
  return [
    { name: 'Neil', score: 23 },
    { name: 'Merel', score: 21 },
    { name: 'Yulia', score: 18 },
    { name: 'Anton', score: 16 },
    { name: 'Alex', score: 16 },
  ];
}

/**
 * Open a single screen for CSS/layout work. Driven by `CONFIG.DEBUG_START_SCREEN`.
 * @param {string | null | undefined} screen
 */
function openDebugScreen(screen) {
  const id = (screen == null ? '' : String(screen)).trim().toLowerCase();
  rootEl.removeAttribute('data-ewm-closed');

  switch (id) {
    case 'game': {
      clearGameTimer();
      spawnIntervals.forEach(clearInterval);
      spawnIntervals = [];
      gameRunning = false;
      showGameScreen();
      score = CONFIG.DEBUG_SAMPLE_SCORE;
      timeLeft = Math.max(0, Math.ceil(CONFIG.DEBUG_GAME_REMAIN_MS / 1000));
      lastRemainMs = CONFIG.DEBUG_GAME_REMAIN_MS;
      updateHUD(lastRemainMs);
      requestAnimationFrame(() => {
        buildArena({ withSpawns: false });
      });
      break;
    }
    case 'name':
      showNamePrompt(CONFIG.DEBUG_SAMPLE_SCORE);
      break;
    case 'leaderboard':
      showLeaderboard(
        debugMockLeaderboard(),
        'Alex',
        CONFIG.DEBUG_SAMPLE_SCORE
      );
      break;
    case 'leaderboard-no-qualify': {
      const s = CONFIG.DEBUG_SAMPLE_SCORE;
      const summary =
        s === 1 ? `You've collected ${s} egg` : `You've collected ${s} eggs`;
      showLeaderboardScreenNoQualify(debugMockLeaderboard(), summary, s);
      break;
    }
    case 'start':
      showStartScreen();
      break;
    default:
      if (id) {
        console.warn('[ewm] Unknown DEBUG_START_SCREEN:', screen, '→ showing start');
      }
      showStartScreen();
  }
}

function init() {
  rootEl = document.getElementById('ewm-root');
  if (!rootEl) {
    console.warn('[ewm] #ewm-root not found');
    return;
  }
  mountSkeleton();
  window.ewmReopen = function ewmReopen() {
    rootEl.removeAttribute('data-ewm-closed');
    resetGame();
    if (CONFIG.DEBUG_START_SCREEN) {
      openDebugScreen(CONFIG.DEBUG_START_SCREEN);
    } else {
      showStartScreen();
    }
  };
  if (CONFIG.DEBUG_START_SCREEN) {
    console.info('[ewm] DEBUG_START_SCREEN =', CONFIG.DEBUG_START_SCREEN);
    openDebugScreen(CONFIG.DEBUG_START_SCREEN);
  } else {
    showStartScreen();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
