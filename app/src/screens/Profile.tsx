import { useState } from 'react'
import { motion } from 'motion/react'
import { GearSix, ShareFat, PencilSimple, CaretLeft, CaretRight, Camera, Flag, Prohibit } from '@phosphor-icons/react'
import { useStore } from '../store'
import { fullName, levelFor, LEVELS, ACHIEVEMENTS, PEOPLE, money } from '../data'
import { Avatar, LevelBadge, AchievementBadge, Button, CountUp, haptic } from '../ui'
import { WalletCard } from './Wallet'

export function Profile() {
  const s = useStore()
  const p = s.me
  const L = levelFor(p.askapades)
  const copy = () => { navigator.clipboard?.writeText(`https://askapade.com/@${p.username}`).catch(() => {}); s.showToast('Profile link copied') }
  return (
    <div className="screen screen-pad-top">
      <div className="profile-top-actions">
        <button className="icon-btn" aria-label="Settings" onClick={() => s.push({ name: 'settings' })}><GearSix size={22} weight="bold" /></button>
      </div>
      <div className="profile-head">
        <Avatar p={p} size={96} />
        <h1 className="t-title1">{fullName(p)}</h1>
        <span className="t-callout t-quiet">@{p.username}</span>
      </div>
      <div className="stat-row">
        <div className="stat"><span className="t-title2 t-num"><CountUp value={p.rating} decimals={1} duration={0.8} /></span><span className="t-caption t-quiet">{p.reviews} reviews</span></div>
        <div className="stat"><span className="t-title2 t-num"><CountUp value={p.askapades} duration={0.8} /></span><span className="t-caption t-quiet">askapades</span></div>
        <button className="stat" onClick={() => s.push({ name: 'levels' })}>
          <LevelBadge level={L.name} size={34} />
          <span className="t-caption">{L.name}</span>
        </button>
      </div>
      <div className="row-2 profile-btns">
        <Button kind="secondary" icon={<PencilSimple size={18} weight="bold" />} onClick={() => s.push({ name: 'edit-profile' })}>Edit profile</Button>
        <Button kind="secondary" icon={<ShareFat size={18} weight="bold" />} onClick={copy}>Share profile</Button>
      </div>

      <button className="section-head" onClick={() => s.push({ name: 'levels' })}>
        <span className="t-title3">Badges</span><CaretRight size={16} weight="bold" />
      </button>
      <div className="badge-row">
        {ACHIEVEMENTS.filter(a => a.earned || a.id === 'verified').map((a, i) => (
          <motion.span key={a.id} className="badge-cell" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.04 }}>
            <AchievementBadge id={a.id} earned={a.id === 'verified' ? p.verified : a.earned} size={56} />
            <span className="t-micro">{a.name}</span>
          </motion.span>
        ))}
      </div>

      <button className="section-head" onClick={() => s.push({ name: 'wallet' })}>
        <span className="t-title3">Wallet</span><CaretRight size={16} weight="bold" />
      </button>
      <button className="wallet-mini" onClick={() => s.push({ name: 'wallet' })} aria-label="Open wallet">
        <WalletCard balance={s.balance} small />
      </button>
    </div>
  )
}

export function OtherProfile({ username }: { username: string }) {
  const s = useStore()
  const p = PEOPLE.find(x => x.username === username) ?? PEOPLE[0]
  const L = levelFor(p.askapades)
  return (
    <div className="screen">
      <Header title="" />
      <div className="profile-head">
        <Avatar p={p} size={96} />
        <h1 className="t-title1">{fullName(p)}</h1>
        <span className="t-callout t-quiet">@{p.username}</span>
      </div>
      <div className="stat-row">
        <div className="stat"><span className="t-title2 t-num">{p.rating.toFixed(1)}</span><span className="t-caption t-quiet">{p.reviews} reviews</span></div>
        <div className="stat"><span className="t-title2 t-num">{p.askapades}</span><span className="t-caption t-quiet">askapades</span></div>
        <div className="stat"><LevelBadge level={L.name} size={34} /><span className="t-caption">{L.name}</span></div>
      </div>
      <div className="badge-row">
        {ACHIEVEMENTS.slice(0, 4).map(a => (
          <span key={a.id} className="badge-cell"><AchievementBadge id={a.id} earned size={56} /><span className="t-micro">{a.name}</span></span>
        ))}
        {p.verified && <span className="badge-cell"><AchievementBadge id="verified" earned size={56} /><span className="t-micro">Verified</span></span>}
      </div>
      <div className="menu-list inset">
        <button onClick={() => s.showToast('Thanks for reporting!')}><Flag size={22} weight="bold" />Report user</button>
        <button className="is-danger" onClick={() => { s.setBlocked(b => [...b, p]); s.showToast('User blocked') }}><Prohibit size={22} weight="bold" />Block</button>
      </div>
    </div>
  )
}

