# Module 75 — Seasonality Detection (AI/ML Concept, deepens module 57)

Build a page isolating the repeating monthly pattern from a two-year series and showing what's left once it's removed. Use vanilla SVG or Chart.js. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy time-series dataset.

**Exact data:** the toy time-series dataset — 24 fixed monthly values: `[112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140]` (index 0–11 = year 1's Jan–Dec, index 12–23 = year 2's Jan–Dec).

**Layout:** a `.card` with the raw series line chart (`--primary`) at the top, and a 12-bar "Seasonal index per month" chart below it (one bar per calendar month, Jan–Dec).

**Computation (live, in `script.js`, from the fixed 24 values):** overall mean of all 24 values; for each calendar month position (0–11), the seasonal index is the average of `(raw[month] - overall mean)` across both occurrences of that month (year 1 and year 2) — a real, deterministic computation. Deseasonalized series = `raw[t] - seasonalIndex[t mod 12]` for every t.

**Interaction:** clicking a bar in the seasonal-index chart highlights (a `--active` ring) that month's two data points on the raw series chart above (e.g. clicking "Jul" highlights both July points, one in each year), showing they share a similar deviation from the mean. A `.btn-secondary` toggle "Show deseasonalized series" swaps the raw line for the deseasonalized line, visibly flattening the repeating bumps.

**Legend:** Raw series, Seasonal index bar (above zero / below zero), Highlighted month, Deseasonalized series.

**Caption:** "Each calendar month carries its own consistent bias year after year — remove that repeating bias and the seasonal bumps disappear, leaving only trend and noise."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a bar in the "Seasonal index per month" chart to highlight that month's two occurrences on the raw series.
2. Toggle "Show deseasonalized series" to see the seasonal pattern removed.
3. Compare which months run consistently above vs. below the overall mean.
