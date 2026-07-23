# Module 19 — Encoder vs. Decoder (Q44 — LLM Question)

Build a toggleable attention-mask grid using the 6-token version of Sentence A: "The cat sat on the mat". Use D3.js or plain SVG. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with a 6×6 grid of cells, row/column labels = the 6 tokens. Cell (i, j) represents "can token i attend to token j."

**Toggle** (`.btn-secondary`/`.btn-primary` segmented pair, "Encoder (bidirectional)" / "Decoder (causal)"):
- Encoder state: all 36 cells lit `--primary`.
- Decoder state: only lower-triangular cells (i ≥ j, i.e. a token can see itself and everything before it) lit `--primary`; the rest dimmed to `--frozen` gray.

Animate the toggle as a cell-by-cell fade (stagger 15ms per cell in reading order) over ~300ms total, not an instant switch.

**Caption:** "An encoder token can look in every direction at once. A decoder token can only look backward at what's already been generated — that triangle is the entire structural difference."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click the "Encoder" / "Decoder" toggle.
2. Compare which grid cells light up each time.
