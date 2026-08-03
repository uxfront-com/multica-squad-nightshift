---
name: launch-checklist
description: Run feature and product launches - the asset matrix by launch tier, claim-verification gate, link and UTM testing, coordination order (docs/flags/support before posting), the Operator approval gate, and post-launch monitoring with a correction protocol. Use whenever launching, announcing, or publishing anything external, whenever planning launch assets or timing, whenever someone says "post it" or "let's announce", and whenever a published claim turns out wrong.
---

# Launch Checklist

A launch is a promise made in public. The checklist exists so the promise is true, findable, and supported at the moment it's made — and so the one time something's wrong, the correction is faster than the screenshot.

## Tier the launch first (tier sets the asset matrix)

| Tier | What | Assets |
|---|---|---|
| **T1** Major | New product/capability, pricing, anything press-worthy | Blog post · social set (X + LinkedIn, natively written each) · changelog · docs (updated AND linked from the post) · email to affected users · demo asset (gif/video) |
| **T2** Feature | Meaningful feature, big improvement | Blog optional (default: skip unless there's a story) · social · changelog · docs |
| **T3** Minor | Small improvements, fixes | Changelog only. **Not every change is a launch** — announcing everything trains the audience to hear nothing |

## Claim-verification gate (before "draft" is even the right word)

- [ ] Every factual claim carries a link to its source in the working doc
- [ ] Every stat/benchmark has research sign-off with methodology attached — unverifiable numbers get cut or rephrased to what's verifiable ("3.1× on our benchmark, methodology linked" > "10×")
- [ ] Feature statements checked against what's actually shipped, enabled, and on which plans — copy says "rolling out this week" if that's the truth
- [ ] Screenshots/recordings from the *shipping* version, demo data contains no real customer information
- [ ] Pricing/plan mentions double-checked against the live pricing page

## Mechanical checks (the embarrassment preventers)

- [ ] Every link in the final draft **clicked**, from an incognito window (auth-walled "public" docs are the classic)
- [ ] UTM parameters on every outbound-to-us link, consistent scheme (`utm_source=blog&utm_campaign=<slug>`), tested that analytics receives them
- [ ] Social preview cards rendered (OG title/description/image) via a card validator — the preview *is* the post for most readers
- [ ] Names, trademarks, customer references: spelled right, approved in writing where required

## Coordination order (the sequence that prevents the classic faceplants)

1. **Docs live** — the announcement links to docs that exist *now*, not after lunch
2. **Feature flag ON / rollout at 100%** for the audience the post addresses — announcing a feature users can't find generates support tickets with your name on them
3. **Support briefed**: one-pager of what shipped, top 3 expected questions, known limitations, where to route bugs
4. **Changelog entry merged** (release-notes readers arrive before social does)
5. *Then* the post

## The approval gate (absolute)

Everything is **DRAFT until the Operator approves in-thread**. No exceptions for timing pressure, "small edits", or replies-as-content — a reply is publishing too. Present drafts with: the copy per channel, the claims-with-receipts list, proposed timing, and anything you're unsure about flagged. Publish exactly what was approved; material edits re-approve. Default executor is the Operator — you press the button only when the approval explicitly delegates it ("Approved: you post it").

## Timing

Post when the audience is awake and the crew can respond (mid-morning, mid-week as default; never day-before-holiday, never 6 p.m. Friday). Avoid colliding with your own other announcements — one message per moment. Hard external dates (partner co-launch, event) override defaults and get named in the plan.

## Post-launch (the launch isn't over at "publish")

- **First 24h watch:** replies/mentions (answer questions with doc links, not improvisation), signup/activation delta, support ticket themes, error rates on the announced surface. Report a 24h summary in-thread: reach, response themes, anything that needs fixing.
- **Correction protocol:** factual error found → correct **fast and visibly**: edit with an appended note ("Update: corrected X, previously said Y") or a follow-up reply; **never stealth-delete or silent-edit** — the screenshot always outlives the deletion, and the visible correction is a trust deposit.
- **Rollback comms:** if the feature reverts post-announcement, say so plainly where you announced it: what happened, user impact, when it returns. Drafted with the same approval gate, shipped the same day as the revert. Silence after a pulled launch is the expensive option.
