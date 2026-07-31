---
name: review-checklist
description: Review code PRs with a priority-ordered lens - correctness, edge cases, error paths, tests, security, readability - plus comment etiquette (blocking/nit prefixes), size limits, and response-time norms. Use whenever reviewing any pull request or diff, whenever asked "can you look at my PR", whenever a review is disputed or stalled, and whenever authoring a PR (the author checklist half applies before requesting review).
---

# Review Checklist

Review is the last cheap place to catch a defect and the main place a codebase's culture is transmitted. Both jobs matter; the order below keeps the first from drowning in the second.

## The lens, in strict priority order

1. **Correctness** — does it do what the issue asked? Trace the main path by hand with a real input. Off-by-ones, inverted conditions, wrong variable in the right place.
2. **Edge cases** — empty, one, many, huge; null/undefined; concurrent invocation; unicode and timezone; the second click.
3. **Error paths** — what happens when the network call fails, the parse throws, the row is missing? Errors handled where they can be handled, propagated with context otherwise, never swallowed silently. A `catch` that only logs is a decision — was it made on purpose?
4. **Tests** — do they test *behavior* (would they fail if the feature broke?) or the implementation's mirror? Is the bug this PR fixes pinned by a test that failed before the fix? Any assertion-free tests (run-and-pass theater)?
5. **Security & data** — injection at trust boundaries, authZ on every new mutation (not just authN), secrets out of code and logs, PII handling, unbounded input sizes.
6. **Readability & design** — names that tell the truth, functions that fit in a head, duplication that's earned vs. lazy. Would the next stranger understand *why*?
7. **Style** — the linter's job. A human commenting on formatting is two failures: the nit, and the missing lint rule. Add the rule instead.

## Comment etiquette (prefix every comment)

- `blocking:` — merge waits for this; correctness/security/data-loss territory. Say *why* it blocks.
- `nit:` — take it or leave it, author's call, zero follow-up owed.
- `question:` — genuine, not a blocking in disguise. If the answer would block, say `blocking (question):`.
- `praise:` — costs nothing, teaches what good looks like, makes the blocking comments land as calibration rather than combat.

Comment on the code, never the coder ("this loop re-fetches per item" not "you're re-fetching"). Offer the problem and, where cheap, a sketch of the fix — but the author owns the solution. **Redesign objections don't belong in review:** if the disagreement is architectural, say so in one comment and move it to an RFC; twelve blocking comments are not a design discussion, they're a siege.

## Size & time norms

- **>400 changed lines → request a split** before deep review. Past that point defect-detection falls off a cliff and review becomes theater. Offer the split seams (usually: mechanical/rename PR + behavior PR, or layer-by-layer).
- Exceptions: generated code, lockfiles, mechanical renames — say "reviewed as mechanical" so the trust boundary is explicit.
- **First response within one business day**, ideally hours — review latency sets the whole team's cycle time. If you can't review properly, say so and name when or who.
- Re-review after changes checks the *changes*, not a fresh full pass with new opinions. Moving the goalposts each round is how PRs die of old age.

## Verdicts

- **Approve** — ship it.
- **Approve with nits** — the default for healthy teams: nits are trusted to the author, no re-review round-trip. Use it; requiring re-review for renames is throughput theater.
- **Request changes** — one or more `blocking:` items, each independently justified.

## Author's half (before requesting review)

- [ ] Self-reviewed the diff line-by-line in the PR view (different eyes than the editor; you *will* find something)
- [ ] Description: why + what changed + how verified (test output, screenshot, curl) + anything you're unsure about flagged for the reviewer
- [ ] Linked issue; small enough to review in one sitting; CI green *before* requesting humans
- [ ] No drive-by changes smuggled in ("while I was here" is a separate PR)

## Reviewer anti-patterns

LGTM-ing 1,000 lines in 4 minutes (that's an autograph, not a review) · style nits as blockers · rewriting the author's approach in comments instead of raising the design question once · hostage-taking (approval withheld for unrelated debt) · silent expiry (requested changes, then vanished — you own your blockers until resolved or handed off).
