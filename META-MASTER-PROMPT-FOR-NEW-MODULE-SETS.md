# META-MASTER-PROMPT — How to build a new Acadbyte interactive-diagram module set

**Paste this entire file into a fresh Claude conversation whenever you want a new batch of interactive diagram modules built for the Acadbyte interview-prep course, on any new concept area, in the future.** It is written so a Claude instance with zero memory of any prior conversation can read it and execute the full process correctly on its own — it explains the project, the design system, the exact workflow, the hard constraints, and the deliverables, in enough detail that nothing needs to be re-explained from scratch. Do not summarize or skip sections before acting; read the whole thing first, then start with Step 0 below.

---

## -1. Prerequisites — check these before Step 0

- **You need file read/write access and shell access to the project folder.** This document assumes you're running with tools that can read, write, and edit files, and run shell commands, against the folder path given in section 0 below (in Cowork, that means the user has connected that folder to the session). If you don't currently have that access, ask the user to connect/share the folder first — do not attempt this with only chat-based reasoning and no file tools.
- **If the exact path in section 0 doesn't exist** in whatever folder you do have access to, stop and ask the user for the correct project root rather than guessing or inventing a new, unrelated folder structure elsewhere.
- **A live-preview widget tool is a nice-to-have, not a requirement.** Step G below recommends previewing a prototype live for the user before scaling it. If your environment has no such tool, skip that specific sub-step and instead just tell the user which files to open locally to review the prototype, or use `present_files`/an equivalent file-sharing mechanism if one is available.
- **The default target is Antigravity.** Everything below assumes the deliverable is a `MASTER-PROMPT-FOR-ANTIGRAVITY.md`. If the user says they'll use a different coding agent instead (Claude Code, Codex, or anything else), keep every hard constraint in section 4 and the same overall structure, but rename the file and adjust tone/format accordingly (e.g. `CLAUDE.md` and `MASTER-PROMPT-FOR-CLAUDE-CODE.md` for Claude Code, `MASTER-PROMPT-FOR-CODEX.md` for Codex) — the original 50-module course's folder already has examples of all three formats side by side if you need to match tone.
- **If this project folder is a git repository, stage new files immediately after creating them** (`git add`) rather than leaving them untracked. Untracked files and folders are vulnerable to being silently removed by any external git-clean-style process running against the repo — this happened more than once while building this very project, including a file that had to be rewritten twice. Treat "written to disk" and "safe from being swept away" as two different states; only the second one is safe, and staging in git is the cheapest way to get there. Run `git status` first to see if this folder is even a repo before worrying about this.

---

## 0. What this project is

Acadbyte is building an interview-prep course made of standalone, self-contained interactive HTML/CSS/JS diagram pages — one concept per page, each a single-purpose visual explainer (not a slide deck, not a video, a real interactive thing the user drags/clicks/scrubs). The whole product currently lives under one working folder:

```
D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\
```

