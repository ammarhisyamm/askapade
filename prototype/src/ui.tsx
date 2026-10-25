import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, useMotionValueEvent, useDragControls, animate, type PanInfo } from 'motion/react'
import { Signal, Wifi, BatteryFull, Compass, MessageSquare, Plus, Wallet, User, Check, ChevronsRight } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useApp } from './store'

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const
export const spring = { type: 'spring', duration: 0.5, bounce: 0.2 } as const

export const PEOPLE: Record<string, { name: string; ini: string; c: [string, string] }> = {
  Tom: { name: 'Tom W.', ini: 'TW', c: ['#9AD0FF', '#3D7BE0'] },
  Priya: { name: 'Priya S.', ini: 'PS', c: ['#E0B4FF', '#9454E8'] },
  Ellie: { name: 'Ellie M.', ini: 'EM', c: ['#FFC4A8', '#F2734B'] },
  Sam: { name: 'Sam T.', ini: 'ST', c: ['#FFE08A', '#E6A700'] },
  Dan: { name: 'Dan C.', ini: 'DC', c: ['#A6EBDD', '#1F9C88'] },
  Grace: { name: 'Grace N.', ini: 'GN', c: ['#FFB3C7', '#E5487A'] },
  Leo: { name: 'Leo K.', ini: 'LK', c: ['#C7D2FE', '#6366F1'] },
  Me: { name: 'Ammar H.', ini: 'AH', c: ['#B9F27A', '#1E9A2C'] },
}

export function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className={'statusbar' + (light ? ' light' : '')}>
      <span>9:41</span>
      <span className="icons"><Signal size={17} strokeWidth={2.6} /><Wifi size={17} strokeWidth={2.6} /><BatteryFull size={24} strokeWidth={2} /></span>
    </div>
  )
}
export const HomeBar = ({ light }: { light?: boolean }) => <div className={'homebar' + (light ? ' light' : '')} />

type HopState = 'idle' | 'searching' | 'happy' | 'sad' | 'wave'

// Each state has its own personality: motion + a small effect layer. Tap Hop and it reacts.
const HOP_LOOP: Record<HopState, { animate: Record<string, number[]>; transition: Record<string, unknown> }> = {
  wave: { animate: { rotate: [0, -6, 4, -5, 0, 0], y: [0, 0, 0, 0, -14, 0], scaleY: [1, 1, 1, 0.94, 1.04, 1] }, transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.6, 0.78, 1] } },
  searching: { animate: { x: [0, -7, 0, 7, 0], rotate: [0, -7, 0, 7, 0], y: [0, -2, 0, -2, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } },
  happy: { animate: { y: [0, 4, -30, 0, -6, 0], scaleY: [1, 0.86, 1.1, 0.92, 1.02, 1], scaleX: [1, 1.1, 0.94, 1.06, 0.99, 1] }, transition: { duration: 1.1, repeat: Infinity, repeatDelay: 0.7, ease: 'easeOut', times: [0, 0.15, 0.45, 0.68, 0.84, 1] } },
  sad: { animate: { y: [0, 4, 4, 0], scaleY: [1, 0.95, 0.95, 1], rotate: [0, 0, -3, 3, -2, 0] }, transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } },
  idle: { animate: { scale: [1, 1.025, 1], y: [0, -2, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
}

const Sparkle = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} /></svg>
)

function HopFx({ state, size }: { state: HopState; size: number }) {
  const s = size / 160
  if (state === 'happy') {
    const sp = [[-10, 20, 18, '#C8F560'], [150, 14, 16, '#C8F560'], [-4, 80, 12, '#008000'], [158, 86, 13, '#008000'], [70, -16, 14, '#C8F560']] as const
    return <>{sp.map(([x, y, z, c], i) => (
      <motion.span key={i} style={{ position: 'absolute', left: x * s, top: y * s, pointerEvents: 'none' }}
        animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }} transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.9, delay: 0.42 + i * 0.05, ease: 'easeOut' }}>
        <Sparkle size={z * s * 1.6} color={c} />
      </motion.span>
    ))}</>
  }
  if (state === 'sad') return (
    <motion.svg width={14 * s * 1.4} height={20 * s * 1.4} viewBox="0 0 14 20" style={{ position: 'absolute', left: 128 * s, top: 34 * s, pointerEvents: 'none' }}
      animate={{ y: [0, 0, 26 * s], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, times: [0, 0.3, 1] }}>
      <path d="M7 0 C9 6 14 10 14 14 A7 7 0 0 1 0 14 C0 10 5 6 7 0 Z" fill="#7CC6F2" />
    </motion.svg>
  )
  if (state === 'searching') return (
    <motion.span style={{ position: 'absolute', left: 132 * s, top: 70 * s, pointerEvents: 'none' }} animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 1.3 }}>
      <Sparkle size={16 * s * 1.5} color="#FFFFFF" />
    </motion.span>
  )
  return null
}

