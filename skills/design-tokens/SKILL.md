---
name: design-tokens
description: Create, name, and govern design tokens - the primitive/semantic/component tier system, naming grammar, DTCG JSON format, Figma-to-code sync, and dark-mode theming via semantic remap. Use whenever defining or changing colors, spacing, typography, radii, shadows, or z-index, whenever someone hardcodes a hex or px value, whenever setting up theming or dark mode, and whenever Figma styles and code have drifted apart.
---

# Design Tokens

Tokens are decisions with names. The system has exactly three tiers; most token bugs are tier violations.

## The three tiers

```
PRIMITIVE  color.blue.600 = #2554D9        raw palette; no meaning, no consumers
    ↓ referenced by
SEMANTIC   color.action.primary = {color.blue.600}   meaning; what components consume
    ↓ referenced by
COMPONENT  button.bg.primary = {color.action.primary}  only when a component needs
                                                        an override seam; use sparingly
```

**Rules:** components consume **semantic** tokens (component-tier where it exists). Primitives are never referenced outside token definitions — a component importing `color.blue.600` has hardcoded a decision it doesn't own. Theming (dark mode, brand skins) is a **remap of the semantic tier**; if dark mode requires touching components, the tiers are broken.

## Naming grammar

`{category}.{concept}.{variant?}.{state?}` — lowercase, dot-separated, no abbreviations.

- `color.surface.default` / `color.surface.raised` / `color.text.secondary` / `color.action.primary.hover` / `color.feedback.danger`
- `space.100`…`space.800` on the 4/8pt grid (space.100 = 4px, doubling-ish steps)
- `font.size.100`…, `font.weight.bold`, `radius.sm|md|full`, `elevation.1..4`, `z.dropdown|modal|toast`
- Name by **role, not appearance**: `color.feedback.danger`, never `color.red-ish`. Appearance names rot the moment the palette shifts.

## Scales (defaults; tune once, then obey)

- **Spacing:** 4/8pt grid only. A 13px gap is a bug with an opinion.
- **Type:** modular scale (~1.25 ratio) from a 16px base; line-height as unitless ratio tokens.
- **Radii:** 3 steps + full. **Elevation:** ≤4 levels, each a named shadow token. **Z-index:** named layers only — raw z-indexes are how 9999 wars start.

## File format — W3C DTCG JSON (source of truth lives in the repo)

```json
{
  "color": {
    "blue": { "600": { "$type": "color", "$value": "#2554D9" } },
    "action": {
      "primary": { "$type": "color", "$value": "{color.blue.600}" }
    }
  },
  "space": { "200": { "$type": "dimension", "$value": "8px" } }
}
```

Build platform outputs (CSS custom properties, TS constants, mobile) with Style Dictionary from this file. Hand-editing generated output is contraband.

## Figma ↔ code sync

- **Repo JSON is the single source of truth.** Figma Variables mirror it with identical names (`color/action/primary` ↔ `color.action.primary`).
- Sync via Tokens Studio (or the Variables REST API) in whichever direction your flow runs — but one direction only, agreed and written down.
- **Drift check in CI:** exported Figma variables diffed against repo JSON; a mismatch fails the check with the offending token names. Drift found monthly is a redesign; drift found per-PR is a comment.

## Dark mode / theming

One semantic remap file per theme (`themes/dark.json`) that re-points semantic tokens at different primitives (`color.surface.default: {color.gray.950}`). Re-run the contrast checks per theme — dark mode fails contrast in the opposite direction (too-dim text on too-dark surfaces).

## Governance

- New token requires: **two real use cases**, a role-based name, the design owner's approval. One-off needs are component-tier overrides or a conversation, not a new semantic token.
- Deprecate with an alias + console warning for one release; delete only after usage hits zero (grep is the vote counter).
- Every token PR shows rendered before/after (both themes) — tokens are UI changes wearing a JSON costume.
