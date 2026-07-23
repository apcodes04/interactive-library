# Module 43 — Catastrophic Forgetting (Q12 — LLM Question)

Build a two-gauge before/after demo. Use Chart.js radial/gauge charts or animated SVG arcs. Follow `00-design-system.md` for colors/type/motion.

**Exact values:** both gauges start at 85%.
- "Fine-tune on Task B (no protection)" `.btn-primary`: Task B animates to 95% (`--success`), Task A simultaneously drops to 40% (`--danger`), over 1000ms.
- "Fine-tune on Task B (with EWC/replay protection)" `.btn-secondary`: first resets both gauges to 85%, then animates Task B to 92% (`--success`) while Task A stays at 82% (`--success`, barely moved), over 1000ms.

**Layout:** a `.card` with two labeled gauge meters ("Task A accuracy," "Task B accuracy") and the two buttons above, plus a `.btn-secondary` "Reset" button.

**Caption:** "Same fine-tuning goal, same starting point — protecting old-task weights is the only difference between Task A collapsing and Task A barely moving."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Fine-tune on Task B (no protection)."
2. Click "Reset."
3. Click "Fine-tune on Task B (with protection)" and compare the two outcomes.
