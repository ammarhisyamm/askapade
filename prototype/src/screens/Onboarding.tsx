import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useMotionValueEvent, useTransform, type PanInfo } from 'motion/react'
import { MapPin, Bell, Users, Navigation } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Frog, Btn, Ticker, EASE_OUT, useScaleTo } from '../ui'
import { Tick } from '../icons'

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

// Two different scenes, one idea each.
// Slide 1 (match): your ask in the middle, Hop behind it, rings reach the neighbours and two answer.
// Slide 2 (route): you walk your usual way, asks pop up along it, each one you pass adds to today's total.
const PAGES = [
  { title: ['need a hand?', 'hop finds someone nearby.'], body: 'post it once. offers in minutes.' },
  { title: ['out and about?', 'get paid on the way.'], body: 'asks near you pop up. say yes, get paid.' },
]
const SLIDE_MS = [7000, 9000]
const CX = 195, CY = 262 // centre of the ask card in the 390×470 stage

function useBeats(steps: number[], loop: number) {
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    let ts: ReturnType<typeof setTimeout>[] = []
    const run = () => { ts = steps.map((t, k) => setTimeout(() => setBeat(k + 1), t)); ts.push(setTimeout(() => { setBeat(0); run() }, loop)) }
    run()
    return () => ts.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return beat
}

// The real map under each scene (it's a map-first app), washed back so the story reads first
function MapBg({ area }: { area: string }) {
  return (
    <>
      <div aria-hidden style={{ position: 'absolute', inset: -40, background: `url(/map/${area}.png) center/cover no-repeat`, opacity: 0.9 }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(241,252,217,0.5) 0%, rgba(241,252,217,0.62) 60%, rgba(244,246,240,0.95) 100%)' }} />
    </>
  )
}

const NEIGHBOURS: [string, number, number, boolean][] = [['yellow', 34, 96, true], ['coral', 290, 74, false], ['teal', 22, 352, false], ['purple', 296, 344, true]]
function MatchScene() {
  // 1 rings go out · 2 first offer · 3 second offer · 4 "2 offers" lands on the card
  const beat = useBeats([700, 1700, 2400, 3000], 6400)
  let offers = 0
  return (
    <>
      {[0, 1, 2].map(k => (
        <motion.span key={k} aria-hidden style={{ position: 'absolute', left: CX - 90, top: CY - 90, width: 180, height: 180, borderRadius: '50%', border: '1.5px solid rgba(0,128,0,0.32)', background: 'rgba(0,128,0,0.03)' }}
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: [0.5, 2.3], opacity: [0.9, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: 0.6 + k * 0.85, ease: 'easeOut' }} />
      ))}
      {NEIGHBOURS.map(([c, x, y, answers], k) => {
        const idx = answers ? ++offers : 0
        const said = answers && beat >= 1 + idx
        const look = { x: (CX - (x + 36)) / 120, y: (CY - (y + 32)) / 120 }
        return (
          <motion.div key={c} style={{ position: 'absolute', left: x, top: y, transformOrigin: '50% 100%' }}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.35, delay: 0.2 + k * 0.08 }}>
            <motion.div key={said ? 'yes' : 'wait'} animate={said ? { y: [0, -14, 0], scaleY: [1, 1.06, 1] } : undefined} transition={{ duration: 0.45, ease: 'easeOut' }} style={{ transformOrigin: '50% 100%' }}>
              <Frog c={c} w={72} look={beat >= 1 ? look : { x: 0, y: 0 }} happy={said} />
            </motion.div>
            <AnimatePresence>{said && (
              <motion.span initial={{ scale: 0.4, opacity: 0, y: 6 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.5 }}
                className="row" style={{ position: 'absolute', left: '50%', top: -26, translateX: '-50%', gap: 4, whiteSpace: 'nowrap', padding: '4px 9px 4px 6px', borderRadius: 12, background: '#fff', fontWeight: 700, fontSize: 12, boxShadow: '0 4px 12px -4px rgba(6,26,9,0.2)', transformOrigin: '50% 100%' }}>
                <Tick size={18} />can help
              </motion.span>
            )}</AnimatePresence>
          </motion.div>
        )
      })}
      {/* Hop sits behind the card, peeking over its edge */}
      <motion.div style={{ position: 'absolute', left: CX - 48, top: CY - 112 }} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', duration: 0.6, bounce: 0.4, delay: 0.45 }}>
        <Frog w={96} look={{ x: beat >= 2 ? -0.8 : 0, y: -0.3 }} happy={beat >= 4} />
      </motion.div>
      <motion.div initial={{ y: 30, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.55, bounce: 0.25, delay: 0.25 }}
        className="row" style={{ position: 'absolute', left: CX - 98, top: CY - 36, width: 196, height: 72, padding: '0 14px 0 10px', gap: 10, borderRadius: 20, background: '#fff', boxShadow: '0 16px 32px -16px rgba(6,26,9,0.3), inset 0 0 0 1px var(--line)' }}>
        <img src="/icons/puppy-face.png" alt="" width={44} height={44} />
        <span className="col grow"><span style={{ fontWeight: 800, fontSize: 15 }}>Walk Bella</span><span className="t-cap muted" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>30 min walk</span></span>
        <span style={{ fontWeight: 800, fontSize: 17 }}>£12</span>
        <AnimatePresence>{beat >= 4 && (
          <motion.span initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.5 }}
            style={{ position: 'absolute', right: -6, top: -12, padding: '4px 9px', borderRadius: 11, background: 'var(--brand)', color: '#fff', fontWeight: 800, fontSize: 12, boxShadow: '0 6px 12px -6px rgba(0,128,0,0.6)' }}>2 offers</motion.span>
        )}</AnimatePresence>
      </motion.div>
    </>
  )
}

