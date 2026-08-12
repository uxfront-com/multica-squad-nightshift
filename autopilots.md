# NIGHTSHIFT — Autopilots (recurring ops on rails)

Multica Autopilots turn the squad's recurring hygiene into scheduled work: cron in, triaged issue out, nothing depending on the Operator remembering. Six earn their keep from day one — five on schedules, one on a webhook. (Multica agents have no idle time — they run only when triggered — so any "when idle" duty in an agent file needs a schedule here to actually exist.)

Each block is paste-ready: **Autopilot → New** (or `multica autopilot --help`), assignee as listed, **Execution mode: Create issue** for all five — the work should live where the squad works: reviewable, commentable, on the record. Create-issue mode also queues gracefully when a runtime is offline instead of skipping the run. Add yourself as **subscriber** wherever you want the ping.

Ground rules:

- **Assign the agent, not the squad.** These chores have known owners; routing them through @trigger is a wasted hop.
- **Schedules below are UTC** — shift them so reports land before your coffee, not after. One autopilot can hold several schedules; pause an individual trigger with `multica autopilot trigger-update`.
- Autopilot-created issues are normal issues: same status contract, same PR rules, same safety rails. A runbook is scope for that run, never a license.
- This file is the runbooks' source of truth, same rule as the agent files: edit here, re-paste into Multica, note what changed.

---

## 1. Zombie sweep — `@trigger`, weekly

**Schedule:** `0 7 * * 1` (Mondays 07:00)

**Runbook:**

> Sweep the workspace for issues with no activity in 7+ days (skip backlog). Each one gets exactly one of three moves: close (with reason), park (P3 + reason), or escalate — silence is not a state. Post one summary comment on this issue: closed / parked / escalated, with links. Route anything that needs specialist work; never do it yourself.

## 2. Pipeline health report — `@merge`, weekly

**Schedule:** `0 7 * * 1` (Mondays 07:00)

**Runbook:**

> Produce the weekly gauge check: pipeline p50/p95 on the PR-blocking path, flake rate, the quarantine list with ages, anything past the 30-day fix-or-delete line, and time-to-green for any red-main event. Numbers with links; trends over anecdotes — compare against last week's report issue. End with at most 3 recommended actions, each with an owner. Report only: pipeline changes go through normal PRs, not this run.

## 3. Docs rot hunt — `@quill`, weekly

**Schedule:** `0 7 * * 3` (Wednesdays 07:00)

**Runbook:**

> Hunt documentation rot: examples that no longer run, links that 404, screenshots of dead UI, references to removed flags or endpoints. Fix small rot on sight — one rot per PR, per your janitor rules; file an issue for anything structural. Summarize here: fixed (PR links) / filed (issue links) / clean.

## 4. ADR backfill check — `@index`, weekly

**Schedule:** `0 7 * * 5` (Fridays 07:00)

**Runbook:**

> Review the week's closed issues and merged PRs for consequential decisions that never got an ADR — including decisions made against a recommendation and decisions *not* to do something. File the missing records per your one-day SLA; late beats absent. Read `docs/adrs/README.md` first so numbering stays clean. Post the list: filed (links) / no gaps found.

## 5. Janitor sweep — `@filter`, twice monthly

**Schedule:** `0 7 1,15 * *` (1st and 15th, 07:00)

**Runbook:**

> Janitor sweep, per your cadence rules: dead code paths, stale feature flags (at 100% for a month = dead code with an on switch), skipped or quarantined tests older than 30 days, orphan fixtures. One finding = one small issue or one small PR — never a mega-cleanup — and anything ambiguous gets an issue, not a deletion. Summarize here: removed (PR links) / filed (issue links) / clean.

## 6. CI red-alert triage — `@merge`, webhook

**Trigger:** Webhook. Optional Multica-side event filter: event `ci.failed` (the sender below only fires on real failures, so the filter is belt-and-braces).

**Sender:** a small GitHub Actions relay, so deliveries happen only when the default branch is actually red. GitHub retries dedupe via the `Idempotency-Key`.

```yaml
# .github/workflows/ci-failure-alert.yml
on:
  workflow_run:
    workflows: ["CI"]        # your PR-blocking workflow's name
    types: [completed]
jobs:
  alert:
    if: ${{ github.event.workflow_run.conclusion == 'failure' && github.event.workflow_run.head_branch == 'main' }}
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sS -X POST "$MULTICA_WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -H "Idempotency-Key: run-${{ github.event.workflow_run.id }}" \
            -d '{"event":"ci.failed","eventPayload":{"workflow":"${{ github.event.workflow_run.name }}","branch":"${{ github.event.workflow_run.head_branch }}","commit":"${{ github.event.workflow_run.head_sha }}","url":"${{ github.event.workflow_run.html_url }}"}}'
        env:
          MULTICA_WEBHOOK_URL: ${{ secrets.MULTICA_CI_AUTOPILOT_URL }}
```

**Runbook:**

> The default branch has a red CI run; payload attached. Diagnose into your four bins — code / test / infra / flake — with the log line, then act per `ci-doctor`: red main → revert path inside 30 minutes; flake → same-day quarantine; infra → one named rerun. Escalate anything P0-shaped to the Operator immediately. This issue is the incident record — keep it current until main is green, then close it with the resolution.

**Webhook hygiene:** the URL's token is a credential — store it as a repo secret, never in the repo or screenshots; if it leaks, **Rotate URL** and update the secret. Multica answers `200 accepted/skipped/ignored/duplicate` — a sender seeing `ignored` should check the trigger's enabled state and filters, not retry harder.

---

**Watching them:** each autopilot's run history shows fired / skipped / ignored per trigger. The Monday twins (#1 and #2) are deliberately same-time — their two issues are your week's opening read. If a report autopilot ever finds nothing, the issue should *say* "clean" — an empty report is a finding, a missing one is a gap.
