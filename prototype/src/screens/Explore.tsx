import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronDown, Bell, Locate, X, Lock, Clock, ArrowLeft, Share, MessageCircle, ArrowRight, Hourglass, Zap } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Pin, Me, Ring, MapCanvas, TabBar, Tile, Avatar, Sheet, Modal, BorderTrace, SwipeConfirm, DrawCheck, Tactile, Ticker, EASE_OUT } from '../ui'

const ASKS = [
  { obj: 'puppy-face', t: 'Walk my dog for 30 mins', d: '450 m', left: '42m left', fee: '£15', x: 128, y: 220 },
  { obj: 'package-box', t: 'Collect a parcel', d: '700 m', left: '3h 10m', fee: '£8', x: 262, y: 168 },
  { obj: 'coffee-cup', t: 'Grab 2 coffees from Gail’s', d: '850 m', left: '25m left', fee: '£6', x: 286, y: 312 },
  { obj: 'hammer', t: 'Build a flatpack wardrobe', d: '1.1 km', left: '20h', fee: '£45', x: 330, y: 132 },
  { obj: 'shopping-cart', t: 'Weekly shop from Tesco', d: '1.3 km', left: '6h', fee: '£10', x: 96, y: 372 },
]

function InboundCard({ onDecline, onOffer, total = 24 }: { onDecline: () => void; onOffer: () => void; total?: number }) {
  const [secs, setSecs] = useState(total)
  useEffect(() => { const t = setInterval(() => setSecs(s => s - 1), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (secs <= 0) onDecline() }, [secs, onDecline])
  return (
    <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ type: 'spring', duration: 0.55, bounce: 0.18 }}
      style={{ position: 'absolute', left: 12, right: 12, bottom: 'var(--sab)', zIndex: 45, borderRadius: 28, boxShadow: 'var(--e-3)' }}>
      <BorderTrace radius={28}><div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="row"><span className="livedot" /><span className="t-micro green">New ask nearby</span><span className="grow" /><span className="badge warning"><Clock size={12} />within 1h</span></div>
      <div className="row" style={{ alignItems: 'flex-end', gap: 12 }}>
        <span className="t-display" style={{ fontSize: 56, lineHeight: 0.95 }}>£15</span>
        <span className="col" style={{ paddingBottom: 6 }}><span className="t-cap muted">you earn</span><span className="row t-cap green" style={{ gap: 4, fontWeight: 800, fontSize: 12 }}><Lock size={12} />held in escrow</span></span>
        <span className="grow" /><Tile obj="puppy-face" size={56} />
      </div>
      <div style={{ background: 'var(--surface-2)', borderRadius: 16, padding: '12px 14px' }}>
        <div className="row" style={{ gap: 12 }}><span style={{ width: 14, height: 14, borderRadius: 7, border: '4px solid var(--brand)', background: '#fff', margin: '0 2px' }} /><span className="col"><span className="t-callout" style={{ fontWeight: 700 }}>You</span><span className="t-cap muted">now</span></span></div>
        <div style={{ width: 2, height: 14, background: 'var(--line-2)', margin: '0 0 0 8px' }} />
        <div className="row" style={{ gap: 12 }}><span style={{ width: 12, height: 12, background: 'var(--ink)', margin: '0 3px' }} /><span className="col"><span className="t-callout" style={{ fontWeight: 700 }}>Ellie’s place</span><span className="t-cap muted">450 m · 6 min walk</span></span></div>
      </div>
      <div className="row"><Avatar who="Ellie" size={32} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>Walk Bella for 30 mins</span><span className="t-cap muted" style={{ fontSize: 12 }}>Ellie M. · ★ 4.9 · 23 asks</span></span></div>
      <div className="row">
        <button className="iconbtn lg" onClick={onDecline} aria-label="Decline"><X size={22} /></button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onOffer} className="grow" style={{ height: 56, borderRadius: 14, background: 'var(--brand-900)', color: '#fff', position: 'relative', overflow: 'hidden', fontWeight: 700, fontSize: 17 }}>
          <span style={{ position: 'absolute', inset: 0, background: 'var(--brand)', transformOrigin: 'left', transform: `scaleX(${secs / total})`, transition: 'transform 1s linear' }} />
          <span style={{ position: 'relative' }}>Offer to help <span style={{ opacity: 0.75, fontWeight: 600, fontSize: 15 }}>{secs}s</span></span>
        </motion.button>
      </div>
      </div></BorderTrace>
    </motion.div>
  )
}

