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
        title: "S0: Embedding Space",
        explain: "Initial 2D vocabulary embedding space before gradient update.",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: false,
        legend: [{ label: "Vocabulary Words", color: "var(--primary)" }]
      },
      {
        step: 1,
        title: "S1: Target Word Highlighted",
        explain: "Target word 'tired' selected at (20.0, 78.0) near 'happy' and 'sad'.",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: false,
        highlightTired: true,
        legend: [{ label: "Target Word ('tired')", color: "var(--active)" }, { label: "Vocabulary Words", color: "var(--primary)" }]
      },
      {
        step: 2,
        title: "S2: Gradient Computed",
        explain: "Loss gradient wrt embedding vector computed: ∇L = (dx = +3.4, dy = +1.8).",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: true,
        highlightTired: true,
        legend: [{ label: "Target Word", color: "var(--active)" }, { label: "Gradient Vector ∇L", color: "var(--danger)" }]
      },
      {
        step: 3,
        title: "S3: Gradient Direction Arrow",
        explain: "Gradient vector points in direction that reduces classification loss.",
        tiredPos: { x: 20.0, y: 78.0 },
        showGrad: true,
        highlightTired: true,
        legend: [{ label: "Target Word", color: "var(--active)" }, { label: "Gradient Vector ∇L", color: "var(--danger)" }]
      },
      {
        step: 4,
        title: "S4: Nudge Embedding",
        explain: "Embedding vector updated: e_new = e_old + α * ∇L → new position (23.4, 79.8).",
        tiredPos: { x: 23.4, y: 79.8 },
        showGrad: false,
        highlightTired: true,
        legend: [{ label: "Nudged Position", color: "var(--success)" }, { label: "Vocabulary Words", color: "var(--primary)" }]
      },
      {
        step: 5,
        title: "S5: Recalculate Neighbors",
        explain: "Nearest semantic neighbors updated! 'tired' is now closer to its context cluster.",
        tiredPos: { x: 23.4, y: 79.8 },
        showGrad: false,
        highlightTired: true,
        showNeighbors: true,
        legend: [{ label: "Updated Embedding", color: "var(--success)" }, { label: "Nearest Neighbors", color: "var(--primary-light)" }]
      }
    ];

    let currentStep = 0;
    let autoPlayTimer = null;
    let hasInteracted = false;

    const container = document.getElementById('chartContainer');
    const w = container.clientWidth || 700;
    const h = 340;
    const margin = { top: 30, right: 40, bottom: 40, left: 40 };

    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scaleLinear().domain([0, 100]).range([margin.left, w - margin.right]);
    const yS = d3.scaleLinear().domain([0, 100]).range([h - margin.bottom, margin.top]);

    // Grid
    for (let x = 0; x <= 100; x += 20) {
      svg.append('line').attr('x1', xS(x)).attr('y1', yS(0)).attr('x2', xS(x)).attr('y2', yS(100)).attr('stroke', 'var(--border)').attr('opacity', 0.4);
    }
    for (let y = 0; y <= 100; y += 20) {
      svg.append('line').attr('x1', xS(0)).attr('y1', yS(y)).attr('x2', xS(100)).attr('y2', yS(y)).attr('stroke', 'var(--border)').attr('opacity', 0.4);
    }

    const linesGroup = svg.append('g');
    const gradGroup = svg.append('g');
    const dotsGroup = svg.append('g');

    // Build stage strip
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

      // Draw dots
      dotsGroup.selectAll('*').remove();
      vocab.forEach(v => {
        const isTired = v.word === "tired";
        const pos = isTired ? st.tiredPos : v;

        const node = dotsGroup.append('g').attr('transform', `translate(${xS(pos.x)},${yS(pos.y)})`);
        let color = 'var(--primary)';
        let radius = 6;

        if (isTired) {
          color = step >= 4 ? 'var(--success)' : (st.highlightTired ? 'var(--active)' : 'var(--primary)');
          radius = 8;
        }

        node.append('circle').attr('r', radius).attr('fill', color);
        node.append('text').attr('x', 9).attr('y', 4).attr('font-size', '13px').attr('font-weight', isTired ? 'bold' : '600').attr('fill', color).text(v.word);
      });

      // Gradient Arrow
      gradGroup.selectAll('*').remove();
      if (st.showGrad) {
        const startX = xS(20.0), startY = yS(78.0);
        const endX = xS(23.4), endY = yS(79.8);

        gradGroup.append('line')
          .attr('x1', startX).attr('y1', startY)
          .attr('x2', endX).attr('y2', endY)
          .attr('stroke', 'var(--danger)')
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#arrow-grad)');

        gradGroup.append('text')
          .attr('x', (startX + endX) / 2 + 10)
          .attr('y', (startY + endY) / 2 - 5)
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .attr('fill', 'var(--danger)')
          .text('∇L (+3.4, +1.8)');
      }

      // Nearest neighbor lines for S5
      linesGroup.selectAll('*').remove();
      if (st.showNeighbors) {
        const nList = [
          { x: 25, y: 75 }, // happy
          { x: 22, y: 80 }  // sad
        ];
        nList.forEach(n => {
          linesGroup.append('line')
            .attr('x1', xS(st.tiredPos.x)).attr('y1', yS(st.tiredPos.y))
            .attr('x2', xS(n.x)).attr('y2', yS(n.y))
            .attr('stroke', 'var(--primary-light)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4 3');
        });
      }

      // Dynamic legend
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
        document.getElementById('runBtn').textContent = 'Nudge word (auto-play)';
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
          document.getElementById('runBtn').textContent = 'Nudge word (auto-play)';
        } else {
          setStep(s);
        }
      }, 1000);
    });

    document.getElementById('nextBtn').addEventListener('click', () => { if (currentStep < 5) setStep(currentStep + 1); });
    document.getElementById('prevBtn').addEventListener('click', () => { if (currentStep > 0) setStep(currentStep - 1); });
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; document.getElementById('runBtn').textContent = 'Nudge word (auto-play)'; }
      setStep(0);
    });

    setStep(0);
  });
})();
