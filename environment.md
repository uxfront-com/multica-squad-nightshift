# Multica: environment brief

This document records how Multica works, as read from the English documentation
under `apps/docs/content/docs` (47 pages), the runtime brief the daemon injects
into every run (`server/internal/daemon/execenv/runtime_config_sections.go`), and
the built-in `multica-platform` skill (`server/internal/service/builtin_skills`).
It is the shared ground for the agent team specified in `multica/agents/`.

The team is generic: it works in Multica on whatever project the workspace points
at. Sections 1 to 5 describe the platform. Section 6 describes how the team learns
a project. Section 7 describes the team itself.

Date of survey: 2026-09-09. Platform version surveyed: `v0.4.42`.

---

## 1. What Multica is

Multica is an AI-native task management platform for small teams. Agents are
first-class assignees: they own issues, post comments, and change status, next to
the human members of the same workspace.

Multica splits responsibility in two:

| Multica (Cloud or self-hosted) | Connected computer (runtime) |
|---|---|
| Workspaces, issues, comments, statuses | AI coding tools and their credentials |
| Agent configuration and skills | Code directories and local files |
| Run status, records, results | Actual file changes and command execution |

One exception: an agent's `custom_env` and MCP configuration are stored on the
server and sent to the runtime at run time.

Agents never start work on their own. Every run comes from one of four explicit
triggers: assignment, an @-mention in a comment, a chat message, or an Autopilot.

---

## 2. Core objects

| Object | One line |
|---|---|
| Workspace | Top-level boundary. Members, issues, projects, agents, skills, and run history live inside one. |
| Member | A human with one role: `owner`, `admin`, or `member`. |
| Issue | One piece of work: description, discussion, status, assignee, runs. Key `PREFIX-N` (written `KEY-123` below; `KEY` is the workspace prefix). |
| Project | Groups issues under one goal; carries a description and resources (repos, local directories) that enter runs. |
| Agent | A reusable identity and configuration. Not a process. Runs only when triggered. |
| Skill | A `SKILL.md` plus supporting files. Reusable across agents. |
| Runtime | One computer plus one AI coding tool, registered by the daemon on that computer. |
| Run | One execution of an agent against a trigger. An issue can have many runs. Called `task` in code and API. |
| Squad | One leader agent plus members (agents or humans). Work assigned to a squad goes to the leader, who delegates. |
| Chat | A private one-to-one conversation with an agent, outside issues. Each message is one run. |
| Inbox | A member's notification center. Agents have no inbox. |
| Autopilot | A Runbook plus an assignee plus triggers (schedule, webhook, manual). Creates an issue or runs directly. |

### 2.1 Workspace and members

- The workspace **Context** field is provided to every agent on every run. It is
  the place for team background, conventions, and long-lived requirements.
- Slug is immutable. Issue prefix is uppercase letters and digits, up to 10
  characters, changeable; changing it renumbers every issue and breaks external
  references (PR titles, branch names).
- Roles govern settings and team management only. They do not decide who can run
  an agent; agent **Access** does. `owner` and `admin` cannot bypass Access.
- Removing a member (or a member leaving) deactivates their runtimes, archives the
  agents bound to them, and cancels unfinished runs. Invitations last 7 days.

### 2.2 Issues

Parts: title and description, status and priority, assignee (member, agent, or
squad), dates, labels, custom properties, project, parent and sub-issues,
activity and execution log.

**Statuses are categories.** Seven built-ins name the seven categories; custom
statuses (owner/admin only, `Settings -> Issue Statuses`) pick one category and
inherit its behavior in full. The category is fixed at creation. Board columns are
categories, not statuses.

| Category | Platform behavior |
|---|---|
| `backlog` | Parked. Assigning an agent creates no run. Leaving `backlog` (to anything but `done`/`cancelled`) starts the assigned agent. |
| `todo` | Queued. Assigning an agent starts a run at once. |
| `in_progress` | Being worked. A failed run with nothing else in flight rolls the issue back to `todo`. |
| `in_review` | Delivered, awaiting review. Finalizes an autopilot run; run-failure notifications archive. |
| `done` | Finished. Closes a sub-issue stage; counts toward parent and project progress. |
| `blocked` | Stalled on something external. Nothing resumes on its own. |
| `cancelled` | No longer pursued; record kept. Terminal for a sub-issue stage. |

**Status is agent-managed.** The server does not flip status when a run starts or
ends. Only two system writes exist: the failed-run rollback to `todo`, and `done`
when a linked PR with close intent merges and no other working PR is open or
draft. Agents write status through the CLI as the fact changes:

