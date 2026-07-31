---
name: a11y-audit
description: Audit and fix accessibility to WCAG 2.2 AA - contrast ratios, target sizes, focus visibility, keyboard paths, screen-reader semantics, reflow, and the new 2.2 criteria, plus a bundled axe-core scan script. Use whenever accessibility, a11y, WCAG, screen readers, keyboard navigation, or contrast come up, whenever reviewing or shipping any user-facing UI, whenever designing a new surface, and before any release that touches interactive elements.
---

# A11y Audit — WCAG 2.2 AA

Automated tools catch roughly a third to half of real issues. The rest is hands on keyboard. Run the script, then the four manual passes — an audit that skips the manual passes is a scan, not an audit.

## AA quick reference (the ones that bite)

| Criterion | The number / rule |
|---|---|
| 1.4.3 Contrast (text) | ≥4.5:1; large text (≥24px, or ≥18.66px bold) ≥3:1 |
| 1.4.11 Non-text contrast | UI component boundaries & meaningful graphics ≥3:1 |
| 2.5.8 Target size (2.2) | ≥24×24 CSS px, or equivalent spacing to neighbors |
| 2.4.7 / 2.4.11 Focus (2.2) | Focus always visible AND not fully obscured by sticky headers/toasts |
| 2.5.7 Dragging (2.2) | Every drag action has a single-pointer alternative (buttons, tap-tap) |
| 3.3.8 Auth (2.2) | No cognitive tests to log in: allow paste, password managers, no transcription puzzles |
| 1.4.10 Reflow | Usable at 320 CSS px width (=400% zoom) with no 2-axis scrolling |
| 1.4.4 Resize | Text zooms to 200% without loss |
| 2.1.1 / 2.1.2 Keyboard | Everything operable; no traps; Escape exits what Enter entered |
| 4.1.2 Name/Role/Value | Every control has an accessible name and correct role; state changes exposed |
| 1.3.1 / 3.3.1–2 | Structure is semantic (headings, lists, labels); errors identified in text, inputs labeled |
| 1.4.13 Hover/focus content | Tooltips/popovers: dismissable (Esc), hoverable, persistent |

Also honor `prefers-reduced-motion` for any non-essential animation — technically AAA territory, but motion-triggered nausea is not a nice-to-have fix.

## Procedure

**0. Automated scan** — `scripts/axe-scan.mjs` (below). Fix criticals/serious before manual passes so you're not auditing noise.

**1. Keyboard pass.** Unplug the mouse. Tab through the whole flow: Can you reach everything? See where you are at all times (incl. under sticky UI)? Operate menus/dialogs/sliders with arrows/Enter/Space/Esc? Does focus return sensibly after a dialog closes? Note every dead end.

**2. Screen reader smoke.** (VoiceOver/NVDA, 10 min.) Read the page top to bottom: do headings outline the page? Are names human ("Delete invoice #341", not "button")? Do async results announce (live regions)? Are icons either labeled or hidden (`aria-hidden`)?

**3. Zoom & reflow.** 400% browser zoom / 320px viewport: content reflows, nothing clipped, no horizontal crawl. Then text-only zoom 200%.

**4. Vision simulation.** Grayscale the page: is anything communicated by color alone (error = red only)? Check contrast on real backgrounds (gradients, images), not the style guide swatch.

## Severity mapping (feeds triage)

- **P0/P1:** blocks task completion for AT users on a core flow (unreachable checkout button, focus trap in auth, unlabeled critical form).
- **P2:** degrades but has a path (poor announce order, low-contrast secondary text).
- **P3:** polish (redundant alt text, decorative contrast).

## Report format

Per finding: `[WCAG ref] [severity] — element/selector — what happens — expected — suggested fix — how verified (tool | keyboard | SR | zoom)`. Group by flow, not by page. Attach the axe JSON.

## The script

`scripts/axe-scan.mjs` — axe-core via Playwright against live URLs.

```bash
npm i -D playwright @axe-core/playwright && npx playwright install chromium
node scripts/axe-scan.mjs https://localhost:3000 https://localhost:3000/settings --json
```

Scans WCAG 2.0/2.1/2.2 A+AA rulesets, prints violations grouped by impact with node counts and fix URLs, writes `axe-report.json` with `--json`, exits non-zero on critical/serious (CI-friendly). Remember: a clean axe run means "no machine-detectable violations", nothing more.

## Fix patterns worth memorizing

- Contrast fail on brand color → darken the *token*, not the instance; check both themes.
- Icon-only button → `aria-label`, and a tooltip is not a name.
- Div-with-onClick → it's a `<button>`; you get keyboard + role + focus for free.
- Custom dropdown → 90% of the time native `<select>` or a listbox pattern from APG; don't improvise semantics.
- "Focus outline is ugly" → style it (`:focus-visible`), never remove it.
