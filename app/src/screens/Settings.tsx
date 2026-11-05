import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Bell, Wallet as WalletIcon, IdentificationCard, Lifebuoy, Prohibit, ChatCircleDots, Megaphone, FileText, ShieldCheck,
  SignOut, Trash, CaretRight, Plus, X, Moon, BellSlash, UserCircle, ScanSmiley, CheckCircle, ArrowClockwise, Hourglass,
  PersonSimpleRun, CurrencyGbp, Warning, ShieldWarning, Question, Handshake,
} from '@phosphor-icons/react'
import { useStore } from '../store'
import { fullName } from '../data'
import { Button, Avatar, Empty, Modal, haptic, VerifiedMark, Confetti, softSpring, Icon3D } from '../ui'
import { Header } from './Profile'

/** A designed screen, not iOS defaults */
export function Settings() {
  const s = useStore()
  const [confirm, setConfirm] = useState<null | 'logout' | 'delete'>(null)
  const Row = ({ icon, label, to, value }: { icon: React.ReactNode; label: string; to?: () => void; value?: React.ReactNode }) => (
    <button className="set-row" onClick={to}>
      <span className="set-icon">{icon}</span>
      <span className="t-callout set-label">{label}</span>
      {value}
      <CaretRight size={16} weight="bold" className="set-caret" />
    </button>
  )
  return (
    <div className="screen">
      <Header title="Settings" />
      <button className="set-me" onClick={() => s.push({ name: 'edit-profile' })}>
        <Avatar p={s.me} size={52} />
        <span><span className="t-title3">{fullName(s.me)}</span><br /><span className="t-caption t-quiet">@{s.me.username}</span></span>
        <CaretRight size={16} weight="bold" className="set-caret" />
      </button>
      <div className="set-group">
        <Row icon={<Bell size={20} weight="fill" />} label="Notifications" to={() => s.push({ name: 'notifications' })} value={<span className="t-caption t-quiet">{s.mute ? 'Muted' : s.quiet.on ? 'Quiet hours' : ''}</span>} />
        <Row icon={<WalletIcon size={20} weight="fill" />} label="Wallet" to={() => s.push({ name: 'wallet' })} />
        <Row icon={<IdentificationCard size={20} weight="fill" />} label="ID verification" to={() => s.push({ name: 'verify' })} value={<VerifiedMark on={s.me.verified} size={18} />} />
        <Row icon={<Lifebuoy size={20} weight="fill" />} label="Lifeline" to={() => s.push({ name: 'lifeline' })} value={<span className="t-caption t-quiet t-num">{s.lifeline.length}/5</span>} />
        <Row icon={<Prohibit size={20} weight="bold" />} label="Blocked" to={() => s.push({ name: 'blocked' })} />
      </div>
      <div className="set-group">
        <Row icon={<ChatCircleDots size={20} weight="fill" />} label="Contact us" to={() => s.push({ name: 'contact' })} />
        <Row icon={<Megaphone size={20} weight="fill" />} label="App feedback" to={() => s.push({ name: 'contact' })} />
      </div>
      <div className="set-group">
        <Row icon={<FileText size={20} weight="fill" />} label="Terms of Service" />
        <Row icon={<ShieldCheck size={20} weight="fill" />} label="Privacy Policy" />
      </div>
      <div className="set-group">
        <button className="set-row" onClick={() => setConfirm('logout')}><span className="set-icon"><SignOut size={20} weight="bold" /></span><span className="t-callout set-label">Log out</span></button>
        <button className="set-row is-danger" onClick={() => setConfirm('delete')}><span className="set-icon"><Trash size={20} weight="fill" /></span><span className="t-callout set-label">Delete account</span></button>
      </div>

      <Modal open={confirm === 'logout'} onClose={() => setConfirm(null)} title="Log out?" icon={<span className="modal-glyph"><SignOut size={32} weight="bold" /></span>}>
        <div className="modal-actions">
          <Button full onClick={() => setConfirm(null)}>Stay logged in</Button>
          <button className="link-quiet t-callout" onClick={() => { setConfirm(null); s.setSignedUp(false); s.reset() }}>Log out</button>
        </div>
      </Modal>
      <Modal open={confirm === 'delete'} onClose={() => setConfirm(null)} title="Delete account?" icon={<span className="modal-glyph is-danger"><Trash size={32} weight="fill" /></span>}>
        <p className="t-body modal-note">Note: your £{s.balance} balance must be withdrawn first.</p>
        <div className="modal-actions">
          <Button full onClick={() => setConfirm(null)}>Keep account</Button>
          <Button full kind="danger" onClick={() => setConfirm(null)}>Delete account</Button>
        </div>
      </Modal>
    </div>
  )
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'is-on' : ''}`} onClick={() => { onChange(!on); haptic() }}>
      <motion.span className="switch-knob" layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} />
    </button>
  )
}

export function Notifications() {
  const s = useStore()
  return (
    <div className="screen">
      <Header title="Notifications" />
      <div className="set-group">
        <div className="set-row"><span className="set-icon"><BellSlash size={20} weight="fill" /></span><span className="t-callout set-label">Mute</span><Switch label="Mute" on={s.mute} onChange={s.setMute} /></div>
        <div className="set-row"><span className="set-icon"><Moon size={20} weight="fill" /></span><span className="t-callout set-label">Quiet hours</span><Switch label="Quiet hours" on={s.quiet.on} onChange={on => s.setQuiet(q => ({ ...q, on }))} /></div>
        <AnimatePresence>
          {s.quiet.on && (
            <motion.div className="quiet-hours" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <label><span className="t-caption t-quiet">From</span><input type="time" value={s.quiet.from} onChange={e => s.setQuiet(q => ({ ...q, from: e.target.value }))} className="t-title3 t-num" /></label>
              <span className="quiet-arc" aria-hidden><Moon size={18} weight="fill" /></span>
              <label><span className="t-caption t-quiet">To</span><input type="time" value={s.quiet.to} onChange={e => s.setQuiet(q => ({ ...q, to: e.target.value }))} className="t-title3 t-num" /></label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Up to 5 trusted contacts; sharing on and off; remove */
export function Lifeline() {
  const s = useStore()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const sharing = s.lifeline.some(l => l.sharing)
  return (
    <div className="screen">
      <Header title="Lifeline" />
      <div className={`life-hero ${sharing ? 'is-live' : ''}`}>
        <span className="life-ring"><Lifebuoy size={36} weight="duotone" /></span>
        <span className="t-title3">{sharing ? 'Sharing your live location' : 'Not sharing'}</span>
      </div>
      <ul className="life-list">
        <AnimatePresence>
          {s.lifeline.map((l, i) => (
            <motion.li key={l.name} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}>
              <span className="life-initials">{l.name.split(' ').map(w => w[0]).join('')}</span>
              <span className="life-mid"><span className="t-callout">{l.name}</span><span className="t-caption t-quiet t-num">{l.phone}</span></span>
              <Switch label={`Share with ${l.name}`} on={l.sharing} onChange={v => s.setLifeline(ls => ls.map((x, k) => (k === i ? { ...x, sharing: v } : x)))} />
              <button className="icon-btn sm" aria-label={`Remove ${l.name}`} onClick={() => s.setLifeline(ls => ls.filter((_, k) => k !== i))}><X size={16} weight="bold" /></button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {s.lifeline.length === 0 && !adding && <Empty icon={<Lifebuoy size={30} weight="duotone" />} />}
      <AnimatePresence>
        {adding && (
          <motion.div className="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <input className="field-plain" placeholder="Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            <input className="field-plain" placeholder="Phone number" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            <Button full disabled={!name || phone.length < 8} onClick={() => { s.setLifeline(ls => [...ls, { name, phone, sharing: true }]); setAdding(false); setName(''); setPhone(''); s.showToast('Invite sent') }}>Send invite</Button>
          </motion.div>
        )}
      </AnimatePresence>
      {!adding && s.lifeline.length < 5 && (
        <div className="form"><Button full kind="secondary" icon={<Plus size={18} weight="bold" />} onClick={() => setAdding(true)}>Add contact</Button></div>
      )}
    </div>
  )
}

export function Blocked() {
  const s = useStore()
  return (
    <div className="screen">
      <Header title="Blocked" />
      {s.blocked.length === 0 ? <Empty icon={<Prohibit size={30} weight="duotone" />} /> : (
        <ul className="life-list">
          {s.blocked.map(p => (
            <li key={p.username}>
              <Avatar p={p} size={40} />
              <span className="life-mid"><span className="t-callout">{fullName(p)}</span></span>
              <Button kind="secondary" className="btn-sm" onClick={() => { s.setBlocked(b => b.filter(x => x.username !== p.username)); s.showToast('User unblocked') }}>Unblock</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Entry, waiting, verified, try again */
export function Verification() {
  const s = useStore()
  const [step, setStep] = useState<'entry' | 'waiting' | 'verified' | 'retry'>(s.me.verified ? 'verified' : 'entry')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (step !== 'waiting') return
    const t = setTimeout(() => {
      if (attempt === 0) setStep('retry')
      else { setStep('verified'); s.setMe(m => ({ ...m, verified: true })); haptic() }
    }, 2800)
    return () => clearTimeout(t)
  }, [step])
  return (
    <div className="screen is-dark">
      <Header title="" dark />
      <div className="verify">
        <AnimatePresence mode="wait">
          {step === 'entry' && (
            <motion.div key="e" className="verify-step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="verify-scene">
                <motion.span className="verify-doc" animate={{ rotate: [-6, -3, -6] }} transition={{ duration: 3, repeat: Infinity }}><IdentificationCard size={64} weight="duotone" /></motion.span>
                <motion.span className="verify-face" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.6, repeat: Infinity }}><ScanSmiley size={44} weight="duotone" /></motion.span>
              </div>
              <h2 className="t-title1">Verify ID</h2>
              <p className="t-body on-dark-quiet">To keep everyone on askapade safe. It takes 2 minutes.</p>
              <Button full onClick={() => setStep('waiting')}>Verify ID</Button>
            </motion.div>
          )}
          {step === 'waiting' && (
            <motion.div key="w" className="verify-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <motion.span className="verify-hour" animate={{ rotate: [0, 180, 180, 360] }} transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}><Hourglass size={56} weight="duotone" /></motion.span>
              <h2 className="t-title1">Checking your ID</h2>
              <div className="verify-dots"><span /><span /><span /></div>
            </motion.div>
          )}
          {step === 'retry' && (
            <motion.div key="r" className="verify-step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <span className="verify-warn"><Warning size={56} weight="duotone" /></span>
              <h2 className="t-title1">Photo unclear</h2>
              <p className="t-body on-dark-quiet">Try again in good light.</p>
              <Button full icon={<ArrowClockwise size={18} weight="bold" />} onClick={() => { setAttempt(1); setStep('waiting') }}>Try again</Button>
            </motion.div>
          )}
          {step === 'verified' && (
            <motion.div key="v" className="verify-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Confetti run />
              <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}>
                <VerifiedMark on size={120} />
              </motion.span>
              <h2 className="t-title1">Verified!</h2>
              <Button full onClick={s.pop}>Done</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Timed prompts at 6, 12 and 18 hours; paused at 24 hours */
export function VerifyPrompt() {
  const s = useStore()
  const paused = (window as any).__paused
  return (
    <Modal open={s.verifyPrompt} onClose={paused ? undefined : () => s.setVerifyPrompt(false)}
      title={paused ? 'Account paused' : 'Verify your ID'} scatter={['key', 'home', 'heart', 'document']}
      icon={<span className="modal-glyph is-ink"><IdentificationCard size={34} weight="duotone" /></span>}>
      <p className="t-body modal-note">{paused ? 'Verify your ID to keep using askapade.' : 'To keep everyone on askapade safe.'}</p>
      <div className="modal-actions">
        <Button full onClick={() => { s.setVerifyPrompt(false); s.push({ name: 'verify' }) }}>Verify ID</Button>
        {!paused && <button className="link-quiet t-callout" onClick={() => s.setVerifyPrompt(false)}>Not now</button>}
      </div>
    </Modal>
  )
}

/** A clear route from chat to Contact us, and a “We’re on it” state */
export function Contact() {
  const s = useStore()
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState<string | null>(null)
  const topics = [
    { t: 'Didn’t arrive', i: <PersonSimpleRun size={22} weight="bold" /> },
    { t: 'Payout not released', i: <CurrencyGbp size={22} weight="bold" /> },
    { t: 'Ask incomplete', i: <Handshake size={22} weight="bold" /> },
    { t: 'Harm reported', i: <ShieldWarning size={22} weight="bold" /> },
    { t: 'Payment disputed', i: <WalletIcon size={22} weight="bold" /> },
    { t: 'Suspected fraud', i: <Warning size={22} weight="bold" /> },
    { t: 'Something else', i: <Question size={22} weight="bold" /> },
  ]
  return (
    <div className="screen">
      <Header title="Contact us" />
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="s" className="on-it" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={softSpring}>
            <motion.span className="on-it-mark" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}><CheckCircle size={64} weight="fill" /></motion.span>
            <h2 className="t-title1">We’re on it</h2>
            <p className="t-body t-quiet">We’ll reply in your Chats within 24 hours.</p>
            <Button full onClick={s.pop}>Done</Button>
          </motion.div>
        ) : (
          <motion.div key="f" className="form">
            <div className="topic-grid">
              {topics.map(x => (
                <button key={x.t} className={`topic ${topic === x.t ? 'is-on' : ''}`} onClick={() => setTopic(x.t)}>{x.i}<span className="t-callout">{x.t}</span></button>
              ))}
            </div>
            <textarea className="field-plain" rows={3} placeholder="Add a note (optional)" />
            <Button full disabled={!topic} onClick={() => setSent(true)}>Send</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const _x = { UserCircle, Icon3D }
