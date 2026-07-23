# Module 17 — Vanishing Gradient Problem (Q41 — AI/ML Question)

Build a layer-stack gradient-magnitude animation. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with two side-by-side vertical stacks of 6 layer boxes each, labeled "RNN" (left) and "Transformer (residual connections)" (right). Each layer box has a small vertical bar next to it representing gradient magnitude, all starting at 100% height in `--primary`.

**Exact shrink factors:** RNN bars shrink to 60% of the previous layer's height at each step going backward (layer 6→1: 100%, 60%, 36%, 21.6%, 13%, 7.8%), recoloring toward `--danger` red as height drops below 30%. Transformer bars shrink only to 95% of the previous at each step (100%, 95%, 90.25%, 85.7%, 81.5%, 77.4%), staying `--success` green throughout.

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** Treat this as 6 states (`currentLayer` 6 down to 1, or reindex as `currentStep` 0–5 internally, whichever is cleaner in code) — one shared control drives both stacks simultaneously, since the comparison only makes sense layer-for-layer.

**Control:** a scrubber (one slider spanning layer 6 → layer 1) plus 6 small clickable layer indicators (one per layer, shared between both stacks — clicking "Layer 3," for instance, jumps both the RNN and Transformer stacks to their respective precomputed layer-3 bar heights at once). A "Propagate ▶" / "◀ Back" `.btn-primary`/`.btn-secondary` pair animates one layer at a time (300ms per layer) when used; direct clicks on a layer indicator or multi-step scrubber drags can jump straight to that layer's exact precomputed heights without replaying every intermediate layer. Include `.btn-secondary` "Reset" (returns both stacks to layer 6, 100% height).

**Caption:** "Six layers deep, the RNN's gradient has nearly vanished. The Transformer's residual path barely lost any signal at all — same depth, very different outcome."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Propagate ▶" to step through layers 6 down to 1.
2. Use the scrubber or layer dots to jump to any layer directly.
3. Compare the RNN bar heights against the Transformer bar heights.
