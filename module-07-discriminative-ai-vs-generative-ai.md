# Module 7 — Discriminative AI vs. Generative AI (Q37 — AI Question)

Build a simple animated flow-direction diagram. Use vanilla SVG/CSS, no data library needed. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with one input icon (a simple document glyph, centered left) with two labeled arrows branching outward to the right: one to a box labeled "Label / Score" (`--primary` border), one to a box labeled "New generated content" (`--active` border).

**Exact example content:** the input is a product review: *"This phone's battery barely lasts a day."* The "Label / Score" box's result: **"Sentiment: Negative — 91%."** The "New generated content" box's result: **"Suggested reply: We're sorry to hear that — could you tell us your phone model so we can look into the battery issue?"**

**Controls:** two `.btn-primary` buttons, "Run discriminative" and "Run generative." Clicking either animates a small filled circle (color matching that path) traveling along the corresponding arrow from the input box to its output box over 500ms (`--ease-out`), then reveals that output box's exact text with a fade-in.

**Caption:** "Same starting review, two different jobs — one scores what's already there, the other creates something new in response to it."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Run discriminative."
2. Click "Run generative."
3. Compare the two output boxes.
