// Light/dark toggle — set the attribute before anything else renders.
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
})();

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seededRandom(42);
const decoyPositions = [];
for (let i = 0; i < 10; i++) {
  decoyPositions.push([10 + rand() * 55, 10 + rand() * 75]);
}
['decoyDots', 'decoyDots2'].forEach(id => {
  const g = document.getElementById(id);
  decoyPositions.forEach(([x, y]) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 3);
    c.setAttribute('class', 'dot-decoy');
    g.appendChild(c);
  });
});

const STAGE_COUNT = 9;
const stages = Array.from({ length: STAGE_COUNT }, (_, i) => document.getElementById('s' + i));
const scrubber = document.getElementById('scrubber');
const stageReadout = document.getElementById('stageReadout');
const runBtn = document.getElementById('runBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const caption = document.getElementById('caption');
const explainPanel = document.getElementById('explainPanel');
const legend = document.getElementById('legend');
const queryDot = document.getElementById('queryDot');
const ring1 = document.getElementById('ring1');
const ring2 = document.getElementById('ring2');

// Legend entries, keyed to what's actually rendered in each stage — never show
// a swatch for something that isn't on screen yet. Empty array hides the legend.
const LEGEND_ITEMS = {
  decoy: '<span class="legend-item"><span class="legend-swatch decoy"></span>Decoy chunk (unrelated, correctly ignored)</span>',
  cat1: '<span class="legend-item"><span class="legend-swatch cat-1"></span>"Code gen" chunk</span>',
  cat2: '<span class="legend-item"><span class="legend-swatch cat-2"></span>"Chat" chunk</span>',
  cat3: '<span class="legend-item"><span class="legend-swatch cat-3"></span>"Creative" chunk</span>',
  query: '<span class="legend-item"><span class="legend-swatch query"></span>Query, once embedded</span>',
  retrieved: '<span class="legend-item"><span class="legend-swatch ring"></span>Retrieved (nearest match)</span>'
};
const stageLegend = [
  [],                                              // 0 Documents — nothing color-coded yet
  ['cat1', 'cat2', 'cat3'],                         // 1 Chunks
  ['decoy', 'cat1', 'cat2', 'cat3'],                // 2 Embeddings
  [],                                               // 3 Vector DB — icon + count only, no dots shown
  [],                                               // 4 Query — plain text box
  ['decoy', 'cat1', 'cat2', 'cat3', 'query', 'retrieved'], // 5 Nearest match
  ['cat1', 'cat2'],                                 // 6 Prompt — only the 2 chunks that were retrieved
  [],                                               // 7 LLM
  []                                                // 8 Answer
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

const stageExplanations = [
  'Stage 1 of 9 — Documents: the raw source documents are the starting point, nothing has been processed yet.',
  'Stage 2 of 9 — Chunks: documents are split into 3 small chunks so retrieval can match a specific passage instead of a whole document.',
  'Stage 3 of 9 — Embeddings: each chunk (plus 10 unrelated decoy chunks) is converted into a vector embedding — position in this space now represents meaning.',
  'Stage 4 of 9 — Vector DB: all 13 vectors are stored in a vector database, ready to be searched by similarity instead of scanned one by one.',
  'Stage 5 of 9 — Query: the user’s query arrives as plain text — this is what will get embedded and compared next.',
  'Stage 6 of 9 — Nearest match: the query is embedded into the same space, and the 2 nearest chunks (Code gen, Chat) are retrieved — the 3rd real chunk and all 10 decoys are correctly ignored.',
  'Stage 7 of 9 — Prompt: the 2 retrieved chunks are inserted into the prompt alongside the original query — this is the only context the model will see.',
  'Stage 8 of 9 — LLM: the model generates its answer conditioned on the query plus exactly those 2 retrieved chunks, nothing else from the database.',
  'Stage 9 of 9 — Answer: the final answer grounds itself in the retrieved "Code gen: 0.2–0.4" chunk — trace it back and you can see exactly which chunk justified it.'
];

let currentStage = 0;
let autoPlayTimer = null;
let userHasInteracted = false;

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
    runBtn.textContent = 'Run query (auto-play)';
  }
}

function renderStage() {
  stages.forEach((s, i) => {
    s.classList.remove('completed', 'current', 'upcoming');
    if (i < currentStage) s.classList.add('completed');
    else if (i === currentStage) s.classList.add('current');
    else s.classList.add('upcoming');
  });

  // the query dot / retrieval ring only make sense once we've reached stage 6 (index 5)
  if (currentStage >= 5) {
    queryDot.setAttribute('opacity', 1);
    queryDot.setAttribute('r', 4);
    ring1.style.opacity = 1;
    ring2.style.opacity = 1;
  } else {
    queryDot.setAttribute('opacity', 0);
    queryDot.setAttribute('r', 0);
    ring1.style.opacity = 0;
    ring2.style.opacity = 0;
  }

  scrubber.value = currentStage;
  stageReadout.textContent = `${currentStage + 1} / ${STAGE_COUNT}`;
  explainPanel.textContent = stageExplanations[currentStage];
  renderLegend(currentStage);
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

// initial default state, visible before any interaction
explainPanel.textContent = 'Drag the scrubber, click any stage, or press "Run query" to auto-play — the explanation here always matches the stage you’re currently looking at.';
renderStage();
prevBtn.disabled = true;

stages.forEach((s, i) => {
  s.addEventListener('click', () => goToStage(i));
});

scrubber.addEventListener('input', () => {
  stopAutoPlay();
  currentStage = parseInt(scrubber.value, 10);
  renderStage();
});

prevBtn.addEventListener('click', () => goToStage(currentStage - 1));
nextBtn.addEventListener('click', () => goToStage(currentStage + 1));

runBtn.addEventListener('click', () => {
  if (autoPlayTimer) {
    stopAutoPlay();
    return;
  }
  if (currentStage >= STAGE_COUNT - 1) {
    currentStage = 0;
    renderStage();
  }
  runBtn.textContent = 'Pause auto-play';
  autoPlayTimer = setInterval(() => {
    currentStage += 1;
    renderStage();
    if (currentStage >= STAGE_COUNT - 1) {
      stopAutoPlay();
    }
  }, 900);
});

resetBtn.addEventListener('click', () => {
  stopAutoPlay();
  currentStage = 0;
  userHasInteracted = false;
  caption.classList.remove('visible');
  renderStage();
  explainPanel.textContent = 'Drag the scrubber, click any stage, or press "Run query" to auto-play — the explanation here always matches the stage you’re currently looking at.';
});

// Theme toggle: swap the icon and persist the choice. The dot/ring colors
// in the SVG stages are driven by CSS custom properties (--primary,
// --success, --active), so they repaint automatically — no JS re-render needed.
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  const sun = document.getElementById('themeIconSun');
  const moon = document.getElementById('themeIconMoon');
  const root = document.documentElement;

  function syncIcon(theme) {
    sun.style.display = theme === 'dark' ? 'none' : 'block';
    moon.style.display = theme === 'dark' ? 'block' : 'none';
  }
  syncIcon(root.getAttribute('data-theme'));

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncIcon(next);
  });
});
