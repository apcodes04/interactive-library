# Module 77 — Autocorrelation: ACF/PACF (AI/ML Concept, deepens module 57)

Build a page computing and visualizing the Autocorrelation Function and Partial Autocorrelation Function of a fixed series, with a lag selector that makes the correlation concrete via a scatter plot. Use vanilla SVG or Chart.js. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy time-series dataset.

**Exact data:** the toy time-series dataset — 24 fixed monthly values: `[112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140]`.

**Layout:** a `.card` with two stacked bar charts — ACF (lags 1–12) on top, PACF (lags 1–12) below — and a small scatter-plot panel beneath both.

**Computation (live, in `script.js`, from the fixed 24 values):** ACF at lag k = the standard sample autocorrelation formula (covariance of `raw[t]` and `raw[t+k]` divided by the series variance, summed over all valid t). PACF at lag k = via the Durbin-Levinson recursion (or an equivalent regression-based approach) — a real, deterministic computation, not fabricated bar heights. Confidence band = `± 1.96 / sqrt(24)`, drawn as dashed horizontal lines on both charts.

**Interaction:** clicking a lag number (1 through 12, rendered as clickable labels under the ACF chart) highlights that lag's bar on both the ACF and PACF charts (`--primary` border) and populates the scatter panel with points `(raw[t], raw[t - lag])` for every valid t at that lag — a direct visual of what "correlated at this lag" actually looks like as a scatter.

**Legend:** ACF/PACF bar (within confidence band, `--frozen`), ACF/PACF bar (exceeds confidence band, `--primary`), Confidence band (dashed line).

**Caption:** "A tall bar at lag 12 in the ACF is the numeric fingerprint of the yearly seasonality you can already see by eye in the raw series — autocorrelation just measures it precisely instead of eyeballing it."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a lag (1 through 12) to select it.
2. Watch the scatter panel plot `value[t]` against `value[t − lag]` for that lag.
3. Compare which lags exceed the confidence band in the ACF vs. the PACF.
