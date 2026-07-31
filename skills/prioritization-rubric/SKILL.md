---
name: prioritization-rubric
description: Stack-rank competing work with RICE/ICE scoring - anchored scales, worked examples, confidence caps that stop wishful thinking, and tie-break rules. Use whenever choosing between features or projects, whenever someone asks "what should we do first", "is X worth it", or "everything is top priority", when building or defending a roadmap, and whenever a prioritization decision is disputed or feels like it is being decided by volume rather than evidence.
---

# Prioritization Rubric

Scoring exists to make disagreements *specific*. The output is not the number — it is the argument the number forces: which assumption do we actually disagree about?

## RICE

`Score = (Reach × Impact × Confidence) / Effort`

**Reach** — how many users/accounts hit this per quarter. Use real analytics; a guess must be labeled a guess.

**Impact** — per affected user, anchored (do not interpolate romantically):

| Score | Anchor |
|---|---|
| 3 | Massive: removes a blocker to the core action or purchase |
| 2 | High: clearly improves a primary flow |
| 1 | Medium: helps a secondary flow |
| 0.5 | Low: nice touch, users would not miss it |
| 0.25 | Minimal: cosmetic |

**Confidence** — capped by evidence, not optimism:

| Score | You may claim it only if… |
|---|---|
| 100% | Shipped precedent, signed contract, or direct measurement |
| 80% | Quantitative data on *this* product (analytics, experiment, support volume) |
| 50% | Qualitative signal only (interviews, sales anecdotes, competitor behavior) |
| <50% | Pure hypothesis — score it, then buy confidence cheaply (fake door, spike) before committing effort |

**Effort** — person-weeks across *all* crafts: design + build + review + QA + docs. Include the annoying parts. Half-weeks allowed; heroics not.

## Worked example

| Item | Reach /q | Impact | Conf | Effort | RICE |
|---|---|---|---|---|---|
| A. Bulk edit for admin table | 2,000 | 1 | 0.8 | 2 | **800** |
| B. AI-suggested tags | 400 | 3 | 0.5 | 3 | **200** |
| C. Respect OS dark-mode preference | 5,000 | 0.5 | 1.0 | 0.5 | **5,000** |

Reading: C wins not because it is exciting but because it is *cheap and certain*. B's score is an instruction, not a verdict — its 0.5 confidence says "run a 1-week validation before betting 3 weeks". Small confident wins routinely beat big vague bets; that is the rubric working.

## ICE (the 5-minute variant)

`Impact × Confidence × Ease`, each 1–10. Use for small tasks, bug batches, or when RICE inputs would be pure theater. Same confidence discipline applies: a 9 confidence with no data is a lie with a straight face.

## Tie-breaks (in order)

1. **Hard external dates** (contracts, compliance, partner launches) beat everything scoreable.
2. **Revenue/critical path** beats comfort.
3. **Higher confidence** beats higher score built on guesses.
4. **Smaller effort** beats larger at equal score — finish things.
5. Still tied → the Operator's strategic call, recorded with reasoning.

## What RICE must never decide

- **Compliance, security, data-integrity work** — these are gates, not candidates. Schedule them; do not rank them against features.
- **Strategy bets** the Operator explicitly wants — score them anyway *for visibility*, then mark "strategic override" so the record shows the trade, not a fudged number.
- **Craft health** (flake quarantines, migrations mid-flight) — finishing beats starting.

## Anti-gaming rules

- No editing Reach until the score wins — inputs are cited, and cited inputs are checkable.
- Confidence above 50% requires a linked source in the scoring sheet. No link, no score.
- Effort sandbagging (padding rivals, shaving favorites) dies in daylight: engineers own effort numbers, the PM owns reach/impact, neither edits the other's column.
- Re-score only on **new evidence**, not on new enthusiasm. Note what changed.
- Publish the sheet. A prioritization nobody can inspect is a preference with a spreadsheet costume.
