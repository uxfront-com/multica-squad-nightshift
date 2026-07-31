---
name: component-standards
description: Build and review UI components to a staff-level bar - the five mandatory states, props API discipline, token-only styling, per-component accessibility, stories, and test expectations. Use whenever creating or modifying a React/UI component, whenever reviewing frontend PRs, whenever a component is growing boolean props or variants, and whenever someone asks "is this component done" or requests a new piece of interface.
---

# Component Standards

A component is an API with pixels. Judge it like an API: small surface, predictable behavior, hard to misuse.

## The five states (all mandatory, designed before merge)

| State | Must answer | Common failure |
|---|---|---|
| **Loading** | What holds the space? Skeleton over spinner; progress over indeterminate when >2s possible | Layout shift when data lands (CLS bug) |
| **Empty** | First-run: what do I do here? Include the action, not just "No items" | Dead-end copy with no next step |
| **Partial** | 1 item? 10,000? Truncation, pagination, overflow | Designed only for the demo's 7 rows |
| **Error** | What failed, can I retry, is my data safe? | Toast that vanishes with the only explanation |
| **Ideal** | The easy 20% everyone designs first | Being the only state that got designed |

Offline and slow-network are variants of error/loading — handle them where the component owns fetching.

## Props API discipline

- **Boolean budget: 3.** A component demanding a fourth boolean prop is announcing it's the wrong abstraction — split it or move to composition (`children`, slots) or a single `variant` enum.
- Prefer composition over configuration: `<Card><Card.Header/>…</Card>` scales; `<Card headerText iconLeft dense compactButWide>` does not.
- Controlled vs uncontrolled: pick one per prop, or support both explicitly (`value` + `defaultValue`); never half-controlled.
- Every prop has a type, a default where sensible, and a reason to exist. Spreading `...rest` onto the DOM node is allowed exactly once, on the root.
- Naming: booleans read as assertions (`disabled`, `isLoading`), handlers as `on<Event>`, render hooks as `render<Thing>`.

## Styling

- **Tokens only.** Raw hex, raw px spacing, and magic z-indexes are contraband — if the token doesn't exist, request it from the design-token owner; don't inline it.
- Spacing on the 4/8pt grid. Type from the scale. Radii/elevation from the ramp.
- No styles that break theming: colors come from semantic tokens so dark mode is a remap, not a rewrite.

## Accessibility floor (per component)

- Semantic element first (`button`, `nav`, `dialog`); ARIA only to fill genuine gaps — no ARIA beats wrong ARIA.
- Full keyboard path: reachable, operable, visible focus, logical order, Escape closes what Enter opened, no traps.
- Accessible name on every interactive element; state changes announced (`aria-expanded`, `aria-live` for async results).
- Target size ≥24×24 CSS px; contrast per WCAG (see the a11y-audit skill for the full pass).

## Stories & docs

- One story per state (all five), plus edge stories: longest realistic content, RTL if supported, keyboard-only walkthrough note.
- Props documented from types (autodocs); a one-paragraph "when to use / when not to use" at the top.
- Shared components get visual regression snapshots on their stories.

## Test expectations

- Test **behavior through the accessibility tree** (Testing Library queries: `getByRole`, `getByLabelText`) — never implementation details (class names, internal state).
- Cover: renders each state, keyboard interaction, handler contracts (called with what, when), and one async race (loading → error).
- Run an axe check against each story in CI; violations are failures, not warnings.

## Definition of done

- [ ] Five states implemented and storied
- [ ] Keyboard + screen reader pass (names, roles, focus)
- [ ] Tokens only; responsive from 320px
- [ ] Types exported; props within budget; no `any`
- [ ] Behavior tests + axe clean; visual snapshot if shared
- [ ] Vitals unaffected (no new layout shift, no oversized bundle import)

## When to redesign instead of patch

Redesign when: prop count keeps climbing for one caller's needs · two components share 80% of markup via copy-paste · a "temporary" wrapper is the third of its kind · styling requires `!important` or DOM-structure selectors from outside. Cheapest time to fix an abstraction is the moment it first complains.
