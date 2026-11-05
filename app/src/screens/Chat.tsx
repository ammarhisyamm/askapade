import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'motion/react'
import {
  CaretLeft, DotsThreeVertical, Plus, PaperPlaneRight, MapPin, Camera, Image as ImageIcon, FileText, NavigationArrow,
  Lifebuoy, Flag, Prohibit, XCircle, Siren, Check, CaretRight, LockSimple, ChatCircle, Star, PersonSimpleWalk,
  MapPinArea, Clock, CheckCircle, Phone, ShareFat, DownloadSimple, Info,
} from '@phosphor-icons/react'
import { useStore, id, type Chat as ChatT, type FuStatus } from '../store'
import { money, hhmm, fullName, HOME, totals, levelFor, LEVELS } from '../data'
import {
  Avatar, Icon3D, Fee, useNow, Button, Sheet, Modal, haptic, spring, softSpring, CountUp, Confetti, PlusOne, Empty, FlatMarker, LevelBadge,
} from '../ui'

const DAY = 86400_000

/* ---------- Chats tab ---------- */
export function ChatsList() {
  const s = useStore()
  const now = useNow(30000)
  return (
    <div className="screen screen-pad-top">
      <h1 className="t-title1 screen-title">Chats</h1>
      {s.chats.length === 0 ? <Empty icon={<ChatCircle size={30} weight="duotone" />} /> : (
        <ul className="chat-list">
          {s.chats.map(c => {
            const last = [...c.msgs].reverse().find(m => m.kind === 'text')
            const ended = c.paidAt || c.cancelled
            return (
              <li key={c.id}>
                <button className={`chat-row ${ended ? 'is-ended' : ''}`} onClick={() => s.push({ name: 'chat', id: c.id })}>
                  <Avatar p={c.with} size={48} />
                  <span className="chat-row-mid">
                    <span className="chat-row-top">
                      <span className="t-title3">{fullName(c.with)}</span>
                      {!ended && <span className="t-caption t-num chat-row-time">{hhmm(c.ask.endsAt - now)}</span>}
                    </span>
                    <span className="chat-row-sub t-caption t-quiet">
                      <Icon3D id={c.ask.icon} size={18} />
                      <span className="ellipsis">{last && last.kind === 'text' ? last.text : c.ask.text}</span>
                    </span>
                  </span>
                  {c.unread ? <span className="unread t-micro">{c.unread}</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/* ---------- Chat ---------- */
const STATUS: { s: Exclude<FuStatus, null>; icon: React.ReactNode }[] = [
  { s: 'On my way', icon: <PersonSimpleWalk size={20} weight="bold" /> },
  { s: 'Here', icon: <MapPinArea size={20} weight="bold" /> },
  { s: 'Running late', icon: <Clock size={20} weight="bold" /> },
  { s: 'Done', icon: <CheckCircle size={20} weight="bold" /> },
]

export function ChatScreen({ cid }: { cid: string }) {
  const s = useStore()
  const c = s.chats.find(x => x.id === cid)!
  const now = useNow(1000)
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const readOnly = !!c.paidAt && now - c.paidAt > DAY
  const ended = !!c.paidAt || !!c.cancelled

  useEffect(() => { s.setActiveChat(cid); s.updateChat(cid, x => ({ ...x, unread: 0 })); return () => s.setActiveChat(null) }, [cid])
  useEffect(() => { listRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }) }, [c.msgs.length, c.status, c.doneMe, c.doneThem])

  // Live: the other person moves the ask along on their own
  useEffect(() => {
    if (!c.mine || ended) return
    const ts = [
      setTimeout(() => s.updateChat(cid, x => (x.status ? x : { ...x, status: 'On my way' })), 2500),
      setTimeout(() => s.updateChat(cid, x => ({ ...x, msgs: x.msgs.some(m => m.id === 'auto1') ? x.msgs : [...x.msgs, { id: 'auto1', from: 'them', kind: 'text', text: 'Leaving now. Which door is it?' }] })), 4200),
    ]
    return () => ts.forEach(clearTimeout)
  }, [cid])

  const send = () => {
    if (!text.trim()) return
    s.updateChat(cid, x => ({ ...x, msgs: [...x.msgs, { id: id(), from: 'me', kind: 'text', text: text.trim() }] }))
    setText('')
    if (c.mine) setTimeout(() => s.updateChat(cid, x => ({ ...x, msgs: [...x.msgs, { id: id(), from: 'them', kind: 'text', text: 'Got it, see you there.' }] })), 1600)
  }

  const markComplete = () => {
    s.updateChat(cid, x => ({ ...x, doneMe: true }))
    haptic()
    if (c.mine) {
      // They mark it complete too, then Release payout appears
      setTimeout(() => { s.updateChat(cid, x => ({ ...x, doneThem: true, status: 'Done' })); s.setOverlay('payout') }, 1400)
    } else {
      setTimeout(() => s.updateChat(cid, x => ({ ...x, doneThem: true })), 1200)
      setTimeout(() => { s.updateChat(cid, x => ({ ...x, paidAt: Date.now() })); s.setOverlay('received') }, 3000)
    }
  }

  const step = c.paidAt ? 3 : c.doneMe && c.doneThem ? 2 : 1

  return (
    <div className="chat">
      <header className="chat-head">
        <button className="icon-btn" aria-label="Back" onClick={s.pop}><CaretLeft size={22} weight="bold" /></button>
        <button className="chat-who" onClick={() => s.push({ name: 'other-profile', username: c.with.username })}>
          <Avatar p={c.with} size={36} />
          <span className="t-title3">{fullName(c.with)}</span>
        </button>
        <button className="icon-btn" aria-label="Menu" onClick={() => s.setOverlay('menu')}><DotsThreeVertical size={22} weight="bold" /></button>
      </header>

      <div className="chat-scroll" ref={listRef}>
        {/* Ask summary */}
        <section className="ask-sum">
          <div className="ask-sum-top">
            <Icon3D id={c.ask.icon} size={44} />
            <p className="t-callout ask-sum-text">{c.ask.text}</p>
          </div>
          <div className="ask-sum-mid">
            <Fee fee={c.ask.fee} finder={c.ask.finder} currency={c.ask.currency} />
            {!ended && <span className="t-num ask-sum-count"><Clock size={14} weight="bold" />{hhmm(c.ask.endsAt - now)}</span>}
          </div>
          <ol className="steps" aria-label="Progress">
            {['Payment held', 'Done', 'Paid'].map((l, i) => (
              <li key={l} className={i < step ? 'is-on' : ''}>
                <span className="steps-dot">{i < step && <Check size={10} weight="bold" />}</span>
                <span className="t-micro">{l}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Status set by the person fulfilling the ask */}
        <AnimatePresence mode="popLayout">
          {(c.status || !c.mine) && !c.cancelled && (
            <motion.button key={c.status ?? 'none'} className={`status-chip ${c.status ? 'is-set' : ''}`} disabled={c.mine || ended}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={spring}
              onClick={() => s.setOverlay('status')}>
              {STATUS.find(x => x.s === c.status)?.icon ?? <PersonSimpleWalk size={18} weight="bold" />}
              <span className="t-callout">{c.status ?? 'Set status'}</span>
              {c.mine && <span className="live-dot" />}
            </motion.button>
          )}
        </AnimatePresence>

        <MiniMap icon={c.ask.icon} area={c.ask.area} />

        <div className="msgs">
          {c.msgs.map(m => <Bubble key={m.id} m={m} />)}
          {c.doneThem && !c.doneMe && <SystemLine text={`${c.with.first} marked the ask complete`} />}
          {c.doneMe && !c.doneThem && <SystemLine text="You marked the ask complete" />}
          {c.paidAt && <SystemLine text={c.mine ? 'Payout released' : 'Payout received'} />}
          {c.cancelled && <SystemLine text="Ask cancelled" />}
        </div>
      </div>

      {readOnly ? (
        <div className="chat-closed t-caption"><LockSimple size={16} weight="fill" /> Read only</div>
      ) : (
        <div className="chat-foot">
          {!c.doneMe && !ended && <SwipeComplete onDone={markComplete} />}
          {c.mine && c.doneMe && c.doneThem && !c.paidAt && (
            <Button full onClick={() => s.setOverlay('payout')}>Release payout</Button>
          )}
          {c.paidAt && !c.reviewed && <Button full icon={<Star size={18} weight="fill" />} onClick={() => s.setOverlay('review')}>Leave a review</Button>}
          <div className="composer">
            <button className="icon-btn" aria-label="Add attachment" onClick={() => s.setOverlay('attach')}><Plus size={22} weight="bold" /></button>
            <input placeholder="Message" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} aria-label="Message" />
            <button className="send" aria-label="Send" disabled={!text.trim()} onClick={send}><PaperPlaneRight size={18} weight="fill" /></button>
          </div>
        </div>
      )}

      <ChatSheets c={c} />
    </div>
  )
}

function SystemLine({ text }: { text: string }) {
  return <motion.p className="sys-line t-caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{text}</motion.p>
}

function Bubble({ m }: { m: ChatT['msgs'][number] }) {
  const cls = `bubble from-${m.from}`
  const enter = { initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: spring }
  if (m.kind === 'text') return <motion.div className={cls} {...enter}>{m.text}</motion.div>
  if (m.kind === 'location') return (
    <motion.div className={`${cls} att att-loc`} {...enter}>
      <span className="att-loc-map"><span className="att-loc-pin"><MapPin size={18} weight="fill" /></span></span>
      <span className="att-row"><span className="t-callout">Live location</span><span className="t-caption">{m.area}</span></span>
    </motion.div>
  )
  if (m.kind === 'photo') return <motion.div className={`${cls} att att-photo`} {...enter}><img src={m.src} alt="Photo" /></motion.div>
  return (
    <motion.div className={`${cls} att att-file`} {...enter}>
      <span className="att-file-icon"><FileText size={22} weight="fill" /></span>
      <span className="att-row"><span className="t-callout">{m.name}</span><span className="t-caption">{m.size}</span></span>
      <DownloadSimple size={18} weight="bold" />
    </motion.div>
  )
}

/** Small map of the ask’s area: same white circle marker as the main map */
function MiniMap({ icon, area }: { icon: string; area: string }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const m = new maplibregl.Map({ container: el.current!, style: 'https://tiles.openfreemap.org/styles/positron', center: HOME, zoom: 14.6, interactive: false, attributionControl: false })
    return () => m.remove()
  }, [])
  return (
    <section className="mini-map">
      <div ref={el} className="mini-map-canvas" />
      <span className="mini-map-pin"><FlatMarker id={icon} size={38} /></span>
      <div className="mini-map-foot">
        <span className="t-callout">{area}</span>
        <a className="btn btn-secondary btn-sm" href={`https://maps.apple.com/?daddr=${HOME[1]},${HOME[0]}`} target="_blank" rel="noreferrer">
          <NavigationArrow size={16} weight="fill" />Directions
        </a>
      </div>
    </section>
  )
}

/** Swipe to mark as complete */
function SwipeComplete({ onDone }: { onDone: () => void }) {
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const max = () => (track.current?.clientWidth ?? 300) - 56
  const fill = useTransform(x, v => `${Math.min(100, ((v + 56) / ((track.current?.clientWidth ?? 300))) * 100)}%`)
  const textOp = useTransform(x, [0, 120], [1, 0])
  return (
    <div className="swipe" ref={track} role="button" aria-label="Mark as complete" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onDone()}>
      <motion.span className="swipe-fill" style={{ width: fill }} />
      <motion.span className="swipe-label t-callout" style={{ opacity: textOp }}>Mark as complete</motion.span>
      <motion.span className="swipe-knob" drag="x" dragConstraints={track} dragElastic={0} dragMomentum={false} style={{ x }}
        onDragEnd={() => {
          if (x.get() > max() * 0.8) { animate(x, max(), { duration: 0.15 }); setTimeout(onDone, 160) }
          else animate(x, 0, spring)
        }}>
        <CaretRight size={20} weight="bold" />
      </motion.span>
    </div>
  )
}

/* ---------- Sheets that belong to the chat ---------- */
function ChatSheets({ c }: { c: ChatT }) {
  const s = useStore()
  const close = () => s.setOverlay(null)
  const cur = c.ask.currency
  const { platform } = totals(c.ask.fee, c.ask.finder)
  const after = !!c.with
  const [reason, setReason] = useState<string | null>(null)

  const attach = (kind: 'location' | 'photo' | 'file') => {
    const m = kind === 'location' ? { id: id(), from: 'me' as const, kind, area: c.ask.area }
      : kind === 'photo' ? { id: id(), from: 'me' as const, kind, src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=480&h=360&fit=crop' }
      : { id: id(), from: 'me' as const, kind, name: 'Shelf brackets.pdf', size: '240 KB' }
    s.updateChat(c.id, x => ({ ...x, msgs: [...x.msgs, m] }))
    close()
  }

  const cancel = () => {
    s.updateChat(c.id, x => ({ ...x, cancelled: 'me' }))
    if (c.mine) s.setMyAsk(null)
    close()
    s.showToast('Ask cancelled')
  }

  // Exact amounts, per the cancelling rules
  const refundIfAskerCancels = c.ask.fee * 0.5 + c.ask.finder
  const note = c.mine
    ? `Note: if you cancel, you’ll only be refunded ${money(cur, refundIfAskerCancels)}.`
    : `Note: ${c.with.first} will be refunded ${money(cur, c.ask.fee + c.ask.finder)}.`

  return (
    <>
      {/* Status: set by the person fulfilling */}
      <Sheet open={s.overlay === 'status'} onClose={close} label="Status">
        <div className="sheet-body">
          <h2 className="t-title2">Status</h2>
          <div className="status-grid">
            {STATUS.map(x => (
              <button key={x.s} className={`status-opt ${c.status === x.s ? 'is-on' : ''}`}
                onClick={() => { s.updateChat(c.id, y => ({ ...y, status: x.s })); haptic(); close() }}>
                {x.icon}<span className="t-callout">{x.s}</span>
              </button>
            ))}
          </div>
        </div>
      </Sheet>

      {/* Attachments */}
      <Sheet open={s.overlay === 'attach'} onClose={close} label="Attach">
        <div className="sheet-body">
          <div className="attach-grid">
            <button onClick={() => attach('location')}><span><MapPin size={24} weight="fill" /></span>Location</button>
            <button onClick={() => attach('photo')}><span><Camera size={24} weight="fill" /></span>Camera</button>
            <button onClick={() => attach('photo')}><span><ImageIcon size={24} weight="fill" /></span>Photo</button>
            <button onClick={() => attach('file')}><span><FileText size={24} weight="fill" /></span>File</button>
          </div>
        </div>
      </Sheet>

      {/* Menu: destructive items in red */}
      <Sheet open={s.overlay === 'menu'} onClose={close} label="Menu">
        <div className="sheet-body">
          <div className="menu-list">
            <button onClick={() => { close(); s.push({ name: 'lifeline' }) }}><Lifebuoy size={22} weight="bold" />Lifeline<CaretRight size={16} className="menu-caret" /></button>
            <button onClick={() => s.setOverlay('report')}><Flag size={22} weight="bold" />Report user<CaretRight size={16} className="menu-caret" /></button>
            <button onClick={() => { close(); s.push({ name: 'contact' }) }}><Info size={22} weight="bold" />Contact us<CaretRight size={16} className="menu-caret" /></button>
            <button className="is-danger" onClick={() => s.setOverlay('block')}><Prohibit size={22} weight="bold" />Block</button>
            {!c.paidAt && !c.cancelled && <button className="is-danger" onClick={() => s.setOverlay('cancel')}><XCircle size={22} weight="bold" />Cancel ask</button>}
            <button className="is-danger" onClick={() => s.setOverlay('sos')}><Siren size={22} weight="fill" />SOS</button>
          </div>
        </div>
      </Sheet>

      {/* Cancel: confirm with exact amounts */}
      <Modal open={s.overlay === 'cancel' && after} onClose={close} title="Cancel this ask?" icon={<Icon3D id={c.ask.icon} size={64} />}>
        <p className="t-body modal-note">{note}</p>
        <div className="modal-actions">
          <Button full onClick={close}>Keep it</Button>
          <Button full kind="danger" onClick={cancel}>Cancel ask</Button>
        </div>
        <span className="sr-only">Platform fee kept: {money(cur, platform)}</span>
      </Modal>

      {/* Report */}
      <Sheet open={s.overlay === 'report'} onClose={close} label="Report user">
        <div className="sheet-body">
          <h2 className="t-title2">Report {fullName(c.with)}</h2>
          <div className="choice-list">
            {['Didn’t arrive', 'Unsafe behaviour', 'Suspected fraud', 'Something else'].map(r => (
              <button key={r} className={reason === r ? 'is-on' : ''} onClick={() => setReason(r)}>
                {r}<span className={`check ${reason === r ? 'is-on' : ''}`} />
              </button>
            ))}
          </div>
          <Button full disabled={!reason} onClick={() => { close(); setReason(null); s.showToast('Thanks for reporting!') }}>Report user</Button>
        </div>
      </Sheet>

      {/* Block */}
      <Modal open={s.overlay === 'block'} onClose={close} title={`Block ${fullName(c.with)}?`} icon={<span className="modal-glyph is-danger"><Prohibit size={34} weight="bold" /></span>}>
        <div className="modal-actions">
          <Button full onClick={close}>Keep chatting</Button>
          <Button full kind="danger" onClick={() => { s.setBlocked(b => [...b.filter(p => p.username !== c.with.username), c.with]); close(); s.showToast('User blocked') }}>Block</Button>
        </div>
      </Modal>

      <SosSheet open={s.overlay === 'sos'} onClose={close} />
      <PayoutFlow c={c} />
      <ReviewSheet c={c} />
    </>
  )
}

/** SOS: fast, but hard to trigger by accident: press and hold */
function SosSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useStore()
  const [p, setP] = useState(0)
  const [called, setCalled] = useState(false)
  const t = useRef<number>(0)
  useEffect(() => { if (!open) { setP(0); setCalled(false) } }, [open])
  const start = () => {
    const t0 = Date.now()
    const tick = () => {
      const v = Math.min(1, (Date.now() - t0) / 1600); setP(v)
      if (v >= 1) { setCalled(true); haptic(); return }
      t.current = requestAnimationFrame(tick)
    }
    t.current = requestAnimationFrame(tick)
  }
  const stop = () => { cancelAnimationFrame(t.current); if (!called) setP(0) }
  return (
    <Sheet open={open} onClose={onClose} dark label="SOS">
      <div className="sheet-body sos">
        {called ? (
          <>
            <motion.span className="sos-ring is-called" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={softSpring}><Phone size={40} weight="fill" /></motion.span>
            <h2 className="t-title2">Calling 999</h2>
            <p className="t-body on-dark-quiet">Your Lifeline can see your live location.</p>
            <div className="sos-contacts">
              {s.lifeline.map(l => <span key={l.name} className="t-caption"><Check size={14} weight="bold" />{l.name}</span>)}
            </div>
            <Button full kind="secondary" className="on-dark" onClick={onClose}>Close</Button>
          </>
        ) : (
          <>
            <h2 className="t-title2">Hold for SOS</h2>
            <button className="sos-ring" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} aria-label="Hold to call 999">
              <svg viewBox="0 0 120 120" className="sos-progress"><circle cx="60" cy="60" r="54" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
              <Siren size={44} weight="fill" />
            </button>
            <p className="t-body on-dark-quiet">To call 999 and send your live location to your Lifeline.</p>
          </>
        )}
      </div>
    </Sheet>
  )
}

/** The happiest moment in the app: release (asker) and received (the person who fulfilled it) */
function PayoutFlow({ c }: { c: ChatT }) {
  const s = useStore()
  const [released, setReleased] = useState(false)
  const [levelUp, setLevelUp] = useState(false)
  const amount = c.ask.fee
  const cur = c.ask.currency
  useEffect(() => { if (s.overlay === 'payout') setReleased(false) }, [s.overlay])

  const bump = () => {
    const before = levelFor(s.me.askapades).name
    const n = s.me.askapades + 1
    s.setMe(m => ({ ...m, askapades: n }))
    if (levelFor(n).name !== before) setTimeout(() => setLevelUp(true), 2400)
  }

  const release = () => {
    setReleased(true); haptic()
    s.updateChat(c.id, x => ({ ...x, paidAt: Date.now() }))
    s.setMyAsk(null)
    s.setTxs(t => [{ id: id(), icon: c.ask.icon, label: c.ask.text, amount: -(c.ask.fee + c.ask.finder + c.ask.fee * 0.2), when: 'Today' }, ...t])
    bump()
  }
  const received = s.overlay === 'received'
  useEffect(() => {
    if (!received) return
    s.setBalance(b => b + amount)
    s.setTxs(t => [{ id: id(), icon: c.ask.icon, label: c.ask.text, amount, when: 'Today', tag: 'Pending' }, ...t])
    bump()
  }, [received])

  const done = released || received
  return (
    <>
      <AnimatePresence>
        {(s.overlay === 'payout' || received) && (
          <motion.div className="payout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="Payout">
            <Confetti run={done} />
            <motion.div className="payout-card" initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} transition={softSpring}>
              <div className="payout-coin">
                <Icon3D id="coins" size={96} />
                <PlusOne show={done} />
              </div>
              {done ? (
                <>
                  <h2 className="t-title1">{received ? 'Payout received!' : 'Payout released!'}</h2>
                  <CountUp value={amount} prefix={cur} className="t-display payout-amount" />
                  <p className="t-body on-dark-quiet">{received ? `From ${fullName(c.with)}` : `To ${fullName(c.with)}`}</p>
                  <Button full onClick={() => s.setOverlay('review')}>Leave a review</Button>
                  <button className="link-on-dark t-callout" onClick={() => { s.setOverlay(null); s.push({ name: 'share', askId: c.ask.id }) }}>Share this ask</button>
                </>
              ) : (
                <>
                  <h2 className="t-title1">Release payout</h2>
                  <span className="t-display payout-amount">{money(cur, amount)}</span>
                  <p className="t-body on-dark-quiet">To {fullName(c.with)}</p>
                  <Button full onClick={release}>Release payout</Button>
                  <button className="link-on-dark t-callout" onClick={() => s.setOverlay(null)}>Not now</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <LevelUp open={levelUp} onClose={() => setLevelUp(false)} />
    </>
  )
}

export function LevelUp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useStore()
  const L = levelFor(s.me.askapades)
  const idx = LEVELS.findIndex(l => l.name === L.name)
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="payout is-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="Level up">
          <Confetti run />
          <motion.div className="levelup" initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={softSpring}>
            <motion.span initial={{ rotate: -40, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}>
              <LevelBadge level={L.name} size={132} />
            </motion.span>
            <PlusOne show label="Level up" />
            <h2 className="t-title1">{L.name}</h2>
            <div className="levelup-steps">
              {LEVELS.map((l, i) => <span key={l.name} className={i <= idx ? 'is-on' : ''} style={{ ['--c' as string]: l.color }} />)}
            </div>
            <Button full onClick={onClose}>Keep going</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Up to 5 stars and a note that looks optional */
function ReviewSheet({ c }: { c: ChatT }) {
  const s = useStore()
  const [stars, setStars] = useState(0)
  const [note, setNote] = useState('')
  const close = () => s.setOverlay(null)
  const send = () => { s.updateChat(c.id, x => ({ ...x, reviewed: true })); close(); s.showToast('Review sent') }
  return (
    <Sheet open={s.overlay === 'review'} onClose={close} label="Leave a review">
      <div className="sheet-body review">
        <Avatar p={c.with} size={64} />
        <h2 className="t-title2">{fullName(c.with)}</h2>
        <div className="stars" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map(n => (
            <motion.button key={n} role="radio" aria-checked={stars === n} aria-label={`${n} stars`} whileTap={{ scale: 0.8 }}
              animate={{ scale: n <= stars ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.3, delay: (n - 1) * 0.03 }}
              className={n <= stars ? 'is-on' : ''} onClick={() => { setStars(n); haptic() }}>
              <Star size={36} weight="fill" />
            </motion.button>
          ))}
        </div>
        <input className="field-plain" placeholder="Add a note (optional)" value={note} onChange={e => setNote(e.target.value)} />
        <Button full disabled={!stars} onClick={send}>Send review</Button>
        <button className="link-quiet t-callout" onClick={close}>Not now</button>
      </div>
    </Sheet>
  )
}

export { ShareFat }
