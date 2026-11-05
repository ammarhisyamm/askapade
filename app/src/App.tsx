import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapTrifold, ChatsCircle, UserCircle, Plus, ListBullets, NavigationArrow, WifiSlash, Crosshair, CreditCard, XCircle } from '@phosphor-icons/react'
import { StoreProvider, useStore, type Route } from './store'
import { money, totals, type Ask, SEED_ASKS } from './data'
import { Toast, Modal, Button, Icon3D, haptic } from './ui'
import { MapView } from './screens/MapView'
import { PostSheet } from './screens/Post'
import { SearchSheet, LiveStatus, BoostSheet, MatchCard } from './screens/Search'
import { ChatsList, ChatScreen } from './screens/Chat'
import { InboundCard, YouGotIt, sendOffer } from './screens/Inbound'
import { Profile, OtherProfile, Levels, EditProfile } from './screens/Profile'
import { Wallet, Receipt } from './screens/Wallet'
import { Settings, Notifications, Lifeline, Blocked, Verification, VerifyPrompt, Contact } from './screens/Settings'
import { Nearby } from './screens/Nearby'
import { Share, SharedLink } from './screens/Share'
import { Carousel, Signup, Waitlist } from './screens/Onboarding'
import './styles.css'

export default function App() {
  return (
    <StoreProvider>
      <div className="stage">
        <Panel />
        <div className="phone">
          <div className="phone-screen">
            <StatusBar />
            <Phone />
          </div>
        </div>
      </div>
    </StoreProvider>
  )
}

function StatusBar() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 15000); return () => clearInterval(i) }, [])
  return (
    <div className="status-bar" aria-hidden>
      <span className="t-callout t-num">{t.getHours()}:{String(t.getMinutes()).padStart(2, '0')}</span>
      <span className="status-island" />
      <span className="status-icons"><i /><i /><i /><b /></span>
    </div>
  )
}

