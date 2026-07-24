# Module 56 — PCA & LDA (AI/ML Concept)

Build a page contrasting an unsupervised max-variance projection axis (PCA) against a supervised max-class-separation axis (LDA) on the same points. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy clustering dataset.

**Exact data:** the toy clustering dataset (30 points, seed 42, 3 known clusters centered (20,25), (70,30), (45,80)), colored by their true cluster: Cluster 1 = `--cat-1`, Cluster 2 = `--cat-2`, Cluster 3 = `--cat-3`. Compute, live in `script.js` from these fixed 30 points: (a) the PCA first-principal-component direction via covariance-matrix eigen-decomposition (real computation, maximizes total variance, ignores cluster labels), and (b) the LDA direction that maximizes between-cluster scatter over within-cluster scatter (real computation, uses the known cluster labels).

**Layout:** a `.card` with the 2D scatter (0–100 both axes) on top, a draggable projection line through its center, and a 1D "projection strip" below showing every point's position once projected onto the current line (same colors as the 2D points, collapsed onto one axis).

**Controls:**
- Slider "Projection angle," range 0–180° step 1, default 0 — rotates the line and live-recomputes the 1D projection strip and a `.readout` "Variance captured: X%."
- `.btn-secondary` "Show PCA axis" — snaps the line to the computed PCA direction.
- `.btn-secondary` "Show LDA axis" — snaps the line to the computed LDA direction.

**Legend:** Cluster 1/2/3 point (`--cat-1`/`--cat-2`/`--cat-3`), Projection axis (line), Projected point (on the strip).

**Caption:** "PCA finds the direction of most spread with no idea which cluster is which — LDA cheats by using the labels to find the direction that keeps the clusters furthest apart."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Projection angle" slider and watch the 1D strip below update.
2. Click "Show PCA axis" to snap to the maximum-variance direction.
3. Click "Show LDA axis" to snap to the maximum-class-separation direction and compare.
