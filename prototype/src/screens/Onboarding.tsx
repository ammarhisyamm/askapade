import { useEffect, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'motion/react'
import { MapPin, Bell, Users, Navigation } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Frog, Btn, EASE_OUT, useScaleTo } from '../ui'

// Crewly-style launch: the logo pops and hops on the green field, the field collapses into one dot,
// and that dot becomes the full stop of the wordmark while the letters type in beside it
type SplashPhase = 'hop' | 'squash' | 'collapse' | 'dot' | 'word' | 'out'
const WORD = 'askapade'
export function Splash() {
  const { go } = useApp()
  const [ph, setPh] = useState<SplashPhase>('hop')
  const [n, setN] = useState(0)
  useEffect(() => {
    const steps: [SplashPhase, number][] = [['squash', 900], ['collapse', 1650], ['dot', 2100], ['word', 2350], ['out', 3400]]
    const ts = steps.map(([p, t]) => setTimeout(() => setPh(p), t))
    // hand off while the wordmark is still fading so there is never an empty frame
    ts.push(setTimeout(() => go('intro', undefined, 'fade'), 3450))
    return () => ts.forEach(clearTimeout)
  }, [go])
  useEffect(() => {
    if (ph !== 'word') return
    const t = setInterval(() => setN(k => (k >= WORD.length ? k : k + 1)), 55)
    return () => clearInterval(t)
  }, [ph])
  const field = ph === 'hop' || ph === 'squash' ? 'circle(1000px at 50% 50%)' : ph === 'collapse' ? 'circle(44px at 50% 50%)' : 'circle(8px at 50% 50%)'
  const wordOn = ph === 'word' || ph === 'out'
  return (
    <div className="screen" style={{ background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }} onClick={() => go('intro', undefined, 'fade')}>
      <motion.div animate={{ clipPath: field, opacity: wordOn ? 0 : 1 }}
        transition={{ clipPath: { duration: ph === 'dot' ? 0.25 : 0.5, ease: [0.77, 0, 0.175, 1] }, opacity: { duration: 0 } }}
        style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'var(--brand)' }} />
      <AnimatePresence>{(ph === 'hop' || ph === 'squash') && (
        <motion.div key="hop" style={{ position: 'relative', zIndex: 2, transformOrigin: '50% 100%' }}
          initial={{ scale: 0, rotate: -12 }} animate={ph === 'hop' ? { scale: 1, rotate: 0 } : { scaleY: [1, 0.78, 1.12, 0.96, 1], scaleX: [1, 1.18, 0.92, 1.03, 1], y: [0, 8, -34, 0, 0] }}
          exit={{ scale: 0.2, opacity: 0, transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] } }}
          transition={ph === 'hop' ? { type: 'spring', duration: 0.6, bounce: 0.5, delay: 0.15 } : { duration: 0.7, times: [0, 0.2, 0.55, 0.85, 1], ease: 'easeOut' }}>
          <img src="/ears.svg" alt="askapade" width={104} height={104} draggable={false} style={{ display: 'block', filter: 'brightness(0) invert(1)' }} />
        </motion.div>
      )}</AnimatePresence>
      {wordOn && (
        <motion.div className="row" style={{ position: 'relative', zIndex: 2, gap: 0, alignItems: 'baseline' }}
          animate={ph === 'out' ? { opacity: 0, y: -10, filter: 'blur(4px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.28, ease: EASE_OUT }}>
          {WORD.slice(0, n).split('').map((c, k) => (
            <motion.span key={k} initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.2, ease: EASE_OUT }}
              style={{ fontWeight: 800, fontSize: 40, letterSpacing: '-0.035em', color: 'var(--ink)' }}>{c}</motion.span>
          ))}
          <motion.span layout transition={{ type: 'spring', duration: 0.35, bounce: 0 }} style={{ width: 16, height: 16, borderRadius: 8, background: 'var(--brand)', marginLeft: n ? 3 : 0, alignSelf: 'flex-end', marginBottom: 9 }} />
        </motion.div>
      )}
      <HomeBar light={!wordOn && ph !== 'dot'} />
    </div>
  )
}

