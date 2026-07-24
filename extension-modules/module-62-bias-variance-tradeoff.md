# Module 62 — Bias-Variance Tradeoff (AI/ML Concept)

Build a page showing a polynomial fit getting more flexible while training and held-out test error diverge. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy regression dataset.

**Exact data:** training data — the toy regression dataset (10 points, x = [1..10], y = [5.1, 6.9, 9.4, 10.8, 13.2, 14.9, 17.3, 18.7, 21.5, 22.8]). Held-out test points (fixed, not used for fitting): x = [1.5, 3.5, 5.5, 7.5, 9.5], y = [6.5, 10.9, 15.5, 19.0, 24.5].

**Layout:** a `.card` with the main chart on the left (x 0–11, y 0–26) showing the 10 training points, the 5 test points (distinct marker shape), and the current polynomial fit curve, and a second chart on the right plotting Training error and Test error against polynomial degree 1–9.

**Control:** slider "Model complexity (polynomial degree)," range 1–9 step 1, default 1. On every change, fit a real polynomial regression of that degree to the 10 training points (standard least-squares, computed live in `script.js`), redraw the fitted curve, and plot that degree's training error and test error as points on the right-hand chart (accumulating all degrees visited, or precompute all 9 up front and just move a vertical marker — either is acceptable as long as both lines are fully visible by degree 9).

**Behavior to make visible:** training error should fall monotonically as degree increases (the curve wiggles through more and more points); test error should fall then rise, forming a visible U-shape, with the minimum (the "sweet spot," mark it with a `--success` dot) typically around a low-to-middle degree.

**Legend:** Training point, Held-out test point, Training error line (`--primary`), Test error line (`--danger`), Sweet spot (marker).

**Caption:** "Training error will always keep falling as the model gets more complex — the test-error curve is the one that tells you when you've crossed from underfitting into overfitting."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Model complexity" slider from 1 to 9.
2. Watch the fitted curve wiggle more and the training-error line keep dropping.
3. Watch the test-error line fall, then rise — find its lowest point.
