# Module 66 — RLHF & DPO (LLM Concept)

Build a multi-stage animated pipeline contrasting the RLHF path (reward model + PPO) against the DPO shortcut (direct preference optimization) on the same toy preference pair. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section.

**Exact data:** prompt `"Explain photosynthesis simply."` Two candidate responses from the base SFT model: Response A (clear, helpful) and Response B (rambling, less helpful), with a fixed human preference label: A preferred over B. Fixed toy reward-model scores: A = 0.82, B = 0.35. Fixed toy PPO reward-curve-over-5-steps for the RLHF path: `[0.40, 0.52, 0.61, 0.70, 0.78]`.

**Categorical coloring:** RLHF path = `--cat-1` (teal), DPO path = `--cat-2` (coral) — used only in the comparison stages where both paths are shown side by side.

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–6) — see `00-design-system.md`'s "Multi-stage modules" section, reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with a central panel that changes shape per stage — single boxes early on, a two-column RLHF-vs-DPO comparison in the middle stages, collapsing back to a single box at the end.

**Stages (7, index 0–6):**
- **Stage 0 — Base/SFT model:** the base model box produces both Response A and Response B, both `--frozen` gray (no preference yet).
- **Stage 1 — Human preference collected:** Response A gets a `--success` "preferred" ring; Response B does not.
- **Stage 2 — Reward model scores:** a reward-model box shows two bars, A = 0.82 (`--success`-tinted), B = 0.35 (`--danger`-tinted).
- **Stage 3 — RLHF: PPO policy update:** a small line chart animates the fixed 5-step reward curve `[0.40, 0.52, 0.61, 0.70, 0.78]` rising, labeled `--cat-1`.
- **Stage 4 — DPO: direct preference optimization:** a parallel box shows DPO updating the policy directly from the (A, B) preference pair in a single loss step — no separate reward-model box — labeled `--cat-2`.
- **Stage 5 — Compare RLHF vs. DPO:** a small side-by-side table: RLHF (reward model + PPO, more moving parts, more compute) vs. DPO (single loss on the preference pair, simpler pipeline, comparable result here).
- **Stage 6 — Final aligned model:** a single output box showing the model now producing an A-style response by default, `--success`-tinted, no more "A vs B" comparison.

**Legend (dynamic, per stage):**
- Stage 0: Response A, Response B (both frozen).
- Stage 1: Response A (preferred, ring), Response B.
- Stage 2: Reward score bar (success-tinted / danger-tinted).
- Stage 3: Policy reward curve (`--cat-1`).
- Stages 4–5: RLHF path (`--cat-1`), DPO path (`--cat-2`).
- Stage 6: empty — hide the legend.

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies throughout.

**Caption:** "DPO gets to roughly the same aligned behavior as RLHF without ever training a separate reward model — it folds the preference directly into the policy's own loss function."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage button, or drag the scrubber, to move through the RLHF and DPO pipelines.
2. Use "◀ Back" / "Next ▶" to step through one stage at a time.
3. Click "Run (auto-play)" to watch both paths play automatically.