export function Hop({ state = 'idle', size = 120, pop = true, still = false }: { state?: HopState; size?: number; pop?: boolean; still?: boolean; bob?: boolean; sway?: boolean }) {
  const reduce = useReducedMotion()
  const [poke, setPoke] = useState(0)
  const loop = HOP_LOOP[state]
  const live = !reduce && !still
  return (
    <motion.div
      key={state}
      initial={pop && !reduce ? { scale: 0.6, opacity: 0, rotate: -8 } : false}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 0.6, bounce: 0.45 }}
      onTap={() => setPoke(p => p + 1)}
      style={{ width: size, height: size * 140 / 160, flex: 'none', position: 'relative', cursor: 'pointer', touchAction: 'manipulation' }}
      aria-label="Hop"
    >
      <motion.div key={poke} animate={poke && live ? { scaleX: [1, 1.15, 0.92, 1], scaleY: [1, 0.85, 1.08, 1], rotate: [0, -6, 6, 0] } : undefined} transition={{ duration: 0.45 }} style={{ width: '100%', height: '100%', transformOrigin: '50% 100%' }}>
        <motion.img src={`/hop/${state}.svg`} alt="" width={size} height={size * 140 / 160} draggable={false}
          animate={live ? loop.animate : undefined} transition={live ? loop.transition : undefined}
          style={{ transformOrigin: '50% 100%', display: 'block' }} />
      </motion.div>
      {live && <HopFx state={state} size={size} />}
    </motion.div>
  )
}

// Dummy people: photoreal portraits generated with Codex CLI (public/people/*.png)
export const photo = (who: string) => `/people/${who.toLowerCase()}.jpg`

export function Avatar({ who, size = 40, tick = true }: { who: string; size?: number; tick?: boolean }) {
  const p = PEOPLE[who]
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: `center/cover no-repeat url(${photo(who)}), linear-gradient(135deg, ${p.c[0]}, ${p.c[1]})` }} aria-label={p.name}>
      {tick && <span className="tick"><Check size={size * 0.22} color="#fff" strokeWidth={4} /></span>}
    </div>
  )
}

export const Tile = ({ obj, size = 44, bg }: { obj: string; size?: number; bg?: string }) => (
  <div className="tile" style={{ width: size, height: size, borderRadius: size * 0.3, background: bg }}><img src={`/icons/${obj}.png`} alt="" /></div>
)

export function Btn({ kind = 'primary', children, onClick, icon, className = '', disabled, style }: { kind?: string; children: ReactNode; onClick?: () => void; icon?: ReactNode; className?: string; disabled?: boolean; style?: React.CSSProperties }) {
  return <button className={`btn ${kind} ${className}`} onClick={onClick} disabled={disabled} style={style}>{icon}{children}</button>
}

// Open sheets in the order they opened, so a sheet under another can step back (Family-style stack)
const stack: string[] = []
const subs = new Set<() => void>()
const emit = () => subs.forEach(f => f())
function useSheetDepth() {
  const id = useId()
  useEffect(() => { stack.push(id); emit(); return () => { stack.splice(stack.indexOf(id), 1); emit() } }, [id])
  useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f) } }, () => stack.join('|'))
  const i = stack.indexOf(id)
  return i < 0 ? 0 : stack.length - 1 - i
}

/** Floating sheet: springs in, follows its content's height, drags to dismiss, steps back when another opens on top. */
export function Sheet({ open, onClose, children, scrim = true, z = 50 }: { open: boolean; onClose?: () => void; children: ReactNode; scrim?: boolean; z?: number }) {
  return <AnimatePresence>{open && <SheetBody key="sheet" onClose={onClose} scrim={scrim} z={z}>{children}</SheetBody>}</AnimatePresence>
}

