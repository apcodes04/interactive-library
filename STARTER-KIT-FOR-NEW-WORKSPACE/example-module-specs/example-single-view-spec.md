# Module 74 — Trend Extraction (AI/ML Concept, deepens module 57)

Build a page comparing two ways of extracting a trend line from a noisy series, and showing how each responds to a sudden shift. Use vanilla SVG or Chart.js. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy time-series dataset.

**Exact data:** the toy time-series dataset — 24 fixed monthly values: `[112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140]`.

**Layout:** a `.card` with one line chart: the raw series (`--primary`), a Simple Moving Average line (`--cat-1`, teal), and an Exponential Moving Average line (`--cat-2`, coral), all overlaid on the same axes.

**Computation (live, in `script.js`, from the fixed 24 values):**
- **SMA:** a centered moving average over the window set by the SMA slider.
- **EMA:** `ema[0] = raw[0]`; `ema[t] = α * raw[t] + (1 - α) * ema[t-1]` for t > 0, using the α set by the EMA slider.

**Controls:**
- Slider "SMA window," range 3–12 months, default 6.
- Slider "EMA smoothing (α)," range 0.05–0.9 step 0.05, default 0.3.
- `.btn-secondary` "Inject a sudden shift at month 18" — adds +40 to the raw value at index 18 (0-indexed) and recomputes both trend lines from the modified series. A `.btn-secondary` "Reset" removes the injected shift and restores the original 24 values.

**Behavior to make visible:** a smaller SMA window and a larger EMA α both track the injected shift faster; a larger SMA window and a smaller EMA α both lag behind it longer. Live `.readout`s: "SMA window: N months," "EMA α: X.XX."

**Legend:** Raw series, SMA line, EMA line.

**Caption:** "A larger moving-average window smooths out noise but reacts slower to real change — exponential smoothing reacts faster because it never forgets the most recent point, it just discounts everything before it."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "SMA window" and "EMA smoothing" sliders.
2. Click "Inject a sudden shift at month 18" to see how each trend line responds to a real change.
3. Compare how many months each line takes to catch up to the shift.
