# Module 45 — LoRA and QLoRA (Q2 — LLM Question)

Build a low-rank matrix-multiplication animation. Use D3.js/SVG grid rendering. Follow `00-design-system.md` for colors/type/motion.

**Exact toy data:** frozen weight matrix W is 8×8, filled with illustrative values 0–9 (any fixed pseudo-random 8×8 grid, seed = 3, rendered `--frozen` gray, labeled "frozen"). Matrix A is 2×8 (rank 2), matrix B is 8×2, both filled with small illustrative values (e.g. −1 to 1, seed = 5), rendered `--active` amber, labeled "trainable."

**Layout:** a `.card` showing W's 8×8 grid, A's 2×8 strip, and B's 8×2 strip, plus a "Compute update" `.btn-primary` button.

**Behavior:** clicking the button animates a sweep across A and B (representing the matrix multiply, 500ms) producing a new 8×8 delta grid (color intensity = magnitude), which then slides next to W with a "+" symbol between them, forming "W + BA" (400ms). A toggle labeled "QLoRA view" re-renders W's grid with coarser, blockier shading (group cells into 2×2 blocks of averaged color) and a small "4-bit" label overlay on each block, while A and B keep their original fine-detail rendering.

**Caption:** "W never changes color or texture in the top state — it's completely frozen. Only these two thin strips are ever actually trained."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Compute update."
2. Watch A and B combine into the delta grid added to W.
3. Toggle "QLoRA view" to see the quantized version.
