# Module 64 — Cross-Validation (AI/ML Concept)

Build a multi-stage animated pipeline showing 5-fold cross-validation hold out each fold in turn. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42). Partition the 40 points into 5 fixed folds of 8 points each (a deterministic fixed partition, e.g. points in generation order 1–8 → Fold 1, 9–16 → Fold 2, and so on). Fixed toy per-fold accuracy results (hardcoded, illustrative): Fold 1 = 87.5%, Fold 2 = 75.0%, Fold 3 = 100%, Fold 4 = 87.5%, Fold 5 = 62.5%; Mean accuracy = 82.5%.

**Categorical coloring:** Fold 1 = `--cat-1` (teal), Fold 2 = `--cat-2` (coral), Fold 3 = `--cat-3` (rose), Fold 4 = `--cat-4` (sky), Fold 5 = `--cat-5` (violet) — each fold keeps its color through every stage.

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–6) — see `00-design-system.md`'s "Multi-stage modules" section, reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with the main SVG scatter (0–100 both axes) showing all 40 points colored by fixed fold assignment, and a summary bar-chart panel that only appears at the final stage.

**Stages (7, index 0–6):**
- **Stage 0 — All data, folds assigned:** all 40 points shown, each already colored by its fixed fold (1–5).
- **Stages 1–5 — Fold k held out:** Fold k's 8 points get a bold `--primary` ring and enlarge slightly (labeled "Test"); the other 32 points dim to ~0.5 fill-opacity (labeled "Train") while keeping their individual fold colors. Show that fold's fixed accuracy as a `.readout`.
- **Stage 6 — Summary:** a bar chart of all 5 folds' accuracies (each bar in its fold's categorical color) plus a dashed `--success` line marking the mean (82.5%).

**Legend (dynamic, per stage):**
- Stage 0: Fold 1, Fold 2, Fold 3, Fold 4, Fold 5.
- Stages 1–5: Fold 1–5 (same 5 items), plus "Currently held out (ring)."
- Stage 6: Fold 1–5 accuracy bar, Mean accuracy (dashed line).

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies throughout.

**Caption:** "No single fold's accuracy tells you how good the model really is — the average across all five, especially the low outlier fold, is the honest number."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage button, or drag the scrubber, to see each fold held out in turn.
2. Use "◀ Back" / "Next ▶" to step fold by fold.
3. Click "Run (auto-play)" to watch all 5 folds evaluate automatically, then see the summary.
