# Eigenvalues & Eigenvectors Visualizer

An interactive, self-contained 2D web visualization for Eigenvalues and Eigenvectors inspired by **Setosa (Explained Visually)**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)

## 🌟 Features

- **Interactive Vector Dragging**: Drag vector $\mathbf{v}$ around the Cartesian plane and watch the transformed vector $A\mathbf{v}$ update in real time.
- **Eigenvector Span Lines**: Infinite dashed lines marking real eigenvector directions.
- **Visual Cue on Alignment**: Pulsing highlight, vector glow, and an animated **EIGENVECTOR ALIGNED!** banner when $\mathbf{v}$ aligns with an eigenvector.
- **Deformable Space Grid**: Toggle the transformed coordinate grid mesh to visualize how matrix $A$ distorts 2D space.
- **Transformation Matrix Controls**: Dual numeric inputs & range sliders for $2 \times 2$ matrix $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$.
- **Matrix Presets**: Diagonal Stretch, Horizontal Shear, Pure Rotation, Y-Axis Reflection, Line Projection, and Complex Roots.
- **Live Analytical HUD**: Real-time readouts for trace $\text{tr}(A)$, determinant $\det(A)$, scalar ratio $\frac{\|A\mathbf{v}\|}{\|\mathbf{v}\|}$, and exact eigenvalues $\lambda_1, \lambda_2$.
- **Dark & Light Mode**: High-contrast modern aesthetic with built-in theme toggle.

## 🚀 Quick Start

No build pipeline or external local dependencies required!

### Option 1: Open Directly
Simply open `index.html` in any modern web browser.

### Option 2: Run Local HTTP Server
```bash
# Using Node.js serve
npx serve -l 5000 .

# Or using Python
python -m http.server 5000
```
Then navigate to `http://localhost:5000`.

## 📜 License
MIT License.
