---
name: ci-doctor
description: Diagnose and fix CI failures and pipeline health - the four failure bins, flake thresholds and quarantine procedure, red-main protocol, and pipeline speed budgets with ranked levers. Use whenever a build or check fails, whenever tests are flaky or "pass on retry", whenever main goes red, whenever the pipeline feels slow, and whenever someone says "just rerun it" - especially then.
---

# CI Doctor

A CI system has one job: **red means broken, green means safe**. Every practice here defends that signal, because the day the squad starts ignoring red is the day CI becomes decoration.

## Diagnose into one of four bins (always say which, with the log line)

| Bin | Signature | Immediate action |
|---|---|---|
| **Code** | Deterministic fail, points at the diff; compiles/tests fail the same way locally | Back to the author with the failing line — not "CI is broken" |
| **Test** | Code is right, the test's assumption is wrong (new copy, changed fixture, order-dependence) | Fix the test *in the same PR* that broke its assumption |
| **Infra** | Runner died, network timeout to registry, disk full, secrets expired — failure unrelated to the diff | Rerun **once** with the infra cause named; recurring → infra issue with owner, not serial reruns |
| **Flake** | Same commit: fails, then passes. No diff between runs | Quarantine procedure, same day |

"Rerun until green" without naming the bin is how signal dies. One named infra-rerun is diagnosis; three anonymous reruns is denial.

## Flake policy (numbers first, sympathy later)

- **Definition:** fails then passes on retry with zero code change.
- **Threshold:** 2 flakes in 7 days for the same test → quarantine **same day**. Not next sprint. Every day a known flake sits in required checks, it trains the squad to ignore red.
- **Quarantine procedure:** (1) tag/move it out of required checks (keep it running in a non-blocking job — data keeps accruing), (2) file an issue with the failure pattern + link to N failing runs, (3) assign an owner, (4) weekly quarantine review; **30 days without a fix → the test is deleted or rewritten.** A quarantine list without an exit policy is a graveyard with a schedule.
- **Autopsy honestly:** a "flaky test" is often a *real race honestly reported* — timing-dependent token refresh that fails under CI load is a bug wearing a test's clothes. Route those to the code owner, not the test owner.
- Track the number: flake rate (retried-green runs / total). >1% is a fire in slow motion.

## Red-main protocol

Main red → **a revert PR for the breaking commit is open and flagged to the Operator within 30 minutes** (the Operator merges it — agents never do). Do not fix-forward on main while everyone else's PRs stack up behind a red base — the revert unblocks the whole squad, and the author retries via a normal PR with zero shame attached. (This is precisely what merge queues exist to prevent; if red-main happens monthly, the fix is a merge queue, not vigilance.)

## Pipeline speed budget

**p50 < 10 min, p95 < 20 min** for the PR-blocking path. Past that, people batch changes, context-switch, and stop treating red as urgent — slowness degrades correctness, not just comfort. Measure per-stage; optimize the actual critical path, not the loudest stage.

Levers, in ROI order:

1. **Cache dependencies** (lockfile-keyed) — usually minutes for an afternoon's work
2. **Parallelize/shard by recorded timing data**, not file count — equal-duration shards or nothing
3. **Fail fast**: lint/typecheck/unit before integration/e2e; kill the run on first required-stage failure
4. **Split the suite**: PR-blocking = fast + high-signal; nightly = the long tail (with a real owner for nightly reds, or it's a log nobody reads)
5. **Test-impact analysis / affected-only** in monorepos
6. Prune: delete tests that have never failed for a real reason and duplicate coverage — test suites are code, and code rots

## Hygiene

- Required checks are few, fast, and trusted — a 40-minute optional check is documentation, not a gate.
- Every pipeline change PRs like code (it is code), with the before/after timing in the description.
- Weekly gauge check: pipeline p50/p95, flake rate, time-to-green after red main, queue wait. Trends beat anecdotes; "CI feels slow" becomes "p50 went 8→13 min when the e2e stage doubled — here's the shard plan".
