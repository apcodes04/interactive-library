# Module 32 — Top-k vs. Nucleus (Top-p) Sampling (Q10 — LLM Question)

Build a dual-slider distribution-selection demo. Use Chart.js or D3.js bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact data — two toggleable example distributions (10 tokens each):**
- "Confident": `[0.95, 0.02, 0.01, 0.005, 0.005, 0.003, 0.003, 0.002, 0.001, 0.001]`
- "Uncertain": `[0.14, 0.13, 0.12, 0.11, 0.10, 0.10, 0.09, 0.08, 0.07, 0.06]`

**Layout:** a `.card` with a toggle for the two distributions, a bar chart of the current one (`--frozen` default), a "k" slider (1–10, default 3), and a "p" slider (0.5–1.0, default 0.9).

**Behavior:** highlight the top-k bars in `--primary` and, overlapping/adjacent, highlight the smallest set of bars whose cumulative probability reaches p in `--active` (computed live from the actual bar values, cumulative sum until ≥ p). Two `.readout` values: "Top-k selects: N tokens," "Top-p selects: M tokens."

**Caption:** "Switch to 'Confident' — top-p correctly collapses to just 1 token, while top-k still stubbornly admits 2 more, whatever k is set to."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "k" slider.
2. Drag the "p" slider.
3. Toggle between the "Confident" and "Uncertain" example distributions.
