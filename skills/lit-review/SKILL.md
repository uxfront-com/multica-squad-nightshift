---
name: lit-review
description: Research questions with source discipline - the source-quality ladder, confidence labels (verified/strong/weak/speculation), timeboxed protocol, synthesis format with mandatory dissenting evidence, and citation hygiene. Use whenever researching a technical or market question, evaluating tools or vendors, checking prior art before building, whenever someone asks "what's the best way to X" or "is it true that Y", and whenever a claim needs a source before it ships in a decision or a launch post.
---

# Lit Review

Research without a written question is tourism. Research without confidence labels is rumor with citations. The deliverable is a synthesis the squad can argue with — which means every claim carries its origin and its strength.

## Start: question + timebox

Write both down before opening a tab: *"Can Postgres FTS reach <300ms p95 at 310k rows, or do we need a dedicated engine? Timebox: 1 day."* The question makes "done" detectable; the timebox makes "keep reading" a decision instead of a drift. When the box expires: ship the synthesis with what you have, labeled, plus "what another day would buy".

**Archive first, world second.** Search internal RFCs/ADRs/issues before the internet — the most expensive research finding is one the squad already paid for eight months ago.

## Source-quality ladder

| Tier | What | Standing |
|---|---|---|
| 1 | Primary: specs/standards, official docs, papers, source code, **your own measurements** | Citable as fact (with version + date) |
| 2 | Vendor engineering blogs, conference talks, maintainer statements | Citable with attribution — remember vendors narrate their wins |
| 3 | Practitioner posts **with methodology shown**, detailed postmortems | Citable as experience reports: "one team found…" |
| 4 | Aggregators, SEO listicles, forum threads, AI summaries, undated content | **Leads only, never citations.** Follow to their sources or drop |

Two Tier-3s agreeing is corroboration; ten Tier-4s agreeing is one press release with echo. Version-sensitive claims (performance, features, limits) require the version and date checked — a 2021 benchmark of a database is history, not evidence.

## Confidence labels (attach to every claim, no exceptions)

- **verified** — I ran it / read the primary source myself
- **strong** — multiple independent Tier 1–2 sources agree; no credible dissent found
- **weak** — single source, indirect evidence, or Tier 3 only
- **speculation** — inference or extrapolation; here's the reasoning

Never launder: an unlabeled claim reads as verified, so an unlabeled guess is a quiet lie. If a claim's label would embarrass the recommendation, that's the label doing its job.

## Synthesis format (≤1 page; archive linked beneath)

```markdown
## Question · Timebox spent
## Answer
One paragraph, direct, with the overall confidence stated.
## Evidence
| Claim | Confidence | Source (tier, version, date) |
## Dissenting evidence          ← MANDATORY, especially when it stings
What contradicts the answer, found where, why it does/doesn't change the call.
"None found despite looking in X, Y" is a valid entry; an absent section is not.
## What would change this conclusion
The observations or thresholds that should reopen the question.
## Recommendation (if asked for one)
With the strongest counter-case attached.
```

The dissenting-evidence section is the integrity mechanism: report what undercuts your recommendation *especially* when you like the recommendation. A synthesis that only gathered agreement was a shopping trip.

## Citation hygiene

- Cite the specific claim to the specific source — link + accessed date + version where relevant. A bibliography at the bottom supporting "everything above, somehow" supports nothing.
- **Never cite what you haven't read.** Citing an abstract's citation of a paper you didn't open is how errors go viral. Quote sparingly and exactly; paraphrase honestly (don't sharpen a source's hedged claim into your confident one).
- Distinguish "the docs say X" (Tier 1, verified) from "the docs imply X" (your inference — label it).
- Numbers get provenance: whose benchmark, what hardware, what dataset shape. "3.1× faster" without methodology is marketing; with methodology it's evidence.

## Anti-patterns

Confirmation shopping (searching "why X is better than Y") · recency worship (newest ≠ truest) and its twin, canon worship · authority transfer ("BigCo does it" — BigCo's constraints aren't yours; cite their *reasoning*, not their logo) · survivor bias (blogs are written by the ones it worked for) · quote-mining a hedged source into a confident citation.
