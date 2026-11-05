import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { AnimatePresence, motion, animate, useMotionValue, useTransform } from 'motion/react'
import {
  Coin, Check, Plant, ArrowCounterClockwise, GraduationCap, Star, Medal, Rocket, Megaphone, Handshake,
  ChatTeardropText, SealCheck, Stack, StarFour, Crown,
} from '@phosphor-icons/react'
import { icon3d, iconFlat, iconById, money, span, type Ask, type Currency, type Person, fullName, initials, LEVELS, type Level } from './data'

/* ---------- Motion presets ---------- */
export const spring = { type: 'spring', stiffness: 420, damping: 34 } as const
export const softSpring = { type: 'spring', stiffness: 260, damping: 26 } as const
export const haptic = () => { try { navigator.vibrate?.(10) } catch { /* no-op */ } }

/* ---------- Clock ---------- */
export function useNow(every = 1000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), every); return () => clearInterval(t) }, [every])
  return now
}

/* ---------- Buttons ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'danger' | 'secondary' | 'link'; full?: boolean; icon?: ReactNode }
export function Button({ kind = 'primary', full, icon, className = '', children, onClick, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`btn btn-${kind} ${full ? 'btn-full' : ''} ${className}`}
      onClick={e => { if (kind === 'primary') haptic(); onClick?.(e) }}
    >
      {icon}{children}
    </button>
  )
}

/* ---------- Icons ---------- */
export function Icon3D({ id, size = 48, className = '' }: { id: string; size?: number; className?: string }) {
  return <img src={icon3d(id)} width={size} height={size} alt="" draggable={false} className={`icon3d ${className}`} />
}

/** Flat (2D) icon in a white circle: maps only */
export function FlatMarker({ id, size = 40, done }: { id: string; size?: number; done?: boolean }) {
  return (
    <span className={`flat-marker ${done ? 'is-done' : ''}`} style={{ width: size, height: size }}>
      <img src={iconFlat(iconById(id).id)} width={size * 0.58} height={size * 0.58} alt="" draggable={false} />
    </span>
  )
}

export function CoinIcon({ size = 14 }: { size?: number }) {
  return <Coin size={size} weight="fill" className="coin" aria-hidden />
}

/** Fee with any finder’s fee next to it: £30 + £5 (coin) */
export function Fee({ fee, finder, currency, size = 'md' }: { fee: number; finder: number; currency: Currency; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`fee fee-${size}`}>
      <span className="t-num">{money(currency, fee)}</span>
      {finder > 0 && (
        <span className="fee-finder" aria-label={`plus ${money(currency, finder)} finder’s fee`}>
          <span className="fee-plus">+</span>
          <span className="t-num">{money(currency, finder)}</span>
          <CoinIcon size={size === 'lg' ? 18 : 14} />
        </span>
      )}
    </span>
  )
}

