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

    let seed = 7;
    function pseudoRandom() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    const testIndices = new Set([3, 8, 13, 18, 23]);
    const points = [];

    for (let i = 0; i < 25; i++) {
      const x = (i / 24) * 100;
      const trueY = 20 + 15 * Math.sin(x / 15);
      const noise = (pseudoRandom() - 0.5) * 16;
      points.push({
        x: x,
        y: trueY + noise,
        isTest: testIndices.has(i)
      });
    }

    const anchors = [
      { degree: 1, trainErr: 9.0, testErr: 8.5 },
      { degree: 3, trainErr: 5.5, testErr: 5.0 },
      { degree: 5, trainErr: 3.0, testErr: 3.2 },
      { degree: 8, trainErr: 1.5, testErr: 5.5 },
      { degree: 12, trainErr: 0.4, testErr: 9.0 },
      { degree: 15, trainErr: 0.05, testErr: 13.0 }
    ];

    function getErrors(deg) {
      for (let i = 0; i < anchors.length - 1; i++) {
        if (deg >= anchors[i].degree && deg <= anchors[i + 1].degree) {
          const t = (deg - anchors[i].degree) / (anchors[i + 1].degree - anchors[i].degree);
          return {
            trainErr: anchors[i].trainErr + t * (anchors[i + 1].trainErr - anchors[i].trainErr),
            testErr: anchors[i].testErr + t * (anchors[i + 1].testErr - anchors[i].testErr)
          };
        }
      }
      return anchors[0];
    }

    function generateCurvePoints(deg) {
      const curve = [];
      const numSteps = 100;
      for (let i = 0; i <= numSteps; i++) {
        const x = (i / numSteps) * 100;
        let y = 20 + 15 * Math.sin(x / 15);
        if (deg === 1) {
          y = 15 + 0.15 * x;
        } else if (deg >= 8) {
          const wiggle = Math.sin(x * (deg / 5)) * ((deg - 5) * 1.5);
          y += wiggle;
        }
        curve.push({ x, y });
      }
      return curve;
    }

    const container = document.getElementById('chartContainer');
    const width = container.clientWidth || 340;
    const height = 250;
    const margin = { top: 15, right: 15, bottom: 25, left: 30 };

    const svg = d3.select('#chartContainer').append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 50]).range([height - margin.bottom, margin.top]);

    svg.selectAll('.data-point')
      .data(points)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', d => d.isTest ? 'var(--active)' : 'var(--primary)');

    const lineGen = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const path = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5);

    let hasInteracted = false;

    function update(deg) {
      document.getElementById('degreeReadout').textContent = deg;
      const errs = getErrors(deg);
      document.getElementById('trainReadout').textContent = errs.trainErr.toFixed(2);
      document.getElementById('testReadout').textContent = errs.testErr.toFixed(2);

      const curvePts = generateCurvePoints(deg);
      path.attr('d', lineGen(curvePts));

      let lineColor = 'var(--success)';
      let statusText = '';
      if (deg <= 2) {
        lineColor = 'var(--primary)';
        statusText = `Degree ${deg}: High train and test errors — Underfitting.`;
      } else if (deg <= 6) {
        lineColor = 'var(--success)';
        statusText = `Degree ${deg}: Sweet spot! Low train & test error.`;
      } else {
        lineColor = 'var(--danger)';
        statusText = `Degree ${deg}: Overfitting! Train error falls (${errs.trainErr.toFixed(2)}), but test error rises (${errs.testErr.toFixed(2)}).`;
      }

      path.attr('stroke', lineColor);
      document.getElementById('legendCurveLine').style.background = lineColor;
      document.getElementById('explainPanel').textContent = statusText;

      if (!hasInteracted && deg > 1) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    const slider = document.getElementById('degree');
    slider.addEventListener('input', (e) => {
      update(parseInt(e.target.value, 10));
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      slider.value = 1;
      update(1);
    });

    update(1);
  });
})();
