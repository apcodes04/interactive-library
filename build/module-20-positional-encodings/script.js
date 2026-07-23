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
    const d = 8; // dimension

    // Formulas:
    // PE(pos, 2i)   = sin(pos / 10000^(2i/d))
    // PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
    // i=0: freq0 = 10000^0 = 1
    // i=1: freq1 = 10000^(2/8) = 10000^0.25 = 10

    function getPE(pos) {
      const f0 = Math.pow(10000, 0 / d);  // 1
      const f1 = Math.pow(10000, 2 / d);  // 10

      return [
        Math.sin(pos / f0),
        Math.cos(pos / f0),
        Math.sin(pos / f1),
        Math.cos(pos / f1)
      ];
    }

    const w = 680, h = 260, margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scaleLinear().domain([0, 50]).range([margin.left, w - margin.right]);
    const yS = d3.scaleLinear().domain([-1.2, 1.2]).range([h - margin.bottom, margin.top]);

    svg.append('g').attr('transform', `translate(0,${yS(0)})`).call(d3.axisBottom(xS).ticks(10));
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yS).ticks(5));

    // Points for 4 curves
    const posRange = d3.range(0, 50.1, 0.2);
    const curve0 = posRange.map(pos => ({ pos, val: getPE(pos)[0] }));
    const curve1 = posRange.map(pos => ({ pos, val: getPE(pos)[1] }));
    const curve2 = posRange.map(pos => ({ pos, val: getPE(pos)[2] }));
    const curve3 = posRange.map(pos => ({ pos, val: getPE(pos)[3] }));

    const line = d3.line().x(d => xS(d.pos)).y(d => yS(d.val));

    // i=0 curves (primary)
    svg.append('path').datum(curve0).attr('fill', 'none').attr('stroke', 'var(--primary)').attr('stroke-width', 2.5).attr('d', line);
    svg.append('path').datum(curve1).attr('fill', 'none').attr('stroke', 'var(--primary)').attr('stroke-width', 2).attr('stroke-dasharray', '5 3').attr('d', line);

    // i=1 curves (active)
    svg.append('path').datum(curve2).attr('fill', 'none').attr('stroke', 'var(--active)').attr('stroke-width', 2.5).attr('d', line);
    svg.append('path').datum(curve3).attr('fill', 'none').attr('stroke', 'var(--active)').attr('stroke-width', 2).attr('stroke-dasharray', '5 3').attr('d', line);

    // Marker line & dots
    const markerLine = svg.append('line').attr('stroke', 'var(--text)').attr('stroke-width', 2).attr('stroke-dasharray', '4 4');
    const dots = [
      svg.append('circle').attr('r', 5).attr('fill', 'var(--primary)'),
      svg.append('circle').attr('r', 5).attr('fill', 'var(--primary)'),
      svg.append('circle').attr('r', 5).attr('fill', 'var(--active)'),
      svg.append('circle').attr('r', 5).attr('fill', 'var(--active)')
    ];

    function update(pos) {
      document.getElementById('posReadout').textContent = pos;
      const pe = getPE(pos);

      pe.forEach((v, idx) => {
        document.getElementById(`v${idx}`).textContent = v.toFixed(3);
      });

      const cx = xS(pos);
      markerLine.attr('x1', cx).attr('y1', margin.top).attr('x2', cx).attr('y2', h - margin.bottom);

      pe.forEach((v, idx) => {
        dots[idx].attr('cx', cx).attr('cy', yS(v));
      });

      document.getElementById('explainPanel').textContent =
        `At Token Position ${pos}: Unique 4-dim encoding vector PE(${pos}) = [${pe.map(v => v.toFixed(2)).join(', ')}]. Added directly to input embedding!`;

      if (!hasInteracted && pos > 0) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    const slider = document.getElementById('posSlider');
    slider.addEventListener('input', (e) => {
      update(parseInt(e.target.value, 10));
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      slider.value = 0;
      update(0);
    });

    update(0);
  });
})();
