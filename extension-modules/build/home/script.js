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

const MODULES = [
  { id: 51, slug: "module-51-linear-regression", title: "Linear Regression", tier: "Beginner", tag: "AI/ML" },
  { id: 52, slug: "module-52-logistic-regression", title: "Logistic Regression", tier: "Beginner", tag: "AI/ML" },
  { id: 53, slug: "module-53-decision-tree", title: "Decision Tree", tier: "Beginner", tag: "AI/ML" },
  { id: 54, slug: "module-54-random-forest", title: "Random Forest", tier: "Intermediate", tag: "AI/ML" },
  { id: 55, slug: "module-55-kmeans-clustering", title: "K-Means Clustering", tier: "Beginner", tag: "AI/ML" },
  { id: 56, slug: "module-56-pca-lda", title: "PCA & LDA", tier: "Intermediate", tag: "AI/ML" },
  { id: 57, slug: "module-57-time-series-analysis", title: "Time Series Analysis", tier: "Intermediate", tag: "AI/ML" },
  { id: 58, slug: "module-58-svm", title: "Support Vector Machine", tier: "Intermediate", tag: "AI/ML" },
  { id: 59, slug: "module-59-naive-bayes", title: "Naive Bayes", tier: "Beginner", tag: "AI/ML" },
  { id: 60, slug: "module-60-knn", title: "K-Nearest Neighbors", tier: "Beginner", tag: "AI/ML" },
  { id: 61, slug: "module-61-gradient-boosting-xgboost", title: "Gradient Boosting / XGBoost", tier: "Advanced", tag: "AI/ML" },
  { id: 62, slug: "module-62-bias-variance-tradeoff", title: "Bias-Variance Tradeoff", tier: "Intermediate", tag: "AI/ML" },
  { id: 63, slug: "module-63-regularization-l1-l2", title: "L1/L2 Regularization (Ridge/Lasso)", tier: "Intermediate", tag: "AI/ML" },
  { id: 64, slug: "module-64-cross-validation", title: "Cross-Validation", tier: "Intermediate", tag: "AI/ML" },
  { id: 65, slug: "module-65-confusion-matrix-roc-auc", title: "Confusion Matrix / ROC-AUC", tier: "Intermediate", tag: "AI/ML" },
  { id: 66, slug: "module-66-rlhf-dpo", title: "RLHF & DPO", tier: "Advanced", tag: "LLM" },
  { id: 67, slug: "module-67-quantization", title: "Quantization (INT8/4-bit)", tier: "Advanced", tag: "LLM" },
  { id: 68, slug: "module-68-evaluation-metrics", title: "Evaluation Metrics (BLEU/ROUGE/Perplexity)", tier: "Advanced", tag: "LLM" },
  { id: 69, slug: "module-69-tokenizer-comparison", title: "Tokenizer Comparison (BPE/WordPiece/SentencePiece)", tier: "Intermediate", tag: "LLM" },
  { id: 70, slug: "module-70-scaling-laws", title: "Scaling Laws", tier: "Advanced", tag: "LLM" },
  { id: 71, slug: "module-71-hallucination-detection-grounding", title: "Hallucination Detection & Grounding", tier: "Advanced", tag: "LLM" },
  { id: 72, slug: "module-72-speculative-decoding", title: "Speculative Decoding", tier: "Advanced", tag: "LLM" },
  { id: 73, slug: "module-73-vector-db-ann-search", title: "Vector DB / ANN Search", tier: "Advanced", tag: "LLM" }
];

let activeTier = 'All';
let searchQuery = '';
let currentPreviewSlug = null;
let currentPreviewVariant = 'desktop'; // 'desktop' or 'mobile'

function renderGrid() {
  const container = document.getElementById('gridContainer');
  const tiers = ['Beginner', 'Intermediate', 'Advanced'];
  
  let html = '';

  tiers.forEach(tier => {
    if (activeTier !== 'All' && activeTier !== tier) return;

    const filtered = MODULES.filter(m => m.tier === tier && m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length === 0) return;

    html += `
      <section class="tier-section">
        <h2>${tier} Modules</h2>
        <div class="card-grid">
          ${filtered.map(m => `
            <div class="module-card">
              <div>
                <div class="card-title">#${m.id} ${m.title}</div>
                <div class="badge-row">
                  <span class="badge">${m.tier}</span>
                  <span class="badge">${m.tag}</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-preview" onclick="openPreview('${m.slug}', '${m.title}')">Preview</button>
                <a href="../${m.slug}/index.html" target="_blank" class="btn-open">Open &rarr;</a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  });

  container.innerHTML = html;
}

function openPreview(slug, title) {
  currentPreviewSlug = slug;
  currentPreviewVariant = 'desktop';
  document.getElementById('modalTitle').textContent = title;
  
  document.getElementById('btnDeskView').classList.add('active');
  document.getElementById('btnMobView').classList.remove('active');

  const iframe = document.getElementById('previewIframe');
  iframe.classList.remove('mobile-view');
  iframe.src = `../${slug}/index.html`;

  document.getElementById('previewModal').classList.add('open');
}

function closePreview() {
  const iframe = document.getElementById('previewIframe');
  iframe.src = '';
  document.getElementById('previewModal').classList.remove('open');
}


function initApp() {
  renderGrid();

  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTier = btn.getAttribute('data-tier');
      renderGrid();
    });
  });

  document.getElementById('modalClose').addEventListener('click', closePreview);
  document.getElementById('previewModal').addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') closePreview();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePreview();
  });

  document.getElementById('btnDeskView').addEventListener('click', () => {
    currentPreviewVariant = 'desktop';
    document.getElementById('btnDeskView').classList.add('active');
    document.getElementById('btnMobView').classList.remove('active');
    const iframe = document.getElementById('previewIframe');
    iframe.classList.remove('mobile-view');
    if (currentPreviewSlug) iframe.src = `../${currentPreviewSlug}/index.html`;
  });

  document.getElementById('btnMobView').addEventListener('click', () => {
    currentPreviewVariant = 'mobile';
    document.getElementById('btnMobView').classList.add('active');
    document.getElementById('btnDeskView').classList.remove('active');
    const iframe = document.getElementById('previewIframe');
    iframe.classList.add('mobile-view');
    if (currentPreviewSlug) iframe.src = `../${currentPreviewSlug}/mobile/index.html`;
  });

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
