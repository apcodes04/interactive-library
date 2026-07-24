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


// Toy regression dataset
const points = [
  {x: 1, y: 5.1}, {x: 2, y: 6.9}, {x: 3, y: 9.4}, {x: 4, y: 10.8}, {x: 5, y: 13.2},
  {x: 6, y: 14.9}, {x: 7, y: 17.3}, {x: 8, y: 18.7}, {x: 9, y: 21.5}, {x: 10, y: 22.8}
];

let m = 0.0;
let b = 0.0;
let sseHistory = [];
let isAnimating = false;
let animTimer = null;
let hasInteracted = false;
let isConverged = false;

function computeSSE(curM, curB) {
  let sse = 0;
  points.forEach(p => {
    const yPred = curM * p.x + curB;
    sse += (p.y - yPred) ** 2;
  });
  return sse;
}

function render() {
  const slopeReadout = document.getElementById('slopeReadout');
  const interceptReadout = document.getElementById('interceptReadout');
  const sseReadout = document.getElementById('sseReadout');
  const slopeSlider = document.getElementById('slopeSlider');
  const interceptSlider = document.getElementById('interceptSlider');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');
  const lineSwatch = document.getElementById('lineSwatch');

  slopeReadout.textContent = m.toFixed(2);
  interceptReadout.textContent = b.toFixed(2);
  slopeSlider.value = m.toFixed(2);
  interceptSlider.value = b.toFixed(2);

  const curSSE = computeSSE(m, b);
  sseReadout.textContent = curSSE.toFixed(2);

  if (lineSwatch) {
    lineSwatch.style.background = isConverged ? 'var(--success)' : 'var(--active)';
  }

  // Render Left Scatter SVG (x 0..11, y 0..26)
  const scatterSvg = document.getElementById('scatterSvg');
  const mapX = x => 25 + (x / 11) * 250;
  const mapY = y => 210 - (y / 26) * 190;

  let sHtml = `
    <line x1="25" y1="210" x2="280" y2="210" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="25" y1="20" x2="25" y2="210" stroke="var(--text-muted)" stroke-width="1"/>
    <text x="270" y="225" font-size="10" fill="var(--text-muted)">x</text>
    <text x="12" y="25" font-size="10" fill="var(--text-muted)">y</text>
  `;

  // Draw fitted line
  const x1 = 0, y1 = m * x1 + b;
  const x2 = 11, y2 = m * x2 + b;
  const lineCol = isConverged ? 'var(--success)' : 'var(--active)';
  sHtml += `<line x1="${mapX(x1)}" y1="${mapY(y1)}" x2="${mapX(x2)}" y2="${mapY(y2)}" stroke="${lineCol}" stroke-width="2.5"/>`;

  // Draw points and residuals
  points.forEach(p => {
    const yPred = m * p.x + b;
    sHtml += `<line x1="${mapX(p.x)}" y1="${mapY(p.y)}" x2="${mapX(p.x)}" y2="${mapY(yPred)}" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    sHtml += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--primary)" stroke="var(--card-bg)" stroke-width="1"/>`;
  });
  scatterSvg.innerHTML = sHtml;

  // Render Right SSE Chart SVG
  const sseSvg = document.getElementById('sseSvg');
  let cHtml = `
    <line x1="25" y1="210" x2="280" y2="210" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="25" y1="20" x2="25" y2="210" stroke="var(--text-muted)" stroke-width="1"/>
    <text x="150" y="225" font-size="10" fill="var(--text-muted)" text-anchor="middle">Step / Iteration</text>
    <text x="12" y="25" font-size="10" fill="var(--text-muted)">SSE</text>
  `;

  if (sseHistory.length > 0) {
    const maxSSE = Math.max(...sseHistory, 500);
    let pts = sseHistory.map((val, idx) => {
      const px = 25 + (idx / 30) * 250;
      const py = 210 - (val / maxSSE) * 180;
      return `${px},${py}`;
    }).join(' ');

    cHtml += `<polyline points="${pts}" fill="none" stroke="var(--danger)" stroke-width="2"/>`;
    sseHistory.forEach((val, idx) => {
      const px = 25 + (idx / 30) * 250;
      const py = 210 - (val / maxSSE) * 180;
      cHtml += `<circle cx="${px}" cy="${py}" r="3" fill="var(--danger)"/>`;
    });
  }

  sseSvg.innerHTML = cHtml;

  if (hasInteracted) {
    caption.classList.add('visible');
    if (isAnimating) {
      explainPanel.innerHTML = `<span class="step-label">Gradient Descent Step ${sseHistory.length} / 30:</span> m = ${m.toFixed(2)}, b = ${b.toFixed(2)} &rarr; SSE = ${curSSE.toFixed(2)}. Walking downhill...`;
    } else if (isConverged) {
      explainPanel.innerHTML = `<span class="step-label">Converged (Step 30):</span> Gradient descent flattened out at m = ${m.toFixed(2)}, b = ${b.toFixed(2)} with minimum SSE = ${curSSE.toFixed(2)}.`;
    } else {
      explainPanel.innerHTML = `<span class="step-label">Manual Fit:</span> Current line y = ${m.toFixed(2)}x + ${b.toFixed(2)} &rarr; Sum of Squared Errors = ${curSSE.toFixed(2)}.`;
    }
  }
}

