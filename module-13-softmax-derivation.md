# Module 13 — Softmax Derivation (Q21 — LLM Question)

Build a draggable-logits-to-probabilities demo. Use Chart.js or D3.js bar charts. Follow `00-design-system.md` for colors/type/motion.

**Exact starting data:** 5 bars labeled "Logit A" through "Logit E," starting values 2, 1, 0, −1, −2, draggable range −5 to 5 (drag the bar top to change its value).

**Layout:** a `.card` with the draggable logit bar chart on top (`--primary`), and a second bar chart below showing the live softmax-transformed probabilities (`--active`), each bar labeled with its exact percentage.

**Behavior:** on every drag, recompute the real softmax formula (`exp(x_i) / sum(exp(x_j))`) live in JS from the current 5 logit values (never hardcode the output) and redraw the bottom chart; bars must always sum to exactly 100%.

**Caption:** "Drag Logit A up by just 1 — notice how much more its probability jumps than the raw logit did. That's the exponential in softmax amplifying small gaps."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag any logit bar up or down.
2. Watch the probability bar chart below reshape.
