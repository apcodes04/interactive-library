# Module 60 — K-Nearest Neighbors (AI/ML Concept)

Build a page where a user-placed query point is classified live by majority vote among its K nearest neighbors. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion and `00-global-spec.md`'s toy 2-class 2D dataset.

**Exact data:** the toy 2-class 2D dataset (40 points, seed 42, Class A colored `--primary`, Class B colored `--active`).

**Layout:** a `.card` with an SVG scatter (0–100 both axes) showing all 40 points.

**Interaction:** clicking anywhere on the scatter drops a "query point." Compute, live from the fixed 40 points, the K nearest neighbors by Euclidean distance, draw a thin connector line from the query point to each of its K neighbors (colored by that neighbor's class), and tally the majority vote.

**Control:** slider "K," range 1–15, step 2 (odd values only), default 5 — recomputes the neighbor set and vote live as it moves.

**Live readouts:** "Neighbors: A×N₁, B×N₂ → predicted Class A/B," and the query marker's fill updates to the predicted class's color.

**Legend:** Class A neighbor, Class B neighbor, Query point, Nearest-neighbor connector.

**Caption:** "KNN doesn't learn anything in advance — it waits until you ask, then looks up whoever's physically closest right now and takes a vote."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click anywhere on the scatter to drop a query point.
2. Drag the "K" slider and watch which neighbors get connected change.
3. Watch the vote tally and predicted class update live.
