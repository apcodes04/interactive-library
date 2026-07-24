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


let currentMetric = 'BLEU';
let hasInteracted = false;

const metricsData = {
  BLEU: { score: '0.6250', desc: 'Precision of 1-gram to 4-gram overlaps between candidate and reference.' },
  ROUGE: { score: '0.7143', desc: 'Recall of reference n-grams captured by the candidate text.' },
  PPL: { score: '12.40', desc: 'Exponentiated cross-entropy loss measuring predictive uncertainty.' }
};

function render() {
  const d = metricsData[currentMetric];
  document.getElementById('metricTitle').textContent = 'Metric: ' + currentMetric;
  document.getElementById('scoreReadout').textContent = d.score;

  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">${currentMetric} Metric:</span> Score = ${d.score}. ${d.desc}`;
  }
}


function initApp() {
  const btns = document.querySelectorAll('.prec-btn');
  const resetBtn = document.getElementById('resetBtn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMetric = btn.getAttribute('data-metric');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hasInteracted = true;
      render();
    });
  });

  resetBtn.addEventListener('click', () => {
    currentMetric = 'BLEU';
    btns.forEach(b => {
      if (b.getAttribute('data-metric') === 'BLEU') b.classList.add('active'); else b.classList.remove('active');
    });
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Switch tabs to compare precision-oriented BLEU against recall-oriented ROUGE and probabilistic Perplexity.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
