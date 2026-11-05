import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CaretLeft, Camera, NavigationArrow, Bell, Lifebuoy, Envelope, DeviceMobile, Plus, Check } from '@phosphor-icons/react'
import { useStore } from '../store'
import { LEVELS } from '../data'
import { Button, Icon3D, CoinIcon, Avatar, VerifiedMark, LevelBadge, AchievementBadge, haptic, softSpring, spring } from '../ui'
import { WalletCard } from './Wallet'

/* ---------- Intro carousel: four lines in Maname, each with an animated scene ---------- */
const LINES = ['Ask for anything.', 'Get paid for anything.', 'Connect with others.', 'Unlock your potential.']

export function Carousel() {
  const s = useStore()
  const [i, setI] = useState(0)
  const startX = useRef(0)
  const next = () => (i < 3 ? setI(i + 1) : s.setOnboarded(true))
  return (
    <div className="carousel"
      onPointerDown={e => (startX.current = e.clientX)}
      onPointerUp={e => { const d = e.clientX - startX.current; if (d < -40) next(); if (d > 40 && i > 0) setI(i - 1) }}>
      <button className="carousel-skip t-callout" onClick={() => s.setOnboarded(true)}>Skip</button>
      <div className="carousel-scene">
        <AnimatePresence mode="wait">
          <motion.div key={i} className="scene" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {i === 0 && <SceneAsk />}
            {i === 1 && <SceneWallet />}
            {i === 2 && <SceneConnect />}
            {i === 3 && <SceneLevels />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="carousel-foot">
        <AnimatePresence mode="wait">
          <motion.h1 key={i} className="t-intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{LINES[i]}</motion.h1>
        </AnimatePresence>
        <div className="dots" role="tablist">
          {LINES.map((_, k) => <button key={k} role="tab" aria-label={`Slide ${k + 1}`} aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => setI(k)} />)}
        </div>
        <Button full onClick={next}>{i < 3 ? 'Next' : 'Get started'}</Button>
      </div>
    </div>
  )
}

const pop = (d: number) => ({ initial: { opacity: 0, y: -24, scale: 0.92 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { ...softSpring, delay: d } })

function SceneAsk() {
  const banners = ['Maya K. is on her way', 'We found someone', 'New offer on your ask']
  return (
    <div className="scene-ask">
      <div className="scene-banners">
        {banners.map((b, k) => (
          <motion.div key={b} className="scene-banner" style={{ zIndex: 3 - k, ['--o' as string]: k }} {...pop(0.9 - k * 0.3)}>
            {k === 0 && <span className="scene-av"><Avatar p={{ first: 'Maya', initial: 'K', username: '', verified: true, rating: 5, reviews: 0, askapades: 0 }} size={26} /></span>}
            <span className="t-caption">{b}</span>
          </motion.div>
        ))}
      </div>
      <motion.div className="scene-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={softSpring}>
        <Icon3D id="sports-car" size={64} />
        <p className="t-title3">I need a lift to the airport</p>
        <div className="scene-card-foot">
          <span className="t-title2 t-num scene-coin">12<CoinIcon size={18} /></span>
          <span className="t-num scene-timer">00:45</span>
        </div>
      </motion.div>
    </div>
  )
}

function SceneWallet() {
  const rows = [
    { i: 'bicycle', t: 'Lent a bike for the day', a: 15 },
    { i: 'home', t: 'Helped with a move', a: 40 },
    { i: 'coins', t: 'Finder’s fee', a: 5 },
  ]
  return (
    <div className="scene-wallet">
      <motion.div initial={{ rotateX: 30, y: 20, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={softSpring}>
        <WalletCard balance={148} />
      </motion.div>
      <div className="scene-rows">
        {rows.map((r, k) => (
          <motion.div key={r.t} className="scene-row" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ ...softSpring, delay: 0.5 + k * 0.15 }}>
            <Icon3D id={r.i} size={32} />
            <span className="t-callout">{r.t}</span>
            <span className="t-num scene-plus">+{r.a}<CoinIcon size={13} /></span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SceneConnect() {
  return (
    <div className="scene-connect">
      <motion.div className="imsg is-blue imsg-card" {...pop(0.1)}>
        <span className="imsg-share">
          <Icon3D id="hammer" size={44} />
          <span className="t-callout">Help put up two shelves</span>
          <span className="t-num scene-coin">30<CoinIcon size={14} /></span>
        </span>
        <motion.span className="finder-tag t-micro" initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 6 }} transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 1.3 }}>
          +5 finder’s fee <CoinIcon size={12} />
        </motion.span>
      </motion.div>
      <motion.div className="imsg is-blue" {...pop(0.5)}>Anyone available to do this?</motion.div>
      <motion.div className="imsg is-grey" {...pop(0.95)}>I can do it!</motion.div>
    </div>
  )
}

function SceneLevels() {
  return (
    <div className="scene-levels">
      <svg className="scene-line" viewBox="0 0 300 160" preserveAspectRatio="none" aria-hidden>
        <path d="M20 140 L80 112 L140 84 L200 56 L260 28" className="track" />
        <motion.path d="M20 140 L80 112 L140 84 L200 56" className="fill" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }} />
      </svg>
      {LEVELS.map((l, k) => (
        <motion.span key={l.name} className="scene-step" style={{ left: `${6 + k * 20}%`, bottom: `${10 + k * 17}%` }}
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...softSpring, delay: k * 0.12 }}>
          <LevelBadge level={l.name} size={48} />
        </motion.span>
      ))}
      <motion.span className="scene-ach a1" initial={{ scale: 0 }} animate={{ scale: 1, rotate: -8 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 1 }}>
        <AchievementBadge id="first-askapade" earned size={72} />
      </motion.span>
      <motion.span className="scene-ach a2" initial={{ scale: 0 }} animate={{ scale: 1, rotate: 8 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 1.15 }}>
        <AchievementBadge id="verified" earned size={64} />
      </motion.span>
    </div>
  )
}

