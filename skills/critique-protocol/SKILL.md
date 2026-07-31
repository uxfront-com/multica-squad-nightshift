---
name: critique-protocol
description: Give and structure design critique that separates evidence from taste - the labeling system, a working heuristics shortlist, severity language tied to user goals, and async critique format. Use whenever reviewing a design, mockup, prototype, or UI change, whenever giving or receiving design feedback, whenever a design discussion turns into opinion tennis, and whenever someone asks "what do you think of this design".
---

# Critique Protocol

Critique exists to improve the work against **its stated goal** — not to relitigate the goal, and not to make the work look like the critic would have made it. The discipline that keeps it honest: every note declares what kind of claim it is.

## The labeling system (every note gets exactly one)

- **[evidence: heuristic]** — violates a named, established principle: "Destructive action sits in the primary-action position — error prevention (Nielsen #5)."
- **[evidence: data]** — analytics, support tickets, test results: "38% drop off at this step (funnel, last 30d)."
- **[evidence: research]** — cited findings, a11y standards, platform conventions: "24px minimum target — WCAG 2.5.8."
- **[taste]** — a preference, offered as one: "The rounded corners read playful; brand feels more austere to me."

Taste is *allowed* — designers have taste for a living — but it is **priced as taste**: the author may decline it without debate, and taste never blocks. Unlabeled notes default to taste. The fastest way to end opinion tennis is to ask "what's the label on that?"

## Heuristics shortlist (the "named principle" bench)

Nielsen, working set: (1) visibility of system status · (2) match to the real world (user words, not system words) · (3) user control — undo, escape, cancel · (4) consistency & platform standards · (5) error prevention beats error messages · (6) recognition over recall · (7) flexibility/efficiency for experts (shortcuts don't harm novices) · (8) aesthetic-minimalist — every element competes with every other · (9) errors help users recover, in plain language · (10) help is a last resort — **if it needs a tooltip, the flow failed**.

Plus the three laws: **Fitts** (important+frequent = big+close) · **Hick** (more choices = slower choosing; cut or stage options) · **Jakob** (users spend most of their time on other products — novelty must out-earn the convention it breaks).

## Severity (tie every issue to the user's goal)

- **Blocks the goal** — user cannot complete the core task, or completes it wrongly (data loss, wrong purchase). Must fix.
- **Hinders** — succeeds with friction, error-recovery, or luck. Fix before ship, negotiable which release.
- **Polish** — noticed by craft, invisible to task success. Batch it.

Severity attaches to *user impact*, never to how strongly the critic feels — a passionately-held polish note is still polish.

## Format (async, in the issue thread)

```
Goal restated: first-time user locates and runs an export in <10s. ← proves you read the brief
Works: primary action placement follows the list-page convention; empty state teaches.
1. [evidence: heuristic] [blocks] Export lives in an unlabeled kebab menu —
   recognition over recall (#6); first-timers can't find what they can't see.
   Problem, not prescription: needs a visible affordance on the default view.
2. [evidence: data] [hinders] 2-step confirm on a non-destructive action;
   settings dialog shows 31% abandon at identical pattern.
3. [taste] [polish] Icon style drifts from the nav set.
Questions: is the 10s target from the PRD test or aspiration?
```

Rules: restate the goal first · say what works and *why* (it teaches the pattern to keep, and it's not garnish) · issues ranked by severity · **offer the problem, prescribe only when asked or when one fix is objectively cheapest** · questions are real questions, not verdicts with a question mark.

## Receiving critique

State what feedback you want up front ("flow logic today, not visual polish") — unscoped critique defaults to everything. Respond to every note: fixed / declined-because / deferred-to. Declining taste needs no essay; declining evidence needs a reason on the record. The author owns the design; the critic owns the honesty of their labels; **the user's goal outranks both**.

## Anti-patterns

Redesign-by-critique (a parallel design in comment form — make your case as an option sketch, labeled taste, once) · goal-smuggling ("but what if we also…" — new goals go to the PM, not the margin) · seniority laundering (rank doesn't upgrade taste to evidence) · pile-ons (the fifth person agreeing adds heat, not signal — react to note #1 instead) · critique of the person's speed, effort, or history — the work on the screen is the only subject in the room.
