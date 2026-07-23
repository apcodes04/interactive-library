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

    const container = document.getElementById('chartContainer');
    const width = container.clientWidth || 700;
    const height = 340;
    const margin = { top: 30, right: 40, bottom: 40, left: 40 };

    const svg = d3.select('#chartContainer').append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    // Zoomable group container
    const g = svg.append('g').attr('class', 'main-group');

    // Grid lines for vector space feel
    const gridGroup = g.append('g').attr('class', 'grid-group');
    for (let x = 0; x <= 100; x += 20) {
      gridGroup.append('line')
        .attr('x1', xScale(x)).attr('y1', yScale(0))
        .attr('x2', xScale(x)).attr('y2', yScale(100))
        .attr('stroke', 'var(--border)').attr('stroke-width', 1).attr('opacity', 0.4);
    }
    for (let y = 0; y <= 100; y += 20) {
      gridGroup.append('line')
        .attr('x1', xScale(0)).attr('y1', yScale(y))
        .attr('x2', xScale(100)).attr('y2', yScale(y))
        .attr('stroke', 'var(--border)').attr('stroke-width', 1).attr('opacity', 0.4);
    }

    const linesGroup = g.append('g').attr('class', 'lines-group');
    const dotsGroup = g.append('g').attr('class', 'dots-group');

    // D3 Zoom Setup
    const zoom = d3.zoom()
      .scaleExtent([0.6, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    document.getElementById('zoomIn').addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    });

    document.getElementById('zoomReset').addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });

    let selectedWord = null;
    let hasInteracted = false;

    // Draw vocabulary dots
    const dots = dotsGroup.selectAll('.word-node')
      .data(vocab)
      .enter()
      .append('g')
      .attr('class', 'word-node')
      .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        selectWord(d);
      });

    dots.append('circle')
      .attr('r', 6)
      .attr('fill', 'var(--primary)');

    dots.append('text')
      .attr('x', 9)
      .attr('y', 4)
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', 'var(--text)')
      .text(d => d.word);

    function computeNearestNeighbors(target) {
      const distances = vocab
        .filter(v => v.word !== target.word)
        .map(v => {
          const dx = v.x - target.x;
          const dy = v.y - target.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return { ...v, dist };
        })
        .sort((a, b) => a.dist - b.dist);
      return distances.slice(0, 3);
    }

    function selectWord(target) {
      selectedWord = target;

      // Update dot styles
      dots.selectAll('circle')
        .attr('fill', d => d.word === target.word ? 'var(--active)' : 'var(--primary)')
        .attr('r', d => d.word === target.word ? 8 : 6);

      dots.selectAll('text')
        .attr('fill', d => d.word === target.word ? 'var(--active)' : 'var(--text)')
        .attr('font-weight', d => d.word === target.word ? 'bold' : '600');

      const neighbors = computeNearestNeighbors(target);

      // Draw neighbor lines
      linesGroup.selectAll('.neighbor-line').remove();
      neighbors.forEach(n => {
        linesGroup.append('line')
          .attr('class', 'neighbor-line')
          .attr('x1', xScale(target.x))
          .attr('y1', yScale(target.y))
          .attr('x2', xScale(target.x))
          .attr('y2', yScale(target.y))
          .attr('stroke', 'var(--primary-light)')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4 3')
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('x2', xScale(n.x))
          .attr('y2', yScale(n.y));
      });

      // Update explain panel
      document.getElementById('explainPanel').textContent =
        `Selected "${target.word}" at (${target.x}, ${target.y}). Nearest 3 neighbors in vector space computed below.`;

      // Update readout box
      const grid = document.getElementById('neighborsGrid');
      grid.innerHTML = '';
      neighbors.forEach(n => {
        const card = document.createElement('div');
        card.className = 'neighbor-card';
        card.innerHTML = `
          <span class="neighbor-word">${n.word}</span>
          <span class="neighbor-dist">${n.dist.toFixed(1)}</span>
        `;
        grid.appendChild(card);
      });

      if (!hasInteracted) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    // Default selection on load
    selectWord(vocab[0]); // "cat"
  });
})();
