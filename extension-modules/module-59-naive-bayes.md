# Module 59 — Naive Bayes (AI/ML Concept)

Build a page showing per-feature class-conditional density curves and a live posterior computed for a user-placed test point. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42, Class A colored `--primary`, Class B colored `--active`), treating x and y as two independent features. Compute, live in `script.js` from these fixed 40 points: a Gaussian density estimate (mean, variance) per class per feature — 4 curves total (Class A on X, Class A on Y, Class B on X, Class B on Y).

**Layout:** a `.card` with the main 2D scatter (0–100 both axes) on the left, and two small 1D density-curve charts stacked on the right — one for feature X (Class A and Class B curves overlaid), one for feature Y (same).

**Interaction:** clicking or dragging anywhere on the main scatter drops a "test point" marker. On every move, compute the Naive Bayes posterior for both classes (product of the two features' Gaussian likelihoods × equal 0.5/0.5 prior, real computation from the fixed density parameters) and:
- Draw a vertical marker line on the X density chart and a vertical marker line on the Y density chart at the test point's exact x and y values.
- Show a live `.readout`: "Predicted: Class A/B — posterior X%."
- Fill the test-point marker with the predicted class's color.

**Legend:** Class A density curve, Class B density curve, Test point, Predicted class marker.

**Caption:** "Naive Bayes multiplies each feature's evidence separately and never checks whether X and Y are actually related — that's the 'naive' part, and it still works well enough to be useful."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click anywhere on the scatter to drop a test point.
2. Watch the marker lines on both density curves and the predicted class update.
3. Drag the test point around the boundary region to see the posterior probability shift.
