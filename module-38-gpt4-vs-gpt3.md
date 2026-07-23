# Module 38 — GPT-4 vs. GPT-3 (Q18 — LLM Question)

Build a timeline scrubber that morphs a small model summary. Use vanilla JS/CSS. Follow `00-design-system.md` for colors/type/motion.

**Exact data at the two stops:**
- 2020 (GPT-3): context window bar = 2,048 tokens (short bar), icon = plain text-document glyph, "illustrative benchmark" bar = 40% filled.
- 2023 (GPT-4): context window bar = 128,000 tokens (much longer bar, GPT-4 Turbo figure), icon = text-plus-image glyph, "illustrative benchmark" bar = 85% filled. Label the benchmark bar explicitly "Illustrative composite score, not a specific published benchmark."

**Layout:** a `.card` with a horizontal range-input styled as a timeline, snapping to only 2 stops ("2020" / "2023"). Below it: a context-window bar that animates its width (400ms) between the two exact token values (with a `.readout` showing the exact number), an icon that crossfades between the two glyphs, and the labeled illustrative benchmark bar animating between 40% and 85%.

**Caption:** "Three years, and the confirmed context window alone grew roughly 60-fold — before even counting the new ability to process images."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the timeline scrubber between "2020" and "2023."
2. Watch the context bar, icon, and benchmark bar change.
