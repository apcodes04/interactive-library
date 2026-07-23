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

    // Unit circle (40 points)
    const pointsCount = 40;
    const origPoints = [];
    for (let i = 0; i < pointsCount; i++) {
      const theta = (i / pointsCount) * 2 * Math.PI;
      origPoints.push({ x: Math.cos(theta), y: Math.sin(theta) });
    }

    const container = document.getElementById('chartContainer');
    const w = container.clientWidth || 700;
    const h = 320;
    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const scale = 50; // pixels per unit
    const cx = w / 2;
    const cy = h / 2;

    // Axes
    svg.append('line').attr('x1', 0).attr('y1', cy).attr('x2', w).attr('y2', cy).attr('stroke', 'var(--border)').attr('opacity', 0.5);
    svg.append('line').attr('x1', cx).attr('y1', 0).attr('x2', cx).attr('y2', h).attr('stroke', 'var(--border)').attr('opacity', 0.5);

    // Unit circle reference
    const origPath = origPoints.map(p => `${cx + p.x * scale},${cy - p.y * scale}`).join(' L ');
    svg.append('path').attr('d', `M ${origPath} Z`).attr('fill', 'none').attr('stroke', 'var(--frozen)').attr('stroke-width', 1.5).attr('stroke-dasharray', '3 3');

    const transformedPath = svg.append('path').attr('fill', 'rgba(79, 70, 229, 0.15)').attr('stroke', 'var(--primary)').attr('stroke-width', 2.5);

    const vecGroup = svg.append('g');

    function update() {
      const a = parseFloat(document.getElementById('matA').value) || 0;
      const b = parseFloat(document.getElementById('matB').value) || 0;
      const c = parseFloat(document.getElementById('matC').value) || 0;
      const d = parseFloat(document.getElementById('matD').value) || 0;

      // Transform 40 points
      const transPoints = origPoints.map(p => ({
        x: a * p.x + b * p.y,
        y: c * p.x + d * p.y
      }));

      const dStr = transPoints.map(p => `${cx + p.x * scale},${cy - p.y * scale}`).join(' L ');
      transformedPath.transition().duration(200).attr('d', `M ${dStr} Z`);

      // Calculate Eigenvalues & Eigenvectors for 2x2 matrix
      const tr = a + d;
      const det = a * d - b * c;
      const disc = tr * tr - 4 * det;

      vecGroup.selectAll('*').remove();

      if (disc < 0) {
        document.getElementById('eval1').textContent = "Complex";
        document.getElementById('eval2').textContent = "Complex";
        document.getElementById('explainPanel').textContent = "Complex eigenvalues — this matrix rotates the space! No real invariant eigenvector directions exist.";
      } else {
        const l1 = (tr + Math.sqrt(disc)) / 2;
        const l2 = (tr - Math.sqrt(disc)) / 2;

        document.getElementById('eval1').textContent = l1.toFixed(2);
        document.getElementById('eval2').textContent = l2.toFixed(2);

        // Compute eigenvectors (v1, v2)
        function getEigenvector(l) {
          if (Math.abs(b) > 0.0001) return { x: l - d, y: c };
          if (Math.abs(c) > 0.0001) return { x: b, y: l - a };
          return { x: 1, y: 0 };
        }

        const ev1 = getEigenvector(l1);
        const ev2 = getEigenvector(l2);

        function drawArrow(ev, l, color) {
          const len = Math.sqrt(ev.x * ev.x + ev.y * ev.y);
          if (len < 0.001) return;
          const ux = (ev.x / len) * l;
          const uy = (ev.y / len) * l;

          vecGroup.append('line')
            .attr('x1', cx).attr('y1', cy)
            .attr('x2', cx + ux * scale).attr('y2', cy - uy * scale)
            .attr('stroke', color).attr('stroke-width', 3);

          vecGroup.append('circle')
            .attr('cx', cx + ux * scale).attr('cy', cy - uy * scale)
            .attr('r', 5).attr('fill', color);
        }

        drawArrow(ev1, l1, 'var(--active)');
        drawArrow(ev2, l2, 'var(--success)');

        document.getElementById('explainPanel').textContent =
          `Eigenvalues λ1 = ${l1.toFixed(2)}, λ2 = ${l2.toFixed(2)}. Points along the amber and green eigenvector axes stretch by factor λ without rotating!`;
      }

      if (!hasInteracted && (a !== 1 || b !== 0 || c !== 0 || d !== 1)) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    ['matA', 'matB', 'matC', 'matD'].forEach(id => {
      document.getElementById(id).addEventListener('input', update);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('matA').value = 1;
      document.getElementById('matB').value = 0;
      document.getElementById('matC').value = 0;
      document.getElementById('matD').value = 1;
      update();
    });

    update();
  });
})();
