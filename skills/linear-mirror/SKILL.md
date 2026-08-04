---
name: linear-mirror
description: Keep every Multica issue mirrored to its n8n Linear issue - create the Linear issue when a Multica issue is created or first touched, write the identifier into the `linear` property, mirror status moves, parent sub-issues, and reconcile drift. Use whenever you create a Multica issue or sub-issue, whenever you split work during triage, whenever you move an issue to in_progress or in_review, whenever a report goes Blocked, whenever the `linear` property is empty or looks wrong, whenever an issue is being cancelled or deleted, whenever asked why work isn't showing up in Linear, and whenever someone says "mirror", "Linear ticket", "CAT-", "visibility", or "is this on the board".
---

# Linear Mirror

n8n's working process runs on Linear. NIGHTSHIFT runs in Multica. The mirror is what makes the crew's work exist in both — on the Operator's Linear board, under the Operator's name, with the Multica thread as the working record.

**Values live in `linear-map.md`** — assignee, team, status map, project map — either in the repo or pasted into your instructions. **Law lives in the constitution §13.** This is the how. Can't see the values at all? `🔶 Blocked`; never guess an assignee or a project.

## The contract — five invariants

1. Every Multica issue carries a `linear` property holding its Linear identifier (`CAT-3686`). Empty = unmirrored = a bug.
2. One Multica issue ↔ exactly one Linear issue. Forever. Read the property before creating anything.
3. Every Linear mirror is assigned to **Alex Grozav** (`alexgrozav`). No exceptions, no agent identities, no other humans.
4. Status moves in Multica move Linear in the same turn. `done` and `cancelled` are the Operator's on both sides.
5. Removing a Linear issue needs the Operator's explicit, named approval. Every time. No standing permission exists.

**The mirror never costs its own comment.** It rides the turn's report as one line — `Linear: CAT-3686 (created)` / `Linear: CAT-3686 → Review`. Reconciliation sweeps are the one exception: they report as a summary because that *is* the work.

## A — Create the mirror

**Trigger:** you created a Multica issue (or sub-issue), or you are the first agent to touch one whose `linear` property is empty. On squad-assigned issues that's @trigger at triage; on directly-assigned ones it's the assignee's first turn.

1. **Read the `linear` property first.** Non-empty → the mirror exists; skip to B. This step is not optional and not skippable "because I just made it".
2. **Resolve the target** from `linear-map.md`: the Multica project's mapped Linear project + team. Unmapped project → stop, `🔶 Blocked`, propose the row (see failure modes).
3. **Create the Linear issue:**

| Linear field | Value |
|---|---|
| Title | The Multica title, verbatim — *unless* n8n's security-fix or customer-confidentiality hygiene applies, then the neutral functional rewrite |
| Description | The Multica body, then the mirror footer (below) |
| Assignee | **Alex Grozav**, always |
| Team / project | From the project map row |
| Status | Whatever the status map says for the Multica status *right now* — usually `Backlog` at filing, `In Progress` if you're starting this turn |
| Priority | Severity ladder → Linear priority: P0/P1 → Urgent/High · P2 → Medium · P3 → Low. No severity yet → leave unset, don't invent one |
| Parent | The parent Multica issue's `linear` identifier, when this is a sub-issue |
| Labels | Only labels that already exist in the team; never create labels to mirror |

4. **Mirror footer** — last lines of the Linear description, so anyone on the n8n side can find the working thread:

```
---
NIGHTSHIFT mirror · Multica <multica-issue-id> · owner @<handle>
<multica-issue-url>
```

5. **Write the identifier into the `linear` property.** The mirror is not created until this lands — without it the next turn creates a duplicate.
6. **Report it** on the existing report line: `Linear: CAT-3686 (created)`.

**Splitting (@trigger):** the parent's mirror comes first, then one Linear issue per sub-issue, each parented to the parent's identifier and carrying the sub-issue's own severity and due date. The Linear tree matches the Multica tree — a split that flattens the hierarchy on the Linear side makes the parent's roll-up lie.

## B — Mirror a status move

Same turn, both places. The Multica move is the trigger; the Linear write is not a follow-up task.

| You do this in Multica | Write this in Linear |
|---|---|
| `in_progress` on your first working turn | **In Progress** |
| `in_review` on delivery | **Review** |
| Report `🔶 Blocked` (status stays `in_progress`) | **Blocked** — and back to **In Progress** when it clears |
| Nothing — you're mentioned, not assigned | **Nothing.** Not your status, not your mirror write |

