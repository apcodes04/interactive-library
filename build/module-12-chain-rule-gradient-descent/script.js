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

    const STAGES = [
      {
        step: 0,
        title: "Step 0: Initial Graph",
        explain: "Initial computational graph for x = 3. Click Forward Pass or Step 1 to begin.",
        fwd: {},
        bwd: {},
        legend: []
      },
      {
        step: 1,
        title: "Step 1: Input x = 3",
        explain: "Forward Pass (Step 1): Input value x = 3 entered into graph.",
        fwd: { x: 3 },
        bwd: {},
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }]
      },
      {
        step: 2,
        title: "Step 2: f(x) = 2x = 6",
        explain: "Forward Pass (Step 2): Intermediate node f(x) = 2 * 3 = 6.",
        fwd: { x: 3, f: 6 },
        bwd: {},
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }]
      },
      {
        step: 3,
        title: "Step 3: g(f) = f² = 36",
        explain: "Forward Pass (Step 3): Output node g(f) = 6² = 36.",
        fwd: { x: 3, f: 6, g: 36 },
        bwd: {},
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }]
      },
      {
        step: 4,
        title: "Step 4: Loss = 36",
        explain: "Forward Pass (Step 4): Final Loss = g = 36 evaluated. Forward pass complete!",
        fwd: { x: 3, f: 6, g: 36, loss: 36 },
        bwd: {},
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }]
      },
      {
        step: 5,
        title: "Step 5: dLoss/dg = 1",
        explain: "Backward Pass (Step 5): Base gradient d(loss)/d(g) = 1.",
        fwd: { x: 3, f: 6, g: 36, loss: 36 },
        bwd: { g: "dLoss/dg = 1" },
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }, { label: "Backward Gradient", color: "var(--active)" }]
      },
      {
        step: 6,
        title: "Step 6: dLoss/df = 12",
        explain: "Backward Pass (Step 6): Chain rule applied! dLoss/df = (dLoss/dg) * (dg/df) = 1 * (2 * 6) = 12.",
        fwd: { x: 3, f: 6, g: 36, loss: 36 },
        bwd: { g: "dLoss/dg = 1", f: "dLoss/df = 12" },
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }, { label: "Backward Gradient", color: "var(--active)" }]
      },
      {
        step: 7,
        title: "Step 7: dLoss/dx = 24",
        explain: "Backward Pass (Step 7): Final gradient dLoss/dx = (dLoss/df) * (df/dx) = 12 * 2 = 24.",
        fwd: { x: 3, f: 6, g: 36, loss: 36 },
        bwd: { g: "dLoss/dg = 1", f: "dLoss/df = 12", x: "dLoss/dx = 24" },
        legend: [{ label: "Forward Pass Value", color: "var(--primary)" }, { label: "Backward Gradient", color: "var(--active)" }]
      }
    ];

    let currentStep = 0;
    let hasInteracted = false;

    // Build stage strip
    const strip = document.getElementById('stageStrip');
    for (let i = 0; i <= 7; i++) {
      const b = document.createElement('button');
      b.className = `stage-btn ${i === 0 ? 'current' : ''}`;
      b.textContent = `S${i}`;
      b.addEventListener('click', () => setStep(i));
      strip.appendChild(b);
    }

    function setStep(step) {
      currentStep = step;
      document.getElementById('scrubber').value = step;
      document.getElementById('stageReadout').textContent = `${step} / 7`;

      const st = STAGES[step];

      // Update stage strip buttons
      const btns = strip.querySelectorAll('.stage-btn');
      btns.forEach((b, idx) => {
        b.classList.toggle('current', idx === step);
      });

      // Update nodes
      document.getElementById('valX').textContent = st.fwd.x !== undefined ? st.fwd.x : '—';
      document.getElementById('valF').textContent = st.fwd.f !== undefined ? st.fwd.f : '—';
      document.getElementById('valG').textContent = st.fwd.g !== undefined ? st.fwd.g : '—';
      document.getElementById('valLoss').textContent = st.fwd.loss !== undefined ? st.fwd.loss : '—';

      document.getElementById('gradX').textContent = st.bwd.x || '';
      document.getElementById('gradF').textContent = st.bwd.f || '';
      document.getElementById('gradG').textContent = st.bwd.g || '';

      // Node highlights
      document.getElementById('nodeX').className = `graph-node ${st.bwd.x ? 'active-bwd' : (st.fwd.x !== undefined ? 'active-fwd' : '')}`;
      document.getElementById('nodeF').className = `graph-node ${st.bwd.f ? 'active-bwd' : (st.fwd.f !== undefined ? 'active-fwd' : '')}`;
      document.getElementById('nodeG').className = `graph-node ${st.bwd.g ? 'active-bwd' : (st.fwd.g !== undefined ? 'active-fwd' : '')}`;
      document.getElementById('nodeLoss').className = `graph-node loss-node ${st.fwd.loss !== undefined ? 'active-fwd' : ''}`;

      // Update dynamic legend
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

    document.getElementById('fwdBtn').addEventListener('click', () => setStep(4));
    document.getElementById('bwdBtn').addEventListener('click', () => setStep(7));
    document.getElementById('nextBtn').addEventListener('click', () => { if (currentStep < 7) setStep(currentStep + 1); });
    document.getElementById('prevBtn').addEventListener('click', () => { if (currentStep > 0) setStep(currentStep - 1); });
    document.getElementById('resetBtn').addEventListener('click', () => setStep(0));

    setStep(0);
  });
})();
