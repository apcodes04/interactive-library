# Module 22 — Dot Product in Self-Attention (Q22 — LLM Question)

Build a draggable two-vector dot-product demo. Use D3.js or plain SVG. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with a 2D plane (origin centered), two draggable arrows from the origin: "Query" (`--primary`, starting at 45°, length 3) and "Key" (`--active`, starting at 60°, length 3). Drag the arrowhead of either to change its angle/length (length range 0.5–5).

**Behavior:** on every drag, recompute live in JS: (1) the dot product `Q·K = |Q||K|cos(θ)` shown as a `.readout` number, (2) a shaded arc between the two arrows representing the angle θ between them, with fill color interpolating from `--danger` red (θ near 90°, low/zero dot product) to `--success` green (θ near 0°, well-aligned, high dot product).

**Caption:** "Drag Key to point the same direction as Query — watch the dot product climb, and the arc turn green. That's the entire mechanism behind 'relevance' in self-attention."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the tip of the "Query" arrow.
2. Drag the tip of the "Key" arrow.
3. Watch the dot-product number and the angle arc update.
