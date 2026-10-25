import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Ctx, type Kind, type Route } from './store'
import { EASE_DRAWER, EASE_OUT } from './ui'
import { Splash, Intro, Permissions } from './screens/Onboarding'
import { Home, AskPreview } from './screens/Explore'
import { PostAsk, Finding, Offers } from './screens/Asking'
import { Chat } from './screens/Chat'
import { Paid, Rate, Wallet, Profile, Settings, MyAsks } from './screens/Misc'
import { PhoneNumber, Code, Skills, Push, List, CashOut, ScanId, Verified, ShareEarn, NotifPrimer } from './screens/Extra'

const SCREENS: Record<string, (p: Record<string, unknown>) => ReactNode> = {
  splash: () => <Splash />, intro: () => <Intro />, permissions: () => <Permissions />,
  home: p => <Home {...p} />, preview: () => <AskPreview />,
  post: p => <PostAsk {...p} />, finding: p => <Finding {...p} />, offers: p => <Offers {...p} />,
  chat: p => <Chat {...p} />, paid: p => <Paid {...p} />, rate: p => <Rate {...p} />,
  phone: () => <PhoneNumber />, code: () => <Code />, skills: () => <Skills />, push: () => <Push />, list: p => <List {...p} />,
  cashout: () => <CashOut />, scan: () => <ScanId />, verified: () => <Verified />, share: () => <ShareEarn />, notif: () => <NotifPrimer />,
  wallet: p => <Wallet {...p} />, profile: () => <Profile />, settings: () => <Settings />, myasks: () => <MyAsks />,
}

const variants = {
  initial: (k: Kind) => k === 'push' ? { x: '100%' } : k === 'back' ? { x: '-28%', opacity: 0.6 } : k === 'up' ? { y: '100%' } : k === 'down' ? { opacity: 0 } : { opacity: 0, scale: 0.985 },
  animate: { x: 0, y: 0, opacity: 1, scale: 1 },
  exit: (k: Kind) => k === 'push' ? { x: '-28%', opacity: 0.6 } : k === 'back' ? { x: '100%', zIndex: 2 } : k === 'up' ? { opacity: 0.6 } : k === 'down' ? { y: '100%', zIndex: 2 } : { opacity: 0 },
}

