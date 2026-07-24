# Module 53 — Decision Tree (AI/ML Concept)

Build a multi-stage animated pipeline showing a depth-2 decision tree being grown split by split via real Gini-impurity search. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42, Class A centered (30,30) colored `--primary`, Class B centered (70,70) colored `--active`). Implement a real, small greedy decision-tree induction directly in `script.js`: at each node, search every candidate split (both features, thresholds at every midpoint between sorted values) and pick the one minimizing weighted Gini impurity across the two children — a real, deterministic algorithm over the fixed 40 points, not a fabricated tree. Fix max depth at 2 (root + 2 levels = 4 leaves total).

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–5), not three separate mechanisms — see `00-design-system.md`'s "Multi-stage modules" section and reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with a left panel showing the growing tree diagram (boxes connected by lines, root at top) and a right panel showing the same 40-point scatter with split lines and, in later stages, shaded decision regions. Both panels update together as `currentStage` changes.

**Stages (6, index 0–5), each a clickable `<button class="stage">`:**
- **Stage 0 — All data:** tree shows a single root box ("40 points"). Scatter shows all 40 points, no lines.
- **Stage 1 — Root split found:** the algorithm's best first split is computed and drawn as a line across the scatter (vertical or horizontal, whichever the search found); tree shows root branching into two child boxes with their point counts.
- **Stage 2 — Left child split:** the best split *within* the left child's subset is computed and drawn (only spanning that child's region); tree adds two leaf boxes under the left child.
- **Stage 3 — Right child split:** same for the right child; tree now shows all 4 leaves.
- **Stage 4 — Final tree:** the full assembled tree (root, 2 internal nodes, 4 leaves), each leaf labeled with its point count and majority class.
- **Stage 5 — Decision regions:** the scatter alone, now shaded into up to 4 rectangular regions tinted by each leaf's majority class (`--primary`-tinted for Class A leaves, `--active`-tinted for Class B leaves); any point whose true class differs from its region's majority gets a `--danger` ring.

**Legend (dynamic, per stage):**
- Stage 0: empty — hide the legend.
- Stages 1–3: Class A point, Class B point, Split line.
- Stage 4: Leaf → majority Class A (tinted box), Leaf → majority Class B (tinted box).
- Stage 5: Class A region, Class B region, Misclassified (ring).

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a `<input type="range" min="0" max="5">` scrubber, `.btn-secondary` "◀ Back"/"Next ▶", an auto-play `.btn-primary` "Run (auto-play)" (~800ms/stage, interruptible), and a Reset button (green `.btn-reset` on mobile per `00-mobile-design-system.md`). Use the three visual states (completed/current/upcoming) with the text-legibility rule: de-emphasis dims box background/border only, never the text.

**Caption:** "A decision tree doesn't fit one boundary — it fits a stack of straight cuts, each one splitting whatever impurity was still left over from the last."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click any stage button, or drag the scrubber, to see the tree grow one split at a time.
2. Use "◀ Back" / "Next ▶" to step through manually.
3. Click "Run (auto-play)" to watch the whole tree build automatically.