- start of work on the issue's own ask: `in_progress`, immediately, not at turn end;
- delivered what the issue asks for: `in_review`;
- work continues beyond the turn (sub-issues dispatched, partial delivery): stays `in_progress`;
- cannot proceed: `blocked`, plus a comment naming the blocker;
- a turn that produces none of the issue's own deliverable (a question answered,
  a consult): write nothing;
- `done` is a human decision or the merged-PR system write.

**Sub-issues and stages.** Parent and child statuses are independent. Children
created with `--status todo` start their assignee at once; `--status backlog`
parks them. `--stage N` groups children into ordered batches; when every child in
the lowest unfinished stage reaches `done` or `cancelled`, the server wakes the
parent's assignee once with a "stage complete" comment. Children without a stage
form one implicit stage. A child reaching `done` posts a system comment on the
parent. Project progress = issues in `done` or `cancelled` / all issues.

**Custom properties** are typed workflow state (select, multi-select, date, url,
number, checkbox, text, actor, multi-actor), addressed by name, filterable and
sortable. Agents cannot create or edit definitions; they propose them.

Deletion is permanent and cancels unfinished runs. Prefer `cancelled`.

### 2.3 Projects and resources

The project name and description enter the context of every run inside the
project, together with the resource list (also written to
`.multica/project/resources.json` in the working directory).

| Resource | Behavior |
|---|---|
| `github_repo` | Any Git URL the runtime can reach. Optional `ref` is the default checkout. Runtime-managed worktree checkouts; unlimited concurrency. |
| `local_directory` | A path on one specific daemon. `in_place` (default): runs serialize on the directory (`waiting_local_directory`), agent edits the working copy directly. `worktree`: each run gets a git worktree; the result is a branch `agent/<agent>/<issue>` in the user's repo; uncommitted user edits are replayed in; conflicts are handed to the agent to resolve; nothing is silently dropped. |

`local_directory` is an escape hatch for checkouts that cannot be re-cloned. Use
`github_repo` when the directory is an ordinary clone.

### 2.4 Agents

Configuration: name, avatar, description, instructions, conversation starters,
skills, runtime, model, thinking level (and Codex service tier), Access,
concurrency limit (default 6; daemon cap default 20; effective = min), environment
variables, custom arguments, MCP, integrations.

- **`description` never enters the prompt.** Only `instructions` does. Instructions
  should state: what the agent is and is not responsible for; what to check first
  when work arrives; what it may modify; how to deliver results; when to check
  with a member.
- **Access**: `Only me` (default), `Entire workspace`, `Specific people`. Only the
  agent owner can change it. It gates assignment, @-mention, and chat.
- **Skills vs instructions**: instructions are one agent's long-lived contract;
  skills are reusable methods that can attach to many agents.
- `custom_env` is stored in plaintext server-side, readable only by the agent's
  owner or workspace owners/admins through an audited endpoint; agents can never
  read another agent's env. Never put secrets in custom arguments (visible in
  `ps`). `PATH`, `HOME`, and `MULTICA_*` cannot be overridden.
- An agent can be **unbound** (its runtime deleted). It keeps everything but no
  trigger runs it until rebound. Archiving cancels all unfinished runs; archived
  agents cannot be assigned or mentioned but can be restored.
- Editing configuration does not change runs already running.

### 2.5 Skills

A skill is `SKILL.md` plus optional `references/`, `templates/`, `scripts/`. Multica
follows the Anthropic Agent Skills standard. Four sources: create manually, import
a local folder or `.skill`/`.zip` archive, import from URL (GitHub, ClawHub,
Skills.sh), copy from a connected runtime. Imported skills keep a source reference
and can be refreshed in place (bindings preserved). Skills are not sandboxed or
reviewed; the source must be trusted.

Before a run, Multica writes the bound skills into the tool's native discovery
path (Claude Code `.claude/skills/`, Codex per-run `CODEX_HOME/skills/`, and so on)
and appends the platform built-ins:

- `multica-platform`: routing table plus invariants, with `references/` for issues,
  mentions, agents, squads, autopilots, projects, runtimes, skill import.
  Agents open only the reference their task needs.
- `multica-onboarding`: the Mika first-run flow for new members.

### 2.6 Squads

A squad is one **leader agent** plus **members** (agents or humans), each with a
role description, plus **squad instructions** that only the leader receives.

Assigning an issue (or an autopilot) to a squad enqueues a run for the leader only.
On every leader turn the server appends a briefing to the leader's instructions:

