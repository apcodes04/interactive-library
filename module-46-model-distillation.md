# Module 46 — Model Distillation (Q13 — LLM Question)

Build a teacher-student distribution-matching demo with a temperature slider. Use Chart.js dual bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact underlying logits (6 tokens, representing a digit-classification example where the true label is "7"):** `7: 4.0, 1: 2.0, 9: 1.5, 4: 0.5, 3: 0.0, 8: -0.5`. Recompute both teacher's and student's displayed distributions from these same logits via `softmax(logits / T)` at whatever temperature is currently set (never hardcode per-temperature outputs).

**Exact student convergence path (5 canned intermediate states, as fractional blend between a starting near-uniform distribution `[0.20, 0.18, 0.17, 0.16, 0.15, 0.14]` and the teacher's T=1 target distribution):** step 1 = 20% of the way to target, step 2 = 40%, step 3 = 60%, step 4 = 80%, step 5 = 100% (exact match).

**Layout:** a `.card` with teacher's distribution (`--primary`, static per current temperature) on the left, student's editable distribution (`--active`) on the right, a "Train step" `.btn-primary` button (clickable up to 5 times, animating the student's bars to the next canned convergence step, 400ms), and a temperature slider (0.5–3.0, default 1.0) above both charts.

**Caption:** "Raise the temperature and watch the smaller bars in the teacher's distribution become visible — those are exactly the signal the student is learning from that a hard label alone would never show."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Temperature" slider.
2. Click "Train step" repeatedly.
3. Watch the student's bars move closer to the teacher's.
