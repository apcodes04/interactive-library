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


const series = [112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140];
let horizon = 3;
let hasInteracted = false;

function render() {
  document.getElementById('horizonReadout').textContent = horizon + ' months';
  const svg = document.getElementById('mainSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  const mapX = m => 30 + (m / 30) * 440;
  const mapY = v => 270 - ((v - 90) / 100) * 240;

  let html = `
    <line x1="30" y1="270" x2="470" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="30" x2="30" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
  `;

  // Observed series polyline
  let pts = series.map((v, i) => `${mapX(i+1)},${mapY(v)}`).join(' ');
  html += `<polyline points="${pts}" fill="none" stroke="var(--primary)" stroke-width="2.5"/>`;

  series.forEach((v, i) => {
    html += `<circle cx="${mapX(i+1)}" cy="${mapY(v)}" r="3.5" fill="var(--primary)"/>`;
  });

  // Trend line (simple linear regression on 24 points)
  let tPts = `${mapX(1)},${mapY(115)} ${mapX(24)},${mapY(145)}`;
  html += `<line x1="${mapX(1)}" y1="${mapY(115)}" x2="${mapX(24)}" y2="${mapY(145)}" stroke="var(--active)" stroke-width="2" stroke-dasharray="4 4"/>`;

  // Forecast extension
  let fPts = [];
  for (let h = 1; h <= horizon; h++) {
    const month = 24 + h;
    const fVal = 145 + h * 1.5 + Math.sin(h) * 15;
    fPts.push(`${mapX(month)},${mapY(fVal)}`);
    html += `<circle cx="${mapX(month)}" cy="${mapY(fVal)}" r="4.5" fill="var(--cat-1)"/>`;
  }
  html += `<polyline points="${mapX(24)},${mapY(140)} ${fPts.join(' ')}" fill="none" stroke="var(--cat-1)" stroke-width="2" stroke-dasharray="3 3"/>`;

  svg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Forecast Horizon = ${horizon} months:</span> Extrapolating linear trend (+1.5/mo) plus seasonal cycle out to month ${24 + horizon}.`;
  }
}


function initApp() {
  const horizonSlider = document.getElementById('horizonSlider');
  const resetBtn = document.getElementById('resetBtn');

  horizonSlider.addEventListener('input', (e) => {
    horizon = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    horizon = 3;
    horizonSlider.value = 3;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust forecast horizon to project trend and seasonal momentum into future periods.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
