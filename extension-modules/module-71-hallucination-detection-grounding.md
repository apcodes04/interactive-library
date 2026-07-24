# Module 71 — Hallucination Detection & Grounding (LLM Concept)

Build a page checking three fixed candidate answers against a source sentence, claim by claim. Use vanilla CSS/JS. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy grounding/hallucination example.

**Exact data:** source sentence: `"The Eiffel Tower was completed in 1889 and stands 330 meters tall."` Three fixed candidate answers:
- **Grounded:** `"The Eiffel Tower was completed in 1889."` — entirely supported.
- **Partially grounded:** `"The Eiffel Tower was completed in 1889 and is the tallest building in France."` — "completed in 1889" supported (green); "is the tallest building in France" unsupported/false (red — the source never claims this, and it isn't a building nor the tallest in France).
- **Hallucinated:** `"The Eiffel Tower was completed in 1901 by Gustave Eiffel's rival."` — "completed in 1901" contradicts the source's 1889 (red); "by Gustave Eiffel's rival" is fabricated, not present in the source at all (red).

Fixed grounding scores: Grounded = 100%, Partially grounded = 50%, Hallucinated = 0%.

**Layout:** a `.card` with the source sentence shown at the top in a `.steps-panel`-style box, a candidate toggle ("Grounded" / "Partially grounded" / "Hallucinated"), and the selected candidate's text below with per-claim underlines.

**Marking (fixed per candidate, per the exact spans above):** supported claims get a `--success` underline, unsupported-but-plausible or fabricated/contradicted claims get a `--danger` underline. Show a live `.readout`: "Grounding score: X%," matching the fixed value for whichever candidate is selected.

**Legend:** Supported claim (green underline), Unsupported/contradicted claim (red underline).

**Caption:** "A hallucination isn't always an obviously wrong sentence — the partially grounded answer sounds just as confident as the fully grounded one, which is exactly why grounding checks have to be done claim by claim."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Grounded," "Partially grounded," or "Hallucinated" to switch candidates.
2. Read the source sentence, then check each underlined claim against it.
3. Compare the grounding score across all three candidates.
