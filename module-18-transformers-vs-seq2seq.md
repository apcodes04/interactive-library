# Module 18 — Transformers vs. Seq2Seq (Q15 — LLM Question)

Build a side-by-side processing-speed race. Use vanilla JS/CSS. Follow `00-design-system.md` for colors/type/motion. Use the 8-token version of Sentence A: "The cat sat on the mat because it".

**Layout:** a `.card` with two rows of 8 token boxes, labeled "Sequential (RNN/Seq2Seq)" (top) and "Parallel (Transformer)" (bottom), plus a shared "Elapsed: 0ms" `.readout` counter.

**Control:** a "Run" `.btn-primary` button starts both animations simultaneously.
- Sequential row: highlight one token box `--active` amber at a time, left to right, 400ms delay between each (total ~3200ms).
- Parallel row: highlight all 8 boxes `--success` green simultaneously in one 400ms flash.
- The elapsed-time counter ticks up continuously (via `requestAnimationFrame`) from 0 and only stops once the sequential row finishes, visibly running long after the parallel row already completed at ~400ms.

**Caption:** "Same eight tokens, same hardware — the only difference is whether processing has to happen one token at a time or all at once."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Run."
2. Watch which row finishes highlighting first.
3. Check the elapsed-time readout.
