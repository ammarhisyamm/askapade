# Migration progress

Last updated: 2026-10-31. Scope: every navigable state in `prototype/src/App.tsx` (see [screen-inventory.md](screen-inventory.md)).

## Totals

| | Count |
|---|---|
| Discovered screen states | 51 (25 screen components) |
| Audited | 51 |
| Migrated to tokens | 51 |
| Visually verified (static end state, 375×812) | 49 |
| Migrated, partially verified | 2 (01.1 splash sequence, 03.2b animated offers) |
| Remaining | 0 |
| Blocked | 0 |

**Enforcement:** `npm run lint:ds` reports 0 violations across `src/`. Exceptions are explicitly marked `ds-allow` and limited to the four categories in the README.

## Batches

1. **Foundation:**
   - Created `src/design/tokens.css` and `tokens.ts`.
   - Rewrote `styles.css` on tokens.
   - Retired lime: badges, tints, ticks, the boost price, the scan line, the cash-out buttons, confetti.
   - Raised `--ink-3` to pass AA.
2. **Shared components** (`ui.tsx`, `icons.tsx`):
   - Button pressed states.
   - Badges as 22pt rectangles.
   - Chips and quick replies on `--r-sm`.
   - A solid fill for the hold button, with no gradient.
   - Border trace, toast and tick colours, and confetti on the brand palette.
3. **Screens (all 7 modules):**
   - 230 hardcoded colours became tokens or documented exceptions.
   - 133 font sizes, 108 weights and 92 radii moved to the scale, and 13 elements became true circles.
   - The skills tile and phone CTA moved from Motion colour animation to CSS transitions on tokens.
4. **Visual QA:**
   - Every state captured at 375×812 with `?still`.
   - The four height-sensitive screens also checked at 375×667.
   - Fixed: the 03.2 title wrapping into its subtitle (it now fits on one line), and SVG strokes using `var()` in attributes, which don't resolve (moved to style).
   - Added a `03.9b` deep link so the rate-with-tip state is directly reachable.

## Known issues and limits

- **Motion:** checked in code and as end states only. The review browser pauses animation frames when the window isn't focused, so no animation was watched playing.
- **Dynamic Type:** text scaling wasn't tested. The prototype uses fixed px sizes.
- **Missing state screens:** offline, permission-denied, validation-error and generic error or empty screens don't exist in the repo, so they were left out rather than invented. Rules for building them are in the README "States" section.
- **Hover:** not styled. The product is touch-first.
- **Figma:** colour variables are synced (see the HANDOFF note). The clickable prototype and App Store sections are currently missing from the Figma file, so their copies couldn't be updated.
