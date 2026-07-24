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


let degree = 3;
let hasInteracted = false;

function render() {
  document.getElementById('degReadout').textContent = degree;
  const scatterSvg = document.getElementById('scatterSvg');
  const curveSvg = document.getElementById('curveSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  // Draw scatter & fitted curve
  let sHtml = `
    <line x1="20" y1="200" x2="230" y2="200" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="20" y1="20" x2="20" y2="200" stroke="var(--text-muted)" stroke-width="1"/>
  `;

  // Draw points
  for (let i = 1; i <= 10; i++) {
    const cx = 20 + i * 20;
    const cy = 200 - (i * 15 + Math.sin(i) * 20);
    sHtml += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="var(--primary)"/>`;
  }

  // Draw polynomial fit curve depending on degree
  let pts = [];
  for (let x = 1; x <= 10; x += 0.2) {
    const cx = 20 + x * 20;
    let yVal = x * 15 + Math.sin(x) * 20;
    if (degree === 1) yVal = x * 15; // Straight line
    else if (degree > 5) yVal += Math.sin(x * degree) * (degree * 3); // Overfit wiggle
    const cy = 200 - yVal;
    pts.push(`${cx},${cy}`);
  }
  sHtml += `<polyline points="${pts.join(' ')}" fill="none" stroke="var(--active)" stroke-width="2"/>`;
  scatterSvg.innerHTML = sHtml;

  // Draw U-curve
  let cHtml = `
    <line x1="20" y1="200" x2="230" y2="200" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="20" y1="20" x2="20" y2="200" stroke="var(--text-muted)" stroke-width="1"/>
    <!-- Train error (decreasing) -->
    <path d="M 30,50 Q 120,150 220,180" fill="none" stroke="var(--primary)" stroke-width="2"/>
    <!-- Val error (U-shape) -->
    <path d="M 30,80 Q 110,170 220,40" fill="none" stroke="var(--danger)" stroke-width="2.5"/>
    <!-- Current degree marker -->
    <line x1="${20 + degree * 21}" y1="20" x2="${20 + degree * 21}" y2="200" stroke="var(--text)" stroke-dasharray="3 3"/>
  `;
  curveSvg.innerHTML = cHtml;

  if (hasInteracted) {
    caption.classList.add('visible');
    if (degree <= 2) explainPanel.innerHTML = `<span class="step-label">Degree ${degree} (Underfitting):</span> High Bias. Model is too simple to capture the underlying pattern; high train and val error.`;
    else if (degree <= 4) explainPanel.innerHTML = `<span class="step-label">Degree ${degree} (Optimal):</span> Balanced Bias & Variance. Generalization error is minimized at the bottom of the U-curve.`;
    else explainPanel.innerHTML = `<span class="step-label">Degree ${degree} (Overfitting):</span> High Variance. Model fits noise in training data; low train error but high validation error.`;
  }
}


function initApp() {
  const degSlider = document.getElementById('degSlider');
  const resetBtn = document.getElementById('resetBtn');

  degSlider.addEventListener('input', (e) => {
    degree = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    degree = 3;
    degSlider.value = 3;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust complexity to find the optimal balance point where total generalization error is minimized.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
