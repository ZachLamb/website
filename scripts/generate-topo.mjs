// Generates the topographic artwork in public/topo/.
//
//   node scripts/generate-topo.mjs
//
// The contour lines are real: each file is a height field (a few peaks plus
// low-frequency noise) traced with marching squares, so the lines nest, never
// cross, and bunch up where the terrain is steep, the way they do on a survey
// map. Output is deterministic (seeded), so re-running produces identical
// files unless the terrain below is edited.
//
// The hero map's terrain is the source of truth for lib/trail-route.ts: the
// summit, lake and trailhead there sit on the features defined here.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'topo');
mkdirSync(outDir, { recursive: true });

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sum of sinusoids with whole wave numbers: periodic over w x h, so it tiles. */
function periodicNoise(rand, w, h, maxK, count) {
  const waves = Array.from({ length: count }, () => {
    const kx = Math.round((rand() * 2 - 1) * maxK);
    const ky = Math.round((rand() * 2 - 1) * maxK);
    const k = Math.hypot(kx, ky) || 1;
    return { kx, ky, phase: rand() * Math.PI * 2, amp: 1 / k };
  });
  const total = waves.reduce((sum, wv) => sum + wv.amp, 0);
  return (x, y) =>
    waves.reduce(
      (sum, wv) =>
        sum + wv.amp * Math.sin(2 * Math.PI * ((wv.kx * x) / w + (wv.ky * y) / h) + wv.phase),
      0,
    ) / total;
}

/** Marching squares: returns polylines (arrays of [x, y]) for one level. */
function traceLevel(field, cols, rows, cell, level, wrap) {
  const segs = [];
  const lerp = (a, b) => (level - a) / (b - a);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const i1 = wrap ? (i + 1) % cols : i + 1;
      const j1 = wrap ? (j + 1) % rows : j + 1;
      const a = field[j][i];
      const b = field[j][i1];
      const c = field[j1][i1];
      const d = field[j1][i];
      const x = i * cell;
      const y = j * cell;
      const top = () => [x + lerp(a, b) * cell, y];
      const right = () => [x + cell, y + lerp(b, c) * cell];
      const bottom = () => [x + lerp(d, c) * cell, y + cell];
      const left = () => [x, y + lerp(a, d) * cell];
      const idx =
        (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      switch (idx) {
        case 1:
        case 14:
          segs.push([left(), bottom()]);
          break;
        case 2:
        case 13:
          segs.push([bottom(), right()]);
          break;
        case 3:
        case 12:
          segs.push([left(), right()]);
          break;
        case 4:
        case 11:
          segs.push([top(), right()]);
          break;
        case 6:
        case 9:
          segs.push([top(), bottom()]);
          break;
        case 7:
        case 8:
          segs.push([left(), top()]);
          break;
        case 5:
          segs.push([left(), top()], [bottom(), right()]);
          break;
        case 10:
          segs.push([left(), bottom()], [top(), right()]);
          break;
        default:
          break;
      }
    }
  }
  // Chain segments that share an endpoint into polylines.
  const key = (p) => `${Math.round(p[0] * 100)},${Math.round(p[1] * 100)}`;
  const ends = new Map();
  segs.forEach((s, n) => {
    for (const p of s) {
      const k = key(p);
      if (!ends.has(k)) ends.set(k, []);
      ends.get(k).push(n);
    }
  });
  const used = new Array(segs.length).fill(false);
  const lines = [];
  const extend = (line, atEnd) => {
    for (;;) {
      const tip = atEnd ? line[line.length - 1] : line[0];
      const next = (ends.get(key(tip)) ?? []).find((n) => !used[n]);
      if (next === undefined) return;
      used[next] = true;
      const [p, q] = segs[next];
      const other = key(p) === key(tip) ? q : p;
      if (atEnd) line.push(other);
      else line.unshift(other);
    }
  };
  segs.forEach((s, n) => {
    if (used[n]) return;
    used[n] = true;
    const line = [s[0], s[1]];
    extend(line, true);
    extend(line, false);
    lines.push(line);
  });
  return lines;
}

