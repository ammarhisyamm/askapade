# Askapade · interactive prototype

Coded prototype of the v4 flows (Hop the agent, offers + escrow, inbound Uber-style asks).
Live: https://askapade-prototype.vercel.app

```bash
npm install
npm run dev
```

- **On iPhone:** open the link in Safari → Share → **Add to Home Screen**. It launches full-screen like an app, with the real status bar, notch and home-indicator safe areas, and no zoom or bounce. Layouts adapt from iPhone SE to Pro Max.
- **Every Figma screen is in and linked** (40 IDs). Open any one directly with `/#<ID>`, e.g. `/#01.6`, `/#03.4`, `/#05.2`. The desktop side panel lists them all. Friendly aliases still work: `/#home`, `/#inbound`, `/#post`, `/#post-boost`, `/#helper-chat`.
- **Scenario switch** (desktop side panel): 1 · 2 offers, or 2 · 0 offers → boost → 5 offers.
- Motion follows `HANDOFF.md`: UI 200–300 ms on `cubic-bezier(0.23,1,0.32,1)`, sheets on `cubic-bezier(0.32,0.72,0,1)`, springs at bounce 0.2, press scale 0.97, reduced motion respected.
- Assets: Hop and map bases exported from the Figma file; 3D icons from `../assets/icons`.

## Interactions (studied from 60fps.design)

| Reference | Where |
|---|---|
| Trendy / Bump splash: logo field collapses into the mascot | 01.1 → 01.2 |
| Yazio mascot idle: Hop sways and breathes | 01.2, 01.8 |
| Sesame location pulse: icon button expands into "allow location" | 01.8 |
| Digits pop, autofill from Messages, Uber verified tick | 01.5, 01.6 |
| Tactile tiles with springy checks and a ticking counter | 01.7 |
| Corner "map getting ready": pins drop in stages, status pill morphs | 02.1 (first visit) |
| Methods notification pop: pushes spring in one by one | 02.3, 08.2 |
| Uber search border highlight: light traces the new-ask card | 02.4, 04.1b |
| Recollect sheet → page: drag the Nearby sheet up into the list | 02.1 → 02.5 |
| CRED swipe to pay: green fill, glow, check draws in | 02.2, 03.4, 05.2 |
| Swiggy loading: status lines cycle while you wait | 02.6, 03.2 |
| Methods pop: offers arrive as cards above Hop | 03.2 → 03.3 |
| Revolut / Airbnb tactile pills: active fill slides on a spring | chips, tab bar, offer selection, cash-out speed |
| Wolt sheet → map zoom: mini map expands into a tilted live map | 03.5 / 04.1 |
| Opal hold to commit: hold to release the payout | 03.8 |
| Duolingo / CRED rewards: confetti, badge unlocked, count-up | 03.9, 04.2, 04.4 |
| Gyroscope tilt + sheen on the verified pass | 06.2 |
| Duolingo bouncy toast | copy link, queued offers, cash out |