/* ---------- People ---------- */
export function VerifiedMark({ on, size = 18 }: { on: boolean; size?: number }) {
  return (
    <span className={`verified ${on ? 'on' : 'off'}`} style={{ width: size, height: size }} role="img" aria-label={on ? 'Verified' : 'Not verified'}>
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 1.5l2.4 1.9 3-.3 1.1 2.8 2.8 1.1-.3 3 1.9 2.4-1.9 2.4.3 3-2.8 1.1-1.1 2.8-3-.3L12 22.5l-2.4-1.9-3 .3-1.1-2.8-2.8-1.1.3-3L1.1 12l1.9-2.4-.3-3 2.8-1.1 1.1-2.8 3 .3z" />
        <path d="M7.6 12.3l2.9 2.9 5.9-6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function Avatar({ p, size = 44, badge = true }: { p: Person; size?: number; badge?: boolean }) {
  return (
    <span className="avatar" style={{ width: size, height: size }}>
      {p.photo
        ? <img src={p.photo} alt="" width={size} height={size} />
        : <span className="avatar-initials" style={{ fontSize: size * 0.36 }}>{initials(p)}</span>}
      {badge && <span className="avatar-badge"><VerifiedMark on={p.verified} size={Math.max(14, size * 0.32)} /></span>}
    </span>
  )
}

export function Rating({ p }: { p: Person }) {
  return (
    <span className="rating t-caption">
      <Star size={13} weight="fill" aria-hidden />
      <span className="t-num">{p.rating.toFixed(1)}</span>
      <span className="t-quiet">({p.reviews})</span>
    </span>
  )
}

export const Name = ({ p }: { p: Person }) => <>{fullName(p)}</>

/* ---------- Badges: one scalloped family for levels and achievements ---------- */
const SEAL = (() => {
  const pts: string[] = []
  const n = 12
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2
    const r = i % 2 ? 44 : 50
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`)
  }
  return pts.join(' ')
})()

const LEVEL_GLYPH = { Newbie: Plant, Regular: ArrowCounterClockwise, Apprentice: GraduationCap, Expert: Star, Veteran: Medal }

export function Seal({ color, size, children, muted }: { color: string; size: number; children: ReactNode; muted?: boolean }) {
  return (
    <span className={`seal ${muted ? 'is-muted' : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="-4 -4 108 108" width={size} height={size} aria-hidden>
        <polygon points={SEAL} fill={muted ? '#E4E4E1' : color} strokeLinejoin="round" stroke={muted ? '#E4E4E1' : color} strokeWidth="8" />
        <polygon points={SEAL} fill="none" stroke="#fff" strokeOpacity={muted ? 0 : 0.55} strokeWidth="2" transform="translate(50 50) scale(.84) translate(-50 -50)" strokeLinejoin="round" />
        <circle cx="50" cy="36" r="34" fill="#fff" opacity={muted ? 0 : 0.1} />
      </svg>
      <span className="seal-glyph">{children}</span>
    </span>
  )
}

export function LevelBadge({ level, size = 44, muted }: { level: Level; size?: number; muted?: boolean }) {
  const L = LEVELS.find(l => l.name === level)!
  const G = LEVEL_GLYPH[level]
  return (
    <Seal color={L.color} size={size} muted={muted}>
      <G size={size * 0.42} weight="bold" color={muted ? '#6B6B6B' : '#fff'} />
    </Seal>
  )
}

const ACH_GLYPH: Record<string, typeof Star> = {
  'first-askapade': Handshake, 'first-ask': Megaphone, 'first-finder': Coin, 'first-review': ChatTeardropText,
  verified: SealCheck, five: Stack, 'five-finder': Rocket, 'ten-stars': StarFour, 'two-fifty': Crown,
}
export function AchievementBadge({ id, earned, size = 56 }: { id: string; earned: boolean; size?: number }) {
  const G = ACH_GLYPH[id] ?? Star
  return (
    <Seal color="var(--ink)" size={size} muted={!earned}>
      <G size={size * 0.42} weight="fill" color={earned ? 'var(--mist)' : '#6B6B6B'} />
    </Seal>
  )
}

export function LevelChip({ level }: { level: Level }) {
  return (
    <span className="level-chip t-caption">
      <LevelBadge level={level} size={20} />
      {level}
    </span>
  )
}

/* ---------- Ask card: identical in Nearby, chat and share cards ---------- */
export function AskCard({ ask, now, onClick, compact, children }: { ask: Ask; now: number; onClick?: () => void; compact?: boolean; children?: ReactNode }) {
  const left = ask.endsAt - now
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`ask-card ${compact ? 'is-compact' : ''} ${ask.state === 'done' ? 'is-done' : ''}`} onClick={onClick}>
      <Icon3D id={ask.icon} size={compact ? 44 : 56} className="ask-card-icon" />
      <div className="ask-card-body">
        <div className="ask-card-top">
          <Fee fee={ask.fee} finder={ask.finder} currency={ask.currency} />
          <span className="ask-card-meta t-caption">
            <span>{ask.km < 1 ? `${Math.round(ask.km * 1000)} m` : `${ask.km.toFixed(1)} km`}</span>
            <span className={left < 3600_000 ? 'is-urgent' : ''}>{ask.state === 'done' ? 'Completed' : `${span(left)} left`}</span>
          </span>
        </div>
        <p className="ask-card-text">{ask.text}</p>
        {children}
      </div>
    </Tag>
  )
}

