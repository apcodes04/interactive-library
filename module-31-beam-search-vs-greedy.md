# Module 31 — Beam Search vs. Greedy Decoding (Q3 — LLM Question)

Build a branching-tree step-through comparison with beam width k=2. Use D3.js tree/graph layout. Follow `00-design-system.md` for colors/type/motion.

**Exact tree data (depth 3, probabilities are edge weights from their parent):**

Depth 1 (root's children): A = 0.40, B = 0.35, C = 0.25.

Depth 2:
- from A: A1 = 0.30, A2 = 0.70 → cumulative paths: A-A1 = 0.12, A-A2 = 0.28
- from B: B1 = 0.90, B2 = 0.10 → cumulative paths: B-B1 = 0.315, B-B2 = 0.035
- from C: not expanded (pruned at depth 1 by both greedy and beam)

Depth 3:
- from B-B1: B1a = 0.60 → cumulative B-B1-B1a = 0.189
- from A-A2: A2a = 0.50 → cumulative A-A2-A2a = 0.140

**Greedy path:** always takes the single highest-probability child at each step: root→A (0.40 > 0.35) → A2 (0.70 is A's higher child) → A2a (0.50). Final cumulative probability: **0.140.**

**Beam search (k=2) path:** at depth 1 keeps A (0.40) and B (0.35), prunes C. At depth 2, ranks all 4 resulting cumulative paths (A-A1=0.12, A-A2=0.28, B-B1=0.315, B-B2=0.035) and keeps the top 2: B-B1 (0.315) and A-A2 (0.28). At depth 3, expands only those two survivors, arriving at final cumulative **0.189** via B-B1-B1a — beating greedy's 0.140 despite greedy "looking better" at step 1.

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** Treat this as 4 states (`currentDepth` 0–3): depth 0 = just the root nodes for both panels; depths 1–3 = that many levels expanded, using the exact precomputed numbers above.

**Layout:** a `.card` with two panels, "Greedy" and "Beam search (k=2)," a scrubber (`min="0" max="3" step="1"`), 4 clickable depth indicators ("Root," "Depth 1," "Depth 2," "Depth 3"), "◀ Back" / "Expand next level ▶" `.btn-secondary`/`.btn-primary` buttons, and a `.btn-secondary` "Reset" (returns to depth 0). Clicking a depth indicator or dragging the scrubber jumps both panels directly to that depth's exact precomputed state (discarded beam branches shown faded to `--frozen` gray at any depth ≥ the point they were pruned, not just when reached by forward stepping); using Expand/Back one level at a time plays the reveal animation. Only at depth 3 do both panels show their final cumulative probability as a `.readout`, beam search's in `--success` green (it won) and greedy's in `--danger` red (it lost, despite looking locally better at depth 1) — at depths 0–2, no final-probability readout is shown yet, since the comparison isn't decided until depth 3.

**Caption:** "Greedy grabbed the better-looking option first — and still ended up with the worse full sentence. Beam search kept a second option alive long enough to prove it was better."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a depth indicator, or drag the scrubber.
2. Use "Expand next level ▶" / "◀ Back" to step through all 3 depths.
3. Compare the final readouts at depth 3.
