# Repo Scaffold — the environment enforces what the instructions request

Prompts drift; guardrails don't. Copy this folder's contents into the target repository so the norms in the agent instructions are *mechanically* required, not politely requested.

```
.github/pull_request_template.md      → every PR arrives in What/Why/Proof shape
.github/ISSUE_TEMPLATE/               → bug + feature intake match what the agents expect
.github/workflows/pr-title-lint.yml   → Conventional Commits enforced on PR titles (squash-merge = the commit)
.github/CODEOWNERS                    → review routing happens without anyone remembering
docs/adrs|rfcs|product/               → the trees the skills assume exist (adr, rfc, prd)
```

## Branch protection (GitHub → Settings → Branches → protect `main`)

Do this once; it converts "never push to main" from a rule into an impossibility:

- [ ] Require a pull request before merging · require **1 approval**
- [ ] Require status checks to pass: **PR title lint** + your CI job(s)
- [ ] Block force pushes · restrict deletions
- [ ] (Recommended) Squash merging only + require linear history — the linted PR title becomes the commit, so the changelog automation stays clean
- [ ] Apply the same protection to release branches if you cut them

## Linear autolinking (one connection, then it's free)

The mirror puts the work on n8n's Linear board; this makes the *code* show up there too, without anyone attaching anything:

- [ ] Connect the repository to Linear's GitHub integration once (Linear → Settings → Integrations → GitHub)
- [ ] Branches carry the mirrored identifier — `agent/<handle>/cat-3686-<slug>` — which is what Linear matches on
- [ ] PR bodies keep the `Linear:` line from the PR template

With those three, each Linear issue shows its branch, PR, and review state on its own. Without them the mirror still works; you just link things by hand, which means eventually you don't.

## Least-privilege reminder

Agents get their own machine credentials: single-repo PATs with `contents:write` + `pull_requests:write`, no admin, no secrets access. If an agent reports `🔶 Blocked — cannot push/open PR`, this checklist is where the answer usually lives.

Commit identity is separate from auth: the runtime's git config carries the **Operator's** GitHub name + email, so commits author as the Operator while the PAT merely signs the push (constitution §11). Agents post nothing conversational on GitHub — comments, reviews, and replies are off-limits by law; their voice there ends at the PR description.

## Optional: red main files its own issue

`../autopilots.md` (#6) pairs a tiny `workflow_run` relay in this repo with a Multica webhook autopilot, so a failed CI run on `main` opens a pre-triaged issue for the ops agent within minutes — the workflow snippet and webhook hygiene live there.
