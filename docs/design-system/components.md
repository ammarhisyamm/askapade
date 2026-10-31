# Components

The shared components live in `prototype/src/ui.tsx` and the classes in `prototype/src/styles.css`. Every value is a token from `src/design/tokens.css`.

## Button — `<Btn kind>` / `.btn`

- **Variants:**

  | Variant | Fill and text | Use |
  |---|---|---|
  | `primary` | `--brand` / white | The one main action per view |
  | `secondary` | `--surface-2` / ink | Neutral second action |
  | `outline` | surface with a `--line-2` ring | Alternative choices |
  | `tint` (alias `offer`) | `--brand-tint` / brand | Repeated row actions (list "offer") |
  | `ghost` | text only, 44pt | Tertiary ("i have an account", "Cancel ask") |
  | `danger` | `--danger` / white | Destructive or SOS |
  | `invert` | ink / white | Dialog primary on light, "Keep my ask" |

- **Sizes:** default 54pt, `--r-md`, full width. `sm` is 38pt, `--r-sm`, auto width.
- **Type:** 16/700 (`sm`: 14/700).
- **States:**
  - Pressed: each variant darkens one step, plus scale .97.
  - Focus: brand ring.
  - Disabled: 40% opacity.
  - Loading: replace the label with busy copy and keep the size.
- **Accessibility:** a native `<button>`. Icon-only buttons need `aria-label`.
- **Rule:** never two `primary` buttons in one view.

## Icon button — `.iconbtn`

- **Size:** 44pt circle on `--surface-2`.
- **Pressed:** `--surface-2-pressed` plus scale .92.
- **`glass` variant:** over the map only.
- **`lg` variant:** 56pt.
- **Required:** `aria-label`.

## Badge — `.badge`

- **Size:** 22pt high, `--r-xs`, 12/700.
- **Variants:** `secondary`, `success` (tint), `brand` (solid), `warning`, `danger`, `invert`.
- **Rule:** carries a status or count, always with a word and often an icon. Never decoration.

## Chip — `.chip`

- **Size:** 40pt, `--r-sm`, 14/700.
- **Selected:** `on` (ink), or `green on` (brand) for deadline and radius.
- **Use for:** single-choice rows.
- **`Tactile`:** the same thing with a sliding pill (`layoutId`). Use it for sort tabs and tip amounts.

## Segmented control (compact) — `.seg-mini`

- **Track:** `--surface-2`, `--r-sm`, 3pt padding.
- **Items:** 30pt, 13/600, `role="radio"`.
- **Selected:** a white pill (`--e-1`), sliding with spring .35.
- **Use for:** status inside dense footers.

## Quick reply — `.qr`

- **Size:** 32pt, `--r-sm`, `--surface-2`, 13/600, no border.
- **Use for:** the lightest layer, sitting on the composer.
- **Rule:** must never repeat a control already on screen.

## Switch — `.switch`

- **Size:** 51×31, `--r-full`.
- **On:** `--brand`. **Off:** `--ink-4`.
- **Thumb:** surface with `--e-2`. Always paired with a text label.

## Card — `.card`

- **Style:** surface, `--r-lg`, 1px `--line` ring, no shadow.
- **Padding:** 14–16.
- **Rule:** no cards nested in cards.

## Field — `.field`

- **Style:** surface, `--r-md`, `--line-2` ring, 14 padding.
- **Focused / active:** a 2px brand ring.
- **Placeholder:** `--ink-3`.
- **Range inputs:** use `accent-color: var(--brand)`.

## Tile — `<Tile>` / `.tile`

- **Style:** `--surface-2`, `--r-md`.
- **Image:** the 3D icon at 72%.
- **Selected:** `--brand-tint` with a brand ring.

## Avatar — `<Avatar>`

- **Shape:** a circle, using the photo when there is one, otherwise initials on the person's identity gradient.
- **Verified tick:** brand, with a 2px surface border.

## Floating sheet — `<Sheet>` / `.fsheet`

- **Shape:** an 8pt inset, `--r-sheet`, `--e-3`, over `--scrim`.
- **Motion:** springs in, follows its content height, and drags to dismiss (110pt or 550pt/s).
- **Stacked:** the sheet underneath steps back (scale .94).
- **Rule:** inputs keep their own gestures.

## Attached panel — `.sheet`

Persistent map panels (Nearby, Asks list, Skills): `--r-xl` top corners, bottom-attached.

## List sheet — `<ListSheet>`

A sheet with rows: title, optional subtitle, and either a switch or a selected tick (`Tick`), plus an optional action button.

## Dialog — `<Modal>` / `.modal`

- **Shape:** a 20pt inset, `--r-xl`, `--e-3`, over `--scrim`, centred.
- **Content:** illustration or icon, title (`t-title2`), one line of body, then at most one primary and one ghost button.

## Toast — `<Toast>`

- **Style:** ink, `--r-lg`, a white `Tick`, 14/700.
- **Behaviour:** springs in from the top or bottom and auto-dismisses after about 1.8s.
- **Accessibility:** must also be announced (`role="status"`) when used for anything that matters.

## Tab bar — `<TabBar>`

- **Shape:** a floating overlay pill, 72pt, 18pt side padding.
- **Tabs:** 52pt wide, 11/600 (active 11/700 ink), Phosphor filled when active and regular when inactive.
- **FAB:** 50pt brand with `--e-brand`.
- **Accessibility:** `aria-current="page"` on the active tab.

## Status bar, header and back

- **Status bar:** `StatusBar` (`.light` on dark screens).
- **Header row:** back `.iconbtn` on the left, title (`t-callout` 700) centred or `t-title1` left-aligned for root screens, actions on the right.

## Slide to confirm — `<SwipeConfirm>`

- **Look:** brand track, white knob with filled double chevrons, shimmer label.
- **States:**
  - Idle: a nudge.
  - Armed: past 80%, the knob shows a tick.
  - Busy: spinner plus copy.
  - Done: tick plus label.
- **Accessibility:** `role="slider"`, and Enter/Space confirms.

## Hold to confirm — `<HoldButton>`

An ink button that fills with `--brand-pressed` while held, then shows a tick plus the done label. Releasing early springs back.

## Map primitives

- **`Pin`:** a 48pt bubble (`--r-md`) with a price tag (ink, or brand when boosted).
- **`Ring`:** a dashed brand radius.
- **`Me`:** a brand dot with a halo.
- **`Person`:** a 30pt avatar.
- **`MapCanvas`:** pannable.
- **Overlays:** use the `--overlay-*` tokens.

## Chat

- **Bubbles:** `--r-lg` with a `--r-xs` tail. "Me" is brand, "them" is surface with a ring.
- **System row:** `--surface-2`.
- **Composer:** a full-radius input plus icon buttons.

## Mascot — `<Hop>`, `<Frog>`

- **`Hop`:** per-state loops with rests.
- **`Frog`:** inline SVG with moving pupils, blinks and a happy face.
- **Colours:** only from `FROG_PAL`, an illustration palette and a documented exception.

## Keypad

A system-keyboard mimic: `--surface-2` tray, surface keys with a `--line-2` bottom shadow, 46pt keys.