/** Smooth path through segment midpoints (quadratic), 1 decimal place. */
function toPath(line) {
  const f = (n) => String(Math.round(n * 10) / 10);
  const closed =
    line.length > 3 &&
    Math.abs(line[0][0] - line[line.length - 1][0]) < 0.01 &&
    Math.abs(line[0][1] - line[line.length - 1][1]) < 0.01;
  const pts = closed ? line.slice(0, -1) : line;
  if (pts.length < 3) return `M${f(pts[0][0])} ${f(pts[0][1])}L${f(pts[1][0])} ${f(pts[1][1])}`;
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = '';
  if (closed) {
    const start = mid(pts[pts.length - 1], pts[0]);
    d = `M${f(start[0])} ${f(start[1])}`;
    for (let i = 0; i < pts.length; i++) {
      const m = mid(pts[i], pts[(i + 1) % pts.length]);
      d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`;
    }
    return `${d}Z`;
  }
  d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const m = mid(pts[i], pts[i + 1]);
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`;
  }
  const last = pts[pts.length - 1];
  return `${d}L${f(last[0])} ${f(last[1])}`;
}

function sample(heightAt, w, h, cell, wrap) {
  const cols = Math.round(w / cell);
  const rows = Math.round(h / cell);
  const field = [];
  for (let j = 0; j <= (wrap ? rows - 1 : rows); j++) {
    const row = [];
    for (let i = 0; i <= (wrap ? cols - 1 : cols); i++) row.push(heightAt(i * cell, j * cell));
    field.push(row);
  }
  return { field, cols, rows };
}

/* ------------------------------------------------------------------ */
/* Hero map: 800 x 600                                                  */
/* ------------------------------------------------------------------ */

const W = 800;
const H = 600;
const peaks = [
  // [x, y, height, spreadX, spreadY]
  [612, 138, 1.0, 150, 120], // the summit
  [520, 300, 0.42, 120, 90], // its south shoulder
  [215, 150, 0.62, 120, 95], // the west peak
  [395, 215, 0.3, 90, 70], // the saddle between them
  [120, 420, 0.2, 110, 90], // foothill above the trailhead
  [690, 470, 0.32, 120, 100], // east foothill
  [318, 452, -0.3, 62, 44], // the lake basin
];
const heroRand = mulberry32(7);
const heroNoise = periodicNoise(heroRand, W * 1.6, H * 1.6, 5, 14);
const heroHeight = (x, y) =>
  0.12 +
  peaks.reduce(
    (sum, [px, py, ht, sx, sy]) =>
      sum + ht * Math.exp(-(((x - px) / sx) ** 2 + ((y - py) / sy) ** 2)),
    0,
  ) +
  0.075 * heroNoise(x, y);

{
  const cell = 10;
  const { field, cols, rows } = sample(heroHeight, W, H, cell, false);
  const minor = [];
  const index = [];
  const levels = 15;
  for (let n = 0; n < levels; n++) {
    const level = 0.1 + n * 0.068;
    const paths = traceLevel(field, cols, rows, cell, level, false)
      .filter((l) => l.length > 4)
      .map(toPath);
    (n % 4 === 2 ? index : minor).push(...paths);
  }
  // The lake is the basin's own waterline: the contour just above its floor.
  const lake = traceLevel(field, cols, rows, cell, 0.035, false)
    .filter((l) => l.length > 6)
    .filter((l) => Math.hypot(l[0][0] - 318, l[0][1] - 452) < 90)
    .map(toPath);
  if (lake.length !== 1) throw new Error(`expected one lake outline, got ${lake.length}`);

  const grid = [];
  for (let x = 200; x < W; x += 200) grid.push(`M${x} 0V${H}`);
  for (let y = 200; y < H; y += 200) grid.push(`M0 ${y}H${W}`);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="a" cx="612" cy="138" r="210" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f6f1e4"/><stop offset=".55" stop-color="#f6f1e4" stop-opacity=".9"/><stop offset="1" stop-color="#f6f1e4" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx="215" cy="150" r="140" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f6f1e4"/><stop offset=".5" stop-color="#f6f1e4" stop-opacity=".85"/><stop offset="1" stop-color="#f6f1e4" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#dde6c8"/>
<rect width="${W}" height="${H}" fill="url(#a)"/>
<rect width="${W}" height="${H}" fill="url(#b)"/>
<path d="${grid.join('')}" fill="none" stroke="#2f6f8f" stroke-opacity=".16" stroke-width=".6"/>
<path d="${minor.join('')}" fill="none" stroke="#a8743a" stroke-opacity=".5" stroke-width=".7"/>
<path d="${index.join('')}" fill="none" stroke="#a8743a" stroke-opacity=".8" stroke-width="1.3"/>
<path d="M300 482C292 512 250 530 236 560S214 590 206 600" fill="none" stroke="#2f6f8f" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/>
<path d="${lake[0]}" fill="#c3dbe3" stroke="#2f6f8f" stroke-width="1.1"/>
</svg>
`;
  writeFileSync(join(outDir, 'hero-map.svg'), svg);
  console.log('hero-map.svg', (svg.length / 1024).toFixed(1), 'KB');
}

/* ------------------------------------------------------------------ */
/* Seamless contour tile: 480 x 480, one per surface                    */
/* ------------------------------------------------------------------ */

{
  const size = 480;
  const cell = 12;
  const rand = mulberry32(23);
  const noise = periodicNoise(rand, size, size, 2, 9);
  const { field, cols, rows } = sample(noise, size, size, cell, true);
  const paths = [];
  for (const level of [-0.42, -0.26, -0.1, 0.06, 0.22, 0.38]) {
    paths.push(
      ...traceLevel(field, cols, rows, cell, level, true)
        .filter((l) => l.length > 3)
        .map(toPath),
    );
  }
  const tile = (stroke, opacity) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><path d="${paths.join('')}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="1"/></svg>\n`;
  const paper = tile('#a8743a', '.17');
  const night = tile('#f4efe2', '.07');
  writeFileSync(join(outDir, 'contours-paper.svg'), paper);
  writeFileSync(join(outDir, 'contours-night.svg'), night);
  console.log('contours-*.svg', (paper.length / 1024).toFixed(1), 'KB each');
}
