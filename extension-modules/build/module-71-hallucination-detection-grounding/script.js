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


let candMode = 'g';
let hasInteracted = false;

const cands = {
  g: { html: '"The Eiffel Tower <span class="claim-g">was completed in 1889</span>."', score: '100%', desc: 'Fully grounded in source document.' },
  p: { html: '"The Eiffel Tower <span class="claim-g">was completed in 1889</span> and <span class="claim-p">is the tallest building in France</span>."', score: '50%', desc: 'Partially grounded; height claim swapped for unverified assertion.' },
  h: { html: '"The Eiffel Tower <span class="claim-h">was completed in 1901 by Gustave Eiffel\'s rival</span>."', score: '0%', desc: 'Hallucinated; fabricated date and unsupported facts.' }
};

function render() {
  const d = cands[candMode];
  document.getElementById('candDisplay').innerHTML = d.html;
  document.getElementById('groundReadout').textContent = d.score;

  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Grounding Score ${d.score}:</span> ${d.desc}`;
  }
}


function initApp() {
  const btns = document.querySelectorAll('.prec-btn');
  const resetBtn = document.getElementById('resetBtn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      candMode = btn.getAttribute('data-cand');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hasInteracted = true;
      render();
    });
  });

  resetBtn.addEventListener('click', () => {
    candMode = 'g';
    btns.forEach(b => {
      if (b.getAttribute('data-cand') === 'g') b.classList.add('active'); else b.classList.remove('active');
    });
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Select a candidate answer to evaluate factual grounding against the source text.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
