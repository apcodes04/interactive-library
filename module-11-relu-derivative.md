# Module 11 — ReLU Derivative (Q28 — AI/ML Question)

Build two synced plots. Use Chart.js. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with two side-by-side Chart.js line charts. Left: f(x) = ReLU(x) = max(0, x), x from −5 to 5. Right: f'(x) — 0 for x<0, 1 for x>0, shown as a visible open-circle gap at x=0 (undefined). Both lines in `--primary`.

**Control:** one slider labeled "x," range −5 to 5, step 0.1, default 0.

**Behavior:** a dot (`--active` amber) tracks the current x on both charts simultaneously as the slider moves. Below the charts, two `.readout` values: "f(x) = [value]" and "f'(x) = [value]" (show "undefined" in `--danger` red text exactly at x=0).

**Caption:** "The derivative is either exactly 0 or exactly 1 — nothing in between — and that simplicity is a big part of why ReLU trains so cleanly."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "x" slider.
2. Watch the dot move on both charts.
3. Read the f(x) and f'(x) readouts.
