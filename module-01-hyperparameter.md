# Module 1 — Hyperparameter (Q47 — AI/ML Question)

Build a page visualizing how a single hyperparameter, learning rate, controls training behavior on a toy 2D classifier. Use D3.js. Follow `00-design-system.md` for all colors, type, and motion, and `00-global-spec.md`'s toy 2-class dataset for the scatter plot.

**Layout:** a card containing an SVG on the left showing the toy 2-class dataset with a simple linear decision boundary line (color: `--primary`), and a live loss-curve line chart on the right (D3, x-axis = training step 0–50, y-axis = loss 0–9).

**Control:** one slider labeled "Learning rate," range 0.001–2.0 on a log scale, default 0.1, plus a "Train" `.btn-primary` button.

**Exact data — three precomputed 50-step loss trajectories, select by slider bucket:**
- Learning rate 0.01–0.3 ("converging"): loss decreases smoothly and monotonically from 2.5 at step 0 to 0.1 at step 50 (use an exponential decay curve: `loss = 0.1 + 2.4 * exp(-step/12)`).
- Learning rate > 0.3 ("diverging"): loss oscillates with growing amplitude — `loss = 2.5 + step * 0.15 * sin(step * 0.9)`, clamped to a 0–9 display range, colored `--danger` once it exceeds 6.
- Learning rate < 0.01 ("crawling"): loss decreases only slightly and linearly from 2.5 at step 0 to 2.0 at step 50 (barely moving), colored `--text-muted`.

On "Train" click, animate the correct trajectory drawing left to right over ~2 seconds, and animate the decision boundary line settling into its correct final position only for the converging case (for diverging, make the boundary line visibly jitter/rotate randomly each frame instead of settling; for crawling, barely move it from its starting position).

**Caption:** "The learning rate alone decided whether training converged smoothly, crawled, or diverged — nothing else in this chart changed."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Learning rate" slider.
2. Click "Train."
3. Watch the loss curve and decision boundary respond.
