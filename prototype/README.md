# Askapade · interactive prototype

Coded prototype of the v4 flows (Hop the agent, offers + escrow, inbound Uber-style asks).
Live: https://askapade-prototype.vercel.app

```bash
npm install
npm run dev
```

- **On iPhone:** open the link in Safari → Share → **Add to Home Screen**. It launches full-screen like an app, with the real status bar, notch and home-indicator safe areas, and no zoom or bounce. Layouts adapt from iPhone SE to Pro Max.
- **Deep links:** `/#onboarding`, `/#home`, `/#inbound`, `/#post`, `/#post-boost` (scenario 2), `/#helper-chat`, `/#asker-chat`, `/#wallet`, `/#profile`, `/#settings`.
- **Scenario switch** (desktop side panel): 1 · 2 offers, or 2 · 0 offers → boost → 5 offers.
- Motion follows `HANDOFF.md`: UI 200–300 ms on `cubic-bezier(0.23,1,0.32,1)`, sheets on `cubic-bezier(0.32,0.72,0,1)`, springs at bounce 0.2, press scale 0.97, reduced motion respected.
- Assets: Hop and map bases exported from the Figma file; 3D icons from `../assets/icons`.
