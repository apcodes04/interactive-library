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


let penaltyType = 'L1';
let lambdaVal = 1.50;
let hasInteracted = false;

function render() {
  document.getElementById('lamReadout').textContent = lambdaVal.toFixed(2);
  const svg = document.getElementById('mainSvg');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  const cx = 250, cy = 150;
  const radius = Math.max(15, 120 / (lambdaVal + 0.5));

  let html = `
    <!-- Axes w1, w2 -->
    <line x1="30" y1="150" x2="470" y2="150" stroke="var(--text-muted)" stroke-width="1.5"/>
    <line x1="250" y1="30" x2="250" y2="270" stroke="var(--text-muted)" stroke-width="1.5"/>
    <text x="460" y="140" font-size="11" fill="var(--text-muted)">w1</text>
    <text x="260" y="40" font-size="11" fill="var(--text-muted)">w2</text>

    <!-- Loss Contours centered at (350, 60) -->
    <ellipse cx="370" cy="80" rx="40" ry="25" fill="none" stroke="var(--active)" stroke-width="1" opacity="0.4"/>
    <ellipse cx="370" cy="80" rx="70" ry="45" fill="none" stroke="var(--active)" stroke-width="1" opacity="0.4"/>
    <ellipse cx="370" cy="80" rx="100" ry="65" fill="none" stroke="var(--active)" stroke-width="1" opacity="0.4"/>
    <circle cx="370" cy="80" r="4" fill="var(--primary)"/>
  `;

  if (penaltyType === 'L1') {
    // Diamond |w1| + |w2| <= R
    html += `<polygon points="${cx},${cy-radius} ${cx+radius},${cy} ${cx},${cy+radius} ${cx-radius},${cy}" fill="var(--cat-1)" fill-opacity="0.2" stroke="var(--cat-1)" stroke-width="2"/>`;
    // Solution point lands on axis corner
    html += `<circle cx="${cx+radius}" cy="${cy}" r="6" fill="var(--danger)"/>`;
  } else {
    // Circle w1^2 + w2^2 <= R^2
    html += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="var(--cat-1)" fill-opacity="0.2" stroke="var(--cat-1)" stroke-width="2"/>`;
    // Solution point lands on smooth circle boundary
    const solX = cx + radius * 0.85;
    const solY = cy - radius * 0.52;
    html += `<circle cx="${solX}" cy="${solY}" r="6" fill="var(--danger)"/>`;
  }

  svg.innerHTML = html;

  if (hasInteracted) {
    caption.classList.add('visible');
    if (penaltyType === 'L1') {
      explainPanel.innerHTML = `<span class="step-label">L1 Lasso (&lambda; = ${lambdaVal.toFixed(2)}):</span> Constraint diamond touches loss contour at corner (w2 = 0), setting feature weight to exact zero.`;
    } else {
      explainPanel.innerHTML = `<span class="step-label">L2 Ridge (&lambda; = ${lambdaVal.toFixed(2)}):</span> Constraint circle touches loss contour smoothly, shrinking weights towards zero without setting them to exact zero.`;
    }
  }
}


function initApp() {
  const typeBtn = document.getElementById('typeBtn');
  const lamSlider = document.getElementById('lamSlider');
  const resetBtn = document.getElementById('resetBtn');

  typeBtn.addEventListener('click', () => {
    penaltyType = penaltyType === 'L1' ? 'L2' : 'L1';
    typeBtn.textContent = penaltyType === 'L1' ? 'L1 (Lasso / Diamond)' : 'L2 (Ridge / Circle)';
    hasInteracted = true;
    render();
  });

  lamSlider.addEventListener('input', (e) => {
    lambdaVal = parseFloat(e.target.value);
    hasInteracted = true;
    render();
  });

  resetBtn.addEventListener('click', () => {
    penaltyType = 'L1';
    lambdaVal = 1.50;
    typeBtn.textContent = 'L1 (Lasso / Diamond)';
    lamSlider.value = 1.50;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Adjust lambda and toggle penalty type to see how constraint geometry drives parameter sparsity.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
