(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  function initToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    function syncIcon(theme) {
      if (sun) sun.style.display = theme === 'dark' ? 'none' : 'block';
      if (moon) moon.style.display = theme === 'dark' ? 'block' : 'none';
    }
    syncIcon(root.getAttribute('data-theme') || initial);
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon(next);
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();

// Light/dark toggle — set the attribute before anything else renders.
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
})();

// ---- Toy 2-class 2D dataset (seed 42, per 00-global-spec.md) ----
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seededRandom(42);
function jitter(cx, cy) {
  const x = Math.max(2, Math.min(98, cx + (rand() * 2 - 1) * 15));
  const y = Math.max(2, Math.min(98, cy + (rand() * 2 - 1) * 15));
  return { x, y };
}
const points = [];
for (let i = 0; i < 19; i++) { const p = jitter(30, 30); points.push({ x: p.x, y: p.y, cls: 'A' }); }
points.push({ x: 55, y: 55, cls: 'A' }); // fixed crossover point, lands in Class B territory
for (let i = 0; i < 19; i++) { const p = jitter(70, 70); points.push({ x: p.x, y: p.y, cls: 'B' }); }
points.push({ x: 48, y: 48, cls: 'B' }); // fixed crossover point, lands in Class A territory

// ---- Real greedy Gini-impurity decision-tree induction (max depth 2) ----
function gini(pts) {
  if (pts.length === 0) return 0;
  const nB = pts.filter(p => p.cls === 'B').length;
  const pB = nB / pts.length;
  const pA = 1 - pB;
  return 1 - pA * pA - pB * pB;
}
function bestSplit(pts) {
  if (pts.length < 2) return null;
  let best = null;
  ['x', 'y'].forEach(feature => {
    const sorted = [...pts].sort((a, b) => a[feature] - b[feature]);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i][feature] === sorted[i + 1][feature]) continue;
      const t = (sorted[i][feature] + sorted[i + 1][feature]) / 2;
      const left = pts.filter(p => p[feature] < t);
      const right = pts.filter(p => p[feature] >= t);
      if (left.length === 0 || right.length === 0) continue;
      const wGini = (left.length / pts.length) * gini(left) + (right.length / pts.length) * gini(right);
      if (!best || wGini < best.wGini) best = { feature, threshold: t, wGini, left, right };
    }
  });
  return best;
}
function majorityOf(pts) {
  const nA = pts.filter(p => p.cls === 'A').length;
  const nB = pts.length - nA;
  const cls = nB > nA ? 'B' : 'A';
  const count = cls === 'A' ? nA : nB;
  return { cls, count, total: pts.length, pct: pts.length ? Math.round((100 * count) / pts.length) : 0 };
}

const rootRegion = { x0: 0, x1: 100, y0: 0, y1: 100 };
const rootSplit = bestSplit(points);
let leftRegion, rightRegion;
if (rootSplit.feature === 'x') {
  leftRegion = { x0: 0, x1: rootSplit.threshold, y0: 0, y1: 100 };
  rightRegion = { x0: rootSplit.threshold, x1: 100, y0: 0, y1: 100 };
} else {
  leftRegion = { x0: 0, x1: 100, y0: 0, y1: rootSplit.threshold };
  rightRegion = { x0: 0, x1: 100, y0: rootSplit.threshold, y1: 100 };
}
const leftPts = rootSplit.left, rightPts = rootSplit.right;
const leftSplit = bestSplit(leftPts) || { feature: 'x', threshold: (leftRegion.x0 + leftRegion.x1) / 2, left: leftPts, right: [] };
const rightSplit = bestSplit(rightPts) || { feature: 'x', threshold: (rightRegion.x0 + rightRegion.x1) / 2, left: rightPts, right: [] };