Re-assert the assignee on every status write: Alex Grozav. If someone else is on it, restore Alex and note it in one line — no argument, no thread.

**When Linear is already ahead** (a human moved it, or it sits in `Triage`/`Todo`/`Duplicate`): don't overwrite, don't fight. Report the divergence and let the Operator resolve it. The mirror serves the board; it doesn't police humans on it.

**PR linkage** — the other half of visibility, and it's mechanical: branch `agent/<handle>/cat-3686-<slug>`, PR body linking `https://linear.app/n8n/issue/CAT-3686`. Linear autolinks both, so the Linear issue shows the branch and PR without anyone attaching them.

## C — Cancel or delete: always ask

Cancelling or deleting a Multica issue means its Linear issue goes too — **and the removal is never the agent's call.** This sits on the constitution's §10 safety-rail list: destructive, and it destroys a record the Operator's colleagues may be reading.

Post the ask, then stop. One comment, both options, the recommendation named:

```
🔷 Needs decision — mirror removal for CAT-3686
Multica <id> is being cancelled. Its Linear mirror needs a call:
  a) Cancel it (Canceled status, record kept, reversible) — recommended
  b) Delete it (moved to Linear trash, links from PRs and threads break)
Cancelled Multica work usually wants (a). Say "Approved: cancel CAT-3686"
or "Approved: delete CAT-3686".
```

- **"Approved: cancel CAT-3686"** → set status **Canceled**, leave everything else, note it in the report. The `linear` property stays — the pairing is history, not garbage.
- **"Approved: delete CAT-3686"** → delete, then clear the `linear` property and say what was deleted, in the thread, by identifier.
- **Anything else** — "yeah drop it", 👍, "not needed anymore", silence — is **not** authorization. Ask once more, naming the action. Never infer a removal.
- Sub-issues: ask once for the set, list every identifier in the ask. Never delete a parent and orphan its children.

## D — Reconcile drift

The sweep (autopilot #7) and any agent that spots a mismatch. Five checks, in order:

| Check | Finding | Fix |
|---|---|---|
| `linear` empty on a live issue | Unmirrored work — invisible to n8n | Run **A** |
| Status pair disagrees | Board lies about the week | Multica ahead → write Linear (**B**). Linear ahead → report, don't overwrite |
| Assignee ≠ Alex Grozav | Visibility broken at the point of the whole exercise | Restore, note it |
| Linear issue in the wrong project / no project | Roll-ups wrong | Move per the map; unmapped → propose the row |
| Property points at a deleted or archived Linear issue | Dangling pairing | Report it. Never silently recreate — a recreated mirror loses the original's history and comments |

Two mirrors for one Multica issue is the worst finding: report both identifiers, recommend which to keep (the one with history), and let the Operator decide. Never merge or delete either one unasked.

## Failure modes — loud, never silent

| Situation | What you do |
|---|---|
| No Linear MCP, or no write scope | `🔶 Blocked — cannot mirror (Linear MCP write access missing)`. A tooling gap, and it stays visible until fixed |
| The `linear` property won't write | `🔶 Blocked` naming it — **and** put the identifier in the report so the pairing isn't lost while the gap is open |
| Multica project not in the map | `🔶 Blocked` + the proposed row: Multica project · target Linear project (or "new project needed") · team. Never guess a project |
| Linear issue created, property write failed | Identifier goes in the report **now**. Next turn finishes the property write. **Never create a second issue** |
| Linear API error mid-create | Retry once. Still failing → `🔶 Blocked` with the error. Check whether the issue was created before retrying — half-created beats double-created |
| Multica issue has no project at all | Fine — team backlog, no project. For project work, ask which project |

Never fabricate an identifier, never report a mirror you didn't verify exists, and never skip the mirror quietly because the run was in a hurry. An unmirrored issue is work that didn't happen, on the only board n8n reads.

## Anti-patterns

- Creating the Linear issue without reading the `linear` property first — the duplicate-mirror generator.
- Assigning the mirror to the agent doing the work. The board shows the Operator; the thread shows the agent.
- Mirroring status "later" — a batched status catch-up is a board that was wrong all day.
- A separate comment per mirror action. It's one line on the report.
- Copying a security-fix title verbatim into Linear, where it becomes a public branch name.
- Treating "we don't need this anymore" as approval to delete.
- Re-creating a mirror whose Linear issue is gone, to make the sweep pass. That's cleaning the gauge, not the engine.
