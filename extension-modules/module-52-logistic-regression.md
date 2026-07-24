# Module 52 — Logistic Regression (AI/ML Concept)

Build a page showing a linear decision boundary over a 2-class scatter, driven by a movable classification threshold, plus a small sigmoid-curve inset. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42, Class A centered (30,30) colored `--primary`, Class B centered (70,70) colored `--active`). Precompute (live, in `script.js`, from these fixed 40 points) a simple logistic-regression fit via gradient descent on log-loss, fixed learning rate and fixed iteration count (e.g. 500 iterations) so the resulting boundary is deterministic every load.

**Layout:** a `.card` with the main SVG scatter (0–100 both axes) showing all 40 points and a straight decision-boundary line, and a small inset panel to the right showing the classic sigmoid S-curve (probability 0–1 vs. signed distance from the boundary) with a marker dot tracking the current threshold's position on that curve.

**Control:** one slider, "Decision threshold," range 0.0–1.0 step 0.01, default 0.5. Moving it shifts the boundary line parallel to itself (the offset corresponding to that probability threshold under the fitted model) and live-recomputes, for all 40 points: which side of the line each one now falls on. Live `.readout`s: "Class A correct: X/20," "Class B correct: Y/20," "Accuracy: Z%."

**Misclassification marking:** any point that ends up on the wrong side of the current boundary (relative to its true class) gets a `--danger` ring drawn around it, recomputed on every threshold change.

**Legend:** Class A, Class B, Decision boundary (line), Misclassified (ring).

**Caption:** "Logistic regression doesn't output a class — it outputs a probability, and the threshold you choose decides where that probability gets carved into a hard line."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Decision threshold" slider.
2. Watch the boundary line shift and the accuracy readout change.
3. Watch which points flip between correct and misclassified as the threshold moves.
