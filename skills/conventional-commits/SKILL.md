---
name: conventional-commits
description: Write commits and PR titles in Conventional Commits grammar with correct SemVer mapping and changelog automation. Use whenever writing or amending a commit message, whenever titling a PR (squash-merge makes the title the commit), whenever choosing a version bump, whenever reverting, and whenever reviewing commit hygiene or setting up commitlint/release automation.
---

# Conventional Commits

The grammar is an API between humans and release tooling. Clean grammar means the changelog and the version bump write themselves; dirty grammar means someone reconstructs history by hand at release time.

## Grammar

```
<type>(<scope>)!: <subject>
<BLANK>
<body — the WHY; the diff already shows the what>
<BLANK>
<footers>
```

- **Subject:** imperative mood ("add", not "added"/"adds"), lowercase after the colon, no trailing period, ≤72 chars hard / ≤50 ideal. Test: "If applied, this commit will *<subject>*."
- **Scope:** optional, from a maintained list (`api`, `ui`, `auth`, `billing`, `ci`, `deps`…) — invented scopes rot the changelog grouping.
- **`!`** after type/scope marks a breaking change (pairs with the footer).
- **Body:** wrap ~72; explain motivation and trade-offs, link context. A one-line `fix:` with no body on a subtle bug is a future archaeology dig.
- **Footers:** `BREAKING CHANGE: <migration instructions>` · `Refs: #123` · `Reverts: <sha>` · `Co-authored-by:`.

## Types → SemVer

| Type | Meaning | Bump |
|---|---|---|
| `feat` | User-visible capability | **MINOR** |
| `fix` | User-visible bug fix | **PATCH** |
| any + `!` / `BREAKING CHANGE:` | Contract broken | **MAJOR** |
| `perf` | Faster, same behavior | PATCH (convention) |
| `refactor` `docs` `test` `build` `ci` `chore` `style` | No user-visible change | none |
| `revert` | Undo a commit | mirrors what it undoes |

Honesty rules: a behavior change is never `chore`. A `fix` for a bug nobody shipped yet (introduced in the same release) can be squashed into its `feat` instead of polluting the changelog. `feat` means users got something — renaming a variable is not a feat, no matter how proud you are.

## Examples

```
feat(billing): add idempotency keys to invoice creation

Retries on network timeouts previously created duplicate invoices
(3 support cases, #482). Keys stored 24h; replay returns the
original response.

Refs: #482
```

```
fix(auth)!: reject tokens without an audience claim

BREAKING CHANGE: tokens minted before v2.3 lack `aud` and will be
rejected. Re-issue tokens or set AUTH_ALLOW_LEGACY=true during
migration (removed in v4).
```

Bad, with the fix: `fixed stuff` → what stuff, why? · `feat: Fix login` → it's a `fix`, and lowercase · `chore: change default page size 20→50` → behavior change: `feat` (arguably `!`).

## Squash-merge reality

With squash-merge, **the PR title becomes the commit subject and the PR description becomes the body** — so lint the PR title (commitlint via a PR-title check), keep the description in why-form, and stop polishing intermediate commits nobody will ever see. Branch commits can be `wip`; the PR title cannot.

## Reverts

```
revert: feat(billing): add idempotency keys to invoice creation

Reverts commit 8f2c1d4. Duplicate-key errors under concurrent
retries (INC-77); revert restores service while the race is fixed.

Refs: INC-77
Reverts: 8f2c1d4
```

Always say *why* it was reverted — the changelog reader sees the feature appear and vanish and deserves the plot.

## Automation

- **Enforce:** commitlint (`@commitlint/config-conventional`) on PR titles in CI; a scope allowlist in `commitlint.config.js`.
- **Release:** release-please or semantic-release derives version + changelog from the grammar; changesets if you prefer explicit human-written release notes per PR (good for user-facing products — pairs with the changelog skill's "human consequence" pass).
- Generated changelogs are **drafts**: a human translates commit-speak into consequence-speak before publishing.
