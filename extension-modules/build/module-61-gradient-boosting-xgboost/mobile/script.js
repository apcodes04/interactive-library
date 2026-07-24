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
  0: [{color: 'var(--danger)', label: 'Initial residual error'}],
  1: [{color: 'var(--cat-1)', label: 'Weak Tree 1'}, {color: 'var(--danger)', label: 'Residuals'}],
  2: [{color: 'var(--cat-1)', label: 'Weak Tree 1'}, {color: 'var(--active)', label: 'Ensemble prediction 1'}],
  3: [{color: 'var(--cat-2)', label: 'Weak Tree 2'}, {color: 'var(--danger)', label: 'Remaining residuals'}],
  4: [{color: 'var(--cat-1)', label: 'Weak Tree 1'}, {color: 'var(--cat-2)', label: 'Weak Tree 2'}, {color: 'var(--active)', label: 'Ensemble prediction 2'}],
  5: [{color: 'var(--success)', label: 'Final boosted boundary'}]
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

  const pts = [
    {x:10,y:20},{x:20,y:25},{x:30,y:40},{x:40,y:35},{x:50,y:60},{x:60,y:55},{x:70,y:80},{x:80,y:75},{x:90,y:90}
  ];

  const mapX = x => 30 + (x / 100) * 440;
  const mapY = y => 270 - (y / 100) * 240;

  let html = `
    <line x1="30" y1="270" x2="470" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="30" x2="30" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
  `;

  if (currentStage === 0) {
    pts.forEach(p => {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--primary)"/>`;
      html += `<line x1="${mapX(p.x)}" y1="${mapY(p.y)}" x2="${mapX(p.x)}" y2="${mapY(50)}" stroke="var(--danger)" stroke-dasharray="3 3"/>`;
    });
    html += `<line x1="30" y1="${mapY(50)}" x2="470" y2="${mapY(50)}" stroke="var(--active)" stroke-width="2"/>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 1: Base Model:</span> Constant base prediction (y=50). Red dashed lines show high initial residual errors.';
  } else if (currentStage === 1 || currentStage === 2) {
    pts.forEach(p => {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--primary)"/>`;
    });
    // Tree 1 step function
    let linePts = `${mapX(0)},${mapY(30)} ${mapX(50)},${mapY(30)} ${mapX(50)},${mapY(70)} ${mapX(100)},${mapY(70)}`;
    html += `<polyline points="${linePts}" fill="none" stroke="var(--cat-1)" stroke-width="2.5"/>`;
    explainPanel.innerHTML = currentStage === 1 ?
      '<span class="step-label">Stage 2: Tree 1 Fit:</span> Weak Tree 1 trained to fit current residual errors.' :
      '<span class="step-label">Stage 3: Update 1:</span> Tree 1 added to ensemble; residual errors reduced by 45%.';
  } else {
    pts.forEach(p => {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--primary)"/>`;
    });
    // Combined tree 1 + tree 2 fit
    let linePts = `${mapX(0)},${mapY(22)} ${mapX(35)},${mapY(22)} ${mapX(35)},${mapY(45)} ${mapX(65)},${mapY(45)} ${mapX(65)},${mapY(85)} ${mapX(100)},${mapY(85)}`;
    html += `<polyline points="${linePts}" fill="none" stroke="var(--success)" stroke-width="2.5"/>`;
    if (currentStage === 3) explainPanel.innerHTML = '<span class="step-label">Stage 4: Tree 2 Fit:</span> Weak Tree 2 trained to fit remaining residual errors.';
    else if (currentStage === 4) explainPanel.innerHTML = '<span class="step-label">Stage 5: Update 2:</span> Tree 2 added to ensemble; remaining errors shrink further.';
    else if (currentStage === 5) explainPanel.innerHTML = '<span class="step-label">Stage 6: Boosted Ensemble:</span> Sequential boosting converges to tight fit with minimal residual error.';
  }

  svg.innerHTML = html;

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
