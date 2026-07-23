# Master Prompt — Build All 50 Modules Autonomously & Resumably (Claude Code)

## Folder to give it access to

Point Claude Code's working directory at this exact folder:

```
D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\
```

Open a terminal, `cd` into that folder, then run `claude` from there. Claude Code auto-loads `CLAUDE.md` from the current directory at the start of every session — that file already contains the full persistent instructions (what to build, where output goes, how to track progress, how to resume). You don't need to paste a long prompt every time; `CLAUDE.md` is doing that job for you, automatically, every session.

## Which model: Sonnet 5

Use **Sonnet 5** as the default for this whole run. Every module's spec is already extremely explicit — exact colors, exact hardcoded numbers, exact interaction behavior, exact caption text — so this is a "follow the spec precisely and consistently across 50 similar files" task, not a "use deep judgment" task, which plays to Sonnet's strengths and keeps 150 files (50 modules × 3 files) affordable and fast.

Reserve **Opus** for the handful of modules flagged as harder in this folder's `README.md` Build Notes: **31** (beam search tree logic), **45** (LoRA matrix animation), and any module Sonnet genuinely struggles with after you spot-check it. You can switch models mid-project without losing anything — `build/PROGRESS.md` tracks state independently of which model is running, so if Sonnet leaves module 31 `BLOCKED` or visibly wrong, just restart Claude Code with Opus for that one module and it'll pick up exactly where the log says.

## The first message to type

Since `CLAUDE.md` already carries all the detailed rules, your first message can be short:

```
Read CLAUDE.md in this folder and begin building all 50 modules (desktop + mobile + theme toggle each) per its instructions. Check build/PROGRESS.md first — if it doesn't exist, check what's actually already on disk in build/ before assuming nothing exists, then create PROGRESS.md with all 50 modules (plus a Home page row) marked PENDING, and start from module 1. If it already exists, resume from the first row not marked DONE. Once all 50 modules are DONE, build the connecting home page per 00-home-page.md. Work through as many modules as you can in this session, keeping PROGRESS.md continuously accurate so I can restart you cleanly if you run out of context or hit a usage limit.
```

## How the "resume after tokens run out" part actually works

Claude Code cannot silently keep working in the background once a session ends or a usage limit is hit — there's no way around that, and no tool claims otherwise. What makes this resumable instead of a restart-from-scratch is that `CLAUDE.md` instructs Claude Code to treat `build/PROGRESS.md` as the one authoritative record of what's done, updated continuously (after every module, and mid-module if a module takes a while) rather than only at the end. So the practical loop is:

1. Run `claude` in this folder and let it work.
2. When it stops — because it finished a natural checkpoint, hit a usage limit, or the session otherwise ends — check `build/PROGRESS.md` yourself to see where it got to.
3. Start it again with either `claude --continue` (resumes the same conversation, if still available) or a fresh `claude` invocation in the same folder (a new session, which will read `CLAUDE.md` and `PROGRESS.md` from scratch and resume from the first non-`DONE` row either way).
4. Repeat until `PROGRESS.md` shows all 50 as `DONE` or `BLOCKED`.

Because `PROGRESS.md` is what resumption actually depends on — not conversational memory — a brand-new session picks up exactly as cleanly as `--continue` does. You don't need to babysit which mechanism is available each time.

## What you'll get back

- `build/module-01-hyperparameter/` through `build/module-50-diagnostic-scenario/`, each with a desktop version plus a `mobile/` subfolder — every one openable by double-clicking `index.html`, and every one with its own light/dark toggle button.
- `build/home/` — the final connecting landing page; open `build/home/index.html` to browse and preview every module (desktop or mobile) from one screen without opening 50 separate files.
- `build/PROGRESS.md` — the live, continuously-updated status of all 50 plus the home page, and a final summary once complete.

## After it finishes

1. Read `build/PROGRESS.md`'s final summary — anything `BLOCKED` needs your input before it can be resolved (Claude Code was instructed to flag genuine spec problems rather than silently improvise past them).
2. Open `build/home/index.html` and use it to spot-check 4–5 modules across the three tiers via its Preview panel — faster than opening each `index.html` individually, and it also confirms the home page itself works.
3. Toggle light/dark on a couple of previewed modules to confirm the theme actually flips, with no pure-white/pure-black anywhere.
4. Compare one against `prototypes/module-30-temperature/` or `prototypes/module-47-rag-pipeline/` (both have `mobile/` folders too) to confirm the visual style and, for the 8 multi-stage modules, the scrubber pattern genuinely matches on both desktop and mobile.