// Each page's crew: Hop's neighbours, each busy with a real ask (page 1) or getting paid for one (page 2).
// Box is 112×128 in a 390×470 stage; the frog sits bottom-left, its prop where the action happens.
type Act = 'walk' | 'carry' | 'sip' | 'hammer' | 'push' | 'jingle' | 'toss' | 'wave' | 'shake' | 'raise' | 'spin'
const ACTS: Record<Act, { prop: Record<string, number[]>; frog?: Record<string, number[]>; origin?: string; dur: number; rest: number }> = {
  walk: { prop: { y: [0, -10, 0, -8, 0] }, frog: { y: [0, -3, 0, -3, 0] }, dur: 0.9, rest: 2.2 },
  carry: { prop: { y: [0, -10, 0] }, frog: { scaleY: [1, 0.92, 1] }, dur: 0.7, rest: 1.9 },
  sip: { prop: { rotate: [0, -32, -32, 0] }, origin: '20% 90%', dur: 1.5, rest: 2.4 },
  hammer: { prop: { rotate: [0, -55, 15, -55, 15, 0] }, frog: { scaleY: [1, 1, 0.94, 1, 0.94, 1] }, origin: '25% 85%', dur: 1.3, rest: 2.1 },
  push: { prop: { x: [0, 10, 0] }, frog: { x: [0, 5, 0] }, dur: 1.2, rest: 1.7 },
  jingle: { prop: { rotate: [0, 20, -16, 12, -8, 0] }, origin: '50% 10%', dur: 0.9, rest: 2.6 },
  toss: { prop: { y: [0, -50, 0], rotate: [0, 180, 360] }, frog: { scaleY: [1, 0.94, 1, 1] }, dur: 0.9, rest: 2.2 },
  wave: { prop: { rotate: [0, 14, -10, 10, 0] }, origin: '15% 90%', dur: 1, rest: 2.3 },
  shake: { prop: { rotate: [0, -10, 10, -8, 8, 0], y: [0, -4, 0, -4, 0, 0] }, dur: 0.8, rest: 2.5 },
  raise: { prop: { y: [0, -16, -16, 0] }, frog: { y: [0, -4, -4, 0] }, dur: 1.4, rest: 2 },
  spin: { prop: { scaleX: [1, -1, 1] }, dur: 0.9, rest: 1.9 },
}
type Mate = { c: string; x: number; y: number; act: Act; prop: string; px: number; py: number; ps: number; label: string; happy?: boolean }
const PAGES: { hop: 'wave' | 'happy'; bubble: string; earn: boolean; crew: Mate[]; title: string[]; body: string }[] = [
  { hop: 'wave', bubble: "hi, i'm hop.", earn: false, title: ['need a hand?', 'hop finds someone nearby.'], body: 'post it once. offers in minutes.', crew: [
    { c: 'yellow', x: 16, y: 26, act: 'walk', prop: 'puppy-face', px: 70, py: 66, ps: 40, label: 'dog walk' },
    { c: 'blue', x: 270, y: 36, act: 'carry', prop: 'package-box', px: 19, py: 12, ps: 46, label: 'parcel' },
    { c: 'coral', x: 6, y: 188, act: 'sip', prop: 'coffee-cup', px: 66, py: 52, ps: 36, label: 'coffee run' },
    { c: 'purple', x: 274, y: 196, act: 'hammer', prop: 'hammer', px: 62, py: 26, ps: 46, label: 'flatpack' },
    { c: 'teal', x: 44, y: 330, act: 'push', prop: 'shopping-cart', px: 64, py: 58, ps: 46, label: 'groceries' },
    { c: 'orange', x: 244, y: 330, act: 'jingle', prop: 'key', px: 66, py: 24, ps: 38, label: 'keys' },
  ] },
  { hop: 'happy', bubble: 'ping! £12 nearby', earn: true, title: ['out and about?', 'get paid on the way.'], body: 'asks near you pop up. say yes, get paid.', crew: [
    { c: 'orange', x: 16, y: 26, act: 'toss', prop: 'coins', px: 66, py: 34, ps: 38, label: '+£12', happy: true },
    { c: 'teal', x: 270, y: 36, act: 'wave', prop: 'cash', px: 64, py: 34, ps: 44, label: '+£8' },
    { c: 'purple', x: 6, y: 188, act: 'shake', prop: 'gift-box', px: 66, py: 52, ps: 40, label: '+£25', happy: true },
    { c: 'yellow', x: 274, y: 196, act: 'raise', prop: 'cup-gold', px: 21, py: 12, ps: 42, label: '+£15' },
    { c: 'blue', x: 44, y: 330, act: 'spin', prop: 'money-coin', px: 68, py: 40, ps: 36, label: '+£6', happy: true },
    { c: 'coral', x: 244, y: 330, act: 'wave', prop: 'ticket', px: 64, py: 36, ps: 40, label: '+£10' },
  ] },
]

