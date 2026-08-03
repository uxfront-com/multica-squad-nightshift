# Changelog

All notable changes to the NIGHTSHIFT pack are documented here. The pack versions like code because it is code — instructions included.
Format: Keep a Changelog.

## [Unreleased]

### Added
- **Comment brevity law** (constitution §8 + pocket card): comments are telegrams — default ≤150 words, one report per turn, detail lives in the artifact; a comment that needs scrolling wanted to be a file.
- **GitHub identity & voice rules** (constitution §11 + pocket card): commits are authored as the Operator's GitHub name/email (runtime git config; the `agent/<handle>/…` branch records who did the work), and agents never post comments, reviews, or replies on GitHub — their voice there ends at the PR description; replies for GitHub humans are drafted in-thread for the Operator to post. Setup runbook step 1 and the repo scaffold document the git-identity config; the operator guide gains *Your name, their hands*; T3 now verifies commit authorship and GitHub silence.
- **Janitor sweep autopilot** (#5 — `@filter`, 1st & 15th): janitor duty finally has a trigger path — Multica agents have no idle time, so "when idle" duties need a schedule to exist. Filter's and doku's cadence bullets now name their real triggers; CI red-alert renumbered to #6.
- **@gravity** (`agents/gravity.md`) — an eleventh agent deliberately outside the squad: the Operator's right hand for architecture verdicts, campaign planning, keystone builds, and reviews of NIGHTSHIFT itself. Summoned by the Operator only — Access **Only me** and squad-roster absence make that mechanical, not aspirational. Strongest available model, thinking maxed, concurrency 1, no standing duties by design ("if you need me twice for the same thing, design me out of the third"). Wired into the constitution (§1, §3 outside-the-roster note, §4 no-default-authority), the pocket card's first line, @trigger's map, the squad Instructions, the operator guide (*Calling Gravity*), both skills matrices, the MCP matrix, and new acceptance test T9.
- `autopilots.md` — five paste-ready Multica automations (zombie sweep, pipeline health report, docs rot hunt, ADR backfill check, CI red-alert webhook) that put the operator guide's manual weekly hygiene on rails. Wired into the setup runbook (step 6), the operator guide, and the repo scaffold.
- **Issue-status contract** (Multica convention) across the shared protocol, constitution §5/§12, @trigger's leader mode, and the README squad section: `in_progress` on the first working turn, `in_review` on delivery, `done` reserved for the Operator; backlog never runs; mentioned-not-assigned agents leave status alone.
- Acceptance test **T8 — Status honesty**; T1 now also expects the parent moved to `in_progress`.
- `.gitignore`; `.DS_Store` dropped from version control.

### Changed
- @trigger's Multica mechanics now match the platform's documented leader re-trigger rules: human-authored explicit mentions bypass the leader entirely, agent-authored handoffs wake it to observe (`no_action` is the trained stand-down). Squad-activity CLI call matches the documented form; sub-issue splits carry severity/priority and due dates.
- Setup runbook: notes the agent Description field is display-only, adds the per-agent thinking-level knob (raise for `wire`/`signal`/`index`), and documents skill import via URL/CLI with `--on-conflict` semantics.
- Operator guide: backlog / *Don't start yet* semantics, per-run handoff notes, the comment-edit mention footgun, direct chat for issue-less questions, how to read `in_review`, and hygiene pointed at the autopilots.
- Skills README: install path updated to *Import from URL* / CLI import, plus the workspace-vs-repo-skills trade-off, stated.
- README: squad-behavior notes expanded to three (squad mention, human vs agent explicit mentions, edit-no-trigger); tuning knobs gained autopilot cadence and the Usage view.

### Fixed
- Anthropic public PDF skill name: `pdf-reading` → `pdf` (the old name doesn't exist in `anthropics/skills`; import would have failed).
- Acceptance test T3's fix pointer now names the shared protocol's actual section, *Code ships as PRs*.
- **Prompt audit, all ten agents:** trigger's and signal's examples now use real mention markdown instead of the plain-text form the pocket card forbids; index's example attributes its Sentry numbers to @signal instead of claiming direct verification; wire returns @index's signature phrase; doku's "triggered on feature merges" now names the real mechanism (@merge's handoff mention).
- **Publish execution resolved strictly** (was contradictory between gate 8 and jinx): the Operator presses the button; @jinx posts only on explicit delegation ("Approved: you post it") — constitution §6.8, jinx's hard limits, the pocket card, and `launch-checklist` now agree.
- Incident assembly named as the split check's deliberate exception (constitution §5 + trigger.md); split-procedure sub-issue metadata synced into `triage-protocol`; signal's data-integrity initiative sharpened to in-code fixes only; merge told a PR waiting on the Operator's required review is the system working, not a stall; Notion marked optional across configs (least privilege).