function SheetBody({ onClose, children, scrim, z }: { onClose?: () => void; children: ReactNode; scrim: boolean; z: number }) {
  const depth = useSheetDepth()
  const dragY = useMotionValue(0)
  const controls = useDragControls()
  const card = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number | 'auto'>('auto')
  useLayoutEffect(() => {
    const el = inner.current; if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight)); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scrimO = useTransform(dragY, [0, 320], [1, 0.15])
  const handleW = useTransform(dragY, [-30, 0, 160], [48, 36, 30])
  // Inputs keep their own gestures; a scrolled sheet only drags from the grab zone
  const start = (e: React.PointerEvent, grab = false) => {
    if (!onClose) return
    const t = e.target as HTMLElement
    if (!grab && t.closest('input, textarea, select, [role="slider"], [data-nodrag]')) return
    const c = card.current
    if (!grab && c && c.scrollHeight > c.clientHeight + 2) return
    controls.start(e)
  }
  const end = (_: unknown, info: PanInfo) => { if (onClose && (info.offset.y > 110 || info.velocity.y > 550)) onClose() }
  return (
    <>
      {scrim && (
        <motion.div className="scrim" style={{ zIndex: z - 10 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} onClick={onClose}>
          <motion.div style={{ position: 'absolute', inset: 0, background: 'inherit', opacity: scrimO }} />
        </motion.div>
      )}
      <motion.div className="fsheet" style={{ zIndex: z }}
        initial={{ y: '115%' }}
        animate={{ y: depth ? -14 : 0, scale: depth ? 0.94 : 1, opacity: depth > 1 ? 0 : 1 }}
        exit={{ y: '115%', transition: { duration: 0.34, ease: EASE_DRAWER } }}
        transition={{ type: 'spring', duration: 0.55, bounce: 0.18 }}>
        <motion.div drag={onClose ? 'y' : false} dragListener={false} dragControls={controls} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.06, bottom: 0.75 }}
          dragTransition={{ bounceStiffness: 520, bounceDamping: 34 }} onDragEnd={end} onPointerDown={e => start(e)} style={{ y: dragY, touchAction: onClose ? 'none' : undefined }}>
          <motion.div ref={card} className="fsheet-card" animate={{ height: h }} transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}>
            <div ref={inner}>
              <div className="fsheet-grab" onPointerDown={e => { e.stopPropagation(); start(e, true) }}><motion.span className="handle" style={{ width: handleW }} /></div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07, duration: 0.32, ease: EASE_OUT }} className="fsheet-body">{children}</motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

