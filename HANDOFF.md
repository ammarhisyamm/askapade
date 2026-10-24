# Askapade — UI refresh v2 · handoff

**Figma (source of truth for design):** https://www.figma.com/design/qTXQvtg54dYWaHZoUPJdLl/Aspakade---New-Design

| Figma page | What's there |
|---|---|
| 🎨 Foundations | Cover, how to read, colour (variables), type (text styles), elevation/radius/spacing, motion rules |
| 🧩 Components | 44 UI icons, 59 3D object icons, brand mark, 21 component sets (Button, Chip, Pill, Map Pin, Tab Bar, Avatar, 3D Tile, Toast, Slide to Confirm, Status Stepper, Countdown Ring, Option Row, Map/Base…) + flow annotation kit |
| 🧭 User Flows & Screens | 00 master user flow + 8 labelled flow sections, 25 screens named `ID · Name`, each with a Screen Label (ID · name · route), trigger arrows and Motion / Logic / BTS notes |

The HTML canvas in this repo mirrors it. Open `index.html` through a local server (`python3 -m http.server 8765`) to see every frame live.
Each frame is labelled **ID · Name · route**. The notes under each frame are tagged
**Motion**, **Logic** or **BTS** (events triggered behind the scenes by the backend).

Source of truth:

| What | Where |
|---|---|
| Colour, type, radius, elevation, glass, motion tokens | `styles/tokens.css` |
| Reusable components | `styles/components.css` |
| Screen-specific layout | `styles/screens.css` (grouped by frame ID) |
| Interaction behaviours (countdowns, boost slider, slide-to-confirm, confetti…) | `scripts/app.js` (each one opt-in via `data-*`) |
| 3D object icons (256 px PNG, clean names) | `assets/icons/` |
| Brand logo SVGs + bunny-ears mark | `assets/brand/` |

Font: **Figtree** 400–900. Frame size: 390 × 844 pt (iPhone 15/16).

---

## Product rules this design assumes

- No "asker" / "askie" labels. It's always "you" plus the other person's first name and last initial.
- **Fixed price, no bidding.** The person posting sets the price, and whoever takes it gets that price.
- **Asks last under 24h.** Time windows are 30 min / 1 hr / 3 hrs / Today.
- **Posting is Uber-style.** Describe → post → *we* find someone. There is no "select users" step.
- **Default radius 1 km.** Boost to 2 / 3 / 5 km for a fee. Boosted asks show to people up to 5 km away.
- **Finder's fee.** Share any ask. If the person you shared it with completes it, you earn a fee.
- Money is held (escrow) when an ask is posted and released when it's confirmed done.

## Screen index

| ID | Screen | Route | Key components |
|---|---|---|---|
| 00.1 | Foundations | — | tokens, buttons, chips, pins, ring, ears |
| 01.1 | Splash | `/launch` | ears `.perk` |
| 01.2 | Intro · Need a hand | `/onboarding/1` | floating `.obj` |
| 01.3 | Intro · Get paid | `/onboarding/2` | `.paid-card` |
| 01.5 | Phone number | `/onboarding/phone` | phone input, iOS keypad |
| 01.6 | Verification code | `/onboarding/code` | 4-digit OTP tiles |
| 01.7 | What can you help with? | `/onboarding/skills` | Drawer over map, 3D skill picker (matching input) |
| 01.8 | Permissions | `/onboarding/permissions` | Item + Switch, "tap to turn on" (replaces 01.4) |
| 02.1 | Map home | `/explore` | map, `.pin`, glass `.tabbar`, `.sheet` |
| 02.2 | Ask preview · take it | `/ask/:id` | `.float-card`, `.timebar`, `.slide` |
| 02.3 | Push notifications | APNs | rich push templates |
| 02.4 | In-app alert | `/explore` + toast | `.toast` |
| 02.5 | Asks nearby · list | `/explore?view=list` | Drawer full height, Tabs, rows with Take |
| 03.1 | Compose | `/post` | auto icon, price stepper, time chips |
| 03.2 | Finding someone | `/ask/:id/finding` | radar, ears `.hop`, rotating copy, `.workbar` |
| 03.3 | Boost radius | `/ask/:id/boost` | `.range` snap slider, live ring |
| 03.4 | Matched! | `/ask/:id/matched` | confetti, helper card, ETA |
| 03.5 | Live · in progress | `/ask/:id/live` | route, `.stepper`, chat preview |
| 03.6 | No match · recovery | `/ask/:id/finding?stalled` | option list |
| 04.1 | You're on it | `/ask/:id/doing` | countdown clock, checklist |
| 04.2 | You got paid | `/ask/:id/paid` | count-up, confetti |
| 04.3 | Rate | `/ask/:id/rate` | stars, tags |
| 04.4 | Badge unlocked | modal over 04.2 | Dialog, 3D cup, BTS badge.unlocked |
| 05.1 | Wallet | `/wallet` | wallet card, weekly bars, finder's fees |
| 05.2 | Cash out | `/wallet/cashout` | keypad, `.slide` |
| 06.1 | Verify · scan ID | `/verify/scan` | viewfinder, scanline |
| 06.2 | Verified pass | `/verify/done`, `/you/id` | holographic card with tilt |
| 06.3 | Profile | `/you` | stats, badges |
| 07.1 | Share & earn | `/ask/:id/share` | link card, share targets |
| 08.1 | Cancel ask | modal | `.dialog` |
| 08.2 | Notifications primer | `/onboarding/notifications` | toggles |

