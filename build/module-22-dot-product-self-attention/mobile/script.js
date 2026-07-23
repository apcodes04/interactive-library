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

    let qAngle = Math.PI / 4;
    let qLen = 3.0;
    let kAngle = Math.PI / 3;
    let kLen = 3.0;

    const w = 320, h = 280, scale = 35;
    const cx = w / 2, cy = h / 2;

    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    svg.append('line').attr('x1', 0).attr('y1', cy).attr('x2', w).attr('y2', cy).attr('stroke', 'var(--border)').attr('opacity', 0.5);
    svg.append('line').attr('x1', cx).attr('y1', 0).attr('x2', cx).attr('y2', h).attr('stroke', 'var(--border)').attr('opacity', 0.5);

    const arcGroup = svg.append('g');
    const qLine = svg.append('line').attr('stroke', 'var(--primary)').attr('stroke-width', 3);
    const kLine = svg.append('line').attr('stroke', 'var(--active)').attr('stroke-width', 3);

    const qHandle = svg.append('circle').attr('r', 12).attr('fill', 'var(--primary)').attr('cursor', 'pointer');
    const kHandle = svg.append('circle').attr('r', 12).attr('fill', 'var(--active)').attr('cursor', 'pointer');

    const qLabel = svg.append('text').attr('font-size', '11px').attr('font-weight', 'bold').attr('fill', 'var(--primary)').text('Q');
    const kLabel = svg.append('text').attr('font-size', '11px').attr('font-weight', 'bold').attr('fill', 'var(--active)').text('K');

    const qDrag = d3.drag().on('drag', (event) => {
      const dx = event.x - cx;
      const dy = cy - event.y;
      qAngle = Math.atan2(dy, dx);
      qLen = Math.min(Math.max(Math.sqrt(dx * dx + dy * dy) / scale, 0.5), 5.0);
      update();
    });

    const kDrag = d3.drag().on('drag', (event) => {
      const dx = event.x - cx;
      const dy = cy - event.y;
      kAngle = Math.atan2(dy, dx);
      kLen = Math.min(Math.max(Math.sqrt(dx * dx + dy * dy) / scale, 0.5), 5.0);
      update();
    });

    qHandle.call(qDrag);
    kHandle.call(kDrag);

    function update() {
      const qx = cx + qLen * scale * Math.cos(qAngle);
      const qy = cy - qLen * scale * Math.sin(qAngle);
      const kx = cx + kLen * scale * Math.cos(kAngle);
      const ky = cy - kLen * scale * Math.sin(kAngle);

      qLine.attr('x1', cx).attr('y1', cy).attr('x2', qx).attr('y2', qy);
      kLine.attr('x1', cx).attr('y1', cy).attr('x2', kx).attr('y2', ky);

      qHandle.attr('cx', qx).attr('cy', qy);
      kHandle.attr('cx', kx).attr('cy', ky);

      qLabel.attr('x', qx + 8).attr('y', qy - 4);
      kLabel.attr('x', kx + 8).attr('y', ky - 4);

      let diff = Math.abs(qAngle - kAngle) % (2 * Math.PI);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;

      const angleDeg = (diff * 180 / Math.PI);
      const dotProduct = qLen * kLen * Math.cos(diff);

      const normAngle = Math.min(diff / (Math.PI / 2), 1.0);
      const arcColor = d3.interpolateRgb('var(--success)', 'var(--danger)')(normAngle);

      arcGroup.selectAll('*').remove();
      const arcRadius = 30;

      const startA = Math.min(qAngle, kAngle);
      const endA = Math.max(qAngle, kAngle);

      const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(arcRadius)
        .startAngle(Math.PI / 2 - endA)
        .endAngle(Math.PI / 2 - startA);

      arcGroup.append('path')
        .attr('transform', `translate(${cx},${cy})`)
        .attr('d', arcGenerator)
        .attr('fill', arcColor)
        .attr('opacity', 0.4);

      document.getElementById('angleReadout').textContent = `${angleDeg.toFixed(1)}°`;
      document.getElementById('dotReadout').textContent = dotProduct.toFixed(2);
      document.getElementById('dotReadout').style.color = arcColor;

      document.getElementById('explainPanel').textContent =
        `θ = ${angleDeg.toFixed(1)}°, Q · K = ${dotProduct.toFixed(2)}.`;

      if (!hasInteracted && Math.abs(angleDeg - 15) > 1) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
      qAngle = Math.PI / 4; qLen = 3.0;
      kAngle = Math.PI / 3; kLen = 3.0;
      update();
    });

    update();
  });
})();