export function Modal({ open, children, onClose }: { open: boolean; children: ReactNode; onClose?: () => void }) {
  return (
    <AnimatePresence>
      {open && <motion.div key="scrim" className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />}
      {open && (
        <motion.div key="modal" className="modal" initial={{ opacity: 0, y: '-40%', scale: 0.94 }} animate={{ opacity: 1, y: '-50%', scale: 1 }} exit={{ opacity: 0, y: '-46%', scale: 0.97 }} transition={spring}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Pin({ x, y, obj, price, sel, boost, onClick, delay = 0 }: { x: number; y: number; obj: string; price: string; sel?: boolean; boost?: boolean; onClick?: () => void; delay?: number }) {
  return (
    <motion.button className={'pin' + (sel ? ' sel' : '') + (boost ? ' boost' : '')} style={{ left: x, top: y }} onClick={onClick}
      initial={{ y: -70, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6, bounce: 0.45, delay }} whileTap={{ scale: 0.92 }}>
      <span className="bubble"><img src={`/icons/${obj}.png`} alt="" /></span>
      <span className="price">{price}</span>
      <span className="tail" />
    </motion.button>
  )
}

export const Me = ({ x, y }: { x: number; y: number }) => <div className="medot" style={{ left: x, top: y }} />
export const Ring = ({ x, y, d, label }: { x: number; y: number; d: number; label: string }) => <div className="ring" style={{ left: x, top: y, width: d, height: d }}><span className="lbl">{label}</span></div>
export function Person({ who, x, y, delay = 0 }: { who: string; x: number; y: number; delay?: number }) {
  const p = PEOPLE[who]
  return <motion.div className="person" style={{ left: x, top: y, background: `center/cover no-repeat url(${photo(who)}), linear-gradient(135deg, ${p.c[0]}, ${p.c[1]})` }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay }} aria-label={p.name} />
}
export const MapBg = ({ area = 'harrow' }: { area?: string }) => <div className="map" style={{ backgroundImage: `url(/map/${area}.png)` }} />

/** Measures a box and returns the scale that makes a w×h design cover (fill) or fit (contain) it. */
export function useScaleTo(w: number, h: number, mode: 'cover' | 'contain') {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => { const sx = el.clientWidth / w, sy = el.clientHeight / h; setScale(mode === 'cover' ? Math.max(sx, sy) : Math.min(sx, sy)) }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h, mode])
  return [ref, scale] as const
}

/** The map and everything pinned to it share one 390×844 coordinate space, scaled to fill any iPhone. */
export function MapCanvas({ area = 'harrow', children, pan = true }: { area?: string; children?: ReactNode; pan?: boolean }) {
  const [ref, s] = useScaleTo(390, 844, 'cover')
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#e6e9e0' }}>
      <motion.div drag={pan} dragConstraints={{ left: -140, right: 140, top: -200, bottom: 160 }} dragElastic={0.18} dragTransition={{ power: 0.25, timeConstant: 220 }}
        style={{ position: 'absolute', inset: 0, cursor: pan ? 'grab' : 'default', touchAction: 'none' }} whileTap={pan ? { cursor: 'grabbing' } : undefined}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: 390, height: 844, transform: `translateX(-50%) scale(${s})`, transformOrigin: 'top center' }}>
          <div style={{ position: 'absolute', inset: '-220px -170px', background: `#eceee6 url(/map/${area}.png) center/cover no-repeat` }} />
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function TabBar({ active }: { active: 'explore' | 'asks' | 'wallet' | 'you' }) {
  const { go } = useApp()
  const T = ({ id, label, icon, to }: { id: string; label: string; icon: ReactNode; to: string }) => (
    <motion.button whileTap={{ scale: 0.9 }} transition={{ type: 'spring', duration: 0.3, bounce: 0.4 }} className="tab" style={{ position: 'relative', color: active === id ? 'var(--ink)' : 'var(--ink-2)', background: 'none' }} onClick={() => go(to, undefined, 'fade')}>
      {active === id && <motion.span layoutId="tab-active" transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }} style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(6,26,9,0.08)' }} />}
      <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>{icon}{label}</span>
    </motion.button>
  )
  return (
    <div className="tabbar">
      <T id="explore" label="Explore" icon={<Compass size={21} />} to="home" />
      <T id="asks" label="My asks" icon={<MessageSquare size={21} />} to="myasks" />
      <button className="fab" onClick={() => go('post', undefined, 'up')} aria-label="Post an ask"><Plus size={26} strokeWidth={2.6} /></button>
      <T id="wallet" label="Wallet" icon={<Wallet size={21} />} to="wallet" />
      <T id="you" label="You" icon={<User size={21} />} to="profile" />
    </div>
  )
}

export function Stepper({ step }: { step: 0 | 1 | 2 }) {
  const steps = ['Payment held', 'Done', 'Paid']
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s} className={'s' + (i <= step ? ' on' : '')}>
          <div className="bar"><i style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} /></div>
          <span className="row" style={{ gap: 4 }}>{i <= step && <Check size={12} strokeWidth={3} />}{s}</span>
        </div>
      ))}
    </div>
  )
}

