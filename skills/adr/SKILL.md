---
name: adr
description: File Architecture Decision Records - what qualifies, the template with good-and-bad consequences, immutability and superseding rules, revisit triggers, and the filing SLA. Use whenever a consequential decision is made anywhere (in a thread, a meeting, an RFC, or by the Operator overriding advice), whenever someone asks "why is it built this way" or "didn't we decide this already", and whenever a past decision is being reopened or reversed.
---

# ADR

An ADR records a decision **that was actually made**, by whom, in what context, with what expected consequences — so the crew never pays for the same lesson twice. Decisions without records burn twice: once when made blind, again when re-made blind.

## What gets an ADR (any one qualifies)

- Hard or expensive to reverse (Class 2–3 from the rfc skill)
- Shapes future work: others will build on the assumption
- Was genuinely contested — the losing option was real
- **Decisions NOT to do something** ("we evaluated Elasticsearch and stayed on Postgres FTS") — these prevent the most expensive re-litigations
- Operator overrides of a recommendation — recorded with the same respect as any other decision

Not ADR material: implementation details inside one owner's lane, reversible defaults, taste. When in doubt, a three-line ADR costs nothing and the missing one costs a sprint.

## Template (`/docs/adrs/NNN-slug.md`, sequential, never reused)

```markdown
# ADR-019: Webhooks over queue for v1 export delivery
Date: 2026-07-14 · Status: Accepted
Deciders: Operator · Informed by: RFC-0041
Supersedes: — · Superseded by: —

## Context
What was true when we decided: constraints, volumes, deadlines, the options
that were live. Enough that a stranger in a year understands why this was
reasonable — context is the section future-you will thank you for.

## Decision
One sentence, active voice: "We will deliver v1 exports via signed webhooks."

## Consequences
Good: ships this week; zero new infrastructure; simplest pilot integration.
Bad: at-most-once delivery; no replay; consumers must handle gaps.   ← REQUIRED
Neutral: delivery metrics added to the export dashboard.

## Revisit triggers  ← written NOW, while judgment is cold
- >3 delivery-failure tickets/month, or
- >10 webhook consumers, or
- any customer requiring guaranteed delivery contractually
```

**The "Bad" line is mandatory.** An ADR with only upside is a press release. Recording the accepted costs is what makes the record trustworthy — and what makes the revisit triggers meaningful rather than face-saving.

## Immutability & superseding

- ADRs are **append-only history**. Never edit an ADR's substance to match new reality — that converts the archive into retroactive fiction. Typos and link fixes: fine.
- Changed your mind? New ADR, `Supersedes: ADR-019`; the old one gets `Superseded by: ADR-031` and its Status flips. The chain **is** the organizational memory: what we believed, when, and what changed it.
- Statuses: `Proposed` (rare — usually the RFC covers this phase) → `Accepted` → `Superseded` | `Deprecated` (no longer applies, nothing replaced it).

## Filing discipline

- **SLA: within one day of the decision.** The record may trail the decision by a day, never a week — memory of *why* decays fastest right after the relief of deciding.
- File unprompted whenever you watch a real decision happen in a thread — that's the job, not an interruption. Never block the work waiting for the paperwork; trail it.
- Decisions made **against** a recommendation get first-class treatment: record the decider's actual reasoning fairly ("pilot-customer integration simplicity outweighs delivery guarantees at current volume"), not a resentful paraphrase. The archive serves the crew, not the recommender's ego.

## Findability (an archive nobody searches is a diary)

- `/docs/adrs/README.md` index: number · title · date · status · tags — regenerate on merge.
- Cross-link everything: the RFC that argued it, the issue that triggered it, the PR that implemented it link to the ADR; the ADR links back.
- When answering "why is it like this", answer **with the ADR link**, then summarize — teaching the link habit is how the archive stays alive.
- "Didn't we decide this already?" → the answer is a number or a gap. If it's a gap, the current discussion produces the missing ADR.
