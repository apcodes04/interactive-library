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

    const labels = ["Logit A", "Logit B", "Logit C", "Logit D", "Logit E"];
    const initialLogits = [2, 1, 0, -1, -2];
    let logits = [...initialLogits];
    let hasInteracted = false;

    const w = 320, h = 120, margin = { top: 15, right: 15, bottom: 25, left: 30 };

    const svgLogits = d3.select('#chartLogits').append('svg').attr('width', w).attr('height', h);
    const svgProbs = d3.select('#chartProbs').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scaleBand().domain(labels).range([margin.left, w - margin.right]).padding(0.3);
    const ySLogits = d3.scaleLinear().domain([-5, 5]).range([h - margin.bottom, margin.top]);
    const ySProbs = d3.scaleLinear().domain([0, 100]).range([h - margin.bottom, margin.top]);

    svgLogits.append('g').attr('transform', `translate(0,${ySLogits(0)})`).call(d3.axisBottom(xS));
    svgLogits.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(ySLogits).ticks(4));

    svgProbs.append('g').attr('transform', `translate(0,${h - margin.bottom})`).call(d3.axisBottom(xS));
    svgProbs.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(ySProbs).ticks(3).tickFormat(d => `${d}%`));

    const container = document.getElementById('slidersRow');
    labels.forEach((lbl, i) => {
      const g = document.createElement('div');
      g.className = 'slider-group';
      g.innerHTML = `
        <label>${lbl}</label>
        <input type="range" id="sl-${i}" min="-5" max="5" step="0.1" value="${logits[i]}">
        <span id="txt-${i}">${logits[i].toFixed(1)}</span>
      `;
      container.appendChild(g);
      g.querySelector('input').addEventListener('input', (e) => {
        logits[i] = parseFloat(e.target.value);
        document.getElementById(`txt-${i}`).textContent = logits[i].toFixed(1);
        update();
      });
    });

    function computeSoftmax(arr) {
      const exps = arr.map(v => Math.exp(v));
      const sum = exps.reduce((a, b) => a + b, 0);
      return exps.map(v => (v / sum) * 100);
    }

    function update() {
      const probs = computeSoftmax(logits);

      const logitBars = svgLogits.selectAll('.bar-logit').data(logits);
      logitBars.enter().append('rect').attr('class', 'bar-logit')
        .merge(logitBars)
        .attr('x', (d, i) => xS(labels[i]))
        .attr('y', d => d >= 0 ? ySLogits(d) : ySLogits(0))
        .attr('width', xS.bandwidth())
        .attr('height', d => Math.abs(ySLogits(d) - ySLogits(0)))
        .attr('fill', 'var(--primary)');

      const probBars = svgProbs.selectAll('.bar-prob').data(probs);
      probBars.enter().append('rect').attr('class', 'bar-prob')
        .merge(probBars)
        .attr('x', (d, i) => xS(labels[i]))
        .attr('y', d => ySProbs(d))
        .attr('width', xS.bandwidth())
        .attr('height', d => ySProbs(0) - ySProbs(d))
        .attr('fill', 'var(--active)');

      const maxIdx = probs.indexOf(Math.max(...probs));
      document.getElementById('explainPanel').textContent =
        `Top: ${labels[maxIdx]} at ${probs[maxIdx].toFixed(1)}%. Softmax sum = 100%.`;

      if (!hasInteracted && logits.some((v, idx) => v !== initialLogits[idx])) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
      logits = [...initialLogits];
      logits.forEach((v, i) => {
        document.getElementById(`sl-${i}`).value = v;
        document.getElementById(`txt-${i}`).textContent = v.toFixed(1);
      });
      update();
    });

    update();
  });
})();