// Drops in and squashes on landing, the tag pops, then it gets on with its job in short loops with rests
function Crew({ m, k, earn }: { m: Mate; k: number; earn: boolean }) {
  const d = 0.35 + k * 0.12, a = ACTS[m.act], start = d + 0.9 + k * 0.45
  const loop = { duration: a.dur, repeat: Infinity, repeatDelay: a.rest, delay: start, ease: 'easeInOut' as const }
  // eyes on the job: look toward the prop
  const look = { x: (m.px + m.ps / 2 - 42) / 40, y: (m.py + m.ps / 2 - 70) / 40 }
  return (
    <motion.div style={{ position: 'absolute', left: m.x, top: m.y, width: 112, height: 128 }}
      exit={{ y: -36, opacity: 0, scale: 0.8, transition: { duration: 0.22, delay: k * 0.03, ease: [0.55, 0, 1, 0.45] } }}>
      <motion.div style={{ position: 'absolute', inset: 0, transformOrigin: '40% 85%' }}
        initial={{ y: -90, opacity: 0 }} animate={{ y: [-90, 0, -12, 0], scaleY: [1.15, 0.8, 1.06, 1], scaleX: [0.9, 1.14, 0.97, 1], opacity: [0, 1, 1, 1] }}
        transition={{ duration: 0.72, times: [0, 0.45, 0.72, 1], ease: 'easeOut', delay: d }}>
        <motion.div style={{ position: 'absolute', left: 0, top: 34, transformOrigin: '50% 100%' }} animate={a.frog} transition={loop}>
          <Frog c={m.c} w={84} look={look} happy={m.happy} />
        </motion.div>
        <motion.img src={`/icons/${m.prop}.png`} alt="" width={m.ps} height={m.ps} draggable={false} animate={a.prop} transition={loop}
          style={{ position: 'absolute', left: m.px, top: m.py, transformOrigin: a.origin ?? '50% 50%', filter: 'drop-shadow(0 6px 8px rgba(11,77,26,0.16))' }} />
        <motion.span initial={{ scale: 0.5, opacity: 0, y: 4 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.5, delay: d + 0.55 }}
          style={{ position: 'absolute', left: 42, top: 110, translateX: '-50%', whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 10, fontWeight: 700, fontSize: 11, background: earn ? 'var(--lime-50)' : '#fff', color: earn ? 'var(--brand)' : 'var(--ink-2)', boxShadow: '0 2px 6px rgba(6,26,9,0.08)' }}>{m.label}</motion.span>
      </motion.div>
    </motion.div>
  )
}