export function CountdownRing({ secs, total, size = 46, urgent, unit = 's' }: { secs: number; total: number; size?: number; urgent?: boolean; unit?: string }) {
  const r = size / 2 - 4, c = 2 * Math.PI * r
  return (
    <div style={{ width: size, height: size, position: 'relative', flex: 'none' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-2)" strokeWidth="4" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={urgent ? 'var(--urgent)' : 'var(--brand)'} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - secs / total)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>{secs}{unit}</span>
    </div>
  )
}

export function Confetti({ run }: { run: boolean }) {
  const reduce = useReducedMotion()
  if (!run || reduce) return null
  const colors = ['#008000', '#C8F560', '#FFB3C7', '#9AD0FF', '#FFE08A']
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 70, overflow: 'hidden' }}>
      {Array.from({ length: 36 }).map((_, i) => {
        const x = Math.random() * 390, rot = Math.random() * 540, d = 1.4 + Math.random() * 0.9
        return <motion.i key={i} style={{ position: 'absolute', left: x, top: -20, width: 8, height: 12, borderRadius: 2, background: colors[i % colors.length] }}
          initial={{ y: 0, rotate: 0, opacity: 1 }} animate={{ y: 900, rotate: rot, opacity: [1, 1, 0] }} transition={{ duration: d, delay: Math.random() * 0.3, ease: [0.2, 0.6, 0.4, 1] }} />
      })}
    </div>
  )
}

/* ---------------- 60fps-style interaction primitives ---------------- */

/** CRED swipe-to-pay: a green fill follows the knob; past the threshold a glow blooms and a check draws in. */
/** Swiggy-style slide to confirm: shimmer label, springy snap-back, knob previews the commit, then busy → success. */
export function SwipeConfirm({ label, onDone, doneLabel = 'Done', busyLabel = 'One moment…' }: { label: string; onDone: () => void; tone?: 'dark' | 'green'; doneLabel?: string; busyLabel?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [w, setW] = useState(350)
  const [phase, setPhase] = useState<'idle' | 'busy' | 'done'>('idle')
  const [armed, setArmed] = useState(false), [touched, setTouched] = useState(false)
  const reduce = useReducedMotion()
  const nudge = useRef<{ stop: () => void } | null>(null)
  useLayoutEffect(() => {
    const el = track.current; if (!el) return
    const ro = new ResizeObserver(() => setW(el.offsetWidth)); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const K = 56, max = w - K - 8, THRESH = 0.8
  const fillW = useTransform(x, v => v + K)
  const labelO = useTransform(x, v => 1 - Math.min(1, v / (max * 0.5)))
  const labelX = useTransform(x, v => v * 0.3)
  useMotionValueEvent(x, 'change', v => { const a = v > max * THRESH; if (a !== armed) { setArmed(a); if (a) navigator.vibrate?.(8) } })
  // Idle nudge until the first touch says "this moves"
  useEffect(() => {
    if (touched || phase !== 'idle' || reduce) return
    const t = setInterval(() => { nudge.current = animate(x, [0, 18, 0], { duration: 0.8, ease: EASE_OUT, times: [0, 0.35, 1] }) }, 3400)
    return () => clearInterval(t)
  }, [touched, phase, reduce, x])
  const finish = () => {
    setTouched(true); setPhase('busy')
    animate(x, max, { type: 'spring', duration: 0.3, bounce: 0 })
    setTimeout(() => setPhase('done'), 950)
    setTimeout(onDone, 1900)
  }
  return (
    <div ref={track} role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={phase === 'idle' ? 0 : 100}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && phase === 'idle') { e.preventDefault(); finish() } }}
      style={{ position: 'relative', height: 64, borderRadius: 32, background: 'var(--brand)', padding: 4, overflow: 'hidden', outlineOffset: 3 }}>
      <motion.span style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: fillW, borderRadius: 28, background: 'var(--brand-900)', opacity: 0.3 }} />
      <motion.span aria-hidden style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', paddingLeft: 52, opacity: labelO, x: labelX }}>
        <span className="shimmer-text">{label}</span>
      </motion.span>
      <AnimatePresence>{phase === 'busy' && (
        <motion.span key="busy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: EASE_OUT }}
          style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', paddingRight: 52, color: '#fff', fontWeight: 700, fontSize: 16 }}>{busyLabel}</motion.span>
      )}</AnimatePresence>
      <motion.div drag={phase === 'idle' ? 'x' : false} dragConstraints={{ left: 0, right: max }} dragElastic={0.03} dragMomentum={false}
        onPointerDown={() => { nudge.current?.stop(); setTouched(true) }}
        onDragEnd={() => (x.get() > max * THRESH ? finish() : animate(x, 0, { type: 'spring', duration: 0.5, bounce: 0.38 }))}
        animate={{ scale: phase === 'done' ? 0.6 : armed && phase === 'idle' ? 1.07 : 1, opacity: phase === 'done' ? 0 : 1 }} whileTap={phase === 'idle' ? { scale: 0.93 } : undefined}
        transition={{ type: 'spring', duration: 0.3, bounce: 0.45 }}
        style={{ x, width: K, height: K, borderRadius: K / 2, background: '#fff', color: 'var(--brand)', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1, touchAction: 'none', cursor: phase === 'idle' ? 'grab' : 'default', boxShadow: '0 4px 12px rgba(3, 26, 9, 0.3)' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {phase === 'busy'
            ? <motion.svg key="spin" width={26} height={26} viewBox="0 0 24 24" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' }, default: { duration: 0.2 } }}>
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={3} /><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
              </motion.svg>
            : armed
              ? <motion.span key="ok" initial={{ scale: 0.4, rotate: -30, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ type: 'spring', duration: 0.3, bounce: 0.5 }} style={{ display: 'grid' }}><Check size={26} strokeWidth={3} /></motion.span>
              : <motion.span key="go" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: 'grid' }}><ChevronsRight size={28} strokeWidth={2.6} /></motion.span>}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{phase === 'done' && (
        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--brand)', color: '#fff', fontWeight: 800, fontSize: 16, borderRadius: 32 }}>
          <DrawCheck size={26} /><motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.25, ease: EASE_OUT }}>{doneLabel}</motion.span>
        </motion.div>
      )}</AnimatePresence>
    </div>
  )
}

