# Module 34 — KL Divergence (Q27 — LLM Question)

Build a two-distribution comparison with a live-computed divergence value. Use Chart.js or D3.js dual bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact fixed "true" distribution P** (5 categories): 40%, 25%, 20%, 10%, 5%. Rendered `--primary`, never changes.

**Layout:** a `.card` with P's bar chart on top, and a second bar chart below for Q, starting equal to P, with each bar's top directly draggable (`--active`).

**Behavior:** on every drag, renormalize Q so its 5 bars still sum to exactly 100%, then compute the real KL divergence formula live in JS (`sum(P_i * log(P_i / Q_i))`, do not hardcode) and display it as a `.readout` below both charts, color shifting from `--success` green (near 0) to `--danger` red (large). A "Snap Q to match P" `.btn-secondary` button animates Q's bars sliding to exactly match P's heights (400ms), at which point the readout must hit exactly 0.000.

**Caption:** "Drag any bar in Q away from P and watch the number climb immediately — it only ever returns to exactly zero when the two distributions are identical."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag any bar in the Q chart.
2. Watch the KL divergence readout change.
3. Click "Snap Q to match P" to see it hit exactly zero.
