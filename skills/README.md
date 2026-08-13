# NIGHTSHIFT — Custom Skills

Twenty-six `SKILL.md` knowledge packs, one folder each, written to Anthropic's skill format: YAML frontmatter (`name` + a deliberately trigger-happy `description` — all "when to use" lives there), a dense body well under 500 lines, and bundled resources where they earn their place (`a11y-audit/scripts/axe-scan.mjs`).

**Install into Multica:** keep this folder in a Git repo and import each skill on the workspace Skills page (*New skill → Import from URL*), or via CLI: `multica skill import --url <url-to-skill-folder>` — re-imports take `--on-conflict overwrite|rename|skip` (overwrite keeps the skill's ID and agent bindings; creator-only). Then attach per the matrix below (mirrors the main README); bindings toggle per-agent without deleting the skill. Claude Code can also read repo-level skills straight from `.claude/skills/` in a target repo — that path loads every skill's trigger line for every agent, where this pack deliberately prefers workspace skills with per-agent attachment: each specialist carries only its own craft.

| Skill | Attached to | In one line |
|---|---|---|
| `asd-ste100` | **all eleven agents** | ASD-STE100 Simplified Technical English for answers: approved words, one meaning per word, 20/25-word sentence limits, command-form instructions. |
| `triage-protocol` | trigger | P0–P3 severity ladder, the triage template, splitting rules, escalation. |
| `prioritization-rubric` | trigger, wire | RICE with anchored scales, confidence caps, worked example, tie-breaks. |
| `prd` | wire | Problem-first spec skeleton with non-goals, guardrails, kill criteria. |
| `component-standards` | sigma, palette | The five states, props discipline, tokens-only, per-component a11y, DoD. |
| `a11y-audit` | sigma, palette | WCAG 2.2 AA reference, four manual passes, bundled axe-core scanner. |
| `design-tokens` | sigma | Three-tier token system, naming grammar, DTCG JSON, Figma↔code sync. |
| `api-design` | valve, void | Contract-first, RFC 9457 errors, idempotency keys, cursor pagination, versioning. |
| `db-migrations` | valve, void | Expand→migrate→contract, Postgres lock-safety, batched backfills, rollback honesty. |
| `observability` | valve, void | Structured logs, traces, RED/USE metrics, cardinality budget, symptom alerts. |
| `conventional-commits` | merge | Commit grammar, SemVer mapping, squash-merge reality, revert format. |
| `release-runbook` | merge | Preflight gates, deploy/smoke/watch, revert triggers, hotfix + freeze rules. |
| `ci-doctor` | merge | Four failure bins, flake quarantine policy, red-main protocol, speed budget. |
| `review-checklist` | merge, filter, void | Priority-ordered review lens, blocking/nit etiquette, size and time norms. |
| `karpathy-guidelines` | palette, valve, filter, merge, void | External import (MIT): Karpathy's LLM-coding pitfalls — think first, simplicity, surgical changes, goal-driven loops. |
| `bug-repro` | filter | Intake template, environment matrix, minimal-repro reduction, intermittents. |
| `e2e-playwright` | filter | Role-based selectors, zero sleeps, API seeding, trace-on-retry, quarantine flow. |
| `rfc` | index | Steelmanned options, reversibility classes, timeboxed review lifecycle. |
| `adr` | index | What qualifies, good-and-bad consequences, supersede chains, revisit triggers. |
| `lit-review` | void | Source-quality ladder, confidence labels, synthesis with dissenting evidence — prior art before invention. |
| `docs-style` | quill | Diátaxis modes, plain language, structure for scanners, runnable examples. |
| `changelog` | quill | Keep a Changelog structure, commit→consequence translation, audience test. |
| `critique-protocol` | sigma | Evidence-vs-taste labels, heuristics bench, severity tied to user goals. |
| `brand-voice` | jinx | Four voice attributes, banned corpo-mush, claims-need-receipts, channel dialects. |
| `launch-checklist` | jinx | Launch tiers, verification gate, coordination order, approval gate, corrections. |
| `seo-basics` | jinx | Search intent, structure rules, the never-do list, E-E-A-T, honest measurement. |

Conventions to keep when editing or adding skills: frontmatter `name` matches the folder name exactly; the description carries every trigger condition (bodies assume the skill already fired); bodies stay dense — tables, templates, and thresholds over prose; numbers are defaults to tune, then obey. This folder is deliberately where the depth lives: agent files list the crafts a master knows and point here for the full procedures, and the trigger-rich descriptions are the progressive-disclosure interface.
