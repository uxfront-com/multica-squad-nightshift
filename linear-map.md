# NIGHTSHIFT — Linear mirror map

> **What this file is:** the single home for the *values* the Linear mirror runs on — who the mirror assigns to, which status maps to which, and which Multica project lands in which n8n Linear project. The **law** lives in the constitution (`agents/_team-instructions.md` §13); the **procedures** live in the `linear-mirror` skill. This file is the lookup table both of them point at.
>
> **Why it exists:** the crew works in Multica; n8n's working process lives in Linear. Everything NIGHTSHIFT ships has to be visible on the Operator's Linear board — as the Operator's own work — or it didn't happen as far as n8n is concerned.
>
> **Edit here, nowhere else.** Agents read these values; when one changes, this is the only place it changes. Keep it in version control like the rest of the pack.
>
> **Getting it in front of the agents.** They can only read what their runtime can see. Either keep this pack in the repo the crew works in, or — when the target repo isn't yours to add squad config to, which is exactly the case for `n8n-io/n8n` — paste the three tables below (Identity, Status map, Project map) into Multica's workspace instructions field, or after the pocket card in each agent's instructions. This file stays the source of truth either way: edit here, re-paste, note it in the changelog. An agent that cannot see these values reports `🔶 Blocked` — it does not guess a project or an assignee.

---

## Identity — who the mirror writes as

| Field | Value |
|---|---|
| Linear workspace | `n8n` — `https://linear.app/n8n` |
| **Assignee — always, no exceptions** | **Alex Grozav** · `alexgrozav` · alex@n8n.io · `947bd2b3-1ac3-4b04-8293-d911937b5573` |
| Default team | **Catalysts** (`CAT`) · `c020c2a1-1f03-478f-8566-ae044122c556` |
| Multica link property | `linear` — holds the Linear identifier, e.g. `CAT-3686` |

The Linear board shows the Operator; the Multica thread shows which agent did the work. Same doctrine as commit authorship (constitution §11): their name, our hands. Never assign a mirrored issue to another human or to an agent identity — if something else is assigned there, restore Alex and say so in the thread in one line.

*(Verified against the Linear API on 2026-08-04: user, team, statuses, and projects below all resolve.)*

## The `linear` property

- **Value:** the Linear identifier, uppercase, no URL, no brackets — `CAT-3686`.
- A full URL pasted by a human is accepted on read and **normalised to the identifier** on the next mirror write.
- **Empty means unmirrored, and unmirrored is a bug.** A non-empty value means the mirror exists — read it before creating anything, always. Two Linear issues for one Multica issue is the failure this property exists to prevent.
- Cross-team mirrors keep their own prefix (`INS-859`, `DS-…`) — the property carries whatever team the map assigned, not always `CAT-`.

## Status map — Multica → Linear

The write direction is **Multica → Linear**. Multica is where the crew works; Linear is the record n8n reads.

| Multica status | Linear status (Catalysts) | Who moves it |
|---|---|---|
| `backlog` | **Backlog** | Whoever files it — parked, nothing runs |
| `in_progress` | **In Progress** | The assignee, on its first working turn |
| `in_review` | **Review** | The assignee, on delivery (PR open for code) |
| `done` | **Done** | The **Operator only** — agents never flip either side |
| `cancelled` | **Canceled** | The **Operator only** — and see §13's removal gate |

Two refinements, because a mirror that flattens them lies about the week:

| Situation | Linear status | Note |
|---|---|---|
| Multica `in_progress`, last report was `🔶 Blocked` | **Blocked** | Multica has no blocked status; Linear does. Back to **In Progress** when the block clears. |
| Parked by the zombie sweep (P3 + reason) | **Parked** | Distinguishes "deliberately shelved" from "never started". |

**Statuses the mirror never writes:** `Triage`, `Todo`, `Duplicate`. They belong to n8n's own intake and to the Operator. Find the Linear issue in one of them, ahead of Multica? Don't fight it — report the divergence and let the Operator resolve it.

## Project map — Multica project → n8n Linear project

Every Multica project has exactly one analogue Linear project. The mirror files the Linear issue into the mapped project and its team; an issue whose Multica project isn't in this table is a **`🔶 Blocked`**, never a guess.

The Linear column is verified and seeded from the Operator's projects; **fill the Multica column as projects are created** (`<unmapped>` = not yet paired).

| Multica project | n8n Linear project | Team | Project status | Project ID |
|---|---|---|---|---|
| `<unmapped>` | [Front End Modularization — Part 2](https://linear.app/n8n/project/front-end-modularization-part-2-98de154a9afe) | CAT | Backlog | `aa6475b5-e38b-4aab-9ccb-77a299005b66` |
| `<unmapped>` | [Frontend Performance Improvements](https://linear.app/n8n/project/frontend-performance-improvements-373152469707) | CAT | Later | `ed8c51b1-e420-4919-8f51-15e58635c39b` |
| `<unmapped>` | [Workflow CRDT Abstraction Layer](https://linear.app/n8n/project/workflow-crdt-abstraction-layer-42788d7f54d3) | CAT | Paused | `e973baa3-a005-4907-ab3d-dfa1d7a57ae6` |
| — | *(no project — team backlog)* | CAT | — | — |

**Rules for this table:**

- **One-to-one.** Two Multica projects pointing at one Linear project means the boards can't be read against each other — split the Linear side or merge the Multica side, don't overload a row.
- **A new Multica project is a mapping decision, and it's the Operator's.** An agent that needs a row proposes it (Multica project · target Linear project or "new project needed" · team) and waits.
- **Issues outside every project** mirror into the default team's backlog with no project — legitimate for one-off bugs and chores, never for project work.
- **Cross-team work** (e.g. an AI Assistant issue → `INS-…`) needs its own row naming that team; the default team is a fallback, not a dumping ground.
- Completed and canceled Linear projects are not mirror targets — [Keep UI responsive during manual execution](https://linear.app/n8n/project/keep-ui-responsive-during-manual-execution-869ebb8d12c7) (Completed) and [Front End Modularization](https://linear.app/n8n/project/front-end-modularization-829d4816add0) (Canceled) are deliberately absent above.

## What the mirror inherits from n8n's working process

The mirrored issue is an n8n artifact, so n8n's rules govern it — not just the pack's:

- **Branch names carry the Linear identifier**, so Linear auto-links the branch and PR to the issue: `agent/<handle>/cat-3686-<slug>`. The `agent/<handle>/` prefix keeps the pack's attribution; the identifier is what makes the work show up on the Linear issue without anyone linking it by hand. Prefer Linear's own suggested branch name for the slug.
- **The PR body links the Linear issue** as `https://linear.app/n8n/issue/CAT-3686` — n8n's convention, and the second half of the autolink.
- **Security-fix hygiene applies to the mirror.** n8n's repo is public and the branch name derived from a Linear title travels with it: a mirrored title never names the vulnerability or its class. Neutral and functional — "improve request handling", not the attack. This overrides the mirror's default "copy the Multica title verbatim".
- **Customer confidentiality applies to the mirror.** No customer names in mirrored titles, descriptions, or branch names — describe the use case neutrally.
- **n8n's "don't create Linear tickets unasked" rule is already satisfied.** The Operator asked for automatic mirror creation; that standing authorization covers mirror issues *only*. Anything beyond a mirror — a ticket for work nobody filed in Multica — still gets asked first.