/** A check that draws itself inside a circle (Uber verified tick, CRED payment success). */
export function DrawCheck({ size = 24, color = '#fff', delay = 0 }: { size?: number; color?: string; delay?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <motion.circle cx="12" cy="12" r="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: EASE_OUT, delay }} />
      <motion.path d="M7.5 12.5l3 3 6-6.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EASE_OUT, delay: delay + 0.32 }} />
    </svg>
  )
}

/** Opal hold-to-commit: press and hold fills the button; the label changes; it resolves into a success pill. */
export function HoldButton({ label, holdingLabel = 'Keep holding…', doneLabel, onDone, ms = 1200, icon }: { label: string; holdingLabel?: string; doneLabel: string; onDone: () => void; ms?: number; icon?: ReactNode }) {
  const p = useMotionValue(0)
  const [state, setState] = useState<'idle' | 'holding' | 'done'>('idle')
  const anim = useRef<{ stop: () => void } | null>(null)
  const scaleX = useTransform(p, v => v)
  const start = () => { if (state === 'done') return; setState('holding'); anim.current = animate(p, 1, { duration: (ms / 1000) * (1 - p.get()), ease: 'linear', onComplete: () => { setState('done'); setTimeout(onDone, 500) } }) }
  const cancel = () => { if (state !== 'holding') return; anim.current?.stop(); setState('idle'); animate(p, 0, { duration: 0.25, ease: EASE_OUT }) }
  return (
    <motion.button onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel} animate={{ scale: state === 'holding' ? 0.98 : 1 }}
      className="btn" style={{ background: state === 'done' ? 'var(--ink)' : 'var(--brand-900)', color: '#fff', touchAction: 'none', userSelect: 'none' }}>
      <motion.span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #008000, #2fb52f)', transformOrigin: 'left', scaleX, opacity: state === 'done' ? 0 : 1 }} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={state} className="row" style={{ position: 'relative', gap: 8 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
          {state === 'done' ? <><Check size={18} strokeWidth={3} color="var(--lime)" />{doneLabel}</> : state === 'holding' ? holdingLabel : <>{icon}{label}</>}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

/** Uber search border highlight: a soft light traces the card's border to pull the eye. */
export function BorderTrace({ children, radius = 28, style }: { children: ReactNode; radius?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', borderRadius: radius, padding: 2, overflow: 'hidden', ...style }}>
      <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', left: '50%', top: '50%', width: '160%', aspectRatio: '1', marginLeft: '-80%', marginTop: '-80%', background: 'conic-gradient(from 0deg, transparent 0 70%, rgba(200,245,96,0.9) 82%, #008000 90%, transparent 100%)' }} />
      <div style={{ position: 'relative', borderRadius: radius - 2, background: '#fff' }}>{children}</div>
    </div>
  )
}

/** Duolingo-style toast: springs up with a slight overshoot. */
export function Toast({ text, show, top }: { text: string | null; show: boolean; top?: boolean }) {
  return (
    <AnimatePresence>{show && text && (
      <motion.div key={text} initial={{ y: top ? -40 : 40, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: top ? -30 : 30, opacity: 0, scaleX: 0.6 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.38 }} className="row"
        style={{ position: 'absolute', left: 16, right: 16, [top ? 'top' : 'bottom']: top ? 'calc(var(--sat) + 4px)' : 'calc(var(--sab) + 84px)', zIndex: 90, padding: '12px 14px', borderRadius: 16, background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 14, justifyContent: 'center' }}>
        <Check size={16} color="var(--lime)" strokeWidth={3} />{text}
      </motion.div>
    )}</AnimatePresence>
  )
}

/** Airbnb / Revolut tactile pills: press squashes, the active fill slides between options on a spring. */
export function Tactile({ options, value, onChange, id, green, grow = true }: { options: string[]; value: string; onChange: (v: string) => void; id: string; green?: boolean; grow?: boolean }) {
  return (
    <div className="row" style={{ gap: 8 }}>
      {options.map(o => (
        <motion.button key={o} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', duration: 0.3, bounce: 0.4 }} onClick={() => onChange(o)}
          className="chip" style={{ position: 'relative', flex: grow ? 1 : 'none', background: 'var(--surface)', color: value === o ? '#fff' : 'var(--ink)', transition: 'color 200ms', boxShadow: value === o ? 'none' : 'inset 0 0 0 1px var(--line-2)' }}>
          {value === o && <motion.span layoutId={'pill-' + id} transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }} style={{ position: 'absolute', inset: 0, borderRadius: 12, background: green ? 'var(--brand)' : 'var(--ink)' }} />}
          <span style={{ position: 'relative' }}>{o}</span>
        </motion.button>
      ))}
    </div>
  )
}

