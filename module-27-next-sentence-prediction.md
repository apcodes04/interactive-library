# Module 27 — Next Sentence Prediction (Q9 — LLM Question)

Build a card-pairing classifier demo. Use vanilla CSS/JS with a simple gauge (a colored arc, no library required). Follow `00-design-system.md` for colors/type/motion.

**Exact data:**
- Sentence 1 (fixed): "She opened the door."
- True next sentence: "Cold air rushed in." → gauge shows 92%, `--success` green, checkmark, label "IsNext."
- Random unrelated sentence: "The stock market fell sharply." → gauge shows 8%, `--danger` red, X icon, label "NotNext."

**Layout:** a `.card` with two stacked sentence cards (sentence 1 fixed on top, the paired sentence below it) and a "Shuffle pairing" `.btn-primary` button that alternates between the true pair and the random pair on each click.

**Behavior:** on shuffle, animate the gauge needle/arc sweeping to its new value (500ms `--ease-out`) and the checkmark/X icon crossfading in.

**Caption:** "Swap in an unrelated second sentence and the model's confidence collapses immediately — that contrast is the entire training signal NSP relies on."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Shuffle pairing."
2. Read the new confidence gauge and IsNext/NotNext label.
