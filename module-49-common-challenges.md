# Module 49 — Common Challenges With LLMs (Q50 — LLM Question)

Build a self-assessment radar chart. Use Chart.js radar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact 7 axes** (0–10 scale each): Compute, Latency, Hallucination, Bias, Privacy, Safety, Knowledge staleness.

**Exact preset profiles:**
- "Customer support chatbot": Compute 3, Latency 8, Hallucination 5, Bias 4, Privacy 6, Safety 5, Knowledge staleness 3.
- "Medical information assistant": Compute 4, Latency 3, Hallucination 9, Bias 6, Privacy 9, Safety 9, Knowledge staleness 7.

**Layout:** a `.card` with the radar chart (`--primary` fill, semi-transparent), 2 preset `.btn-secondary` buttons above it, and slider controls (or direct point-dragging on the chart if reliable) for each of the 7 axes.

**Behavior:** clicking a preset animates the polygon reshaping to that profile's values (500ms); the user can then further drag any axis manually, with the polygon updating live.

**Caption:** "Load the 'Medical information assistant' preset and compare its shape to the chatbot preset — the same 7 challenges apply everywhere, but never with equal weight."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a preset button.
2. Drag any of the 7 axis sliders to adjust it further.
