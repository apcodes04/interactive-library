# Module 2 — Overfitting (Q16 — AI/ML Question)

Build a page showing a polynomial curve fit to noisy data as complexity increases. Use D3.js. Follow `00-design-system.md` for colors/type/motion.

**Data:** 25 points around a gentle true function `y = 20 + 15*sin(x/15)` for x from 0 to 100, with random noise ±8 added (seed = 7, so it's identical every load). Hold out 5 fixed points (indices 3, 8, 13, 18, 23) as a **test set**, rendered in `--active` amber and never used for the fitted curve; the other 20 render in `--primary` blue as the **training set**.

**Layout:** one scatter plot with an overlaid fitted curve (`--success` green when test error is low, shifting toward `--danger` red as test error rises), plus two live `.readout` numbers below: "Train error" and "Test error."

**Control:** one slider labeled "Model complexity (polynomial degree)," range 1–15.

**Exact anchor points for the precomputed lookup table** (interpolate smoothly between them for degrees not listed; train error is mean squared error on the 20 training points, test error on the 5 held-out points):

| degree | train error | test error | curve behavior |
|---|---|---|---|
| 1 | 9.0 | 8.5 | near-straight line, underfit |
| 3 | 5.5 | 5.0 | gentle curve, reasonable fit |
| 5 | 3.0 | 3.2 | closest test error gets to train error — the sweet spot |
| 8 | 1.5 | 5.5 | starts wiggling, test error rising |
| 12 | 0.4 | 9.0 | visibly wiggling through most training points |
| 15 | 0.05 | 13.0 | curve passes through nearly every training point, wild oscillation between them |

**Caption:** "Training error keeps falling all the way to degree 15 — but test error bottoms out around degree 5 and then climbs. That gap after the minimum is overfitting."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Model complexity" slider.
2. Watch the fitted curve reshape.
3. Compare the "Train error" and "Test error" readouts.
