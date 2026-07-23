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

    const w = 320, h = 160, margin = { top: 15, right: 15, bottom: 25, left: 30 };

    const svgFx = d3.select('#chartFx').append('svg').attr('width', w).attr('height', h);
    const svgFxP = d3.select('#chartFxPrime').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scaleLinear().domain([-5, 5]).range([margin.left, w - margin.right]);
    const yS1 = d3.scaleLinear().domain([-1, 5]).range([h - margin.bottom, margin.top]);
    const yS2 = d3.scaleLinear().domain([-0.5, 1.5]).range([h - margin.bottom, margin.top]);

    svgFx.append('g').attr('transform', `translate(0,${yS1(0)})`).call(d3.axisBottom(xS).ticks(5));
    svgFx.append('g').attr('transform', `translate(${xS(0)},0)`).call(d3.axisLeft(yS1).ticks(4));

    svgFxP.append('g').attr('transform', `translate(0,${yS2(0)})`).call(d3.axisBottom(xS).ticks(5));
    svgFxP.append('g').attr('transform', `translate(${xS(0)},0)`).call(d3.axisLeft(yS2).ticks(3));

    const fxData = d3.range(-5, 5.1, 0.1).map(x => ({ x, y: Math.max(0, x) }));
    const line1 = d3.line().x(d => xS(d.x)).y(d => yS1(d.y));
    svgFx.append('path').datum(fxData).attr('fill', 'none').attr('stroke', 'var(--primary)').attr('stroke-width', 2.5).attr('d', line1);

    const fxPDataLeft = d3.range(-5, 0, 0.1).map(x => ({ x, y: 0 }));
    const fxPDataRight = d3.range(0.01, 5.1, 0.1).map(x => ({ x, y: 1 }));
    const line2 = d3.line().x(d => xS(d.x)).y(d => yS2(d.y));

    svgFxP.append('path').datum(fxPDataLeft).attr('fill', 'none').attr('stroke', 'var(--primary)').attr('stroke-width', 2.5).attr('d', line2);
    svgFxP.append('path').datum(fxPDataRight).attr('fill', 'none').attr('stroke', 'var(--primary)').attr('stroke-width', 2.5).attr('d', line2);

    svgFxP.append('circle').attr('cx', xS(0)).attr('cy', yS2(0)).attr('r', 3.5).attr('fill', 'var(--bg)').attr('stroke', 'var(--danger)').attr('stroke-width', 1.5);
    svgFxP.append('circle').attr('cx', xS(0)).attr('cy', yS2(1)).attr('r', 3.5).attr('fill', 'var(--bg)').attr('stroke', 'var(--danger)').attr('stroke-width', 1.5);

    const dot1 = svgFx.append('circle').attr('r', 5).attr('fill', 'var(--active)');
    const dot2 = svgFxP.append('circle').attr('r', 5).attr('fill', 'var(--active)');

    function update(x) {
      document.getElementById('xReadout').textContent = x.toFixed(1);

      const fx = Math.max(0, x);
      let fxPText = "";
      let fxPVal = 0;

      if (Math.abs(x) < 0.05) {
        fxPText = "undefined";
        document.getElementById('valFxPrime').className = 'readout danger';
      } else if (x < 0) {
        fxPVal = 0;
        fxPText = "0.0";
        document.getElementById('valFxPrime').className = 'readout';
      } else {
        fxPVal = 1;
        fxPText = "1.0";
        document.getElementById('valFxPrime').className = 'readout';
      }

      document.getElementById('valFx').textContent = fx.toFixed(2);
      document.getElementById('valFxPrime').textContent = fxPText;

      dot1.attr('cx', xS(x)).attr('cy', yS1(fx));

      if (Math.abs(x) < 0.05) {
        dot2.attr('cx', xS(0)).attr('cy', yS2(0.5)).attr('fill', 'var(--danger)');
      } else {
        dot2.attr('cx', xS(x)).attr('cy', yS2(fxPVal)).attr('fill', 'var(--active)');
      }

      const explain = document.getElementById('explainPanel');
      if (Math.abs(x) < 0.05) {
        explain.textContent = `At x = 0: Discontinuity corner! Derivative is undefined (left=0, right=1).`;
      } else if (x < 0) {
        explain.textContent = `At x = ${x.toFixed(1)} < 0: Gradient is 0.0.`;
      } else {
        explain.textContent = `At x = ${x.toFixed(1)} > 0: Gradient is 1.0 (active region).`;
      }

      if (!hasInteracted && Math.abs(x) > 0.1) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    const slider = document.getElementById('xSlider');
    slider.addEventListener('input', (e) => {
      update(parseFloat(e.target.value));
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      slider.value = 0;
      update(0);
    });

    update(0);
  });
})();
