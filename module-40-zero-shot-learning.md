# Module 40 — Zero-Shot Learning (Q39 — LLM Question)

Build an instruction-only demo with an "add examples" toggle. Use vanilla JS/CSS slide-in transition. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** instruction box text — "Classify the sentiment of this review as positive or negative: 'The service was slow but the food was excellent.'" Mocked result badge — "Positive — 88% confidence."

**Two example cards** (revealed by the toggle): Example 1 — "'Terrible experience, would not recommend.' → Negative." Example 2 — "'Absolutely loved it, five stars!' → Positive."

**Layout:** a `.card` with the fixed instruction box feeding into the result badge, and a toggle labeled "Add examples."

**Behavior:** switching the toggle on slides the 2 example cards in from above the instruction box (300ms `--ease-out`); switching off slides them back out. The result badge stays the same throughout (illustrating zero-shot already gets a reasonable answer).

**Caption:** "This is the zero-example case — flip the toggle to see exactly what few-shot prompting adds on top of it."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Toggle "Add examples" on.
2. Watch the example cards slide in above the instruction.
3. Toggle it off to see them slide back out.
