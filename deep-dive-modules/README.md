# Deep-Dive Modules (74–79)

This folder is a **sibling extension** to both the original 50-module course (`diagrams/`) and the 23-module extension set (`diagrams/extension-modules/`) — not a replacement or a merge of either. It goes deeper into two topics those sets only introduced at survey level: Time Series Analysis (module 57) and PCA/LDA (module 56), each broken into its own richer, standalone module. All 6 modules continue the global numbering right after module 73 and sit in the Advanced tier.

**Status as of this writing: spec-only.** All 6 module `.md` files and this folder's 5 shared spec docs are written and ready to hand to a coding AI. No `build/` output exists yet — that gets created by running `MASTER-PROMPT-FOR-ANTIGRAVITY.md` against this folder.

**Isolation guarantee:** nothing in this folder modifies, moves, or deletes anything in the original `diagrams/` root or in `diagrams/extension-modules/`. Where this folder's specs reference either of those sets — e.g. pointing to `diagrams/extension-modules/prototypes/module-53-decision-tree/` as the reference implementation of the multi-stage scrubber pattern, or reusing `diagrams/extension-modules`'s toy time-series dataset — that's a **read-only reference or a copied constant**, never a live edit to those folders.

## What's in this folder

- `00-app-theme.md` — the shared light/dark beige theme (identical values to the other two sets' copies).
- `00-design-system.md` — shared component patterns, adapted for this set's own examples (module 78 is called out as this set's one multi-stage module).
- `00-mobile-design-system.md` — shared mobile layout rules, adapted for this set.
- `00-global-spec.md` — build requirements, acceptance checklist, and this set's own shared datasets (the reused 24-month time-series dataset, a 7-point and a 60-point PCA dataset, and a deliberately-constructed 40-point LDA dataset).
- `00-home-page.md` — spec for a third, standalone landing page listing these 6 modules, linking back to the extension set's homepage but never modifying it.
- `module-74-*.md` through `module-79-*.md` — one spec file per module.
- `MASTER-PROMPT-FOR-ANTIGRAVITY.md` — the copy-paste prompt to hand Antigravity to build everything in this folder.

## Module list

| # | Concept | Deepens | Tier | Tag | Multi-stage? |
|---|---|---|---|---|---|
| 74 | Trend Extraction | Module 57 | Advanced | AI/ML | |
| 75 | Seasonality Detection | Module 57 | Advanced | AI/ML | |
| 76 | Residual & Anomaly Detection | Module 57 | Advanced | AI/ML | |
| 77 | Autocorrelation (ACF/PACF) | Module 57 | Advanced | AI/ML | |
| 78 | PCA Deep Dive | Module 56 | Advanced | AI/ML | Yes |
| 79 | LDA Deep Dive | Module 56 | Advanced | AI/ML | |

Module 78 is the one module in this set using the full multi-stage scrubber pattern, referencing `diagrams/extension-modules/prototypes/module-53-decision-tree/` as its closest already-built example.

## How to build

Paste `MASTER-PROMPT-FOR-ANTIGRAVITY.md`'s contents into Antigravity along with this folder's path, after enabling its full-autonomy/Turbo run mode. It will build sequentially — one agent, no parallel workers — into `diagrams/deep-dive-modules/build/`, updating the "Build log" section below as it completes each module, and will not touch anything outside this folder.

## Build log

_(Not started — populated by Antigravity as modules are built.)_
