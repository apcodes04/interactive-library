# Module 15 — Gradient With Respect To Embeddings (Q24 — LLM Question)

Build a small embedding-nudge animation using the exact toy-vocabulary table from `00-global-spec.md`. Use D3.js. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` scatter plot of all 12 words at their fixed coordinates (`--primary`). Highlight `"tired"` (at 20, 78) as the example word, since it's the target of a hypothetical training step.

**Exact data — 5 precomputed cumulative step positions for "tired," moving toward the "sad"/"happy" cluster:**

| step | x | y |
|---|---|---|
| 0 (start) | 20 | 78 |
| 1 | 21 | 78.5 |
| 2 | 21.8 | 79 |
| 3 | 22.5 | 79.3 |
| 4 | 23 | 79.6 |
| 5 | 23.4 | 79.8 |

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** Treat this as 6 states (`currentStep` 0–5, matching the 6 rows in the table above).

**Control:** a scrubber (`min="0" max="5" step="1"`) plus 6 small clickable step indicators ("0" through "5"), "◀ Back" / "Step ▶" `.btn-secondary`/`.btn-primary` buttons, and a "Training steps taken: N" `.readout`. Clicking any step indicator or dragging the scrubber jumps the "tired" dot directly to that step's precomputed (x, y) position (no animation needed for a direct jump); using Step/Back one at a time animates the dot moving smoothly to the adjacent position (400ms `--ease-out`). Include `.btn-secondary` "Reset" (returns to step 0).

**Caption:** "Every training step nudges a word's embedding slightly — repeated millions of times, that's how 'tired' ends up near words like 'sad' instead of near 'chef.'"

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Step ▶" to nudge the "tired" dot.
2. Use the scrubber or step dots to move back and forth.