// Nearby sheet: ~43% of the screen, never smaller than its content or taller than the design
const SHEET_H = 'clamp(330px, 44%, 372px)'

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
  const [tab, setTab] = useState('Ending soon')
  return (
    <div className="screen">
      <MapCanvas area="harrow">
        <div className="fade-top" />
        <Ring x={200} y={290} d={150 + radius * 90} label={`${radius} km`} />
        <motion.div key={centred} initial={{ scale: 1 }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5 }} style={{ position: 'absolute', left: 0, top: 0 }}><Me x={200} y={290} /></motion.div>
        {ASKS.map((a, i) => <Pin key={a.t} x={a.x} y={a.y} obj={a.obj} price={a.fee} boost={i === 1} sel={i === 0 && phase !== 'idle'} delay={firstLoad ? 0.3 + i * 0.22 : 0.05 * i} onClick={() => go('preview')} />)}
      </MapCanvas>
      <StatusBar />
      <div className="pad row" style={{ position: 'relative', zIndex: 20, justifyContent: 'space-between', marginTop: 4 }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setRadiusSheet(true)} className="row" style={{ height: 40, padding: '0 14px', borderRadius: 20, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', fontWeight: 700, gap: 6 }}>Harrow · <Ticker value={`${radius} km`} /> <ChevronDown size={16} /></motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="iconbtn glass" style={{ width: 40, height: 40, position: 'relative' }} onClick={() => go('push', undefined, 'fade')} aria-label="Notifications"><Bell size={18} /><span style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, background: 'var(--danger)', border: '2px solid #fff' }} /></motion.button>
      </div>
      <div className="pad" style={{ position: 'relative', zIndex: 20, marginTop: 10 }}><motion.span layout transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }} className="row t-cap" style={{ display: 'inline-flex', height: 32, padding: '0 12px', borderRadius: 16, background: ready < 2 ? 'var(--ink)' : 'var(--glass-bg)', color: ready < 2 ? '#fff' : 'var(--ink)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', gap: 8, transition: 'background-color 300ms, color 300ms' }}>
          {ready < 2 ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} style={{ width: 12, height: 12, borderRadius: 6, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--lime)' }} /> : <span className="livedot" />}
          <AnimatePresence mode="popLayout" initial={false}><motion.span key={ready} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.22 }}>{READY[ready]}</motion.span></AnimatePresence>
        </motion.span></div>
      <motion.button whileTap={{ scale: 0.88 }} onClick={() => setCentred(c => c + 1)} aria-label="Centre on me" className="iconbtn glass" style={{ position: 'absolute', right: 16, bottom: `calc(${SHEET_H} + 12px)`, zIndex: 20 }}><Locate size={20} /></motion.button>
      <div className="fade-sheet" style={{ bottom: `calc(${SHEET_H} - 24px)` }} />
      {/* Recollect: drag the sheet up and it grows into the full list */}
      <motion.div className="sheet" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.3, bottom: 0.05 }} onDragEnd={(_, i) => { if (i.offset.y < -50 || i.velocity.y < -500) go('list', undefined, 'fade') }}
        style={{ height: SHEET_H, zIndex: 25, padding: '8px 0 0', overflow: 'hidden' }}>
        <div className="handle" />
        <div className="pad row" style={{ justifyContent: 'space-between' }}><span className="t-title2">Nearby</span><button className="row t-cap green" style={{ gap: 2 }} onClick={() => go('list', undefined, 'fade')}>See all 12 <ChevronRight size={14} /></button></div>
        <div className="pad" style={{ margin: '12px 0' }}><Tactile id="home" options={['Ending soon', 'Top fee', 'Closest']} value={tab} onChange={setTab} grow={false} /></div>
        <div className="row scroll" style={{ gap: 10, padding: '0 20px', overflowX: 'auto', overflowY: 'hidden', flex: 'none' }}>
          {ASKS.map((a, i) => (
            <motion.button key={a.t} className="card row" onClick={() => go('preview')} whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.04 * i }}
              style={{ width: 290, flex: 'none', padding: 12, textAlign: 'left', alignItems: 'flex-start' }}>
              <Tile obj={a.obj} size={52} />
              <span className="col grow" style={{ gap: 6 }}><span className="t-callout" style={{ fontWeight: 700 }}>{a.t}</span><span className="row t-cap muted" style={{ gap: 6 }}>{a.d}<span className="badge warning" style={{ height: 22 }}><Hourglass size={11} />{a.left}</span></span></span>
              <span className="t-head">{a.fee}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
      <TabBar active="explore" />
      <HomeBar />
      <AnimatePresence>{phase === 'inbound' && <>
        <motion.div key="dim" className="scrim" style={{ zIndex: 44, background: 'rgba(6,26,9,0.18)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <InboundCard key="card" onDecline={() => setPhase('idle')} onOffer={() => setPhase('sent')} />
      </>}</AnimatePresence>
      <AnimatePresence>{bts && (
        <motion.button key="bts" onClick={() => go('preview')} initial={{ y: -90, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -60, opacity: 0 }} transition={{ type: 'spring', duration: 0.55, bounce: 0.35 }}
          className="row" style={{ position: 'absolute', top: 'calc(var(--sat) + 4px)', left: 12, right: 12, zIndex: 60, padding: 10, paddingRight: 14, borderRadius: 20, background: 'var(--ink)', color: '#fff', textAlign: 'left', boxShadow: 'var(--e-3)' }}>
          <span className="tile" style={{ width: 44, height: 44, background: 'var(--lime)' }}><img src="/icons/mystery-box.png" alt="" /></span>
          <span className="col grow"><span className="row t-micro" style={{ color: 'var(--lime)', gap: 4 }}><Zap size={11} />Boosted · 4.8 km away</span><span className="t-callout" style={{ fontWeight: 700 }}>Help carry a sofa · £25</span></span>
          <ChevronRight size={18} style={{ opacity: 0.6 }} />
        </motion.button>
      )}</AnimatePresence>
      <Sheet open={radiusSheet} onClose={() => setRadiusSheet(false)}>
        <span className="t-title2">Show asks within</span>
        <div className="row" style={{ gap: 8, margin: '16px 0 10px' }}>{[1, 2, 3, 5].map(r => <motion.button key={r} whileTap={{ scale: 0.92 }} onClick={() => setRadius(r)} className="chip" style={{ position: 'relative', background: '#fff', color: radius === r ? '#fff' : 'var(--ink)', boxShadow: radius === r ? 'none' : 'inset 0 0 0 1px var(--line-2)' }}>{radius === r && <motion.span layoutId="radius-pill" transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }} style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'var(--brand)' }} />}<span style={{ position: 'relative' }}>{r} km</span></motion.button>)}</div>
        <p className="row t-cap muted" style={{ gap: 6, marginBottom: 14 }}><Zap size={13} />Boosted asks reach you from up to 5 km.</p>
        <Btn onClick={() => setRadiusSheet(false)}>Done</Btn>
      </Sheet>
      <Sheet open={phase === 'sent'} scrim={false} z={46}>
        <div className="row" style={{ gap: 12 }}><Hop state="happy" size={72} bob /><span className="col grow" style={{ gap: 4 }}><span className="t-title2">Offer sent</span><span className="t-cap muted" style={{ fontSize: 14, fontWeight: 500 }}>Ellie usually picks within 5 min.</span></span></div>
        <div className="row" style={{ margin: '14px 0', gap: 10, height: 22 }}>
          <span className="indeterminate" style={{ width: 64, flex: 'none' }}><i /></span>
          <AnimatePresence mode="popLayout" initial={false}><motion.span key={sentLine} className="t-cap ink2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.25, ease: EASE_OUT }}>{SENT[sentLine]}</motion.span></AnimatePresence>
        </div>
        <div className="card row" style={{ padding: 8, paddingRight: 14 }}><Tile obj="puppy-face" size={36} /><span className="t-cap grow" style={{ fontSize: 14 }}>Walk Bella · 450 m</span><span className="t-head" style={{ fontSize: 16 }}>£15</span></div>
        <div className="col" style={{ gap: 4, marginTop: 14 }}><Btn kind="secondary" onClick={() => setPhase('idle')}>Keep browsing</Btn><Btn kind="ghost" onClick={() => setPhase('idle')}>Withdraw offer</Btn></div>
      </Sheet>
      <Modal open={phase === 'accepted'}>
        <Hop state="happy" size={120} bob />
        <span className="row t-cap green" style={{ gap: 6, fontWeight: 800 }}><DrawCheck size={20} color="var(--brand)" delay={0.3} />Accepted</span>
        <div className="col" style={{ gap: 6 }}><span className="t-title2">Your offer was accepted</span><span className="t-callout muted" style={{ fontWeight: 500 }}>£15 is held safely until you’re done.</span></div>
        <div className="row" style={{ width: '100%', padding: 10, borderRadius: 14, background: 'var(--surface-2)' }}><Avatar who="Ellie" size={32} /><span className="t-cap grow" style={{ textAlign: 'left', fontSize: 14 }}>Walk Bella · Ellie M.</span><span className="badge warning"><Hourglass size={11} />1h</span></div>
        <div className="col" style={{ gap: 8, width: '100%' }}><Btn icon={<MessageCircle size={18} />} onClick={() => go('chat', { role: 'helper' })}>Open chat</Btn><Btn kind="secondary" icon={<Share size={18} />} onClick={() => go('share')}>Share</Btn></div>
      </Modal>
    </div>
  )
}

