# Module 41 — Few-Shot Learning (Q42 — LLM Question)

Build an example-count stepper with a plateauing confidence meter. Use vanilla JS/CSS with a simple animated meter bar. Follow `00-design-system.md` for colors/type/motion.

**Exact confidence lookup table (mocked, illustrative):** 0 examples: 40%, 1: 65%, 2: 80%, 3: 85%, 4: 87%, 5: 88%.

**Layout:** a `.card` with a fixed task prompt box, an "+ Add example" `.btn-primary` button (adds one example card above the prompt, up to 5 max, then disables) and a "Remove example" `.btn-secondary` button, and a horizontal meter bar below.

**Behavior:** each add/remove animates the meter bar's fill width to the corresponding lookup value (400ms `--ease-out`), colored `--primary` up to 65%, `--active` amber 65–85%, `--success` green above 85%.

**Caption:** "Notice the meter barely moves after the third example — this is the diminishing-returns point described in this module, made visible."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "+ Add example" repeatedly.
2. Watch the confidence meter rise, then plateau.
3. Click "Remove example" to reverse it.
