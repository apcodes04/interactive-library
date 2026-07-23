# Project memory — read this first, every single session

## Execution Preferences
- Always run all test/verification commands directly without asking for permission.
- Proceed autonomously through builds, checks, and testing steps.

This file is auto-loaded by Claude Code at the start of every session in this folder. If you are a fresh session (new context, restarted after hitting a usage/token limit, or resumed with `--continue`), **your very first action, before writing or editing anything, is to read `build/PROGRESS.md`.** That file is the single source of truth for what's done, in progress, or not started. Never trust your own memory of "what I was doing" over what's written in that file — if there's ever a conflict, `PROGRESS.md` wins.

## What this project is

50 standalone interactive HTML/CSS/JS diagrams for an ML/LLM interview-prep course, one per `module-XX-slug.md` file in this folder, plus one final connecting home page. Each module file is a complete build spec (exact library, exact hardcoded data, exact interaction, exact caption, exact steps-to-interact). Four files apply to every module and never change: `00-global-spec.md` (build rules, acceptance checklist, shared example data), `00-design-system.md` (colors, typography, motion, the required live explain-panel, the light/dark theme toggle, and the multi-stage scrubber pattern), `00-mobile-design-system.md` (the separate mobile-build rules), and `00-app-theme.md` (the exact beige/dark-beige color values and contrast rationale). A fifth file, `00-home-page.md`, applies only once, at the very end, for the home page. Read all four always-on files in full before building anything, every session, even if you read them in a previous session — do not assume you remember their contents correctly.

## Where output goes

Build each module into `build/module-XX-slug/` (desktop: `index.html`, `style.css`, `script.js`) and `build/module-XX-slug/mobile/` (mobile: its own `index.html`, `style.css`, `script.js`, per `00-mobile-design-system.md`). Never merge two modules' files together. Never touch a `module-XX-*.md` file, any `00-*.md` file, or anything inside `prototypes/` — those are read-only inputs and reference implementations, not things to edit. Once all 50 modules show `DONE` in `PROGRESS.md`, build the final `build/home/` page (see the dedicated section near the bottom of this file).

## Fresh session, before reading PROGRESS.md: check what's actually on disk

`PROGRESS.md` is the source of truth, but if it's missing, stale, or you're the very first session, don't take its absence as proof nothing exists — `ls build/` first. A module only counts as already done if it has all six files: `build/module-XX-slug/{index.html,style.css,script.js}` AND `build/module-XX-slug/mobile/{index.html,style.css,script.js}`. If a module folder exists but is missing its `mobile/` subfolder (e.g. it was built before mobile variants were required), treat it as incomplete and finish it rather than skipping it. Reconcile whatever you find on disk with `PROGRESS.md` before proceeding, and fix `PROGRESS.md` if it disagrees with reality.

## The resumable progress log — this is what makes restarting safe

Maintain `build/PROGRESS.md` as a single table, one row per module, with these exact columns: `Module | Status | Notes`. Status is one of `PENDING`, `IN_PROGRESS`, `DONE`, `BLOCKED`. If `build/PROGRESS.md` doesn't exist yet, create it now with all 50 modules listed as `PENDING`, in order, plus one final row for `Home page`.

Rules for keeping it accurate, since this file is the only thing standing between "resume cleanly" and "redo work or lose track":

1. Before starting a module, set its row to `IN_PROGRESS` and write a one-line note about what you're about to do.
2. Update the note as you go if a module takes more than a few steps — e.g. "index.html done, style.css done, script.js in progress" — so that if you stop mid-module, the next session knows exactly what's left rather than having to guess by reading partial files.
3. The moment a module passes its acceptance checklist (see below), set it to `DONE` immediately. Do not batch this — update the file after every single module, not at the end of a session.
4. If a module truly cannot be completed as specified (a genuine data inconsistency in its `.md` file, not just something you find difficult), mark it `BLOCKED` with a clear one-line reason, and move on to the next module rather than guessing or stalling.
5. Work through modules in order, 01 through 50, resuming from the first row that is not `DONE`. Skip past `DONE` rows without re-opening or re-verifying them — trust your own prior verification.

