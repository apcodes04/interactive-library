# Module 58 — Support Vector Machine (AI/ML Concept)

Build a page showing a maximum-margin linear boundary with visible margin lines and highlighted support vectors. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42, Class A colored `--primary`, Class B colored `--active`). Implement a small linear soft-margin SVM directly in `script.js`: minimize hinge loss + regularization via a fixed-iteration gradient descent (200 iterations, fixed learning rate, fixed random initial weights) from the fixed 40 points — real, deterministic computation, re-solved whenever the regularization slider changes.

**Layout:** a `.card` with an SVG scatter (0–100 both axes) showing all 40 points, the decision-boundary line, and two parallel dashed margin lines on either side.

**Control:** slider "Regularization (C)," log scale 0.1–10, default 1 — re-solves the SVM from the same fixed starting point and iteration count at the new C value, animating the boundary and margin lines to their new position. Higher C narrows the margin (fewer errors tolerated); lower C widens it. Live `.readout`s: "Margin width: X.XX," "Support vectors: N."

**Support vector highlighting:** any point lying on or inside the margin gets a `--success` ring around it, recomputed after every re-solve.

**Legend:** Class A, Class B, Decision boundary (line), Margin (dashed line), Support vector (ring).

**Caption:** "Only the points sitting right at the edge of the margin — the support vectors — actually decide where that boundary sits; every other point could vanish and the line wouldn't move."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Regularization (C)" slider.
2. Watch the margin width and the highlighted support vectors change.
3. Notice how only points near the boundary ever become support vectors.
