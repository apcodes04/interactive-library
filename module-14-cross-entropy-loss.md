# Module 14 — Cross-Entropy Loss (Q23 — LLM Question)

Build a single interactive loss-curve demo. Use Chart.js. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with a line chart plotting `L(p) = −log(p)` for p from 0.01 to 1.0, in `--primary`.

**Control:** a slider labeled "Predicted probability of the true class," range 0.01–1.0, default 0.5.

**Behavior:** a dot on the curve tracks the slider position live, colored `--success` green when p > 0.7, shifting through `--active` amber (0.3–0.7) to `--danger` red when p < 0.3. A `.readout` below shows "Loss = [value]" (compute `-Math.log(p)` live, do not hardcode).

**Caption:** "Being confidently wrong, low probability on the true class, is punished far harder than being merely unsure. That's the shape of this curve, not a design choice bolted on afterward."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Predicted probability" slider.
2. Watch the dot move along the curve.
3. Read the "Loss" readout.
