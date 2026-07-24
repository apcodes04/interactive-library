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
  0: [{color: 'var(--frozen)', label: 'Base model'}],
  1: [{color: 'var(--cat-1)', label: 'SFT Model'}],
  2: [{color: 'var(--success)', label: 'Chosen response'}, {color: 'var(--danger)', label: 'Rejected response'}],
  3: [{color: 'var(--cat-2)', label: 'Reward model score'}],
  4: [{color: 'var(--primary)', label: 'PPO policy model'}],
  5: [{color: 'var(--cat-3)', label: 'DPO direct policy'}]
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
    <rect x="40" y="50" width="420" height="200" rx="12" fill="var(--bg-muted)" stroke="var(--border)"/>
  `;

  if (currentStage === 0) {
    html += `<text x="250" y="150" font-size="16" font-weight="bold" fill="var(--frozen)" text-anchor="middle">Pretrained LLM (Raw Next-Token Predictor)</text>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 1: Base Model:</span> Raw pretrained foundation model trained on next-token prediction.';
  } else if (currentStage === 1) {
    html += `<rect x="70" y="80" width="360" height="140" rx="8" fill="var(--cat-1)" opacity="0.8"/>`;
    html += `<text x="250" y="150" font-size="16" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">SFT Model (Instruction Tuned)</text>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 2: SFT:</span> Model fine-tuned on high-quality instruction-response pairs.';
  } else if (currentStage === 2) {
    html += `<rect x="70" y="70" width="360" height="45" rx="6" fill="var(--success)" opacity="0.9"/>`;
    html += `<text x="250" y="97" font-size="13" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">Chosen: "Here is a helpful, accurate summary."</text>`;
    html += `<rect x="70" y="145" width="360" height="45" rx="6" fill="var(--danger)" opacity="0.9"/>`;
    html += `<text x="250" y="172" font-size="13" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">Rejected: "I refuse to answer that question."</text>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 3: Preferences:</span> Pairwise human feedback dataset collected (Chosen vs Rejected).';
  } else if (currentStage === 3) {
    html += `<rect x="70" y="80" width="360" height="140" rx="8" fill="var(--cat-2)" opacity="0.8"/>`;
    html += `<text x="250" y="140" font-size="16" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">Reward Model R(x, y)</text>`;
    html += `<text x="250" y="170" font-size="13" class="svg-text-on-accent" text-anchor="middle">Chosen reward: +2.4 | Rejected reward: -1.8</text>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 4: Reward Model:</span> Separate reward model trained to output scalar scores matching human preferences.';
  } else if (currentStage === 4) {
    html += `<rect x="70" y="80" width="360" height="140" rx="8" fill="var(--primary)" opacity="0.8"/>`;
    html += `<text x="250" y="140" font-size="16" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">PPO Reinforcement Learning Policy</text>`;
    html += `<text x="250" y="170" font-size="13" class="svg-text-on-accent" text-anchor="middle">Max R(x, y) - &beta; D_KL(&pi; || &pi;_SFT)</text>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 5: PPO Policy:</span> Policy model optimized via RL using reward model feedback and KL constraint.';
  } else if (currentStage === 5) {
    html += `<rect x="70" y="80" width="360" height="140" rx="8" fill="var(--cat-3)" opacity="0.8"/>`;
    html += `<text x="250" y="140" font-size="16" font-weight="bold" class="svg-text-on-accent" text-anchor="middle">DPO Direct Preference Policy</text>`;
    html += `<text x="250" y="170" font-size="13" class="svg-text-on-accent" text-anchor="middle">Closed-form loss on &pi;_&theta; without explicit reward model</text>`;
    explainPanel.innerHTML = '<span class="step-label">Stage 6: DPO Direct:</span> DPO skips reward model training, directly optimizing policy via implicit reward loss.';
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
