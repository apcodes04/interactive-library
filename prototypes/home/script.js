// Light/dark toggle — set before first paint.
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
})();

// The one registry that "connects" all 50 modules. Nothing here imports any
// module's actual code — every module stays a fully isolated folder; this
// page only ever links to or iframes another module's index.html.
// `built: true` means a real prototype exists at ../<slug>/ right now;
// `built: false` means only the .md spec exists (no build/ output yet) —
// those cards render disabled rather than linking to a 404.
const MODULES = [
  { id: 1, slug: "module-01-hyperparameter", title: 'Hyperparameter', tier: "Beginner", tag: "AI/ML", built: false },
  { id: 2, slug: "module-02-overfitting", title: 'Overfitting', tier: "Beginner", tag: "AI/ML", built: false },
  { id: 3, slug: "module-03-tokenization", title: 'Tokenization', tier: "Beginner", tag: "LLM", built: false },
  { id: 4, slug: "module-04-oov-bpe", title: 'OOV / BPE', tier: "Beginner", tag: "LLM", built: false },
  { id: 5, slug: "module-05-embeddings", title: 'Embeddings', tier: "Beginner", tag: "LLM", built: false },
  { id: 6, slug: "module-06-generative-vs-discriminative", title: 'Generative vs. Discriminative models', tier: "Beginner", tag: "AI/ML", built: false },
  { id: 7, slug: "module-07-discriminative-ai-vs-generative-ai", title: 'Discriminative AI vs. Generative AI', tier: "Beginner", tag: "AI", built: false },
  { id: 8, slug: "module-08-seq2seq-models", title: 'Sequence-to-Sequence Models', tier: "Beginner", tag: "AI/ML", built: false },
  { id: 9, slug: "module-09-foundation-models", title: 'Foundation Model types', tier: "Beginner", tag: "AI", built: false },
  { id: 10, slug: "module-10-what-are-llms", title: 'What Are LLMs', tier: "Beginner", tag: "LLM", built: false },
  { id: 11, slug: "module-11-relu-derivative", title: 'ReLU derivative', tier: "Intermediate", tag: "AI/ML", built: false },
  { id: 12, slug: "module-12-chain-rule-gradient-descent", title: 'Chain rule / gradient descent', tier: "Intermediate", tag: "AI/ML", built: false },
  { id: 13, slug: "module-13-softmax-derivation", title: 'Softmax derivation', tier: "Intermediate", tag: "LLM", built: false },
  { id: 14, slug: "module-14-cross-entropy-loss", title: 'Cross-Entropy Loss', tier: "Intermediate", tag: "LLM", built: false },
  { id: 15, slug: "module-15-gradient-wrt-embeddings", title: 'Gradient wrt Embeddings', tier: "Intermediate", tag: "LLM", built: false },
  { id: 16, slug: "module-16-eigenvalues-eigenvectors", title: 'Eigenvalues & Eigenvectors', tier: "Intermediate", tag: "AI/ML", built: false },
  { id: 17, slug: "module-17-vanishing-gradient", title: 'Vanishing Gradient Problem', tier: "Intermediate", tag: "AI/ML", built: false },
  { id: 18, slug: "module-18-transformers-vs-seq2seq", title: 'Transformers vs. Seq2Seq', tier: "Intermediate", tag: "LLM", built: false },
  { id: 19, slug: "module-19-encoder-vs-decoder", title: 'Encoder vs. Decoder', tier: "Intermediate", tag: "LLM", built: false },
  { id: 20, slug: "module-20-positional-encodings", title: 'Positional Encodings', tier: "Intermediate", tag: "LLM", built: false },
  { id: 21, slug: "module-21-attention-mechanisms", title: 'Attention Mechanisms (intuitive)', tier: "Intermediate", tag: "LLM", built: false },
  { id: 22, slug: "module-22-dot-product-self-attention", title: 'Dot Product in Self-Attention', tier: "Intermediate", tag: "LLM", built: false },
  { id: 23, slug: "module-23-computing-attention-scores", title: 'Computing Attention Scores', tier: "Intermediate", tag: "LLM", built: false },
  { id: 24, slug: "module-24-multi-head-attention", title: 'Multi-Head Attention', tier: "Intermediate", tag: "LLM", built: false },
  { id: 25, slug: "module-25-llms-vs-statistical-lms", title: 'LLMs vs. Statistical LMs', tier: "Intermediate", tag: "LLM", built: false },
  { id: 26, slug: "module-26-masked-language-modeling", title: 'Masked Language Modeling', tier: "Intermediate", tag: "LLM", built: false },
  { id: 27, slug: "module-27-next-sentence-prediction", title: 'Next Sentence Prediction', tier: "Intermediate", tag: "LLM", built: false },
  { id: 28, slug: "module-28-autoregressive-vs-masked", title: 'Autoregressive vs. Masked Models', tier: "Intermediate", tag: "LLM", built: false },
  { id: 29, slug: "module-29-context-window", title: 'Context Window', tier: "Intermediate", tag: "LLM", built: false },
  { id: 30, slug: "module-30-temperature", title: 'Temperature', tier: "Intermediate", tag: "LLM", built: true },
  { id: 31, slug: "module-31-beam-search-vs-greedy", title: 'Beam Search vs. Greedy Decoding', tier: "Intermediate", tag: "LLM", built: false },
  { id: 32, slug: "module-32-top-k-vs-nucleus-sampling", title: 'Top-k vs. Nucleus Sampling', tier: "Intermediate", tag: "LLM", built: false },
  { id: 33, slug: "module-33-jacobian-matrix", title: 'Jacobian Matrix', tier: "Intermediate", tag: "AI/ML", built: false },
  { id: 34, slug: "module-34-kl-divergence", title: 'KL Divergence', tier: "Intermediate", tag: "LLM", built: false },
  { id: 35, slug: "module-35-adaptive-softmax", title: 'Adaptive Softmax', tier: "Intermediate", tag: "LLM", built: false },
  { id: 36, slug: "module-36-mixture-of-experts", title: 'Mixture of Experts', tier: "Advanced", tag: "LLM", built: false },
  { id: 37, slug: "module-37-gemini-vs-gpt4", title: 'Gemini vs. GPT-4', tier: "Advanced", tag: "LLM", built: false },
  { id: 38, slug: "module-38-gpt4-vs-gpt3", title: 'GPT-4 vs. GPT-3', tier: "Advanced", tag: "LLM", built: false },
  { id: 39, slug: "module-39-prompt-engineering", title: 'Prompt Engineering', tier: "Advanced", tag: "LLM", built: false },
  { id: 40, slug: "module-40-zero-shot-learning", title: 'Zero-Shot Learning', tier: "Advanced", tag: "LLM", built: false },
  { id: 41, slug: "module-41-few-shot-learning", title: 'Few-Shot Learning', tier: "Advanced", tag: "LLM", built: false },
  { id: 42, slug: "module-42-chain-of-thought", title: 'Chain-of-Thought Prompting', tier: "Advanced", tag: "LLM", built: false },
  { id: 43, slug: "module-43-catastrophic-forgetting", title: 'Catastrophic Forgetting', tier: "Advanced", tag: "LLM", built: false },
  { id: 44, slug: "module-44-peft", title: 'PEFT', tier: "Advanced", tag: "LLM", built: false },
  { id: 45, slug: "module-45-lora-qlora", title: 'LoRA and QLoRA', tier: "Advanced", tag: "LLM", built: false },
  { id: 46, slug: "module-46-model-distillation", title: 'Model Distillation', tier: "Advanced", tag: "LLM", built: false },
  { id: 47, slug: "module-47-rag-pipeline", title: 'RAG Pipeline', tier: "Advanced", tag: "LLM", built: true },
  { id: 48, slug: "module-48-knowledge-graph", title: 'Knowledge Graph Integration', tier: "Advanced", tag: "LLM", built: false },
  { id: 49, slug: "module-49-common-challenges", title: 'Common Challenges', tier: "Advanced", tag: "LLM", built: false },
  { id: 50, slug: "module-50-diagnostic-scenario", title: 'Diagnostic Scenario', tier: "Advanced", tag: "LLM", built: false },
];

