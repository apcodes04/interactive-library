(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    function syncIcon(theme) {
      sun.style.display = theme === 'dark' ? 'none' : 'block';
      moon.style.display = theme === 'dark' ? 'block' : 'none';
    }
    syncIcon(initial);
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon(next);
    });

    const MODULES = [
      { id: 1, slug: "module-01-hyperparameter", title: "Hyperparameter Tuning & Learning Rate", tier: "Beginner", tag: "AI/ML" },
      { id: 2, slug: "module-02-overfitting", title: "Overfitting vs Underfitting", tier: "Beginner", tag: "AI/ML" },
      { id: 3, slug: "module-03-tokenization", title: "Tokenization Fundamentals", tier: "Beginner", tag: "LLM" },
      { id: 4, slug: "module-04-oov-bpe", title: "OOV Words & Byte-Pair Encoding (BPE)", tier: "Beginner", tag: "LLM" },
      { id: 5, slug: "module-05-embeddings", title: "Word Embeddings & Vector Space", tier: "Beginner", tag: "AI/ML" },
      { id: 6, slug: "module-06-generative-vs-discriminative", title: "Generative vs Discriminative Models", tier: "Beginner", tag: "AI/ML" },
      { id: 7, slug: "module-07-discriminative-ai-vs-generative-ai", title: "Discriminative AI vs Generative AI", tier: "Beginner", tag: "AI/ML" },
      { id: 8, slug: "module-08-seq2seq-models", title: "Seq2Seq Models & Encoder-Decoder", tier: "Beginner", tag: "AI/ML" },
      { id: 9, slug: "module-09-foundation-models", title: "Foundation Model Architectures", tier: "Beginner", tag: "LLM" },
      { id: 10, slug: "module-10-what-are-llms", title: "What Are Large Language Models?", tier: "Beginner", tag: "LLM" },
      { id: 11, slug: "module-11-relu-derivative", title: "ReLU Derivative & Activation Functions", tier: "Intermediate", tag: "AI/ML" },
      { id: 12, slug: "module-12-chain-rule-gradient-descent", title: "Chain Rule & Backpropagation", tier: "Intermediate", tag: "AI/ML" },
      { id: 13, slug: "module-13-softmax-derivation", title: "Softmax Derivative & Probability", tier: "Intermediate", tag: "AI/ML" },
      { id: 14, slug: "module-14-cross-entropy-loss", title: "Cross-Entropy Loss Computation", tier: "Intermediate", tag: "AI/ML" },
      { id: 15, slug: "module-15-gradient-wrt-embeddings", title: "Gradient with Respect to Embeddings", tier: "Intermediate", tag: "LLM" },
      { id: 16, slug: "module-16-eigenvalues-eigenvectors", title: "Eigenvalues & Eigenvectors in PCA", tier: "Intermediate", tag: "AI/ML" },
      { id: 17, slug: "module-17-vanishing-gradient", title: "Vanishing & Exploding Gradients", tier: "Intermediate", tag: "AI/ML" },
      { id: 18, slug: "module-18-transformers-vs-seq2seq", title: "Transformers vs Seq2Seq Models", tier: "Intermediate", tag: "LLM" },
      { id: 19, slug: "module-19-encoder-vs-decoder", title: "Encoder-Only vs Decoder-Only Models", tier: "Intermediate", tag: "LLM" },
      { id: 20, slug: "module-20-positional-encodings", title: "Positional Encodings in Transformers", tier: "Intermediate", tag: "LLM" },
      { id: 21, slug: "module-21-attention-mechanisms", title: "Attention Mechanisms Overview", tier: "Intermediate", tag: "LLM" },
      { id: 22, slug: "module-22-dot-product-self-attention", title: "Scaled Dot-Product Self-Attention", tier: "Intermediate", tag: "LLM" },
      { id: 23, slug: "module-23-computing-attention-scores", title: "Computing Attention Scores Step-by-Step", tier: "Intermediate", tag: "LLM" },
      { id: 24, slug: "module-24-multi-head-attention", title: "Multi-Head Attention Mechanism", tier: "Intermediate", tag: "LLM" },
      { id: 25, slug: "module-25-llms-vs-statistical-lms", title: "LLMs vs Statistical Language Models", tier: "Intermediate", tag: "LLM" },
      { id: 26, slug: "module-26-masked-language-modeling", title: "Masked Language Modeling (BERT)", tier: "Intermediate", tag: "LLM" },
      { id: 27, slug: "module-27-next-sentence-prediction", title: "Next Sentence Prediction (NSP)", tier: "Intermediate", tag: "LLM" },
      { id: 28, slug: "module-28-autoregressive-vs-masked", title: "Autoregressive vs Masked LM", tier: "Intermediate", tag: "LLM" },
      { id: 29, slug: "module-29-context-window", title: "Context Window & Attention Scaling", tier: "Intermediate", tag: "LLM" },
      { id: 30, slug: "module-30-temperature", title: "Temperature Scaling in Generation", tier: "Intermediate", tag: "LLM" },
      { id: 31, slug: "module-31-beam-search-vs-greedy", title: "Beam Search vs Greedy Decoding", tier: "Advanced", tag: "LLM" },
      { id: 32, slug: "module-32-top-k-vs-nucleus-sampling", title: "Top-k vs Nucleus (Top-p) Sampling", tier: "Advanced", tag: "LLM" },
      { id: 33, slug: "module-33-jacobian-matrix", title: "Jacobian Matrix in Neural Nets", tier: "Advanced", tag: "AI/ML" },
      { id: 34, slug: "module-34-kl-divergence", title: "Kullback-Leibler (KL) Divergence", tier: "Advanced", tag: "AI/ML" },
      { id: 35, slug: "module-35-adaptive-softmax", title: "Adaptive & Hierarchical Softmax", tier: "Advanced", tag: "LLM" },
      { id: 36, slug: "module-36-mixture-of-experts", title: "Mixture of Experts (MoE) Architecture", tier: "Advanced", tag: "LLM" },
      { id: 37, slug: "module-37-gemini-vs-gpt4", title: "Multimodal Gemini vs GPT-4", tier: "Advanced", tag: "LLM" },
      { id: 38, slug: "module-38-gpt4-vs-gpt3", title: "GPT-4 vs GPT-3 Architectural Shift", tier: "Advanced", tag: "LLM" },
      { id: 39, slug: "module-39-prompt-engineering", title: "Prompt Engineering Mechanics", tier: "Advanced", tag: "LLM" },
      { id: 40, slug: "module-40-zero-shot-learning", title: "Zero-Shot Learning Mechanics", tier: "Advanced", tag: "LLM" },
      { id: 41, slug: "module-41-few-shot-learning", title: "Few-Shot In-Context Learning", tier: "Advanced", tag: "LLM" },
      { id: 42, slug: "module-42-chain-of-thought", title: "Chain-of-Thought (CoT) Prompting", tier: "Advanced", tag: "LLM" },
      { id: 43, slug: "module-43-catastrophic-forgetting", title: "Catastrophic Forgetting & Mitigation", tier: "Advanced", tag: "AI/ML" },
      { id: 44, slug: "module-44-peft", title: "Parameter-Efficient Fine-Tuning", tier: "Advanced", tag: "LLM" },
      { id: 45, slug: "module-45-lora-qlora", title: "LoRA & QLoRA Fine-Tuning Mechanics", tier: "Advanced", tag: "LLM" },
      { id: 46, slug: "module-46-model-distillation", title: "Knowledge Distillation Mechanics", tier: "Advanced", tag: "AI/ML" },
      { id: 47, slug: "module-47-rag-pipeline", title: "Retrieval-Augmented Generation (RAG)", tier: "Advanced", tag: "LLM" },
      { id: 48, slug: "module-48-knowledge-graph", title: "Knowledge Graph Integration in RAG", tier: "Advanced", tag: "LLM" },
      { id: 49, slug: "module-49-common-challenges", title: "LLM Deployment & Inference Challenges", tier: "Advanced", tag: "LLM" },
      { id: 50, slug: "module-50-diagnostic-scenario", title: "Diagnostic ML/LLM Scenario Walkthrough", tier: "Advanced", tag: "LLM" }
    ];

    let currentTier = "all";
    let searchQuery = "";
    let activeModule = null;
    let activeVariant = "desktop";

    const mainContainer = document.getElementById('mainContainer');

    function renderGrid() {
      mainContainer.innerHTML = '';
      const tiers = ["Beginner", "Intermediate", "Advanced"];

      tiers.forEach(tier => {
        if (currentTier !== "all" && currentTier !== tier) return;

        const filtered = MODULES.filter(m => {
          if (m.tier !== tier) return false;
          if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase()) && !m.slug.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          return true;
        });

        if (filtered.length === 0) return;

        const sec = document.createElement('section');
        sec.className = 'tier-section';
        sec.innerHTML = `
          <h2 class="tier-title">${tier} Modules (${filtered.length})</h2>
          <div class="card-grid"></div>
        `;

        const grid = sec.querySelector('.card-grid');

        filtered.forEach(mod => {
          const card = document.createElement('div');
          card.className = 'module-card';
          card.innerHTML = `
            <div class="card-header">
              <div class="module-num">Module ${String(mod.id).padStart(2, '0')}</div>
              <h3 class="module-name">${mod.title}</h3>
              <div class="tags">
                <span class="tag">${mod.tier}</span>
                <span class="tag">${mod.tag}</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-preview" data-id="${mod.id}">Preview</button>
              <a class="btn-open" href="../${mod.slug}/index.html" target="_blank" rel="noopener">Open ↗</a>
            </div>
          `;

          card.querySelector('.btn-preview').addEventListener('click', () => openPreview(mod));
          grid.appendChild(card);
        });

        mainContainer.appendChild(sec);
      });
    }

    // Search and Filter listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTier = btn.dataset.tier;
        renderGrid();
      });
    });

    // Preview Overlay Logic
    const overlay = document.getElementById('previewOverlay');
    const iframe = document.getElementById('previewIframe');
    const previewTitle = document.getElementById('previewTitle');
    const iframeWrapper = document.getElementById('iframeWrapper');
    const btnDesktop = document.getElementById('btnDesktop');
    const btnMobile = document.getElementById('btnMobile');

    function openPreview(mod) {
      activeModule = mod;
      activeVariant = "desktop";
      previewTitle.textContent = `Module ${String(mod.id).padStart(2, '0')}: ${mod.title}`;
      updateIframe();
      overlay.classList.add('open');
    }

    function closePreview() {
      overlay.classList.remove('open');
      iframe.src = "";
      activeModule = null;
    }

    function updateIframe() {
      if (!activeModule) return;
      btnDesktop.classList.toggle('active', activeVariant === 'desktop');
      btnMobile.classList.toggle('active', activeVariant === 'mobile');
      iframeWrapper.classList.toggle('mobile-frame', activeVariant === 'mobile');

      const path = activeVariant === 'mobile'
        ? `../${activeModule.slug}/mobile/index.html`
        : `../${activeModule.slug}/index.html`;

      iframe.src = path;
    }

    btnDesktop.addEventListener('click', () => {
      activeVariant = "desktop";
      updateIframe();
    });

    btnMobile.addEventListener('click', () => {
      activeVariant = "mobile";
      updateIframe();
    });

    document.getElementById('btnClose').addEventListener('click', closePreview);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePreview();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closePreview();
      }
    });

    renderGrid();
  });
})();
