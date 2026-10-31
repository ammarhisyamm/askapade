import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronDown, Bell, Locate, X, Lock, Clock, Share, Hourglass, Zap, MapPin, List } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Pin, Me, Ring, MapCanvas, TabBar, Tile, Avatar, Sheet, Modal, BorderTrace, SwipeConfirm, DrawCheck, CountdownRing, Ticker, Toast, EASE_OUT } from '../ui'
import { Back, ChatIcon, Go, StarFill } from '../icons'

const ASKS = [
  { obj: 'puppy-face', t: 'Walk my dog for 30 mins', d: '450 m', left: '42m left', fee: '£15', x: 128, y: 220 },
  { obj: 'package-box', t: 'Collect a parcel', d: '700 m', left: '3h 10m', fee: '£8', x: 262, y: 168 },
  { obj: 'coffee-cup', t: 'Grab 2 coffees from Gail’s', d: '850 m', left: '25m left', fee: '£6', x: 286, y: 312 },
  { obj: 'hammer', t: 'Build a flatpack wardrobe', d: '1.1 km', left: '20h', fee: '£45', x: 330, y: 132 },
  { obj: 'shopping-cart', t: 'Weekly shop from Tesco', d: '1.3 km', left: '6h', fee: '£10', x: 96, y: 372 },
  { obj: 'macbook', t: 'Set up my new laptop', d: '1.4 km', left: '5h', fee: '£20', x: 214, y: 420 },
  { obj: 'pink-flower', t: 'Pick up flowers for mum', d: '600 m', left: '1h 20m', fee: '£7', x: 54, y: 262 },
]

function InboundCard({ onDecline, onOffer, total = 24 }: { onDecline: () => void; onOffer: () => void; total?: number }) {
  const [secs, setSecs] = useState(total)
  useEffect(() => { const t = setInterval(() => setSecs(s => s - 1), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (secs <= 0) onDecline() }, [secs, onDecline])
  return (
    <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ type: 'spring', duration: 0.55, bounce: 0.18 }}
      style={{ position: 'absolute', left: 12, right: 12, bottom: 'var(--sab)', zIndex: 45, borderRadius: 'var(--r-xl)', boxShadow: 'var(--e-3)' }}>
      <BorderTrace radius={28}><div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="row"><span className="livedot" /><span className="t-micro green">New ask nearby</span><span className="grow" /><span className="badge warning"><Clock size={12} />within 1h</span></div>
      <div className="row" style={{ alignItems: 'flex-end', gap: 12 }}>
        <span className="t-display" style={{ fontSize: 'var(--fs-hero)', lineHeight: 0.95 }}>£15</span>
        <span className="col" style={{ paddingBottom: 6 }}><span className="t-cap muted">you earn</span><span className="row t-cap green" style={{ gap: 4, fontWeight: 'var(--fw-heavy)', fontSize: 'var(--fs-foot)' }}><Lock size={12} />held in escrow</span></span>
        <span className="grow" /><Tile obj="puppy-face" size={56} />
      </div>
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
        <div className="row" style={{ gap: 12 }}><span style={{ width: 14, height: 14, borderRadius: '50%', border: '4px solid var(--brand)', background: 'var(--surface)', margin: '0 2px' }} /><span className="col"><span className="t-callout" style={{ fontWeight: 'var(--fw-bold)' }}>You</span><span className="t-cap muted">now</span></span></div>
        <div style={{ width: 2, height: 14, background: 'var(--line-2)', margin: '0 0 0 8px' }} />
        <div className="row" style={{ gap: 12 }}><MapPin size={18} color="var(--on-brand)" fill="var(--ink)" strokeWidth={2} style={{ flex: 'none' }} aria-hidden /><span className="col"><span className="t-callout" style={{ fontWeight: 'var(--fw-bold)' }}>Ellie’s place</span><span className="t-cap muted">450 m · 6 min walk</span></span></div>
      </div>
      <div className="row"><Avatar who="Ellie" size={32} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 'var(--fw-bold)' }}>Walk Bella for 30 mins</span><span className="t-cap muted" style={{ fontSize: 'var(--fs-foot)' }}>Ellie M. · <StarFill style={{ marginRight: 3 }} />4.9 · 23 asks</span></span></div>
      <div className="row">
        <button className="iconbtn lg" onClick={onDecline} aria-label="Decline"><X size={22} /></button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onOffer} className="grow" style={{ height: 56, borderRadius: 'var(--r-md)', background: 'var(--brand-dark)', color: 'var(--on-brand)', position: 'relative', overflow: 'hidden', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-head)' }}>
          <span style={{ position: 'absolute', inset: 0, background: 'var(--brand)', transformOrigin: 'left', transform: `scaleX(${secs / total})`, transition: 'transform 1s linear' }} />
          <span style={{ position: 'relative' }}>Offer to help <span style={{ opacity: 0.75, fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-callout)' }}>{secs}s</span></span>
        </motion.button>
      </div>
      </div></BorderTrace>
    </motion.div>
  )
}