// a gentle S-curve road across the stage; asks sit along it
const ROAD = 'M -20 440 C 70 430 90 350 170 338 S 300 310 302 240 S 346 158 420 150'
const STOPS: [number, string, number][] = [[0.3, 'package-box', 8], [0.56, 'coffee-cup', 6], [0.8, 'puppy-face', 12]]
function RouteScene() {
  const road = useRef<SVGPathElement>(null)
  const [pts, setPts] = useState<{ x: number; y: number }[]>([])
  const p = useMotionValue(0)
  const [passed, setPassed] = useState(0)
  const dist = useTransform(p, v => `${v * 100}%`)
  useLayoutEffect(() => { const el = road.current; if (!el) return; const L = el.getTotalLength(); setPts(STOPS.map(([f]) => { const q = el.getPointAtLength(f * L); return { x: q.x, y: q.y } })) }, [])
  useEffect(() => { const c = animate(p, [0, 1], { duration: 8, ease: 'linear', repeat: Infinity, repeatDelay: 0.6, delay: 0.5 }); return c.stop }, [p])
  useMotionValueEvent(p, 'change', v => { const n = STOPS.filter(([f]) => v >= f).length; if (n !== passed) setPassed(n) })
  const total = STOPS.slice(0, passed).reduce((a, [, , fee]) => a + fee, 0)
  return (
    <>
      <svg width={390} height={470} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <path d={ROAD} stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" />
        <path ref={road} d={ROAD} stroke="var(--brand)" strokeWidth={7} strokeLinecap="round" fill="none" />
      </svg>
      {pts.map((q, k) => {
        const [, obj, fee] = STOPS[k], done = passed > k
        return (
          <div key={k} style={{ position: 'absolute', left: q.x, top: q.y }}>
            <AnimatePresence>{!done
              ? <motion.div key="pin" className="pin" style={{ position: 'absolute', left: 0, top: 0 }} initial={{ y: -30, opacity: 0, scale: 0.7 }} animate={{ y: -8, opacity: 1, scale: 1 }} exit={{ scale: 0, opacity: 0, transition: { duration: 0.18 } }} transition={{ type: 'spring', duration: 0.5, bounce: 0.45, delay: 0.3 + k * 0.15 }}>
                  <span className="bubble"><img src={`/icons/${obj}.png`} alt="" /></span><span className="price">£{fee}</span><span className="tail" />
                </motion.div>
              : <motion.span key="earned" initial={{ y: -20, opacity: 0, scale: 0.6 }} animate={{ y: [-20, -70], opacity: [1, 1, 0], scale: 1 }} transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.6, 1] }}
                  style={{ position: 'absolute', left: 0, top: 0, translateX: '-50%', padding: '4px 10px', borderRadius: 12, background: 'var(--brand)', color: '#fff', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>+£{fee}</motion.span>}
            </AnimatePresence>
          </div>
        )
      })}
      {/* you, walking your usual route */}
      <motion.div style={{ position: 'absolute', left: 0, top: 0, offsetPath: `path('${ROAD}')`, offsetDistance: dist, offsetRotate: '0deg', offsetAnchor: '50% 92%' }}>
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 0.38, repeat: Infinity, ease: 'easeOut' }}><Frog c="blue" w={64} look={{ x: 0.7, y: -0.2 }} happy={passed === STOPS.length} /></motion.div>
      </motion.div>
      <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.3, delay: 0.2 }}
        className="row" style={{ position: 'absolute', left: 20, top: 66, gap: 10, padding: '10px 14px', borderRadius: 18, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 24px -14px rgba(6,26,9,0.3), inset 0 0 0 1px rgba(255,255,255,0.9)' }}>
        <img src="/icons/coins.png" alt="" width={30} height={30} />
        <span className="col"><span className="t-cap muted" style={{ fontSize: 11, fontWeight: 600 }}>today</span><span style={{ fontWeight: 800, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}><Ticker value={`£${total.toFixed(2)}`} /></span></span>
      </motion.div>
    </>
  )
}

// Welcome (Revolut + Family): the map and the story fill the screen and keep cycling; the logo stays pinned up top;
// a floating sheet slides up with the words and two steady buttons. First open, the ask icons burst out of the centre.
const BURST: [string, number, number][] = [['puppy-face', -120, -150], ['package-box', 118, -170], ['coffee-cup', -140, 10], ['coins', 140, -20], ['key', -70, 150], ['shopping-cart', 96, 140]]
export function Intro() {
  const { go } = useApp()
  const [i, setI] = useState(0)
  const pg = PAGES[i]
  const [stageRef, stageScale] = useScaleTo(390, 470, 'contain')
  // keep cycling through the two scenes, like an ambient intro
  useEffect(() => { const t = setTimeout(() => setI(k => (k + 1) % PAGES.length), SLIDE_MS[i]); return () => clearTimeout(t) }, [i])
  const onDragEnd = (_: unknown, info: PanInfo) => { if (info.offset.x < -60) setI(1); if (info.offset.x > 60) setI(0) }
  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <AnimatePresence initial={false}><motion.div key={'map' + i} style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><MapBg area={i ? 'greenhill' : 'harrow'} /></motion.div></AnimatePresence>
      <div style={{ position: 'relative', zIndex: 2 }}><StatusBar /></div>
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
        className="row" style={{ position: 'relative', zIndex: 2, alignSelf: 'center', gap: 6, height: 34, padding: '0 14px 0 10px', borderRadius: 17, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.9), 0 6px 16px -10px rgba(6,26,9,0.3)' }}>
        <img src="/ears.svg" alt="" width={18} height={18} /><span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>askapade</span>
      </motion.div>
      <motion.div ref={stageRef} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={onDragEnd} style={{ position: 'relative', flex: 1, touchAction: 'pan-y', minHeight: 200 }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 390, height: 470, transform: `translate(-50%, -50%) scale(${stageScale})` }}>
          {BURST.map(([o, dx, dy], k) => (
            <motion.img key={o} src={`/icons/${o}.png`} alt="" width={56} height={56} aria-hidden style={{ position: 'absolute', left: 167, top: 207 }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }} animate={{ x: dx, y: dy, scale: [0, 1.15, 1, 0.6], opacity: [0, 1, 1, 0], rotate: k % 2 ? 14 : -14 }}
              transition={{ duration: 1.3, times: [0, 0.35, 0.7, 1], delay: 0.15 + k * 0.04, ease: [0.22, 1, 0.36, 1] }} />
          ))}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
              <motion.div style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i === 0 ? 0.9 : 0, duration: 0.3 }}>
                {i === 0 ? <MatchScene /> : <RouteScene />}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      {/* floating sheet: the words change with the scene, the buttons never move */}
      <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ type: 'spring', duration: 0.6, bounce: 0.15, delay: 0.45 }}
        className="col" style={{ position: 'relative', zIndex: 3, margin: '0 8px 8px', padding: '20px 20px calc(max(var(--sab) - 8px, 0px) + 8px)', borderRadius: 32, background: 'var(--surface)', gap: 14, boxShadow: '0 -10px 40px -20px rgba(6,26,9,0.35)' }}>
        <div className="row" style={{ gap: 6, width: 72 }}>{[0, 1].map(k => (
          <span key={k} style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(11,19,12,0.12)', overflow: 'hidden' }}>
            <motion.span key={`${k}-${i}`} initial={{ scaleX: k < i ? 1 : 0 }} animate={{ scaleX: k <= i ? 1 : 0 }} transition={{ duration: k === i ? SLIDE_MS[k] / 1000 : 0, ease: 'linear' }} style={{ display: 'block', height: '100%', background: 'var(--brand)', transformOrigin: 'left' }} />
          </span>
        ))}</div>
        <div style={{ position: 'relative', minHeight: 116 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} className="col" style={{ gap: 10 }} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }} transition={{ duration: 0.28, ease: EASE_OUT }}>
              <h1 className="t-title1" style={{ fontSize: 28, lineHeight: 1.12 }}>{pg.title.map(l => <span key={l} style={{ display: 'block' }}>{l}</span>)}</h1>
              <p className="t-body muted">{pg.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="col" style={{ gap: 2 }}>
          <Btn onClick={() => go('phone')} style={{ width: '100%' }}>get started</Btn>
          <Btn kind="ghost" onClick={() => go('phone')}>i have an account</Btn>
        </div>
      </motion.div>
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
