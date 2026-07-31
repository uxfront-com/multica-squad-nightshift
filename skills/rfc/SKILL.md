---
name: rfc
description: Write and run RFCs (request for comments) for consequential technical and product decisions - the template, steelmanned options requirement, reversibility classes that size the process, and the review lifecycle. Use whenever a decision spans multiple owners or systems, whenever someone proposes an architecture change, new dependency, or migration, whenever a design dispute stalls ("should we use X or Y"), and before any hard-to-reverse commitment of more than a week's effort.
---

# RFC

An RFC exists to make a decision **arguable in writing before it is expensive in code**. It is not a persuasion document — it is the strongest honest case for every live option, so the decider chooses between real alternatives instead of between your favorite and a strawman.

## When an RFC is required (any one triggers)

- One-way door: costly to reverse (data model, public API contract, framework/language, vendor with migration gravity)
- Crosses lanes: two or more owners must change behavior for it to work
- The bet exceeds ~1 person-week and rests on a disputable assumption
- The same dispute has surfaced twice ("didn't we argue about this already?" — yes, and it wasn't written down)

Not RFC material: reversible choices inside one owner's lane (decide, note reasoning in the PR, move), and taste calls with no consequence gradient.

## Reversibility classes size the process

| Class | Door | Process |
|---|---|---|
| 1 | Two-way (flag it off, delete it, cheap to unwind) | A paragraph in the issue + go. Recording optional. |
| 2 | Expensive to reverse (weeks to unwind, data to migrate back) | RFC-light: template below, 2-day comment window |
| 3 | One-way (public contracts, data semantics, vendor lock) | Full RFC, 3+ day window, Operator sign-off explicit |

Most process pain comes from treating Class 1 like Class 3 (bureaucracy) or Class 3 like Class 1 (regret). Classify first; the class is itself reviewable.

## Template (PR into `/docs/rfcs/NNNN-slug.md`)

```markdown
# RFC-0042: <decision, phrased as a question or proposal>
Status: Draft | In review | Decided | Superseded by RFC-NNNN
Author: · Reviewers: · Class: 1/2/3 · Comment window closes: <date>

## Problem
What hurts, who it hurts, and why now. Constraints that are actually fixed
(budget, deadlines, compliance) vs. merely traditional.

## Options considered  ← minimum two, each steelmanned
### Option A: <name>
The case FOR, written so A's strongest advocate would sign it.
How it works · what it costs · what it risks · who has done this.
### Option B: <name>
Same treatment. "Do nothing / status quo" is often a legitimate Option C
and keeping it honest keeps the urgency honest.

## Trade-off summary
| | A | B | C |
|---|---|---|---|
| Delivery cost | | | |
| Operational cost (the 2 a.m. cost) | | | |
| Reversibility | | | |
| Risk & blast radius | | | |

## Recommendation
One option, with the reasoning — AND the strongest argument against it,
stated fairly. A recommendation that can't survive its own counter-case
isn't ready.

## Open questions
Each with an owner and a resolve-by date.

## Decision log
<date> — decided by <who>: <what>, because <why>. → ADR-NNN filed.
```

**The steelman bar:** each option's section is written so that option's advocate would endorse it as accurate. If you can't write a genuine case for an option, either it isn't a real option (drop it and say why) or you don't understand it yet (research before writing). Listing a strawman as "Option B" is the RFC-shaped version of not writing an RFC.

## Running the review

- Timebox: the comment window is stated in the header and defended. RFCs without clocks become parking lots.
- Comments resolve to text changes, an open question with an owner, or a noted disagreement — silent unresolved threads block "Decided".
- Prior art first: search existing RFCs/ADRs before drafting; superseding an old decision means engaging its recorded reasoning, not ignoring it.
- The RFC recommends; **the Operator (or named decider) decides** — including against the recommendation. Either way the decision log line is written, the status flips to Decided, and an ADR captures the outcome (see the adr skill; the RFC is the argument, the ADR is the ruling).
- Superseded RFCs stay in the repo with a pointer forward. The archive is the point.
