# Module 28 — Autoregressive vs. Masked Models (Q7 — LLM Question)

Build a side-by-side visibility comparison using the 9-token Sentence A: "The cat sat on the mat because it was." Use vanilla JS/CSS. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with the sentence rendered twice, stacked. Top row labeled "Autoregressive": a `.btn-primary` "Replay" button restarts an animated cursor advancing left to right one word at a time (600ms per step), with every word after the cursor at `--frozen` gray/hidden opacity at each step. Bottom row labeled "Masked" (static, no button needed): all words fully visible (`--primary`) except one — "tired" would be word 10, so instead mask "was" (word 9) — shown as `[MASK]`, with two faint `--active` bidirectional arrows drawn from the mask position outward to both the leftmost and rightmost words.

**Caption:** "Top: the model can only ever see backward. Bottom: the model sees everything except the one gap it's filling in — that's the entire contrast between these two training styles."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Replay" on the top row.
2. Compare it against the always-visible bottom row.
