# Module 9 — Foundation Model Types (Q32 — AI Question)

Build a clickable expandable taxonomy tree. Use a plain HTML/CSS/JS accordion (no library required). Follow `00-design-system.md` for colors/type/motion.

**Exact taxonomy:**
- Root: "Foundation Models"
  - "Language" → examples: GPT-4, Llama
  - "Vision" → examples: CLIP, SAM
  - "Multimodal" → examples: Gemini, GPT-4V
  - "Audio" → examples: Whisper, MusicGen

**Layout:** a `.card` with the root label at top, and 4 clickable branch rows below it, each with a chevron icon that rotates 90° on expand.

**Behavior:** clicking a branch label expands/collapses its example list with a smooth `max-height` transition (200ms, `--ease-out`); only one branch may be expanded at a time (expanding a new one auto-collapses the previously open one). Expanded branch header highlights in `--primary-light` background.

**Caption:** "Foundation Models aren't just language models — the same pretrain-then-adapt approach spans vision, audio, and multimodal systems too."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click any branch ("Language," "Vision," "Multimodal," "Audio") to expand its examples.
2. Click a different branch to switch.