// Every Figma screen, in flow order. Each is a button in the side panel and a shareable link (/#03.4).
type Entry = [id: string, label: string, route: string, params?: Record<string, unknown>, scenario?: 1 | 2]
const SCREENS_INDEX: [string, Entry[]][] = [
  ['01 · Onboarding', [['01.1', 'Splash', 'splash'], ['01.2', 'Meet Hop', 'intro'], ['01.5', 'Phone number', 'phone'], ['01.6', 'Code', 'code'], ['01.7', 'Skills', 'skills'], ['01.8', 'Permissions', 'permissions'], ['08.2', 'Notifications primer', 'notif']]],
  ['02 · Offer to help', [['02.1', 'Map home', 'home'], ['02.1b', 'BTS boosted pop-up', 'home', { bts: true }], ['02.1c', 'Radius picker', 'home', { radius: true }], ['02.3', 'Push (lock screen)', 'push'], ['02.4', 'Inbound ask', 'home', { inbound: true }], ['02.5', 'Asks list', 'list'], ['02.5b', 'List · fee filter', 'list', { filter: 'fee' }], ['02.2', 'Ask preview', 'preview'], ['02.6', 'Offer sent', 'home', { sent: true }], ['02.7', 'Offer accepted', 'home', { accepted: true }]]],
  ['03 · Post an ask', [['03.1', 'Post an ask', 'post'], ['03.1b', 'Finder’s fee tip', 'post', { tip: true }], ['03.1c', 'Location picker', 'post', { loc: true }], ['03.2', 'Hop finding', 'finding'], ['03.2b', 'Offers arriving', 'finding'], ['03.3', 'Offers · 2', 'offers', { n: 2 }], ['03.4', 'Checkout', 'offers', { n: 2, checkout: true }], ['03.5', 'Chat', 'chat', { role: 'asker' }], ['03.5b', 'Chat actions', 'chat', { role: 'asker', open: 'actions' }], ['03.5c', 'Chat attach', 'chat', { role: 'asker', open: 'attach' }], ['08.1', 'Cancel ask', 'chat', { role: 'asker', open: 'cancel' }], ['03.8', 'Release payout', 'chat', { role: 'asker', open: 'release' }], ['03.9', 'All done', 'chat', { role: 'asker', open: 'done' }], ['03.6', 'No offers · boost', 'finding', undefined, 2], ['03.7', 'Offers · 5', 'offers', { n: 5 }]]],
  ['04 · Helping', [['04.1', 'Chat · helping', 'chat', { role: 'helper' }], ['04.1b', 'New ask mid-job', 'chat', { role: 'helper', open: 'inbound' }], ['04.1c', 'Update status', 'chat', { role: 'helper', open: 'status' }], ['04.1m', 'Live map', 'chat', { role: 'helper', open: 'map' }], ['04.2', 'Paid', 'paid'], ['04.4', 'Badge unlocked', 'paid', { badge: true }], ['04.3', 'Rate', 'rate', { who: 'Ellie' }]]],
  ['05–07 · Money & trust', [['05.1', 'Wallet', 'wallet'], ['05.2', 'Cash out', 'cashout'], ['06.1', 'Scan ID', 'scan'], ['06.2', 'Verified pass', 'verified'], ['06.3', 'Profile', 'profile'], ['06.4', 'Settings', 'settings'], ['07.1', 'Share & earn', 'share'], ['—', 'My asks', 'myasks']]],
]
const BY_ID = Object.fromEntries(SCREENS_INDEX.flatMap(([, list]) => list.map(e => [e[0], e])))
// Friendly aliases kept from before
const ALIASES: Record<string, string> = { onboarding: '01.1', home: '02.1', inbound: '02.4', post: '03.1', 'post-boost': '03.6', 'helper-chat': '04.1', 'asker-chat': '03.5', profile: '06.3', settings: '06.4', wallet: '05.1' }
const fromHash = (): [Route, 1 | 2] => {
  const h = decodeURIComponent(window.location.hash.slice(1))
  const e = BY_ID[ALIASES[h] ?? h]
  return e ? [{ name: e[2], p: e[3], kind: 'fade', key: 0 }, e[4] ?? 1] : [{ name: 'splash', kind: 'fade', key: 0 }, 1]
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => fromHash()[0])
  const [scenario, setScenario] = useState<1 | 2>(() => fromHash()[1])
  useEffect(() => {
    const onHash = () => { const [r, sc] = fromHash(); setRoute(cur => ({ ...r, key: cur.key + 1 })); setScenario(sc) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const go = useCallback((name: string, p?: Record<string, unknown>, kind: Kind = 'push') => setRoute(r => ({ name, p, kind, key: r.key + 1 })), [])
  const ctx = useMemo(() => ({ route, go, scenario, setScenario }), [route, go, scenario])
  const render = SCREENS[route.name] ?? SCREENS.home
  // Desktop: shrink the phone frame to fit short windows (the mobile CSS ignores this)
  const [frameScale, setFrameScale] = useState(1)
  useEffect(() => {
    const fit = () => setFrameScale(Math.min(1, (window.innerHeight - 48) / 864))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <Ctx.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div className="stage">
          <div className="phone" style={{ transform: `scale(${frameScale})` }}>
            <AnimatePresence initial={false} custom={route.kind}>
              <motion.div key={route.key} custom={route.kind} variants={variants} initial="initial" animate="animate" exit="exit"
                transition={{ duration: route.kind === 'up' || route.kind === 'down' ? 0.45 : 0.4, ease: route.kind === 'up' || route.kind === 'down' ? EASE_DRAWER : EASE_OUT }}
                style={{ position: 'absolute', inset: 0 }}>
                {render(route.p ?? {})}
              </motion.div>
            </AnimatePresence>
          </div>
          <aside className="panel">
            <h1><img src="/hop/wave.svg" alt="" />askapade</h1>
            <p>Interactive prototype of the v4 flows. Tap through like the real app — Hop works behind the scenes, money sits in escrow until it’s released.</p>
            <div className="group">
              <span className="label">Posting scenario</span>
              <div className="seg">
                <button className={scenario === 1 ? 'on' : ''} onClick={() => setScenario(1)}>1 · 2 offers</button>
                <button className={scenario === 2 ? 'on' : ''} onClick={() => setScenario(2)}>2 · 0 → boost</button>
              </div>
              <span className="hint">Applies the next time you post an ask.</span>
            </div>
            <div className="group">
              <span className="label">All screens · tap to jump, or share /#ID</span>
              <div className="index">
                {SCREENS_INDEX.map(([title, list]) => (
                  <div key={title} className="col" style={{ gap: 4 }}>
                    <span className="t-cap muted" style={{ fontSize: 12 }}>{title}</span>
                    <div className="jump">{list.map(([id, label, name, p, sc]) => (
                      <button key={id + label} onClick={() => { setScenario(sc ?? 1); go(name, p, 'fade'); if (id !== '—') history.replaceState(null, '', '#' + id) }}><b style={{ color: 'var(--brand)', marginRight: 6 }}>{id}</b>{label}</button>
                    ))}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="hint">Motion: UI 200–300ms on cubic-bezier(0.23, 1, 0.32, 1), sheets on cubic-bezier(0.32, 0.72, 0, 1), springs at bounce 0.2. Respects reduced motion.</p>
          </aside>
        </div>
      </MotionConfig>
    </Ctx.Provider>
  )
}
