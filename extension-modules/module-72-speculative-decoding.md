# Module 72 — Speculative Decoding (LLM Concept)

Build a multi-stage animated pipeline showing a fast draft model propose several tokens, verified in parallel by a slower target model, with one rejection and correction. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** prompt: `"The weather today is"`. Draft model proposes 4 tokens: `["sunny", "and", "very", "warm"]`. Fixed target-model verdicts: token 1 "sunny" accepted, token 2 "and" accepted, token 3 "very" **rejected** (target model resamples its own token instead: "quite"), token 4 "warm" never evaluated (discarded, since verification stops at the first rejection).

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–6) — see `00-design-system.md`'s "Multi-stage modules" section, reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with a draft-model box, a target-model box, and a row of 4 token boxes between them showing the committed/tentative sequence.

**Stages (7, index 0–6):**
- **Stage 0 — Draft model proposes:** all 4 draft tokens appear as dashed, tentative boxes, `--active` (amber, "not yet verified").
- **Stage 1 — Target model verifies in parallel:** the target-model box animates scoring all 4 tokens in a single pass (emphasize: parallel, not one-by-one).
- **Stage 2 — Token 1 accepted:** "sunny" turns solid `--success`.
- **Stage 3 — Token 2 accepted:** "and" turns solid `--success`.
- **Stage 4 — Token 3 rejected:** "very" turns `--danger`; a replacement token "quite" (resampled from the target model) appears in `--primary` next to it.
- **Stage 5 — Discard remainder, resume drafting:** "warm" (never verified, since it followed a rejection) fades to `--frozen` and disappears; the committed sequence now reads "The weather today is sunny and quite," and the draft model visibly prepares to propose the next batch from this point.
- **Stage 6 — Speedup summary:** a `.readout` comparing "3 tokens committed this round" against "1 target-model forward pass (plus 1 rejected candidate)," framed against standard one-token-at-a-time decoding needing 3 full target passes for the same 3 tokens.

**Legend (dynamic, per stage):**
- Stage 0: Draft token (tentative).
- Stage 1: Draft token (tentative), Target model (verifying).
- Stages 2–3: Draft token (tentative), Accepted token.
- Stage 4: Accepted token, Rejected token, Resampled replacement.
- Stage 5: Accepted token, Resampled replacement, Discarded token.
- Stage 6: empty — hide the legend.

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies throughout.

**Caption:** "Speculative decoding doesn't make the target model faster — it lets a cheap draft model take the risk of guessing several tokens ahead, so the expensive model only has to confirm or correct them in one pass instead of generating each one alone."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage button, or drag the scrubber, to move through drafting, verification, and correction.
2. Use "◀ Back" / "Next ▶" to step through one stage at a time.
3. Click "Run (auto-play)" to watch a full draft-verify-correct round play automatically.
