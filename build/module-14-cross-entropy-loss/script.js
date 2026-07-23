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

    let hasInteracted = false;

    const w = 680, h = 260, margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scaleLinear().domain([0, 1.0]).range([margin.left, w - margin.right]);
    const yS = d3.scaleLinear().domain([0, 4.6]).range([h - margin.bottom, margin.top]);

    svg.append('g').attr('transform', `translate(0,${h - margin.bottom})`).call(d3.axisBottom(xS).ticks(10));
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yS).ticks(5));

    // Axis labels
    svg.append('text').attr('x', w / 2).attr('y', h - 5).attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', 'var(--text-muted)').text('Predicted Probability (p)');
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', 15).attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', 'var(--text-muted)').text('Loss L(p) = −ln(p)');

    // Line curve
    const points = d3.range(0.01, 1.01, 0.01).map(p => ({ p, loss: -Math.log(p) }));
    const line = d3.line().x(d => xS(d.p)).y(d => yS(d.loss));

    svg.append('path').datum(points).attr('fill', 'none').attr('stroke', 'var(--primary)').attr('stroke-width', 3).attr('d', line);

    // Tracking dot & guide lines
    const guideX = svg.append('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '3 3');
    const guideY = svg.append('line').attr('stroke', 'var(--border)').attr('stroke-dasharray', '3 3');
    const dot = svg.append('circle').attr('r', 7).attr('fill', 'var(--active)');

    function update(p) {
      document.getElementById('pReadout').textContent = p.toFixed(2);
      const loss = -Math.log(p);

      let color = 'var(--active)';
      let stateLabel = '';

      if (p > 0.7) {
        color = 'var(--success)';
        stateLabel = `Low Loss (${loss.toFixed(3)}) — Model is confident and correct!`;
      } else if (p >= 0.3) {
        color = 'var(--active)';
        stateLabel = `Moderate Loss (${loss.toFixed(3)}) — Model is uncertain.`;
      } else {
        color = 'var(--danger)';
        stateLabel = `Severe High Loss (${loss.toFixed(3)}) — Model is confidently wrong! Penalty explodes as p → 0.`;
      }

      const readoutEl = document.getElementById('lossReadout');
      readoutEl.textContent = loss.toFixed(3);
      readoutEl.style.color = color;

      const cx = xS(p);
      const cy = yS(Math.min(loss, 4.5));

      dot.attr('cx', cx).attr('cy', cy).attr('fill', color);
      guideX.attr('x1', cx).attr('y1', cy).attr('x2', cx).attr('y2', h - margin.bottom);
      guideY.attr('x1', margin.left).attr('y1', cy).attr('x2', cx).attr('y2', cy);

      document.getElementById('explainPanel').textContent =
        `At p = ${p.toFixed(2)}: ${stateLabel}`;

      if (!hasInteracted && Math.abs(p - 0.5) > 0.05) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    const slider = document.getElementById('pSlider');
    slider.addEventListener('input', (e) => {
      update(parseFloat(e.target.value));
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      slider.value = 0.5;
      update(0.5);
    });

    update(0.5);
  });
})();
