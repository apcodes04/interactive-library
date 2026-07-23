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

    // Render 6x6 grid
    const container = document.getElementById('gridContainer');
    const table = document.createElement('table');
    table.className = 'grid-table';

    // Header row
    const headRow = document.createElement('tr');
    headRow.appendChild(document.createElement('th')); // empty corner
    tokens.forEach(tok => {
      const th = document.createElement('th');
      th.textContent = tok;
      headRow.appendChild(th);
    });
    table.appendChild(headRow);

    // Body rows
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
          const delay = (r * 6 + c) * 15; // 15ms stagger per cell

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
        explain.textContent = 'Encoder (bidirectional): Every token can attend to all 6 tokens in both past and future directions (full 36 active cells).';
      } else {
        explain.textContent = 'Decoder (causal): Upper-triangular cells are masked (0). Each token can only attend to past tokens and itself (lower triangle).';
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