export function Intro() {
  const { go } = useApp()
  const [i, setI] = useState(0)
  const pg = PAGES[i]
  const [heroRef, heroScale] = useScaleTo(390, 470, 'contain')
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(false); const t = setTimeout(() => setReady(true), 1300); return () => clearTimeout(t) }, [i])
  const next = () => (i === 0 ? setI(1) : go('phone'))
  const onDragEnd = (_: unknown, info: PanInfo) => { if (info.offset.x < -60 && i === 0) setI(1); if (info.offset.x > 60 && i === 1) setI(0) }
  const hopDelay = 0.35 + pg.crew.length * 0.12
  return (
    <div className="screen">
      <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={onDragEnd}
        style={{ position: 'relative', flex: '1 1 470px', maxHeight: 470, minHeight: 250, background: 'linear-gradient(var(--lime-50) 70%, var(--bg))', touchAction: 'pan-y', overflow: 'hidden' }}>
        <div ref={heroRef} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 390, height: 470, transform: `translate(-50%, -50%) scale(${heroScale})` }}>
          <AnimatePresence>
            {pg.crew.map((m, k) => <Crew key={i + m.c + m.prop} m={m} k={k} earn={pg.earn} />)}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            <motion.div key={'hop' + i} style={{ position: 'absolute', left: 120, top: 178, transformOrigin: '50% 100%' }}
              initial={{ y: -120, opacity: 0 }} animate={{ y: [-120, 0, -18, 0], scaleY: [1.2, 0.76, 1.08, 1], scaleX: [0.88, 1.18, 0.96, 1], opacity: [0, 1, 1, 1] }}
              exit={{ y: -40, opacity: 0, transition: { duration: 0.22 } }}
              transition={{ duration: 0.8, times: [0, 0.45, 0.72, 1], ease: 'easeOut', delay: hopDelay }}>
              <Hop state={pg.hop} size={150} pop={false} />
              <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.45, delay: hopDelay + 0.6 }}
                style={{ position: 'absolute', left: 34, top: -54, whiteSpace: 'nowrap', background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '9px 13px', fontWeight: 700, fontSize: 15, boxShadow: '0 6px 16px -6px rgba(11,77,26,0.25)', transformOrigin: '0 100%' }}>{pg.bubble}</motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><StatusBar /></div>
      </motion.div>
      <div className="pad col" style={{ gap: 12, paddingTop: 24 }}>
        <div className="row" style={{ gap: 6 }}>{[0, 1].map(k => <motion.span key={k} animate={{ width: k === i ? 22 : 7, background: k === i ? '#008000' : 'rgba(11,19,12,0.14)' }} transition={{ duration: 0.25, ease: EASE_OUT }} style={{ height: 7, borderRadius: 4, display: 'block' }} />)}</div>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="col" style={{ gap: 12 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}>
            <h1 className="t-title1" style={{ fontSize: 28 }}>
              {pg.title.map((l, k) => <motion.span key={l} style={{ display: 'block' }} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.35, delay: 0.2 + k * 0.08, ease: EASE_OUT }}>{l}</motion.span>)}
            </h1>
            <motion.p className="t-body muted" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.42, ease: EASE_OUT }}>{pg.body}</motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ flex: 1 }} />
      <div className="pad col" style={{ gap: 4, paddingTop: 16, paddingBottom: 'var(--sab)' }}>
        {/* the CTA wakes up once the crew has landed */}
        <motion.div animate={{ opacity: ready ? 1 : 0.45, scale: ready ? 1 : 0.98 }} transition={{ duration: 0.3, ease: EASE_OUT }}><Btn onClick={next} style={{ width: '100%' }}>{i === 0 ? 'get started' : 'next'}</Btn></motion.div>
        <Btn kind="ghost" onClick={() => go('phone')} style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>i have an account</Btn>
      </div>
      <HomeBar />
    </div>
  )
}

const perm = { loc: false, notif: false, contacts: false }

