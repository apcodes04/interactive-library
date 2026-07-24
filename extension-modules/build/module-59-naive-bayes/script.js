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


const wordsState = { free: true, winner: true, meeting: false, project: false };
const spamLikelihoods = { free: 0.8, winner: 0.7, meeting: 0.1, project: 0.05 };
const hamLikelihoods = { free: 0.1, winner: 0.05, meeting: 0.6, project: 0.5 };

let hasInteracted = false;

function render() {
  const spamProbReadout = document.getElementById('spamProbReadout');
  const spamBar = document.getElementById('spamBar');
  const likelihoodCalc = document.getElementById('likelihoodCalc');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  let pSpam = 0.5;
  let pHam = 0.5;
  let calcText = [];

  Object.keys(wordsState).forEach(w => {
    if (wordsState[w]) {
      pSpam *= spamLikelihoods[w];
      pHam *= hamLikelihoods[w];
      calcText.push(w);
    }
  });

  const posteriorSpam = pSpam / (pSpam + pHam);
  const spamPct = Math.round(posteriorSpam * 100);

  spamProbReadout.textContent = spamPct + '%';
  spamBar.style.width = spamPct + '%';

  likelihoodCalc.innerHTML = `Active words: <strong>[${calcText.join(', ') || 'none'}]</strong> &rarr; Unnormalized score Spam: ${pSpam.toFixed(4)}, Ham: ${pHam.toFixed(4)}`;

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">Classification:</span> Email containing [${calcText.join(', ')}] has ${spamPct}% probability of being Spam (${spamPct >= 50 ? 'Classified as SPAM' : 'Classified as HAM'}).`;
  }
}


function initApp() {
  const btns = document.querySelectorAll('.token-btn');
  const resetBtn = document.getElementById('resetBtn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const word = btn.getAttribute('data-word');
      wordsState[word] = !wordsState[word];
      btn.classList.toggle('active');
      hasInteracted = true;
      render();
    });
  });

  resetBtn.addEventListener('click', () => {
    wordsState.free = true; wordsState.winner = true; wordsState.meeting = false; wordsState.project = false;
    btns.forEach(btn => {
      const w = btn.getAttribute('data-word');
      if (wordsState[w]) btn.classList.add('active'); else btn.classList.remove('active');
    });
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Toggle words to see how multiplying conditional likelihoods shifts posterior classification.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
