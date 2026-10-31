# Askapade design system

One application, one visual language. Every screen and every future component reads from the same tokens.

- **Tokens:** `prototype/src/design/tokens.css` (CSS custom properties) and `prototype/src/design/tokens.ts` (the motion values and celebration palette that JS needs).
- **Component layer:** `prototype/src/styles.css`, written only in tokens.
- **Shared components:** `prototype/src/ui.tsx`.
- **Icons:** `prototype/src/icons.tsx`.
- **Guard:** `npm run lint:ds` (`prototype/scripts/ds-check.mjs`).
- **Related docs:** [components.md](components.md) · [screen-inventory.md](screen-inventory.md) · [migration-progress.md](migration-progress.md)

## Direction

Clean, friendly, trustworthy and structured. Green means action and success, and it's the only accent. Personality comes from Hop, the frog crew and the motion, not from extra colours, gradients or effects.

## Colour

All text tokens pass WCAG AA (≥ 4.5:1) on `--bg`, `--surface` and `--surface-2`.

| Token | Value | Use |
|---|---|---|
| `--brand` | #008000 | Primary action, selection, success. White on it is 5.1:1 |
| `--brand-pressed` | #006B00 | Primary while pressed |
| `--brand-dark` | #062A10 | Dark surfaces (ID card, lock screen) |
| `--brand-tint` | #EAF4E7 | Selected and success backgrounds, the soft "offer" button |
| `--brand-light` | #7CC67F | Sparkles, confetti, highlights on dark surfaces. Never text on light |
| `--ink` | #0B130C | Primary text (17.7:1) |
| `--ink-2` | #3A463C | Secondary text (9.3:1) |
| `--ink-3` | #5F6B61 | Tertiary text and captions (5.2:1). Replaces #7C887E, which failed AA |
| `--ink-4` | #B5BEB6 | Disabled glyphs and decoration. Never text |
| `--bg` | #F7F8F5 | App background |
| `--surface` | #FFFFFF | Cards, sheets, inputs |
| `--surface-2` | #EEF1EA | Tracks, quiet buttons, secondary fills |
| `--line`, `--line-2` | ink at 8% / 14% | Dividers / control borders |
| `--warning`, `--warning-tint` | #9A5300 / #FFF3E0 | Time running out |
| `--danger`, `--danger-tint` | #C0352B / #FDECEA | Destructive, SOS, errors |
| `--rating` | #F5A524 | Stars only |
| `--overlay-*` | translucent white + blur | Only for things floating over the map (tab bar, map pills, map controls) |
| `--on-brand`, `--on-dark-2`, `--dark-fill-*`, `--dark-line` | — | Text and fills on brand or dark surfaces |

**The lime accent is retired:**
- `#C8F560` and `#F1FCD9` are gone.
- Old lime tints became `--brand-tint`.
- Lime highlights on dark surfaces became `--on-brand` or `--brand-light`.
- The lime cash-out buttons became white-on-dark primaries.

**Status is never shown by colour alone.** Every status colour sits next to an icon or a word: tick plus "Verified", hourglass plus "42m left", and so on.

## Typography

Figtree only, through `var(--font)`. Four weights: 500, 600, 700 and 800.

| Class / token | Size / line | Weight | Use |
|---|---|---|---|
| `.t-display` / `--fs-display` | 40 / 1.05 | 800 | Money amounts, hero numbers (tabular figures) |
| `--fs-hero` | 56 | 800 | At most one hero amount per screen (inbound ask, paid, cash out) |
| `.t-title1` / `--fs-title1` | 28 / 1.15 | 800 | Screen titles, OTP digits |
| `.t-title2` / `--fs-title2` | 22 / 1.2 | 800 | Sheet, card and dialog titles |
| `.t-head` / `--fs-head` | 17 / 1.3 | 700 | Section headings, prices in lists |
| `.t-body` / `--fs-body` | 16 / 1.45 | 500 | Body, buttons, inputs |
| `.t-callout` / `--fs-callout` | 15 / 1.35 | 600 | List titles, chat bubbles |
| `.t-sub` / `--fs-sub` | 14 / 1.4 | 500 | Secondary body, chip labels |
| `.t-cap` / `--fs-cap` | 13 / 1.35 | 600 | Captions, meta |
| `.t-foot` / `--fs-foot` | 12 / 1.35 | 600 | Footnotes, badges |
| `.t-micro` / `--fs-micro` | 11 / 1.2 | 700, caps +6% | Overlines, tab labels, pin prices |

No other sizes. Inline styles use the tokens, for example `fontSize: 'var(--fs-cap)'`.

## Spacing

