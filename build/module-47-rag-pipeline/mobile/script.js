// Light/dark toggle — set the attribute before anything else renders.
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
})();

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
const stageDetail = document.getElementById('stageDetail');
const legend = document.getElementById('legend');

// Legend entries, keyed to what's actually rendered in each stage — never show
// a swatch for something that isn't on screen yet. Empty array hides the legend.
const LEGEND_ITEMS = {
  decoy: '<span class="legend-item"><span class="legend-swatch decoy"></span>Decoy chunk (ignored)</span>',
  cat1: '<span class="legend-item"><span class="legend-swatch cat-1"></span>"Code gen" chunk</span>',
  cat2: '<span class="legend-item"><span class="legend-swatch cat-2"></span>"Chat" chunk</span>',
  cat3: '<span class="legend-item"><span class="legend-swatch cat-3"></span>"Creative" chunk</span>',
  query: '<span class="legend-item"><span class="legend-swatch query"></span>Query</span>',
  retrieved: '<span class="legend-item"><span class="legend-swatch ring"></span>Retrieved</span>'
};
const stageLegend = [
  [],
  ['cat1', 'cat2', 'cat3'],
  ['decoy', 'cat1', 'cat2', 'cat3'],
  [],
  [],
  ['decoy', 'cat1', 'cat2', 'cat3', 'query', 'retrieved'],
  ['cat1', 'cat2'],
  [],
  []
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

// Same seeded decoy positions as the desktop build (seed 42), hardcoded here
// since the mobile detail card only ever renders one stage's SVG at a time.
const decoyPositions = [[58.7,71.3],[62.7,67.7],[40.9,64.1],[42.8,14],[48.7,68.6],[49.1,34.1],[50.8,81.1],[64.6,77],[20,20.1],[46,72.4]];
const decoySvg = decoyPositions.map(([x, y]) => `<circle class="dot-decoy" cx="${x}" cy="${y}" r="3"></circle>`).join('');

function embeddingsSvg() {
  return `<svg width="130" height="100" viewBox="0 0 110 90">
    ${decoySvg}
    <circle class="dot-real cat-1" cx="80" cy="25" r="4"></circle>
    <circle class="dot-real cat-2" cx="88" cy="40" r="4"></circle>
    <circle class="dot-real cat-3" cx="70" cy="55" r="4"></circle>
  </svg>`;
}

function matchSvg() {
  return `<svg width="130" height="100" viewBox="0 0 110 90">
    ${decoySvg}
    <circle class="dot-real cat-1" cx="80" cy="25" r="4"></circle>
    <circle class="dot-real cat-2" cx="88" cy="40" r="4"></circle>
    <circle class="dot-real cat-3" cx="70" cy="55" r="4"></circle>
    <circle class="dot-query" cx="83" cy="30" r="4" opacity="1"></circle>
    <circle class="highlight-ring" style="opacity:1" cx="80" cy="25" r="9"></circle>
    <circle class="highlight-ring" style="opacity:1" cx="88" cy="40" r="9"></circle>
  </svg>`;
}

const stageContents = [
  `<div class="detail-title">1. Documents</div><div>Raw source documents — the starting point.</div>`,
  `<div class="detail-title">2. Chunks</div>
   <div class="chunk-box cat-1"><span class="cat-dot"></span>Code gen: 0.2–0.4</div>
   <div class="chunk-box cat-2"><span class="cat-dot"></span>Chat: 0.7</div>
   <div class="chunk-box cat-3"><span class="cat-dot"></span>Creative: 0.9–1.2</div>`,
  `<div class="detail-title">3. Embeddings</div>${embeddingsSvg()}`,
  `<div class="detail-title">4. Vector DB</div><div>13 stored vectors, ready to search by similarity.</div>`,
  `<div class="detail-title">5. Query</div><div class="chunk-box">"What temperature for code generation?"</div>`,
  `<div class="detail-title">6. Nearest match</div>${matchSvg()}`,
  `<div class="detail-title">7. Prompt</div>
   <div class="prompt-box"><b>Query:</b> temp for code gen?<br><b>Context:</b> <span class="cat-1 cat-chip">Code gen 0.2–0.4</span>; <span class="cat-2 cat-chip">Chat 0.7</span></div>`,
  `<div class="detail-title">8. LLM</div><div>Generating an answer from the query + retrieved context only.</div>`,
  `<div class="detail-title">9. Answer</div>
   <div class="answer-box">"For code generation, use a temperature around 0.2 to 0.4."</div>`
];

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
    else if (i === currentStage) {
      s.classList.add('current');
      s.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } else s.classList.add('upcoming');
  });

  stageDetail.innerHTML = stageContents[currentStage];
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

explainPanel.textContent = 'Drag the scrubber, tap any stage, or press "Run query" to auto-play — the explanation here always matches the stage you’re currently looking at.';
stageDetail.innerHTML = stageContents[0];
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
  }, 1200);
});

resetBtn.addEventListener('click', () => {
  stopAutoPlay();
  currentStage = 0;
  userHasInteracted = false;
  caption.classList.remove('visible');
  renderStage();
  explainPanel.textContent = 'Drag the scrubber, tap any stage, or press "Run query" to auto-play — the explanation here always matches the stage you’re currently looking at.';
});

// Theme toggle: swap the icon and persist the choice. Colors are CSS
// custom properties, so the SVG dots/rings repaint automatically.
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
