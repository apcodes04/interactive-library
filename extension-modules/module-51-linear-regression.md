# Module 51 — Linear Regression (AI/ML Concept)

Build a page showing a line fit to points, with both a manual-fit mode and a real gradient-descent animation. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy regression dataset.

**Exact data:** the toy regression dataset — x = [1,2,3,4,5,6,7,8,9,10], y = [5.1, 6.9, 9.4, 10.8, 13.2, 14.9, 17.3, 18.7, 21.5, 22.8]. Precomputed OLS best fit: slope = 1.98, intercept = 3.02.

**Layout:** a `.card` with an SVG scatter (x 0–11, y 0–26) on the left showing the 10 data points (`--primary`) and a fitted line, and a small SSE-vs-iteration line chart on the right (initially empty, populates during the gradient-descent animation).

**Manual-fit controls:** two sliders, "Slope (m)" range -1 to 5 step 0.01 default 0, and "Intercept (b)" range -5 to 15 step 0.1 default 0. As either slider moves, redraw the line and draw dashed residual lines (`--text-muted`) from each point straight up/down to the line, and live-update a `.readout` showing "Sum of Squared Errors: X.XX," computed directly from the current m/b against the 10 fixed points.

**Gradient descent button:** a `.btn-primary` "Fit with Gradient Descent" button that resets m=0, b=0 and animates 30 real gradient-descent steps (standard squared-error gradient update, fixed learning rate 0.01, computed live in `script.js` from the fixed 10 points — not a fabricated trajectory) converging to approximately slope=1.98, intercept=3.02. Plot each step's SSE on the right-hand chart as it runs, and update the manual-fit sliders' positions to track the animating m/b live so both views stay in sync. Disable the manual sliders while this animation is running; re-enable after.

**Legend:** Data point (`--primary` dot), Fitted line (`--active` while animating, `--success` once SSE stops decreasing meaningfully), Residual (dashed gray line).

**Caption:** "Gradient descent didn't guess the best line — it walked downhill on the squared-error surface, one small step at a time, until the slope of that surface flattened out."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Slope" and "Intercept" sliders and watch the residual lines and SSE change.
2. Click "Fit with Gradient Descent."
3. Watch the SSE chart fall as the line converges to the best fit.