The grid is 4pt: `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 20 (screen gutter), `--s-6` 24, `--s-8` 32, `--s-10` 40.

- Stacks inside a card use 8–12.
- Sections are separated by 16–24.
- Tap targets are at least `--tap` (44).

## Radius

| Token | px | Use |
|---|---|---|
| `--r-xs` | 6 | Badges, tags, pin prices, chat-bubble tails |
| `--r-sm` | 10 | Chips, quick replies, segmented tracks, small buttons |
| `--r-md` | 14 | Buttons, inputs, icon tiles, pins, skill tiles |
| `--r-lg` | 20 | Cards, banners, bubbles |
| `--r-xl` | 28 | Dialogs, attached panels |
| `--r-sheet` | 32 | Floating sheets (concentric with the device corners) |
| `--r-full` | — | Avatars, FAB, switches, the tab bar, the message composer |

- **Nested radii:** subtract the inner padding, for example the segmented pill is `calc(var(--r-sm) - 2px)`.
- **No pills except:** the tab bar, the composer, switches, the FAB and map pills.

## Elevation

| Token | Use |
|---|---|
| `--e-1` | Resting cards, the segmented pill |
| `--e-2` | Raised elements: popovers, map controls, the slide knob |
| `--e-3` | Sheets and dialogs |
| `--e-pin` | Map pins and people |
| `--e-brand` | The one green action that floats (FAB, success badge) |

Cards on the background use a 1px `--line` ring and no shadow.

## Motion

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(.23, 1, .32, 1)` |
| `--ease-drawer` | `cubic-bezier(.32, .72, 0, 1)` |
| `--d-fast` | 160ms (press, toggle) |
| `--d-base` | 240ms (state changes) |
| `--d-slow` | 420ms (sheets, pushes) |

Springs use bounce .1–.45. Tab switches are a 180ms crossfade. Reduce Motion is respected. Loops rest between beats.

## States

Every interactive element has these states:

| State | How it shows |
|---|---|
| Default | Resting style |
| Pressed | Darkens one step plus scales to .92–.97 |
| Focused | 2px brand ring, 2pt offset (keyboard only) |
| Selected | Ink or brand fill, or brand-tint with a brand ring, plus `aria-pressed` / `aria-checked` / `aria-current` |
| Disabled | 40% opacity, no pointer events |
| Loading | Spinner in place of the label, or busy copy ("Holding payment…"), button stays the same size |
| Success | Brand plus a tick |
| Warning | `--warning` plus an hourglass |
| Error / destructive | `--danger` plus copy |

Hover isn't styled: the product is touch-first, and hover would only show in the desktop prototype frame.

**Not in the repo:** offline, permission-denied, validation-error and generic empty or error screens don't exist yet. They haven't been invented. When they're added they must use the existing tokens:
- empty: Hop plus one line plus one secondary action
- error: `--danger` plus an icon plus a retry action
- offline: a map-overlay banner

## Navigation

- **Tab bar:** a floating overlay with a filled icon and bold label when active, regular when inactive. Switching is a 180ms crossfade.
- **Back:** always a 44pt `.iconbtn` with `Back` (Phosphor ArrowLeft bold), top-left.
- **Close:** for modally presented screens (post an ask, share), an `X` in the same position.
- **Segmented choices:** `Tactile` (sliding pill), or `.seg-mini` for compact status.
- **Sheets:** float, drag to dismiss, and step back when stacked.
- **Dialogs:** use `.modal` over `--scrim`.

## Icons

Defined in `src/icons.tsx` (Phosphor 2.1.7):
- Filled for actions and states.
- Bold for arrows.
- Lucide only for neutral row glyphs.
- Real brand marks for sharing.
- Never text glyphs (★ ✓ ›) in place of icons.

## Allowed exceptions (marked `ds-allow` in code)

1. Mascot and avatar palettes (`FROG_PAL`, `PEOPLE`, the frog artwork). These are illustrations, not UI colour.
2. Third-party brand colours: WhatsApp, Instagram, iOS Messages, the Visa mark.
3. The native iOS location dialog, which mimics the system with its colours and SF font.
4. Prototype chrome: the desktop backdrop, phone frame and side panel. Not app UI.

## Anti-slop rules

- No random gradients. Only functional fades and real brand marks.
- Translucency only over the map.
- One filled primary action per view.
- No decorative badges. A badge must carry status or a count.
- No nested cards inside cards.
- No new colours, sizes or radii without adding a token here first.
- Personality comes from Hop and motion, not from extra accents.

## Adding something new

1. Reuse a component from [components.md](components.md). Extend its variants before creating a new component.
2. Style only with tokens. If a value is missing, add a token to `tokens.css` and document it here.
3. Cover every applicable state in the table above.
4. Run `npm run lint:ds`. It must report no violations. Use `ds-allow: <reason>` only for the exception categories above.
5. Add the screen to [screen-inventory.md](screen-inventory.md) and update [migration-progress.md](migration-progress.md).
