# Module 61 — Gradient Boosting / XGBoost (AI/ML Concept)

Build a multi-stage animated pipeline showing 3 rounds of boosting, each fitting a shallow stump to the previous round's residuals. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy regression dataset.

**Exact data:** the toy regression dataset (10 points, x = [1..10], y = [5.1, 6.9, 9.4, 10.8, 13.2, 14.9, 17.3, 18.7, 21.5, 22.8]). Implement real boosting directly in `script.js`: start with a constant prediction equal to the mean of y; for 3 rounds, fit a depth-1 "stump" (single threshold split) to the current residuals (real, deterministic greedy search minimizing squared error), then update the ensemble prediction as `previous + 0.5 * stump_output` (fixed shrinkage/learning rate 0.5).

**Categorical coloring:** Stump 1 = `--cat-1` (teal), Stump 2 = `--cat-2` (coral), Stump 3 = `--cat-3` (rose) — each stump's fit line keeps its own color through every later stage it's shown in.

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–6) — see `00-design-system.md`'s "Multi-stage modules" section, reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with the main SVG chart (x 0–11, y 0–26) showing the 10 data points and the current ensemble-prediction line, plus a small `.readout` "Residual sum of squares: X.XX."

**Stages (7, index 0–6):**
- **Stage 0 — Initial prediction:** flat line at the mean of y. No residuals shown yet.
- **Stage 1 — Round 1, fit stump:** dashed residual bars from each point to the current prediction, plus Stump 1's step-function fit overlaid in `--cat-1`.
- **Stage 2 — Round 1, combine:** ensemble line updates to include Stump 1 × 0.5; residual bars and stump overlay clear.
- **Stage 3 — Round 2, fit stump:** new residual bars from the updated prediction, plus Stump 2's fit in `--cat-2`.
- **Stage 4 — Round 2, combine:** ensemble line updates again.
- **Stage 5 — Round 3, fit stump:** residual bars, plus Stump 3's fit in `--cat-3`.
- **Stage 6 — Final ensemble:** the final combined prediction line (bold), with Stumps 1–3 shown faded beneath it in their categorical colors, and the RSE readout showing how much it dropped from stage 0.

**Legend (dynamic, per stage):**
- Stage 0: Data point, Current ensemble prediction.
- Stages 1, 3, 5 (fit steps): Data point, Current ensemble prediction, Residual, Stump (that round's categorical color).
- Stages 2, 4 (combine steps): Data point, Current ensemble prediction.
- Stage 6: Data point, Final ensemble prediction, Stump 1/2/3 (faded categorical colors).

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies throughout.

**Caption:** "Each round doesn't refit the whole curve — it only fits a small correction to whatever error was still left over from the last round, and adds it in at a fraction of its full strength."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage button, or drag the scrubber, to move through each boosting round.
2. Use "◀ Back" / "Next ▶" to step through fit → combine pairs.
3. Click "Run (auto-play)" to watch all 3 rounds boost automatically.
