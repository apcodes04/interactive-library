# Module 67 — Quantization (INT8/4-bit) (LLM Concept)

Build a page showing a fixed weight vector lose precision (and shrink in memory) as it's quantized from FP32 down to INT8 and INT4. Use vanilla SVG/CSS bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** 12 fixed FP32 weight values: `[0.023, -0.451, 0.812, -0.093, 1.204, -1.008, 0.334, -0.667, 0.045, -0.229, 0.981, -0.512]`.

**Layout:** a `.card` with a bar chart of all 12 weights (original value in `--primary`, quantized-then-dequantized value overlaid or side by side), a `.readout` "Mean absolute quantization error: X.XXXX," and a memory-size comparison bar beneath it.

**Control:** three toggle buttons, "FP32 (original)," "INT8," "INT4." Selecting INT8 or INT4 computes, live in `script.js`, a real linear min-max quantization of the 12 fixed values (`scale = (max - min) / (2^bits - 1)`, standard zero-point formula), then dequantizes back to a float for display — a real, deterministic transformation, not fabricated numbers.

**Memory bar:** shows total bits for the 12 weights at each precision — FP32: 384 bits, INT8: 96 bits, INT4: 48 bits — as three comparatively-sized horizontal bars.

**Legend:** Original (FP32) bar, Quantized bar, Quantization error (gap between them).

**Caption:** "Fewer bits per weight means a coarser set of representable values — the model gets smaller and faster, and every weight quietly rounds to its nearest available level."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "FP32," "INT8," or "INT4" to switch precision.
2. Watch the bars shift and the quantization-error readout change.
3. Compare the total memory-size bar across all three precisions.
