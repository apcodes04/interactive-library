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


let nParams = 7;
let nTokens = 140;
let hasInteracted = false;

function render() {
  document.getElementById('paramReadout').textContent = nParams + ' B';
  document.getElementById('dataReadout').textContent = nTokens + ' B';

  const svg = document.getElementById('mainSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  const loss = (1.6 + 15 / Math.sqrt(nParams) + 12 / Math.sqrt(nTokens / 10)).toFixed(3);
  const ratio = (nTokens / nParams).toFixed(1);

  const mapX = n => 30 + (n / 70) * 440;
  const mapY = d => 240 - (d / 1400) * 210;

  let html = `
    <line x1="30" y1="240" x2="470" y2="240" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="30" x2="30" y2="240" stroke="var(--text-muted)" stroke-width="1"/>
    <!-- Chinchilla optimal line D = 20 * N -->
    <line x1="${mapX(1)}" y1="${mapY(20)}" x2="${mapX(70)}" y2="${mapY(1400)}" stroke="var(--success)" stroke-width="2.5"/>
    <!-- Active operating point -->
    <circle cx="${mapX(nParams)}" cy="${mapY(nTokens)}" r="7" fill="var(--primary)"/>
  `;

  svg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    const isOptimal = Math.abs(ratio - 20) < 3;
    explainPanel.innerHTML = `<span class="step-label">N=${nParams}B, D=${nTokens}B:</span> Estimated Loss = ${loss}. D/N ratio = ${ratio} (${isOptimal ? 'Chinchilla Optimal ~20:1' : 'Sub-optimal allocation'}).`;
  }
}


function initApp() {
  const paramSlider = document.getElementById('paramSlider');
  const dataSlider = document.getElementById('dataSlider');
  const resetBtn = document.getElementById('resetBtn');

  paramSlider.addEventListener('input', (e) => {
    nParams = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  dataSlider.addEventListener('input', (e) => {
    nTokens = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    nParams = 7;
    nTokens = 140;
    paramSlider.value = 7;
    dataSlider.value = 140;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust parameters and dataset size to trace loss along the Chinchilla optimal frontier.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
