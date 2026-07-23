# Module 29 — Context Window (Q46 — LLM Question)

Build a draggable/resizable window overlay on a long token strip. Use vanilla JS/CSS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** 60 token blocks labeled "T1"–"T60." Blocks 1–5 and 56–60 rendered in `--active` amber (representing important information placed at the edges); all others in `--primary-light`.

**Layout:** a `.card` with the horizontal strip of 60 blocks (scrollable or scaled to fit width), and a semi-transparent rectangle overlay representing the context window, draggable left/right and resizable from both edges (like a video-trim handle). Live `.readout` text: "Window size: N tokens" and "Covering T[X]–T[Y]."

**Behavior:** tokens outside the rectangle fade to 30% opacity (300ms transition on any resize/drag). Beneath the strip, render a thin heatmap bar showing retrieval reliability higher (`--success` green) at the two edges of whatever range is currently selected and lower (`--danger` red) toward its middle.

**Caption:** "Anything outside this rectangle doesn't exist to the model right now — and even inside it, the edges get attended to more reliably than the middle."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag either edge of the window rectangle to resize it.
2. Drag the rectangle itself to slide it.
3. Watch which tokens fade in and out.
