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

    const sentence = ["The", "cat", "sat", "on", "the", "mat", "because", "it"];
    let isRunning = false;
    let animFrameId = null;
    let seqIntervalId = null;
    let hasInteracted = false;

    const seqContainer = document.getElementById('seqTokensRow');
    const parContainer = document.getElementById('parTokensRow');

    sentence.forEach((tok, i) => {
      const b1 = document.createElement('div');
      b1.className = 'token-box';
      b1.id = `seq-tok-${i}`;
      b1.textContent = tok;
      seqContainer.appendChild(b1);

      const b2 = document.createElement('div');
      b2.className = 'token-box';
      b2.id = `par-tok-${i}`;
      b2.textContent = tok;
      parContainer.appendChild(b2);
    });

    function reset() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (seqIntervalId) clearInterval(seqIntervalId);
      isRunning = false;

      document.getElementById('timerReadout').textContent = '0 ms';
      document.getElementById('seqTimeTag').textContent = 'Pending';
      document.getElementById('parTimeTag').textContent = 'Pending';
      document.getElementById('runBtn').disabled = false;

      sentence.forEach((_, i) => {
        document.getElementById(`seq-tok-${i}`).className = 'token-box';
        document.getElementById(`par-tok-${i}`).className = 'token-box';
      });

      document.getElementById('explainPanel').textContent =
        'Click "Run Race" to start both processing pipelines simultaneously.';
    }

    function runRace() {
      if (isRunning) return;
      isRunning = true;
      document.getElementById('runBtn').disabled = true;

      const startTime = performance.now();

      // Parallel row finishes in 400ms
      setTimeout(() => {
        sentence.forEach((_, i) => {
          document.getElementById(`par-tok-${i}`).className = 'token-box active-par';
        });
        document.getElementById('parTimeTag').textContent = 'Finished @ 400 ms';
      }, 400);

      // Sequential row: 1 token every 400ms (total 8 * 400 = 3200ms)
      let seqIdx = 0;
      seqIntervalId = setInterval(() => {
        if (seqIdx > 0) {
          document.getElementById(`seq-tok-${seqIdx - 1}`).className = 'token-box done-seq';
        }

        if (seqIdx < sentence.length) {
          document.getElementById(`seq-tok-${seqIdx}`).className = 'token-box active-seq';
          seqIdx++;
        } else {
          clearInterval(seqIntervalId);
          seqIntervalId = null;
          const totalSeqTime = Math.round(performance.now() - startTime);
          document.getElementById('seqTimeTag').textContent = `Finished @ ${totalSeqTime} ms`;
          isRunning = false;
          document.getElementById('runBtn').disabled = false;

          document.getElementById('explainPanel').textContent =
            `Race complete! Transformer finished all 8 tokens in 400 ms (parallel matrix multiplication), while Seq2Seq took ~${totalSeqTime} ms (sequential token loop).`;

          if (!hasInteracted) {
            hasInteracted = true;
            document.getElementById('caption').classList.add('visible');
          }
        }
      }, 400);

      // Live timer counter
      function tick() {
        if (isRunning) {
          const elapsed = Math.round(performance.now() - startTime);
          document.getElementById('timerReadout').textContent = `${elapsed} ms`;
          animFrameId = requestAnimationFrame(tick);
        }
      }
      animFrameId = requestAnimationFrame(tick);
    }

    document.getElementById('runBtn').addEventListener('click', runRace);
    document.getElementById('resetBtn').addEventListener('click', reset);

    reset();
  });
})();
