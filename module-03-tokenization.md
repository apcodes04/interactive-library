# Module 3 — Tokenization (Q1 — LLM Question)

Build a live tokenizer demo. Follow `00-design-system.md` for colors/type/motion.

Use vanilla JS plus a small BPE-style tokenizer library loaded from CDN (try `gpt-tokenizer`, e.g. `https://cdn.jsdelivr.net/npm/gpt-tokenizer/dist/cl100k_base.js` or an equivalent browser-ready build). **Fallback if no working CDN build can be confirmed:** implement a simple deterministic pseudo-tokenizer directly in JS — split on whitespace and punctuation, then re-merge common suffix patterns (`ing`, `tion`, `ed`, `ly`) as separate sub-tokens purely for illustration, and generate a stable fake token ID by hashing each token string (e.g. a simple string-to-int hash) so IDs stay consistent across renders. Either approach is acceptable; do not skip the feature.

**Layout:** a `.card` with a text input pre-filled with Sentence A (from `00-global-spec.md`), fully editable. Below it, a wrapping row of "chips," one per token, each a small rounded pill in alternating `--primary`/`--primary-light` background with white text.

**Behavior:** re-render the chip row on every keystroke (debounce 150ms), with new/changed chips fading in via `transform: scale(0.8) → 1` + opacity over 150ms. Hovering a chip shows a tooltip (native `title` attribute is sufficient) with its token ID and character span, e.g. "ID: 1847 · chars 4–7."

**Caption:** "This is exactly what the model sees — the words you type are being split into these token units before anything else happens."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Type or edit the sentence in the text box.
2. Watch the token chips update live.
3. Hover (or on mobile, tap) any chip to see its token ID.