let llRegion, lrRegion;
if (leftSplit.feature === 'x') {
  llRegion = { x0: leftRegion.x0, x1: leftSplit.threshold, y0: leftRegion.y0, y1: leftRegion.y1 };
  lrRegion = { x0: leftSplit.threshold, x1: leftRegion.x1, y0: leftRegion.y0, y1: leftRegion.y1 };
} else {
  llRegion = { x0: leftRegion.x0, x1: leftRegion.x1, y0: leftRegion.y0, y1: leftSplit.threshold };
  lrRegion = { x0: leftRegion.x0, x1: leftRegion.x1, y0: leftSplit.threshold, y1: leftRegion.y1 };
}
let rlRegion, rrRegion;
if (rightSplit.feature === 'x') {
  rlRegion = { x0: rightRegion.x0, x1: rightSplit.threshold, y0: rightRegion.y0, y1: rightRegion.y1 };
  rrRegion = { x0: rightSplit.threshold, x1: rightRegion.x1, y0: rightRegion.y0, y1: rightRegion.y1 };
} else {
  rlRegion = { x0: rightRegion.x0, x1: rightRegion.x1, y0: rightRegion.y0, y1: rightSplit.threshold };
  rrRegion = { x0: rightRegion.x0, x1: rightRegion.x1, y0: rightSplit.threshold, y1: rightRegion.y1 };
}

const LL = leftSplit.left, LR = leftSplit.right, RL = rightSplit.left, RR = rightSplit.right;
const majLL = majorityOf(LL), majLR = majorityOf(LR), majRL = majorityOf(RL), majRR = majorityOf(RR);
const leafMajCls = { LL: majLL.cls, LR: majLR.cls, RL: majRL.cls, RR: majRR.cls };

function leafFor(p) {
  const goLeft = rootSplit.feature === 'x' ? p.x < rootSplit.threshold : p.y < rootSplit.threshold;
  if (goLeft) {
    const goLL = leftSplit.feature === 'x' ? p.x < leftSplit.threshold : p.y < leftSplit.threshold;
    return goLL ? 'LL' : 'LR';
  }
  const goRL = rightSplit.feature === 'x' ? p.x < rightSplit.threshold : p.y < rightSplit.threshold;
  return goRL ? 'RL' : 'RR';
}
const misclassifiedPoints = points.filter(p => leafMajCls[leafFor(p)] !== p.cls);
function featureLabel(f) { return f === 'x' ? 'X' : 'Y'; }

// ---- Tree panel rendering ----
const treeRoot = document.getElementById('treeRoot');
function leafLabel(name, maj) {
  return `${name}<br>${maj.total} pts<br>${maj.pct}% Class ${maj.cls}`;
}
function renderTree(stage) {
  let html = `<li><span class="tree-node${stage === 0 ? ' current' : ''}">Root<br>40 pts</span>`;
  if (stage >= 1) {
    html += '<ul>';
    html += `<li><span class="tree-node${stage === 1 ? ' current' : ''}">Left<br>${leftPts.length} pts</span>`;
    if (stage >= 2) {
      html += '<ul>';
      html += `<li><span class="tree-node${stage >= 4 ? ' leaf majority-' + majLL.cls.toLowerCase() : ''}${stage === 2 ? ' current' : ''}">${stage >= 4 ? leafLabel('LL', majLL) : 'LL<br>' + LL.length + ' pts'}</span></li>`;
      html += `<li><span class="tree-node${stage >= 4 ? ' leaf majority-' + majLR.cls.toLowerCase() : ''}${stage === 2 ? ' current' : ''}">${stage >= 4 ? leafLabel('LR', majLR) : 'LR<br>' + LR.length + ' pts'}</span></li>`;
      html += '</ul>';
    }
    html += '</li>';
    html += `<li><span class="tree-node${stage === 1 ? ' current' : ''}">Right<br>${rightPts.length} pts</span>`;
    if (stage >= 3) {
      html += '<ul>';
      html += `<li><span class="tree-node${stage >= 4 ? ' leaf majority-' + majRL.cls.toLowerCase() : ''}${stage === 3 ? ' current' : ''}">${stage >= 4 ? leafLabel('RL', majRL) : 'RL<br>' + RL.length + ' pts'}</span></li>`;
      html += `<li><span class="tree-node${stage >= 4 ? ' leaf majority-' + majRR.cls.toLowerCase() : ''}${stage === 3 ? ' current' : ''}">${stage >= 4 ? leafLabel('RR', majRR) : 'RR<br>' + RR.length + ' pts'}</span></li>`;
      html += '</ul>';
    }
    html += '</li>';
    html += '</ul>';
  }
  html += '</li>';
  treeRoot.innerHTML = html;
}

