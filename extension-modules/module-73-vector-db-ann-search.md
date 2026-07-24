# Module 73 — Vector DB / ANN Search (LLM Concept)

Build a multi-stage animated pipeline showing an IVF-style (cluster-based) approximate-nearest-neighbor index built, then searched by probing only the nearest cell(s). Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy clustering dataset.

**Exact data:** the toy clustering dataset (30 points, seed 42, 3 clusters centered (20,25), (70,30), (45,80)), treated here as precomputed 2D document-embedding positions. Fixed query embedding at (55, 35). This module is distinct from module 47's RAG pipeline (which covers full retrieval-then-generation) — this one is specifically about how the vector index itself organizes and searches.

**Categorical coloring:** Cell 1 = `--cat-1` (teal), Cell 2 = `--cat-2` (coral), Cell 3 = `--cat-3` (rose), matching the 3 clusters from the toy dataset.

**This is one of the 7 modules that requires the full multi-stage scrubber pattern.** Build all three off one shared `currentStage` variable (0–6) — see `00-design-system.md`'s "Multi-stage modules" section, reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder as the proven implementation pattern.

**Layout:** a `.card` with the main SVG scatter (0–100 both axes) showing all 30 points, evolving across stages from unindexed to indexed to searched.

**Stages (7, index 0–6):**
- **Stage 0 — All vectors, no index:** all 30 points `--frozen` gray, ungrouped. Explain panel frames this as "brute-force would compare the query against all 30."
- **Stage 1 — Build index: cluster into cells:** run K-Means-style clustering (real, deterministic, same style as module 55) into 3 cells; points animate into their categorical cell colors.
- **Stage 2 — Index built:** 3 labeled cell regions shown with centroid markers.
- **Stage 3 — Query arrives:** the fixed query point (55, 35) appears in `--primary`, unassigned to any cell yet.
- **Stage 4 — Find nearest cell(s):** compute distance from the query to each of the 3 centroids (real computation); highlight the nearest cell(s) with a bold border. Include a toggle "nprobe = 1" / "nprobe = 2" controlling whether 1 or 2 cells get probed; non-probed cells dim to indicate "skipped, never compared."
- **Stage 5 — Search within probed cell(s):** only the points inside the probed cell(s) are individually compared to the query and ranked by distance; the top-3 nearest get a `--success` ring. Points in skipped cells stay dimmed.
- **Stage 6 — Recall tradeoff summary:** `.readout`s comparing comparisons made (points in probed cell(s) vs. all 30) and whether the true global nearest neighbor (computed via real brute-force distance over all 30, for reference) was actually found within the probed cell(s) at the current nprobe setting.

**Legend (dynamic, per stage):**
- Stage 0: Vector point (frozen).
- Stages 1–2: Cell 1/2/3, Centroid.
- Stage 3: Cell 1/2/3, Centroid, Query point.
- Stage 4: Cell 1/2/3, Centroid, Query point, Probed cell (bold border), Skipped cell (dimmed).
- Stage 5: Probed-cell point (compared), Skipped-cell point (dimmed), Top match (ring), Query point.
- Stage 6: empty — hide the legend.

Recompute the legend inside the same function that updates the explain panel on every `currentStage` change.

Include persistently clickable stage buttons, a scrubber, Back/Next, an interruptible auto-play "Run (auto-play)" button (~800ms/stage), and a Reset button (green on mobile). Text-legibility rule applies throughout.

**Caption:** "An ANN index doesn't search everything — it searches whichever cell your query landed nearest to, trading a small, tunable chance of missing the true nearest neighbor for comparing against a fraction of the database."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click a stage button, or drag the scrubber, to move through index-building and search.
2. Toggle "nprobe = 1" vs. "nprobe = 2" at the search stage to compare recall vs. comparisons made.
3. Click "Run (auto-play)" to watch the whole build-then-search sequence automatically.
