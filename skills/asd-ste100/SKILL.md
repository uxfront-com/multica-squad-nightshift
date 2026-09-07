---
name: asd-ste100
description: Write answers in ASD-STE100 Simplified Technical English - the controlled-language writing rules (approved words with one meaning each, active voice, simple tenses, the 20/25-word sentence limits, one instruction per sentence, warnings before the step) plus the software mapping for technical names and technical verbs and a substitution table. Use whenever you write an answer - any report, issue comment, reply, triage note, or PR description - whenever you review another agent's answer for language, and whenever a reader says an answer was unclear or ambiguous.
---

# ASD-STE100 — Simplified Technical English for answers

STE is the aerospace controlled language (ASD-STE100), adapted here for software work. It exists so a tired reader — often in a second language — understands the text the first time, with no second read. One meaning per word, one instruction per sentence, no decoration.

**Scope: answers** — reports, issue comments, replies, triage notes, PR descriptions. Artifacts with their own style law keep it: docs (`docs-style`), marketing (`brand-voice`), commit messages (Conventional Commits), code and its comments. Quoted material — logs, error text, command output — is evidence: never rewrite it. The report skeleton (`✅ Done`, **What / Why / Proof / Next**), links, and code blocks are structure, not sentences; STE governs the prose between them.

The spec has two parts: writing rules (condensed below) and a dictionary of approved general words. The dictionary is the authority — the current issue is a free download from asd-ste100.org. Where this summary and the spec disagree, the spec wins.

## Words

- Use a word only if it is (1) approved in the dictionary, (2) a technical name, or (3) a technical verb.
- Approved meaning only: "follow" means "come after" — for compliance, write "obey the instructions".
- One part of speech per word: "test" is a noun. Write "do a test of the endpoint", never "test the endpoint".
- One name per thing, everywhere. If the config key is `retry_limit`, it is not "the retry ceiling" two comments later.
- No slang, no idiom. Be specific: "etc." hides information the reader needs.

## Technical names and technical verbs (the software mapping)

STE lets each project keep the exact words of its domain. Ours:

- **Technical names** — write them exactly, in code format where they are code: identifiers (functions, classes, config keys, env vars), API endpoints, CLI commands and flags, file paths, branch names, issue/PR numbers, versions, error messages, HTTP statuses, UI labels, product/protocol/standard names (Postgres, OAuth 2.0, WCAG 2.2). An `-ing` inside a technical name stays: `staging`, the logging pipeline.
- **Technical verbs** — the operations of the craft: deploy, merge, rebase, revert, compile, render, cache, migrate, refactor. Keep them, one meaning each, and prefer an approved general verb when it says the same thing.
- Numbers, units, and proper names are always allowed.

## Verbs, voice, tense

- Active voice. In instructions, always; in descriptions, as much as possible. "The migration locks the table", not "the table is locked by the migration".
- Simple tenses only — past, present, future: "we deployed", "the test fails", "we will monitor". Not "has failed" — "failed".
- Instructions are commands: "Restart the worker", never "The worker should be restarted" or "Please restart the worker".
- No `-ing` verb forms: "after you restart the service", not "after restarting the service".
- A past participle is an adjective only: "the merged branch", "the socket is connected".

## Sentences and paragraphs

- **Instructions: ≤20 words. Descriptions: ≤25 words.** Count when in doubt; split at "and" and "which".
- One instruction per sentence. Two actions in one sentence only when they occur at the same time.
- One topic per paragraph, **≤6 sentences**, topic sentence first.
- Never omit words to shorten. Keep the articles and the verbs: "Open the PR", not "Open PR"; "The fix is in review", not "Fix in review". Short means fewer ideas per sentence, never missing words.
- Maximum 3 nouns in a row: "the database connection pool timeout value" → "the timeout value of the database connection pool" — or use the exact technical name (`db_pool_timeout`).
- Conditions start with "if" or "when": "If the test fails, …" — never "Should the test fail, …".
- Connect ideas with the small words: and, but, so, then, because, if, when.

## Procedures vs. descriptions in one answer

A report mixes both; apply the correct rule per sentence:

- **Procedural** — steps the reader must do (Next, repro steps, instructions): command form, ≤20 words, one instruction each, in execution order; more than 3 steps → numbered vertical list.
- **Descriptive** — what happened, what is true (What / Why / Proof): ≤25 words, active voice, simple tenses, receipts attached per the truth protocol.

## Warnings, cautions, notes

- **Warning** = risk to people. **Caution** = risk to data, systems, or money. **Note** = information only — never put an instruction in a note.
- Warnings and cautions go **before** the step they protect and start with a clear command: "**Caution:** do not run the script on production. It deletes rows." After the step is too late.

## Substitutions (dictionary highlights)

| Do not write | Write |
|---|---|
| perform, carry out | do |
| commence, initiate | start |
| terminate, cease | stop |
| ensure, verify, confirm | make sure (that) |
| follow (= comply) | obey |
| prior to | before |
| subsequently, afterwards | then |
| however, nevertheless | but |
| therefore, thus, consequently | so |
| in order to | to |
| utilize, employ | use |
| assist | help |
| obtain, acquire | get |
| may, might (possibility) | can |
| should, shall (requirement) | must |
| inspect | examine |
| indicate | show |

A left-column word survives inside a technical name or quoted text: a log line that says `TERMINATED` stays exact. When you cannot check the dictionary, take the shorter, more common word — it is usually the approved one.

## Before / after

Not STE (33 words, passive, no doer, unapproved words):

> Verification of the fix has been performed and it was ascertained that the race condition no longer manifests under load, however it is recommended that additional monitoring be carried out prior to closure.

STE:

> ✅ Done — we did 500 runs of the original repro with the fix, under load. The race condition did not occur. Proof: PR #142, CI run 8812. Next: monitor `export_errors` for 24 hours. Then close the issue.

## Checklist (before you post)

1. Instructions: command form, ≤20 words, one action per sentence?
2. Descriptive sentences: ≤25 words, active voice, simple tense?
3. `-ing` verb forms outside technical names? Rewrite.
4. Articles present ("the", "a") — nothing telegraphic?
5. One name per thing; names and quotes exact, in code format?
6. Unapproved connectors gone (however, therefore, prior to)?
7. Warnings and cautions before their step, command first?
8. Paragraphs ≤6 sentences; more than 3 steps → numbered list?
