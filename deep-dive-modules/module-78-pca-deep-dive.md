# Module 78 — PCA Deep Dive (AI/ML Concept, deepens module 56)

Build a multi-stage animated walkthrough of PCA: a simple 2D rotation first, then a fuller 3D-to-principal-components cascade with variance-explained density strips. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy 2D and 3D PCA datasets.

**Exact data:** **2D dataset** (7 points): x = [2, 3, 4, 5, 5, 6, 7], y = [3, 4, 4, 5, 6, 5, 6]. **3D dataset** (60 points, seed = 7): generated live in `script.js` exactly per `00-global-spec.md`'s recipe — `x = b + jitter_x`, `y = 0.8*b + jitter_y`, `z = 0.3*b + jitter_z`, with `b` uniform in [-10, 10] and each jitter uniform in its own fixed range. Implement a real covariance-matrix eigen-decomposition directly in `script.js` for both datasets — real, deterministic computation, not fabricated arrow directions or variance percentages.

**Categorical coloring:** PC1 = `--cat-1` (teal), PC2 = `--cat-2` (coral), PC3 = `--cat-3` (rose) — carried through every stage and panel each axis appears in. Never use `--success`/`--danger` for these, since they're already spoken for as semantic colors.

**This is the one multi-stage module in this set.** Build all three off one shared `currentStage` variable (0–5), not three separate mechanisms — see `00-design-system.md`'s "Multi-stage modules" section, and use `prototypes/module-53-decision-tree/` in `diagrams/extension-modules/` (an already-built, already-approved example in this exact product family) as your direct template for the shared-state pattern, plus `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the original reference.

**Layout:** a `.card` with a main panel area whose contents change per stage (described below), a scrubber, and the standard controls row.

**Stages (6, index 0–5):**
- **Stage 0 — Original data:** the 7-point 2D scatter, plain axes labeled x/y (0–10), all points `--primary`, no arrows yet.
- **Stage 1 — Principal directions found:** two arrows drawn from the data's centroid — PC1 (`--cat-1`) and PC2 (`--cat-2`), each scaled by the square root of its eigenvalue — overlaid on the same 7-point scatter.
- **Stage 2 — Rotated output:** the same 7 points re-plotted in PC1–PC2 coordinates (axes now labeled "pc1"/"pc2," colored to match the arrows from stage 1), demonstrating the rotation into the new basis.
- **Stage 3 — 3D data cloud:** switch datasets to the 60-point 3D cloud, rendered as two side-by-side 2D projections (the x–y plane and the x–z plane — an isometric single-view 3D render is not required, two orthographic projections make the same point more simply), with the dominant PC1 direction arrow (`--cat-1`) drawn through both projections.
- **Stage 4 — Projected onto PC1–PC2:** the 60 points re-plotted in the PC1–PC2 plane alone (2D), showing what's kept when PC3 is discarded.
- **Stage 5 — Variance explained:** three horizontal density strips, one per component (PC1 teal, PC2 coral, PC3 rose), each rendered as a row of small dots or a smoothed histogram along a fixed-width axis, visually widest for PC1 and narrowest for PC3, each labeled with its exact `.readout` percentage: `eigenvalue_i / sum(all eigenvalues) * 100`, computed from the 3D dataset's real covariance matrix.

**Legend (dynamic, per stage):**
- Stage 0: empty — hide the legend.
- Stage 1: PC1 direction, PC2 direction.
- Stage 2: PC1 axis, PC2 axis.
- Stage 3: Data point (3D cloud), PC1 direction.
- Stage 4: PC1 axis, PC2 axis.
- Stage 5: PC1 strip, PC2 strip, PC3 strip.

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies throughout: de-emphasis dims box background/border only, never the text.

**Caption:** "The first component isn't chosen for convenience — it's the exact direction that captures the most spread in the data, and each later component captures the next largest amount from whatever's left, always at right angles to the ones before it."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click any stage button, or drag the scrubber, to move from the raw 2D data to the full 3D-to-variance-explained cascade.
2. Use "◀ Back" / "Next ▶" to step through one stage at a time.
3. Click "Run (auto-play)" to watch the whole PCA story play automatically.
