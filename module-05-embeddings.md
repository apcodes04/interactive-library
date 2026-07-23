# Module 5 — Embeddings (Q8 — LLM Question)

Build a 2D embedding-space explorer. Use D3.js. Follow `00-design-system.md` for colors/type/motion, and use the exact toy-vocabulary coordinate table from `00-global-spec.md`.

**Layout:** a `.card` with a scatter plot of all 12 words as labeled dots (`--primary` fill) at their exact (x, y) coordinates from the shared table, scaled to fill the SVG viewport.

**Interaction:** clicking any dot (a) recolors it `--active` amber and scales it up slightly, (b) computes the Euclidean distance from that dot to all other 11 live in JS (do not hardcode distances — compute from the coordinate table), (c) draws thin `--primary-light` lines to its 3 nearest neighbors by that computed distance, animated drawing in over 300ms, and (d) shows a `.readout`-styled list of those 3 neighbors with their exact computed distance values, nearest first.

**Caption:** "Words that mean similar things end up close together in this space — distance here stands in for semantic similarity. Click 'cat,' then click 'chef' — notice which neighbors show up each time."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click any word dot.
2. Read its 3 nearest neighbors and their distances in the readout.
3. Click a different word to compare.
