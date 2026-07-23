# Module 33 — Jacobian Matrix in Backpropagation (Q25 — AI/ML Question)

Build a small input-to-output connection diagram. Use D3.js. Follow `00-design-system.md` for colors/type/motion.

**Exact 3×3 Jacobian matrix** (rows = outputs 1–3, columns = inputs 1–3), chosen to show both sparsity (some exact zeros) and coupling (nonzero off-diagonals):

```
            in1   in2   in3
out1  [    0.8,  0.1,  0.0  ]
out2  [    0.3,  0.6,  0.2  ]
out3  [    0.0,  0.4,  0.9  ]
```

**Layout:** a `.card` with 3 labeled input nodes on the left, 3 labeled output nodes on the right, and this exact 3×3 grid of values displayed in the middle, cell color intensity in `--primary` proportional to the absolute value (0.0 cells rendered fully `--frozen` gray, no line drawn for them at all).

**Behavior:** hovering any nonzero cell highlights (`--active` amber) the one connecting line from that cell's input node to its output node, dimming all other lines and cells to 20% opacity. Hovering an input or output node instead highlights all of that node's associated nonzero lines/cells together.

**Caption:** "Hover any cell — that's one single partial derivative, and one single line. Notice the two zero cells have no line at all: those input-output pairs simply don't affect each other. The full Jacobian is nothing more than all nine of these considered at once."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Hover (or on mobile, tap) any cell in the 3×3 grid.
2. Hover/tap an input or output node instead to see all its connections at once.
