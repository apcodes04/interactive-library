# Module 76 — Residual & Anomaly Detection (AI/ML Concept, deepens module 57)

Build a page computing the residual left after removing trend and seasonality, and flagging points that stand out from it. Use vanilla SVG or Chart.js. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy time-series dataset.

**Exact data:** the toy time-series dataset — 24 fixed monthly values: `[112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140]`.

**Layout:** a `.card` with the raw series line chart on top and the residual chart (centered at a 0 baseline) below it.

**Computation (live, in `script.js`, from the fixed 24 values):** Trend = a 12-month centered moving average. Seasonal = per-calendar-month average deviation from trend, per module 75's method (or recomputed identically here). Residual = `raw[t] - trend[t] - seasonal[t mod 12]`, for every t where trend is defined. Standard deviation of the residual series, computed once from these same 24 (or fewer, where trend is undefined at the series edges) values.

**Control:** slider "Anomaly threshold (± standard deviations)," range 1.0–3.0 step 0.1, default 2.0. On every change, recompute which residual points fall outside `± threshold × stdDev` and flag them.

**Marking:** flagged points get a `--danger` marker on the residual chart, and a matching `--danger` ring around the corresponding point on the raw series chart above, so the user can trace a flagged anomaly back to its real month and value. Live `.readout`: "Flagged anomalies: N of [total scored points]."

**Legend:** Residual (normal), Flagged anomaly, Threshold band (dashed lines at ± threshold × stdDev).

**Caption:** "Anomalies aren't unusually large raw values — they're points where the leftover, after removing trend and seasonality, is bigger than chance alone would predict."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Anomaly threshold" slider.
2. Watch which residual points get flagged as the threshold tightens or loosens.
3. Check the raw series chart to see exactly which real month each flagged anomaly corresponds to.
