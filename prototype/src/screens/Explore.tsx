import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react'
import { ChevronDown, Bell, Locate, X, Lock, Clock, ArrowLeft, Share, MessageCircle, ArrowRight, Hourglass, Check, Zap } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Pin, Me, Ring, MapBg, TabBar, Tile, Avatar, Sheet, Modal, spring, EASE_OUT } from '../ui'

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
      style={{ position: 'absolute', left: 12, right: 12, bottom: 34, zIndex: 45, background: '#fff', borderRadius: 28, padding: 18, boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
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
    </motion.div>
  )
}

export function Home(p: { inbound?: boolean; sent?: boolean }) {
  const { go } = useApp()
  const [phase, setPhase] = useState<'idle' | 'inbound' | 'sent' | 'accepted'>(p.sent ? 'sent' : 'idle')
  useEffect(() => { if (phase !== 'idle') return; const t = setTimeout(() => setPhase('inbound'), p.inbound ? 900 : 5000); return () => clearTimeout(t) }, [phase, p.inbound])
  useEffect(() => { if (phase !== 'sent') return; const t = setTimeout(() => setPhase('accepted'), 2600); return () => clearTimeout(t) }, [phase])
  const [tab, setTab] = useState(0)
  return (
    <div className="screen">
      <MapBg area="harrow" />
      <div className="fade-top" />
      <Ring x={200} y={290} d={240} label="1 km" />
      <Me x={200} y={290} />
      {ASKS.map((a, i) => <Pin key={a.t} x={a.x} y={a.y} obj={a.obj} price={a.fee} boost={i === 1} sel={i === 0 && phase !== 'idle'} delay={0.05 * i} onClick={() => go('preview')} />)}
      <StatusBar />
      <div className="pad row" style={{ position: 'relative', zIndex: 20, justifyContent: 'space-between', marginTop: 4 }}>
        <button className="row" style={{ height: 40, padding: '0 14px', borderRadius: 20, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', fontWeight: 700, gap: 6 }}>Harrow · 1 km <ChevronDown size={16} /></button>
        <button className="iconbtn glass" style={{ width: 40, height: 40 }}><Bell size={18} /></button>
      </div>
      <div className="pad" style={{ position: 'relative', zIndex: 20, marginTop: 10 }}><span className="row t-cap" style={{ display: 'inline-flex', height: 32, padding: '0 12px', borderRadius: 16, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', gap: 8 }}><span className="livedot" />12 asks live · 3 new</span></div>
      <button className="iconbtn glass" style={{ position: 'absolute', right: 16, top: 410, zIndex: 20 }}><Locate size={20} /></button>
      <div className="fade-sheet" style={{ top: 370 }} />
      <div className="sheet" style={{ height: 364, zIndex: 25, padding: '8px 0 0' }}>
        <div className="handle" />
        <div className="pad row" style={{ justifyContent: 'space-between' }}><span className="t-title2">Nearby</span><span className="badge success">12 live</span></div>
        <div className="pad row" style={{ gap: 8, margin: '12px 0' }}>{['Ending soon', 'Top fee', 'Closest'].map((c, i) => <button key={c} className={'chip' + (tab === i ? ' on' : '')} style={{ flex: 'none' }} onClick={() => setTab(i)}>{c}</button>)}</div>
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
      </div>
      <TabBar active="explore" />
      <HomeBar />
      <AnimatePresence>{phase === 'inbound' && <>
        <motion.div key="dim" className="scrim" style={{ zIndex: 44, background: 'rgba(6,26,9,0.18)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <InboundCard key="card" onDecline={() => setPhase('idle')} onOffer={() => setPhase('sent')} />
      </>}</AnimatePresence>
      <Sheet open={phase === 'sent'} scrim={false} z={46}>
        <div className="row" style={{ gap: 12 }}><Hop state="happy" size={72} bob /><span className="col grow" style={{ gap: 4 }}><span className="t-title2">Offer sent</span><span className="t-cap muted" style={{ fontSize: 14, fontWeight: 500 }}>Ellie usually picks within 5 min.</span></span></div>
        <div className="indeterminate" style={{ margin: '16px 0' }}><i /></div>
        <div className="card row" style={{ padding: 8, paddingRight: 14 }}><Tile obj="puppy-face" size={36} /><span className="t-cap grow" style={{ fontSize: 14 }}>Walk Bella · 450 m</span><span className="t-head" style={{ fontSize: 16 }}>£15</span></div>
        <div className="col" style={{ gap: 4, marginTop: 14 }}><Btn kind="secondary" onClick={() => setPhase('idle')}>Keep browsing</Btn><Btn kind="ghost" onClick={() => setPhase('idle')}>Withdraw offer</Btn></div>
      </Sheet>
      <Modal open={phase === 'accepted'}>
        <Hop state="happy" size={120} bob />
        <div className="col" style={{ gap: 6 }}><span className="t-title2">Your offer was accepted</span><span className="t-callout muted" style={{ fontWeight: 500 }}>£15 is held safely until you’re done.</span></div>
        <div className="row" style={{ width: '100%', padding: 10, borderRadius: 14, background: 'var(--surface-2)' }}><Avatar who="Ellie" size={32} /><span className="t-cap grow" style={{ textAlign: 'left', fontSize: 14 }}>Walk Bella · Ellie M.</span><span className="badge warning"><Hourglass size={11} />1h</span></div>
        <div className="col" style={{ gap: 8, width: '100%' }}><Btn icon={<MessageCircle size={18} />} onClick={() => go('chat', { role: 'helper' })}>Open chat</Btn><Btn kind="secondary" icon={<Share size={18} />} onClick={() => setPhase('idle')}>Share</Btn></div>
      </Modal>
    </div>
  )
}

function SlideToOffer({ label, onDone }: { label: string; onDone: () => void }) {
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [done, setDone] = useState(false)
  const max = () => (track.current?.offsetWidth ?? 350) - 56 - 8
  const textOpacity = useTransform(x, [0, 160], [1, 0])
  return (
    <div ref={track} style={{ position: 'relative', height: 64, borderRadius: 18, background: 'var(--ink)', padding: 4, overflow: 'hidden' }}>
      <motion.span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 16, opacity: textOpacity }}>{label}</motion.span>
      <motion.div drag={done ? false : 'x'} dragConstraints={track} dragElastic={0} dragMomentum={false} style={{ x, width: 56, height: 56, borderRadius: 14, background: 'var(--lime)', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1, touchAction: 'none' }}
        onDragEnd={() => { if (x.get() > max() * 0.82) { animate(x, max(), { duration: 0.18, ease: EASE_OUT }); setDone(true); setTimeout(onDone, 380) } else animate(x, 0, spring) }}>
        {done ? <Check size={24} strokeWidth={3} /> : <ArrowRight size={24} />}
      </motion.div>
    </div>
  )
}

export function AskPreview() {
  const { go } = useApp()
  return (
    <div className="screen">
      <MapBg area="harrow" />
      <div className="fade-top" />
      <Pin x={80} y={140} obj="puppy-face" price="£15" sel />
      <Me x={95} y={330} />
      <StatusBar />
      <div className="pad row" style={{ position: 'relative', zIndex: 20, justifyContent: 'space-between' }}>
        <button className="iconbtn glass" onClick={() => go('home', undefined, 'back')}><ArrowLeft size={20} /></button>
        <button className="iconbtn glass"><Share size={18} /></button>
      </div>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }}
        style={{ position: 'absolute', left: 12, right: 12, bottom: 34, zIndex: 30, background: '#fff', borderRadius: 28, padding: 18, boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="row" style={{ alignItems: 'flex-start' }}><Tile obj="puppy-face" size={64} /><span className="grow" /><span className="col" style={{ alignItems: 'flex-end', gap: 4 }}><span className="t-cap muted">You earn</span><span className="t-display" style={{ fontSize: 40 }}>£15</span><span className="badge success"><Zap size={11} />Held in escrow</span></span></div>
        <span className="t-head" style={{ fontSize: 20 }}>Walk Bella for 30 mins. She’s friendly and great on the lead.</span>
        <div className="row" style={{ background: 'var(--urgent-50)', borderRadius: 12, padding: '10px 12px', justifyContent: 'space-between' }}><span className="row t-cap" style={{ color: '#b36b00', gap: 6 }}><Hourglass size={14} />Ends in 0:42:18</span><span className="t-cap muted">450 m · 6 min walk</span></div>
        <div className="row"><Avatar who="Ellie" size={40} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>Ellie M.</span><span className="t-cap muted">★ 4.9 · 23 asks · Verified</span></span><button className="iconbtn"><MessageCircle size={18} /></button></div>
        <button className="row t-cap" style={{ background: 'var(--lime-50)', color: 'var(--brand)', borderRadius: 12, padding: '10px 12px', justifyContent: 'space-between' }}>Know someone closer? Earn £1.50 <ArrowRight size={14} /></button>
        <SlideToOffer label="Slide to offer · £15" onDone={() => go('home', { sent: true }, 'fade')} />
      </motion.div>
      <HomeBar />
    </div>
  )
}
