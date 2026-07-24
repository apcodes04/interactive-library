# Module 65 — Confusion Matrix / ROC-AUC (AI/ML Concept)

Build a page where a movable classification threshold live-updates a confusion matrix and a marker on a fixed ROC curve. Use vanilla SVG/CSS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** 20 fixed toy predictions (10 truly Class A, 10 truly Class B) with fixed predicted probability-of-Class-B scores. True Class A group: scores = `[0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.60, 0.70]` (last two are the model's mistakes). True Class B group: scores = `[0.35, 0.45, 0.55, 0.60, 0.65, 0.70, 0.75, 0.85, 0.90, 0.95]` (first two are borderline near-misses).

**Layout:** a `.card` with a 2×2 confusion-matrix grid on the left (True Positive, False Positive, False Negative, True Negative cells) and an ROC curve chart on the right, precomputed once by sweeping the threshold 0→1 over these 20 fixed scores and plotting the resulting (FPR, TPR) curve as a static line, with AUC computed once (via the standard rank-sum formula over these 20 fixed scores, live in `script.js`) and shown as a `.readout`.

**Control:** slider "Classification threshold," range 0–1 step 0.01, default 0.5. On every change: recompute TP/FP/FN/TN counts from the 20 fixed scores against the new threshold, update all 4 confusion-matrix cell values and colors, update `.readout`s for Accuracy/Precision/Recall/F1, and move a marker dot to the corresponding (FPR, TPR) point on the fixed ROC curve.

**Cell coloring:** True Positive = `--success`, True Negative = `--frozen`, False Positive and False Negative = `--danger` (at different matrix positions).

**Legend:** True Positive, False Positive, False Negative, True Negative, Threshold marker (on ROC curve).

**Caption:** "Moving the threshold trades false positives for false negatives along the same ROC curve — accuracy alone hides which kind of mistake you're making more of."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Classification threshold" slider.
2. Watch the confusion matrix counts and precision/recall readouts update.
3. Watch the marker slide along the fixed ROC curve as the threshold changes.