export function AskPreview() {
  const { go } = useApp()
  return (
    <div className="screen">
      <MapCanvas area="harrow">
        <div className="fade-top" />
        <Pin x={150} y={170} obj="puppy-face" price="£15" sel />
        <Me x={210} y={250} />
      </MapCanvas>
      <StatusBar />
      <div className="pad row" style={{ position: 'relative', zIndex: 20, justifyContent: 'space-between' }}>
        <button className="iconbtn glass" onClick={() => go('home', undefined, 'back')}><ArrowLeft size={20} /></button>
        <button className="iconbtn glass" onClick={() => go('share')}><Share size={18} /></button>
      </div>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }}
        style={{ position: 'absolute', left: 12, right: 12, bottom: 'var(--sab)', zIndex: 30, background: '#fff', borderRadius: 28, padding: 18, boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="row" style={{ alignItems: 'flex-start' }}><Tile obj="puppy-face" size={64} /><span className="grow" /><span className="col" style={{ alignItems: 'flex-end', gap: 4 }}><span className="t-cap muted">You earn</span><span className="t-display" style={{ fontSize: 40 }}>£15</span><span className="badge success"><Zap size={11} />Held in escrow</span></span></div>
        <span className="t-head" style={{ fontSize: 20 }}>Walk Bella for 30 mins. She’s friendly and great on the lead.</span>
        <div className="row" style={{ background: 'var(--urgent-50)', borderRadius: 12, padding: '10px 12px', justifyContent: 'space-between' }}><span className="row t-cap" style={{ color: '#b36b00', gap: 6 }}><Hourglass size={14} />Ends in 0:42:18</span><span className="t-cap muted">450 m · 6 min walk</span></div>
        <div className="row"><Avatar who="Ellie" size={40} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>Ellie M.</span><span className="t-cap muted">★ 4.9 · 23 asks · Verified</span></span><button className="iconbtn"><MessageCircle size={18} /></button></div>
        <button className="row t-cap" onClick={() => go('share')} style={{ background: 'var(--lime-50)', color: 'var(--brand)', borderRadius: 12, padding: '10px 12px', justifyContent: 'space-between' }}>Know someone closer? Earn £1.50 <ArrowRight size={14} /></button>
        <SwipeConfirm label="Slide to offer · £15" doneLabel="Offer sent" onDone={() => go('home', { sent: true }, 'fade')} />
      </motion.div>
      <HomeBar />
    </div>
  )
}