Inside that root `diagrams\` folder today:

- **Modules 1–50** — the original course (AI/ML fundamentals + LLM concepts), built directly in `diagrams\` (specs as `module-01-*.md` through `module-50-*.md`, shared docs as `00-*.md`, prototypes in `diagrams\prototypes\`, built output in `diagrams\build\`, its own `README.md` and `MASTER-PROMPT-FOR-ANTIGRAVITY.md`, plus a `MASTER-PROMPT-FOR-CLAUDE-CODE.md`/`CLAUDE.md` and `MASTER-PROMPT-FOR-CODEX.md` for other coding agents).
- **Modules 51–73** — a first extension set (classical ML + advanced LLM production topics), built as a **sibling subfolder**: `diagrams\extension-modules\`, with its own copy of the 5 shared `00-*.md` docs (adapted for that set), its own 23 module spec files, its own `prototypes\module-53-decision-tree\` (a finished, working, real-Gini-split multi-stage prototype), its own `README.md`, and its own `MASTER-PROMPT-FOR-ANTIGRAVITY.md`.
- **Modules 74–79** — a deep-dive set (splitting two survey-level topics — Time Series Analysis and PCA/LDA — into six richer standalone modules), built as another **sibling subfolder**: `diagrams\deep-dive-modules\`, following the exact same pattern as the extension set.

**Every new batch of modules follows this same sibling-subfolder pattern, forever.** When the user asks for a new set of modules on a new concept area, you create a **new, separate, sibling subfolder** under `diagrams\` (never inside an existing set's folder, never merged into an existing set's files), continue the module numbering globally from wherever the highest existing module number left off, and repeat the exact process described below. As of this writing the next new set would start at **module 80** — but always verify this by actually listing the folder (see Step 0.2 below) rather than trusting this number, since more sets may have been built since this file was last updated.

**If instead the user wants a genuinely separate, unconnected product** (a different course entirely, not another set of Acadbyte diagram modules continuing this numbering) — that's a different situation than this document covers; confirm with the user which case you're in before assuming global numbering applies.

---

## 1. Step 0 — before doing anything else, re-verify against the live project

This file describes the project and design system as of when it was written, but it is a snapshot, not a live feed. Before acting on anything else in this document:

1. **List the contents of `diagrams\`** (a plain directory listing) to see every sibling subfolder that currently exists, not just the three named above.
2. **Find the highest module number in use.** Check every sibling subfolder's `README.md` module table (or its highest-numbered `module-NN-*.md` file) and take the true maximum across all of them — this is the number your new set continues from, regardless of what section 0 above says.
3. **Read every sibling subfolder's `README.md`, one paragraph each, to check for topical overlap** with whatever new concept area the user has asked for. If the new request substantially overlaps with a module that already exists somewhere, say so to the user before proceeding rather than silently building a duplicate — they may want to extend the existing module instead of creating a new one, or they may genuinely want a deeper/different treatment (as happened when modules 74–79 deliberately went deeper than modules 56–57 already covered) — just don't let it happen by accident.
4. **Read the most recently created sibling subfolder's `00-app-theme.md`, `00-design-system.md`, `00-mobile-design-system.md`, and `00-global-spec.md` in full.** These are your ground truth for colors, panels, legend rules, categorical colors, the multi-stage scrubber pattern, and the mobile layout rules — more current than the summary in section 2 below, since the design system evolves (new rules get added, bugs get fixed) and this document does not automatically track that.
5. **Open that same folder's `prototypes\` directory** (or, for the extension set specifically, `diagrams\extension-modules\prototypes\module-53-decision-tree\`) and read the actual `index.html`/`style.css`/`script.js` files — a working prototype is always a more reliable reference than any written spec, because it's already been visually approved by the user.

Only after those five checks should you treat section 2 below as confirmed-correct; if anything in the live files contradicts this document, the live files win.

## 2. The design system (summary — verify against live files per Step 0)

**Visual theme:** warm beige light mode, warm dark-brown ("espresso," not "void") dark mode — never pure white or pure black. Every module ships a manual `.theme-toggle` button (sun/moon icon, top-right of `.card`), defaulting to `prefers-color-scheme` on first load and persisting the user's choice in `localStorage`. The exact CSS variables (`--bg`, `--card-bg`, `--bg-muted`, `--border`, `--text`, `--text-muted`, `--primary`, `--active`, `--success`, `--danger`, `--frozen`, `--explain-bg`, plus dark-mode overrides under `[data-theme="dark"]`) live in `00-app-theme.md`/`00-design-system.md` — copy them verbatim, never invent new hex values.

**Five-color semantic system**, meaning the same thing on every module, on every set, forever:
- Blue/indigo (`--primary`) = interactive / touch this.
- Amber (`--active`) = active / changing right now.
- Emerald (`--success`) = correct / converged / matched. Used sparingly.
- Rose (`--danger`) = wrong / diverging / error. Used even more sparingly.
- Neutral gray (`--frozen`, `--text-muted`, `--border`) = at rest / not yet interacted with.

**Categorical colors** — a *separate* 6-hue palette (Teal, Coral, Rose, Sky, Violet, Mustard, each with a light-mode and dark-mode hex value) used only to distinguish several simultaneous same-kind data items within one module (multiple trees, multiple clusters, multiple axes, multiple candidates) — never reused where it would collide with an active semantic color in the same view, and always carried consistently through every stage/panel an item appears in.

**Three distinct text elements, every module, never interchangeable:**
- `.steps-panel` — a short numbered list of literal physical actions ("Step 1: Drag the X slider"), visible immediately on load, never hidden.
- `.explain-panel` — live commentary that updates on *every* interaction (not just the first), referencing the actual current values, 1–2 plain-language sentences, with a sensible default before any interaction.
- `.caption` — one fixed takeaway sentence, revealed once after the first interaction, never changes again.

**Legend** — a small static key (`.legend`, `.legend-item`, `.legend-swatch`) under the diagram, above the controls, whenever a diagram uses a color or shape not already explained by a visible label. Required whenever categorical colors are in play.

**Multi-stage modules** (any module with more than one sequential stage/step) need a proven three-part pattern, all driven by one shared `currentStage` variable:
1. Persistently clickable stage buttons — never lock a stage away after auto-play finishes.
2. A scrubber (`<input type="range">`) for scrubbing forward/backward at the user's own pace.
3. An optional, interruptible auto-play button (~700–1000ms per stage, stops the instant the user touches the scrubber or clicks a stage directly).

Visual states: **completed** / **current** / **upcoming**, distinguished only by the stage box's *background/border* opacity (0.7–0.85 range) — **never** fade the label or body text itself; that was a real legibility bug caught and fixed earlier in this project, and it must never recur. The legend on a multi-stage module must be **dynamic**, re-rendered per stage from a `stageLegend` lookup array inside the same function that updates the explain panel, hidden entirely on stages with nothing color-coded.

**Mobile is a fully separate build, not a responsive breakpoint.** Every module ships a second, standalone `mobile\index.html`/`style.css`/`script.js` (same data, same logic, different layout/interaction): single column, 375px baseline, 44×44px minimum touch targets, tap replacing hover, and for multi-stage modules specifically, large 56×56px per-stage tap buttons. The mobile stacking order for multi-stage modules is exactly: steps-panel → hint → stage-strip → stage-detail (the diagram) → legend → scrubber-row → **explain-panel** → controls (Run/Back/Next/Reset) → caption. The Reset button gets its own dedicated `.btn-reset` class colored `--success` green on mobile, distinct from the neutral Back/Next/Run styling.

**Data integrity rule, applies everywhere:** never call a live API or model, and never fabricate a plausible-looking output number where a real algorithm should produce it. If a module says "real Gini-impurity split," "real covariance eigen-decomposition," "real Lloyd's algorithm," "real gradient descent," etc., that means implement the actual small algorithm in `script.js` against exact fixed input data (small datasets get fully hardcoded arrays; larger datasets get a precisely described seeded-RNG generation recipe, e.g. `seededRandom(seed)` as a simple LCG, with exact formulas for how each point is derived) — the output then comes from running the real math, not from you inventing numbers that look right.

**Per-module deliverable, every single time:** exactly three files per variant (`index.html` markup-only, `style.css` all styling, `script.js` all logic) — no inline CSS/JS, no merging modules' files together, no live API calls, one CDN `<script>` tag max if a library is genuinely needed.

## 3. The exact workflow, step by step

When the user asks for a new module set on a new concept area, follow this sequence:

**Step A — Clarify scope, but don't over-ask.** If the user has already told you the concept area and rough module list, don't re-litigate it with more questions — proceed. If genuinely ambiguous (how many modules, which specific sub-topics, whether any need the multi-stage pattern), ask one focused question via your question tool, or simply propose a sensible, well-reasoned list yourself in your response and move forward — err toward action once you have enough signal, the way this whole project has been run.

**Step B — List `diagrams\` and create a brand-new sibling subfolder.** Run an actual directory listing first (per Step 0.1–0.2) to confirm the true next module number and to make sure your chosen folder name doesn't collide with anything existing. Name the new folder descriptively (e.g. `diagrams\deep-dive-modules\`, or for a future set, something equally descriptive of its theme — `diagrams\nlp-fundamentals-modules\`, `diagrams\deployment-modules\`, whatever fits). Never build inside an existing set's folder, never touch an existing set's files. If this folder is a git repository, `git add` the new folder right after creating its first file, and again periodically as you add more, so nothing sits untracked and vulnerable for long.

**Step C — Copy the 5 shared `00-*.md` docs from the most recently created sibling folder** (per Step 0.4) into the new folder, then edit them for the new set:
- Update every title/intro line to name the new module range and what it covers.
- Update every multi-stage module-number list/count to match the new set's own modules.
- Update every illustrative example (categorical-color examples, legend examples, mobile-scrolling examples) to reference the new set's own modules instead of the old set's.
- Rewrite the "Shared assets" section in `00-global-spec.md` with this new set's own toy datasets (reuse an existing dataset by exact reference only if it's a genuine continuation of the same underlying data; otherwise define new exact datasets).
- Rewrite `00-home-page.md` for a **new, separate, standalone homepage** for this set specifically — same visual language as every other set's homepage, listing only this set's own modules, with a one-way plain-hyperlink (never an iframe embed) back to whichever sibling set's homepage makes sense to link from, continuing the tier/numbering conventions already established.
- Run a final grep sweep across all 5 edited files for any leftover stale references to the old set's specific module numbers or counts before moving on.

**Step D — Decide each new module's tier, tag, and multi-stage status.** Tiers are exactly `"Beginner"`, `"Intermediate"`, or `"Advanced"`; tags are exactly `"AI/ML"` or `"LLM"`. Decide which (if any) modules need the full multi-stage scrubber pattern — not every module needs it; reserve it for genuinely sequential, multi-step concepts (a pipeline, an iterative algorithm, a build-then-search process), and keep single-view modules single-view even if they have several controls.

**Step E — Design exact toy datasets per module**, following the data-integrity rule in section 2. Prefer reusing one dataset across several related modules in the same set when it makes pedagogical sense (the same 40 points appearing in a decision tree, then a random forest, then an SVM, lets a user watch different algorithms draw different boundaries through identical data) — this mirrors the project's established pattern and is a deliberate design choice, not an accident.

**Step F — Write one `module-XX-slug.md` spec file per module**, in this exact format (study `diagrams\extension-modules\module-53-decision-tree.md` or any other existing module file as the literal template to match, not just a description of it):
- Title line: `# Module NN — Concept Name (AI/ML Concept)` or `(LLM Concept)`.
- One-paragraph description of what to build and which library/approach (vanilla SVG, Chart.js, etc.).
- **Exact data** section — the literal hardcoded values or the precise generation recipe.
- **Categorical coloring** section, if applicable — which items get which of the 6 categorical hues.
- **Layout** section — what's on screen, spatial arrangement.
- **Controls/interaction** section — every slider (with exact range/step/default), button, and what each does, referencing real computed behavior.
- For multi-stage modules: an explicit numbered stage-by-stage breakdown (typically 5–9 stages) plus the exact per-stage legend contents as a list.
- **Legend** section (if not covered above).
- **Caption** — the one exact sentence.
- **Steps to interact** — 2–4 numbered literal actions.