function runGradientDescent() {
  if (isAnimating) return;
  isAnimating = true;
  hasInteracted = true;
  isConverged = false;
  m = 0.0;
  b = 0.0;
  sseHistory = [computeSSE(m, b)];

  document.getElementById('slopeSlider').disabled = true;
  document.getElementById('interceptSlider').disabled = true;
  document.getElementById('gdBtn').disabled = true;

  render();

  // Gradient descent parameters
  // Loss L = (1/N) * sum((y_i - (m*x_i + b))^2)
  // dm = -(2/N) * sum(x_i * (y_i - y_pred))
  // db = -(2/N) * sum(y_i - y_pred)
  const lr = 0.015;
  let step = 0;
  const maxSteps = 30;

  animTimer = setInterval(() => {
    step++;
    const N = points.length;
    let gradM = 0;
    let gradB = 0;

    points.forEach(p => {
      const pred = m * p.x + b;
      const err = p.y - pred;
      gradM += -2 * p.x * err;
      gradB += -2 * err;
    });

    gradM /= N;
    gradB /= N;

    // Normalize scale for 10x range
    m -= lr * gradM * 0.05;
    b -= lr * gradB * 0.2;

    const newSSE = computeSSE(m, b);
    sseHistory.push(newSSE);

    if (step >= maxSteps) {
      clearInterval(animTimer);
      animTimer = null;
      isAnimating = false;
      isConverged = true;
      document.getElementById('slopeSlider').disabled = false;
      document.getElementById('interceptSlider').disabled = false;
      document.getElementById('gdBtn').disabled = false;
    }

    render();
  }, 100);
}


function initApp() {
  const slopeSlider = document.getElementById('slopeSlider');
  const interceptSlider = document.getElementById('interceptSlider');
  const gdBtn = document.getElementById('gdBtn');
  const resetBtn = document.getElementById('resetBtn');

  slopeSlider.addEventListener('input', (e) => {
    if (isAnimating) return;
    m = parseFloat(e.target.value);
    hasInteracted = true;
    isConverged = false;
    render();
  });

  interceptSlider.addEventListener('input', (e) => {
    if (isAnimating) return;
    b = parseFloat(e.target.value);
    hasInteracted = true;
    isConverged = false;
    render();
  });

  gdBtn.addEventListener('click', runGradientDescent);

  resetBtn.addEventListener('click', () => {
    if (animTimer) clearInterval(animTimer);
    isAnimating = false;
    isConverged = false;
    m = 0.0;
    b = 0.0;
    sseHistory = [];
    document.getElementById('slopeSlider').disabled = false;
    document.getElementById('interceptSlider').disabled = false;
    document.getElementById('gdBtn').disabled = false;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Drag sliders to manually fit the line or click "Fit with Gradient Descent" to watch SSE decrease step-by-step.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
