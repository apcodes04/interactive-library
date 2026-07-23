(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    function syncIcon(theme) {
      sun.style.display = theme === 'dark' ? 'none' : 'block';
      moon.style.display = theme === 'dark' ? 'block' : 'none';
    }
    syncIcon(initial);
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon(next);
    });

    // Exact shrink factors per spec:
    // RNN: Layer 6=100%, 5=60%, 4=36%, 3=21.6%, 2=13%, 1=7.8%
    // Transformer: Layer 6=100%, 5=95%, 4=90.25%, 3=85.7%, 2=81.5%, 1=77.4%
    const RNN_VALS = [0, 7.8, 13.0, 21.6, 36.0, 60.0, 100.0];
    const TRANS_VALS = [0, 77.4, 81.5, 85.7, 90.25, 95.0, 100.0];

    let currentLayer = 6;
    let autoTimer = null;
    let hasInteracted = false;

    // Build stage strip (Layers 6 down to 1)
    const strip = document.getElementById('layerStrip');
    for (let l = 6; l >= 1; l--) {
      const b = document.createElement('button');
      b.className = `layer-btn ${l === 6 ? 'current' : ''}`;
      b.textContent = `L${l}`;
      b.addEventListener('click', () => setLayer(l));
      strip.appendChild(b);
    }

    // Build stack lists
    const rnnList = document.getElementById('rnnList');
    const transList = document.getElementById('transList');

    for (let l = 1; l <= 6; l++) {
      rnnList.appendChild(createRow('rnn', l));
      transList.appendChild(createRow('trans', l));
    }

    function createRow(prefix, l) {
      const row = document.createElement('div');
      row.className = `layer-row ${prefix}-row-${l}`;
      row.innerHTML = `
        <span class="layer-name">L${l}</span>
        <div class="bar-wrapper">
          <div class="bar-inner" id="${prefix}-bar-${l}"></div>
        </div>
        <span class="percent-text" id="${prefix}-txt-${l}">100%</span>
      `;
      return row;
    }

    function setLayer(targetL) {
      currentLayer = targetL;
      document.getElementById('scrubber').value = targetL;
      document.getElementById('layerReadout').textContent = `Layer ${targetL}`;

      // Update strip buttons
      const btns = strip.querySelectorAll('.layer-btn');
      btns.forEach((b, idx) => {
        const lNum = 6 - idx;
        b.classList.toggle('current', lNum === targetL);
      });

      // Update rows for layers targetL..6
      for (let l = 1; l <= 6; l++) {
        const rnnBar = document.getElementById(`rnn-bar-${l}`);
        const rnnTxt = document.getElementById(`rnn-txt-${l}`);
        const transBar = document.getElementById(`trans-bar-${l}`);
        const transTxt = document.getElementById(`trans-txt-${l}`);

        if (l >= targetL) {
          const rVal = RNN_VALS[l];
          const tVal = TRANS_VALS[l];

          rnnBar.style.width = `${rVal}%`;
          rnnTxt.textContent = `${rVal.toFixed(1)}%`;
          rnnBar.style.backgroundColor = rVal < 30 ? 'var(--danger)' : 'var(--primary)';

          transBar.style.width = `${tVal}%`;
          transTxt.textContent = `${tVal.toFixed(1)}%`;
          transBar.style.backgroundColor = 'var(--success)';
        } else {
          rnnBar.style.width = `0%`;
          rnnTxt.textContent = `—`;
          transBar.style.width = `0%`;
          transTxt.textContent = `—`;
        }
      }

      // Highlight current layer row
      for (let l = 1; l <= 6; l++) {
        document.querySelector(`.rnn-row-${l}`).classList.toggle('active', l === targetL);
        document.querySelector(`.trans-row-${l}`).classList.toggle('active', l === targetL);
      }

      // Dynamic legend
      const rnnCur = RNN_VALS[targetL];
      const transCur = TRANS_VALS[targetL];

      const legend = document.getElementById('legend');
      legend.innerHTML = `
        <div class="legend-item"><span class="legend-dot" style="background:${rnnCur < 30 ? 'var(--danger)' : 'var(--primary)'}"></span> RNN Gradient Signal (${rnnCur.toFixed(1)}%)</div>
        <div class="legend-item"><span class="legend-dot" style="background:var(--success)"></span> Transformer Residual Highway (${transCur.toFixed(1)}%)</div>
      `;

      document.getElementById('explainPanel').textContent =
        `Backward at Layer ${targetL}: RNN gradient signal decayed to ${rnnCur.toFixed(1)}% (vanishing gradient!). Transformer residual path preserves ${transCur.toFixed(1)}% signal strength.`;

      if (!hasInteracted && targetL < 6) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('scrubber').addEventListener('input', (e) => {
      setLayer(parseInt(e.target.value, 10));
    });

    document.getElementById('propBtn').addEventListener('click', () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
        document.getElementById('propBtn').textContent = 'Propagate ▶';
        return;
      }
      document.getElementById('propBtn').textContent = 'Pause ❚❚';
      let l = 6;
      setLayer(6);
      autoTimer = setInterval(() => {
        l--;
        if (l < 1) {
          clearInterval(autoTimer);
          autoTimer = null;
          document.getElementById('propBtn').textContent = 'Propagate ▶';
        } else {
          setLayer(l);
        }
      }, 600);
    });

    document.getElementById('prevBtn').addEventListener('click', () => { if (currentLayer < 6) setLayer(currentLayer + 1); });
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('propBtn').textContent = 'Propagate ▶'; }
      setLayer(6);
    });

    setLayer(6);
  });
})();
