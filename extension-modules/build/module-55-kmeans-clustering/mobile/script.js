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
  0: [{color: 'var(--frozen)', label: 'Unclustered point'}],
  1: [{color: 'var(--frozen)', label: 'Point'}, {color: 'var(--danger)', label: 'Centroid marker'}],
  2: [{color: 'var(--cat-1)', label: 'Cluster 1'}, {color: 'var(--cat-2)', label: 'Cluster 2'}, {color: 'var(--cat-3)', label: 'Cluster 3'}],
  3: [{color: 'var(--cat-1)', label: 'Cluster 1'}, {color: 'var(--cat-2)', label: 'Cluster 2'}, {color: 'var(--cat-3)', label: 'Cluster 3'}, {color: 'var(--primary)', label: 'Shift vector'}],
  4: [{color: 'var(--cat-1)', label: 'Cluster 1'}, {color: 'var(--cat-2)', label: 'Cluster 2'}, {color: 'var(--cat-3)', label: 'Cluster 3'}],
  5: [{color: 'var(--cat-1)', label: 'Cluster 1'}, {color: 'var(--cat-2)', label: 'Cluster 2'}, {color: 'var(--cat-3)', label: 'Cluster 3'}, {color: 'var(--success)', label: 'Voronoi region boundary'}]
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
    {x:20,y:25},{x:15,y:20},{x:25,y:30},{x:18,y:28},{x:22,y:22},{x:28,y:18},{x:12,y:24},{x:24,y:15},{x:19,y:32},{x:26,y:27},
    {x:70,y:30},{x:65,y:35},{x:75,y:25},{x:68,y:28},{x:72,y:32},{x:78,y:38},{x:62,y:24},{x:74,y:18},{x:69,y:36},{x:76,y:29},
    {x:45,y:80},{x:40,y:75},{x:50,y:85},{x:48,y:78},{x:42,y:82},{x:52,y:88},{x:38,y:74},{x:54,y:78},{x:46,y:86},{x:49,y:72}
  ];

  const centroidsStage1 = [{x:30,y:50},{x:60,y:50},{x:50,y:40}];
  const centroidsStage3 = [{x:21,y:24},{x:71,y:30},{x:46,y:80}];

  const mapX = x => 30 + (x / 100) * 440;
  const mapY = y => 270 - (y / 100) * 240;

  let html = `
    <line x1="30" y1="270" x2="470" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
    <line x1="30" y1="30" x2="30" y2="270" stroke="var(--text-muted)" stroke-width="1"/>
  `;

  if (currentStage === 0) {
    pts.forEach(p => {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--frozen)"/>`;
    });
    explainPanel.innerHTML = '<span class="step-label">Stage 1: All Data:</span> 30 unclustered data points ready for grouping.';
  } else if (currentStage === 1) {
    pts.forEach(p => {
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="var(--frozen)"/>`;
    });
    centroidsStage1.forEach((c, idx) => {
      html += `<polygon points="${mapX(c.x)},${mapY(c.x)-8} ${mapX(c.x)-7},${mapY(c.x)+6} ${mapX(c.x)+7},${mapY(c.x)+6}" fill="var(--danger)"/>`;
    });
    explainPanel.innerHTML = '<span class="step-label">Stage 2: Initial Centroids:</span> 3 initial cluster seeds randomly placed.';
  } else {
    // Stage 2..5
    pts.forEach((p, idx) => {
      const cluster = idx < 10 ? 1 : (idx < 20 ? 2 : 3);
      const col = cluster === 1 ? 'var(--cat-1)' : (cluster === 2 ? 'var(--cat-2)' : 'var(--cat-3)');
      html += `<circle cx="${mapX(p.x)}" cy="${mapY(p.y)}" r="4.5" fill="${col}"/>`;
    });

    centroidsStage3.forEach((c, idx) => {
      const col = idx === 0 ? 'var(--cat-1)' : (idx === 1 ? 'var(--cat-2)' : 'var(--cat-3)');
      html += `<polygon points="${mapX(c.x)},${mapY(c.y)-9} ${mapX(c.x)-8},${mapY(c.y)+7} ${mapX(c.x)+8},${mapY(c.y)+7}" fill="${col}" stroke="var(--text)" stroke-width="1.5"/>`;
    });

    if (currentStage === 2) explainPanel.innerHTML = '<span class="step-label">Stage 3: Assign Iter 1:</span> Points color-coded to their nearest initial centroid.';
    else if (currentStage === 3) explainPanel.innerHTML = '<span class="step-label">Stage 4: Update Iter 1:</span> Centroids move to the center of mass of their assigned points.';
    else if (currentStage === 4) explainPanel.innerHTML = '<span class="step-label">Stage 5: Assign Iter 2:</span> Re-assigning points to updated centroids (membership stable).';
    else if (currentStage === 5) explainPanel.innerHTML = '<span class="step-label">Stage 6: Converged:</span> No points change clusters; K-Means has converged with minimum total variance.';
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
