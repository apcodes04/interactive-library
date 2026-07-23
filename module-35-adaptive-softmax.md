# Module 35 — Adaptive Softmax (Q40 — LLM Question)

Build a two-tier funnel drop animation. Use vanilla JS/CSS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** frequent-word list (head cluster, cost = 1 unit): `the, a, is, and, to`. Every other typed word is treated as rare (tail cluster, cost = 3 units).

**Layout:** a `.card` with a funnel shape: wide top tier labeled "Head cluster (frequent words, full dimension)" in `--primary`, narrower bottom tier labeled "Tail cluster (rare words, reduced dimension)" in `--active`. A text input for the user to type a word, a "Drop" `.btn-primary` button, and a running `.readout` "Cumulative compute cost: N units."

**Behavior:** on submit, animate a small ball falling from the top (400ms). If the word is in the frequent list, it stops and lights up `--success` green in the head tier, adding 1 to the cumulative cost. Otherwise it continues falling into the tail tier, lighting up `--danger` red, adding 3 to the cumulative cost. Include `.btn-secondary` "Reset" (zeros the cumulative counter).

**Caption:** "Type 'the' a dozen times and the cost barely moves. Type a dozen rare words and watch the total climb three times faster — same softmax, very different cost per word."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Type a word into the box.
2. Click "Drop."
3. Watch which tier it lands in and the cumulative cost readout.
