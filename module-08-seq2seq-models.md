# Module 8 — Sequence-to-Sequence Models (Q6 — AI/ML Question)

Build an encoder–decoder bottleneck animation. Use vanilla SVG/JS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** input = 4 word boxes reading "I", "am", "very", "tired". Output = 4 word boxes reading "Je", "suis", "très", "fatigué".

**Layout:** a `.card` with the 4 input boxes on the left in a column, a circle labeled "Context vector" centered (`--primary` fill, sized ~60px), and space on the right for output boxes to appear.

**Behavior on load:** animate each input word box flying into the central circle one at a time (400ms apart), with the circle pulsing (`scale 1 → 1.15 → 1`, `--ease-bounce`, 300ms) on each arrival.

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** Treat this as 5 states (`currentStep` 0–4): step 0 = encoding finished, no output words yet; steps 1–4 = that many output words revealed so far.

**Control:** a scrubber (`min="0" max="4" step="1"`) plus 5 small clickable step indicators labeled "Encoded," "Je," "suis," "très," "fatigué" — clicking any of them, or dragging the scrubber, jumps straight to that state and shows exactly the output words that should be visible by that point (re-render from a precomputed array per step, don't require replaying earlier steps first). A "Decode next word ▶" `.btn-primary` button and "◀ Back" `.btn-secondary` button move one step at a time and re-pulse the central circle on forward moves only (to keep emphasizing it's the same fixed vector reused, not growing). Include a `.btn-secondary` "Reset" button (returns to step 0).

**Caption:** "Every output word had to come from that same one fixed-size circle — notice it never grew, no matter how much information passed through it. That bottleneck is exactly what Transformers removed."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Decode next word" to reveal one output word at a time.
2. Click "◀ Back" or drag the scrubber to review earlier steps.
