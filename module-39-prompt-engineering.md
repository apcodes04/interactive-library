# Module 39 — Prompt Engineering (Q11 — LLM Question)

Build a tabbed prompt-variant demo with static mocked outputs (no live model call). Use vanilla JS tabs. Follow `00-design-system.md` for colors/type/motion.

**Exact data — same task, "Summarize this article" (article text not needed, just the task label), 3 tabs:**
- Tab 1 "Bare instruction": mocked output — "The article talks about renewable energy and its benefits."
- Tab 2 "+ Role framing" (instruction: "You are a senior energy policy editor…"): mocked output — "This piece surveys renewable energy adoption trends, highlighting cost declines in solar and wind and their implications for grid policy."
- Tab 3 "+ Output format constraint" (instruction: "Respond in exactly 3 bullet points"): mocked output rendered as exactly 3 bullets — "• Solar and wind costs have fallen sharply. • Adoption is accelerating in most major markets. • Grid policy is the main remaining bottleneck."

**Layout:** a `.card` with 3 tab buttons and one output panel below that crossfades (250ms) between the 3 mocked texts on tab switch.

**Caption:** "Same task, same underlying request — only the framing changed, and the shape of the output changed with it. (These outputs are pre-written examples, not a live model call.)"

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click each of the 3 tabs.
2. Compare the mocked output for each.
