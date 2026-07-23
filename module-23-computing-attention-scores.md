# Module 23 — Computing Attention Scores (Q30 — LLM Question)

Build a 4-stage click-through pipeline matching the module's four operations. Use D3.js for a heatmap grid. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** a 5×5 raw Q·Kᵀ score matrix:
```
[[8, 2, 1, 0, 3],
 [2, 9, 0, 1, 2],
 [1, 0, 7, 4, 1],
 [0, 1, 4, 6, 2],
 [3, 2, 1, 2, 8]]
```
Use √d_k = 8 for scaling.

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** Treat this as 4 states (`currentStage` 0–3), each independently reachable:

- **Stage 0 ("Raw scores"):** render the matrix above as a heatmap, color scale `--frozen` (low) to `--primary` (high), cell text shows the raw integer.
- **Stage 1 ("Scaled"):** divide every value by 8, redraw with visibly smaller numbers and a slightly compressed color range (e.g. 8→1.0, 9→1.125, etc.).
- **Stage 2 ("Softmax"):** renormalize each row via real softmax so each row sums to 1.0 exactly (compute live from stage-1 values); recolor each row as its own probability gradient, `--frozen` to `--active` amber.
- **Stage 3 ("Weighted sum"):** for each row, show 5 small colored blocks (representing 5 toy V-vectors, fixed colors) merged into one blended output block per row, sized/mixed according to that row's stage-2 weights (use CSS color-mixing or simple weighted-average RGB blending).

**Layout:** a `.card` with the 5×5 heatmap grid, a scrubber (`min="0" max="3" step="1"`), 4 clickable stage-label buttons ("Raw scores," "Scaled," "Softmax," "Weighted sum"), "◀ Back" / "Next stage ▶" `.btn-secondary`/`.btn-primary` buttons, and a `.btn-secondary` "Reset" (returns to stage 0). Clicking any stage label or dragging the scrubber jumps directly to that stage's exact rendering (recomputed fresh from the raw matrix each time, not dependent on having visited earlier stages first); using Next/Back or single-notch scrubber drags between adjacent stages plays the transition animation described above.

**Caption:** "Four operations, four visibly different versions of the same matrix — the softmax step is where raw similarity turns into a genuine probability distribution."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage label, or drag the scrubber.
2. Use "Next stage ▶" / "◀ Back" to step through all 4 stages in order.
3. Watch the heatmap grid change at each stage.