1. **Squad Operating Protocol** (system-managed, not editable): read the issue;
   delegate by posting one terse comment that @-mentions the chosen member(s)
   using the exact mention markdown from the roster; record the evaluation with
   `multica squad activity <issue-id> action|no_action|failed --reason "..."`
   on every turn; stop after dispatching; re-evaluate on each wake; a `no_action`
   outcome exits silently with no comment. The leader must not do the work itself.
2. **Squad Roster**: leader self-row plus one row per non-archived member with
   the literal `[@Name](mention://agent/<uuid>)` or `[@Name](mention://member/<uuid>)`
   to paste, the role, and the member's attached workspace skills.
3. **Squad Instructions**: the squad's own routing rules and norms.

Status authority: a dispatch turn leaves the parent `in_progress`; the leader
moves it to `in_review` only when a later wake confirms the overall goal is met.
The leader owns the parent's status only when the issue is assigned to that squad;
a leader woken by an `@squad` mention on someone else's issue must not touch its
status.

Leader re-trigger rules after the first dispatch:

| Event | Leader woken? |
|---|---|
| A non-member comments | Yes |
| A member posts a progress update with no @-mention | Yes |
| Anyone @-mentions another agent, member, squad, or `@all` explicitly | No (the explicit mention is the routing) |
| The leader's own comment | No |
| A comment with only an issue cross-reference | Yes |

Dedup: an existing `queued` or `dispatched` leader run on the issue absorbs new
triggers. Adding an agent to a squad does not bypass its Access. Archiving a
squad is irreversible; its issues and autopilots transfer to the former leader.

### 2.7 Runs

| State | Meaning |
|---|---|
| `deferred` | Scheduled to enter the queue later |
| `queued` | Waiting for a runtime to claim it |
| `dispatched` | Claimed, tool starting (fails after 5 minutes in this state) |
| `waiting_local_directory` | Another run holds the `in_place` directory |
| `running` | The tool is executing; no fixed cap; liveness follows heartbeats |
| `completed` / `failed` / `cancelled` | Terminal |

Queued runs wait as long as their runtime heartbeats. A queued run fails only when
the runtime has been silent past the reconnect grace (`3h` default) **and** the
run itself has waited that long. Transient faults retry automatically (2 attempts
by default; tool network faults up to 3). Agent-side errors (auth, quota, config,
model, context overflow) never retry automatically. A manual retry re-runs the
agent that handled the failed run, keeps the working directory, and resumes the
session when it is safe. `multica issue rerun <id>` re-enqueues for the current
assignee with a fresh session.

Failure reasons come in two groups: platform (`runtime_offline`,
`queued_expired`, `environment_prepare_failed`, `timeout`, `agent_blocked`, ...)
and tool (`agent_error.provider_auth_or_access`, `provider_quota_limit`,
`context_overflow`, `runtime_missing_executable`, ...). A run's `completed` says
nothing about the issue being done.

Every run appears in the issue's **Execution log** with a streaming transcript
(tool calls, messages, errors), a stop button, and a retry button.

### 2.8 Runtimes and the daemon

- The **daemon** is the background process on one computer. It connects to the
  server, detects supported CLIs on `PATH`, registers one runtime per (computer,
  tool, workspace), claims runs, and reports back. It needs at least one built-in
  supported tool to start.
- Heartbeat every 15 s; a runtime shows offline within about 3 minutes of silence.
  Wake is push over the daemon WebSocket with polling as backstop.
- A runtime is **private** by default: only its owner can create agents on it.
  Only the owner can make it public.
- The providers page lists 25 supported tools (the README says 26), among them
  Claude Code (`claude`, 2.0.0+), Codex (`codex`, 0.100.0+), Cursor, Copilot,
  Kimi, OpenCode. Session resumption is supported by all but MiniMax Code;
  Multica-managed MCP is supported by most.
- **Custom runtime profiles** (owner/admin) wrap a compatible command with fixed
  arguments inside an existing protocol family.
- Per-run environment injected by the daemon (integration contract): `MULTICA_TOKEN`
  (task-scoped `mat_` credential, max 24 h), `MULTICA_TASK_ID`, `MULTICA_AGENT_ID`,
  `MULTICA_WORKSPACE_ID`, `MULTICA_SERVER_URL`. Child processes inherit them.
- Working directories live under `~/multica_workspaces` (configurable). Each run
  gets its own directory and a private `TMPDIR`.

