# Module 50 — Diagnosing Offensive Or Factually Incorrect Outputs (Q43 — LLM Question)

Build a clickable diagnostic decision tree. Use D3.js tree layout, or nested HTML/CSS clickable flowchart. Follow `00-design-system.md` for colors/type/motion.

**Exact tree:**
- Root: "Offensive or factually incorrect output detected."
- 4 child branch questions (all visible after clicking root): "Is the input adversarial / a jailbreak attempt?", "Is RAG involved?", "Is temperature unusually high?", "Was there a recent fine-tune or system-prompt change?"
- Each branch, clicked as "Yes," reveals exactly this leaf fix:
  - Adversarial input → "Strengthen system prompt, add input filtering and output moderation."
  - RAG involved → "Audit retrieval pipeline and re-ranking, require source citation."
  - High temperature → "Lower temperature / adjust sampling parameters."
  - Recent fine-tune → "Revert or retrain with cleaned data, apply stronger KL penalty."

**Layout:** a `.card` with the root node at top (`--primary`); clicking it reveals the 4 branch nodes below.

**Behavior:** clicking any one branch node reveals only its corresponding leaf fix (`--success` green box, fade-in 300ms) below it; clicking a different branch collapses the previous leaf first. Only one branch's leaf is visible at any time.

**Caption:** "Each path here leads to a completely different fix — which is exactly why reproducing and isolating the failure has to come before choosing one."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click the root node.
2. Click one of the 4 branch questions.
3. Read the fix that appears, then click a different branch to compare.
