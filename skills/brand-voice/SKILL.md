---
name: brand-voice
description: Write external content in a consistent, credible product voice - the four voice attributes with do/don't pairs, the banned corporate-mush list, the claims-need-receipts policy, and per-channel dialect rules. Use whenever writing any external content (blog posts, social posts, launch copy, website copy, emails, release announcements), whenever reviewing marketing copy, and whenever a draft reads like every other company's draft.
---

# Brand Voice

Voice is a promise about how we'll treat the reader: no wasted time, no inflated claims, no talking down. The test for every sentence: **would an engineer who uses the product wince?** If yes, rewrite — engineers are the canary for the whole audience's trust.

## The four attributes (with the line each one walks)

| Attribute | Do | Don't |
|---|---|---|
| **Direct** | Lead with the change: "Exports now handle 50k rows in ~4s." | Throat-clearing: "In today's fast-paced data landscape…" |
| **Technically credible** | Name the mechanism when it earns its place: "cursor pagination, so deep pages stay O(1)" | Jargon as decoration, or dumbing down to mush |
| **Warm, not chummy** | "This one took us longer than we'd like — here's what changed." | Forced memes, 🚀 spam, pretending the company is your buddy |
| **Confident, not breathless** | Let the number carry the excitement | Exclamation inflation!!! Superlatives doing evidence's job |

Humor: dry and occasional, never at users' expense, never in incident or security comms.

## Banned corpo-mush (rewrite on sight)

`leverage` (use) · `seamless` (works — prove it instead) · `revolutionary / game-changing / cutting-edge` (the reader decides that) · `best-in-class / world-class` (per whom?) · `empower / unlock / unleash / supercharge` · `delight` as a verb · `synergy / robust / holistic` · `"We're excited to announce…"` as an opener (they're here for the thing, not the feeling) · `"…has never been easier"` · `solutions` (name the product) · `utilize` (use) · `"up to X faster"` (weasel range — give the real number and conditions).

The mush test: if the sentence could headline any company's post, it says nothing about ours. Specifics are the voice.

## Claims need receipts (the trust ledger)

- Every number links to its source before publish; benchmark claims name the methodology (dataset shape, versions, hardware) or they don't ship. "3.1× faster imports (methodology below)" survives a skeptical reader; "10× faster" survives until the first one checks — and the check is the moment the brand is actually being read.
- Verified beats round: 3.1× outranks "up to 10×" every time. Precision *is* credibility signaling.
- Never state a competitor's numbers beyond what they publish; never invent quotes or "customers say" without a real, approved customer.
- Feature claims match what's actually shipped and enabled — hype writes checks the changelog has to cash. If it's behind a flag or a tier, the copy says so.
- Verification is a gate, not a vibe: stats get a research sign-off (see launch-checklist) before the draft is even called a draft.

## Per-channel dialect

| Channel | Shape | Watch for |
|---|---|---|
| **Blog** | 800–1,500 words, ONE idea, front-loaded conclusion, code/screens that earn scrolls | Two-idea posts (split them); burying the point |
| **X/Twitter** | The hook is the first 8 words; one claim per post; thread only when each post stands alone | Hashtag stuffing (≤1, usually 0); engagement-bait questions |
| **LinkedIn** | 2–4 real paragraphs, professional-warm | Broetry line breaks; "I'm humbled to announce" |
| **Release notes / changelog** | Not marketing. Plain consequences (see changelog skill) | Hype leaking into the changelog — different artifact, different voice |
| **Email** | Subject = the news itself; body under 150 words; one CTA | Three CTAs; "Don't miss out" |

Same facts everywhere; the *compression* changes, never the claims.

## Before/after (the voice in action)

- ✗ "We're thrilled to announce our revolutionary new export engine that makes data portability seamless!"
  ✓ "Exports rebuilt: 50k rows in ~4 seconds (was ~12), resumable, and every run has a shareable status link."
- ✗ "Leverage our best-in-class API to unlock powerful workflows."
  ✓ "The API now paginates with cursors — stable pages even while data changes. Migration is one parameter."
- ✗ "Performance has never been better!"
  ✓ "p95 dashboard load: 2.1s → 800ms. What we changed, below."

## The pre-publish read

Read it aloud once. Cut the first sentence if the second is stronger (it usually is). Delete every word the sentence survives without. Check: one idea? claims linked? mush swept? would the engineer wince? Then it goes to the Operator as a DRAFT — voice never overrides the approval gate.
