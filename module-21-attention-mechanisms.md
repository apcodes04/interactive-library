# Module 21 — Attention Mechanisms, Intuitive (Q48 — LLM Question)

Build a click-a-word attention-line demo using the 9-token Sentence A: "The cat sat on the mat because it was" (treat "tired" as a 10th optional token if needed, otherwise stop at "was"). Use D3.js. Follow `00-design-system.md` for colors/type/motion.

**Exact precomputed attention weights (each row sums to ~1.0):**
- Clicking **"it"**: cat 0.55, mat 0.15, because 0.05, sat 0.05, The 0.03, on 0.03, the 0.03, was 0.06, The(2nd) 0.05
- Clicking **"was"**: it 0.5, cat 0.2, mat 0.1, because 0.05, sat 0.05, on 0.03, The 0.03, the 0.02, The(2nd) 0.02
- Clicking any other word: a flat-ish distribution weighted toward its 2 nearest neighbors in the sentence (0.3 each) and 0.05 or less to everything else.

**Layout:** a `.card` with the 9 words as chips in a row. Clicking a chip draws lines (`--primary`, opacity/thickness ∝ weight) from it to every other word, redrawn on each click (previous lines fade out over 200ms as new ones fade in).

**Caption:** "Click 'it' — notice how strongly it connects back to 'cat,' even though several words separate them. That connection is what attention computes directly, regardless of distance."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click any word chip.
2. Read which other words it connects to and how strongly.
