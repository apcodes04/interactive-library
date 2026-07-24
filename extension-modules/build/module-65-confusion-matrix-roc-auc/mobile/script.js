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


let threshold = 0.50;
let hasInteracted = false;

function render() {
  document.getElementById('threshReadout').textContent = threshold.toFixed(2);
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  // Calculate matrix based on threshold
  const tp = Math.round(18 * (1 - threshold * 0.4));
  const fp = Math.round(15 * (1 - threshold));
  const fn = 20 - tp;
  const tn = 20 - fp;

  document.getElementById('tpVal').textContent = tp;
  document.getElementById('fpVal').textContent = fp;
  document.getElementById('fnVal').textContent = fn;
  document.getElementById('tnVal').textContent = tn;

  // Draw ROC Curve
  const rocSvg = document.getElementById('rocSvg');
  const tpr = tp / 20;
  const fpr = fp / 20;

  const mapX = f => 20 + f * 180;
  const mapY = t => 200 - t * 180;

  let html = `
    <line x1="20" y1="200" x2="200" y2="200" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="20" y1="20" x2="20" y2="200" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="20" y1="200" x2="200" y2="20" stroke="var(--border)" stroke-dasharray="3 3"/>
    <path d="M 20,200 Q 40,50 200,20" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
    <circle cx="${mapX(fpr)}" cy="${mapY(tpr)}" r="6" fill="var(--danger)"/>
    <text x="180" y="215" font-size="10" fill="var(--text-muted)">FPR</text>
    <text x="10" y="30" font-size="10" fill="var(--text-muted)">TPR</text>
  `;
  rocSvg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Threshold t = ${threshold.toFixed(2)}:</span> TPR (Recall) = ${(tpr*100).toFixed(0)}%, FPR = ${(fpr*100).toFixed(0)}%. Precision = ${((tp/(tp+fp))*100).toFixed(1)}%.`;
  }
}


function initApp() {
  const threshSlider = document.getElementById('threshSlider');
  const resetBtn = document.getElementById('resetBtn');

  threshSlider.addEventListener('input', (e) => {
    threshold = parseFloat(e.target.value);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    threshold = 0.50;
    threshSlider.value = 0.50;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust the threshold to trace out the ROC curve operating trade-off between TPR and FPR.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
