# Module 20 — Positional Encodings (Q19 — LLM Question)

Build a position-slider demo over overlaid sine/cosine curves. Use D3.js or Chart.js. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** plot 4 curves over position 0–50 using the standard formula `PE(pos, 2i) = sin(pos / 10000^(2i/d))`, `PE(pos, 2i+1) = cos(pos / 10000^(2i/d))`, with d=8 and i = 0, 1 (so 4 curves total: sin/cos pair at i=0, sin/cos pair at i=1). Colors: the two i=0 curves in `--primary` (solid/dashed to distinguish sin/cos), the two i=1 curves in `--active` (solid/dashed).

**Control:** a slider labeled "Token position," range 0–50.

**Behavior:** a vertical marker line tracks the slider across all 4 curves; a 4-element `.readout` vector display below shows the exact value of each curve at that position, computed live from the formula (not hardcoded), updating as the slider moves.

**Caption:** "Every position gets its own unique combination of these wave values — that combination is the position, encoded as numbers the model can add directly to a token's embedding."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Token position" slider.
2. Watch the marker line move across all 4 curves.
3. Read the 4-value vector readout.
