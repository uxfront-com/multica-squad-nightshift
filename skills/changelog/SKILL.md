---
name: changelog
description: Write changelogs and release notes humans actually use - Keep a Changelog structure, the commit-to-consequence translation pass, audience filtering, and breaking-change migration notes. Use whenever writing or updating a changelog or release notes, whenever a release is being cut, whenever someone pastes raw commit messages as "the changelog", and whenever deciding if a change is worth telling users about.
---

# Changelog

A changelog answers one question for a user: **"what does this release change about MY life?"** Commits answer "what did we do to the code". The changelog is the translation layer between those, and the translation is the work.

## Structure — Keep a Changelog

```markdown
# Changelog
All notable changes to this project are documented here.
Format: Keep a Changelog · Versioning: SemVer.

## [Unreleased]
### Added
- ...

## [2.14.0] — 2026-07-14
### Added        ← new capabilities
### Changed      ← altered existing behavior
### Deprecated   ← still works, stop using it (removal version named)
### Removed      ← gone (migration path named)
### Fixed        ← bugs resolved
### Security     ← always list, always first if present
```

Reverse-chronological; ISO dates; every version a compare-link (`[2.14.0]: …/compare/v2.13.0...v2.14.0`); `Unreleased` accrues as PRs merge so release day is a rename, not an archaeology dig. **Order within a release: Security, then breaking changes, then the rest** — lead with what can hurt the reader.

## The translation pass (commit-speak → consequence-speak)

| Commit says | Changelog says |
|---|---|
| `fix: race condition in token refresh mutex` | Fixed: rare logouts during long sessions. |
| `feat(api): add cursor param to /invoices` | Added: invoice list API now paginates reliably past 10k invoices — see the pagination docs. |
| `perf: memoize report aggregation` | Changed: large reports load ~3× faster (12s → 4s on 50k-row accounts). |
| `fix(a11y): focus trap in settings dialog` | Fixed: the settings dialog no longer traps keyboard focus. |
| `chore: bump internal build tooling` | *(omitted — no user consequence)* |

The move is always: drop the mechanism, state the consequence, name the numbers when you have them. If a mechanism matters to users (API shape), link the docs instead of inlining the internals.

## The audience test

Include iff a user would change behavior or feel the difference. Internal refactors, CI, dependency bumps (unless they fix a CVE users care about, or change requirements — "now requires Node 20"): out or rolled up. One honest line — "Plus internal reliability work." — beats eleven `chore:` entries cosplaying as news. If nothing user-facing shipped, say so plainly rather than dressing up the plumbing.

## Breaking changes: migration inline

```markdown
### Removed
- **Breaking:** the legacy `/v1/export` endpoint (deprecated since 2.10).
  Migrate: `POST /v2/exports` returns a job id; poll `GET /v2/exports/{id}`.
  Before/after examples: docs/migrations/v2-exports.md
```

A breaking change without a migration path is a ransom note. The entry states: what breaks, since when it was deprecated, exactly what to do, and where the worked example lives.

## Tone

Plain, specific, zero marketing. "Faster exports" is a claim; "exports of 50k rows complete in ~4s, down from ~12s" is a changelog entry. Superlatives, exclamation points, and "we're excited" belong in the launch post (a different artifact with a different owner) — a changelog that hypes reads as a changelog that hides. Credit external reporters/contributors by handle; it costs a parenthesis and builds a community.

## Automation posture

Generate the **draft** from Conventional Commits (release-please / changesets / git-cliff group by type for free), then a human runs the translation pass, applies the audience test, and orders by reader impact. Shipping the raw generation is publishing your commit log with a fancier font — the tooling saves the gathering, never the writing.
