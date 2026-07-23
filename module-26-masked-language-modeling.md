# Module 26 — Masked Language Modeling (Q5 — LLM Question)

Build a mask-and-predict flip animation using the 6-token Sentence A: "The cat sat on the mat," with "mat" replaced by a `[MASK]` chip. Use vanilla JS/CSS plus a small Chart.js bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact candidate data:** mat 62%, rug 18%, floor 12%, chair 8%.

**Layout:** a `.card` with the sentence as chips, the mask chip visually distinct (dashed `--active` border). A "Predict" `.btn-primary` button.

**Behavior:** clicking "Predict" reveals the candidate bar chart above the mask (bars animating in over 300ms), then after an 800ms pause the mask chip does a 3D flip (CSS `rotateY`, `--ease-bounce`, 400ms) to reveal "mat" in `--success` green. Include `.btn-secondary` "Reset."

**Caption:** "The model never saw this exact word — it inferred 'mat' from everything around the gap, using context from both directions at once."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Predict."
2. Watch the candidate bar chart appear.
3. Watch the mask flip to reveal the true answer.
