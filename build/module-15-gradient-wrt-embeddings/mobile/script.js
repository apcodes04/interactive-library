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

    const vocab = [
      { word: "cat", x: 12, y: 45 },
      { word: "dog", x: 15, y: 48 },
      { word: "mat", x: 60, y: 20 },
      { word: "sat", x: 55, y: 25 },
      { word: "tired", x: 20, y: 78 },
      { word: "chef", x: 80, y: 40 },
      { word: "dish", x: 82, y: 20 },
      { word: "Paris", x: 90, y: 60 },
      { word: "trained", x: 70, y: 65 },
      { word: "prepared", x: 78, y: 30 },
      { word: "happy", x: 25, y: 75 },
      { word: "sad", x: 22, y: 80 }
    ];

    const STAGES = [
      {
        step: 0,
        explain: "Initial 2D vocabulary space.",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: false,
        legend: [{ label: "Vocab", color: "var(--primary)" }]
      },
      {
        step: 1,
        explain: "'tired' selected at (20.0, 78.0).",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: false,
        highlightTired: true,
        legend: [{ label: "Target", color: "var(--active)" }, { label: "Vocab", color: "var(--primary)" }]
      },
      {
        step: 2,
        explain: "Gradient ∇L = (+3.4, +1.8) computed.",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: true,
        highlightTired: true,
        legend: [{ label: "Target", color: "var(--active)" }, { label: "∇L", color: "var(--danger)" }]
      },
      {
        step: 3,
        explain: "Gradient vector points towards context.",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: true,
        highlightTired: true,
        legend: [{ label: "Target", color: "var(--active)" }, { label: "∇L", color: "var(--danger)" }]
      },
      {
        step: 4,
        explain: "Embedding nudged to (23.4, 79.8).",
        tiredPos: { x: 23.4, y: 79.8 },
        showGrad: false,
        highlightTired: true,
        legend: [{ label: "Nudged", color: "var(--success)" }, { label: "Vocab", color: "var(--primary)" }]
      },
      {
        step: 5,
        explain: "Nearest neighbors updated!",
        tiredPos: { x: 23.4, y: 79.8 },
        showGrad: false,
        highlightTired: true,
        showNeighbors: true,
        legend: [{ label: "Updated", color: "var(--success)" }, { label: "Neighbors", color: "var(--primary-light)" }]
      }
    ];

    let currentStep = 0;
    let autoPlayTimer = null;
    let hasInteracted = false;

    const w = 320, h = 280, margin = { top: 20, right: 25, bottom: 30, left: 30 };
    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scaleLinear().domain([0, 100]).range([margin.left, w - margin.right]);
    const yS = d3.scaleLinear().domain([0, 100]).range([h - margin.bottom, margin.top]);

    for (let x = 0; x <= 100; x += 25) {
      svg.append('line').attr('x1', xS(x)).attr('y1', yS(0)).attr('x2', xS(x)).attr('y2', yS(100)).attr('stroke', 'var(--border)').attr('opacity', 0.4);
    }
    for (let y = 0; y <= 100; y += 25) {
      svg.append('line').attr('x1', xS(0)).attr('y1', yS(y)).attr('x2', xS(100)).attr('y2', yS(y)).attr('stroke', 'var(--border)').attr('opacity', 0.4);
    }

    const linesGroup = svg.append('g');
    const gradGroup = svg.append('g');
    const dotsGroup = svg.append('g');

    const strip = document.getElementById('stageStrip');
    for (let i = 0; i <= 5; i++) {
      const b = document.createElement('button');
      b.className = `stage-btn ${i === 0 ? 'current' : ''}`;
      b.textContent = `S${i}`;
      b.addEventListener('click', () => setStep(i));
      strip.appendChild(b);
    }

    function setStep(step) {
      currentStep = step;
      document.getElementById('scrubber').value = step;
      document.getElementById('stageReadout').textContent = `${step} / 5`;

      const st = STAGES[step];

      const btns = strip.querySelectorAll('.stage-btn');
      btns.forEach((b, idx) => b.classList.toggle('current', idx === step));

      dotsGroup.selectAll('*').remove();
      vocab.forEach(v => {
        const isTired = v.word === "tired";
        const pos = isTired ? st.tiredPos : v;

        const node = dotsGroup.append('g').attr('transform', `translate(${xS(pos.x)},${yS(pos.y)})`);
        let color = 'var(--primary)';
        let radius = 5;

        if (isTired) {
          color = step >= 4 ? 'var(--success)' : (st.highlightTired ? 'var(--active)' : 'var(--primary)');
          radius = 7;
        }

        node.append('circle').attr('r', radius).attr('fill', color);
        node.append('text').attr('x', 8).attr('y', 4).attr('font-size', '11px').attr('font-weight', isTired ? 'bold' : '600').attr('fill', color).text(v.word);
      });

      gradGroup.selectAll('*').remove();
      if (st.showGrad) {
        const startX = xS(20.0), startY = yS(78.0);
        const endX = xS(23.4), endY = yS(79.8);

        gradGroup.append('line')
          .attr('x1', startX).attr('y1', startY)
          .attr('x2', endX).attr('y2', endY)
          .attr('stroke', 'var(--danger)')
          .attr('stroke-width', 2.5);
      }

      linesGroup.selectAll('*').remove();
      if (st.showNeighbors) {
        const nList = [{ x: 25, y: 75 }, { x: 22, y: 80 }];
        nList.forEach(n => {
          linesGroup.append('line')
            .attr('x1', xS(st.tiredPos.x)).attr('y1', yS(st.tiredPos.y))
            .attr('x2', xS(n.x)).attr('y2', yS(n.y))
            .attr('stroke', 'var(--primary-light)')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '3 3');
        });
      }

      const legend = document.getElementById('legend');
      legend.innerHTML = '';
      st.legend.forEach(lg => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `<span class="legend-dot" style="background:${lg.color}"></span> ${lg.label}`;
        legend.appendChild(item);
      });

      document.getElementById('explainPanel').textContent = st.explain;

      if (!hasInteracted && step > 0) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('scrubber').addEventListener('input', (e) => {
      setStep(parseInt(e.target.value, 10));
    });

    document.getElementById('runBtn').addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        document.getElementById('runBtn').textContent = 'Nudge (auto-play)';
        return;
      }
      document.getElementById('runBtn').textContent = 'Pause ❚❚';
      let s = 0;
      setStep(0);
      autoPlayTimer = setInterval(() => {
        s++;
        if (s > 5) {
          clearInterval(autoPlayTimer);
          autoPlayTimer = null;
          document.getElementById('runBtn').textContent = 'Nudge (auto-play)';
        } else {
          setStep(s);
        }
      }, 1000);
    });

    document.getElementById('nextBtn').addEventListener('click', () => { if (currentStep < 5) setStep(currentStep + 1); });
    document.getElementById('prevBtn').addEventListener('click', () => { if (currentStep > 0) setStep(currentStep - 1); });
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; document.getElementById('runBtn').textContent = 'Nudge (auto-play)'; }
      setStep(0);
    });

    setStep(0);
  });
})();
