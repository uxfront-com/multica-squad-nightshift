---
name: prd
description: Write and review problem-first PRDs/specs - problem framing, evidence rules, success metrics with guardrails, mandatory non-goals, thinnest-slice scoping, and kill criteria. Use whenever writing a spec, PRD, or feature brief, whenever someone proposes a feature ("we should add X", "build me Y"), whenever acceptance criteria are missing before build work, and whenever reviewing whether a proposed feature is actually worth building.
---

# PRD

A PRD's job is to make building the wrong thing hard. It is short, falsifiable, and versioned in the repo (`/docs/product/`) so it gets reviewed like code.

## The skeleton (all sections mandatory)

```markdown
# <Feature name>            Status: Draft | Agreed | Building | Shipped | Killed
Owner: · Date: · Issue: <link>

## Problem
Who hurts, how, how often. One paragraph. No solutions allowed in this section.

## Evidence
Numbers with sources. "4 support tickets + 1 churned account citing this (links)"
beats "users are asking". Label each item: measured / reported / assumed.

## Users
Which segment, roughly how many (cite analytics), and who is explicitly NOT served.

## Success metric + guardrail
Success: the number that moves if this works, with current baseline and target.
Guardrail: the counter-metric that catches you gaming it.
  e.g. Success: export completion rate 62% → 85%. Guardrail: support tickets
  about exports do not rise; p95 export time stays < 30s.

## Non-goals
What we are deliberately not doing, so nobody relitigates it in review.
A spec without non-goals is a wish.

## Thinnest testable slice
The smallest version that ships the core value to real users this month.
List what the slice cuts and why each cut is safe.

## Open questions
Each with an owner and a resolve-by date.

## Kill criteria
Decided BEFORE launch: "If <metric> < <threshold> after <period>, we remove it."
Features without kill criteria become furniture.
```

## Section quality bar

- **Problem:** if it contains a feature name, it's a solution wearing a trenchcoat. Rewrite as the pain ("users cannot find their exported data"), not the fix ("add an exports page").
- **Evidence:** "I believe" and "the data shows" are different sentences — never launder one as the other. Quantify or label as assumption.
- **Success metric:** must be instrumentable *at launch*. A feature ships with its instrumentation or it did not ship. Vanity metrics (page views, clicks without intent) don't qualify.
- **Thinnest slice:** thin means narrow, not shoddy — full quality on a small surface. Cut scope, never quality. If v1 needs a quarter, it is not v1.
- **Kill criteria:** the hardest section to write honestly, which is exactly why it's mandatory.

## Definition of ready (build work may not start without)

- [ ] Problem + evidence survive one round of scrutiny
- [ ] Acceptance criteria written (observable, testable statements)
- [ ] Success metric + guardrail named, instrumentation plan noted
- [ ] Non-goals section exists and is non-empty
- [ ] Design dependency identified (does this need design shaping first?)

## Anti-patterns

- **Solution-first spec:** "Build an AI assistant" → reframe: what problem, whose, how would we know? Competitors having one is a fact; users needing ours is a hypothesis.
- **"Everyone is asking":** count them. 4 tickets is real and small; write "real and small".
- **Metric without guardrail:** every metric can be gamed; the guardrail is the honesty clause.
- **Scope accretion in review:** new ideas go to a "v2 candidates" list in the PR discussion, not into the slice.
- **PRD as novel:** past ~2 pages the thinking isn't done — compress until the trade-offs are visible.

## Worked micro-examples

**1. "Add dark mode, everyone's asking."**
Problem: eye strain at night (evidence: 4 tickets + 1 tweet, links). Slice: respect OS `prefers-color-scheme` using existing tokens (~2 days) instead of a settings toggle (~2 weeks). Success: >15% of sessions render dark within 30 days; guardrail: no contrast a11y regressions. Kill: <5% usage after 60 days → remove the code path. Non-goals: per-page overrides, scheduled switching, custom themes.

**2. "Build an AI assistant, competitors have one."**
Reframe: hypothesis, not requirement. Slice: 1-week fake-door test — entry point + waitlist + 5 interviews with clickers. Success gate: intent ≥8% of weekly actives → then write the real PRD. Kill: below gate, archive with data attached. Non-goals (of the test): any model integration, any real answers. This spends one week to decide whether to spend a quarter.
