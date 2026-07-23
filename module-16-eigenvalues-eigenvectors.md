# Module 16 — Eigenvalues & Eigenvectors (Q26 — AI/ML Question)

Build a live 2D linear-transformation demo. Use D3.js or plain Canvas. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with an SVG showing a unit circle made of 40 points (`--frozen` gray) plus two arrows representing the eigenvectors (`--active` amber). Four number inputs for matrix entries a, b, c, d (2×2 matrix `[[a,b],[c,d]]`), range −2 to 2, default identity (a=1, b=0, c=0, d=1).

**Behavior:** on any input change, recompute live in JS (implement the real 2×2 formulas, do not hardcode):
- Transform all 40 circle points by the matrix: `x' = a*x + b*y`, `y' = c*x + d*y`. Redraw the resulting ellipse shape, animated over 300ms.
- Compute the actual eigenvalues via the closed-form 2×2 formula (`λ = (tr ± sqrt(tr² − 4·det)) / 2`, where `tr = a+d`, `det = ad−bc`) and the corresponding eigenvectors, then redraw the two eigenvector arrows scaled proportionally by their eigenvalues. If eigenvalues are complex (discriminant < 0), display "Complex eigenvalues — this matrix rotates" instead of drawing arrows.

**Key visual to guarantee:** as inputs change, most points on the circle both rotate and stretch, but the two eigenvector arrows only ever stretch or shrink along their own fixed direction, never rotate.

**Caption:** "Every point on this circle moves when you change the matrix — except along these two directions, which only stretch. That's the entire definition of an eigenvector."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Change any of the 4 matrix number inputs (a, b, c, d).
2. Watch the circle warp into an ellipse.
3. Watch the two eigenvector arrows update.
