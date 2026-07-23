# Module 25 — LLMs vs. Statistical Language Models (Q45 — LLM Question)

Build a live-typing dual-prediction comparison. Use Chart.js for two bar charts. Follow `00-design-system.md` for colors/type/motion, and use the exact toy N-gram table and illustrative LLM-style distribution from `00-global-spec.md`.

**Layout:** a `.card` with a text input pre-filled with "the cat," editable to any 2-word prefix. Below it, two bar charts side by side: left labeled "N-gram model" (`--primary`), right labeled "LLM-style model" (`--active`).

**Behavior:** on every input change, look up the exact prefix in the shared N-gram table — if found, show its exact probabilities on the left chart; if not found, show all left-chart bars at exactly zero with a visible label "No data for this exact prefix." The right chart always shows the shared illustrative 7-token distribution unchanged, regardless of prefix (clearly code-commented as illustrative, not a real model).

**Caption:** "Change one word in the prefix and the N-gram model often goes completely blank — the LLM-style distribution barely notices, because it generalizes instead of matching exact sequences."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Type a 2-word prefix into the box.
2. Compare the N-gram chart (left) against the LLM-style chart (right).