const TIERS = ["Beginner", "Intermediate", "Advanced"];
let currentTierFilter = "All";
let currentSearch = "";

const tiersEl = document.getElementById('tiers');

function cardHtml(m) {
  const statusBadge = m.built
    ? `<span class="badge status-built">Preview ready</span>`
    : `<span class="badge status-pending">Spec only</span>`;
  const previewDisabled = m.built ? '' : 'disabled';
  return `
    <div class="module-card ${m.built ? '' : 'disabled'}" data-title="${m.title.toLowerCase()}" data-tier="${m.tier}">
      <div class="card-top">
        <span class="card-num">#${String(m.id).padStart(2, '0')}</span>
      </div>
      <div class="card-title">${m.title}</div>
      <div class="badge-row">
        <span class="badge">${m.tier}</span>
        <span class="badge">${m.tag}</span>
        ${statusBadge}
      </div>
      <div class="card-actions">
        <button class="btn-preview" data-slug="${m.slug}" data-title="${m.title}" ${previewDisabled}>Preview</button>
        ${m.built
          ? `<a class="btn-open" href="../${m.slug}/index.html" target="_blank" rel="noopener">Open</a>`
          : `<button class="btn-open" disabled>Open</button>`}
      </div>
    </div>`;
}

function render() {
  tiersEl.innerHTML = '';
  TIERS.forEach(tier => {
    if (currentTierFilter !== 'All' && currentTierFilter !== tier) return;
    const items = MODULES.filter(m => m.tier === tier && m.title.toLowerCase().includes(currentSearch));
    if (items.length === 0) return;
    const section = document.createElement('section');
    section.className = 'tier-section';
    section.innerHTML = `<h2>${tier} (${items.length})</h2><div class="card-grid">${items.map(cardHtml).join('')}</div>`;
    tiersEl.appendChild(section);
  });

  document.querySelectorAll('.btn-preview').forEach(btn => {
    btn.addEventListener('click', () => openPreview(btn.dataset.slug, btn.dataset.title));
  });
}