// Asks finished nearby today: faded pins with a tick, so the map reads as alive, not empty
const DONE = [
  { obj: 'shopping-cart', x: 160, y: 118 }, { obj: 'coffee-cup', x: 240, y: 252 }, { obj: 'package-box', x: 70, y: 470 },
]

// Corner "map getting ready": first visit only, pins drop in stages while the status pill updates, then settles
let mapReady = false
let btsShown = false
const READY = ['finding asks near you…', 'checking what’s urgent…', '12 asks live · 3 new']
const SENT = ['Sent to Ellie', 'Ellie is looking at offers…', 'Comparing 3 offers…']

export function Home(p: { inbound?: boolean; sent?: boolean; accepted?: boolean; bts?: boolean; radius?: boolean }) {
  const { go } = useApp()
  const [phase, setPhase] = useState<'idle' | 'inbound' | 'sent' | 'accepted'>(p.accepted ? 'accepted' : p.sent ? 'sent' : 'idle')
  const [firstLoad] = useState(!mapReady)
  const [ready, setReady] = useState(mapReady ? 2 : 0)
  useEffect(() => { mapReady = true; if (ready >= 2) return; const t = setTimeout(() => setReady(r => r + 1), 900); return () => clearTimeout(t) }, [ready])
  const [radius, setRadius] = useState(1), [radiusSheet, setRadiusSheet] = useState(!!p.radius), [centred, setCentred] = useState(0)
  // BTS: a boosted ask from further away arrives as an in-app pop-up (once per session)
  const [bts, setBts] = useState(false)
  useEffect(() => { if ((btsShown && !p.bts) || p.inbound || p.sent || p.accepted || p.radius) return; const a = setTimeout(() => { btsShown = true; setBts(true) }, p.bts ? 700 : 6500); return () => clearTimeout(a) }, [p.inbound, p.sent, p.accepted, p.bts, p.radius])
  useEffect(() => { if (!bts) return; const t = setTimeout(() => setBts(false), 5000); return () => clearTimeout(t) }, [bts])
  const [sentLine, setSentLine] = useState(0)
  useEffect(() => { if (phase !== 'sent') return; const t = setInterval(() => setSentLine(l => Math.min(l + 1, SENT.length - 1)), 850); return () => clearInterval(t) }, [phase])
  useEffect(() => { if (phase !== 'idle' || !p.inbound) return; const t = setTimeout(() => setPhase('inbound'), 900); return () => clearTimeout(t) }, [phase, p.inbound])
  useEffect(() => { if (phase !== 'sent') return; const t = setTimeout(() => setPhase('accepted'), 2600); return () => clearTimeout(t) }, [phase])
  return (
    <div className="screen">
      <MapCanvas area="harrow">
        <Ring x={200} y={290} d={150 + radius * 90} label={`${radius} km`} />
        <motion.div key={centred} initial={{ scale: 1 }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5 }} style={{ position: 'absolute', left: 0, top: 0 }}><Me x={200} y={290} /></motion.div>
        {DONE.map((d, i) => <Pin key={'done' + i} x={d.x} y={d.y} obj={d.obj} price="" done delay={firstLoad ? 0.2 + i * 0.1 : 0} />)}
        {ASKS.map((a, i) => <Pin key={a.t} x={a.x} y={a.y} obj={a.obj} price={a.fee} boost={i === 1} sel={i === 0 && phase !== 'idle'} delay={firstLoad ? 0.3 + i * 0.22 : 0.05 * i} onClick={() => go('preview')} />)}
      </MapCanvas>
      <div className="fade-top" />
      <StatusBar />
      {/* Large title header, like Apple Maps: place name, radius chip, notifications */}
      <div className="pad row" data-component="MapHeader" style={{ position: 'relative', zIndex: 20, marginTop: 2, gap: 8 }}>
        <h1 className="t-title1">Harrow</h1>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setRadiusSheet(true)} aria-label={`Radius ${radius} km, change`} className="row map-pill" style={{ gap: 4 }}><Ticker value={`${radius}\u00a0km`} /><ChevronDown size={14} /></motion.button>
        <span className="grow" />
        <motion.button whileTap={{ scale: 0.9 }} className="iconbtn glass" style={{ position: 'relative' }} onClick={() => go('push', undefined, 'fade')} aria-label="Notifications, 2 new"><Bell size={20} /><span style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '2px solid var(--surface)' }} /></motion.button>
      </div>
      <div className="pad" style={{ position: 'relative', zIndex: 20, marginTop: 8 }}><motion.span layout transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }} className="row t-cap" style={{ display: 'inline-flex', height: 32, padding: '0 12px', borderRadius: 'var(--r-full)', background: ready < 2 ? 'var(--ink)' : 'var(--overlay-bg)', color: ready < 2 ? 'var(--on-brand)' : 'var(--ink)', backdropFilter: 'var(--overlay-blur)', boxShadow: 'var(--e-2)', gap: 8, transition: 'background-color 300ms, color 300ms' }}>
          {ready < 2 ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--dark-fill-2)', borderTopColor: 'var(--on-brand)' }} /> : <span className="livedot" />}
          <AnimatePresence mode="popLayout" initial={false}><motion.span key={ready} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.22 }}>{READY[ready]}</motion.span></AnimatePresence>
        </motion.span></div>
      {/* Map controls, right edge: list view and recentre */}
      <div className="col map-controls" data-component="MapControls">
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => go('list', undefined, 'up')} aria-label="Show asks as a list" className="iconbtn glass"><List size={20} /></motion.button>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setCentred(c => c + 1)} aria-label="Centre on me" className="iconbtn glass" style={{ color: 'var(--brand)' }}><Locate size={20} /></motion.button>
      </div>
      <TabBar active="explore" />
      <HomeBar />
      <AnimatePresence>{phase === 'inbound' && <>
        <motion.div key="dim" className="scrim" style={{ zIndex: 44 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <InboundCard key="card" onDecline={() => setPhase('idle')} onOffer={() => setPhase('sent')} />
      </>}</AnimatePresence>
      <AnimatePresence>{bts && <motion.div key="bts-dim" className="scrim" style={{ zIndex: 59 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBts(false)} />}</AnimatePresence>
      <AnimatePresence>{bts && (
        <motion.button key="bts" onClick={() => go('preview')} initial={{ y: -90, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -60, opacity: 0 }} transition={{ type: 'spring', duration: 0.55, bounce: 0.35 }}
          className="row" style={{ position: 'absolute', top: 'calc(var(--sat) + 4px)', left: 12, right: 12, zIndex: 60, padding: 10, paddingRight: 14, borderRadius: 'var(--r-lg)', background: 'var(--overlay-bg)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', color: 'var(--ink)', textAlign: 'left', boxShadow: 'var(--e-3), inset 0 0 0 1px var(--overlay-edge)' }}>
          <span className="tile" style={{ width: 44, height: 44, background: 'var(--surface)' }}><img src="/icons/home.png" alt="" /></span>
          <span className="col grow"><span className="row t-micro" style={{ color: 'var(--ink-3)', gap: 4 }}><Zap size={11} color="var(--brand)" fill="var(--brand)" />Boosted · 4.8 km away</span><span className="t-callout" style={{ fontWeight: 'var(--fw-bold)' }}>Help carry a sofa · £25</span></span>
          <ChevronRight size={18} color="var(--ink-3)" />
        </motion.button>
      )}</AnimatePresence>
      <Sheet open={radiusSheet} onClose={() => setRadiusSheet(false)}>
        <span className="t-title2">Show asks within</span>
        <div className="row" style={{ gap: 8, margin: '16px 0 10px' }}>{[1, 2, 3, 5].map(r => <motion.button key={r} whileTap={{ scale: 0.92 }} onClick={() => setRadius(r)} className="chip" style={{ position: 'relative', background: 'var(--surface)', color: radius === r ? 'var(--on-brand)' : 'var(--ink)', boxShadow: radius === r ? 'none' : 'inset 0 0 0 1px var(--line-2)' }}>{radius === r && <motion.span layoutId="radius-pill" transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }} style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-sm)', background: 'var(--brand)' }} />}<span style={{ position: 'relative' }}>{r} km</span></motion.button>)}</div>
        <p className="row t-cap muted" style={{ gap: 6, marginBottom: 14 }}><Zap size={13} />Boosted asks reach you from up to 5 km.</p>
        <Btn onClick={() => setRadiusSheet(false)}>Done</Btn>
      </Sheet>
      <Sheet open={phase === 'sent'} z={46}>
        <div className="row" style={{ gap: 12 }}><Hop state="happy" size={72} bob /><span className="col grow" style={{ gap: 4 }}><span className="t-title2">Offer sent</span><span className="t-cap muted" style={{ fontSize: 'var(--fs-sub)', fontWeight: 'var(--fw-medium)' }}>Ellie usually picks within 5 min.</span></span></div>
        <div className="row" style={{ margin: '14px 0', gap: 10, height: 22 }}>
          <span className="indeterminate" style={{ width: 64, flex: 'none' }}><i /></span>
          <AnimatePresence mode="popLayout" initial={false}><motion.span key={sentLine} className="t-cap ink2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.25, ease: EASE_OUT }}>{SENT[sentLine]}</motion.span></AnimatePresence>
        </div>
        <div className="card row" style={{ padding: 8, paddingRight: 14 }}><Tile obj="puppy-face" size={36} /><span className="t-cap grow" style={{ fontSize: 'var(--fs-sub)' }}>Walk Bella · 450 m</span><span className="t-head" style={{ fontSize: 'var(--fs-body)' }}>£15</span></div>
        <div className="col" style={{ gap: 4, marginTop: 14 }}><Btn kind="secondary" onClick={() => setPhase('idle')}>Keep browsing</Btn><Btn kind="ghost" onClick={() => setPhase('idle')}>Withdraw offer</Btn></div>
      </Sheet>
      <Modal open={phase === 'accepted'}>
        <Hop state="happy" size={120} bob />
        <span className="row t-cap green" style={{ gap: 6, fontWeight: 'var(--fw-heavy)' }}><DrawCheck size={20} color="var(--brand)" delay={0.3} />Accepted</span>
        <div className="col" style={{ gap: 6 }}><span className="t-title2">Your offer was accepted</span><span className="t-callout muted" style={{ fontWeight: 'var(--fw-medium)' }}>£15 is held safely until you’re done.</span></div>
        <div className="row" style={{ width: '100%', padding: 10, borderRadius: 'var(--r-md)', background: 'var(--surface-2)' }}><Avatar who="Ellie" size={32} /><span className="t-cap grow" style={{ textAlign: 'left', fontSize: 'var(--fs-sub)' }}>Walk Bella · Ellie M.</span><span className="badge warning"><Hourglass size={11} />1h</span></div>
        <div className="col" style={{ gap: 8, width: '100%' }}><Btn icon={<ChatIcon size={18} />} onClick={() => go('chat', { role: 'helper' })}>Open chat</Btn><Btn kind="secondary" icon={<Share size={18} />} onClick={() => go('share')}>Share</Btn></div>
      </Modal>
    </div>
  )
}

export function AskPreview() {
  const { go } = useApp()
  const [tip, setTip] = useState<string | null>(null)
  useEffect(() => { if (!tip) return; const t = setTimeout(() => setTip(null), 2200); return () => clearTimeout(t) }, [tip])
  return (
    <div className="screen">
      <MapCanvas area="harrow">
        <Pin x={170} y={190} obj="puppy-face" price="£15" sel />
        <Me x={230} y={300} />
      </MapCanvas>
      <div className="fade-top" />
      <StatusBar />
      <div className="pad row" style={{ position: 'relative', zIndex: 20, justifyContent: 'space-between' }}>
        <button className="iconbtn glass" aria-label="Back" onClick={() => go('home', undefined, 'back')}><Back size={20} /></button>
        <button className="iconbtn glass" aria-label="Share this ask" onClick={() => go('share')}><Share size={18} /></button>
      </div>
      {/* Ask detail sheet: icon + price + place + time left, the ask, who's asking, one action */}
      <motion.div data-component="AskDetailSheet" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30, background: 'var(--surface)', borderRadius: 'var(--r-sheet) var(--r-sheet) 0 0', padding: '8px 20px calc(var(--sab) + 8px)', boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="handle" style={{ margin: '0 auto 2px' }} />
        <div className="row" style={{ gap: 14 }}>
          <Tile obj="puppy-face" size={64} />
          <span className="col grow" style={{ gap: 4 }}>
            <span className="t-title1" style={{ lineHeight: 1 }}>£15</span>
            <span className="row t-cap muted" style={{ gap: 4 }}><MapPin size={13} color="var(--brand)" />Harrow · 450 m</span>
          </span>
          <CountdownRing secs={9} total={24} size={52} urgent unit="h" />
        </div>
        <p className="t-body" style={{ fontSize: 'var(--fs-head)', fontWeight: 'var(--fw-semibold)', lineHeight: 1.35 }}>Walk my dog for 30 mins this afternoon. She’s friendly and great on the lead.</p>
        <div className="row t-cap" style={{ gap: 6, color: 'var(--brand)' }}><Lock size={13} />£15 is held by askapade until you’re done</div>
        <button className="row" onClick={() => setTip('Ellie has been verified with photo ID')} style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '12px 0', textAlign: 'left' }}>
          <Avatar who="Ellie" size={44} tick />
          <span className="col grow" style={{ gap: 2 }}><span className="t-callout" style={{ fontWeight: 'var(--fw-bold)' }}>Ellie M.</span><span className="t-cap muted"><StarFill style={{ marginRight: 3 }} />4.9 · 23 askapades</span></span>
          <ChevronRight size={18} color="var(--ink-3)" />
        </button>
        <button className="row t-cap" onClick={() => go('share')} style={{ color: 'var(--ink-2)', justifyContent: 'space-between' }}>Know someone closer? Earn £1.50 <Go size={14} color="var(--ink-3)" /></button>
        <SwipeConfirm label="Slide to offer · £15" doneLabel="Offer sent" busyLabel="Sending offer…" onDone={() => go('home', { sent: true }, 'fade')} />
      </motion.div>
      <Toast text={tip} show={!!tip} top />
      <HomeBar />
    </div>
  )
}
