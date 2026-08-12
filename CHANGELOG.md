# Changelog

All notable changes to the NIGHTSHIFT pack are documented here. The pack versions like code because it is code — instructions included.
Format: Keep a Changelog.

## [2.0.0] - 2026-08-12

Version 2 of the squad. The theme is gone, the personas are gone, and every agent file was rewritten from the Operator's role notes: each agent is defined by its job and carries an explicit list of the skills that make it a master of its craft.

### Changed
- **Cyberpunk writing style and thematic dropped everywhere** — no worldbuilding, no backstories, no "chrome in the comments" carve-out. Every artifact *and* every comment is plain professional work; constitution §11 is now *Artifact standards*.
- **Agents no longer follow a specific personality — the job is the personality.** Agent files were restructured from 8 persona-oriented sections to 5 craft-oriented ones: *Role / Principles / Skills / How you work / Boundaries*. "What you want", "How you talk", signature phrases, and the voice-calibrating Examples are gone; professional traits from the notes (Sigma's taste and perfectionism, Filter's evidence discipline) survive as principles, not character.
- **Every agent lists the skills of a master of its craft in its instructions** — a dedicated *Skills* section per agent: the concrete techniques, frameworks, and internalized canon (the relevant books, named) of the trade, with the attached skill packs as the progressive-disclosure depth behind them.
- **Renames:** Canvas → **Sigma** (now *design engineer*: owns the reusable component layer and presents it in Storybook, not just the design language), Doku → **Quill** (technical writer), Signal → **Valve** (backend engineer). Files renamed accordingly (`sigma.md`, `quill.md`, `valve.md`).
- **Trigger's splitting rules per the v2 notes:** splitting into sub-issues is preferred whenever smaller parts are useful, and **new sub-issues are assigned to the NIGHTSHIFT squad, never to individual members** — each piece enters through triage with its owner named in the routing comment. Constitution §5, squad Instructions, README, operator guide, and acceptance test T2 updated to match.
- **Index narrowed to the records, per the v2 notes:** files RFCs before large changes and ADRs after decisions, writes concisely ("as few words as possible"), and *only writes the documents* — the architecture in them is designed by @void. Research duties moved out (`lit-review` reattached to @void); model tier dropped from deep-reasoning to default; web-search MCP removed.
- **All-agents communication rules** added to the shared protocol and constitution §8: clean and concise, only relevant information, never repeat what another agent already said unless the repetition is itself relevant to the Operator, and code comments if and only if highly relevant to the reader of the code.
- **Deep-reasoning tier is now `wire`, `valve`, `void`** (was `wire`, `signal`, `index`).
- **Acceptance tests:** T2 verifies squad-assigned sub-issues; T7 retargeted from @index to @void (recommend-vs-decide on an architecture question); T8 retargeted to @quill; T9 replaced (was Gravity's engagement shape) with the design/record split between @void and @index.
- **Supporting docs aligned:** README (roster, routing map, matrices, workflows, layer map, tuning knobs), operator guide (new *Architecture calls* section replacing *Calling Gravity*), autopilot #3 reassigned to @quill, skills README matrix re-owned (sigma/quill/valve/void).

### Added
- **@void — software architect** (`agents/void.md`), new eleventh member *inside* the squad: deep technical expertise with strategic business insight; clearly structured architectural plans (context, options, trade-offs, recommendation, phasing with cut lines); master of system design and abstraction levels; pragmatic — no reinvented wheels, pre-existing patterns followed where warranted; keeps the codebase well designed and calls out structural problems unprompted. Recommends, never decrees: one-way doors go to the Operator, documents go to @index. Deep-reasoning tier, raised thinking, concurrency 2. Wired into the roster, routing map, decision rights (§4), a new architecture gate (§6.5), a new *Architecture* workflow (§7), and both skills/MCP matrices.

### Removed
- **@gravity retired** (`agents/gravity.md` deleted). The v2 roster is defined by the Operator's role notes, which place architecture with @void inside the squad (Index's notes: "the architecture is designed by @Void") — an Operator-only, persona-heavy outside seat no longer fits a pack whose agents are their jobs. Gravity's architecture, review, and planning duties live with @void under normal squad routing; its skill shelf moved there too. If you ran v1 with Gravity, delete the agent in Multica or leave it unrouted — nothing in v2 references it.
- Per-agent persona machinery: backstories, "How you talk" sections, signature phrases, and in-file Examples (behavior calibration now lives in the principles, the constitution's gates, and `acceptance-tests.md`).

## [1.x] — pre-2.0 (previously "Unreleased")

### Added
- **Comment brevity law** (constitution §8 + pocket card): comments are telegrams — default ≤150 words, one report per turn, detail lives in the artifact; a comment that needs scrolling wanted to be a file.
- **GitHub identity & voice rules** (constitution §11 + pocket card): commits are authored as the Operator's GitHub name/email (runtime git config; the `agent/<handle>/…` branch records who did the work), and agents never post comments, reviews, or replies on GitHub — their voice there ends at the PR description; replies for GitHub humans are drafted in-thread for the Operator to post. Setup runbook step 1 and the repo scaffold document the git-identity config; the operator guide gains *Your name, their hands*; T3 now verifies commit authorship and GitHub silence.
- **Janitor sweep autopilot** (#5 — `@filter`, 1st & 15th): janitor duty finally has a trigger path — Multica agents have no idle time, so "when idle" duties need a schedule to exist. Filter's and doku's cadence bullets now name their real triggers; CI red-alert renumbered to #6.
- **@gravity** (`agents/gravity.md`) — an eleventh agent deliberately outside the squad: the Operator's right hand for architecture verdicts, campaign planning, keystone builds, and reviews of NIGHTSHIFT itself. Summoned by the Operator only — Access **Only me** and squad-roster absence make that mechanical, not aspirational. Strongest available model, thinking maxed, concurrency 1, no standing duties by design ("if you need me twice for the same thing, design me out of the third"). Wired into the constitution (§1, §3 outside-the-roster note, §4 no-default-authority), the pocket card's first line, @trigger's map, the squad Instructions, the operator guide (*Calling Gravity*), both skills matrices, the MCP matrix, and new acceptance test T9. *(Retired in 2.0.0.)*
- `autopilots.md` — five paste-ready Multica automations (zombie sweep, pipeline health report, docs rot hunt, ADR backfill check, CI red-alert webhook) that put the operator guide's manual weekly hygiene on rails. Wired into the setup runbook (step 6), the operator guide, and the repo scaffold.
- **Issue-status contract** (Multica convention) across the shared protocol, constitution §5/§12, @trigger's leader mode, and the README squad section: `in_progress` on the first working turn, `in_review` on delivery, `done` reserved for the Operator; backlog never runs; mentioned-not-assigned agents leave status alone.
- Acceptance test **T8 — Status honesty**; T1 now also expects the parent moved to `in_progress`.
- `.gitignore`; `.DS_Store` dropped from version control.

### Changed
- @trigger's Multica mechanics now match the platform's documented leader re-trigger rules: human-authored explicit mentions bypass the leader entirely, agent-authored handoffs wake it to observe (`no_action` is the trained stand-down). Squad-activity CLI call matches the documented form; sub-issue splits carry severity/priority and due dates.
- Setup runbook: notes the agent Description field is display-only, adds the per-agent thinking-level knob, and documents skill import via URL/CLI with `--on-conflict` semantics.
- Operator guide: backlog / *Don't start yet* semantics, per-run handoff notes, the comment-edit mention footgun, direct chat for issue-less questions, how to read `in_review`, and hygiene pointed at the autopilots.
- Skills README: install path updated to *Import from URL* / CLI import, plus the workspace-vs-repo-skills trade-off, stated.
- README: squad-behavior notes expanded to three (squad mention, human vs agent explicit mentions, edit-no-trigger); tuning knobs gained autopilot cadence and the Usage view.

### Fixed
- Anthropic public PDF skill name: `pdf-reading` → `pdf` (the old name doesn't exist in `anthropics/skills`; import would have failed).
- Acceptance test T3's fix pointer now names the shared protocol's actual section, *Code ships as PRs*.
- **Prompt audit, all ten agents:** trigger's and signal's examples now use real mention markdown instead of the plain-text form the pocket card forbids; index's example attributes its Sentry numbers to @signal instead of claiming direct verification; wire returns @index's signature phrase; doku's "triggered on feature merges" now names the real mechanism (@merge's handoff mention).
- **Publish execution resolved strictly** (was contradictory between gate 8 and jinx): the Operator presses the button; @jinx posts only on explicit delegation ("Approved: you post it") — constitution §6.8, jinx's hard limits, the pocket card, and `launch-checklist` now agree.
- Incident assembly named as the split check's deliberate exception (constitution §5 + trigger.md); split-procedure sub-issue metadata synced into `triage-protocol`; signal's data-integrity initiative sharpened to in-code fixes only; merge told a PR waiting on the Operator's required review is the system working, not a stall; Notion marked optional across configs (least privilege).
