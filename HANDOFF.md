# Askapade — UI refresh v2 · handoff

**Figma (source of truth for design):** https://www.figma.com/design/qTXQvtg54dYWaHZoUPJdLl/Aspakade---New-Design

**Interactive prototype (coded, with motion):** https://askapade-prototype.vercel.app · source in `prototype/` (auto-deploys from `main`)

| Figma page | What's there |
|---|---|
| 🎨 Foundations | Cover, how to read, colour (variables), type (text styles), elevation/radius/spacing, motion rules |
| 🧩 Components | 44 UI icons, 59 3D object icons, brand mark, 21 component sets (Button, Chip, Pill, Map Pin, Tab Bar, Avatar, 3D Tile, Toast, Slide to Confirm, Status Stepper, Countdown Ring, Option Row, Map/Base…) + flow annotation kit |
| 🧭 User Flows & Screens | 00 master user flow + 8 labelled flow sections, 40 screens named `ID · Name`, each with a Screen Label (ID · name · route), trigger arrows and Motion / Logic / BTS / UX law notes. Also a clickable prototype (5 flow starting points) and the 8-frame App Store set |

The HTML canvas in this repo mirrors it. Open `index.html` through a local server (`python3 -m http.server 8765`) to see every frame live.
Each frame is labelled **ID · Name · route**. The notes under each frame are tagged
**Motion**, **Logic**, **BTS** (events triggered behind the scenes by the backend) or **UX law** (the [Laws of UX](https://lawsofux.com/) principle the screen leans on).

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

- **One account, no roles.** No "asker" / "askie" labels and no toggle. The same person posts asks and offers help; screens say "you" plus the other person's first name and last initial.
- **Hop, the agent.** A small frog mascot that stands for the app working on your behalf (never called "AI"). Hop appears in onboarding and while an ask is being shared behind the scenes.
- **Fixed price, no bidding.** The poster sets the fee. Helpers *offer* at that fee; the poster picks one offer.
- **Asks last under 24h.** Deadline chips: 1h / 3h / 6h / 12h / 24h.
- **Default radius 1 km.** If nobody offers, Hop comes back with a boost: radius up to 5 km and/or a fee top-up.
- **Escrow.** Payment is captured at checkout (after picking an offer) and held. Both people mark the ask complete in chat, then the poster sees **Release payout** (auto-release after 24h).
- **Inbound, Uber-style.** Asks inside your radius can arrive as an accept/decline card — even mid-job, when they fit your route and deadline.
- **Finder's fee.** Share any ask. If the person you shared it with completes it, you earn a fee.

### The two scenarios

1. **2 offers:** post (03.1) → Hop shares it nearby (03.2, BTS) → 2 offers (03.3) → checkout into escrow (03.4) → chat (03.5) → both mark complete → release payout (03.8) → all done (03.9).
2. **0 offers:** post → Hop shares it (03.2) → no offers → Hop returns with boost options (03.6) → boost and retry → 5 offers (03.7) → checkout (03.4) → chat (03.5).

## Screen index

| ID | Screen | Route | Key components |
|---|---|---|---|
| 00.1 | Foundations | — | tokens, buttons, chips, pins, ring, ears |
| 01.1 | Splash | `/launch` | ears `.perk` |
| 01.2 | Meet Hop | `/welcome` | Hop (wave), speech bubble, page dots |
| 01.3 | Get paid nearby | `/welcome/earn` | Hop (happy), 3D objects |
| 01.5 | Phone number | `/onboarding/phone` | phone input, iOS keypad |
| 01.6 | Verification code | `/onboarding/code` | 4-digit OTP tiles |
| 01.7 | What can you help with? | `/onboarding/skills` | Drawer over map, 3D skill picker |
| 01.8 | Permissions primer | `/onboarding/permissions` | Hop, Item + Switch, "tap to turn on" |
| 01.9 | iOS location dialog | system | native alert with map preview + "Precise: On" |
| 02.1 | Map home | `/explore` | map, pins, glass tab bar, drawer |
| 02.2 | Ask preview | `/ask/:id` | float card, timer, Slide to offer |
| 02.3 | Push notifications | APNs | rich push templates |
| 02.4 | Inbound ask · Uber-style | `/inbound/:id` | respond timer, Countdown Ring, Decline / Offer to help |
| 02.5 | Asks nearby · list | `/explore?view=list` | full-height drawer, Tabs, rows with Offer |
| 02.6 | Offer sent | `/ask/:id/offer` | Hop, waiting progress, withdraw |
| 02.7 | Offer accepted | `/ask/:id/accepted` | Hop card, Open chat / Share |
| 03.1 | Post an ask | `/ask/new` | Textarea + auto-tag, location, Number Field + currency, deadline Toggle Group, finder's fee Switch, total |
| 03.2 | Hop is finding someone | `/ask/:id/finding` | radar, Hop (searching), live counts |
| 03.3 | Offers · 2 | `/ask/:id/offers` | Offer Card ×2, hold timer |
| 03.4 | Checkout · escrow | `/ask/:id/checkout` | line items, Apple Pay, escrow Alert |
| 03.5 | Chat · in progress | `/chat/:id` | ask card + Stepper · Escrow + countdown, mini map, Message Bubble, Mark as complete |
| 03.5b | Chat · actions | `/chat/:id/actions` | Lifeline / Report / Block / Cancel, SOS |
| 03.6 | No offers · boost | `/ask/:id/boost` | Hop (sad), radius Slider, fee top-up, reach estimate |
| 03.7 | Offers · 5 | `/ask/:id/offers` | Offer Card ×5 |
| 03.8 | Release payout | `/chat/:id/release` | stepper at "done", Release payout |
| 03.9 | All done | `/chat/:id/done` | Hop card, Rating, Leave a review / Share this ask |
| 04.1 | Chat · helping | `/chat/:id` | same chat, Your status chips, Mark as complete |
| 04.1b | New ask mid-job | `/chat/:id` | inbound card over the chat |
| 04.1c | Update status | `/chat/:id/status` | On my way / Here / Running late / Done |
| 04.2 | You got paid | `/ask/:id/paid` | count-up, confetti |
| 04.3 | Rate | `/ask/:id/rate` | stars, tags |
| 04.4 | Badge unlocked | modal over 04.2 | Dialog, 3D cup, BTS badge.unlocked |
| 05.1 | Wallet | `/wallet` | wallet card, weekly bars, finder's fees |
| 05.2 | Cash out | `/wallet/cashout` | keypad, `.slide` |
| 06.1 | Verify · scan ID | `/verify/scan` | viewfinder, scanline |
| 06.2 | Verified pass | `/verify/done`, `/you/id` | holographic card with tilt |
| 06.3 | Profile | `/you` | stats, badges |
| 06.4 | Settings | `/settings` | grouped Items: nearby, money, safety & help; Log out |
| 07.1 | Share & earn | `/ask/:id/share` | link card, share targets |
| 08.1 | Cancel ask | modal | `.dialog` |
| 08.2 | Notifications primer | `/onboarding/notifications` | toggles |

## BTS events the frontend listens for

| Event | Payload (min) | UI reaction |
|---|---|---|
| `ask.created` (in radius) | ask, distance | pin drops on 02.1, "n new" increments, light haptic |
| `ask.nearby` | ask, distance, onRoute | Uber-style card 02.4 (or 04.1b mid-job), 24s / 18s to respond |
| `agent.search` | radius, shared, viewed | live counts + rotating line on 03.2 |
| `offer.received` | offer, helper | 03.3 / 03.7 list, newest slides in at the top |
| `agent.no_offers` | ask, suggestions | 03.6 boost sheet (push if app is closed) |
| `offer.accepted` / `offer.declined` | ask | 02.7 card / toast + back to map |
| `payment.held` | amount | opens the chat; helper gets 02.7 |
| `ask.status` | on_my_way / here / late / done | system rows + stepper on 03.5 / 04.1 |
| `helper.location` | lat, lng, eta (every 5s while "On my way") | mini map on 03.5 |
| `completion.marked` | by | system row; when both → 03.8 |
| `payout.released` | amount, tip, finderFee | 04.2 + push |
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

### Bottom sheets (every pop-up sheet)
Persistent map panels (Nearby, Asks list, Skills) stay attached to the screen edge. Every pop-up sheet floats.
- **Shape:** 8pt from the left, right and bottom edges. Corner radius 32, concentric with the device corners.
- **Enter:** spring (response .55, bounce .18) from below the screen. Content fades up 16pt with a 70ms delay.
- **Exit:** 340ms on `cubic-bezier(.32,.72,0,1)`.
- **Height:** follows the content (spring .45, bounce .1), so filters and steps resize the sheet instead of jumping.
- **Drag to dismiss:** past 110pt or 550pt/s.
  - The scrim fades with the drag, down to 15%.
  - The handle stretches to 48pt when pulled up and narrows to 30pt when pulled down.
  - Pulling up rubber-bands at 6%.
  - Inputs and sliders keep their own gestures. A scrolling sheet drags only from the grab zone.
- **Stacking:** when a sheet opens on top of another, the lower one steps back (scale .94, y −14).

### Slide to confirm (offer, pay, cash out)
Based on Swiggy's slide to pay.
- **Track:** ink pill with a 32 radius, and a 56pt lime knob showing double chevrons.
- **Idle:**
  - The label shimmers on a 2.6s sweep.
  - The knob nudges 18pt every 3.4s until it's first touched.
- **Dragging:**
  - The brand-green fill follows the knob.
  - The label fades out and drifts at 0.3× the knob's speed.
  - Past 80%, the knob grows to 1.07, the chevrons morph into a check, and a light haptic fires.
- **Release before 80%:** the knob springs back (bounce .38).
- **Release after 80%:** the knob shows a spinner with a contextual label ("Holding payment…", "Sending offer…", "Sending to bank…"). After about 950ms the pill turns solid green, the check draws itself, and the done label appears.
- **Accessibility:** Enter or Space confirms. The shimmer is off with Reduce Motion.

## Colour usage

- `--brand` #008000 is for primary actions, the logo and success states.
- `--lime` #C8F560 is the speed and money-in accent: boost, live, "paid instantly". Don't use it as body text on white.
- `--urgent` #FF9F0A appears **only** when an ask has under 1h left.
- Glass (`.glass`) appears only over the map or imagery. Use `--surface` on plain backgrounds.

## Icons

`assets/icons/*.png` are 3D objects. The backend classifier maps ask text to an icon slug,
for example `package-box`, `puppy-face`, `hammer`, `shopping-cart` or `coffee-cup`. When the
classifier isn't confident, fall back to `mystery-box`.

All 59 icons are mapped in `prototype/src/askIcons.ts`. Each entry has a slug, a label,
keywords and a typical fee range. `pickIcon(text)` scores keyword hits, with longer phrases
counting more, and returns the best slug. Use it as the client-side first guess while the
backend classifier is pending, or as the classifier's seed list.

### Post an ask composer (03.1, 03.1d, 03.1e)

- **Empty state:** the placeholder types out example asks one at a time. Eight
  "Quick ideas" chips each fill the text and a suggested fee in one tap.
- **As the user types:** the 56px icon tile springs to the best match. A badge reads
  "Hop picked {label}" and the field border turns brand green.
- **Choosing manually:** tap the tile or the badge to open "Map icon", a searchable 4-column
  grid of all 59 icons. A manual pick shows a check badge. "Let Hop pick" returns to auto.
- **Mic:** dictation fills the text, and the icon updates live.
- **Where:** the location row is a map preview showing the real pin (icon and fee). Tapping
  it opens the location sheet.
- **Fee hint:** "{label} asks usually get £lo–hi". "Use £mid" appears only when the fee is
  outside that range.
- **Post ask:** disabled until there's text. The chosen icon carries into Hop finding,
  both as the map pin and in the summary row.

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

### v4: Hop agent, offers + escrow, Laws of UX

The Corner haze pass (v3.2) was reverted; the screens are back on the v3.1 visual language (docked sheets, hairline borders, sentence case outside onboarding).

- **Hop** (`Mascot/Hop (frog agent)`, states idle · searching · happy · sad · wave). Body #3DBE5C, belly #D7F7A0, line #0B4D1A. Hop pops in with a spring (0.5s, bounce 0.2) and bobs on a 1.2s loop while searching. It never talks in paragraphs: a speech bubble or a short headline only.
- **New components:** Offer Card (`selected`), Message Bubble (`from=them|me`), Stepper · Escrow (`step=held|done|paid`), Flow/Note Row `Type=UX law`.
- **Chat** carries the whole job: ask card + escrow stepper + countdown on top, a mini live map, then messages, then the one action that matters (Mark as complete / Release payout / your status).
- **Settings** (06.4): three groups by job, ≤3 rows each; opened from the gear on 06.3.
- **Laws of UX:** every screen block has a UX law note (Hick, Fitts, Jakob, Miller, Doherty, Goal-gradient, Peak-end, Von Restorff, Zeigarnik, Tesler, Aesthetic-usability, Common region, Proximity, Serial position).
- **Prototype:** 40 clones in "▶ Clickable prototype", 84 hotspots/timers with Smart Animate (`cubic-bezier(0.23,1,0.32,1)`, 300ms). Flow starting points: Onboarding · Scenario 1 · Scenario 2 · Offer to help · Helping.
- **App Store:** 8 frames (1290 × 2796) built from 03.2, 03.3, 03.8, 03.5, 02.4, 02.1, 04.2 and 01.2.

### v4.1: polish pass

- **Intro screens blend:** the hero is a full-bleed lime-50 → background gradient with a radial halo and a soft ground shadow under Hop. No more hard-edged block.
- **Map screens blend:** a background fade under the status bar, and a fade from the map into every docked sheet (Corner-style), on 01.7, 02.1, 02.6 and 03.6.
- **Inbound ask v2 (02.4, 04.1b):** earnings as the hero, a two-stop route (you → their place), poster in one line. The countdown drains the "Offer to help" button itself, and Decline is a round X. It reads differently from every other card.
- **Home indicator:** sheets and footers now run to the bottom edge (34px bottom padding), with the indicator layered on top. Nothing is cut off.
- **Button icons** take the label colour (white on green / red / black buttons), fixed on the component and on every instance.
- **UX law notes** now show their text (the variant wasn't bound to the Note property).

### v4.2: interactions from 60fps.design, every screen in the coded prototype

The coded prototype now covers all 40 screen IDs (phone, code, skills, lock-screen push, list, badge unlocked, cash out, scan ID, verified pass, share & earn and the notifications primer were added), and each opens with `/#<ID>`. The interaction language follows 60fps.design patterns, mapped screen by screen in `prototype/README.md`. Highlights: swipe to pay with a glow and drawn check, hold to release the payout, a light tracing the inbound card, staged pin drops on first load, sheet → full list, mini map → tilted live map, sliding pill selection everywhere, and reward moments for payout and badges.

## Client brief checklist (checked before handoff)

| Brief item | Where it lives (Figma ID · prototype link) |
|---|---|
| Post → waiting ("Hang tight", "One moment") → found, Uber-style; no "select users" step | 03.1 → 03.2 → 03.2b → 03.3 · `/#03.1` |
| Speed cues without overdoing it: hourglass, progress, timers | hold timer 03.3, countdown ring in chat, draining offer button 02.4, live progress 03.2 |
| Personality: onboarding, modals, micro-interactions | Hop in 01.x / 03.2 / 03.6 / 03.9 / 04.4; 60fps interactions mapped in `prototype/README.md` |
| On-demand: 1 km default, boost to 5 km | radius 02.1c, boost 03.6, boosted asks reach 5 km (02.1b) |
| Taste: wallet, verified ID look great; 60fps.design | 05.1, 05.2, 06.1, 06.2 (tilting holographic pass) |
| BTS events drive the UI, e.g. "New ask 5 km away" | lock screen 02.3, in-app boosted pop-up 02.1b, offers arriving 03.2b, BTS notes on every screen |
| Mascot = frog, framed as an agent (not AI), in onboarding and while finding | Hop: 01.1–01.8, 03.2, 03.6, 02.6 |
| Two events: post and get help fast, receive inbound asks by location | Scenario rows in flow 03; inbound 02.4, 02.3 |
| Accept a new ask while in one (Uber) | 04.1b · `/#04.1b` |
| Scenario 1: 2 offers → select → checkout (escrow) → chat | `/#03.1` with scenario 1 |
| Scenario 2: 0 offers → boost price / radius → 5 offers → checkout → chat | `/#03.6` (or `/#post-boost`) |
| Escrow at checkout; both mark complete; then "Release payout" | 03.4 slide to pay → 03.5 → 03.8 hold to release → 03.9 |
| Same user, no asker / askie toggle | one account everywhere; My asks lists posting and helping together |
| Location permission in onboarding | 01.8 primer → 01.9 native dialog |
| Little text; every element has a purpose | copy trimmed; "?" opens a one-line tip (03.1b); "+" attaches (03.5c); call, directions, radius and locate all work |
| Use v1 as the guide (filters, attach, chat list, lifeline / report / block / SOS, rate) | 02.5b filters, 03.5c attach, My asks chat list, 03.5b actions (v1 naming), 04.3 rate |
| Settings and chat look better | 06.4, 03.5 / 04.1 |
| Laws of UX | a UX law note on every screen block |

### Figma ↔ prototype sync (v4.3)

- New Figma states, matching the prototype: 02.1b BTS pop-up, 02.1c radius picker, 02.5b list filter, 03.1b finder's fee tip, 03.2b offers arriving, 03.5c attach, 04.1m live map.
- Figma controls now match the prototype: 03.4 slide to pay, 03.8 hold to release, quick replies above every chat composer, v1 action names, trimmed copy.
- Motion notes start with "60fps ·" and describe the shipped interaction.
- The Figma clickable prototype is regenerated (47 screens, 114 links). The coded prototype index has 46 entries: the same IDs, with 01.3 living inside 01.2 (swipe) and 01.9 inside 01.8 (the native dialog), plus My asks.

### App Store set v4

Rebuilt after studying screensdesign.com's store-screenshot library plus the client's three references (Wise, Arc, journaling app). The main lesson: great sets are one consistent system, not a mix of styles.

- **System:** Wise-style. Dark green and lime frames alternate, with an uppercase Figtree Black headline block on top and the phone in the bottom ~65%, bleeding off the edge. Two lifestyle-photo frames break the rhythm.
- **Mascot moments (journaling app):** a 3D Hop hero on a tone-on-tone Hop pattern, hand-drawn circle and underline accents, and a 3D hand holding the phone.
- **Devices:** a thin black bezel with Dynamic Island, or a frameless white phone (Wise). No heavy chrome.
- **Imagery:** generated with Codex CLI (`assets/appstore-gen/`): 3D Hop, 3D hand (the screen was a pure-green plate, measured and replaced with real UI), botanical texture, two London lifestyle photos.

| # | Headline | Treatment |
|---|---|---|
| 01 | Get it done. Get paid. | 3D Hop hero, Hop pattern, circled "paid" |
| 02 | The fast way to get it done | Finding card over botanical texture, Hop peeking |
| 03 | Built to protect every penny | Lime, frameless phone, escrow checkout |
| 04 | Earn on your way | Lifestyle photo, inbound ask |
| 05 | Pick who helps | Dark, offer callout, "Fixed price · No bidding" pill |
| 06 | Chat, track, done. | 3D hand holding the chat, eyebrow + underline |
| 07 | Verified. Trusted. | Verified pass over texture |
| 08 | Get paid the moment it's done | Lifestyle photo, payout card |

### v4.4: real people, iOS focus

- **Dummy people** are photoreal portraits generated with Codex CLI. They are fictional (`assets/people/` 1024 px masters, `prototype/public/people/` web copies) and replace every initials avatar in the prototype and Figma: offer cards, chat headers, map markers, lists.
- **iOS dimming:** anything that asks for attention dims what's behind it.
  - Black 40% (the `scrim` token): tooltips (spotlit row), incoming-ask cards (02.4, 04.1b), decision sheets (03.6 boost, 02.6 offer sent) and every modal or sheet.
  - Black 25%: the BTS pop-up.
  - No dim: toasts, which stay non-blocking per the HIG.

### v4.5: personality, glass and interaction pass (prototype + Figma)

- **Hop's personality by state:**
  - wave: sways and hops.
  - searching: leans, scans and the magnifier glints. It peeks over the finding card and never covers the map.
  - happy: squash-and-stretch jump with sparkles.
  - sad: droop, head-shake and a sweat drop.
  - idle: breathes.
  - Tapping Hop makes it react. The Motion notes on 01.2, 02.7, 03.2, 03.6, 03.9 and 04.3 describe each state.
- **Slide to confirm:** solid colours (dark track, solid green fill, white knob with a green arrow). Success is solid brand green with white text, about 5:1 contrast.
- **Glass tab bar** on every screen (translucent gradient, 24px background blur, light edge). The Nearby list on 02.1 scrolls under it.
- **Maps** pan by drag in the prototype.
- **Rate:**
  - 04.3: summary pill, Hop's mood follows the score, section labels, optional note.
  - 03.9b (new): rating your helper adds a tip.
- **New state 03.1c location picker:** search, current location, suggestions, and drag the map under the pin.
- **Every control does something:** payment method, wallet history, settings rows, Lifeline and country code open sheets; the chat input sends.
- The Figma clickable prototype is regenerated (49 screens, 121 links).
