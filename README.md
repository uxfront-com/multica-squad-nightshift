# NIGHTSHIFT — an AI agent squad for Multica

Eleven AI specialists. One Operator (you). Each agent is a master of one trade — its job is its personality — and together they plan, build, verify, ship, document, and announce software under your supervision.

This pack contains everything needed to stand the squad up in [Multica](https://multica.ai): one file per agent (description + full system instructions), a shared protocol appended to every agent, a team constitution (`agents/_team-instructions.md`) for the repo root, the single-squad configuration with @trigger's routing instructions, and a skills/MCP plan with all 26 custom skills included. Also in the box: `repo-scaffold/` (PR/issue templates, PR-title lint, review routing, the docs tree — so the environment *enforces* what the instructions request), `autopilots.md` (six paste-ready automations that put the squad's recurring hygiene on rails), `operator-guide.md` (the one-page manual for you), and `acceptance-tests.md` (eleven scripted issues that smoke-test squad behavior after any change).

**Version 2.** The theme and per-agent personas of v1 are gone: agents have no backstory, no voice quirks, no flavor — the job is the personality, and every artifact and comment is plain professional work. Each agent file now lists the concrete skills that make it a master of its craft. Three agents were renamed (Canvas → Sigma, Doku → Quill, Signal → Valve), **Void** (software architect) joined the squad, and Gravity was retired — its architecture duties live with Void, inside the squad. Details in `CHANGELOG.md`.

---

## The squad at a glance

| Handle | Name | Role | In one line |
|---|---|---|---|
| `@trigger` | Trigger | Direction & triage (squad leader) | One owner, one outcome, one clock. |
| `@wire` | Wire | Product | Problems before solutions; specs the squad never has to guess at. |
| `@sigma` | Sigma | Design engineer | The design system, tokenized and in Storybook; accessibility built in. |
| `@palette` | Palette | Frontend engineer | Every state designed, fast on cheap hardware, zero layout shift. |
| `@valve` | Valve | Backend engineer | Graceful degradation, honest data models, boring migrations. |
| `@merge` | Merge | Pipeline keeper | `main` green, CI fast and trusted, PRs merge-ready — the Operator merges. |
| `@filter` | Filter | Quality assurance engineer | Deterministic repro before any fix; a regression guard on every bug. |
| `@void` | Void | Software architect | Clear structured plans; pragmatic decisions; no reinvented wheels. |
| `@index` | Index | RFCs & ADRs | RFC before large changes, ADR after decisions, as few words as possible. |
| `@quill` | Quill | Technical writer | Diátaxis-structured docs with examples verified against the code. |
| `@jinx` | Jinx | Marketing | Every claim linked, one CTA per asset, channel-native writing. |

---

## Squad architecture

One squad, one leader, and the flow Multica documents for squads ([docs/squads](https://multica.ai/docs/squads)): assign an issue to **NIGHTSHIFT** and Multica enqueues only the leader — **@trigger** — which reads it, moves the parent to `in_progress`, posts one terse delegation comment @-mentioning the best member with the roster's mention markdown, records its evaluation (`multica squad activity`), and stops. The mentioned member does its part and **reports back without mentioning anyone**; that report re-triggers @trigger, which routes the next hop, escalates, moves the parent to `in_review` once the whole outcome is met, or stands down (`no_action`). At the end @trigger posts the delivery report and @-mentions you for sign-off; `done` is yours. Multica's built-in Squad Operating Protocol enforces the leader half of this loop — the routing map below rides on top of it. Everyone else is a member; members never route each other, and nobody else carries leader duties.

```
NIGHTSHIFT  (the whole squad)   leader: @trigger
    members: @wire · @sigma · @palette · @valve · @merge
             @filter · @void · @index · @quill · @jinx
             + you, as a human member (so trigger can @-mention you)
    Multi-craft or unclear owner → assign here. Trigger triages everything.
```

**Three ways to put work in, per the docs:**
- **Assign to NIGHTSHIFT** when the work needs several crafts or the owner isn't obvious — the default for anything non-trivial. Splits come back here too: @trigger creates sub-issues in Todo, assigned to the squad (never to a member), so each piece gets its own triage.
- **Assign directly to an agent** when the scope is clear and one specialist can finish it alone — that agent becomes the official assignee and owns the status.
- **@-mention** an agent (or the squad) in a comment for a look, a question, or a one-off sub-task — no assignee change, no status change.

Re-trigger rules worth knowing: a *human's* explicit @-mention of a specific member routes past the leader (the @ is the routing signal); a member's plain report wakes the leader — that's the hand-off; an agent that @-mentions another agent also wakes the leader, which is why members don't do it. Mentions only fire when posted — editing an @ into an existing comment triggers nobody. Squads add routing, not capacity: concurrency stays per agent.

### Squad Instructions (paste into NIGHTSHIFT's *Instructions* field)

@trigger sees these on every squad-triggered run, alongside Multica's built-in Squad Operating Protocol and the roster.

```
Routing map: product framing/specs → @wire · design system/UX/components →
@sigma · frontend → @palette · backend/data/APIs → @valve · architecture/
system design → @void · PR/CI/release → @merge · bugs/repro/verification/
review → @filter · RFC/ADR records → @index · docs/changelog → @quill ·
marketing/comms → @jinx.
Members report back without mentioning anyone; you route every hop, and
you post the delivery report to the Operator when the outcome is met.
Sequencing rules: one owner per outcome — multi-craft issues are split BY
YOU before any routing: create one sub-issue per outcome in Todo, assign
each to the NIGHTSHIFT squad (never to an individual member), and triage
each with its single owner named; never route a multi-craft issue whole. Bugs route
to @filter for repro BEFORE any engineer. Build work without acceptance
criteria routes to @wire first (definition-of-ready). New user-facing
surfaces go design-first: @sigma before @palette. Architecturally
significant changes go to @void before anyone builds; @index files the
RFC. Releases route to @merge and never proceed without a stated rollback
path. External content routes to @jinx as DRAFT — only the Operator
approves publishing. When a consequential decision happens in a thread,
nudge @index to file the ADR.
Anything ambiguous: ask the Operator at most 2 questions, then route with
stated assumptions. Escalate P0/P1 severity calls to the Operator.
```

---

## Setup runbook

Prereqs: a running Multica workspace, the daemon connected, and at least one supported AI coding tool installed (Claude Code is the recommended runtime for all eleven agents).

**1. Create the eleven agents** (Agents → + New, or `multica agent create`):
- **Name:** the handle without `@` (e.g. `trigger`) — must be unique in the workspace.
- **Description:** the blurb at the top of each agent file. Display-only — it never enters the execution prompt; routing runs on the squad role blurbs and Instructions (step 4), so write it for the humans on the board.
- **Runtime:** Claude Code. **Model:** see each agent file's suggestion (deep-reasoning tier (**Opus 5**) for `wire`, `valve`, `void`; fast/default for the rest — tune to your plan and budget). **Thinking level:** Multica exposes it per agent — raise it for the deep-reasoning trio (highest for `void`), keep default elsewhere.
- **System instructions:** paste the agent file's *System instructions* section, then append the full contents of `agents/_shared-protocol.md`.
- **Access:** *Entire workspace* — new agents default to *Only me*, which would leave them assignable by their owner alone. **Concurrency:** per the agent file (note `merge` runs deliberately low at 2–3 so release operations serialize, and `void` at 2 because design work serializes better than it parallelizes).
- **Env/creds:** per Multica's own guidance, give agents dedicated limited-scope credentials only (read-only keys, single-scope PATs) — never production-grade secrets.
- **Git identity:** on each runtime, set git's author identity to *yours* before first run — `git config --global user.name "<your name>" && git config --global user.email "<your GitHub email>"`. Commits are authored as the Operator (constitution §11); the credential only authenticates the push, and the `agent/<handle>/…` branch records who did the work.

**2. Attach skills** (per the matrix below). Import Anthropic's public skills from the `anthropics/skills` repo and the custom ones from this pack via *Skills → New skill → Import from URL* — or `multica skill import --url <url>` (re-imports take `--on-conflict overwrite|rename|skip`; overwrite preserves bindings and is creator-only). The custom ones ship under `skills/` — push them with this repo and import the same way (each skill is a folder with a `SKILL.md`). Bindings are per-agent and toggle on/off without deleting the skill.

**3. Connect MCP servers** per agent (matrix below). Least privilege throughout — `filter` gets read-only DB access, `valve` write access only if migrations are truly in scope, `void` reads everything and writes nothing outside the repo.

**4. Create the squad** (Squads → New squad):
```
multica squad create --name "NIGHTSHIFT" --leader trigger
```
Add the other ten agents as members with role blurbs (@trigger reads these when routing), e.g.:
```
multica squad member add <NIGHTSHIFT-id> --member-id <palette-uuid> --type agent \
  --role "UI implementation, a11y, web vitals"
```
Then add **yourself** as a human member with a role blurb ("Operator — final sign-off: decisions, approvals, merges") so the roster gives @trigger your mention markdown for delivery reports and escalations. Paste the **Instructions** block from the section above (or `multica squad update <NIGHTSHIFT-id> --instructions "..."`) — Multica shows it to the leader only; role blurbs are context for the leader too, and grant no permissions. Access matters here: a member can assign or @-mention the squad only if they can run its leader, so `trigger` must stay on *Entire workspace*.

**5. Install the team constitution.** Copy `agents/_team-instructions.md` into the target repo's root as `CLAUDE.md` (every agent runs Claude Code, which reads it on every run; `AGENTS.md` works too). It is the system instructions for the team as a whole — roster, lanes, decision rights, sequencing gates, workflows, and the law. Fill in its §0 with this repo's specifics (what it is, how to build and test, the top gotchas) plus the two mention handles — the squad's and yours, copied from the @-picker — since members never receive a roster. The law is org-wide; §0 is the per-repo part. If your Multica version exposes a workspace-level instructions field, paste it there as well. While you're in the repo, copy the contents of `repo-scaffold/` into place and apply its branch-protection checklist — mechanical guardrails beat prompted ones.

**6. Wire the autopilots.** `autopilots.md` holds six paste-ready automations — zombie sweep, pipeline health, docs rot hunt, ADR backfill, janitor sweep, and a CI red-alert webhook. Create them under *Autopilot → New*; they file normal issues, so everything they start obeys the same rules as everything else.

**7. Smoke-test the wiring.** Run `acceptance-tests.md` — eleven throwaway issues covering triage, splitting, PR discipline, bug-flow order, the draft/approval gate, safety rails, recommend-vs-decide, status honesty, the architecture design/record split, STE-compliant answers, and the merge button staying yours. Each test names the file to fix if it fails. Fix anything that reads wrong *in the agent's file* and re-paste — the files are the source of truth; keep them in your repo.

---

## Skills & MCP matrix

**Skills** (`✦` = Anthropic public skill to import; others are custom — see below):

| Agent | Skills |
|---|---|
| trigger | triage-protocol, prioritization-rubric, asd-ste100 |
| wire | prd, prioritization-rubric, xlsx ✦, pptx ✦, asd-ste100 |
| sigma | frontend-design ✦, design-tokens, component-standards, a11y-audit, critique-protocol, asd-ste100 |
| palette | frontend-design ✦, component-standards, a11y-audit, karpathy-guidelines, asd-ste100 |
| valve | api-design, db-migrations, observability, karpathy-guidelines, asd-ste100 |
| merge | conventional-commits, release-runbook, ci-doctor, review-checklist, karpathy-guidelines, asd-ste100 |
| filter | bug-repro, e2e-playwright, review-checklist, karpathy-guidelines, asd-ste100 |
| void | api-design, db-migrations, observability, review-checklist, lit-review, karpathy-guidelines, asd-ste100 |
| index | rfc, adr, pdf ✦, asd-ste100 |
| quill | docs-style, changelog, docx ✦, asd-ste100 |
| jinx | brand-voice, launch-checklist, seo-basics, pptx ✦, asd-ste100 |

*`asd-ste100` is the one all-agents skill: every answer the squad writes follows ASD-STE100 Simplified Technical English (constitution §8).*

**MCP servers:**

| Agent | MCP |
|---|---|
| trigger | GitHub · Slack (optional) |
| wire | GitHub · analytics (PostHog/Amplitude) · web search (Exa) · Notion (optional) |
| sigma | Figma · GitHub · Playwright/browser · Context7 |
| palette | GitHub · Figma · Playwright/browser · Context7 |
| valve | GitHub · Postgres (least-privilege) · Sentry · Context7 |
| merge | GitHub (incl. Actions) · Sentry |
| filter | GitHub · Playwright/browser · Sentry · Postgres (read-only) |
| void | GitHub · web search (Exa) · Sentry (read) · Postgres (read-only) · Context7 |
| index | GitHub · Notion (optional) |
| quill | GitHub · Notion (optional) · Context7 |
| jinx | web search (Exa) · GitHub · analytics · browser |

*Notion is optional wherever it appears — attach it only if part of your knowledge genuinely lives there. The repo is the artifact home, and an unused connection is just surface area.*

### Custom skills (included in `skills/`)

All 26 are written and included in this pack — each a folder holding a `SKILL.md` (frontmatter name + trigger-happy description, dense body) plus bundled resources where useful (`a11y-audit` ships an axe-core scan script). The `rfc / adr` row below is two separate skills. See `skills/README.md` for the index; install by pushing `skills/` to a repo and importing via Multica's *import from GitHub*.

| Skill | Owner(s) | What goes in it |
|---|---|---|
| `asd-ste100` | all agents | ASD-STE100 Simplified Technical English for answers: approved words, the 20/25-word sentence limits, command-form instructions, the software technical-name mapping. |
| `triage-protocol` | trigger | Severity/priority definitions, the triage template, splitting rules, escalation ladder. |
| `prioritization-rubric` | trigger, wire | RICE/ICE scoring sheet + worked examples, tie-break rules. |
| `prd` | wire | The PRD skeleton (problem → non-goals → thin slice → kill criteria) + 2 filled examples. |
| `component-standards` | sigma, palette | Component checklist: states, props limits, tokens, stories, test expectations. |
| `a11y-audit` | sigma, palette | WCAG 2.2 AA checklist, contrast/target/focus specifics, audit script. |
| `api-design` | valve, void | Contract template, error-code taxonomy, idempotency + pagination + versioning rules. |
| `db-migrations` | valve, void | Expand→migrate→contract playbook, rollback testing steps, lock-safety checklist. |
| `observability` | valve, void | Log/trace/metric conventions, RED dashboards, what every PR must instrument. |
| `conventional-commits` | merge | Commit grammar, SemVer mapping, changelog generation config. |
| `release-runbook` | merge | The full cut→deploy→smoke→watch→all-clear/revert checklist, freeze rules. |
| `ci-doctor` | merge | The four failure bins, flake thresholds/quarantine procedure, pipeline p50 budget. |
| `review-checklist` | merge, filter, void | Correctness/edges/errors/tests lens; blocking-vs-nit etiquette. |
| `karpathy-guidelines` | palette, valve, filter, merge, void | LLM-coding pitfalls distilled: assumptions surfaced, simplicity, surgical diffs, verifiable goals. |
| `bug-repro` | filter | The intake template, environment matrix, minimal-repro reduction steps. |
| `e2e-playwright` | filter | Selector strategy, no-sleep patterns, retry-aware assertions, quarantine flow. |
| `rfc` / `adr` | index | Both templates, reversibility classes, superseding rules, filing locations. |
| `lit-review` | void | Source-quality ladder, confidence labels, synthesis format — prior art before invention. |
| `docs-style` | quill | Diátaxis mode guide, plain-language rules, example-testing requirement. |
| `changelog` | quill | Keep-a-Changelog conventions + "human consequence" translation examples. |
| `design-tokens` | sigma | Token taxonomy, naming, Figma↔code sync rules. |
| `critique-protocol` | sigma | Evidence-vs-taste labeling, heuristics list, critique etiquette. |
| `brand-voice` | jinx | Voice attributes, banned corporate-mush list, per-channel dialect notes. |
| `launch-checklist` | jinx | Asset matrix, claim-verification steps, link tests, approval gate. |
| `seo-basics` | jinx | Search-intent matching, structure-for-scanners, what never to keyword-stuff. |

---

## Standard workflows

**Feature** — Operator files idea → NIGHTSHIFT → @trigger routes to @wire → problem framing + acceptance criteria → @sigma design options + system components → @palette + @valve build (contract-first) → @filter verifies against acceptance criteria → @merge certifies green + merge-ready → Operator merges → @quill docs + changelog → @jinx drafts announcement → Operator approves publish.

**Bug** — anyone files → @filter deterministic repro first (no repro, no fix) → failing test attached → owning engineer fixes → @filter verifies on the original case, regression guard lands → @merge certifies merge-ready → Operator merges.

**Architecture** — need or structural problem → @void analyzes and delivers a structured plan (options, trade-offs, recommendation) → Operator decides → @index files the RFC before a large build and the ADR once decided → build proceeds per plan under the normal gates.

**Incident** — @trigger declares severity and assembles: @merge (freeze + revert path), @valve (diagnosis), @filter (repro + blast radius). Stabilize → root-cause → blameless write-up → @index files the ADR if a decision changed.

**Release** — @merge runs the runbook (rollback pre-staged) → @quill translates commits into a human changelog → @jinx drafts comms → Operator sign-off gates anything public.

The arrows show the order of crafts, not who presses send: on squad-assigned work every arrow is a member's report followed by @trigger's routing — never a member-to-member mention.

---

## House rules (the short version)

The full text lives in `agents/_team-instructions.md` — the team constitution (`agents/_shared-protocol.md` is its per-agent excerpt); the spirit in five lines:

1. **Read the whole thread, then act, then report with receipts, then stop.** On squad work the report is the hand-off — @trigger routes every hop; members never route each other.
2. **Clean, concise, and in ASD-STE100 Simplified Technical English** — only relevant information, and never repeating what another agent already said unless the Operator needs it.
3. **Truth protocol:** verified / inferred / assumed — labeled. Nobody fabricates. "Unknown + how I'd find out" is a first-class answer.
4. **Operator sign-off** for anything destructive, irreversible, secret-touching, money-spending, or externally published.
5. **Members never @-mention each other, three-turn escalation, one owner per outcome — every code change ships as a pull request, and the Operator merges it.**

---

## Context engineering — the layer map

This pack is structured to Anthropic's context-engineering guidance for Claude 5-generation models (July 2026): fewer rules, more judgment; one instruction, one home; depth via progressive disclosure; behavior encoded in interfaces rather than repeated in prompts.

- **Agent file** — role, principles, and the skills of a master of that craft. No personas: the job is the personality.
- **Shared protocol** — the pocket card: Multica mention mechanics plus the absolutes that must hold even without repo context (communication rules, safety rails, truth labels, code-ships-as-PRs).
- **`CLAUDE.md` (the constitution)** — the single home of the law: roster, decision rights, sequencing gates, workflows. The org's gotchas, never the obvious.
- **Skills** — the craft depth, loaded when the work calls for it; the trigger-rich descriptions are the loading interface.
- **`repo-scaffold/`** — behavior as interfaces: PR/issue templates, title lint, and branch protection enforce what prompts would otherwise repeat.
- **`acceptance-tests.md`** — the verification loop. When behavior drifts, prefer one crisp principle or a mechanical guardrail over stacking reminders, then re-run the matching test.

Maintenance: run `/doctor` in Claude Code periodically to right-size `CLAUDE.md` and the skills as models advance.

## Tuning knobs

- **Models & concurrency:** per-agent suggestions are starting points — watch your runtime dashboard for cost and queue depth, then tune. Multica's Usage view (error trends, failure types, agents needing attention) is the gauge cluster for this.
- **Autopilot cadence:** the recurring jobs in `autopilots.md` default to weekly — tune the crons there, and keep create-issue mode so the records stay on the board.
- **Growing the squad:** clone the file format (Role / Principles / Skills / How you work / Boundaries + shared protocol), add the newcomer to NIGHTSHIFT with a role blurb, and give them a line in the routing map in the squad Instructions — routing stays stable because you dispatch by topic, not by name.
- **Source of truth:** keep this folder in your repo. When an agent misbehaves, fix the file, re-paste into Multica, and note what changed — prompt drift is real and version control is the cure.
