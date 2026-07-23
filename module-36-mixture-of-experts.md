# Module 36 — Mixture of Experts (Q35 — LLM Question)

Build a router-and-experts activation diagram. Use D3.js or plain SVG. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with one central "Router" node connected to 8 numbered "Expert" boxes arranged in a circle around it (all `--frozen` gray by default), an "Input" node, and 4 selectable token buttons.

**Exact top-2 expert assignments per token:**
- "the" → experts 1, 4
- "photosynthesis" → experts 3, 7
- "running" → experts 2, 5
- "quantum" → experts 6, 8

**Behavior:** selecting a token animates a small `--primary` dot traveling from "Input" into the router (400ms), then splitting into two paths that light up only its 2 assigned experts (`--active` amber, full brightness) while the other 6 stay `--frozen` dimmed. Update a `.readout`: "Active experts: 2 of 8 (25% of total capacity used)."

**Caption:** "Every single token only ever lights up 2 of these 8 experts — the rest of the model's capacity sits completely idle for that token."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Select a token button.
2. Watch which 2 of 8 experts light up.
