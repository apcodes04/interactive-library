# Module 69 — Tokenizer Comparison: BPE vs. WordPiece vs. SentencePiece (LLM Concept)

Build a page splitting the same sentence three different ways side by side. Use vanilla CSS/JS. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy tokenizer sample text.

**Exact data:** sentence: `"The unbelievably fast internationalization process overjoyed everyone."` Fixed, illustrative token splits (clearly commented in code as illustrative, not the output of a real trained tokenizer):
- **BPE:** `["The", "un", "believ", "ably", "fast", "international", "ization", "process", "overjoy", "ed", "everyone", "."]`
- **WordPiece:** `["The", "un", "##believ", "##ably", "fast", "internationalization", "process", "over", "##joy", "##ed", "everyone", "."]`
- **SentencePiece:** `["▁The", "▁un", "believ", "ably", "▁fast", "▁international", "ization", "▁process", "▁over", "joy", "ed", "▁everyone", "."]`

Fixed illustrative toy vocabulary sizes: BPE = 12,000, WordPiece = 15,000, SentencePiece = 8,000.

**Layout:** a `.card` with three columns, one per tokenizer, each showing its token list as a row of small chips, a token-count `.readout` per column, and a horizontal vocabulary-size comparison bar beneath all three.

**Interaction:** no sliders needed — this module is a static side-by-side comparison. If desired, add a `.btn-secondary` "Highlight differences" toggle that outlines, in `--active`, any token boundary that differs across all three methods for the same word (e.g. where "internationalization" splits into 2 pieces in BPE/SentencePiece but stays whole in WordPiece).

**Legend:** `##` prefix (WordPiece continuation marker), `▁` prefix (SentencePiece word-start marker).

**Caption:** "The same sentence splits into a different number of pieces depending on which tokenizer trained on which corpus — more tokens per word means more compute per word at inference time."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Compare the three token-chip rows for the same sentence.
2. Note where "internationalization" splits differently across the three methods.
3. Check the total token count and vocabulary-size bar for each.
