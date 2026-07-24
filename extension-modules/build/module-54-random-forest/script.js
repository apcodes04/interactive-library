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

let nTrees = 5;
let maxDepth = 2;
let hasInteracted = false;
const colors = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)', 'var(--cat-5)', 'var(--cat-6)'];

function render() {
  document.getElementById('treeReadout').textContent = nTrees;
  document.getElementById('depthReadout').textContent = maxDepth;

  const svg = document.getElementById('mainSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  const mapX = x => 30 + (x / 100) * 440;
  const mapY = y => 270 - (y / 100) * 240;

  let html = `
    <line x1="30" y1="270" x2="470" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="30" x2="30" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
  `;

  // Draw simulated tree boundary lines
  for (let i = 0; i < nTrees; i++) {
    const c = colors[i % colors.length];
    const cut = 35 + ((i * 12 + maxDepth * 10) % 40);
    if (i % 2 === 0) {
      html += `<line x1="${mapX(cut)}" y1="30" x2="${mapX(cut)}" y2="270" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.7"/>`;
    } else {
      html += `<line x1="30" y1="${mapY(cut)}" x2="470" y2="${mapY(cut)}" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.7"/>`;
    }
  }

  // Draw points
  classA.forEach(p => {
    html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--primary)" stroke="var(--card-bg)" stroke-width="1.5"/>`;
  });
  classB.forEach(p => {
    html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--active)" stroke="var(--card-bg)" stroke-width="1.5"/>`;
  });

  svg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Ensemble of ${nTrees} Trees:</span> Each tree votes on class labels. Aggregating ${nTrees} trees with max depth ${maxDepth} reduces variance compared to a single tree.`;
  }
}


function initApp() {
  const treeSlider = document.getElementById('treeSlider');
  const depthSlider = document.getElementById('depthSlider');
  const resampleBtn = document.getElementById('resampleBtn');
  const resetBtn = document.getElementById('resetBtn');

  treeSlider.addEventListener('input', (e) => {
    nTrees = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  depthSlider.addEventListener('input', (e) => {
    maxDepth = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  resampleBtn.addEventListener('click', () => {
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    nTrees = 5;
    maxDepth = 2;
    treeSlider.value = 5;
    depthSlider.value = 2;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust trees and depth to watch individual bootstrapped trees aggregate into a smooth ensemble decision boundary.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