export function Header({ title, dark, right }: { title: string; dark?: boolean; right?: React.ReactNode }) {
  const s = useStore()
  return (
    <header className={`nav-head ${dark ? 'is-dark' : ''}`}>
      <button className="icon-btn" aria-label="Back" onClick={s.pop}><CaretLeft size={22} weight="bold" /></button>
      <h1 className="t-title3">{title}</h1>
      <span className="nav-head-right">{right}</span>
    </header>
  )
}

/** Levels: badges, progress, achievements */
export function Levels() {
  const s = useStore()
  const n = s.me.askapades
  const L = levelFor(n)
  const i = LEVELS.findIndex(l => l.name === L.name)
  const next = LEVELS[i + 1]
  const pct = next ? (n - L.at) / (next.at - L.at) : 1
  return (
    <div className="screen">
      <Header title="Levels" />
      <div className="level-hero">
        <LevelBadge level={L.name} size={112} />
        <h2 className="t-title1">{L.name}</h2>
        {next && (
          <>
            <div className="level-bar"><motion.span initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} style={{ background: L.color }} /></div>
            <span className="t-callout"><b className="t-num">{next.at - n}</b> askapades to {next.name}</span>
          </>
        )}
      </div>
      <div className="ladder">
        {LEVELS.map((l, k) => (
          <div key={l.name} className={`ladder-step ${k <= i ? 'is-on' : ''}`} style={{ ['--h' as string]: `${40 + k * 18}px`, ['--c' as string]: l.color }}>
            <LevelBadge level={l.name} size={44} muted={k > i} />
            <span className="ladder-bar" />
            <span className="t-micro">{l.name}</span>
            <span className="t-micro t-quiet t-num">{l.at}</span>
          </div>
        ))}
      </div>
      <h3 className="t-title3 section-label">Badges</h3>
      <div className="badge-grid">
        {ACHIEVEMENTS.map(a => {
          const earned = a.id === 'verified' ? s.me.verified : a.earned
          return (
            <span key={a.id} className={`badge-cell ${earned ? '' : 'is-locked'}`}>
              <AchievementBadge id={a.id} earned={earned} size={64} />
              <span className="t-micro">{a.name}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function EditProfile() {
  const s = useStore()
  const [first, setFirst] = useState(s.me.first)
  const [username, setUsername] = useState(s.me.username)
  const taken = username === 'mayak'
  return (
    <div className="screen">
      <Header title="Edit profile" />
      <div className="form">
        <button className="photo-pick" onClick={() => { s.setMe(m => ({ ...m, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&h=240&fit=crop&crop=faces' })); haptic() }}>
          <Avatar p={s.me} size={96} />
          <span className="photo-pick-cam"><Camera size={16} weight="fill" /></span>
        </button>
        <label className="field-label"><span className="t-caption t-quiet">First name</span>
          <input className="field-plain" value={first} onChange={e => setFirst(e.target.value)} /></label>
        <label className="field-label"><span className="t-caption t-quiet">Username</span>
          <input className="field-plain" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} /></label>
        {taken && <p className="t-caption field-error">Username taken. Try again.</p>}
        <Button full disabled={!first || taken} onClick={() => { s.setMe(m => ({ ...m, first, username })); s.pop(); s.showToast('Profile saved') }}>Save</Button>
      </div>
    </div>
  )
}

export const _m = money