// ---- Scatter panel rendering ----
const scatterSvg = document.getElementById('scatterSvg');
function lineFor(region, split) {
  if (!split) return '';
  if (split.feature === 'x') return `<line class="split-line" x1="${split.threshold}" y1="${region.y0}" x2="${split.threshold}" y2="${region.y1}"/>`;
  return `<line class="split-line" x1="${region.x0}" y1="${split.threshold}" x2="${region.x1}" y2="${split.threshold}"/>`;
}
function rectFor(region, cls) {
  return `<rect class="region-${cls.toLowerCase()}" x="${region.x0}" y="${region.y0}" width="${region.x1 - region.x0}" height="${region.y1 - region.y0}"/>`;
}
function circleFor(p) {
  return `<circle class="dot-${p.cls.toLowerCase()}" cx="${p.x}" cy="${p.y}" r="1.8"/>`;
}
function renderScatter(stage) {
  let svg = '';
  if (stage >= 5) {
    svg += rectFor(llRegion, majLL.cls);
    svg += rectFor(lrRegion, majLR.cls);
    svg += rectFor(rlRegion, majRL.cls);
    svg += rectFor(rrRegion, majRR.cls);
  }
  if (stage >= 1) svg += lineFor(rootRegion, rootSplit);
  if (stage >= 2) svg += lineFor(leftRegion, leftSplit);
  if (stage >= 3) svg += lineFor(rightRegion, rightSplit);
  svg += points.map(circleFor).join('');
  if (stage >= 5) svg += misclassifiedPoints.map(p => `<circle class="misclass-ring" cx="${p.x}" cy="${p.y}" r="3"/>`).join('');
  scatterSvg.innerHTML = svg;
}

// ---- Legend: contextual per stage, never show everything at once ----
const legend = document.getElementById('legend');
const LEGEND_ITEMS = {
  a: '<span class="legend-item"><span class="legend-swatch a"></span>Class A</span>',
  b: '<span class="legend-item"><span class="legend-swatch b"></span>Class B</span>',
  line: '<span class="legend-item"><span class="legend-swatch line"></span>Split line</span>',
  leafA: '<span class="legend-item"><span class="legend-swatch leaf-a"></span>Leaf → majority Class A</span>',
  leafB: '<span class="legend-item"><span class="legend-swatch leaf-b"></span>Leaf → majority Class B</span>',
  regionA: '<span class="legend-item"><span class="legend-swatch leaf-a"></span>Class A region</span>',
  regionB: '<span class="legend-item"><span class="legend-swatch leaf-b"></span>Class B region</span>',
  ring: '<span class="legend-item"><span class="legend-swatch ring"></span>Misclassified</span>'
};
const stageLegend = [
  [],
  ['a', 'b', 'line'],
  ['a', 'b', 'line'],
  ['a', 'b', 'line'],
  ['leafA', 'leafB'],
  ['regionA', 'regionB', 'ring']
];
function renderLegend(stage) {
  const keys = stageLegend[stage] || [];
  if (keys.length === 0) {
    legend.style.display = 'none';
    legend.innerHTML = '';
  } else {
    legend.style.display = 'flex';
    legend.innerHTML = keys.map(k => LEGEND_ITEMS[k]).join('');
  }
}

