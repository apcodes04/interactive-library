# Module 63 — L1/L2 Regularization, Ridge vs. Lasso (AI/ML Concept)

Build a page showing 6 regression coefficients shrink differently under Ridge (L2) vs. Lasso (L1) as regularization strength increases. Use vanilla SVG/CSS bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** a fixed toy dataset with 6 features where only 2 are truly predictive. Fixed "true" coefficient vector: `[3.0, -2.0, 0, 0, 0, 0]` (features 1 and 2 matter; features 3–6 are pure noise). Generate 30 fixed toy samples from this true vector plus small fixed Gaussian noise (seed 42) directly in `script.js`, so the underlying regression problem is deterministic every load. Compute, live, the fitted coefficient vector at any given regularization strength via closed-form ridge regression (L2) and via coordinate-descent lasso (L1, a real small fixed-iteration implementation, e.g. 200 iterations) — both real, deterministic computations from the fixed generated samples.

**Layout:** a `.card` with a live bar chart of all 6 coefficients (one bar per feature), and a toggle above it: "Ridge (L2)" / "Lasso (L1)."

**Control:** slider "Regularization strength (λ)," log scale 0.001–10, default 0.001 (near-unregularized). Moving it recomputes and redraws all 6 bars for whichever method (Ridge or Lasso) is currently toggled on.

**Behavior to make visible:** under Ridge, all 6 coefficients shrink smoothly toward zero as λ increases but rarely reach exactly zero. Under Lasso, features 3–6 (the true zeros) should visibly snap to exactly zero once λ passes a moderate threshold, while features 1 and 2 shrink more slowly and stay nonzero longer.

**Marking:** feature 1 and 2 bars (the true nonzero coefficients) render `--primary`; features 3–6 (true zero) render `--frozen` gray, and any bar Lasso has driven to exactly zero gets a small `--danger` strikethrough/ring marker to call out the moment it happened.

**Legend:** True nonzero coefficient (feature 1/2), True zero coefficient (feature 3–6), Zeroed out by Lasso (marker).

**Caption:** "Ridge shrinks every coefficient toward zero but rarely all the way there — Lasso is willing to zero some out completely, which is why it can do feature selection and Ridge can't."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Toggle between "Ridge (L2)" and "Lasso (L1)."
2. Drag the "Regularization strength (λ)" slider.
3. Watch which coefficients shrink smoothly vs. snap to exactly zero.
