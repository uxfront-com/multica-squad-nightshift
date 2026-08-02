# Changelog

All notable changes to the NIGHTSHIFT pack are documented here. The pack versions like code because it is code — instructions included.
Format: Keep a Changelog.

## [Unreleased]

### Added
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
