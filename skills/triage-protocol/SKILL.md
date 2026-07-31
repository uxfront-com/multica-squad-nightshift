---
name: triage-protocol
description: Triage incoming issues with incident-command discipline - severity classification (P0-P3), single-owner routing, splitting oversized work, and a clean escalation ladder. Use whenever a new issue arrives, whenever someone says "urgent", "broken", "can someone look at this", or "everything is on fire", whenever severity or priority is disputed, and whenever an issue has sat ownerless or stalled. Also use before routing any squad-assigned issue.
---

# Triage Protocol

Severity is **impact** (how bad, for whom, right now). Priority is **order** (what we work on first). Never conflate them: a P2 severity can be priority #1 this week; a P1 can wait an hour behind a P0.

## Severity ladder

| Sev | Definition | Examples | Response clock | Who moves |
|---|---|---|---|---|
| **P0** | Users bleeding *now*: outage, data loss/corruption, security breach, revenue path down | checkout 500s, auth down, PII leak | Immediate. Drop everything. | Ops freeze + owning engineer + QA blast-radius; Operator notified |
| **P1** | Critical path degraded or a hard external deadline at risk; workaround painful or partial | search 10x slow, partner integration broken, launch blocker | Same day start | One owner + Operator confirms the call |
| **P2** | Important, not urgent: real user pain with a workaround, quality debt with a clock | export fails for 2% of accounts, flaky signup email | Scheduled into current/next cycle | One owner, honest date |
| **P3** | Backlog: nice-to-have, cosmetic, speculative | copy tweak, minor polish | Unscheduled (say so honestly) | Parked with a reason |

**P0 discipline:** a P0 declaration must state *who is impacted and how, right now* (e.g. "all EU users cannot pay since 14:02"). If that sentence can't be written, it is not a P0. Everything-is-P0 queues are nothing-is-P0 queues.

## The triage template

Post this as the first comment on every triaged issue:

```
Severity: P1 — [who is impacted, how, since when]
Owner: @agent (one name, never two)
Outcome: [the observable end state, not the task list]
Timebox: [date/time, or "unscheduled" — honesty over optimism]
Assumptions: [only if routing on incomplete info]
```

State the **outcome**, not the task: "EU checkout green" beats "investigate the tax service". The owner picks the tasks.

## Vague issues: the two-question rule

A vague issue is not routable. Ask the reporter **at most two** clarifying questions, then route anyway with a provisional severity and explicit assumptions. Never let an issue idle waiting for perfect information — provisional-and-labeled beats stalled.

Good questions narrow scope fast: "Slow *where* — page load, search, or checkout?" · "Since *when* — after Tuesday's release, or always?" · "How many users / which accounts?"

## Splitting rules

- **One owner per outcome — and the triager does the splitting.** If an issue genuinely needs three crafts (design + frontend + backend), it is three linked sub-issues plus a parent tracking issue. Splitting is an action taken with issue tools *during triage, before any routing*: create each sub-issue (title = the outcome; body = parent link, relevant criteria, intended owner), post the split map on the parent, then route each separately. Never ask the future owners to split their own work; never route a multi-craft issue whole. The tell: an Outcome line needing an "and", or a triage comment naming two owners, is a split that hasn't happened yet. No issue-creation tool available? Post the exact sub-issue titles + bodies in one comment for the Operator to create — the parent stays unrouted meanwhile.
- Sequence splits by dependency: contract/design sub-issues first, build second, verification last.
- A "split" that produces sub-issues nobody can start independently was a task list, not a split — re-cut along deliverable seams.
- Bugs are never split from their repro: reproduction routes first (QA), the fix routes second (owning engineer), as two hops on one issue.

## Escalation ladder

Escalate **up**, never sideways-forever:

1. **Agent stuck** (two failed attempts on the same wall) → escalate to triage with the attempt log.
2. **Two issues claim the same hands/week** → name the collision, state the cost of pretending otherwise, present a stack-rank, ask the Operator for one decision.
3. **P0/P1 declarations and demotions** → Operator confirms. P2/P3 reprioritization is free with a one-line rationale.
4. **Cross-craft disputes** → architecture goes to an RFC (research owner); product scope goes to the PM; neither is settled by whoever argues longest.
5. **Three-bounce rule:** an issue that bounces between owners three times without measurable progress stops moving — summarize the impasse and escalate.

When escalating, always bring a stack-ranked recommendation with trade-offs. An open-ended "what do you want to do?" is not an escalation, it's a delegation upward.

## Queue hygiene

- **WIP limit:** each agent holds at most 2 active issues; more means something is actually queued — reflect that in statuses instead of pretending parallelism.
- **Zombie policy:** any issue silent for 7 days gets one of exactly three moves: close (with reason), park (P3 + reason), or escalate. Silence is not a state.
- **Re-triage triggers:** new evidence (data lands, repro found, scope changes) → severity and timebox get re-stated in a fresh comment, not silently edited.
- Titles stay accurate to current understanding — retitle as diagnosis sharpens ("App slow" → "Search p95 regression after v2.14 index change").

## Anti-patterns

- Assigning two owners "so it goes faster" (it goes slower; nobody owns the gap).
- Routing by who answered last instead of by craft.
- Severity inflation to jump the queue — call it out, re-classify, explain.
- Triaging into a black hole: every triage comment names a clock, even if the clock is "unscheduled".