function Phone() {
  const s = useStore()
  const [problem, setProblem] = useState<null | 'offline' | 'location' | 'payment'>(null)
  ;(window as any).__problem = setProblem

  if (s.sharedLink) return <SharedLink />
  if (!s.onboarded) return <Carousel />

  const top = s.stack[s.stack.length - 1]
  const offer = (a: Ask) => s.requireAccount(() => sendOffer(s, a))
  const share = (a: Ask) => s.push({ name: 'share', askId: a.id })

  return (
    <div className="app">
      {/* Map is always underneath: the home screen */}
      <MapView onOffer={offer} onShare={share} />
      {!s.live && <Waitlist />}

      {s.live && s.tab === 'map' && !top && (
        <div className="map-controls glass" role="toolbar" aria-label="Map controls">
          <button aria-label="Nearby list" onClick={() => s.push({ name: 'nearby' })}><ListBullets size={20} weight="bold" /></button>
          <span className="map-controls-div" />
          <button aria-label="Recentre" onClick={() => window.dispatchEvent(new Event('askapade:recenter'))}><NavigationArrow size={20} weight="fill" /></button>
        </div>
      )}
      {s.live && <LiveStatus />}

      {/* Tabs other than map */}
      <AnimatePresence>
        {s.tab !== 'map' && !top && (
          <motion.div key={s.tab} className="tab-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {s.tab === 'chats' ? <ChatsList /> : <Profile />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pushed screens */}
      <AnimatePresence>
        {top && (
          <motion.div key={routeKey(top) + s.stack.length} className="pushed" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
            <RouteView r={top} onOffer={offer} onShare={share} />
          </motion.div>
        )}
      </AnimatePresence>

      {s.live && !top && <TabBar />}

      <PostSheet />
      <SearchSheet />
      <BoostSheet />
      <MatchCard />
      <CancelBeforeMatch />
      <InboundCard />
      <YouGotIt />
      <VerifyPrompt />
      <CancelledByThem />
      <ProblemModal kind={problem} onClose={() => setProblem(null)} />

      <AnimatePresence>{s.signupFor && <Signup />}</AnimatePresence>
      <Toast text={s.toast} />
    </div>
  )
}

const routeKey = (r: Route) => r.name + ('id' in r ? r.id : '') + ('askId' in r ? r.askId : '')

function RouteView({ r, onOffer, onShare }: { r: Route; onOffer: (a: Ask) => void; onShare: (a: Ask) => void }) {
  switch (r.name) {
    case 'chat': return <ChatScreen cid={r.id} />
    case 'wallet': return <Wallet />
    case 'receipt': return <Receipt txId={r.txId} />
    case 'settings': return <Settings />
    case 'levels': return <Levels />
    case 'lifeline': return <Lifeline />
    case 'verify': return <Verification />
    case 'notifications': return <Notifications />
    case 'blocked': return <Blocked />
    case 'edit-profile': return <EditProfile />
    case 'contact': return <Contact />
    case 'share': return <Share askId={r.askId} />
    case 'nearby': return <Nearby onOffer={onOffer} onShare={onShare} />
    case 'other-profile': return <OtherProfile username={r.username} />
  }
}

/** Glass tab bar over the map, plus a floating + to post */
function TabBar() {
  const s = useStore()
  const unread = s.chats.reduce((n, c) => n + (c.unread ?? 0), 0)
  const tabs = [
    { k: 'map' as const, l: 'Map', i: MapTrifold },
    { k: 'chats' as const, l: 'Chats', i: ChatsCircle },
    { k: 'profile' as const, l: 'Profile', i: UserCircle },
  ]
  const canPost = !s.myAsk
  return (
    <>
      <nav className="tab-bar glass" aria-label="Tabs">
        {tabs.map(t => (
          <button key={t.k} className={`tab ${s.tab === t.k ? 'is-on' : ''}`} onClick={() => { s.setTab(t.k); haptic() }} aria-current={s.tab === t.k}>
            {s.tab === t.k && <motion.span layoutId="tab-bg" className="tab-bg" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <t.i size={24} weight={s.tab === t.k ? 'fill' : 'regular'} />
            <span className="t-micro">{t.l}</span>
            {t.k === 'chats' && unread > 0 && <span className="tab-dot" />}
          </button>
        ))}
      </nav>
      <motion.button className="fab" aria-label="Post an ask" whileTap={{ scale: 0.9 }} disabled={!canPost}
        onClick={() => { haptic(); s.setTab('map'); s.setOverlay('post') }}>
        <Plus size={28} weight="bold" />
      </motion.button>
    </>
  )
}

function CancelBeforeMatch() {
  const s = useStore()
  const a = s.myAsk
  const open = s.overlay === 'cancel' && !!a && (a.phase === 'searching' || a.phase === 'nobody')
  if (!a) return null
  const t = totals(a.fee, a.finder)
  return (
    <Modal open={open} onClose={() => s.setOverlay(null)} title="Cancel this ask?" icon={<Icon3D id={a.icon} size={64} />}>
      <p className="t-body modal-note">Note: nothing is charged. The {money(a.currency, t.total)} hold on your card is released.</p>
      <div className="modal-actions">
        <Button full onClick={() => s.setOverlay(null)}>Keep it</Button>
        <Button full kind="danger" onClick={() => { s.setMyAsk(null); s.setSearchOpen(false); s.setOverlay(null); s.showToast('Ask cancelled') }}>Cancel ask</Button>
      </div>
    </Modal>
  )
}

/** If either person cancels: a push out of the app, a modal in it */
function CancelledByThem() {
  const s = useStore()
  const c = s.chats.find(x => x.cancelled === 'them' && !(x as any).seen)
  const open = s.overlay === 'cancelledByThem' && !!c
  if (!c) return null
  return (
    <Modal open={open} onClose={() => s.setOverlay(null)} title={`${c.with.first} cancelled the ask`} icon={<Icon3D id={c.ask.icon} size={64} />}>
      <p className="t-body modal-note">You’ve been refunded {money(c.ask.currency, c.ask.fee + c.ask.finder)}.</p>
      <div className="modal-actions">
        <Button full onClick={() => { s.setOverlay('post') }}>Post again</Button>
        <button className="link-quiet t-callout" onClick={() => s.setOverlay(null)}>Close</button>
      </div>
    </Modal>
  )
}

/** Empty and error states: an icon and a few words */
function ProblemModal({ kind, onClose }: { kind: null | 'offline' | 'location' | 'payment'; onClose: () => void }) {
  const map = {
    offline: { i: <WifiSlash size={34} weight="bold" />, t: 'No connection', b: 'Unable to reach server.', btn: 'Try again' },
    location: { i: <Crosshair size={34} weight="bold" />, t: 'Location off', b: 'Unable to access location services. Visit Settings.', btn: 'Open Settings' },
    payment: { i: <CreditCard size={34} weight="bold" />, t: 'Payment failed', b: 'Checkout failed. Try again.', btn: 'Try again' },
  }
  const m = kind ? map[kind] : null
  return (
    <Modal open={!!m} onClose={onClose} title={m?.t ?? ''} icon={<span className={`modal-glyph ${kind === 'payment' ? 'is-danger' : ''}`}>{m?.i}</span>}>
      <p className="t-body modal-note">{m?.b}</p>
      <div className="modal-actions"><Button full onClick={onClose}>{m?.btn}</Button></div>
    </Modal>
  )
}

/* ---------- Prototype panel: lives outside the phone, for reviewers ---------- */
function Panel() {
  const s = useStore()
  const scenario = (n: 1 | 2) => {
    ;(window as any).__scenario = n
    s.reset(); s.setOnboarded(true); s.setSignedUp(true); s.setHasCard(true)
    setTimeout(() => s.setOverlay('post'), 50)
  }
  const inbound = (mode: 'card' | 'banner') => {
    s.setOnboarded(true); s.setStack([]); s.setTab('map')
    const a: Ask = { ...SEED_ASKS[4], id: `A24${Math.floor(Math.random() * 90 + 10)}`, endsAt: Date.now() + 2 * 3600_000 }
    s.setAsks(as => [a, ...as.filter(x => x.id !== a.id)])
    s.setInbound({ ask: a, mode })
  }
  const verify = (h: 6 | 24) => { (window as any).__paused = h === 24; s.setOnboarded(true); s.setVerifyPrompt(true) }
  const themCancel = () => {
    const c = s.chats.find(x => x.mine && !x.paidAt && !x.cancelled)
    if (!c) { s.showToast('Start Scenario 1 first'); return }
    s.updateChat(c.id, x => ({ ...x, cancelled: 'them' })); s.setMyAsk(null); s.setOverlay('cancelledByThem')
  }
  const groups: { t: string; items: [string, () => void][] }[] = [
    { t: 'Flows', items: [
      ['Intro carousel', () => { s.reset(); s.setOnboarded(false) }],
      ['Scenario 1: someone found', () => scenario(1)],
      ['Scenario 2: nobody, then Boost', () => scenario(2)],
      ['Receive an ask (idle)', () => inbound('card')],
      ['Receive an ask (mid-ask banner)', () => inbound('banner')],
      ['First post: sign-up', () => { s.reset(); s.setOnboarded(true); s.setSignedUp(false); s.setHasCard(false); setTimeout(() => s.setOverlay('post'), 50) }],
    ] },
    { t: 'States', items: [
      ['Waitlist city', () => { s.reset(); s.setOnboarded(true); s.setLive(false) }],
      ['Shared link', () => s.setSharedLink({ askId: 'A2305', ended: false })],
      ['Shared link, ended', () => s.setSharedLink({ askId: 'A2290', ended: true })],
      ['Verify prompt (6h)', () => verify(6)],
      ['Account paused (24h)', () => verify(24)],
      ['They cancelled', themCancel],
      ['No connection', () => (window as any).__problem('offline')],
      ['Location off', () => (window as any).__problem('location')],
      ['Payment failed', () => (window as any).__problem('payment')],
    ] },
  ]
  return (
    <aside className="panel">
      <span className="panel-mark"><svg viewBox="0 0 40 40" aria-hidden>{[0, 90, 180, 270].map(r => <circle key={r} cx="20" cy="11" r="8" transform={`rotate(${r} 20 20)`} />)}</svg></span>
      <h1 className="t-title2">askapade prototype</h1>
      {groups.map(g => (
        <div key={g.t} className="panel-group">
          <span className="t-micro t-quiet">{g.t}</span>
          {g.items.map(([l, f]) => <button key={l} className="panel-btn t-callout" onClick={f}>{l}</button>)}
        </div>
      ))}
      <button className="panel-btn panel-reset t-callout" onClick={() => { s.reset(); s.setOnboarded(true) }}><XCircle size={16} weight="bold" />Reset to map</button>
    </aside>
  )
}