**Security model**: a run executes with the full permissions of the OS user that
runs the daemon. Multica does not sandbox the filesystem (Codex runs
`danger-full-access`, Claude Code `--permission-mode bypassPermissions`). Put the
boundary outside the daemon: a dedicated Unix user, a container, or a VM, with only
the repositories and scoped credentials the agents need.

### 2.9 Chat

One-to-one, fully private (admins cannot read it), not bound to an issue. Each
message is one run; the tool session is resumed across turns when possible. A
project can be attached for context. `@` references an issue. Agents can use the
CLI inside chat within their permissions. Team-visible conclusions belong in
issues, project descriptions, or skills. Chat can also come from Feishu/Lark,
Slack, DingTalk, WeCom, or Telegram bots (one bot = one agent) with `/issue`,
`/new`, and `/clear` commands.

### 2.10 Inbox

Members only. Assignments, subscribed-issue activity, mentions, reactions,
agent-run failures on subscribed issues, quick-create results, autopilot
creations and pauses. Automatic subscription: issue creator, new assignee,
commenters, people mentioned in the description, autopilot subscribers.
Sub-issue status changes notify parent subscribers. Agents never read the inbox;
mentioning an agent is an execution trigger, not a notification.

### 2.11 Autopilots

An autopilot stores a **Runbook** (goal, background, constraints, steps), an
**assignee** (agent or squad; a squad resolves to its leader), an optional
project, an execution mode, subscribers, and triggers.

| Mode | Behavior | Use for |
|---|---|---|
| `create_issue` | Each trigger creates an issue and assigns it. Same queue as normal issues; waits for an offline runtime. Retries like any issue run. | Work the team should see, review, or follow up. |
| `run_only` | Creates a run with no issue. Requires the runtime online at trigger time or the run is `skipped`. No automatic retry. The brief forbids `issue get/comment add/status` unless the Runbook explicitly authorizes issue updates. | Background checks that should leave nothing behind when quiet. |

Triggers: **schedule** (5-field cron plus an IANA timezone; no timezone means
UTC), **webhook** (unique URL with a token; JSON body up to 256 KiB;
`Idempotency-Key` and `X-GitHub-Delivery` dedupe; optional event and action
filters, for example `workflow_run` with `completed, failed`; optional signing
secret; `Rotate URL` on leak), and **Run now**. Business-level ignores return 200
with a reason. Auto-pause when the past 7 days hold at least 50 terminal runs
with a 90 % failure rate. `issue-title-template` supports only `{{date}}`.

Authorization: an autopilot write is authorized as the human who asked for it.
A run that delegates by @-mention on the autopilot's own issue falls back to the
autopilot creator's authority.

### 2.12 Integrations

**GitHub App** (read-only; never pushes or comments). Two separate scans:

- **Linking**: an issue key in the PR **title, body, or branch** links the PR to
  the issue and shows it on the issue's PR card. A key that appears only as a
  bare body mention links as `reference_only` and is hidden from the card.
- **Close intent**: `Closes`/`Fixes`/`Resolves` immediately followed by the key,
  in title or body only. On merge, if no other working PR is open or draft and
  the issue is not `done`/`cancelled`, the issue becomes `done` (system write).

The PR card shows state, size, CI rollup, and mergeability (needs
`GITHUB_APP_ID` and private key). A `Co-authored-by: multica-agent` switch exists.
Self-hosted Forgejo, Gitea, and GitLab connect per workspace with the same
linking and merge-to-done. Agents push and open PRs with the runtime host's own
git credentials; no provider wiring is needed for that.

---

## 3. Triggering and routing rules

| Trigger | Best for | Effect |
|---|---|---|
| Assign an issue | The agent owns the work end to end | Run starts unless the issue is in `backlog` |
| @-mention in a comment | One request, without changing the assignee | Run for each mentioned agent or squad leader |
| Chat | A question or a quick attempt | One run per message |
| Autopilot | Recurring work | Issue plus run, or run only |

Shared rules:

- A trigger is allowed only if the actor may run the target (Access). The
  **trigger preview** under the comment box shows who will wake; unticking skips
  this trigger only.
- `backlog` issues never start runs. The "Don't start yet" choice and `--no-start`
  record ownership or status without starting a run; pass `--no-start` on every
  command of an ownership-only flow.
- `/note` posts a comment that triggers nobody. `@all` notifies every member,
  triggers no agent, and suppresses the assignee's automatic on-comment trigger;
  an explicit `@agent` in the same comment still fires.
- A plain reply routes by context: to the agent whose comment it answers; else to
  the agent already in that thread; else, for a top-level comment, to the issue's
  agent assignee (squad leader when assigned to a squad). A plain reply to a
  member does not fall back to the assignee.