export function Permissions() {
  const { go, route } = useApp()
  if (route.p?.notif) perm.notif = true
  const [loc, setLocS] = useState(perm.loc), [notif] = useState(perm.notif), [contacts, setContactsS] = useState(perm.contacts)
  const setLoc = (v: boolean) => { perm.loc = v; setLocS(v) }
  const setContacts = (v: boolean) => { perm.contacts = v; setContactsS(v) }
  const [dialog, setDialog] = useState(false)
  const Row = ({ icon, t, s, on, onTap, warn }: { icon: React.ReactNode; t: string; s: string; on: boolean; onTap: () => void; warn?: boolean }) => (
    <button className="row" style={{ padding: '14px 16px', width: '100%', textAlign: 'left' }} onClick={onTap}>
      <span className="tile" style={{ width: 36, height: 36, borderRadius: 10 }}>{icon}</span>
      <span className="col grow"><span className="t-callout">{t}</span><span className="t-cap" style={{ color: warn && !on ? '#b36b00' : 'var(--ink-3)' }}>{warn && !on ? 'tap to turn on' : s}</span></span>
      <span className={'switch' + (on ? ' on' : '')} />
    </button>
  )
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad col scroll" style={{ gap: 14, paddingTop: 28, paddingBottom: 16 }}>
        <Hop state="wave" size={84} sway />
        <h1 className="t-title1" style={{ fontSize: 28 }}>hop needs a few things</h1>
        <p className="t-body muted">so hop can find people near you.</p>
        <div className="card" style={{ marginTop: 6 }}>
          <Row icon={<MapPin size={18} />} t="location" s="to show asks within 1 km" on={loc} onTap={() => (loc ? setLoc(false) : setDialog(true))} warn />
          <div style={{ height: 1, background: 'var(--line)', margin: '0 16px' }} />
          <Row icon={<Bell size={18} />} t="notifications" s="new asks and offers" on={notif} onTap={() => go('notif', { back: 'permissions' })} />
          <div style={{ height: 1, background: 'var(--line)', margin: '0 16px' }} />
          <Row icon={<Users size={18} />} t="contacts" s="optional · find friends who’ve joined" on={contacts} onTap={() => setContacts(!contacts)} />
        </div>
      </div>
      <div className="pad col" style={{ gap: 4, paddingTop: 16, paddingBottom: 'var(--sab)' }}>
        {/* Sesame: a pulsing location button that expands into the call to action */}
        <motion.button layout onClick={() => (loc ? go('home', { inbound: true }, 'fade') : setDialog(true))} transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
          style={{ alignSelf: 'center', height: 54, width: loc ? '100%' : 'auto', minWidth: 54, padding: loc ? 0 : '0 22px', borderRadius: loc ? 14 : 27, background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' }}>
          {!loc && <motion.span animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ position: 'absolute', inset: 0, borderRadius: 27, background: 'var(--brand)' }} />}
          <motion.span layout className="row" style={{ gap: 8, position: 'relative' }}>{!loc && <Navigation size={18} fill="#fff" />}{loc ? 'continue' : 'allow location'}</motion.span>
        </motion.button>
        <Btn kind="ghost" onClick={() => go('home', undefined, 'fade')}>maybe later</Btn>
      </div>
      <HomeBar />
      <AnimatePresence>
        {dialog && (
          <motion.div key="ios" style={{ position: 'absolute', inset: 0, zIndex: 80 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />
            <motion.div initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.25, ease: EASE_OUT }}
              style={{ position: 'absolute', left: 60, right: 60, top: '50%', marginTop: -210, borderRadius: 14, overflow: 'hidden', background: 'rgba(242,242,242,0.94)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', fontFamily: '-apple-system, system-ui, sans-serif' }}>
              <div style={{ padding: '19px 16px 15px', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: 17, lineHeight: 1.3 }}>Allow “askapade” to use your location?</div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.35 }}>Hop uses it to show asks within 1 km and to share yours with people nearby.</div>
              </div>
              <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: '-320px -60px', backgroundImage: 'url(/map/greenhill.png)', backgroundSize: '390px 844px', backgroundPosition: '-60px -320px' }} />
                <div className="medot" style={{ left: 135, top: 75 }} />
                <span style={{ position: 'absolute', left: 8, top: 8, display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: '4px 8px', color: '#007AFF', fontWeight: 600, fontSize: 12 }}><Navigation size={11} fill="#007AFF" />Precise: On</span>
              </div>
              {['Allow Once', 'Allow While Using App', 'Don’t Allow'].map((l, k) => (
                <button key={l} onClick={() => { setDialog(false); if (k < 2) setLoc(true) }} style={{ display: 'block', width: '100%', height: 44, borderTop: '0.5px solid rgba(60,60,67,0.29)', color: '#007AFF', fontSize: 17, fontWeight: k === 1 ? 600 : 400 }}>{l}</button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
