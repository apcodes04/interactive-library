# Module 6 — Generative vs. Discriminative Models (Q17 — AI/ML Question)

Build a toggle demo contrasting the two model types on the same toy 2-class dataset (exact points from `00-global-spec.md`). Use D3.js with `d3-contour` for the density view. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with a scatter plot of the 40 shared dataset points, Class A in `--primary` blue, Class B in `--active` amber.

**Toggle** (styled as two segmented `.btn-secondary`/`.btn-primary` buttons, "Discriminative" / "Generative"):
- **Discriminative state:** overlay a single straight decision boundary line (the line `y = -x + 100`, which reasonably separates the two clusters at (30,30) and (70,70)) in `--text` dark color.
- **Generative state:** hide the boundary line; instead render two shaded contour regions using `d3-contour` over a precomputed 2D Gaussian density grid (mean (30,30), std 15, for Class A tinted blue; mean (70,70), std 15, for Class B tinted amber), each contour at 3 opacity levels (outer faint, inner strong) to suggest a density "hill."

Animate the switch between states as a 400ms crossfade (boundary line fades out as contours fade in, or vice versa).

**Caption:** "The discriminative view only draws where the line is. The generative view shows what each class actually looks like — notice it can tell you how confident it is even far from the line."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click the "Discriminative" / "Generative" toggle.
2. Compare the boundary-line view against the density-contour view.
