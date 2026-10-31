# Screen inventory

Source of truth: `prototype/src/App.tsx` (`SCREENS` + `SCREENS_INDEX`). Every navigable state is listed — 51 entries across 25 screen components. Last updated 2026-10-31.

Status key: Not audited · Audited · Ready for migration · Migrated · Visually verified · Blocked.

"Visually verified" means the rendered end state was checked at 375×812 (iPhone 13/14/15) with `?still`. Height-sensitive screens (01.2, 01.5, 03.1d, 03.4) were also checked at 375×667 (iPhone SE). Motion was reviewed in code; it wasn't watched playing, because the review browser doesn't run animation frames.

Styling approach (all screens): global classes in `src/styles.css` plus inline style objects in each component. Shared components live in `src/ui.tsx`; icons in `src/icons.tsx`.

## Per-module audit (before migration)

| File | Hardcoded hex | rgba() | Lime refs | Glass | Gradients | Font sizes used | Radii used |
|---|---|---|---|---|---|---|---|
| `ui.tsx` | 78 | 2 | 6 | 0 | 4 | 12, 14, 16 | 2, 12, 16, 28, 32 |
| `screens/Extra.tsx` | 41 | 26 | 13 | 1 | 4 | 9, 11, 12, 13, 14, 15, 18, 22, 24, 28, 30, 60, 88 | 1, 2, 4, 8, 9, 10, 12, 13, 14, 16, 18, 20, 22, 24, 30, 32, 38 |
| `screens/Onboarding.tsx` | 11 | 20 | 0 | 3 | 1 | 11, 12, 13, 14, 15, 16, 17, 18, 28, 40 | 2, 8, 10, 11, 12, 14, 17, 18, 20, 27, 32 |
| `screens/Chat.tsx` | 10 | 0 | 0 | 0 | 0 | 12, 15, 17, 44 | 4, 12, 14, 16, 18, 26 |
| `screens/Explore.tsx` | 10 | 5 | 2 | 3 | 0 | 12, 14, 15, 16, 17, 20, 40, 56 | 4, 6, 7, 12, 14, 16, 20, 28 |
| `screens/Misc.tsx` | 17 | 16 | 5 | 0 | 3 | 11, 12, 13, 14, 15, 17, 22, 28, 52, 76 | 10, 12, 16, 18, 20, 24 |
| `screens/Asking.tsx` | 15 | 1 | 7 | 2 | 0 | 11, 12, 13, 14, 16, 21, 28 | 6, 9, 10, 11, 12, 13, 14, 16, 18, 20, 24 |

