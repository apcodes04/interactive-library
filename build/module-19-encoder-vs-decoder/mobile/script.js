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

    const tokens = ["The", "cat", "sat", "on", "the", "mat"];
    let isEncoder = true;
    let hasInteracted = false;

    const container = document.getElementById('gridContainer');
    const table = document.createElement('table');
    table.className = 'grid-table';

    const headRow = document.createElement('tr');
    headRow.appendChild(document.createElement('th'));
    tokens.forEach(tok => {
      const th = document.createElement('th');
      th.textContent = tok;
      headRow.appendChild(th);
    });
    table.appendChild(headRow);

    tokens.forEach((rowTok, r) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = rowTok;
      tr.appendChild(th);

      tokens.forEach((colTok, c) => {
        const td = document.createElement('td');
        const cell = document.createElement('div');
        cell.className = 'attn-cell';
        cell.id = `cell-${r}-${c}`;
        cell.textContent = '1';
        td.appendChild(cell);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    container.appendChild(table);

    function updateGrid(encoderState) {
      isEncoder = encoderState;

      document.getElementById('btnEncoder').className = `segment-btn ${isEncoder ? 'active' : ''}`;
      document.getElementById('btnDecoder').className = `segment-btn ${!isEncoder ? 'active' : ''}`;

      tokens.forEach((_, r) => {
        tokens.forEach((_, c) => {
          const cell = document.getElementById(`cell-${r}-${c}`);
          const isAllowed = isEncoder || (r >= c);
          const delay = (r * 6 + c) * 15;

          setTimeout(() => {
            if (isAllowed) {
              cell.className = 'attn-cell';
              cell.textContent = '1';
            } else {
              cell.className = 'attn-cell masked';
              cell.textContent = '0';
            }
          }, delay);
        });
      });

      const explain = document.getElementById('explainPanel');
      if (isEncoder) {
        explain.textContent = 'Encoder: All 36 cells active (bidirectional context).';
      } else {
        explain.textContent = 'Decoder: Lower triangle active (causal mask).';
      }

      if (!hasInteracted) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('btnEncoder').addEventListener('click', () => updateGrid(true));
    document.getElementById('btnDecoder').addEventListener('click', () => updateGrid(false));

    updateGrid(true);
  });
})();
