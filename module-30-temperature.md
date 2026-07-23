# Module 30 — Temperature (Q4 — LLM Question)

Build a temperature-reshaping demo. Use Chart.js. Follow `00-design-system.md` for colors/type/motion.

**Exact underlying logits (8 tokens, fixed, never change):** `sat: 4.0, ran: 2.0, walked: 1.8, stood: 1.2, jumped: 0.8, stayed: 0.5, left: 0.2, flew: -0.5`.

**Layout:** a `.card` with a slider labeled "Temperature," range 0.1–2.0, step 0.05, default 1.0, and a bar chart of the 8 tokens in `--primary`.

**Behavior:** on every slider move, recompute `softmax(logits / T)` live in JS from the fixed logits above (never hardcode per-temperature outputs) and redraw the bars (300ms transition). A "Sample one token" `.btn-primary` button performs a weighted-random draw from the current distribution and animates that bar flashing `--success` green and scaling up briefly (`--ease-bounce`).

**Legend:** add a compact `.legend` under the chart with two entries — a `--primary` swatch labeled "Candidate token, by probability" and a `--success` swatch labeled "Token just sampled" — since the bar color change on sample isn't otherwise explained anywhere on the page.

**Caption:** "Same underlying logits the entire time — only the temperature changed. Watch how flat this gets past 1.5, and how sharp it gets below 0.3."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Temperature" slider.
2. Watch the bar chart reshape.
3. Click "Sample one token" to draw one.
