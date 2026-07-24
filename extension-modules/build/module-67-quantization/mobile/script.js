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


let currentPrec = 'FP32';
let hasInteracted = false;

const precData = {
  FP32: { mem: '14.0 GB', err: '0.0000', formula: 'q = w (32-bit floating point, exact)' },
  FP16: { mem: '7.0 GB', err: '0.0001', formula: 'q = fp16(w) (16-bit half precision)' },
  INT8: { mem: '3.5 GB', err: '0.0012', formula: 'q = round(w / S) + Z  |  S = 0.0245, Z = 0' },
  INT4: { mem: '1.75 GB', err: '0.0185', formula: 'q = round(w / S) + Z  |  S = 0.3850, Z = 8' }
};

function render() {
  const d = precData[currentPrec];
  document.getElementById('precTitle').textContent = 'Precision: ' + currentPrec;
  document.getElementById('quantFormula').textContent = d.formula;
  document.getElementById('memReadout').textContent = d.mem;
  document.getElementById('errReadout').textContent = d.err;

  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Precision ${currentPrec}:</span> Model memory reduced to ${d.mem} with MSE reconstruction error of ${d.err}.`;
  }
}


function initApp() {
  const btns = document.querySelectorAll('.prec-btn');
  const resetBtn = document.getElementById('resetBtn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentPrec = btn.getAttribute('data-prec');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hasInteracted = true;
      render();
    });
  });

  resetBtn.addEventListener('click', () => {
    currentPrec = 'FP32';
    btns.forEach(b => {
      if (b.getAttribute('data-prec') === 'FP32') b.classList.add('active'); else b.classList.remove('active');
    });
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Select precision to see quantization scale factor and reconstruction error.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
