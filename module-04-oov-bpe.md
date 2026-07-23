# Module 4 — OOV / BPE (Q14 — LLM Question)

Build a click-to-step BPE merge visualizer. Use vanilla JS/SVG, no charting library needed. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** input word `"unhappiness"` (11 characters: u-n-h-a-p-p-i-n-e-s-s). Precompute exactly this sequence of **8 merges** ending in exactly 3 final subword tokens:

1. Start: `u | n | h | a | p | p | i | n | e | s | s` (11 units)
2. Merge `p+p → pp`: `u | n | h | a | pp | i | n | e | s | s` (10 units)
3. Merge `s+s → ss`: `u | n | h | a | pp | i | n | e | ss` (9 units)
4. Merge `n+e → ne`... *(replace with a linguistically cleaner path if preferred, but must still total exactly 8 merges ending at 3 tokens)* — simplest reliable path: keep merging until reaching `u | n | happ | i | ness` (5 units) by step 6, then `un | happ | iness` (3 units, not quite matching "un/happi/ness" exactly — adjust final merge boundary so segment 2 absorbs the `i`, giving final state `un | happi | ness`) by step 8.

Do not worry about perfect linguistic accuracy of intermediate steps — the pedagogical point is the click-by-click reduction from 11 units to exactly 3, ending at the final grouping **`un / happi / ness`**. Implement the intermediate merges however is cleanest in code as long as: step 0 = 11 single characters, step 8 = exactly `["un", "happi", "ness"]`, and each step reduces the unit count by exactly 1.

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** There are 9 possible states (merge step 0 through 8, where step 0 is the untouched 11-character start). Build all navigation off one shared `currentStep` variable:

**Layout:** a `.card` with a horizontal row of boxes (one per current unit, re-rendered from a precomputed array of all 9 states so any step can be jumped to directly, not just reached by repeated clicking). Below it: 9 small clickable step-indicator dots/buttons (labeled "0" through "8"), a scrubber (`<input type="range" min="0" max="8" step="1">`), "◀ Previous merge" and "Next merge ▶" `.btn-secondary`/`.btn-primary` buttons, a step readout ("Merge 3 of 8"), and a `.btn-secondary` "Reset" button (returns to step 0).

**Behavior:** clicking any step dot, dragging the scrubber, or clicking Next/Previous all jump `currentStep` to a value 0–8 and re-render the box row to exactly that step's precomputed state — every step remains reachable at any time, not just forward from wherever the animation currently is. Only transitioning between *adjacent* steps (via Next/Previous or single-step scrubber drags) plays the merge/split slide animation (300ms, `--ease-out`, briefly flashing `--active` amber on the affected box); jumping more than one step at once (clicking a distant dot or dragging the scrubber far) can redraw directly without animating through every intermediate step.

**Caption:** "A word the model has never seen whole still gets handled — by breaking it into pieces it has seen many times before. That's why LLMs almost never hit a true out-of-vocabulary error."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Next merge" to advance one step.
2. Click "Previous merge" or drag the scrubber to go back.
3. Click any step dot to jump straight to it.