// Tier filter buttons
document.querySelectorAll('.tier-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTierFilter = btn.dataset.tier;
    render();
  });
});

// Search
document.getElementById('search').addEventListener('input', (e) => {
  currentSearch = e.target.value.trim().toLowerCase();
  render();
});

// Preview overlay
const overlay = document.getElementById('previewOverlay');
const frameWrap = document.getElementById('frameWrap');
const frame = document.getElementById('previewFrame');
const previewTitle = document.getElementById('previewTitle');
const viewDesktopBtn = document.getElementById('viewDesktop');
const viewMobileBtn = document.getElementById('viewMobile');
let currentSlug = null;

function openPreview(slug, title) {
  currentSlug = slug;
  previewTitle.textContent = title;
  setView('desktop');
  overlay.classList.add('open');
}

function setView(view) {
  if (!currentSlug) return;
  if (view === 'mobile') {
    frame.src = `../${currentSlug}/mobile/index.html`;
    frameWrap.classList.add('mobile-view');
    viewMobileBtn.classList.add('active');
    viewDesktopBtn.classList.remove('active');
  } else {
    frame.src = `../${currentSlug}/index.html`;
    frameWrap.classList.remove('mobile-view');
    viewDesktopBtn.classList.add('active');
    viewMobileBtn.classList.remove('active');
  }
}

function closePreview() {
  overlay.classList.remove('open');
  frame.src = 'about:blank';
  currentSlug = null;
}

viewDesktopBtn.addEventListener('click', () => setView('desktop'));
viewMobileBtn.addEventListener('click', () => setView('mobile'));
document.getElementById('closePreview').addEventListener('click', closePreview);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closePreview(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePreview(); });

render();

// Home page's own theme toggle — independent of whatever theme an embedded
// module happens to be showing inside its iframe.
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
