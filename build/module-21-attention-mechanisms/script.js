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

    const tokens = ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was"];
    let selectedIdx = null;
    let hasInteracted = false;

    // Render chips
    const container = document.getElementById('wordsContainer');
    tokens.forEach((tok, i) => {
      const b = document.createElement('button');
      b.className = 'word-chip';
      b.id = `chip-${i}`;
      b.textContent = tok;
      b.addEventListener('click', () => selectWord(i));
      container.appendChild(b);
    });

    const w = 680, h = 200, margin = { top: 20, right: 40, bottom: 40, left: 40 };
    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scalePoint().domain(tokens.map((_, i) => i)).range([margin.left, w - margin.right]);

    // Draw word nodes on SVG
    const nodesGroup = svg.append('g');
    const linesGroup = svg.append('g');

    tokens.forEach((tok, i) => {
      const g = nodesGroup.append('g').attr('transform', `translate(${xS(i)}, ${h - margin.bottom})`);
      g.append('circle').attr('r', 6).attr('fill', 'var(--primary)');
      g.append('text').attr('y', 20).attr('text-anchor', 'middle').attr('font-size', '12px').attr('font-weight', '600').attr('fill', 'var(--text)').text(tok);
    });

    function getWeights(idx) {
      const wArr = new Array(tokens.length).fill(0.03);
      if (idx === 7) { // "it" -> cat: 0.55, mat: 0.15, because: 0.05, sat: 0.05, was: 0.06
        wArr[1] = 0.55; // cat
        wArr[5] = 0.15; // mat
        wArr[6] = 0.05; // because
        wArr[2] = 0.05; // sat
        wArr[8] = 0.06; // was
      } else if (idx === 8) { // "was" -> it: 0.5, cat: 0.2, mat: 0.1
        wArr[7] = 0.50; // it
        wArr[1] = 0.20; // cat
        wArr[5] = 0.10; // mat
        wArr[6] = 0.05; // because
        wArr[2] = 0.05; // sat
      } else {
        // Nearest neighbors 0.3 each
        if (idx > 0) wArr[idx - 1] = 0.30;
        if (idx < tokens.length - 1) wArr[idx + 1] = 0.30;
        wArr[idx] = 0.20;
      }
      return wArr;
    }

    function selectWord(idx) {
      selectedIdx = idx;

      // Update chips UI
      tokens.forEach((_, i) => {
        document.getElementById(`chip-${i}`).className = `word-chip ${i === idx ? 'selected' : ''}`;
      });

      const weights = getWeights(idx);
      const srcX = xS(idx);
      const srcY = h - margin.bottom;

      // Draw arc connection lines
      linesGroup.selectAll('*').remove();

      tokens.forEach((tok, targetIdx) => {
        if (targetIdx === idx) return;
        const weight = weights[targetIdx];
        const tgtX = xS(targetIdx);
        const distance = Math.abs(tgtX - srcX);
        const arcHeight = Math.min(distance * 0.45, 120);

        const pathD = `M ${srcX} ${srcY} Q ${(srcX + tgtX) / 2} ${srcY - arcHeight} ${tgtX} ${srcY}`;

        linesGroup.append('path')
          .attr('d', pathD)
          .attr('fill', 'none')
          .attr('stroke', 'var(--primary)')
          .attr('stroke-width', Math.max(1, weight * 8))
          .attr('opacity', Math.max(0.15, weight * 1.2))
          .style('transition', 'all 300ms ease-out');
      });

      // Update readout grid
      const grid = document.getElementById('weightsGrid');
      grid.innerHTML = '';
      const sorted = tokens
        .map((t, i) => ({ word: t, weight: weights[i], idx: i }))
        .filter(item => item.idx !== idx)
        .sort((a, b) => b.weight - a.weight);

      sorted.slice(0, 4).forEach(item => {
        const tag = document.createElement('div');
        tag.className = 'weight-tag';
        tag.innerHTML = `<span class="w-name">${item.word}:</span> <span class="w-val">${(item.weight * 100).toFixed(0)}%</span>`;
        grid.appendChild(tag);
      });

      const selWord = tokens[idx];
      document.getElementById('explainPanel').textContent =
        `Selected "${selWord}" (token ${idx + 1}): Attends most strongly to "${sorted[0].word}" (${(sorted[0].weight * 100).toFixed(0)}%) and "${sorted[1].word}" (${(sorted[1].weight * 100).toFixed(0)}%).`;

      if (!hasInteracted) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
      selectedIdx = null;
      tokens.forEach((_, i) => document.getElementById(`chip-${i}`).className = 'word-chip');
      linesGroup.selectAll('*').remove();
      document.getElementById('weightsGrid').innerHTML = 'Select a word chip above.';
      document.getElementById('explainPanel').textContent = 'Click a word chip to inspect its attention distribution.';
    });

    // Default select "it" (index 7)
    selectWord(7);
  });
})();
