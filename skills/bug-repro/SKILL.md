---
name: bug-repro
description: Turn bug reports into deterministic reproductions and failing tests - intake template, environment matrix requirements, minimal-repro reduction, and the intermittent-bug playbook. Use whenever a bug is reported or suspected, whenever someone says "it doesn't work", "works on my machine", or "can't reproduce", before any bug fix is attempted, and when verifying that a fix actually fixed the original case.
---

# Bug Repro

The order is law: **repro → failing test → fix → verify on the original case.** A fix without a repro is a guess with a commit message, and "works on my machine" is a confession, not a defense — the machine where it fails is telling the truth too.

## Intake template (fill before any investigation)

```
Expected: [what should happen]
Actual:   [what happens instead — exact text/behavior, screenshot/recording]
Steps:    [numbered, from a known state — incl. the account/data state]
Environment: [app version/commit · browser+version · OS · role/permissions ·
              locale/timezone · data shape (0 items? 10k items?)]
Frequency: always / intermittent (~X%) / observed once
First seen: [date/version — "after Tuesday's deploy" is a diagnosis clue]
Evidence:  [request IDs, trace/log links, console errors, HAR]
```

Missing fields are the first two questions back to the reporter (two max — then proceed on labeled assumptions). Request IDs and "first seen" are the highest-value fields: one lets you find the exact trace; the other bisects the timeline before you bisect the code.

## The environment matrix — earn "cannot reproduce"

"Cannot reproduce" may only be claimed after trying the *reporter's* conditions, not yours. Minimum cells before the claim:

| Axis | Try at least |
|---|---|
| Version | Reporter's exact version/commit AND current main |
| Browser/OS | Reporter's combo (not just your daily driver) |
| Role/permissions | Reporter's role — admin-you sees a different app than member-them |
| Data state | Their scale: empty account, huge account, the weird legacy record |
| Locale/network | Their locale/timezone; throttled network if timing-adjacent |

Report it as a matrix ("repros on member+Safari+large-account; not on admin+Chrome") — the *pattern of where it fails* is usually the diagnosis. Still nothing after the matrix → say exactly what was tried, attach the attempt log, and ask the reporter for a recording or a live session. "Cannot reproduce (yet)" keeps the issue honest; closing it makes the bug someone else's surprise.

## Minimal repro reduction

Shrink while it still reproduces — every removed element is a suspect eliminated:

1. **Halve the data** (bisect the dataset; that one record that breaks it *is* the bug's fingerprint)
2. **Remove steps** — which are load-bearing?
3. **Pin versions/flags** — same flags as prod? same dependency versions?
4. **Drop below the UI** — reproduce with a curl/API call or a unit-level harness if possible; the smaller the repro, the closer it points
5. Stop when removing anything makes it pass. That boundary is the repro's value.

## Intermittent bugs

- Loop it: script the steps ×100, report a rate ("fails 7/100"), which turns "sometimes" into a measurable target — and makes "fixed" verifiable (0/200 after).
- Vary the suspects deliberately: timing (throttle network, CPU ×4 slowdown), concurrency (two tabs, parallel requests), ordering (retry storms), cache state (cold vs warm).
- Set a logging trap: add targeted temporary logging around the suspect seam, let it run, harvest. (Remove the trap after — tracked in the issue.)
- An intermittent failure that correlates with load is a race being honest. Don't "fix" it by adding a sleep; that's bribing the witness.

## Repro → failing test (the handoff artifact)

Before routing to the owning engineer, convert the repro into the smallest **failing automated test** at the lowest layer that expresses it (unit < integration < e2e), committed on a branch and linked. The handoff comment: failing test link + matrix summary + evidence bundle (request IDs, trace links, HAR, seed script). The engineer's fix makes *that test* pass; review rejects fixes that arrive without the test's failure-then-pass story.

## Verification (the loop closes where it opened)

Verify on the **original reported case** — same account shape, same environment cell — not just on the fresh test. Then: regression test merged (the failing test, now green, permanently in the suite), frequency re-measured for intermittents (0/200), reporter pinged with the verified result. A bug is closed by evidence, not by a merge notification.
