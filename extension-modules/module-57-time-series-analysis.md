# Module 57 — Time Series Analysis (AI/ML Concept)

Build a page decomposing a raw monthly series into trend, seasonal, and residual components. Use Chart.js or vanilla SVG line charts. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy time-series dataset.

**Exact data:** the toy time-series dataset — 24 fixed monthly values: `[112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140]`.

**Layout:** a `.card` with a main line chart at the top (the currently selected view) and 4 toggle buttons above it: "Raw," "Trend," "Seasonal," "Residual," plus a 5th "All" button that stacks all four as small charts.

**Computation (live, in `script.js`, from the fixed 24 values):**
- **Trend:** a centered moving average over the window set by the slider below (default 12 months).
- **Seasonal:** for each calendar month position (1–12), the average deviation of that month's raw values from the trend, repeated across both years.
- **Residual:** raw − trend − seasonal, for every point where trend is defined.

**Control:** slider "Moving average window," options 3, 6, 12 months (snap to these three values only), default 12 — recomputes the trend (and downstream seasonal/residual) live and redraws whichever chart(s) are currently shown.

**Colors:** Raw series line = `--primary`. Trend line = `--success`. Seasonal line = `--active`. Residual line = `--text-muted`, centered at a 0 baseline.

**Legend:** Raw series, Trend, Seasonal component, Residual.

**Caption:** "The bumpy raw line is really three simpler signals stacked on top of each other — pull them apart and each one is easy to reason about alone."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Trend," "Seasonal," or "Residual" to isolate that component.
2. Drag the "Moving average window" slider and watch the trend line change smoothness.
3. Click "All" to see all four charts stacked together.