/** Rolling digits: each changed character slides in (ticker). */
export function Ticker({ value, style }: { value: string; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', ...style }}>
      {value.split('').map((ch, i) => (
        <AnimatePresence mode="popLayout" initial={false} key={i}>
          <motion.span key={ch + i} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ type: 'spring', duration: 0.35, bounce: 0.25 }} style={{ display: 'inline-block' }}>{ch}</motion.span>
        </AnimatePresence>
      ))}
    </span>
  )
}

/** A small picker / detail sheet used wherever a row needs to open something (every element has a purpose). */
export function ListSheet({ open, onClose, title, items, selected, onPick, action }: { open: boolean; onClose: () => void; title: string; items: { t: string; sub?: string; toggle?: boolean }[]; selected?: string; onPick?: (t: string) => void; action?: { label: string; onClick: () => void } }) {
  const [on, setOn] = useState<Record<string, boolean>>({})
  return (
    <Sheet open={open} onClose={onClose} z={70}>
      <span className="t-title2">{title}</span>
      <div className="col" style={{ marginTop: 10 }}>
        {items.map(it => (
          <motion.button key={it.t} whileTap={{ scale: 0.98 }} className="row" style={{ padding: '13px 0', textAlign: 'left', borderBottom: '1px solid var(--line)', width: '100%' }}
            onClick={() => { if (it.toggle) setOn(o => ({ ...o, [it.t]: !(o[it.t] ?? true) })); else if (onPick) { onPick(it.t); onClose() } }}>
            <span className="col grow"><span className="t-callout">{it.t}</span>{it.sub && <span className="t-cap muted" style={{ fontSize: 12 }}>{it.sub}</span>}</span>
            {it.toggle ? <span className={'switch' + ((on[it.t] ?? true) ? ' on' : '')} /> : selected === it.t ? <Check size={18} color="var(--brand)" /> : null}
          </motion.button>
        ))}
      </div>
      {action && <Btn kind="secondary" style={{ marginTop: 14 }} onClick={action.onClick}>{action.label}</Btn>}
      <Btn style={{ marginTop: 8 }} onClick={onClose}>Done</Btn>
    </Sheet>
  )
}
