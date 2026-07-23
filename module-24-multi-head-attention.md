# Module 24 — Multi-Head Attention (Q20 — LLM Question)

Build a multi-head toggle demo using Sentence B: "The chef who trained in Paris prepared the dish." Use D3.js. Follow `00-design-system.md` for colors/type/motion (use 3 tints of `--primary` — e.g. #4f46e5, #6366f1, #818cf8 — for the 3 heads, since the design system caps new hues at 5 total meanings and this is a within-category distinction).

**Exact precomputed attention lines from "prepared":**
- Head 1 (darkest blue): strong line to "chef" (weight 0.7), light lines elsewhere.
- Head 2 (medium blue): strong line to "dish" (weight 0.7), light lines elsewhere.
- Head 3 (lightest blue): strong lines to "trained" (0.4) and "Paris" (0.4), light lines elsewhere.

**Layout:** a `.card` with Sentence B as word chips, plus 3 checkboxes color-coded to match each head's line color, all checked by default.

**Behavior:** toggling a checkbox shows/hides only that head's connection lines from "prepared" (200ms fade), so all 3 can be shown simultaneously or isolated one at a time.

**Caption:** "Enable all three heads at once — 'prepared' is tracking its subject, its object, and its modifying clause simultaneously. One head could only afford to track one of these."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Toggle each of the 3 head checkboxes on or off.
2. Compare which lines appear from "prepared" each time.