// ---- Live explain panel, references the real computed values ----
const stageExplanations = [
  `Stage 1 of 6 — All data: all 40 points start in a single root node, Gini impurity ≈ ${gini(points).toFixed(2)}, with no splits applied yet.`,
  `Stage 2 of 6 — Root split found: the algorithm searched every threshold on both features and found the purest split on ${featureLabel(rootSplit.feature)} at ${rootSplit.threshold.toFixed(1)} — giving a left group of ${leftPts.length} points and a right group of ${rightPts.length} points.`,
  `Stage 3 of 6 — Left child split: within the left group, the best further split was on ${featureLabel(leftSplit.feature)} at ${leftSplit.threshold.toFixed(1)}, dividing it into ${LL.length} and ${LR.length} points.`,
  `Stage 4 of 6 — Right child split: within the right group, the best further split was on ${featureLabel(rightSplit.feature)} at ${rightSplit.threshold.toFixed(1)}, dividing it into ${RL.length} and ${RR.length} points.`,
  `Stage 5 of 6 — Final tree: 4 leaves now exist — ${majLL.count}/${majLL.total} majority Class ${majLL.cls}, ${majLR.count}/${majLR.total} majority Class ${majLR.cls}, ${majRL.count}/${majRL.total} majority Class ${majRL.cls}, ${majRR.count}/${majRR.total} majority Class ${majRR.cls}.`,
  `Stage 6 of 6 — Decision regions: shading the plane by each leaf's majority class reveals the model's actual decision boundary — ${misclassifiedPoints.length} of 40 points fall on the wrong side of their region and would be misclassified.`
];

// ---- Shared multi-stage controller (currentStage drives everything) ----
const STAGE_COUNT = 6;
const stages = Array.from({ length: STAGE_COUNT }, (_, i) => document.getElementById('s' + i));
const scrubber = document.getElementById('scrubber');
const stageReadout = document.getElementById('stageReadout');
const runBtn = document.getElementById('runBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const caption = document.getElementById('caption');
const explainPanel = document.getElementById('explainPanel');

let currentStage = 0;
let autoPlayTimer = null;
let userHasInteracted = false;

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
    runBtn.textContent = 'Run (auto-play)';
  }
}

function renderStage() {
  stages.forEach((s, i) => {
    s.classList.remove('completed', 'current', 'upcoming');
    if (i < currentStage) s.classList.add('completed');
    else if (i === currentStage) s.classList.add('current');
    else s.classList.add('upcoming');
  });

  renderTree(currentStage);
  renderScatter(currentStage);
  renderLegend(currentStage);

  scrubber.value = currentStage;
  stageReadout.textContent = `${currentStage + 1} / ${STAGE_COUNT}`;
  explainPanel.textContent = stageExplanations[currentStage];
  prevBtn.disabled = currentStage === 0;
  nextBtn.disabled = currentStage === STAGE_COUNT - 1;

  if (!userHasInteracted) {
    userHasInteracted = true;
    caption.classList.add('visible');
  }
}

function goToStage(idx) {
  stopAutoPlay();
  currentStage = Math.max(0, Math.min(STAGE_COUNT - 1, idx));
  renderStage();
}

explainPanel.textContent = 'Drag the scrubber, click any stage, or press "Run (auto-play)" — the explanation here always matches the stage you’re currently looking at.';
renderStage();
prevBtn.disabled = true;

stages.forEach((s, i) => s.addEventListener('click', () => goToStage(i)));

scrubber.addEventListener('input', () => {
  stopAutoPlay();
  currentStage = parseInt(scrubber.value, 10);
  renderStage();
});

prevBtn.addEventListener('click', () => goToStage(currentStage - 1));
nextBtn.addEventListener('click', () => goToStage(currentStage + 1));

runBtn.addEventListener('click', () => {
  if (autoPlayTimer) { stopAutoPlay(); return; }
  if (currentStage >= STAGE_COUNT - 1) { currentStage = 0; renderStage(); }
  runBtn.textContent = 'Pause auto-play';
  autoPlayTimer = setInterval(() => {
    currentStage += 1;
    renderStage();
    if (currentStage >= STAGE_COUNT - 1) stopAutoPlay();
  }, 800);
});

resetBtn.addEventListener('click', () => {
  stopAutoPlay();
  currentStage = 0;
  userHasInteracted = false;
  caption.classList.remove('visible');
  renderStage();
  explainPanel.textContent = 'Drag the scrubber, click any stage, or press "Run (auto-play)" — the explanation here always matches the stage you’re currently looking at.';
});

