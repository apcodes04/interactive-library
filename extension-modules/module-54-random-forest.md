# Module 54 — Random Forest (AI/ML Concept)

Build a page showing several small decision trees, each trained on its own resample of the data, combined into one ensemble vote. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42, Class A colored `--primary`, Class B colored `--active`). Build 6 trees directly in `script.js`, each a real max-depth-2 Gini-split tree (same induction algorithm as module 53) trained on its own fixed bootstrap resample of the 40 points (use fixed resample seeds 1 through 6 so every page load produces the same 6 trees).

**Categorical coloring:** each of the 6 trees gets its own fixed categorical color, carried through every view it appears in: Tree 1 = `--cat-1` (teal), Tree 2 = `--cat-2` (coral), Tree 3 = `--cat-3` (rose), Tree 4 = `--cat-4` (sky), Tree 5 = `--cat-5` (violet), Tree 6 = `--cat-6` (mustard).

**Layout:** a `.card` with a row of 6 small clickable tree-thumbnail cards along the top (each shaded a translucent tint of its own categorical color), the main scatter/decision-region panel below, and a "Combined forest vote" readout panel to the side.

**Interaction:**
- Clicking a tree thumbnail (1–6) shows *only that tree's* decision regions overlaid on the scatter, semi-transparent, in its own categorical color.
- A "Show all trees" toggle overlays all 6 trees' regions simultaneously at reduced opacity so overlap is visible.
- A slider "Number of trees included in the vote," range 1–6 default 1, recomputes the majority-vote combined decision region using only the first N trees (in fixed order 1→6) and renders it using the standard Class A/B semantic colors (`--primary`/`--active`), since the combined vote is the final 2-class prediction, not an individual tree's identity.
- Live `.readout`s: "Single-tree accuracy (Tree 1): X%," "Combined-forest accuracy (N trees): Y%," both computed against the fixed 40 points.

**Legend:** Tree 1 (`--cat-1`) … Tree 6 (`--cat-6`), Combined vote → Class A / Class B.

**Caption:** "No single tree here is very good alone — averaging their votes is what makes the forest more stable than any one member, even though every member saw slightly different data."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a tree thumbnail (1–6) to preview that one tree's decision region.
2. Drag the "Number of trees included" slider and watch the combined boundary smooth out.
3. Compare the single-tree accuracy readout to the combined-forest accuracy readout.
