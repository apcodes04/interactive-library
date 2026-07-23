# Module 47 — Retrieval-Augmented Generation, RAG Pipeline (Q34 — LLM Question)

Build a multi-stage animated pipeline. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** 3 real chunks plus 10 decoy chunks in the vector DB (render as 13 dots total, positioned so the 3 real ones cluster near where the query dot will land). Example query: "What temperature should I use for code generation?" Example retrieved chunk text (2 of the 3 nearest): "Code generation: 0.2–0.4 — mostly deterministic, slight flexibility" and "General assistant / chat: 0.7 — the default balance." Final mocked answer: "For code generation, use a temperature around 0.2 to 0.4."

**Categorical coloring (per `00-design-system.md`'s Categorical colors section):** the 10 decoys stay uniform `--frozen` gray (they're meant to fade into noise — never color them individually). The 3 real chunks each get their own fixed categorical color, carried through every stage they appear in (the Chunks stage's boxes, the Embeddings/Nearest-match dots, and the Prompt stage's highlighted context): Code gen = `--cat-1` (teal), Chat = `--cat-2` (coral), Creative = `--cat-3` (rose). Do not use green for any of the three — green is already spoken for as the "retrieved" highlight ring in this same view, and reusing it for a chunk's base color would blur the two meanings. Add a `.legend` under the pipeline (above the scrubber). **The legend is dynamic, not static — it must update per stage to show only what's actually rendered in that stage's card**, per `00-design-system.md`'s Legend section. Exact per-stage contents:

- Stage 1 (Documents): empty — hide the legend entirely.
- Stage 2 (Chunks): "Code gen" chunk, "Chat" chunk, "Creative" chunk (3 items — no decoy, query, or retrieved yet).
- Stage 3 (Embeddings): adds Decoy chunk to the above (4 items).
- Stage 4 (Vector DB): empty — hide the legend (no individual dots rendered here).
- Stage 5 (Query): empty — hide the legend (plain text box only).
- Stage 6 (Nearest match): all 6 — Decoy, Code gen, Chat, Creative, Query (once embedded), Retrieved (nearest match).
- Stage 7 (Prompt): only Code gen and Chat (the 2 chunks actually retrieved — Creative is correctly absent since it wasn't a match).
- Stage 8 (LLM) and Stage 9 (Answer): empty — hide the legend.

Recompute and re-render the legend's contents inside the same function that updates the explain panel on every `currentStage` change, so it stays in sync whether the user clicked a stage, dragged the scrubber, or is mid-auto-play.

**Layout:** a `.card` with 9 stages, left to right, **each one its own clickable `<button class="stage">`** (per `00-design-system.md`'s "Multi-stage modules" pattern — this is a required pattern for this module, not optional): (1) "Documents" icon, (2) 3 "Chunk" boxes, (3) "Embeddings" (3 dots appearing in a small 2D space alongside 10 gray decoy dots), (4) "Vector DB" cylinder icon containing all 13 dots, (5) a "Query" box showing the example query text, (6) the query's own dot appearing in the same 2D space plus a circle-highlight around the 2 nearest dots, (7) those 2 chunks' text shown flowing into a "Prompt" box alongside the query, (8) a final "LLM" icon, (9) the "Answer" box with the exact mocked answer text.

**This is one of the 8 modules that requires the full multi-stage scrubber pattern.** Build all three of these off one shared `currentStage` variable (0–8), not three separate mechanisms:

1. Every one of the 9 stage buttons stays clickable at all times — before, during, and after any auto-play — and clicking one jumps `currentStage` straight to it.
2. A scrubber (`<input type="range" min="0" max="8" step="1">`) lets the user drag forward or backward through all 9 stages at their own pace.
3. A "Run query (auto-play)" `.btn-primary` button animates `currentStage` from 0 to 8 automatically, roughly 800–900ms per stage (not 400ms — it needs to be slow enough to actually read), and stops immediately the moment the user touches the scrubber or clicks any stage button directly. Auto-play should also act as a pause toggle (clicking it again while playing stops it).

Use the three visual states from the design system for each stage button: **completed** (stage index < currentStage), **current** (stage index === currentStage), **upcoming** (stage index > currentStage) — never just a binary lit/unlit state, since the user can be looking at any stage at any time, not just the ones "already played."

The query dot and retrieval highlight ring (stage 6 onward) should show whenever `currentStage >= 5`, and hide otherwise — this needs to work correctly whether the user arrived at stage 6 by scrubbing forward, clicking directly, or auto-play, and also needs to correctly hide again if the user scrubs back before stage 6.

Include `.btn-secondary` "◀ Back" and "Forward ▶" buttons for single-step navigation alongside the scrubber, plus a "Reset" button that returns `currentStage` to 0 and hides the caption again. On desktop, Reset uses the standard `.btn-secondary` styling; on **mobile specifically**, per `00-mobile-design-system.md`, Reset gets a dedicated `.btn-reset` green (`--success`) accent so it's visually distinct from Back/Next/Run, and the mobile page order is: diagram, legend, scrubber, `.explain-panel`, then the controls row (Run/Back/Next/Reset), then caption — explain-panel sits above the buttons, not below them.

**Caption:** "Watch which chunks actually get pulled into the final prompt — everything else in that vector database, however relevant it might seem, never reaches the model at all."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click any stage button, or drag the scrubber.
2. Use "◀ Back" / "Forward ▶" to step one stage at a time.
3. Click "Run query (auto-play)" to watch it play automatically.
