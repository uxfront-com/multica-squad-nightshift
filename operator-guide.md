# Operator Guide — driving NIGHTSHIFT

One page for the human in the loop. Everything here is the short form of rules the agents already follow.

## Getting work in

- **Default:** assign the issue to **NIGHTSHIFT** → @trigger triages, splits if multi-craft, routes, and coordinates every hop until it reports the deliverable back to you. Use the issue templates — the fields are exactly what triage and QA consume.
- **Scope clear, one specialist enough?** Assign the issue **directly to that agent** — it becomes the official assignee and owns the status end to end. (Per the Multica docs, squads are for when the owner can't be determined up front.)
- **Just a look:** @-mention an agent in a comment — no assignee change, no status change. @-mention the squad instead when you want @trigger to pick who looks ("NIGHTSHIFT — who should own this?").
- **Splits come back to the squad:** when @trigger breaks work down, the sub-issues are created in Todo and assigned to NIGHTSHIFT, not to individuals — each piece gets its own triage and its owner named in the routing comment. Your `done` on a sub-issue re-triggers @trigger on the parent. Don't reassign a sub-issue to a member unless you mean to take it out of the squad's coordination.
- **Reassigning cancels in-flight runs** — every active task on the issue, the leader's included — and enqueues the new assignee. Archiving the squad is irreversible and hands its issues and automations to @trigger; create a new squad instead.
- **Park without starting:** assigning while the issue sits in `backlog` (or choosing *Don't start yet*) settles ownership without a run — work begins when it leaves backlog or you ask in a comment. The assignment dialog's **handoff note is per-run scope**; durable requirements belong in the issue itself.
- **Mentions fire only when posted:** editing an @ into an existing comment triggers nobody — post a new comment. And throwaway questions don't need an issue at all: chat with the agent directly.
- **Find your unknowns first:** for fuzzy territory, ask for a **blind-spot pass** — your unknown unknowns, named and ranked (`@void` for technical territory, `@wire` for product) — hand agents **references instead of descriptions** (code, a mock, the exact competitor flow you mean), and request cheap **prototypes** when you'll only know it when you see it.
- Give **outcomes and constraints**, not implementations: "EU users can export ≤50k rows as CSV by Friday" beats a task list. Paste evidence (logs, links, request IDs) — receipts in, receipts out.
- Agents ask at most 2 questions, then proceed on **labeled assumptions** — correct assumptions early; they're cheapest before code exists.

## Reading reports

`✅ Done` · `🔶 Blocked` · `🔷 Needs decision` · `❌ Failed`, then What/Why/Proof/Next.

- Answer **🔷** first — those threads are waiting on you by design.
- **On squad work the delivery report comes from @trigger:** it moves the parent to `in_review` and @-mentions you — conclusion, PR link(s), what needs your judgment. Members' reports along the way are addressed to @trigger; they aren't waiting on you unless flagged 🔷.
- **🔶 that names a missing capability** (can't push, can't open PR, no issue tool) is a tooling fix, not a prompt fix — see `repo-scaffold/README.md`.
- Code work's Proof is a **PR link**. No link, not done — say so.
- **You merge.** Agents open PRs; @merge posts a readiness verdict (`✅ Ready to merge` / `❌ Not ready` + why); the merge button is yours, always. An agent merging a PR — or enabling auto-merge — is a drift to fix immediately.
- **`in_review` on the board is an agent claiming delivery** — verify the Proof, then *you* flip `done`. Agents never do; a board where `done` only ever comes from you is the point.

## The approval grammar (what your words do)

Agents never publish, destroy, spend, or touch prod on vibes. Authorization is **explicit and names the action**:

> "Approved: publish the tweet." · "Go ahead: delete branches X and Y." · "Ship v2.14.3."

"Looks good", 👍, and enthusiasm advance a draft; they do **not** authorize it. This is deliberate — it keeps the one screenshot-able mistake impossible. Expect agents to ask again if your approval is ambiguous.

## Your name, their hands

- **Commits land authored as you** — the runtime's git identity (setup step 1). The `agent/<handle>/…` branch and the PR record who actually did the work.
- **Agents never speak on GitHub.** A PR description is their last word there — no comments, reviews, or replies. Reviewer questions on GitHub arrive back in the workspace thread as drafts; you post, or tell them to revise.
- **Comments are telegrams by law** (default ≤150 words; only relevant information; detail lives in the artifact). An agent that rambles or repeats a teammate is drifting — fix per *When behavior drifts*.

## Decisions

Bring-a-decision is the house style: expect stack-ranked options with trade-offs, not open questions. You can decide **against** the recommendation freely — it gets recorded (ADR) with your reasoning, respectfully, and then everyone commits. Disagreements live in the archive, not in the threads.

## Architecture calls

Architecture has a deliberate division of labor: **@void designs, you decide, @index records.**

- Route system-design questions and "this keeps getting harder to change" pain to @void — expect a structured plan: options, trade-offs, a recommendation, and phasing with cut lines.
- **Two-way doors** get decided and noted without ceremony; **one-way doors** stop at your desk with the options laid out.
- Once you call it, @index files the RFC (before a large build) or the ADR (after the decision) — including calls made against the recommendation, with your reasoning and a revisit trigger.
- Engineers escalating structural pain (@valve's "small fix touches five places", @palette's abstraction smells) through @void is the system working, not friction.

## When behavior drifts

1. Fix the file (agent file / `_shared-protocol.md` / `_team-instructions.md` / squad Instructions / autopilot runbooks in `autopilots.md`) — the files are the source of truth, in git.
2. Re-paste into Multica; refresh `CLAUDE.md` in the repo if the constitution changed.
3. Rerun the matching test in `acceptance-tests.md`.
Same failure across two agents ⇒ fix the shared layer once, not the agents twice. And per Anthropic's guidance for this model class: prefer one crisp principle or a mechanical guardrail (`repo-scaffold/`) over stacking reminders — then run `/doctor` in Claude Code occasionally to right-size `CLAUDE.md` and the skills.

## Ten-minute weekly hygiene (mostly on autopilot)

The sweeps and reports below ship as automations — wire `autopilots.md` once and this section becomes reading their issues. Manual versions, for while you haven't:

- `@trigger — sweep: anything silent >7 days gets close/park/escalate.` *(autopilot #1)*
- `@merge — flake + pipeline report: quarantine list, p50/p95, anything past the 30-day fix-or-delete line.` *(autopilot #2)*
- Skim `docs/adrs/README.md` — did last week's decisions get filed? *(autopilot #4 files the gaps)*
- Glance at runtime spend/queue depth (the Usage view); tune concurrency before it tunes you. *(stays yours — billing judgment doesn't delegate)*

## Escalations you should expect (they're features)

Three-turn impasses, two-failed-attempt blockers, P0/P1 confirmations, scope collisions with a stack-rank attached, structural-problem flags from @void, and gate-skip requests said out loud ("skipping full suite for the hotfix — here's what that covers"). An escalation with a recommendation is the system working; silence is the only bad signal.
