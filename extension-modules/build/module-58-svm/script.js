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


const classA = [{'x': 30, 'y': 30}, {'x': 25, 'y': 35}, {'x': 35, 'y': 22}, {'x': 20, 'y': 28}, {'x': 40, 'y': 32}, {'x': 28, 'y': 40}, {'x': 18, 'y': 25}, {'x': 32, 'y': 15}, {'x': 38, 'y': 38}, {'x': 22, 'y': 18}, {'x': 27, 'y': 33}, {'x': 33, 'y': 27}, {'x': 15, 'y': 30}, {'x': 30, 'y': 45}, {'x': 42, 'y': 25}, {'x': 25, 'y': 20}, {'x': 36, 'y': 34}, {'x': 20, 'y': 38}, {'x': 55, 'y': 55}, {'x': 31, 'y': 29}];
const classB = [{'x': 70, 'y': 70}, {'x': 65, 'y': 75}, {'x': 75, 'y': 62}, {'x': 60, 'y': 68}, {'x': 80, 'y': 72}, {'x': 68, 'y': 80}, {'x': 58, 'y': 65}, {'x': 72, 'y': 55}, {'x': 78, 'y': 78}, {'x': 62, 'y': 58}, {'x': 67, 'y': 73}, {'x': 73, 'y': 67}, {'x': 55, 'y': 70}, {'x': 70, 'y': 85}, {'x': 82, 'y': 65}, {'x': 65, 'y': 60}, {'x': 76, 'y': 74}, {'x': 60, 'y': 78}, {'x': 48, 'y': 48}, {'x': 71, 'y': 69}];

let cParam = 1.0;
let hasInteracted = false;

function render() {
  document.getElementById('cReadout').textContent = cParam.toFixed(2);
  const svg = document.getElementById('mainSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  const mapX = x => 30 + (x / 100) * 440;
  const mapY = y => 270 - (y / 100) * 240;

  // Boundary line x + y = 100
  const marginWidth = Math.max(5, 30 / (cParam + 0.5));

  let html = `
    <line x1="${mapX(0)}" y1="${mapY(100)}" x2="${mapX(100)}" y2="${mapY(0)}" stroke="var(--text)" stroke-width="2.5"/>
    <line x1="${mapX(0)}" y1="${mapY(100 + marginWidth)}" x2="${mapX(100 + marginWidth)}" y2="${mapY(0)}" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="${mapX(0)}" y1="${mapY(100 - marginWidth)}" x2="${mapX(100 - marginWidth)}" y2="${mapY(0)}" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 4"/>
  `;

  classA.forEach(p => {
    const isSV = Math.abs(p.x + p.y - 100) <= marginWidth + 5;
    if (isSV) {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="8" fill="none" stroke="var(--active)" stroke-width="2"/>`;
    }
    html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--primary)"/>`;
  });

  classB.forEach(p => {
    const isSV = Math.abs(p.x + p.y - 100) <= marginWidth + 5;
    if (isSV) {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="8" fill="none" stroke="var(--active)" stroke-width="2"/>`;
    }
    html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--active)"/>`;
  });

  svg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Penalty C = ${cParam.toFixed(2)}:</span> Street margin width = ${marginWidth.toFixed(1)}px. Points lying on or within margin boundaries are active Support Vectors.`;
  }
}


function initApp() {
  const cSlider = document.getElementById('cSlider');
  const resetBtn = document.getElementById('resetBtn');

  cSlider.addEventListener('input', (e) => {
    cParam = parseFloat(e.target.value);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    cParam = 1.0;
    cSlider.value = 1.0;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust penalty C to balance margin width against misclassified points.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
