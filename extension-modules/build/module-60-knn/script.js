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

let k = 3;
let queryPt = {x: 50, y: 50};
let hasInteracted = false;

function render() {
  document.getElementById('kReadout').textContent = k;
  const svg = document.getElementById('mainSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  const mapX = x => 30 + (x / 100) * 440;
  const mapY = y => 270 - (y / 100) * 240;

  // Calculate distances to queryPt
  let allPts = [];
  classA.forEach(p => allPts.push({x: p.x, y: p.y, cls: 'A', dist: Math.hypot(p.x - queryPt.x, p.y - queryPt.y)}));
  classB.forEach(p => allPts.push({x: p.x, y: p.y, cls: 'B', dist: Math.hypot(p.x - queryPt.x, p.y - queryPt.y)}));

  allPts.sort((a, b) => a.dist - b.dist);
  const neighbors = allPts.slice(0, k);

  let votesA = 0, votesB = 0;
  neighbors.forEach(n => { if (n.cls === 'A') votesA++; else votesB++; });

  const maxDist = neighbors[neighbors.length - 1].dist;
  const rSvg = (maxDist / 100) * 440;

  let html = `
    <line x1="30" y1="270" x2="470" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="30" x2="30" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
    <!-- Radius circle -->
    <circle cx="${mapX(queryPt.x)}" cy="${mapY(queryPt.y)}" r="${rSvg}" fill="var(--primary-light)" fill-opacity="0.15" stroke="var(--primary)" stroke-dasharray="3 3"/>
  `;

  // Neighbor lines
  neighbors.forEach(n => {
    html += `<line x1="${mapX(queryPt.x)}" y1="${mapY(queryPt.y)}" x2="${mapX(n.x)}" y2="${mapY(n.y)}" stroke="var(--primary-light)" stroke-width="1.5"/>`;
  });

  // Points
  allPts.forEach(p => {
    const col = p.cls === 'A' ? 'var(--primary)' : 'var(--active)';
    html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="${col}"/>`;
  });

  // Query point ?
  html += `
    <circle cx="${mapX(queryPt.x)}" cy="${mapY(queryPt.y)}" r="8" fill="var(--danger)"/>
    <text x="${mapX(queryPt.x)}" y="${mapY(queryPt.y)+3}" font-size="11" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">?</text>
  `;

  svg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    const winner = votesA > votesB ? 'Class A' : 'Class B';
    explainPanel.innerHTML = `<span class="step-label">Query (${queryPt.x}, ${queryPt.y}):</span> K=${k} nearest neighbors vote: Class A = ${votesA}, Class B = ${votesB} &rarr; <strong>Winner: ${winner}</strong>.`;
  }
}


function initApp() {
  const kSlider = document.getElementById('kSlider');
  const svg = document.getElementById('mainSvg');
  const resetBtn = document.getElementById('resetBtn');

  kSlider.addEventListener('input', (e) => {
    k = parseInt(e.target.value, 10);
    hasInteracted = true;
    render();
  });

  svg.addEventListener('click', (e) => {
    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    // Map svg px back to 0..100
    const x = Math.round(((clickX - 30) / 440) * 100);
    const y = Math.round(((270 - clickY) / 240) * 100);
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      queryPt = {x, y};
      hasInteracted = true;
      render();
    }
  });

  resetBtn.addEventListener('click', () => {
    k = 3;
    queryPt = {x: 50, y: 50};
    kSlider.value = 3;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Click the scatter plot to place a query point and see its K nearest neighbors vote.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
