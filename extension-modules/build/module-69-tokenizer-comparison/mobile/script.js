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


let currentTok = 'BPE';
let hasInteracted = false;

const tokData = {
  BPE: ['The', 'unbeliev', 'ably', 'fast', 'internat', 'ional', 'ization', 'process', 'over', 'joy', 'ed', 'everyone', '.'],
  WordPiece: ['The', 'un', '##believ', '##ably', 'fast', 'international', '##ization', 'process', 'over', '##joy', '##ed', 'everyone', '.'],
  SentencePiece: [' The', ' un', 'believably', ' fast', ' internationalization', ' process', ' over', 'joyed', ' everyone', '.']
};

const colors = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)', 'var(--cat-5)', 'var(--cat-6)'];

function render() {
  const tokens = tokData[currentTok];
  document.getElementById('tokCountReadout').textContent = tokens.length + ' tokens';

  const container = document.getElementById('tokenContainer');
  container.innerHTML = tokens.map((t, i) => `
    <span class="tok-pill" style="background:${colors[i % colors.length]}">${t}</span>
  `).join('');

  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');

  if (hasInteracted) {
    caption.classList.add('visible');
    explainPanel.innerHTML = `<span class="step-label">${currentTok} Tokenizer:</span> Split text into ${tokens.length} subword tokens. Notice subword boundary prefixes/suffixes.`;
  }
}


function initApp() {
  const btns = document.querySelectorAll('.prec-btn');
  const resetBtn = document.getElementById('resetBtn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTok = btn.getAttribute('data-tok');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hasInteracted = true;
      render();
    });
  });

  resetBtn.addEventListener('click', () => {
    currentTok = 'BPE';
    btns.forEach(b => {
      if (b.getAttribute('data-tok') === 'BPE') b.classList.add('active'); else b.classList.remove('active');
    });
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    document.getElementById('explainPanel').innerHTML = 'Switch tokenizers to see how subword merging rules handle complex vocabulary.';
    render();
  });

  render();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
