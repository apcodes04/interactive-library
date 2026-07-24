# Module 79 — LDA Deep Dive (AI/ML Concept, deepens module 56)

Build a page showing PCA's and LDA's chosen axes disagree on the same labeled data, and comparing how well each axis actually separates the two classes. Use vanilla SVG. Follow `00-design-system.md` for colors/type/motion, its Categorical colors section, and `00-global-spec.md`'s toy LDA dataset.

**Exact data:** the toy LDA dataset (40 points, seed = 99, Class A centered (40, 60) colored `--primary`, Class B centered (60, 40) colored `--active`, deliberately constructed per `00-global-spec.md` so within-class spread along the (1,1) diagonal dominates the between-class gap along the (1,-1) anti-diagonal). Implement real, live computations directly in `script.js`: PCA's first principal component via covariance eigen-decomposition over all 40 points (ignoring labels), and LDA's discriminant axis via the standard two-class formula (direction maximizing between-class scatter over within-class scatter, using the labels) — both real, deterministic, not fabricated.

**Categorical coloring:** PCA axis = `--cat-1` (teal). LDA axis = `--cat-2` (coral). Both are drawn simultaneously on the same scatter so their disagreement is directly visible.

**Layout:** a `.card` with the main 2D scatter (0–100 both axes) showing all 40 points and both axis lines through the data's centroid, and a projection-histogram panel below showing each class's distribution once projected onto whichever axis is currently selected.

**Control:** a toggle, `.btn-secondary` "Show PCA projection" / "Show LDA projection" (mutually exclusive, one active at a time). Selecting one recomputes the projection histogram below: each of the 40 points projected onto that axis, binned into a small histogram, Class A bars in `--primary` and Class B bars in `--active`, overlaid.

**Live readouts:** for whichever axis is selected, a `.readout` "Class overlap: X%" — computed as the percentage of points that would be misclassified if thresholded at the midpoint between the two classes' projected means along that axis (a real, deterministic calculation from the live projection, not a fixed number). The PCA axis should show a visibly higher overlap percentage than the LDA axis.

**Legend:** Class A, Class B, PCA axis, LDA axis.

**Caption:** "PCA found the direction with the most spread, and it happens to separate the two classes worse than several other directions would — LDA ignored total spread entirely and searched only for the one direction that keeps Class A and Class B apart."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Toggle between "Show PCA projection" and "Show LDA projection."
2. Compare the two classes' histograms along whichever axis is selected.
3. Check the class-overlap readout for each axis.
