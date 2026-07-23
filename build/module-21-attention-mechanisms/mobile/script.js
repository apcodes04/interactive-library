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

    const container = document.getElementById('wordsContainer');
    tokens.forEach((tok, i) => {
      const b = document.createElement('button');
      b.className = 'word-chip';
      b.id = `chip-${i}`;
      b.textContent = tok;
      b.addEventListener('click', () => selectWord(i));
      container.appendChild(b);
    });

    const w = 320, h = 180, margin = { top: 15, right: 20, bottom: 30, left: 20 };
    const svg = d3.select('#chartContainer').append('svg').attr('width', w).attr('height', h);

    const xS = d3.scalePoint().domain(tokens.map((_, i) => i)).range([margin.left, w - margin.right]);

    const nodesGroup = svg.append('g');
    const linesGroup = svg.append('g');

    tokens.forEach((tok, i) => {
      const g = nodesGroup.append('g').attr('transform', `translate(${xS(i)}, ${h - margin.bottom})`);
      g.append('circle').attr('r', 5).attr('fill', 'var(--primary)');
      g.append('text').attr('y', 16).attr('text-anchor', 'middle').attr('font-size', '10px').attr('font-weight', '600').attr('fill', 'var(--text)').text(tok);
    });

    function getWeights(idx) {
      const wArr = new Array(tokens.length).fill(0.03);
      if (idx === 7) {
        wArr[1] = 0.55; wArr[5] = 0.15; wArr[6] = 0.05; wArr[2] = 0.05; wArr[8] = 0.06;
      } else if (idx === 8) {
        wArr[7] = 0.50; wArr[1] = 0.20; wArr[5] = 0.10; wArr[6] = 0.05; wArr[2] = 0.05;
      } else {
        if (idx > 0) wArr[idx - 1] = 0.30;
        if (idx < tokens.length - 1) wArr[idx + 1] = 0.30;
        wArr[idx] = 0.20;
      }
      return wArr;
    }

    function selectWord(idx) {
      selectedIdx = idx;

      tokens.forEach((_, i) => {
        document.getElementById(`chip-${i}`).className = `word-chip ${i === idx ? 'selected' : ''}`;
      });

      const weights = getWeights(idx);
      const srcX = xS(idx);
      const srcY = h - margin.bottom;

      linesGroup.selectAll('*').remove();

      tokens.forEach((tok, targetIdx) => {
        if (targetIdx === idx) return;
        const weight = weights[targetIdx];
        const tgtX = xS(targetIdx);
        const distance = Math.abs(tgtX - srcX);
        const arcHeight = Math.min(distance * 0.5, 90);

        const pathD = `M ${srcX} ${srcY} Q ${(srcX + tgtX) / 2} ${srcY - arcHeight} ${tgtX} ${srcY}`;

        linesGroup.append('path')
          .attr('d', pathD)
          .attr('fill', 'none')
          .attr('stroke', 'var(--primary)')
          .attr('stroke-width', Math.max(1, weight * 6))
          .attr('opacity', Math.max(0.2, weight * 1.2));
      });

      const grid = document.getElementById('weightsGrid');
      grid.innerHTML = '';
      const sorted = tokens
        .map((t, i) => ({ word: t, weight: weights[i], idx: i }))
        .filter(item => item.idx !== idx)
        .sort((a, b) => b.weight - a.weight);

      sorted.slice(0, 3).forEach(item => {
        const tag = document.createElement('div');
        tag.className = 'weight-tag';
        tag.innerHTML = `<span class="w-name">${item.word}:</span> <span class="w-val">${(item.weight * 100).toFixed(0)}%</span>`;
        grid.appendChild(tag);
      });

      document.getElementById('explainPanel').textContent =
        `"${tokens[idx]}" attends most to "${sorted[0].word}" (${(sorted[0].weight * 100).toFixed(0)}%).`;

      if (!hasInteracted) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
      selectedIdx = null;
      tokens.forEach((_, i) => document.getElementById(`chip-${i}`).className = 'word-chip');
      linesGroup.selectAll('*').remove();
      document.getElementById('weightsGrid').innerHTML = 'Tap a word chip.';
      document.getElementById('explainPanel').textContent = 'Tap a word chip to inspect attention.';
    });

    selectWord(7);
  });
})();
