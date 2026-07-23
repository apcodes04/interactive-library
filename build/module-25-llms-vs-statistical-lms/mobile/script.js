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

    const NGRAM_TABLE = {
      "the cat": [ { word: "sat", prob: 0.9 }, { word: "ran", prob: 0.1 } ],
      "the dog": [ { word: "barked", prob: 0.8 }, { word: "sat", prob: 0.2 } ],
      "she opened": [ { word: "door", prob: 0.6 }, { word: "box", prob: 0.4 } ],
      "he was": [ { word: "tired", prob: 0.7 }, { word: "happy", prob: 0.3 } ],
      "they went": [ { word: "home", prob: 0.5 }, { word: "outside", prob: 0.5 } ],
      "it was": [ { word: "raining", prob: 0.55 }, { word: "sunny", prob: 0.45 } ]
    };

    const LLM_DEFAULT = [
      { word: "sat", prob: 0.28 },
      { word: "walked", prob: 0.19 },
      { word: "ran", prob: 0.15 },
      { word: "stood", prob: 0.13 },
      { word: "jumped", prob: 0.10 },
      { word: "stayed", prob: 0.09 },
      { word: "left", prob: 0.06 }
    ];

    let hasInteracted = false;

    const w = 320, h = 160, margin = { top: 15, right: 15, bottom: 30, left: 35 };

    const svgNgram = d3.select('#chartNgram').append('svg').attr('width', w).attr('height', h);
    const svgLlm = d3.select('#chartLlm').append('svg').attr('width', w).attr('height', h);

    function renderBars(svg, data, color, isNgram, isFound) {
      svg.selectAll('*').remove();

      const words = data.map(d => d.word);
      const xS = d3.scaleBand().domain(words).range([margin.left, w - margin.right]).padding(0.25);
      const yS = d3.scaleLinear().domain([0, 1.0]).range([h - margin.bottom, margin.top]);

      svg.append('g').attr('transform', `translate(0,${h - margin.bottom})`).call(d3.axisBottom(xS));
      svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yS).ticks(4).tickFormat(d3.format('.0%')));

      if (isNgram && !isFound) return;

      svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xS(d.word))
        .attr('y', d => yS(d.prob))
        .attr('width', xS.bandwidth())
        .attr('height', d => yS(0) - yS(d.prob))
        .attr('fill', color);

      svg.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => xS(d.word) + xS.bandwidth() / 2)
        .attr('y', d => yS(d.prob) - 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('fill', 'var(--text)')
        .text(d => `${Math.round(d.prob * 100)}%`);
    }

    function update() {
      const rawInput = document.getElementById('prefixInput').value.trim().toLowerCase();
      const ngramMatch = NGRAM_TABLE[rawInput];
      const noDataOverlay = document.getElementById('ngramNoData');

      if (ngramMatch) {
        noDataOverlay.style.display = 'none';
        renderBars(svgNgram, ngramMatch, 'var(--primary)', true, true);
      } else {
        noDataOverlay.style.display = 'block';
        renderBars(svgNgram, [{ word: "N/A", prob: 0 }], 'var(--primary)', true, false);
      }

      renderBars(svgLlm, LLM_DEFAULT, 'var(--active)', false, true);

      const explain = document.getElementById('explainPanel');
      if (ngramMatch) {
        explain.textContent = `Prefix "${rawInput}": Exact N-gram found (${Math.round(ngramMatch[0].prob * 100)}%). LLM generalizes.`;
      } else {
        explain.textContent = `Unseen Prefix "${rawInput}": N-gram fails (0% data). LLM generalizes smoothly.`;
      }

      if (!hasInteracted && rawInput !== "the cat") {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('prefixInput').addEventListener('input', update);

    document.querySelectorAll('.sample-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.getElementById('prefixInput').value = e.target.getAttribute('data-prefix');
        update();
      });
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('prefixInput').value = 'the cat';
      update();
    });

    update();
  });
})();
