---
name: seo-basics
description: Make content findable without gaming search - search-intent matching, title and heading structure, internal linking, meta descriptions, the never-do list (keyword stuffing, doorway pages, scaled AI spam), and technical basics. Use whenever writing or reviewing blog posts, landing pages, or docs meant to be found via search, whenever choosing titles and headings, whenever someone asks "how do we rank for X", and whenever an SEO tactic sounds too clever.
---

# SEO Basics

One rule generates all the others: **write for the reader, structure for the crawler.** Search engines rank pages that satisfy the searcher; every durable tactic is a way of proving satisfaction, and every banned tactic is a way of faking it. Faking it works briefly, then costs the domain.

## Search intent first (before writing a word)

| Intent | The query sounds like | The page that deserves to rank |
|---|---|---|
| **Informational** | "what is cursor pagination", "how to export csv" | Genuine explainer/how-to that answers in the first screen |
| **Navigational** | "<product> pricing", "<product> docs" | The actual destination, loading fast |
| **Transactional / commercial** | "best export tool", "<us> vs <them>" | Honest comparison or landing page with evidence, not adjectives |

Search the target query yourself and read what currently ranks — that's the intent, adjudicated. Writing a landing page for an informational query (or an explainer for a buying query) loses to whoever matched the intent, regardless of "optimization". One page per intent; three pages chasing one query cannibalize each other.

## On-page structure (structure-for-scanners IS structure-for-crawlers)

- **Title (~≤60 chars):** the query's words early, the promise exact. The title is a contract; the page pays it or the bounce-back tells the engine everything.
- **One H1** = the title's promise. **H2s answer the sub-questions** a searcher has ("How cursor pagination works", "Migrating from offset") — heading-shaped questions are how you appear in features like People Also Ask, and how humans scan.
- Front-load the answer (first ~100 words satisfy the query), then depth. Short paragraphs, real lists where the content is a list.
- **Internal links with descriptive anchors:** "see the pagination guide", never "click here" — the anchor tells both reader and crawler what's behind the door. New posts link to and from the relevant evergreen pages (orphan pages are invisible pages).
- **Meta description (~155 chars):** doesn't affect rank; it *is* your ad copy in the results page — state the payoff, earn the click honestly.
- Descriptive URLs (`/blog/cursor-pagination-guide`), stable forever; redirect if you must move.

## Never-do list (Google's spam policies, paraphrased into a spine)

- **Keyword stuffing** — the query 14 times reads as spam to both audiences. Write naturally; cover the *topic* (related terms appear because you actually explained it).
- **Doorway pages** — near-duplicate pages per keyword variant ("export tool for startups/enterprises/teams") with nothing distinct. One strong page beats twelve thin clones.
- **Scaled content abuse** — mass-generated pages (AI or otherwise) published for search volume without review, accuracy, or original value. Generated drafts are fine; *unreviewed generated publishing* is the policy violation and the trust violation.
- Hidden text, bought links, expired-domain tricks, faked review markup — all variations of "fake the satisfaction signal", all eventually repriced to zero or below.
- If a tactic's pitch is "search engines can't tell" — that's the tell. The sentence has been wrong every year so far.

## Technical hygiene (the checklist, not the career)

- [ ] Canonical tag on every page (self-referencing by default); parameters/variants canonicalize to one URL
- [ ] OG/Twitter card tags (title, description, image) — social previews are search's sibling
- [ ] Alt text on meaningful images (accessibility first; findability is the bonus)
- [ ] Fast LCP on content pages — compress the hero, lazy-load below the fold; slow pages lose readers before rank
- [ ] Indexable: not blocked by robots/noindex by accident (the classic post-launch "why aren't we ranking"), in the sitemap
- [ ] Dates honest: show published + updated; refresh content when you substantively update it (and only then)

## E-E-A-T signals (experience, expertise, authority, trust — earned, not sprinkled)

Real author with a real bio · claims cited to sources (the brand-voice receipts policy is also an SEO policy) · first-hand specifics — your benchmarks, your migration story, your screenshots — are what generated lookalike content cannot fake, and increasingly what ranking rewards.

## Measure (Search Console, not vanity)

Queries you appear for → impressions → CTR (title/meta problem if low) → position trend. Rank checks on one keyword are astrology; query-family impressions growing is the signal. Give content 4–12 weeks before judging; then improve the page that's *almost* working (positions 8–20) — the highest-ROI SEO work is usually a rewrite, not a new post.