/* ---------- Count up ---------- */
export function CountUp({ value, prefix = '', decimals = 0, duration = 1.2, className = '' }: { value: number; prefix?: string; decimals?: number; duration?: number; className?: string }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, v => `${prefix}${v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`)
  useEffect(() => { const c = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] }); return () => c.stop() }, [value])
  return <motion.span className={className}>{text}</motion.span>
}

/* ---------- Sheets and modals ---------- */
export function Sheet({ open, onClose, children, dark, className = '', label }: { open: boolean; onClose?: () => void; children: ReactNode; dark?: boolean; className?: string; label: string }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog" aria-label={label}
            className={`sheet ${dark ? 'is-dark' : ''} ${className}`}
            initial={{ y: '100%', scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: '100%', scale: 0.98 }}
            transition={spring}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => { if (onClose && (i.offset.y > 120 || i.velocity.y > 600)) onClose() }}
          >
            <span className="sheet-grabber" aria-hidden />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/** Centre modal with icons scattered around one clear choice */
export function Modal({ open, onClose, icon, scatter = [], title, children, label }: { open: boolean; onClose?: () => void; icon: ReactNode; scatter?: string[]; title: string; children: ReactNode; label?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div role="dialog" aria-label={label ?? title} className="modal"
            initial={{ opacity: 0, scale: 0.86, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 10 }} transition={softSpring}>
            <div className="modal-hero">
              {scatter.map((id, i) => (
                <motion.span key={id + i} className={`modal-scatter s${i}`}
                  initial={{ opacity: 0, scale: 0.3, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: [-8, 10, -6, 8][i % 4] }}
                  transition={{ ...softSpring, delay: 0.08 + i * 0.05 }}>
                  <Icon3D id={id} size={34} />
                </motion.span>
              ))}
              <motion.span className="modal-icon" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ ...softSpring, delay: 0.05 }}>{icon}</motion.span>
            </div>
            <h2 className="t-title2 modal-title">{title}</h2>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/** Toast that bounces in from the top */
export function Toast({ text, icon }: { text: string | null; icon?: ReactNode }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div className="toast" role="status"
          initial={{ y: -80, scale: 0.8, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -60, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 520, damping: 22 }}>
          <span className="toast-icon">{icon ?? <Check size={14} weight="bold" />}</span>
          <span className="t-callout">{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Empty list: one icon and the word ‘None’ */
export function Empty({ icon }: { icon: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-icon">{icon}</span>
      <span className="t-callout t-quiet">None</span>
    </div>
  )
}

/** Short-lived toast helper */
export function useToast() {
  const [text, setText] = useState<string | null>(null)
  const t = useRef<number>(0)
  const show = (s: string) => { setText(s); haptic(); clearTimeout(t.current); t.current = window.setTimeout(() => setText(null), 1800) }
  return [text, show] as const
}

/** Small "+1" burst used for completed askapades and level ups */
export function PlusOne({ show, label = '+1' }: { show: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span className="plus-one t-num" initial={{ scale: 0, y: 10, opacity: 0 }}
          animate={{ scale: [0, 1.35, 1], y: [10, -6, 0], opacity: 1 }} exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}>{label}</motion.span>
      )}
    </AnimatePresence>
  )
}

/** Confetti using Wish and Penny: celebration moments only */
export function Confetti({ run }: { run: boolean }) {
  if (!run) return null
  const bits = Array.from({ length: 36 }, (_, i) => i)
  return (
    <div className="confetti" aria-hidden>
      {bits.map(i => {
        const x = (Math.random() - 0.5) * 360, r = Math.random() * 540
        const c = ['var(--wish)', 'var(--penny)', 'var(--green)', 'var(--mist)'][i % 4]
        return (
          <motion.span key={i} className={`confetti-bit ${i % 3 === 0 ? 'is-round' : ''}`} style={{ background: c }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x, y: [0, -220 - Math.random() * 160, 420], rotate: r, opacity: [1, 1, 0] }}
            transition={{ duration: 1.8 + Math.random() * 0.6, ease: [0.2, 0.7, 0.4, 1], delay: Math.random() * 0.15 }} />
        )
      })}
    </div>
  )
}

export const distance = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`)
export { iconById, span }