/* ---------- Sign-up: only when they first post or tap Send offer ---------- */
type Step = 'method' | 'code' | 'name' | 'location' | 'notifications' | 'lifeline'

export function Signup() {
  const s = useStore()
  const [step, setStep] = useState<Step>('method')
  const [via, setVia] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [first, setFirst] = useState('')
  const [photo, setPhoto] = useState(false)
  const [iosPrompt, setIosPrompt] = useState(false)
  const [notif, setNotif] = useState(false)
  const order: Step[] = ['method', 'code', 'name', 'location', 'notifications', 'lifeline']
  const idx = order.indexOf(step)
  const go = (n: Step) => { setStep(n); haptic() }
  const finish = () => {
    s.setMe(m => ({ ...m, first: first || m.first, photo: photo ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&h=240&fit=crop&crop=faces' : undefined }))
    s.setSignedUp(true)
    const then = s.signupFor
    s.setSignupFor(null)
    then?.()
  }
  const emailOk = /.+@.+\..+/.test(email)
  const codeError = code.length === 6 && code === '000000'

  useEffect(() => { if (code.length === 6 && !codeError) setTimeout(() => go('name'), 300) }, [code])

  return (
    <motion.div className="signup" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}>
      <div className="signup-top">
        <button className="icon-btn" aria-label="Back" onClick={() => (idx === 0 ? s.setSignupFor(null) : go(order[idx - 1]))}><CaretLeft size={22} weight="bold" /></button>
        <div className="signup-progress"><motion.span animate={{ width: `${((idx + 1) / order.length) * 100}%` }} /></div>
        <span style={{ width: 40 }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step + via} className="signup-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          {step === 'method' && (
            <>
              <h1 className="t-title1">Create an account</h1>
              <div className="seg seg-full">
                <button className={via === 'email' ? 'is-on' : ''} onClick={() => setVia('email')}><Envelope size={16} weight="bold" />Email</button>
                <button className={via === 'phone' ? 'is-on' : ''} onClick={() => setVia('phone')}><DeviceMobile size={16} weight="bold" />Phone</button>
              </div>
              {via === 'email'
                ? <input className="field-big" type="email" placeholder="Email" autoFocus value={email} onChange={e => setEmail(e.target.value)} aria-label="Email" />
                : <div className="phone-field"><span className="t-title3">+44</span><input className="field-big" inputMode="tel" placeholder="Phone number" autoFocus value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9 ]/g, ''))} aria-label="Phone number" /></div>}
              <span className="grow" />
              <Button full disabled={via === 'email' ? !emailOk : phone.replace(/\s/g, '').length < 10} onClick={() => go('code')}>{via === 'email' ? 'Email me a code' : 'Text me a code'}</Button>
            </>
          )}
          {step === 'code' && (
            <>
              <h1 className="t-title1">Enter code</h1>
              <span className="t-callout t-quiet">{via === 'email' ? email : `+44 ${phone}`}</span>
              <label className="code-boxes">
                <input inputMode="numeric" autoFocus maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} aria-label="6 digit code" />
                {Array.from({ length: 6 }).map((_, k) => (
                  <span key={k} className={`code-box ${k === code.length ? 'is-cur' : ''} ${code[k] ? 'is-filled' : ''} ${codeError ? 'is-error' : ''}`}>{code[k] ?? ''}</span>
                ))}
              </label>
              {codeError && <p className="t-caption field-error">Code incorrect. Try again.</p>}
              {via === 'email' && <p className="t-caption t-quiet">Or tap the link in your email.</p>}
            </>
          )}
          {step === 'name' && (
            <>
              <h1 className="t-title1">Add your name and photo</h1>
              <button className="photo-pick big" onClick={() => { setPhoto(true); haptic() }} aria-label="Add photo">
                {photo ? <Avatar p={{ first: first || 'S', initial: 'R', username: '', verified: false, rating: 0, reviews: 0, askapades: 0, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&h=240&fit=crop&crop=faces' }} size={112} badge={false} />
                  : <span className="photo-empty"><Camera size={34} weight="duotone" /></span>}
                <span className="photo-pick-cam"><Plus size={16} weight="bold" /></span>
              </button>
              <input className="field-big" placeholder="First name" value={first} onChange={e => setFirst(e.target.value)} aria-label="First name" />
              <span className="grow" />
              <Button full disabled={!first.trim()} onClick={() => go('location')}>Continue</Button>
            </>
          )}
          {step === 'location' && (
            <>
              <div className="perm-scene">
                <span className="perm-map" />
                {[['bicycle', 18, 26], ['coffee-cup', 70, 20], ['puppy-face', 26, 70], ['hammer', 74, 68]].map(([id, x, y], k) => (
                  <motion.span key={id as string} className="perm-ask" style={{ left: `${x}%`, top: `${y}%` }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...softSpring, delay: 0.3 + k * 0.12 }}>
                    <Icon3D id={id as string} size={40} />
                  </motion.span>
                ))}
                <span className="perm-me"><NavigationArrow size={22} weight="fill" /></span>
                <motion.span className="perm-pulse" animate={{ scale: [0.3, 1.6], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} />
              </div>
              <h1 className="t-title1">Asks come to you</h1>
              <p className="t-body t-quiet">To show you nearby asks and post yours to others nearby.</p>
              <span className="grow" />
              <Button full onClick={() => setIosPrompt(true)}>Allow location</Button>
              <IosAlert open={iosPrompt} title="Allow “askapade” to use your location?" body="To show you nearby asks and post yours to others nearby."
                options={['Always Allow', 'Allow While Using App', 'Don’t Allow']} onPick={() => { setIosPrompt(false); go('notifications') }} />
            </>
          )}
          {step === 'notifications' && (
            <>
              <div className="perm-scene is-notif">
                {['New ask 900 m away', 'We found someone', 'Payment held'].map((t, k) => (
                  <motion.div key={t} className="scene-banner" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...softSpring, delay: 0.2 + k * 0.25 }}>
                    <Bell size={16} weight="fill" /><span className="t-caption">{t}</span>
                  </motion.div>
                ))}
              </div>
              <h1 className="t-title1">Stay in the know</h1>
              <p className="t-body t-quiet">To let you know about nearby asks and updates on yours.</p>
              <span className="grow" />
              <Button full onClick={() => setNotif(true)}>Allow</Button>
              <button className="link-quiet t-callout" onClick={() => go('lifeline')}>Not now</button>
              <IosAlert open={notif} title="“askapade” Would Like to Send You Notifications" body="Notifications may include alerts, sounds and icon badges."
                options={['Allow', 'Don’t Allow']} onPick={() => { setNotif(false); go('lifeline') }} />
            </>
          )}
          {step === 'lifeline' && (
            <>
              <div className="perm-scene is-life">
                <motion.span className="life-ring big" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}><Lifebuoy size={56} weight="duotone" /></motion.span>
                {['AP', 'JM', 'RK'].map((n, k) => (
                  <motion.span key={n} className={`life-orbit o${k}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...softSpring, delay: 0.3 + k * 0.15 }}>{n}</motion.span>
                ))}
              </div>
              <h1 className="t-title1">Your Lifeline</h1>
              <p className="t-body t-quiet">Add up to 5 trusted contacts. You can send them the live details of any ask from the app.</p>
              <span className="grow" />
              <Button full icon={<Plus size={18} weight="bold" />} onClick={() => { s.showToast('Invite sent'); finish() }}>Add contacts</Button>
              <button className="link-quiet t-callout" onClick={finish}>Skip</button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function IosAlert({ open, title, body, options, onPick }: { open: boolean; title: string; body: string; options: string[]; onPick: (o: string) => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="ios-alert" role="alertdialog" initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="ios-alert-body"><b>{title}</b><span>{body}</span></div>
            {options.map(o => <button key={o} onClick={() => onPick(o)}>{o}</button>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ---------- Not live yet ---------- */
export function Waitlist() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <motion.div className="waitlist" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={softSpring}>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="d" className="waitlist-in" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.span className="done-tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}><Check size={30} weight="bold" /></motion.span>
            <h1 className="t-title2">You’re on the list!</h1>
          </motion.div>
        ) : (
          <motion.div key="f" className="waitlist-in">
            <h1 className="t-title1">Coming soon</h1>
            <p className="t-body">Sign up to be notified once we’re live in your city!</p>
            <input className="field-plain" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email" />
            <Button full disabled={!/.+@.+\..+/.test(email)} onClick={() => { setDone(true); haptic() }}>Sign up</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const _v = VerifiedMark
