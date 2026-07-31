# NIGHTSHIFT — Custom Skills

Twenty-five `SKILL.md` knowledge packs, one folder each, written to Anthropic's skill format: YAML frontmatter (`name` + a deliberately trigger-happy `description` — all "when to use" lives there), a dense body well under 500 lines, and bundled resources where they earn their place (`a11y-audit/scripts/axe-scan.mjs`).

**Install into Multica:** keep this folder in a Git repo and use *import from GitHub* on each agent (Skills → Import), or paste bodies by hand. Attach per the matrix below (mirrors the main README).

| Skill | Attached to | In one line |
|---|---|---|
| `triage-protocol` | trigger | P0–P3 severity ladder, the triage template, splitting rules, escalation. |
| `prioritization-rubric` | trigger, wire | RICE with anchored scales, confidence caps, worked example, tie-breaks. |
| `prd` | wire | Problem-first spec skeleton with non-goals, guardrails, kill criteria. |
| `component-standards` | palette | The five states, props discipline, tokens-only, per-component a11y, DoD. |
| `a11y-audit` | palette, canvas | WCAG 2.2 AA reference, four manual passes, bundled axe-core scanner. |
| `design-tokens` | canvas | Three-tier token system, naming grammar, DTCG JSON, Figma↔code sync. |
| `api-design` | signal | Contract-first, RFC 9457 errors, idempotency keys, cursor pagination, versioning. |
| `db-migrations` | signal | Expand→migrate→contract, Postgres lock-safety, batched backfills, rollback honesty. |
| `observability` | signal | Structured logs, traces, RED/USE metrics, cardinality budget, symptom alerts. |
| `conventional-commits` | merge | Commit grammar, SemVer mapping, squash-merge reality, revert format. |
| `release-runbook` | merge | Preflight gates, deploy/smoke/watch, revert triggers, hotfix + freeze rules. |
| `ci-doctor` | merge | Four failure bins, flake quarantine policy, red-main protocol, speed budget. |
| `review-checklist` | merge, filter | Priority-ordered review lens, blocking/nit etiquette, size and time norms. |
| `karpathy-guidelines` | palette, signal, filter, merge | External import (MIT): Karpathy's LLM-coding pitfalls — think first, simplicity, surgical changes, goal-driven loops. |
| `bug-repro` | filter | Intake template, environment matrix, minimal-repro reduction, intermittents. |
| `e2e-playwright` | filter | Role-based selectors, zero sleeps, API seeding, trace-on-retry, quarantine flow. |
| `rfc` | index | Steelmanned options, reversibility classes, timeboxed review lifecycle. |
| `adr` | index | What qualifies, good-and-bad consequences, supersede chains, revisit triggers. |
| `lit-review` | index | Source-quality ladder, confidence labels, synthesis with dissenting evidence. |
| `docs-style` | doku | Diátaxis modes, plain language, structure for scanners, runnable examples. |
| `changelog` | doku | Keep a Changelog structure, commit→consequence translation, audience test. |
| `critique-protocol` | canvas | Evidence-vs-taste labels, heuristics bench, severity tied to user goals. |
| `brand-voice` | jinx | Four voice attributes, banned corpo-mush, claims-need-receipts, channel dialects. |
| `launch-checklist` | jinx | Launch tiers, verification gate, coordination order, approval gate, corrections. |
| `seo-basics` | jinx | Search intent, structure rules, the never-do list, E-E-A-T, honest measurement. |

Conventions to keep when editing or adding skills: frontmatter `name` matches the folder name exactly; the description carries every trigger condition (bodies assume the skill already fired); bodies stay dense — tables, templates, and thresholds over prose; numbers are defaults to tune, then obey. Per Anthropic's class-5 context guidance, this folder is deliberately where the depth lives: agent files point here instead of repeating it, and the trigger-rich descriptions are the progressive-disclosure interface.
