import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, animate, type PanInfo } from 'motion/react'
import { Signal, Wifi, BatteryFull, Compass, MessageSquare, Plus, Wallet, User, Check, ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
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

export function Hop({ state = 'idle', size = 120, bob = false, pop = true, sway = false }: { state?: 'idle' | 'searching' | 'happy' | 'sad' | 'wave'; size?: number; bob?: boolean; pop?: boolean; sway?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      key={state}
      initial={pop && !reduce ? { scale: 0.9, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      style={{ width: size, height: size * 140 / 160, flex: 'none' }}
    >
      <motion.img
        src={`/hop/${state}.svg`} alt="Hop" width={size} height={size * 140 / 160}
        animate={reduce ? undefined : sway ? { rotate: [0, -4, 0, 3, 0], scaleY: [1, 0.97, 1, 1.02, 1], y: [0, -3, 0, -2, 0] } : bob ? { y: [0, -6, 0] } : undefined}
        transition={sway ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : bob ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        style={state === 'wave' && !reduce ? { transformOrigin: '50% 90%' } : undefined}
      />
    </motion.div>
  )
}

export function Avatar({ who, size = 40, tick = true }: { who: string; size?: number; tick?: boolean }) {
  const p = PEOPLE[who]
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, ${p.c[0]}, ${p.c[1]})` }}>
      {p.ini}
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

export function Sheet({ open, onClose, children, scrim = true, z = 50 }: { open: boolean; onClose?: () => void; children: ReactNode; scrim?: boolean; z?: number }) {
  const onDragEnd = (_: unknown, info: PanInfo) => { if (onClose && (info.offset.y > 120 || info.velocity.y > 600)) onClose() }
  return (
    <AnimatePresence>
      {open && scrim && <motion.div key="scrim" className="scrim" style={{ zIndex: z - 10 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} />}
      {open && (
        <motion.div
          key="sheet" className="sheet" style={{ zIndex: z }}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ duration: 0.45, ease: EASE_DRAWER }}
          drag={onClose ? 'y' : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.05, bottom: 0.6 }} onDragEnd={onDragEnd}
        >
          <div className="handle" />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
  return <motion.div className="person" style={{ left: x, top: y, background: `linear-gradient(135deg, ${p.c[0]}, ${p.c[1]})` }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay }}>{p.ini[0]}</motion.div>
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
export function MapCanvas({ area = 'harrow', children }: { area?: string; children?: ReactNode }) {
  const [ref, s] = useScaleTo(390, 844, 'cover')
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, width: 390, height: 844, transform: `translateX(-50%) scale(${s})`, transformOrigin: 'top center', background: `#eceee6 url(/map/${area}.png) center/cover no-repeat` }}>
        {children}
      </div>
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
export function SwipeConfirm({ label, onDone, tone = 'dark', doneLabel = 'Done' }: { label: string; onDone: () => void; tone?: 'dark' | 'green'; doneLabel?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [done, setDone] = useState(false)
  const max = () => (track.current?.offsetWidth ?? 350) - 64
  const fillW = useTransform(x, v => v + 60)
  const textOpacity = useTransform(x, [0, 140], [1, 0])
  const finish = () => { setDone(true); animate(x, max(), { duration: 0.18, ease: EASE_OUT }); setTimeout(onDone, 900) }
  return (
    <div ref={track} style={{ position: 'relative', height: 64, borderRadius: 18, background: tone === 'dark' ? 'var(--ink)' : 'var(--brand-900)', padding: 4, overflow: 'hidden' }}>
      <motion.span style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: fillW, borderRadius: 14, background: 'linear-gradient(90deg, rgba(0,128,0,0.35), #008000)', boxShadow: '0 0 24px rgba(200,245,96,0.35)' }} />
      <motion.span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 16, opacity: textOpacity }}>{label}</motion.span>
      <motion.div drag={done ? false : 'x'} dragConstraints={track} dragElastic={0} dragMomentum={false}
        onDragEnd={() => (x.get() > max() * 0.8 ? finish() : animate(x, 0, spring))}
        style={{ x, width: 56, height: 56, borderRadius: 14, background: 'var(--lime)', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1, touchAction: 'none', color: 'var(--ink)' }}>
        <ArrowRight size={24} />
      </motion.div>
      <AnimatePresence>{done && (
        <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'grid', placeItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1aa31a, #008000 70%)', color: '#fff', fontWeight: 800, gap: 8, gridAutoFlow: 'column' }}>
          <DrawCheck size={26} /> {doneLabel}
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
