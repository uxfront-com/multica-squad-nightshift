# Operator Guide — driving NIGHTSHIFT

One page for the human in the loop. Everything here is the short form of rules the agents already follow.

## Getting work in

- **Default:** assign the issue to **NIGHTSHIFT** → @trigger triages, splits if multi-craft, routes. Use the issue templates — the fields are exactly what triage and QA consume.
- **Fast lane:** @-mention an agent directly when you already know who you need; that routes past the leader on purpose.
- **Opinion without reassigning:** mention the squad in a comment ("NIGHTSHIFT — who should own this?").
- **Park without starting:** assigning while the issue sits in `backlog` (or choosing *Don't start yet*) settles ownership without a run — work begins when it leaves backlog or you ask in a comment. The assignment dialog's **handoff note is per-run scope**; durable requirements belong in the issue itself.
- **Mentions fire only when posted:** editing an @ into an existing comment triggers nobody — post a new comment. And throwaway questions don't need an issue at all: chat with the agent directly.
- **Find your unknowns first:** for fuzzy territory, ask for a **blind-spot pass** — your unknown unknowns, named and ranked (`@index` is the natural fit) — hand agents **references instead of descriptions** (code, a mock, the exact competitor flow you mean), and request cheap **prototypes** when you'll only know it when you see it.
- Give **outcomes and constraints**, not implementations: "EU users can export ≤50k rows as CSV by Friday" beats a task list. Paste evidence (logs, links, request IDs) — receipts in, receipts out.
- Agents ask at most 2 questions, then proceed on **labeled assumptions** — correct assumptions early; they're cheapest before code exists.

## Reading reports

`✅ Done` · `🔶 Blocked` · `🔷 Needs decision` · `❌ Failed`, then What/Why/Proof/Next.

- Answer **🔷** first — those threads are waiting on you by design.
- **🔶 that names a missing capability** (can't push, can't open PR, no issue tool) is a tooling fix, not a prompt fix — see `repo-scaffold/README.md`.
- Code work's Proof is a **PR link**. No link, not done — say so.
- **`in_review` on the board is an agent claiming delivery** — verify the Proof, then *you* flip `done`. Agents never do; a board where `done` only ever comes from you is the point.

## The approval grammar (what your words do)

Agents never publish, destroy, spend, or touch prod on vibes. Authorization is **explicit and names the action**:

> "Approved: publish the tweet." · "Go ahead: delete branches X and Y." · "Ship v2.14.3."

"Looks good", 👍, and enthusiasm advance a draft; they do **not** authorize it. This is deliberate — it keeps the one screenshot-able mistake impossible. Expect agents to ask again if your approval is ambiguous.

## Decisions

Bring-a-decision is the house style: expect stack-ranked options with trade-offs, not open questions. You can decide **against** the recommendation freely — it gets recorded (ADR) with your reasoning, respectfully, and then everyone commits. Disagreements live in the archive, not in the threads.

## When behavior drifts

1. Fix the file (agent file / `_shared-protocol.md` / `_team-instructions.md` / squad Instructions) — the files are the source of truth, in git.
2. Re-paste into Multica; refresh `CLAUDE.md` in the repo if the constitution changed.
3. Rerun the matching test in `acceptance-tests.md`.
Same failure across two agents ⇒ fix the shared layer once, not the agents twice. And per Anthropic's class-5 guidance: prefer one crisp principle or a mechanical guardrail (`repo-scaffold/`) over stacking reminders — then run `/doctor` in Claude Code occasionally to right-size `CLAUDE.md` and the skills.

## Ten-minute weekly hygiene (mostly on autopilot)

The sweeps and reports below ship as automations — wire `autopilots.md` once and this section becomes reading their issues. Manual versions, for while you haven't:

- `@trigger — sweep: anything silent >7 days gets close/park/escalate.` *(autopilot #1)*
- `@merge — flake + pipeline report: quarantine list, p50/p95, anything past the 30-day fix-or-delete line.` *(autopilot #2)*
- Skim `docs/adrs/README.md` — did last week's decisions get filed? *(autopilot #4 files the gaps)*
- Glance at runtime spend/queue depth (the Usage view); tune concurrency before it tunes you. *(stays yours — billing judgment doesn't delegate)*

## Escalations you should expect (they're features)

Three-bounce impasses, two-failed-attempt blockers, P0/P1 confirmations, scope collisions with a stack-rank attached, and gate-skip requests said out loud ("skipping full suite for the hotfix — here's what that covers"). An escalation with a recommendation is the system working; silence is the only bad signal.
