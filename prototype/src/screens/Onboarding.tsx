import { useEffect, useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'motion/react'
import { MapPin, Bell, Users, Navigation } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, spring, EASE_OUT, useScaleTo } from '../ui'

// Trendy-style launch: logo pops, the green field shrinks into a circle that becomes Hop, then zooms into the intro
export function Splash() {
  const { go } = useApp()
  const [phase, setPhase] = useState<'logo' | 'morph'>('logo')
  useEffect(() => {
    const a = setTimeout(() => setPhase('morph'), 1100)
    const b = setTimeout(() => go('intro', undefined, 'fade'), 2050)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [go])
  return (
    <div className="screen" style={{ background: 'linear-gradient(var(--lime-50) 62%, var(--bg))', alignItems: 'center', justifyContent: 'center' }} onClick={() => go('intro', undefined, 'fade')}>
      <motion.div animate={{ clipPath: phase === 'logo' ? 'circle(130% at 50% 46%)' : 'circle(0% at 50% 46%)' }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        style={{ position: 'absolute', inset: 0, background: 'var(--brand)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <motion.img src="/ears.svg" alt="" width={88} style={{ filter: 'brightness(0) invert(1)' }} initial={{ scale: 0.6, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={spring} />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.3, ease: EASE_OUT }} style={{ color: '#fff', fontWeight: 800, fontSize: 40, letterSpacing: '-0.03em', marginTop: 18 }}>askapade</motion.div>
        <div style={{ position: 'absolute', bottom: 'calc(var(--sab) + 26px)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 14 }}>Get it done. Get paid.</div>
      </motion.div>
      <AnimatePresence>{phase === 'morph' && (
        <motion.div key="hop" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6, bounce: 0.35, delay: 0.25 }}>
          <Hop state="wave" size={220} pop={false} />
        </motion.div>
      )}</AnimatePresence>
      <HomeBar light={phase === 'logo'} />
    </div>
  )
}

const PAGES = [
  { hop: 'wave' as const, bubble: "hi, i'm hop.", objs: [['package-box', 18, 70, 78, -10], ['coffee-cup', 300, 300, 70, 8], ['puppy-face', 24, 330, 72, -6], ['key', 300, 60, 60, 14]], title: <>need a hand?<br />hop finds someone nearby.</>, body: 'post it once. offers in minutes.' },
  { hop: 'happy' as const, bubble: 'ping! £12 nearby', objs: [['coins', 22, 70, 74, -8], ['gift-box', 296, 300, 72, 10], ['cash', 20, 320, 76, -12], ['cup-gold', 304, 62, 62, 8]], title: <>out and about?<br />get paid on the way.</>, body: 'asks near you pop up. say yes, get paid.' },
]

export function Intro() {
  const { go } = useApp()
  const [i, setI] = useState(0)
  const pg = PAGES[i]
  const [heroRef, heroScale] = useScaleTo(390, 470, 'contain')
  const next = () => (i === 0 ? setI(1) : go('phone'))
  const onDragEnd = (_: unknown, info: PanInfo) => { if (info.offset.x < -60 && i === 0) setI(1); if (info.offset.x > 60 && i === 1) setI(0) }
  return (
    <div className="screen">
      <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={onDragEnd}
        style={{ position: 'relative', flex: '1 1 470px', maxHeight: 470, minHeight: 250, background: 'linear-gradient(var(--lime-50) 62%, var(--bg))', touchAction: 'pan-y', overflow: 'hidden' }}>
        <div ref={heroRef} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 390, height: 470, transform: `translate(-50%, -50%) scale(${heroScale})` }}>
        <div style={{ position: 'absolute', left: 25, top: 105, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(200,245,96,0.75), rgba(200,245,96,0.35) 55%, rgba(200,245,96,0))' }} />
        <AnimatePresence mode="popLayout">
          <motion.div key={i} style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
            {pg.objs.map(([o, x, y, s, r], k) => (
              <motion.img key={o as string} src={`/icons/${o}.png`} alt="" width={s as number} style={{ position: 'absolute', left: x as number, top: y as number, rotate: r as number }}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
                transition={{ scale: { ...spring, delay: 0.05 * k }, opacity: { duration: 0.2, delay: 0.05 * k }, y: { duration: 3 + k * 0.4, repeat: Infinity, ease: 'easeInOut' } }} />
            ))}
            <div style={{ position: 'absolute', left: 110, top: 360, width: 170, height: 22, borderRadius: '50%', background: 'rgba(11,77,26,0.12)', filter: 'blur(8px)' }} />
            <div style={{ position: 'absolute', left: 85, top: 175 }}><Hop state={pg.hop} size={220} sway /></div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: 0.25 }}
              style={{ position: 'absolute', left: 210, top: 120, background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '10px 14px', fontWeight: 700, fontSize: 15, boxShadow: 'inset 0 0 0 1px var(--line)', transformOrigin: '0 100%' }}>{pg.bubble}</motion.div>
          </motion.div>
        </AnimatePresence>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><StatusBar /></div>
      </motion.div>
      <div className="pad col" style={{ gap: 12, paddingTop: 24 }}>
        <div className="row" style={{ gap: 6 }}>{[0, 1].map(k => <motion.span key={k} animate={{ width: k === i ? 22 : 7, background: k === i ? '#008000' : 'rgba(11,19,12,0.14)' }} transition={{ duration: 0.25, ease: EASE_OUT }} style={{ height: 7, borderRadius: 4, display: 'block' }} />)}</div>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="col" style={{ gap: 12 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: EASE_OUT }}>
            <h1 className="t-title1" style={{ fontSize: 28 }}>{pg.title}</h1>
            <p className="t-body muted">{pg.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ flex: 1 }} />
      <div className="pad col" style={{ gap: 4, paddingTop: 16, paddingBottom: 'var(--sab)' }}>
        <Btn onClick={next}>{i === 0 ? 'get started' : 'next'}</Btn>
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