## BTS events the frontend listens for

| Event | Payload (min) | UI reaction |
|---|---|---|
| `ask.created` (in radius) | ask, distance | pin drops on 02.1, "n new" increments, light haptic |
| `ask.boosted.inRange` | ask, distance, fee | push (02.3) / toast (02.4), lime pin |
| `ask.views` / `ask.viewer` | count, firstName | live counts + rotating copy on 03.2 |
| `ask.matched` | helper, eta, distance | 03.4 with success haptic + confetti |
| `ask.stalled` | suggestions[] | 03.6 recovery sheet |
| `ask.status` | matched / picked_up / done / paid | stepper on 03.5 |
| `helper.location` | lat, lng, eta (every 5s) | avatar + ETA chip move on 03.5 |
| `ask.takenByOther` | ask | shake card on 02.2 + "Just missed it" toast |
| `payout.completed` | amount, tip, finderFee | 04.2 + push |
| `finderFee.credited` | amount, askTitle | push "You earned £x for finding…" |

Push copy templates:
- `New ask {km} km away · £{fee}` (add ⚡ when boosted)
- `{name}'s {n} min away 🐇`
- `£{amount} just landed 💸`
- Limit: at most 1 new-ask push every 10 min, except for boosted asks or asks ending within an hour.

## Motion spec

| Token | Value | Use |
|---|---|---|
| `--d-fast` | 160ms | taps, chip select |
| `--d-base` | 240ms | state changes, scrims |
| `--d-slow` | 420ms | sheets, ring resize |
| `--spring` | `cubic-bezier(.34,1.56,.64,1)` ≈ SwiftUI `spring(response:.35,dampingFraction:.72)` | pins, badges, money, ticks |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | sheets, cards |

Rules:
- Nothing takes longer than 600ms except celebrations (03.4, 04.2).
- One speed cue per screen: hourglass **or** depleting bar **or** ring.
- Haptics: light on chip, tick or snap. Success on match or paid. Warning when under 10 min.
- Respect Reduce Motion: drop the loops and keep fades.

### Signature moments
1. **Bunny ears** (from the logo) are the mascot. `.wiggle` = idle, `.hop` = finding, `.perk` = success. Use them in place of a generic spinner.
2. **Radar** on 03.2: three ripples, 3.6s, staggered 1.2s, plus a conic sweep every 3s.
3. **Boost ring** grows live with the slider, using a snap haptic.
4. **Paid**: confetti from the coins, plus a count-up with ease-out quart over 1.1s.
5. **Holo ID pass**: tilt follows the gyroscope at ±9°, and the sheen follows the tilt.

## Colour usage

- `--brand` #008000 is for primary actions, the logo and success states.
- `--lime` #C8F560 is the speed and money-in accent: boost, live, "paid instantly". Don't use it as body text on white.
- `--urgent` #FF9F0A appears **only** when an ask has under 1h left.
- Glass (`.glass`) appears only over the map or imagery. Use `--surface` on plain backgrounds.

