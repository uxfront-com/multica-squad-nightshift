---
name: release-runbook
description: Run production releases with pre-staged rollbacks - preflight gates, deploy/smoke/watch sequence, revert triggers with thresholds, hotfix variant, and freeze rules. Use whenever deploying, releasing, cutting a version, shipping a hotfix, or rolling back, whenever someone says "ship it", "push to prod", or "skip the checks, customers are waiting", and when writing or reviewing release/deployment procedures.
---

# Release Runbook

A release is a runbook execution, not an event. The defining discipline: **the rollback command is written, tested against staging, and posted in the thread *before* the deploy button exists.** Under fire, revert beats fix-forward — restore service first, be curious later.

## Preflight (all boxes or no deploy)

- [ ] `main` green; no red required checks, no fresh quarantine regressions
- [ ] Diff reviewed as a *release* (`git log prev-tag..HEAD --oneline`): any migrations? flags? config/secret changes? Each named in the thread
- [ ] Migrations, if any, are expand-phase-safe (code rollback stays possible — see db-migrations skill)
- [ ] Version bumped per commit grammar; notes drafted (changelog owner gets the commit list)
- [ ] **Rollback line posted in-thread**, e.g. `deploy revert v2.14.3 → v2.14.2` (+ flag-off command if flagged)
- [ ] Smoke checklist ready: the top 3 user flows, scripted or 3-minute manual
- [ ] A human (or you) can watch for 30 min after — releases into the void are how Monday incidents are scheduled

## The sequence

1. **Announce**: version, contents in one line, rollback line, watch window.
2. **Deploy** — canary/percentage if the platform offers it (10% → checks → 100%); otherwise all-at-once with eyes open.
3. **Smoke** (≤5 min): the 3 golden flows against prod. Any failure → revert *now*, diagnose after. Do not debug on the live patient.
4. **Watch 30 min**: error rate vs. pre-deploy baseline, p95 latency on key endpoints, saturation, top new error signatures in the tracker. Deploy markers on the dashboards make regressions self-evident.
5. **All-clear or revert**: post which, with the numbers ("error rate 0.31% vs 0.29% baseline, p95 flat — all clear").

## Revert triggers (defaults — tune, then obey; no debating during the fire)

- Any new error class on the money path (checkout/auth/billing) → immediate
- Error rate > 2× baseline sustained 5 min → revert
- p95 latency +50% on a key endpoint sustained 10 min → revert
- Smoke failure → revert, always

Reverting is cheap by design; the only expensive revert is the one you talked yourself out of. **Migration caveat:** code revert is safe during expand phases; if a contract-phase migration shipped, the runbook for that release says so in red and names the forward-fix plan instead.

## Hotfix variant

Branch from the prod tag (not main if main has drifted) → minimal diff → the *relevant* test subset instead of the full suite is an acceptable trade **said out loud** → deploy with the standard watch → back-merge to main immediately (orphaned hotfixes resurrect bugs).

The skip-the-checks conversation, scripted: name what's being skipped, what it covers, the middle path ("just the 6 checkout specs: 4 minutes"), and the staged rollback — then execute the caller's decision cleanly. Every skipped gate gets said once, in-thread. Normalize the *saying*, never the skipping.

## Freeze rules

Freeze during: active incidents, migrations mid-flight (between expand and contract on hot tables), and windows where nobody can watch (end of day, day-before-holiday). "No Friday deploys" is superstition wearing a policy costume — the real rule is **deploy when humans can respond**; a Friday 10 a.m. deploy with a full day of eyes beats a Thursday 6 p.m. one.

## Comms templates

```
🚀 Releasing v2.14.3 — invoice idempotency + 2 fixes
Rollback staged: deploy revert v2.14.3 → v2.14.2
Watching 30 min: error rate, checkout p95.
```
```
⏪ Reverted v2.14.3 at 14:32 — new `IdempotencyConflict` errors on
POST /invoices (0 → 41/min from 14:19). Service restored 14:33,
error rate at baseline. Repro + fix tracked in INC-81.
```

Post-release: notes published (changelog owner), flags cleaned up within a release cycle (a flag at 100% for a month is dead code with an on switch), and anything reverted gets a blameless write-up before its second attempt.