**Step G — Build at least one working prototype before writing every remaining spec or handing anything to Antigravity, especially if the set includes a new interaction pattern or a multi-stage module.** This is not optional flourish — it is how a real legibility bug and a real "legend shows everything at once" bug were caught early in this project, before they could propagate across dozens of modules. Pick the most representative or highest-risk module (usually the multi-stage one, if there is one), build its desktop and mobile `index.html`/`style.css`/`script.js` for real, verify JS syntax (`node --check`), preview it live for the user if you have a widget/preview tool available (faithfully reproducing the actual beige theme and actual code — not a generic redesign; if you have no such tool, just point the user to the files directly), and **get explicit user sign-off before proceeding to scale the pattern across the rest of the set.** This is the one intentional checkpoint in an otherwise autonomous process — do not skip it even if the user's phrasing suggests they want everything done in one uninterrupted pass; tell them plainly that you're pausing here for a quick look before generating the rest, and why.

**Step H — Write `README.md`** for the new folder: what it is, its relationship to sibling sets, an explicit isolation guarantee (nothing here touches any other folder), a module table (number/concept/tier/tag/multi-stage), how to build it, and an empty "## Build log" section at the very bottom for Antigravity to fill in later.

**Step I — Write `MASTER-PROMPT-FOR-ANTIGRAVITY.md`**, following the exact structure and hard constraints in section 4 below, with every path spelled out as a full absolute path, referencing the folder's own prototype (from Step G) as the primary template, and a secondary reference to whichever existing prototype in a sibling folder is most relevant (e.g. `module-53-decision-tree` for any new multi-stage module, `module-30-temperature` for a simple one).