## Icons

`assets/icons/*.png` are 3D objects. The backend classifier maps ask text to an icon slug,
for example `package-box`, `puppy-face`, `hammer`, `shopping-cart` or `coffee-cup`. When the
classifier isn't confident, fall back to `mystery-box`.

---

## Build with ReUI (shadcn registry) — v3

The Figma file is rebuilt on ReUI / shadcn anatomy so the app can be assembled from the registry
(web app / PWA, React + Tailwind v4). Figma variables live in the collection **"ReUI · shadcn semantic"**
and use shadcn names, aliased to the Askapade palette:

| Token | Value |
|---|---|
| `--background` | #F3F5F0 |
| `--foreground` | #0B130C |
| `--card` / `--popover` | #FFFFFF |
| `--primary` / `--ring` / `--success` | #008000 |
| `--primary-foreground` | #FFFFFF |
| `--secondary` / `--muted` | #EEF1EA |
| `--muted-foreground` | #5E6A60 |
| `--accent` | #C8F560 (boost, live, money in) |
| `--accent-foreground` | #031A09 |
| `--destructive` | #F2453D |
| `--border` | rgba(11,19,12,.08) |
| `--input` | rgba(11,19,12,.14) |
| `--warning` / `--warning-foreground` | #FF9F0A / #8A4B00 (countdown < 1h only) |
| `--info` / `--info-foreground` | #7C3AED / #4C1D95 |
| `--invert` / `--invert-foreground` | #0B130C / #FFFFFF |
| `--radius` | 12px (buttons 10–12, badges 8, cards 12–16, drawers 24) |

| Figma component | Install |
|---|---|
| Button, Button · Icon | `npx shadcn@latest add button` |
| Badge | `npx shadcn@latest add @reui/badge` |
| Toggle Group · Item | `npx shadcn@latest add toggle-group` |
| Switch | `npx shadcn@latest add switch` |
| Avatar | `npx shadcn@latest add avatar` |
| Icon Tile | `npx shadcn@latest add @reui/icon-tile` |
| Item, Ask Card | `npx shadcn@latest add item card` |
| Sonner · Toast | `npx shadcn@latest add sonner` |
| Drawer (all bottom sheets) | `npx shadcn@latest add drawer` |
| Stepper | `npx shadcn@latest add @reui/stepper` |
| Timeline · Item | `npx shadcn@latest add @reui/timeline` |
| Rating | `npx shadcn@latest add @reui/rating` |
| Number Field | `npx shadcn@latest add @reui/number-field` |
| Alert | `npx shadcn@latest add @reui/alert` |
| Progress | `npx shadcn@latest add progress` |
| Slider | `npx shadcn@latest add slider` |
| Tabs · Trigger | `npx shadcn@latest add tabs` |
| Input, Textarea | `npx shadcn@latest add input textarea input-group` |
| Choice Card | `npx shadcn@latest add field checkbox` |
| Map Pin, Map/*, Tab Bar, Slide to Confirm, Countdown Ring | custom app code (specs on the Components page) |

Motion follows the `emil-design-eng` / `animate` skills installed in `.agents/skills`:

- UI animations stay under 300ms.
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` for UI and `cubic-bezier(0.32, 0.72, 0, 1)` for drawers.
- Pressed buttons scale to `scale(0.97)`. Nothing animates in from `scale(0)`.
- Staggers are 30–80ms.
- Delight is reserved for matched and paid.
- Reduced motion keeps fades.

### v3.1 — from the 89 Notion references + apple-design

- Onboarding follows Corner / Bump: lowercase headlines, phone + code, a skills picker in a drawer over the live map, and one permissions screen.
- The list view (02.5) follows Bump's "My places" and Swarm's "Swarming now": a full-height drawer with tabs and an action per row.
- Badge unlocked (04.4) follows Swarm's first check-in rewards. It fires only for meaningful firsts.
- The "Activity" tab is renamed "My asks" (apple-design: specific labels).
- Springs: damping 1.0 by default. Drawers use damping 0.8 / response 0.3 with velocity handoff and momentum projection.
- Glass is used only for floating map chrome.