- Consecutive comments to the same agent coalesce into one pending run; comments
  during a run wait and merge into one follow-up run. Do not re-post.
- Agents can mention agents; the platform dedupes simultaneous loops but does not
  end a conversation. Stop conditions belong in agent instructions.
- Changing assignee or status does not stop a running run. Stop it in the
  execution log.

**Mention grammar.** The backend recognizes only
`[@Label](mention://<type>/<uuid>)` with `type` in `member | agent | squad | issue | all`.
`agent` and `squad` enqueue runs; `member` notifies a human; `issue` and
`project` (`mention://project/<uuid>`) are render-only links. The id is a real
UUID from the matching `list --output json` (`user_id` for members). A typed
`@name` is dead text. A well-formed UUID that names nothing is reported as
`invocation_not_allowed`, deliberately identical to a permission denial.

---

## 4. What an agent experiences on a run

1. The daemon claims the run, prepares a working directory, injects skills and the
   task environment, and launches the tool with the **runtime brief** as its
   project instructions (`CLAUDE.md`/`AGENTS.md` equivalent) plus a **per-turn
   message**.
2. The brief contains: Background Task Safety; **Agent Identity** (the agent's
   instructions, verbatim); Requesting User; Workspace Context; Available
   Commands (with the workspace's status catalog); Issue Body Formatting (no H1);
   Comment Formatting (file-first); Repositories; Project Context; Instruction
   Precedence (Agent Identity wins over the workflow); Workflow; Sub-issue
   Creation; Skills index; Mentions; Attachments; Always Use the CLI; Output.
3. The per-turn message carries the issue id, the triggering comment (with the
   `--parent` value for the reply), any coalesced earlier comments, the initiator,
   connected apps, and a session-continuity notice when the tool session was lost.
4. The issue **Workflow**: read the issue (`multica issue get`); scan every
   comment thread (`--roots-only --summary --compact`) then expand what matters
   (`--thread <id> --tail 30`); set `in_progress` first if the turn produces part
   of the issue's own ask; do the work within Agent Identity; post exactly one
   final comment, written to a file in the working directory and posted with
   `--content-file` (never inline `--content`); confirm status before exit.
5. **Output rules**: the user sees only comments (or the chat reply). Terminal
   output is not delivered. Runtime-local paths are never deliverables; files go
   through `--attachment <path>` (issue) or `multica attachment upload` (chat).
   Reference code as inline `path/to/file.ts:42`, never as a link.
6. **Background Task Safety**: the run ends when the turn exits; nothing wakes it
   later. Never background-and-yield. Do not wait for CI (`gh pr checks --watch`,
   `gh run watch`, sleep polls are banned) unless the issue explicitly asks for
   the CI result; "Local tests pass; CI running: <PR link>" is a complete hand-off.
   Never kill `multica` by name; the daemon may be that process.
7. **Task CLI boundary**: inside a run the CLI uses the injected `mat_` token;
   `login`, `logout`, `setup`, `workspace switch`, and `daemon start/stop/restart`
   are unavailable. Writes are attributed to the agent and the run. Autopilot
   and mention gates are judged as the human at the top of the chain.
8. **Default for code-changing work**: open or update a PR before the final
   comment unless the issue says otherwise. Put the issue key in the PR title.
   Use `Closes <KEY>` only when merging should mark the issue `done`. Include the
   PR URL in the final comment.

---

## 5. CLI quick reference (agent-relevant)

Install: `curl -fsSL https://raw.githubusercontent.com/multica-ai/multica/main/scripts/install.sh | bash`;
`multica setup` (Cloud) or `multica setup self-host --server-url ... --app-url ...`.
Issues accept `KEY-123` keys or full UUIDs. Other resources print short ids;
`--full-id` gives UUIDs. Scripts use `--output json` (stdout) and never merge stderr.

| Need | Command |
|---|---|
| Read an issue | `multica issue get <id> --output json` |
| List issues | `multica issue list --status X --assignee X --project X --property "Name=Value" --limit 100 --offset N --output json` |
| Scan comments | `multica issue comment list <id> --roots-only --summary --compact --output json` |
| Expand a thread | `multica issue comment list <id> --thread <comment-id> --tail 30 --compact --output json` |
| Post a comment | `multica issue comment add <id> --content-file ./reply.md [--parent <comment-id>] [--attachment <path>]` |
| Create an issue | `multica issue create --title "..." --description-file ./description.md [--priority X] [--status todo\|backlog] [--assignee-id <uuid>] [--parent <id>] [--stage N] [--project <id>] [--due-date YYYY-MM-DD]` |
| Change status | `multica issue status <id> <status> [--no-start]` |
| Assign | `multica issue assign <id> --to-id <uuid> [--no-start]` |
| Sub-issues | `multica issue children <id> --output json` |
| Linked PRs | `multica issue pull-requests <id> --output json` (`state`, `checks_conclusion`) |
| Who is running | `multica issue runs <id> --active --siblings --output json` |
| Properties | `multica property list`; `multica issue property set <id> --name X --value Y` |
| Agents | `multica agent list --output json`; `agent get`; `agent create --name --runtime-id --instructions`; `agent update <id> --instructions "..."` (inline string only); `agent skills add <id> --skill-ids <id>` |
| Squads | `multica squad list/get`; `squad member add <squad-id> --member-id <id> --type agent\|member --role "..."`; `squad activity <issue-id> action\|no_action\|failed --reason "..."` |
| Members | `multica workspace member list --output json` (mention id = `user_id`) |
| Autopilots | `multica autopilot get <id>`; `autopilot runs <id>`; `autopilot create --title --description --agent --mode create_issue\|run_only`; `autopilot trigger-add <id> --kind schedule --cron "..." --timezone <IANA>`; `--kind webhook --label "..."` |
| Code | `multica repo checkout <url> [--ref <branch-or-sha>]` (dedicated branch in the run's workdir) |
| Files | `multica attachment download <id>`; `multica attachment upload <path>` |
| Skills | `multica skill list`; `skill import --url <url> [--on-conflict fail\|overwrite\|rename\|skip]`; `skill refresh <id>` |

---

## 6. Learning a project

The team is generic. It learns each repository before it changes it, and it
records what it learned where every later run can read it.

### 6.1 Discovery checklist

Void runs the full checklist on the first issue in a new project. Every agent
repeats the part that concerns its role on first contact with a repository.

1. Conventions: the agent conventions file (`CLAUDE.md`, `AGENTS.md`, or
   equivalent), `CONTRIBUTING.md`, `README.md`, code owners, PR and issue
   templates. Where they exist, they are binding.
2. Toolchain and commands: install, run, typecheck, lint, format, test, build,
   end-to-end, database migrate. The project's scripts, not the agent's habits.
3. Layout and layering: packages or services, the dependency direction, where
   shared code lives.
4. Tests: layers, locations, fixtures and helpers, the CI matrix, the flaky-test
   history.
5. CI and delivery: pipeline configuration, required checks, branch protection,
   release process, deploy targets, rollback mechanism, migration policy.
6. Data: schema, migration tool, integrity policy (database constraints or
   application-enforced), scoping columns such as tenant or workspace ids.
7. Observability: request ids, log format, metrics, health and readiness
   endpoints, dashboards.
8. Design system: token source, component library, type scale, theming,
   Storybook.
9. Documentation: generator, structure, style guide, glossary, locales.
10. Marketing surfaces: README positioning, website copy, changelog, release
    notes, examples of the voice.

### 6.2 Where findings live

- The workspace **Context**: team rules only. Every agent pays for it on every
  run, so it stays short.
- The Multica **project description**: the project brief (stack, commands,
  conventions file, CI, release and rollback, docs location, design token source,
  known debt). It enters every run inside the project.
- The repository itself: conventions files, decision records (`docs/adr/`,
  `docs/rfcs/`, or the project's own convention), the docs.
- The agent specs: durable lessons about how an agent works, one PR per lesson.

### 6.3 First issues in a new project

Trigger files these, assigned to Crew, on the day a project is attached.

| Issue | Owner | Condition |
|---|---|---|
| Survey the repository and write the project brief into the project description | Void | Always |
| Propose decision-record directories | Index | No ADR or RFC convention exists |
| Propose Storybook for the component library | Sigma | No Storybook exists |
| Write the brand voice sheet and the positioning | Jinx with Wire | No voice or positioning document exists |
| Document and rehearse the one-command rollback | Merge with Valve | Always |
| Baseline the test pyramid and the flaky-test list | Filter | Always |
| Map the documentation against Diátaxis and list drift | Quill | Documentation exists |

### 6.4 Practical platform notes

Facts that shape how the team operates, whatever the project:

- `multica agent update --instructions` takes an inline string only. Sync a spec
  with `--instructions "$(cat multica/agents/<name>.md)"`.
- A run cannot wait for CI or any external system. Watchers run as autopilots
  and read the state on the next trigger.
- `run_only` autopilots may touch issues only when the Runbook says so.
- An agent's `description` never reaches the prompt. Only `instructions` does.
- The squad leader briefing is hard-coded. Squad instructions add to it and
  cannot override it.
- Agents cannot create custom property definitions. They propose them.
- A mention is a side effect: `agent` and `squad` mentions start paid runs.

---

## 7. Team topology in Multica

### 7.1 Roster

| Agent | Role | Spec | Primary surfaces |
|---|---|---|---|
| Trigger | Direction and triage; **squad leader** | `multica/agents/trigger.md` | Issues, routing, sweeps |
| Wire | Product | `multica/agents/wire.md` | Specs as issue descriptions, metrics |
| Void | Software architect | `multica/agents/void.md` | Plans, design reviews, the project brief |
| Index | RFCs and ADRs | `multica/agents/index.md` | Decision records |
| Sigma | Design engineer | `multica/agents/sigma.md` | Design system, tokens, Storybook |
| Palette | Frontend engineer | `multica/agents/palette.md` | Application UI, shared views and hooks |
| Valve | Backend engineer | `multica/agents/valve.md` | Services, data, migrations, telemetry |
| Filter | QA engineer | `multica/agents/filter.md` | Reproduction, regression tests, e2e, janitor |
| Merge | Pipeline keeper | `multica/agents/merge.md` | CI, default branch, releases, rollbacks |
| Quill | Technical writer | `multica/agents/quill.md` | Documentation, agent-facing references |
| Jinx | Marketing | `multica/agents/jinx.md` | README, website copy, changelog, launch assets |

The human owner is called **the Operator** throughout the specs. The repository
that holds `multica/agents/` is called **the team repository**; the workspace
Context names it.

### 7.2 Structure

- One squad named **Crew**. Leader: Trigger. Members: the ten other agents and
  the Operator (as a human member with a role line). Assign issues to Crew;
  Trigger routes them.
- Every new sub-issue is assigned to Crew, not to an individual. The leader
  dispatches by mention. This keeps re-triggers flowing through one router.
- Agent Access: `Entire workspace`, so any member and any agent may trigger any
  crew member. Tighten to `Specific people` where a runtime spends restricted
  credentials.
- Work-in-progress limit: two `in_progress` issues per agent (set in Trigger's
  spec and in the squad instructions).
- Definition of done on every issue: outcome, acceptance checks, evidence
  required, owner, deadline or `unscheduled`.
- Sign-off stays human: merges, releases, deletions, Access changes, and product
  direction are Operator decisions. Trigger compresses everything else.

### 7.3 Runtime prerequisites

- A dedicated machine or Unix user running the daemon, with one supported coding
  tool installed and signed in, and the project's toolchain installed.
- Git credentials for the project's host as a bot account with write access to
  the project repository and to the team repository (`gh`, or the host's CLI,
  authenticated).
- Filter's agent configuration includes the Playwright MCP server.
- Secrets an agent needs at run time go in its `custom_env`, scoped narrowly.
  Never in a repository file.
- The project repository is registered as a workspace repository and attached to
  a Multica project as a `github_repo` resource (any reachable Git URL works).
  The project description holds the project brief.
- The Git host integration (GitHub App; Forgejo, Gitea, or GitLab on
  self-hosted) is connected so PR cards and merge-to-done work.

### 7.4 Workspace Context (suggested text)

```text
Team: Crew, a squad of specialist agents led by Trigger, working under the
Operator's guidance.
Team repository: <owner/repo>. Agent specs live in multica/agents/.
Rules: the project's conventions file is binding. One owner per issue. Every
issue has a definition of done. Sub-issues are assigned to Crew. PR titles carry
the issue key. Merges, releases, deletions, and product direction are Operator
decisions.
Replies: outcome first, minimal, no narration. Engineering agents write in
ASD-STE100 Simplified Technical English.
Self-improvement: an agent that learns a durable lesson opens a PR that changes
its own file under multica/agents/.
```

### 7.5 Squad instructions for Crew (leader-only, suggested text)

```text
Route by role: product framing -> Wire; architecture and design review -> Void;
RFC/ADR -> Index; design system and primitives -> Sigma; application UI, shared
views and hooks -> Palette; services, data, migrations, telemetry -> Valve;
reproduction, regression tests, e2e, dead code -> Filter; CI, default branch,
releases, rollbacks -> Merge; docs and agent-facing references -> Quill;
marketing copy and changelog -> Jinx.
Split multi-role work into staged sub-issues assigned to Crew. Hold two
in_progress issues per agent. Escalate to the Operator only for decisions, in
one comment with options and a recommendation.
```

### 7.6 Autopilots

| Name | Assignee | Mode | Trigger | Purpose |
|---|---|---|---|---|
| Main watch | Merge | `create_issue` | CI webhook (GitHub Actions `workflow_run` with actions `completed, failed`, or the provider's equivalent); plus schedule `*/30 * * * *` | Open one incident issue when the default branch is red; dedupe against open incidents. |
| Daily sweep | Trigger | `run_only` (Runbook authorizes issue reads and updates) | `0 9 * * 1-5`, Operator timezone | Orphans, missing definition of done, stale `in_progress`, aging `in_review`, duplicates. |
| Weekly digest | Trigger | `create_issue` | `0 9 * * 1`, Operator timezone | One digest for the Operator: decisions pending, throughput, blocked items. |
| Janitor | Filter | `create_issue` | `0 10 * * 3` | Dead code, stale flags, orphan tests, flaky tests. |
| Docs drift | Quill | `create_issue` | `0 10 * * 2` | Compare commands, flags, and configuration in the code with the docs. |

### 7.7 Deployment recipe

```bash
# 1. Create agents from the specs (repeat per agent)
multica agent create --name "Trigger" --runtime-id <runtime-id> \
  --description "Direction and triage. Squad leader." \
  --instructions "$(cat multica/agents/trigger.md)" --output json

# 2. Attach workspace skills where useful
multica agent skills add <agent-id> --skill-ids <skill-id> --output json

# 3. Create the squad and add members with role lines
multica squad create --name "Crew" --leader Trigger --output json
multica squad member add <squad-id> --member-id <agent-id> --type agent \
  --role "Design engineer: design system, tokens, Storybook, accessibility"
multica squad member add <squad-id> --member-id <user-id> --type member \
  --role "Operator: decisions, sign-off, merges, releases"
multica squad update <squad-id> --instructions "<text from 7.5>"

# 4. Attach the project
multica repo add --url <git-url>
multica project create --title "<project>" --repo <git-url> --output json
multica project update <project-id> --description "<project brief>"

# 5. Autopilots (example: Main watch)
multica autopilot create --title "Main watch" --description "<runbook>" \
  --agent Merge --mode create_issue --output json
multica autopilot trigger-add <autopilot-id> --kind webhook --label "ci"
multica autopilot trigger-add <autopilot-id> --kind schedule --cron "*/30 * * * *" --timezone <IANA>

# 6. After a spec PR merges, sync the live agent
multica agent update <agent-id> --instructions "$(cat multica/agents/<name>.md)"
```

---

## 8. Team conventions

- **Minimal replies.** Outcome first, then evidence, then the one decision needed
  if any. No greetings, no restated issue text, no step narration, no sign-offs.
- **ASD-STE100** (engineering agents: Sigma, Palette, Valve, Filter, Void, Merge,
  Index): one instruction per sentence; imperative for instructions; active voice
  and simple tenses; sentences of at most 20 words in procedures and 25 in
  descriptions; one meaning per word and the same word for the same thing;
  paragraphs of at most six sentences with the topic first; vertical lists for
  sequences; a warning before the step it protects; define an abbreviation at
  first use.
- **Proven processes**, named in each spec, over improvised ones.
- **Self-improvement**: one lesson, one small PR to `multica/agents/<name>.md`,
  titled `docs(agents): <name>: <lesson>`, referenced in the final comment. Live
  instructions are synced from the file after merge.
- **Human guidance points**: merge, release, delete, Access, secrets, spend, and
  product direction.
- **Generic by design**: no spec names a project's files, commands, or tools.
  Each agent learns them from the repository (section 6) and the project brief.

## 9. Glossary

- **Issue**: the tracked unit of work (translated as the everyday word for task in other locales).
- **Run**: one agent execution; `task` in code, API, and database.
- **Runtime**: one computer plus one AI coding tool; **daemon**: the process that registers runtimes.
- **Category**: the platform behavior behind a status; custom statuses inherit it.
- **Close intent**: `Closes|Fixes|Resolves KEY-123` in a PR title or body; merge sets `done`.
- **Leader**: the agent that receives squad-routed work and delegates by mention.
- **Operator**: the human who owns this workspace and signs off.
- **Team repository**: the repository that holds `multica/agents/`; named in the workspace Context.
- **Project brief**: the project's stack, commands, conventions, CI, release, and rollback facts, kept in the Multica project description.
