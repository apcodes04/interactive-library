# Module 44 — Parameter-Efficient Fine-Tuning, PEFT (Q33 — LLM Question)

Build a frozen-vs-trainable block grid toggle. Use vanilla CSS/SVG grid. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** grid of 48 small blocks (base model, `--frozen` gray by default) plus 4 small blocks clipped onto one side, labeled "Adapter" (`--active` amber by default).

**Layout:** a `.card` with the 48-block grid plus the 4 adapter blocks, and a toggle labeled "Full fine-tuning / PEFT."

**Behavior:** "Full fine-tuning" state — all 48 base blocks animate from `--frozen` gray to `--danger`-adjacent warm "hot" color (use `--active` amber to represent "trainable," reserving danger red for error states elsewhere) over 400ms; readout: "Trainable parameters: 48 of 52 (92%)." "PEFT" state — only the 4 adapter blocks are `--active` amber, all 48 base blocks stay `--frozen` gray; readout: "Trainable parameters: 4 of 52 (8%)."

**Caption:** "Same base model size both times — the only thing that changed is how many of these blocks are actually allowed to update."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click the "Full fine-tuning" / "PEFT" toggle.
2. Compare how many blocks turn warm-colored each time.
