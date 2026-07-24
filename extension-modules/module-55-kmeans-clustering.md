# Module 55 — K-Means Clustering (AI/ML Concept)

Build a multi-stage animated pipeline showing Lloyd's algorithm converge on 3 clusters from deliberately poor starting centroids. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy clustering dataset.

**Exact data:** the toy clustering dataset (30 points, seed 42, 3 Gaussian-like clusters centered (20,25), (70,30), (45,80)). Fixed, deliberately bad initial centroids: Centroid 1 = (10,10), Centroid 2 = (90,10), Centroid 3 = (50,90). Run exactly 2 full Lloyd's-algorithm iterations (assign → update → assign → update), computed live and deterministically in `script.js` from these fixed points and fixed initial centroids — real algorithm, not a fabricated animation.

**Categorical coloring:** Cluster 1 = `--cat-1` (teal), Cluster 2 = `--cat-2` (coral), Cluster 3 = `--cat-3` (rose). Centroids render as larger diamond markers in the matching color; unassigned points render `--frozen` gray.

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–5) — see `00-design-system.md`'s "Multi-stage modules" section, reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with a single SVG scatter (0–100 both axes) showing all 30 points and the 3 centroid markers, updating in place across stages.

**Stages (6, index 0–5):**
- **Stage 0 — Initial centroids:** the 3 fixed bad centroids shown; all 30 points still `--frozen` gray (unassigned).
- **Stage 1 — Assign (iteration 1):** every point recolors to its nearest centroid's categorical color.
- **Stage 2 — Update (iteration 1):** each centroid animates to the mean position of its currently-assigned points.
- **Stage 3 — Assign (iteration 2):** points re-assigned to whichever centroid is now nearest (some points may switch clusters).
- **Stage 4 — Update (iteration 2):** centroids move again to the new means.
- **Stage 5 — Final:** the resulting clustering after 2 iterations, with a "stable" note if no points changed cluster on the last assign step.

**Legend (dynamic, per stage):**
- Stage 0: Unassigned point (`--frozen`), Centroid 1/2/3.
- Stages 1–5: Cluster 1/2/3 point (`--cat-1`/`--cat-2`/`--cat-3`), Centroid 1/2/3.

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies: de-emphasis dims box background/border only, never labels or counts.

**Caption:** "K-Means doesn't know the 'right' clusters upfront — it just keeps nudging centroids toward the mean of whoever's currently closest, until nobody moves anymore."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage button, or drag the scrubber, to see one assign/update step at a time.
2. Use "◀ Back" / "Next ▶" to move one step.
3. Click "Run (auto-play)" to watch the centroids converge automatically.
