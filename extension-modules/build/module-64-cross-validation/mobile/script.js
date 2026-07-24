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
const totalStages = 6;
let timer = null;
let hasInteracted = false;

const legends = {
  0: [{color: 'var(--frozen)', label: 'Dataset fold'}],
  1: [{color: 'var(--primary)', label: 'Training fold'}, {color: 'var(--active)', label: 'Validation fold (Fold 1)'}],
  2: [{color: 'var(--primary)', label: 'Training fold'}, {color: 'var(--active)', label: 'Validation fold (Fold 2)'}],
  3: [{color: 'var(--primary)', label: 'Training fold'}, {color: 'var(--active)', label: 'Validation fold (Fold 3)'}],
  4: [{color: 'var(--primary)', label: 'Training fold'}, {color: 'var(--active)', label: 'Validation fold (Fold 4/5)'}],
  5: [{color: 'var(--success)', label: 'Aggregated CV Score'}]
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

  let html = '';

  for (let f = 0; f < 5; f++) {
    const y = 40 + f * 45;
    html += `<text x="40" y="${y+20}" font-size="12" fill="var(--text-muted)">Fold ${f+1}:</text>`;
    for (let b = 0; b < 5; b++) {
      const x = 100 + b * 70;
      let fill = 'var(--frozen)';
      if (currentStage > 0 && currentStage < 5) {
        const valFold = (currentStage - 1);
        fill = (b === valFold) ? 'var(--active)' : 'var(--primary)';
      } else if (currentStage === 5) {
        fill = 'var(--success)';
      }
      html += `<rect x="${x}" y="${y}" width="60" height="30" rx="6" fill="${fill}" opacity="0.85"/>`;
      html += `<text x="${x+30}" y="${y+19}" font-size="11" class="svg-text-on-accent" text-anchor="middle">K${b+1}</text>`;
    }
  }

  svg.innerHTML = html;

  if (currentStage === 0) explainPanel.innerHTML = '<span class="step-label">Stage 1: 5-Fold Partition:</span> Dataset split into 5 equal subsets.';
  else if (currentStage >= 1 && currentStage <= 4) explainPanel.innerHTML = `<span class="step-label">Stage ${currentStage+1}: Fold ${currentStage} Validation:</span> Model trained on 4 blue folds, validated on amber Fold ${currentStage}.`;
  else if (currentStage === 5) explainPanel.innerHTML = '<span class="step-label">Stage 6: CV Summary:</span> Mean CV Accuracy = 87.5% &plusmn; 2.1% across all 5 folds.';

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
