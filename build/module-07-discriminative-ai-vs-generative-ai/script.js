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

    function animateDot(dotId, pathId, callback) {
      const dot = document.getElementById(dotId);
      const path = document.getElementById(pathId);
      const length = path.getTotalLength();
      
      dot.style.opacity = '1';
      const startTime = performance.now();
      const duration = 500; // ms

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const point = path.getPointAtLength(progress * length);
        
        dot.setAttribute('cx', point.x);
        dot.setAttribute('cy', point.y);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          dot.style.opacity = '0';
          if (callback) callback();
        }
      }

      requestAnimationFrame(step);
    }

    document.getElementById('btn-disc').addEventListener('click', () => {
      document.getElementById('explain').textContent =
        'Discriminative model evaluates the existing review and outputs a categorical class label & probability score (Sentiment: Negative — 91%).';
      
      animateDot('dot-disc', 'path-disc', () => {
        document.getElementById('res-disc').classList.add('visible');
        if (!hasInteracted) {
          hasInteracted = true;
          document.getElementById('caption').classList.add('visible');
        }
      });
    });

    document.getElementById('btn-gen').addEventListener('click', () => {
      document.getElementById('explain').textContent =
        'Generative model synthesizes brand-new text response matching the context of the review.';
      
      animateDot('dot-gen', 'path-gen', () => {
        document.getElementById('res-gen').classList.add('visible');
        if (!hasInteracted) {
          hasInteracted = true;
          document.getElementById('caption').classList.add('visible');
        }
      });
    });
  });
})();
