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

let threshold = 0.50;
let steepness = 1.00;
let hasInteracted = false;

function render() {
  const threshReadout = document.getElementById('threshReadout');
  const steepReadout = document.getElementById('steepReadout');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  threshReadout.textContent = threshold.toFixed(2);
  steepReadout.textContent = steepness.toFixed(2);

  // Render 2D Scatter
  const scatterSvg = document.getElementById('scatterSvg');
  const mapX = x => 20 + (x / 100) * 260;
  const mapY = y => 230 - (y / 100) * 210;

  let sHtml = `
    <line x1="20" y1="230" x2="280" y2="230" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="20" y1="20" x2="20" y2="230" stroke="var(--text-muted)" stroke-width="1"/>
  `;

  // Decision boundary x + y = 100 cut shifted by threshold
  // z = (x + y - 100) * steepness * 0.05
  // P(B) = 1 / (1 + exp(-z))
  // threshold t => z_cutoff = ln(t / (1-t))
  const zCut = Math.log(threshold / (1 - threshold));
  const shift = (zCut / (steepness * 0.05));
  const bX1 = 0, bY1 = 100 - bX1 + shift;
  const bX2 = 100, bY2 = 100 - bX2 + shift;

  sHtml += `<line x1="${mapX(bX1)}" y1="${mapY(bY1)}" x2="${mapX(bX2)}" y2="${mapY(bY2)}" stroke="var(--primary-light)" stroke-width="2" stroke-dasharray="4 4"/>`;

  let classA_as_B = 0, classB_as_B = 0;

  classA.forEach(p => {
    const z = (p.x + p.y - 100) * steepness * 0.05;
    const prob = 1 / (1 + Math.exp(-z));
    const isPredB = prob >= threshold;
    if (isPredB) classA_as_B++;
    const fill = isPredB ? 'var(--danger)' : 'var(--primary)';
    sHtml += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="5" fill="${fill}" stroke="var(--card-bg)" stroke-width="1.5"/>`;
  });

  classB.forEach(p => {
    const z = (p.x + p.y - 100) * steepness * 0.05;
    const prob = 1 / (1 + Math.exp(-z));
    const isPredB = prob >= threshold;
    if (isPredB) classB_as_B++;
    const fill = isPredB ? 'var(--active)' : 'var(--danger)';
    sHtml += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="5" fill="${fill}" stroke="var(--card-bg)" stroke-width="1.5"/>`;
  });

  scatterSvg.innerHTML = sHtml;

  // Render Sigmoid curve
  const sigmoidSvg = document.getElementById('sigmoidSvg');
  let gHtml = `
    <line x1="30" y1="220" x2="280" y2="220" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="20" x2="30" y2="220" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="${220 - threshold * 200}" x2="280" y2="${220 - threshold * 200}" stroke="var(--success)" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="275" y="${215 - threshold * 200}" font-size="10" fill="var(--success)" text-anchor="end">t = ${threshold.toFixed(2)}</text>
  `;

  let pts = [];
  for (let z = -6; z <= 6; z += 0.2) {
    const p = 1 / (1 + Math.exp(-z * steepness));
    const cx = 155 + z * 20;
    const cy = 220 - p * 200;
    pts.push(`${cx},${cy}`);
  }
  gHtml += `<polyline points="${pts.join(' ')}" fill="none" stroke="var(--primary)" stroke-width="2.5"/>`;
  sigmoidSvg.innerHTML = gHtml;

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Threshold t = ${threshold.toFixed(2)}:</span> Points with predicted P(Class B) &ge; ${threshold.toFixed(2)} are classified as Class B. False positives: ${classA_as_B}, True positives: ${classB_as_B}.`;
  }
}


function initApp() {
  const thresholdSlider = document.getElementById('thresholdSlider');
  const steepnessSlider = document.getElementById('steepnessSlider');
  const resetBtn = document.getElementById('resetBtn');

  thresholdSlider.addEventListener('input', (e) => {
    threshold = parseFloat(e.target.value);
    hasInteracted = true;
    render();
  });

  steepnessSlider.addEventListener('input', (e) => {
    steepness = parseFloat(e.target.value);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    threshold = 0.50;
    steepness = 1.00;
    thresholdSlider.value = 0.50;
    steepnessSlider.value = 1.00;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust the threshold and steepness to see log-odds mapped into class probabilities.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
