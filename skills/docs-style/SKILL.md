---
name: docs-style
description: Write documentation that works at 2 a.m. - the Diátaxis four-mode system (tutorial/how-to/reference/explanation), plain-language rules, structure for scanners, and the runnable-examples requirement. Use whenever writing or reviewing any documentation, README, guide, tutorial, or reference page, whenever docs feel confusing or users keep asking questions the docs "already answer", and whenever deciding where new documentation should live.
---

# Docs Style

Write for the 2 a.m. reader: tired, mid-failure, reading in F-pattern, one confusing sentence from giving up. Everything below optimizes for that person, because the relaxed expert never needed the docs anyway.

## Diátaxis: four modes, never mixed on one page

| Mode | Reader is… | Your job | Tone | Failure smell |
|---|---|---|---|---|
| **Tutorial** | Learning by doing (first time) | Guarantee a success — one golden path, no options, working result at the end | Teacher: "we", reassuring | Detours into theory; steps that can fail |
| **How-to** | Mid-task with a goal | Get them done — assume competence, state prerequisites, numbered steps | Recipe: imperative | Explaining concepts mid-step |
| **Reference** | Looking something up | Complete, accurate, uniform — dictionary structure | Neutral, terse | Persuasion, narrative, gaps |
| **Explanation** | Wanting to understand | Illuminate the why — context, trade-offs, history | Discursive | Pretending to be instructions |

The classifier: **learning vs. working** × **doing vs. understanding**. Most "bad docs" are mode collisions — a tutorial that stops to explain architecture (losing the doer), a reference page that argues (burying the fact). When a page serves two modes, split it and cross-link; the link is cheaper than the confusion.

## Plain language rules

- Sentences average ≤25 words; one idea each. If a sentence needs a second comma-clause, it wants to be two sentences.
- Active voice, second person: "Run the migration" not "The migration should be run" (by whom? the 2 a.m. reader needs to know it's them).
- Define jargon on first use or link a glossary; expand every acronym once per page.
- **Banned:** "simply", "just", "easy", "obviously" — they add zero information and one insult when the step fails. "Note that" (delete it), "please" (it's a manual, not a favor).
- Consistent terms: one name per concept per corpus. Calling it "workspace" here and "project" there costs a support ticket each time.

## Structure for scanners

- **Front-load the answer.** Conclusion first, context after — the reader decides in 5 seconds whether this page is theirs.
- Headings are tasks or questions ("Rotate an API key", "Why did my export fail?"), because headings are what scanning eyes actually read.
- One idea per paragraph, ≤4 lines; steps numbered; prerequisites before step 1, not revealed at step 6 as a surprise.
- Warnings **before** the dangerous step. A caution after `rm -rf` is a eulogy.
- Every page ends with "next": the logical next doc, or the escape hatch (support, issue tracker).

## The examples rule (the hill worth dying on)

- **Every code example runs.** Copy-paste-execute, no invisible prerequisites, expected output shown. Executed in CI (doc-test harness or extracted snippets) so drift breaks the build, not the user — an example that errors costs more trust than no example.
- Realistic values, not `foo`/`bar`: `user-billing-export.csv` teaches shape; `thing1` teaches nothing. Mark placeholders unambiguously: `<YOUR_API_KEY>`.
- Show the failure too: the common error message and its fix, verbatim — that's the string the 2 a.m. reader pastes into search.

## Maintenance signals

- Docs live in the repo, versioned with the code they describe, reviewed in the same PR as the change (a feature PR without its doc delta is incomplete).
- Screenshots only when the UI *is* the subject (they rot fastest); always with alt text.
- **Repeated questions are failing docs**: the same support question twice means restructure — usually the answer exists but isn't findable, which is the same as not existing. Fix findability (title, heading, position) before adding words.
- Reading-level check on tutorials especially: your reader may be excellent at their job and reading in their third language.