## Handling running out of context or hitting a usage limit

This is expected to happen at least once across 50 modules — it is not a failure state, and you don't need to apologize for it or try to rush to avoid it. What matters is that `build/PROGRESS.md` is always an honest, current snapshot. Work in a way that keeps it current continuously (per the rules above) rather than planning to "write it all up at the end" — you may not get a chance to reach the end of a session cleanly. If you are cut off mid-module, that module simply stays `IN_PROGRESS` with whatever note you last wrote, and the next session (restarted by the user via `claude --continue` or a fresh `claude` invocation in this folder) will pick it back up from that exact note.

## Every module needs three text elements, a mobile twin, and a theme toggle — not optional extras

These apply to every one of the 50 modules, on both desktop and mobile, no exceptions:

1. **`.steps-panel`** — a numbered list of literal actions ("Step 1: Drag the slider"), visible on load, before the diagram. Exact wording comes from that module's own `.md` file.
2. **`.explain-panel`** — updates on every interaction, not just the first (see `00-design-system.md`).
3. **`.caption`** — one fixed takeaway, revealed once, after the first interaction.
4. **A `mobile/` twin folder** — same data and logic, rebuilt layout/interaction per `00-mobile-design-system.md`.
5. **A `.theme-toggle` button** — sun/moon icon, the exact beige/dark-beige values from `00-app-theme.md`, defaulting to `prefers-color-scheme`, persisted via `localStorage`. Never pure white or pure black.

## Verification — you have a terminal, use it

For every module, after writing its files, actually run `node --check build/module-XX-slug/script.js` AND `node --check build/module-XX-slug/mobile/script.js` yourself via the bash tool and confirm both pass before marking the module `DONE` — don't just self-report that it should work. Then run through the full acceptance checklist in `00-global-spec.md` (including the theme-toggle items) and note explicitly in `PROGRESS.md`'s Notes column which items you verified.

## The 8 multi-stage modules need the scrubber pattern, not just an explain panel

Modules **4, 8, 12, 15, 17, 23, 31, and 47** each show more than one sequential stage or step. For these specifically, a single auto-play button is not acceptable on its own — read the full "Multi-stage modules" section of `00-design-system.md` and use `prototypes/module-47-rag-pipeline/` as the reference implementation before building any of these 8: one shared current-stage-index variable driving (a) individually clickable stage buttons that remain clickable forever, including after any animation finishes, (b) a scrubber (range input) for moving forward and backward through stages at the user's own pace, and (c) an optional auto-play button that moves that same shared state and stops immediately if the user touches the scrubber or clicks a stage directly.

## When all 50 are DONE: build the home page, then finish

Once every module row in `PROGRESS.md` says `DONE` or `BLOCKED` (none left `PENDING` or `IN_PROGRESS`), read `00-home-page.md` in full and build `build/home/index.html`, `style.css`, `script.js` exactly as it specifies — a hardcoded registry of all 50 modules (pull title/tier/tag from `README.md`'s table so they never disagree), grouped by tier, with search, tier filters, its own light/dark toggle, and an iframe-based Preview panel (with a Desktop/Mobile switch) plus an "Open in new tab" link per card. Use `prototypes/home/` as the reference implementation. Never import any module's JS/CSS directly — only link to or `<iframe>` its `index.html`. Run the 8-item checklist in `00-home-page.md` yourself, mark the `Home page` row in `PROGRESS.md` `DONE`, then write a final summary section at the bottom of `PROGRESS.md`: total modules passed cleanly, total that needed fixes along the way, total blocked and why, the exact module numbers for anything not `DONE`, and confirmation the home page checklist passed.
