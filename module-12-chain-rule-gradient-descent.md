# Module 12 — Chain Rule / Gradient Descent (Q29 — AI/ML Question)

Build a small computational-graph walkthrough. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** graph is `x → f(x) = 2x → g(f) = f² → loss = g`, with x = 3.
- Forward values: x=3, f=6, g=36, loss=36.
- Backward values: d(loss)/d(g) = 1, d(loss)/d(f) = 2f = 12, d(loss)/d(x) = 12 × 2 = 24.

**Layout:** a `.card` with 3 connected boxes left to right (x, f, g) plus a "Loss" box at the end, connected by arrows.

**This is one of the 8 modules requiring the full multi-stage scrubber pattern from `00-design-system.md`.** Treat the whole walkthrough as 8 states (`currentStep` 0–7), each with a precomputed snapshot of exactly which values are currently visible:

- Step 0: nothing computed yet.
- Steps 1–4 (forward pass): x=3 shown; then f=6 shown; then g=36 shown; then loss=36 shown in the Loss box.
- Steps 5–7 (backward pass): d(loss)/d(g)=1 shown below g; then d(loss)/d(f)=12 shown below f (with the "12 × 2 = 24" style overlay math for *this* step being d(loss)/d(g) × d(g)/d(f) = 1 × 12 = 12); then d(loss)/d(x)=24 shown below x (overlay: "12 × 2 = 24").

**Controls:** a scrubber (`min="0" max="7" step="1"`) plus 8 small clickable step indicators, "◀ Back" / "Forward ▶" `.btn-secondary`/`.btn-primary` buttons, and a `.btn-secondary` "Reset" (returns to step 0). Jumping directly to any step (via a step indicator or a multi-step scrubber drag) should render that exact snapshot immediately, with all values up to and including that step visible and nothing beyond it. Moving one step at a time (Forward/Back or single-notch scrubber drags) plays the fade-in / overlay-multiplication animation described above; jumping several steps at once can render directly without replaying every intermediate animation.

**Caption:** "Each backward step here is just one multiplication — the chain rule is that repeated multiplication, nothing more exotic."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Forward pass" to reveal x, f, g, and loss.
2. Click "Backward pass" to reveal the gradients.
3. Use the scrubber or "◀ Back" / "Forward ▶" to review any step.