Cross-cutting issues found: ~20 distinct radius values; font sizes 9–88px; weights 400/500/600/700/750/800; legacy lime accent (#C8F560 / #F1FCD9) on badges, tints, ticks, knobs and confetti; tertiary text #7C887E fails WCAG AA (≈3.9:1 on the app background); glass and shadows written inline with ad hoc values; pill radii on badges and chips.

## Screens

| ID | Screen | Route | Component · file | Uses | Issues found | Required changes | Status |
|---|---|---|---|---|---|---|---|
| 01.1 | Splash | `#01.1` | Splash · `screens/Onboarding.tsx` | HomeBar | Wordmark 40/800 ad hoc; hardcoded #fff filter on logo. | Type token for wordmark; colour tokens. | Migrated — end state verified; splash sequence is timed, captured mid-collapse only |
| 01.2 | Welcome (match + route scenes) | `#01.2` | Intro, MatchScene, RouteScene, MapBg · `screens/Onboarding.tsx` | Frog, Btn, Ticker, MapBg | Glass logo pill + rgba washes hardcoded; chip radius 12/11/17; 7 font sizes. | Map-overlay glass via tokens; radius scale; caption/foot type. | Visually verified |
| 01.5 | Phone number | `#01.5` | PhoneNumber · `screens/Extra.tsx` | Frog, Keypad, Ticker, ListSheet, Btn | Card radius 22; keypad radius 8; hardcoded keypad greys; grey CTA rgba. | Radius md/lg; keypad tokens; disabled state token. | Visually verified |
| 01.6 | Code | `#01.6` | Code · `screens/Extra.tsx` | Keypad, Frog | Digit 30/800; radius 16; ad hoc shadows. | OTP digit size from scale (28); radius md; elevation tokens. | Visually verified |
| 01.6b | Code verified (pop-up) | `#01.6b` | Code (verified) · `screens/Extra.tsx` | Frog, VerifiedSeal | Popup radius 32; lime sparkles (#C8F560). | Modal radius xl; sparkles brand/brand-tint. | Visually verified |
| 01.7 | Skills | `#01.7` | Skills · `screens/Extra.tsx` | Sheet(.sheet), Ticker | Selected tile lime-50 tint; badge.success lime tint. | brand-tint selected; badge tokens. | Visually verified |
| 01.8 | Permissions | `#01.8` | Permissions · `screens/Onboarding.tsx` | Hop, Btn | iOS dialog uses system greys (allowed, mimics OS); pulse CTA radius 27. | Keep iOS system dialog colours (documented exception); CTA radius full. | Visually verified |
| 08.2 | Notifications primer | `#08.2` | NotifPrimer · `screens/Extra.tsx` | Btn | Mixed caption sizes. | Type scale. | Visually verified |
| 02.1 | Map home | `#02.1` | Home · `screens/Explore.tsx` | MapCanvas, Pin, TabBar, Tactile, Sheet | Status pill glass ad hoc; badge lime for boost price; radius 7/16/28 mix. | Glass tokens over map only; badge tokens; radius scale. | Visually verified |
| 02.1b | BTS boosted pop-up | `#02.1b` | Home (bts) · `screens/Explore.tsx` | — | Hardcoded rgba glass + shadow. | Map-overlay token + e-3. | Visually verified |
| 02.1c | Radius picker | `#02.1c` | Home (radius) · `screens/Explore.tsx` | Sheet, chip | Chip radius 12 pill-ish. | Chip radius sm. | Visually verified |
| 02.3 | Push (lock screen) | `#02.3` | Push · `screens/Extra.tsx` | — | iOS lock-screen mimic uses system blur/greys. | Documented OS-mimic exception; type scale for app content. | Visually verified |
| 02.4 | Inbound ask | `#02.4` | Home (inbound), InboundCard · `screens/Explore.tsx` | BorderTrace, Tile, Avatar | Amount 56/800 off scale; hardcoded orange text #b36b00. | Display token; warning token. | Visually verified |
| 02.5 | Asks list | `#02.5` | List · `screens/Extra.tsx` | Tactile, Sheet, Tile | Filter chips radius 16 pills; offer button custom. | Chip radius sm; Btn offer variant (tinted). | Visually verified |
| 02.5b | List · fee filter | `#02.5b` | List (filter) · `screens/Extra.tsx` | Sheet, range | Range accent colour ad hoc. | accent-color: brand token. | Visually verified |
| 02.2 | Ask preview | `#02.2` | AskPreview · `screens/Explore.tsx` | SwipeConfirm, Avatar, Tile | Hardcoded warning text colour; 40/800 amount. | Warning + display tokens. | Visually verified |
| 02.6 | Offer sent | `#02.6` | Home (sent) · `screens/Explore.tsx` | Sheet, Hop | — | Type/radius scale. | Visually verified |
| 02.7 | Offer accepted | `#02.7` | Home (accepted) · `screens/Explore.tsx` | Modal, Hop, Btn | Modal radius 28 (ok); badge warning tint. | Badge tokens. | Visually verified |
| 03.1 | Post an ask | `#03.1` | PostAsk · `screens/Asking.tsx` | Tile, Pin, MapCanvas, Sheet, Btn | Lime tint on icon tile/badge; 11 radius values; currency seg radius 9. | brand-tint; radius scale; seg control tokens. | Visually verified |
| 03.1d | Written · Hop picked icon | `#03.1d` | PostAsk (filled) · `screens/Asking.tsx` | same | Hop badge lime tint. | brand-tint. | Visually verified |
| 03.1e | Map icon picker | `#03.1e` | PostAsk (pick) · `screens/Asking.tsx` | Sheet, Tile | Selected tile lime tint + ring. | brand-tint + brand ring. | Visually verified |
| 03.1b | Finder’s fee tip | `#03.1b` | PostAsk (tip) · `screens/Asking.tsx` | Tooltip, scrim | Tooltip radius 14; badge lime. | Tooltip radius md; badge tokens. | Visually verified |
| 03.1c | Location picker | `#03.1c` | PostAsk (loc) · `screens/Asking.tsx` | Sheet, MapCanvas | Hint badge invert ok. | Radius scale. | Visually verified |
| 03.2 | Hop finding | `#03.2` | Finding · `screens/Asking.tsx` | MapCanvas, Ring, Person, Pin, Hop | Glass pill ad hoc; title 21px off scale. | Title2 22; glass token. | Visually verified |
| 03.2b | Offers arriving | `#03.2b` | Finding · `screens/Asking.tsx` | Avatar | Offer toast radius 18. | Radius lg. | Migrated — animated variant of 03.2 (verified via 03.2); no static end state to capture |
| 03.6 | No offers · boost | `#03.6` | Finding (scenario 2) · `screens/Asking.tsx` | Sheet, range, chip | Range accent ad hoc. | Range token. | Visually verified |
| 03.3 | Offers · 2 | `#03.3` | Offers · `screens/Asking.tsx` | Avatar, Btn | Selected card lime tint; radio radius 12. | brand-tint; radio full. | Visually verified |
| 03.7 | Offers · 5 | `#03.7` | Offers (n=5) · `screens/Asking.tsx` | same | same | same | Visually verified |
| 03.4 | Checkout | `#03.4` | Offers (checkout) · `screens/Asking.tsx` | Sheet, SwipeConfirm | Apple Pay tile #000 literal. | Ink token. | Visually verified |
| 03.5 | Chat | `#03.5` | Chat (asker) · `screens/Chat.tsx` | Stepper, MapCanvas, composer | Ring timer 44px number; bubbles radius 18. | Bubble radius lg; type scale. | Visually verified |
| 03.5b | Chat actions | `#03.5b` | Chat (actions) · `screens/Chat.tsx` | Sheet | SOS red literal. | danger token. | Visually verified |
| 03.5c | Chat attach | `#03.5c` | Chat (attach) · `screens/Chat.tsx` | Sheet | Attach tiles colour literals. | Tokens. | Visually verified |
| 08.1 | Cancel ask | `#08.1` | Chat (cancel) · `screens/Chat.tsx` | Modal | — | Type scale. | Visually verified |
| 03.8 | Release payout | `#03.8` | Chat (release) · `screens/Chat.tsx` | HoldButton | Hold done label lime tick. | Tick on-dark token. | Visually verified |
| 03.9 | All done | `#03.9` | Chat (done) · `screens/Chat.tsx` | Modal, Confetti | Confetti palette includes lime. | Confetti palette from brand. | Visually verified |
| 03.9b | Rate helper + tip | `#03.9b` | Rate (tip) · `screens/Misc.tsx` | Avatar, chip | Tag chips pill; star amber literal. | Chip radius sm; rating token. | Visually verified |
| 04.1 | Chat · helping | `#04.1` | Chat (helper) · `screens/Chat.tsx` | seg-mini, qr | — | Tokens. | Visually verified |
| 04.1b | New ask mid-job | `#04.1b` | Chat (inbound) · `screens/Chat.tsx` | MidJobInbound | Card rgba shadow literal. | e-3. | Visually verified |
| 04.1c | Update status | `#04.1c` | Chat (status) · `screens/Chat.tsx` | Sheet | — | Tokens. | Visually verified |
| 04.1m | Live map | `#04.1m` | Chat (map) · `screens/Chat.tsx` | MapCanvas | Glass controls ad hoc. | Map-overlay token. | Visually verified |
| 04.2 | Paid | `#04.2` | Paid · `screens/Misc.tsx` | CountUp, Confetti | Amount 52/76 off scale; gradient halo. | Display token; remove decorative gradient. | Visually verified |
| 04.4 | Badge unlocked | `#04.4` | Paid (badge) · `screens/Misc.tsx` | Modal, rays | Conic rays gradient + lime. | Brand-tint rays. | Visually verified |
| 04.3 | Rate | `#04.3` | Rate · `screens/Misc.tsx` | Avatar, chip, Btn | Star amber literal; tags pill. | Rating token; chip radius. | Visually verified |
| 05.1 | Wallet | `#05.1` | Wallet · `screens/Misc.tsx` | Btn, ListSheet | Lime cash-out button (legacy accent); balance card gradient. | Primary button; solid surface. | Visually verified |
| 05.2 | Cash out | `#05.2` | CashOut · `screens/Extra.tsx` | Keypad, SwipeConfirm | Amount 60/88 off scale. | Display tokens. | Visually verified |
| 06.1 | Scan ID | `#06.1` | ScanId · `screens/Extra.tsx` | — | Scan frame lime line; radius 30/38. | Brand scan line; radius xl. | Visually verified |
| 06.2 | Verified pass | `#06.2` | Verified · `screens/Extra.tsx` | Avatar, card | Card colour #0E3B19 literal; chip check lime. | brand-dark token; on-dark tick. | Visually verified |
| 06.3 | Profile | `#06.3` | Profile · `screens/Misc.tsx` | Avatar, TabBar, ListSheet | ID chip lime-50. | brand-tint. | Visually verified |
| 06.4 | Settings | `#06.4` | Settings · `screens/Misc.tsx` | ListSheet | — | Tokens. | Visually verified |
| 07.1 | Share & earn | `#07.1` | ShareEarn · `screens/Extra.tsx` | Toast | Brand marks (allowed exception); badge lime "You earn". | Badge tokens; keep 3rd-party brand colours. | Visually verified |
| — | My asks | `(index)` | MyAsks · `screens/Misc.tsx` | TabBar | — | Tokens. | Visually verified |