**Step J — Deliver.** Use your file-presentation tool to hand the user the master prompt (and README, if useful) directly, and give a concise, non-repetitive summary of what was built — never a long recap of steps already visible in the files themselves. Immediately after writing any file, re-read or re-list it to confirm it actually persisted before telling the user it's done, and if this folder is a git repo, `git add` new files/folders right away — file writes in this environment have occasionally not survived past the point of creation (a real, repeatable issue in this project, apparently tied to untracked files in a git repo being swept by something external), so treat "I called the write tool" and "the file is confirmed safe on disk" as two different claims, and only make the second one after checking.

## 4. Hard constraints — copy these into every single `MASTER-PROMPT-FOR-ANTIGRAVITY.md`, verbatim in spirit, every time, no exceptions

**1. Isolation.** Nothing outside the new set's own subfolder may be created, modified, moved, or deleted, for any reason, at any point in an Antigravity run. Every other folder under `diagrams\` (the original 50, every other extension/deep-dive set, their prototypes, their build output, their master prompts) is strictly read-only reference material. All output goes inside the new folder's own `build\` subdirectory.

**2. One README, one section.** Antigravity updates only its own set's `README.md`, and only the "## Build log" section at the bottom of that file — never the content above that heading, never any other set's README, never a brand-new separate tracking file. If it needs to record decisions or issues, that Build log section is the one place.

**3. Single agent, no parallelization.** Antigravity must do the entire build sequentially, itself, in one continuous run — no sub-agents, no parallel workers, no multi-agent orchestration of any kind, even if its tooling supports it. One module fully finished (desktop, then mobile, then its checklist) before the next one starts.

Every master prompt should also: tell the user explicitly to enable Antigravity's full-autonomy/"Turbo"/YOLO run mode before pasting, so the whole thing runs unattended start to finish; include a Step 0 that makes Antigravity read the shared docs plus the reference prototype(s) before touching anything; include a Step 0(d) that checks for already-existing build output first and reports "already built" vs. "still need to build" before proceeding; require the full 18-item acceptance checklist (see below) after every module; and end with a final-report step that explicitly confirms all three hard constraints were honored.

## 5. The 18-item acceptance checklist (reuse verbatim in every new set's `00-global-spec.md`)

Run this after every generated module, before moving to the next:

1. Desktop and mobile folders both exist, each with exactly `index.html`, `style.css`, `script.js` — no inline CSS/JS.
2. Desktop opens with no console errors at 800×500px; mobile at 375px, no horizontal scroll.
3. Steps-panel present and visible on load, exact steps from the module's file.
4. One obvious first action, visually clear within 2 seconds, no instructions needed.
5. Every live number animates/counts rather than snapping.
6. Explain panel has a sensible default and visibly changes after every interaction, checked at least twice.
7. Caption present, exact text, fades in only after first interaction.
8. Reset (where applicable) returns to exact initial state.
9. Colors match the five-color semantic mapping, no unrelated colors introduced.
10. `prefers-reduced-motion` respected.
11. For multi-stage modules: every stage indicator stays clickable after auto-play completes; scrubbing backward updates state correctly; touching the scrubber mid-autoplay stops it; mobile per-stage buttons are ≥56×56px.
12. Every mobile touch target ≥44×44px, nothing depends on hover, single-finger tap/drag suffices.
13. Theme toggle present on both variants, defaults to OS preference, flips every color including JS-driven chart/SVG colors.
14. Theme choice persists via `localStorage` across reloads; a fresh profile matches OS preference.
15. Home page (checked once, after all modules exist): every module listed exactly once, search/filter working, preview iframe loads correctly, closing it stops the module's JS.
16. Legend present wherever needed, every distinct color/shape has an entry; on multi-stage modules, the legend updates per stage and hides when nothing is color-coded.
17. Non-current stage text stays fully legible — de-emphasis is background/border opacity only, never text opacity.
18. Multi-stage mobile builds: page order is diagram → legend → scrubber → explain-panel → controls → caption, with Reset visibly green.

## 6. Naming and numbering conventions

- Module numbers are **global and continuous** across every set — never restart numbering at 1 for a new set; continue from the highest existing module number + 1, verified by an actual directory/README check (Step 0.1–0.2), not assumed.
- Folder names are lowercase-hyphenated and descriptive of the set's theme, not just a number range (`extension-modules`, `deep-dive-modules`, and so on).
- Module spec filenames: `module-NN-slug.md`, where `slug` is a lowercase-hyphenated short form of the concept name, matching the folder that gets built (`module-NN-slug/`).
- Every new set's tiers stay within `"Beginner"` / `"Intermediate"` / `"Advanced"`; tags stay within `"AI/ML"` / `"LLM"` — never invent a new tier or tag without the user explicitly asking for one.

## 7. What "done" looks like, every time

At the end of running this process for a new concept area, the user should have, inside one brand-new sibling subfolder under `diagrams\`:

- 5 adapted shared docs (`00-app-theme.md`, `00-design-system.md`, `00-mobile-design-system.md`, `00-global-spec.md`, `00-home-page.md`).
- One `module-NN-slug.md` per new module.
- At least one working, verified, user-approved prototype (desktop + mobile) inside `prototypes\`.
- A `README.md` with an empty Build log.
- A `MASTER-PROMPT-FOR-ANTIGRAVITY.md` with the three hard constraints, full absolute paths, and a reference to the prototype as the quality bar.
- Every other existing folder under `diagrams\` completely untouched — verified by a grep sweep for stale cross-references before declaring the work done.
- Confirmation (by re-reading/re-listing, not just by having called a write tool) that every one of the above files actually exists on disk before telling the user it's ready, and (if this is a git repo) that they've been staged so they can't be silently swept away.

The end state, handed to the user, is always: paste one master prompt into Antigravity, enable Turbo/full-auto mode, and the rest happens unattended (after the one prototype-approval checkpoint in Step G) — that has been the standing goal of this entire project from the start, and it should remain the goal for every future set built this way.
