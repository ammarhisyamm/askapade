import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Ctx, type Kind, type Route } from './store'
import { EASE_DRAWER, EASE_OUT } from './ui'
import { Splash, Intro, Permissions } from './screens/Onboarding'
import { Home, AskPreview } from './screens/Explore'
import { PostAsk, Finding, Offers } from './screens/Asking'
import { Chat } from './screens/Chat'
import { Paid, Rate, Wallet, Profile, Settings, MyAsks } from './screens/Misc'

const SCREENS: Record<string, (p: Record<string, unknown>) => ReactNode> = {
  splash: () => <Splash />, intro: () => <Intro />, permissions: () => <Permissions />,
  home: p => <Home {...p} />, preview: () => <AskPreview />,
  post: () => <PostAsk />, finding: p => <Finding {...p} />, offers: p => <Offers {...p} />,
  chat: p => <Chat {...p} />, paid: () => <Paid />, rate: p => <Rate {...p} />,
  wallet: () => <Wallet />, profile: () => <Profile />, settings: () => <Settings />, myasks: () => <MyAsks />,
}

const variants = {
  initial: (k: Kind) => k === 'push' ? { x: '100%' } : k === 'back' ? { x: '-28%', opacity: 0.6 } : k === 'up' ? { y: '100%' } : k === 'down' ? { opacity: 0 } : { opacity: 0, scale: 0.985 },
  animate: { x: 0, y: 0, opacity: 1, scale: 1 },
  exit: (k: Kind) => k === 'push' ? { x: '-28%', opacity: 0.6 } : k === 'back' ? { x: '100%', zIndex: 2 } : k === 'up' ? { opacity: 0.6 } : k === 'down' ? { y: '100%', zIndex: 2 } : { opacity: 0 },
}

const JUMPS: [string, string, Record<string, unknown>?][] = [
  ['Onboarding', 'splash'], ['Map home', 'home'], ['Post an ask', 'post'], ['Inbound ask', 'home', { inbound: true }],
  ['Helper chat', 'chat', { role: 'helper' }], ['Asker chat', 'chat', { role: 'asker' }], ['Profile', 'profile'], ['Settings', 'settings'],
]

// Shareable deep links, e.g. /#inbound, /#post, /#post-boost (scenario 2), /#helper-chat
const LINKS: Record<string, [string, Record<string, unknown>?, (1 | 2)?]> = {
  onboarding: ['splash'], home: ['home'], inbound: ['home', { inbound: true }], post: ['post'], 'post-boost': ['post', undefined, 2],
  'helper-chat': ['chat', { role: 'helper' }], 'asker-chat': ['chat', { role: 'asker' }], profile: ['profile'], settings: ['settings'], wallet: ['wallet'],
}
const fromHash = (): [Route, 1 | 2] => {
  const l = LINKS[window.location.hash.slice(1)]
  return l ? [{ name: l[0], p: l[1], kind: 'fade', key: 0 }, l[2] ?? 1] : [{ name: 'splash', kind: 'fade', key: 0 }, 1]
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
              <span className="label">Jump to</span>
              <div className="jump">{JUMPS.map(([l, n, p]) => <button key={l} onClick={() => go(n, p, 'fade')}>{l}</button>)}</div>
            </div>
            <p className="hint">Motion: UI 200–300ms on cubic-bezier(0.23, 1, 0.32, 1), sheets on cubic-bezier(0.32, 0.72, 0, 1), springs at bounce 0.2. Respects reduced motion.</p>
          </aside>
        </div>
      </MotionConfig>
    </Ctx.Provider>
  )
}
