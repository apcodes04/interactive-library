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

    const DATA = {
      2021: {
        era: "InstructGPT / GPT-3.5 Precursor",
        tokens: 4096,
        tokenLabel: "4,096 tokens (4K)",
        barPercent: 1.5,
        modality: "Text-only (Text)",
        benchmark: 52,
        explain: "2021: InstructGPT introduced RLHF alignment over baseline GPT-3 with 4,096-token context window & ~52% MMLU."
      },
      2022: {
        era: "ChatGPT (GPT-3.5-Turbo)",
        tokens: 16384,
        tokenLabel: "16,384 tokens (16K)",
        barPercent: 4.5,
        modality: "Text + Code",
        benchmark: 70,
        explain: "2022: ChatGPT expanded conversational capabilities & code execution, extending context to 16K tokens (~70% MMLU)."
      },
      2023: {
        era: "GPT-4 & GPT-4 Turbo",
        tokens: 128000,
        tokenLabel: "128,000 tokens (128K)",
        barPercent: 20.0,
        modality: "Multimodal (Text + Vision)",
        benchmark: 86,
        explain: "2023: GPT-4 launched multimodal image processing and expanded context to 128K tokens (86.4% MMLU)."
      },
      2024: {
        era: "GPT-4o & OpenAI o1",
        tokens: 128000,
        tokenLabel: "128,000 tokens (128K)",
        barPercent: 20.0,
        modality: "Native Omni (Text + Vision + Audio + Reasoning)",
        benchmark: 89,
        explain: "2024: GPT-4o unified real-time audio/vision natively, paired with OpenAI o1 chain-of-thought reasoning."
      },
      2025: {
        era: "GPT-4.5 / 1M Token Series",
        tokens: 1000000,
        tokenLabel: "1,000,000 tokens (1M)",
        barPercent: 85.0,
        modality: "Extended Multimodal & Deep Reasoning",
        benchmark: 91,
        explain: "2025: GPT-4.5 introduced massive 1-million-token context windows for full codebase analysis (90.8% MMLU)."
      },
      2026: {
        era: "GPT-5 & Frontier Omni Models",
        tokens: 1000000,
        tokenLabel: "1,000,000+ tokens (1M+)",
        barPercent: 100.0,
        modality: "Real-time Autonomous Omni & Advanced Logic",
        benchmark: 94,
        explain: "2026: Frontier GPT-5 architectures combine 1M+ token context with autonomous agentic tools (93.5%+ MMLU)."
      }
    };

    const years = [2021, 2022, 2023, 2024, 2025, 2026];
    let currentYear = 2021;
    let hasInteracted = false;

    const strip = document.getElementById('yearStrip');
    years.forEach(y => {
      const b = document.createElement('button');
      b.className = `year-btn ${y === 2021 ? 'active' : ''}`;
      b.textContent = y;
      b.addEventListener('click', () => setYear(y));
      strip.appendChild(b);
    });

    function setYear(y) {
      currentYear = y;
      document.getElementById('timeline').value = y;
      document.getElementById('yearReadout').textContent = y;

      const btns = strip.querySelectorAll('.year-btn');
      btns.forEach((b, idx) => {
        if (years[idx] === y) b.classList.add('active');
        else b.classList.remove('active');
      });

      const d = DATA[y];
      document.getElementById('modelEra').textContent = d.era;
      document.getElementById('contextReadout').textContent = d.tokenLabel;
      document.getElementById('contextBar').style.width = `${d.barPercent}%`;
      document.getElementById('modalityReadout').textContent = d.modality;
      document.getElementById('benchmarkReadout').textContent = `${d.benchmark}%`;
      document.getElementById('benchmarkBar').style.width = `${d.benchmark}%`;
      document.getElementById('explainPanel').textContent = d.explain;

      if (!hasInteracted && y > 2021) {
        hasInteracted = true;
        document.getElementById('caption').classList.add('visible');
      }
    }

    document.getElementById('timeline').addEventListener('input', (e) => {
      setYear(parseInt(e.target.value, 10));
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      setYear(2021);
    });

    setYear(2021);
  });
})();
