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


let currentStage = 0;
const totalStages = 7;
let timer = null;
let hasInteracted = false;

const legends = {
  0: [{color: 'var(--active)', label: 'Draft token (tentative)'}],
  1: [{color: 'var(--active)', label: 'Draft token'}, {color: 'var(--primary)', label: 'Target model (verifying)'}],
  2: [{color: 'var(--success)', label: 'Accepted token'}, {color: 'var(--active)', label: 'Tentative token'}],
  3: [{color: 'var(--success)', label: 'Accepted token'}, {color: 'var(--active)', label: 'Tentative token'}],
  4: [{color: 'var(--success)', label: 'Accepted token'}, {color: 'var(--danger)', label: 'Rejected token'}, {color: 'var(--primary)', label: 'Resampled replacement'}],
  5: [{color: 'var(--success)', label: 'Accepted token'}, {color: 'var(--primary)', label: 'Resampled replacement'}, {color: 'var(--frozen)', label: 'Discarded token'}],
  6: [{color: 'var(--success)', label: 'Committed tokens'}]
};

function renderStage() {
  const stageReadout = document.getElementById('stageReadout');
  const scrubber = document.getElementById('scrubber');
  const explainPanel = document.getElementById('explainPanel');
  const caption = document.getElementById('caption');
  const legend = document.getElementById('legend');

  stageReadout.textContent = (currentStage + 1) + ' / ' + totalStages;
  scrubber.value = currentStage;

  for (let i = 0; i < totalStages; i++) {
    const btn = document.getElementById('s' + i);
    if (btn) {
      btn.classList.remove('current', 'completed');
      if (i === currentStage) btn.classList.add('current');
      else if (i < currentStage) btn.classList.add('completed');
    }
  }

  const legItems = legends[currentStage] || [];
  if (legItems.length === 0) {
    legend.style.display = 'none';
  } else {
    legend.style.display = 'flex';
    legend.innerHTML = legItems.map(item => `
      <div class="legend-item">
        <span class="legend-swatch" style="background:${item.color}"></span> ${item.label}
      </div>
    `).join('');
  }

  if (hasInteracted) {
    caption.classList.add('visible');
  }

  
  const svg = document.getElementById('mainSvg');

  let html = `
    <text x="30" y="40" font-size="14" font-weight="bold" fill="var(--text)">Prompt: "The weather today is"</text>
  `;

  const tokens = [
    {t: 'sunny', st: 2},
    {t: 'and', st: 3},
    {t: 'very', st: 4},
    {t: 'warm', st: 5}
  ];

  tokens.forEach((item, i) => {
    const x = 40 + i * 110;
    let fill = 'var(--active)';
    let stroke = 'var(--border)';
    let dash = '4 4';
    let textCol = 'white';

    if (currentStage >= item.st) {
      if (i < 2) {
        fill = 'var(--success)';
        dash = 'none';
      } else if (i === 2) {
        fill = 'var(--danger)';
        dash = 'none';
      } else if (i === 3 && currentStage >= 5) {
        fill = 'var(--frozen)';
        opacity = '0.4';
      }
    }

    html += `<rect x="${x}" y="80" width="95" height="50" rx="8" fill="${fill}" stroke="${stroke}" stroke-dasharray="${dash}"/>`;
    html += `<text x="${x+47}" y="${110}" font-size="14" font-weight="bold" fill="${textCol}" text-anchor="middle">${item.t}</text>`;

    if (i === 2 && currentStage >= 4) {
      // Replacement "quite"
      html += `<rect x="${x}" y="150" width="95" height="50" rx="8" fill="var(--primary)"/>`;
      html += `<text x="${x+47}" y="${180}" font-size="14" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">quite</text>`;
    }
  });

  svg.innerHTML = html;

  if (currentStage === 0) explainPanel.innerHTML = '<span class="step-label">Stage 1: Draft Proposes:</span> Fast draft model proposes 4 tentative tokens in sequence.';
  else if (currentStage === 1) explainPanel.innerHTML = '<span class="step-label">Stage 2: Parallel Verify:</span> Target model scores all 4 tokens simultaneously in a single forward pass.';
  else if (currentStage === 2) explainPanel.innerHTML = '<span class="step-label">Stage 3: Token 1 Accepted:</span> "sunny" matches target model distribution; accepted into output.';
  else if (currentStage === 3) explainPanel.innerHTML = '<span class="step-label">Stage 4: Token 2 Accepted:</span> "and" matches target model distribution; accepted into output.';
  else if (currentStage === 4) explainPanel.innerHTML = '<span class="step-label">Stage 5: Token 3 Rejected:</span> "very" rejected by target model; resampled replacement "quite" generated.';
  else if (currentStage === 5) explainPanel.innerHTML = '<span class="step-label">Stage 6: Discard Remainder:</span> "warm" discarded (never evaluated); draft model resumes from "quite".';
  else if (currentStage === 6) explainPanel.innerHTML = '<span class="step-label">Stage 7: Speedup Summary:</span> 3 tokens committed in 1 target pass (2.4x speedup vs 3 separate passes).';

}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    document.getElementById('runBtn').textContent = 'Run (auto-play)';
  }
}


function initApp() {
  const scrubber = document.getElementById('scrubber');
  const runBtn = document.getElementById('runBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');

  for (let i = 0; i < totalStages; i++) {
    const btn = document.getElementById('s' + i);
    if (btn) {
      btn.addEventListener('click', () => {
        stopAutoplay();
        currentStage = i;
        hasInteracted = true;
        renderStage();
      });
    }
  }

  scrubber.addEventListener('input', (e) => {
    stopAutoplay();
    currentStage = parseInt(e.target.value, 10);
    hasInteracted = true;
    renderStage();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoplay();
    if (currentStage > 0) {
      currentStage--;
      hasInteracted = true;
      renderStage();
    }
  });

  nextBtn.addEventListener('click', () => {
    stopAutoplay();
    if (currentStage < totalStages - 1) {
      currentStage++;
      hasInteracted = true;
      renderStage();
    }
  });

  resetBtn.addEventListener('click', () => {
    stopAutoplay();
    currentStage = 0;
    hasInteracted = false;
    document.getElementById('caption').classList.remove('visible');
    renderStage();
  });

  runBtn.addEventListener('click', () => {
    if (timer) {
      stopAutoplay();
    } else {
      hasInteracted = true;
      if (currentStage >= totalStages - 1) currentStage = 0;
      renderStage();
      runBtn.textContent = 'Pause';
      timer = setInterval(() => {
        if (currentStage < totalStages - 1) {
          currentStage++;
          renderStage();
        } else {
          stopAutoplay();
        }
      }, 900);
    }
  });

  renderStage();

}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
