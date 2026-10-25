import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Phone, MoreHorizontal, Plus, Send, Check, Navigation, Lock, LifeBuoy, ShieldCheck, Ban, MinusCircle, Share, X, Clock, MapPin, Star, Hourglass, Image as ImageIcon, FileText } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Avatar, Tile, Stepper, CountdownRing, Sheet, Modal, Confetti, HoldButton, Toast, MapCanvas, Me, PEOPLE, EASE_OUT, spring } from '../ui'

type Msg = { id: number; from: 'me' | 'them' | 'sys'; text: string }

function useScript(script: [number, Msg['from'], string][]) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const id = useRef(0)
  const push = (from: Msg['from'], text: string) => setMsgs(m => [...m, { id: ++id.current, from, text }])
  useEffect(() => {
    const ts: number[] = []
    let t = 0
    script.forEach(([delay, from, text]) => {
      t += delay
      if (from === 'them') { ts.push(window.setTimeout(() => setTyping(true), t - 700)) }
      ts.push(window.setTimeout(() => { setTyping(false); push(from, text) }, t))
    })
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { msgs, typing, setTyping, push }
}

function MidJobInbound({ onClose, onOffer }: { onClose: () => void; onOffer: () => void }) {
  const total = 18
  const [secs, setSecs] = useState(total)
  useEffect(() => { const t = setInterval(() => setSecs(s => s - 1), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (secs <= 0) onClose() }, [secs, onClose])
  return (
    <motion.div initial={{ y: -40, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -30, opacity: 0 }} transition={spring}
      style={{ position: 'absolute', left: 12, right: 12, top: 'calc(var(--sat) + 2px)', zIndex: 60, background: '#fff', borderRadius: 26, padding: 16, boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="row"><span className="livedot" /><span className="t-micro green">On your route · after Bella</span><span className="grow" /><span className="badge warning"><Clock size={12} />+3 min</span></div>
      <div className="row" style={{ alignItems: 'flex-end' }}><span className="t-display" style={{ fontSize: 44 }}>£6</span><span className="col" style={{ padding: '0 0 4px 8px' }}><span className="t-cap muted">you earn</span><span className="row t-cap green" style={{ gap: 4, fontSize: 12, fontWeight: 800 }}><Lock size={11} />held in escrow</span></span><span className="grow" /><Tile obj="coffee-cup" size={48} /></div>
      <div className="row"><Avatar who="Priya" size={30} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>Grab 2 coffees from Gail’s</span><span className="t-cap muted" style={{ fontSize: 12 }}>120 m off your route · within 1h</span></span></div>
      <div className="row">
        <button className="iconbtn lg" onClick={onClose} aria-label="Decline"><X size={22} /></button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onOffer} className="grow" style={{ height: 56, borderRadius: 14, background: 'var(--brand-900)', color: '#fff', position: 'relative', overflow: 'hidden', fontWeight: 700, fontSize: 17 }}>
          <span style={{ position: 'absolute', inset: 0, background: 'var(--brand)', transformOrigin: 'left', transform: `scaleX(${secs / total})`, transition: 'transform 1s linear' }} />
          <span style={{ position: 'relative' }}>Offer to help <span style={{ opacity: 0.75, fontWeight: 600, fontSize: 15 }}>{secs}s</span></span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export function Chat(p: { role?: 'asker' | 'helper'; who?: string; fee?: number; open?: 'actions' | 'status' | 'cancel' | 'release' | 'done' | 'inbound' | 'map' | 'attach' }) {
  const { go } = useApp()
  const helper = p.role === 'helper'
  const who = p.who ?? (helper ? 'Ellie' : 'Tom')
  const fee = p.fee ?? (helper ? 15 : 12)
  const first = PEOPLE[who].name.split(' ')[0]
  const { msgs, typing, setTyping, push } = useScript(helper
    ? [[600, 'them', 'Hi! Bella’s lead is by the door.'], [1400, 'me', 'Perfect — on my way now.'], [400, 'sys', 'You shared: On my way'], [2200, 'them', 'She loves the park on Station Rd.']]
    : [[700, 'them', 'Hi! Heading to the post office now.'], [1500, 'me', 'Thanks! Slip code is 4821.'], [2200, 'sys', `${first} collected the parcel`], [1800, 'them', 'Got it. About 6 min away.']])
  const o = p.open
  const [step, setStep] = useState<0 | 1 | 2>(o === 'release' ? 1 : o === 'done' ? 2 : 0)
  const [marked, setMarked] = useState(o === 'release' || o === 'done')
  const [actions, setActions] = useState(o === 'actions'), [statusSheet, setStatusSheet] = useState(o === 'status'), [cancel, setCancel] = useState(o === 'cancel'), [done, setDone] = useState(o === 'done')
  const [mapOpen, setMapOpen] = useState(o === 'map'), [attach, setAttach] = useState(o === 'attach')
  const [status, setStatus] = useState('On my way')
  const [inbound, setInbound] = useState(false), [toast, setToast] = useState<string | null>(null)
  const [mins, setMins] = useState(42)
  const [stars, setStars] = useState(0)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, typing])
  useEffect(() => { const t = setInterval(() => setMins(m => Math.max(1, m - 1)), 4000); return () => clearInterval(t) }, [])
  useEffect(() => { if (!helper) return; const t = setTimeout(() => setInbound(true), o === 'inbound' ? 600 : 7000); return () => clearTimeout(t) }, [helper, o])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t) }, [toast])

  const markComplete = () => {
    setMarked(true); push('sys', 'You marked complete')
    setTimeout(() => setTyping(true), 700)
    setTimeout(() => {
      setTyping(false)
      if (helper) { push('sys', `${first} confirmed · payout released`); setStep(2); setTimeout(() => go('paid', undefined, 'fade'), 900) }
      else { push('sys', `${first} marked complete`); setStep(1) }
    }, 1700)
  }
  const release = () => { setStep(2); push('sys', `£${fee} released to ${first}`); setTimeout(() => setDone(true), 450) }
  const setStat = (s: string) => { setStatus(s); push('sys', `You shared: ${s}`); setStatusSheet(false) }

  return (
    <div className="screen">
      <StatusBar />
      <div className="row" style={{ padding: '4px 16px 10px', borderBottom: '1px solid var(--line)' }}>
        <button className="iconbtn" onClick={() => go('home', undefined, 'back')}><ArrowLeft size={20} /></button>
        <Avatar who={who} size={40} />
        <span className="col grow"><span className="t-callout" style={{ fontWeight: 800 }}>{PEOPLE[who].name}</span><span className="row t-cap muted" style={{ gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: step === 2 ? 'var(--ink-3)' : 'var(--brand)' }} />{step === 2 ? 'Completed' : helper ? 'Waiting for you · 450 m' : `On the way · ${Math.max(1, Math.round(mins / 7))} min`}</span></span>
        <motion.button whileTap={{ scale: 0.9 }} className="iconbtn" onClick={() => setToast(`Calling ${first} · number stays private`)} aria-label="Call"><Phone size={18} /></motion.button>
        <button className="iconbtn" onClick={() => setActions(true)}><MoreHorizontal size={18} /></button>
      </div>
      <div className="col" style={{ padding: '12px 16px 4px', gap: 10 }}>
        <div className="card col" style={{ padding: '12px 14px', gap: 12 }}>
          <div className="row"><Tile obj={helper ? 'puppy-face' : 'package-box'} size={36} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 800 }}>{helper ? 'Walk Bella · 30 min' : 'Parcel pickup'}</span><span className="t-cap muted">{step === 0 ? `£${(fee + (helper ? 0 : 2.5)).toFixed(helper ? 0 : 2)} held ${helper ? 'for you' : 'safely'}` : step === 1 ? `£${(fee + 2.5).toFixed(2)} ready to release` : `£${fee} paid ${helper ? 'to you' : 'to ' + first}`}</span></span>{step === 0 && <CountdownRing secs={mins} total={60} unit="m" />}</div>
          <Stepper step={step} />
        </div>
        <AnimatePresence initial={false}>{step === 0 && (
          <motion.div key="map" initial={{ height: 104, opacity: 1 }} animate={{ height: 104, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} onClick={() => setMapOpen(true)} whileTap={{ scale: 0.98 }} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--line)', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/map/harrow.png)', backgroundSize: '390px 844px', backgroundPosition: '-10px -330px' }} />
            <div className="medot" style={{ left: 252, top: 40 }} />
            <motion.div className="person" style={{ background: `linear-gradient(135deg, ${PEOPLE[helper ? 'Me' : who].c[0]}, ${PEOPLE[helper ? 'Me' : who].c[1]})` }} initial={{ left: 100, top: 66 }} animate={{ left: 200, top: 52 }} transition={{ duration: 24, ease: 'linear' }}>{PEOPLE[helper ? 'Me' : who].ini[0]}</motion.div>
            <span className="badge invert" style={{ position: 'absolute', left: 10, top: 10 }}>450 m · 6 min</span>
            <button className="btn secondary sm" style={{ position: 'absolute', right: 10, bottom: 10, background: '#fff' }} onClick={e => { e.stopPropagation(); setMapOpen(true) }}><Navigation size={14} />Directions</button>
          </motion.div>
        )}</AnimatePresence>
      </div>
      <div className="scroll col" style={{ padding: '10px 16px', gap: 6, justifyContent: 'flex-end' }}>
        <span className="t-cap muted" style={{ textAlign: 'center', fontSize: 12, fontWeight: 500, marginTop: 'auto' }}>Today · 14:02</span>
        <AnimatePresence initial={false}>
          {msgs.map(m => m.from === 'sys'
            ? <motion.span key={m.id} className="sysrow" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, ease: EASE_OUT }}><Check size={13} color="var(--brand)" strokeWidth={3} />{m.text}</motion.span>
            : <motion.div key={m.id} className={'bubble-msg ' + m.from} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22, ease: EASE_OUT }} style={{ transformOrigin: m.from === 'me' ? '100% 100%' : '0 100%' }}>{m.text}</motion.div>)}
          {typing && <motion.div key="typing" className="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><i /><i /><i /></motion.div>}
        </AnimatePresence>
        <div ref={end} />
      </div>
      <div className="col" style={{ padding: '10px 16px calc(var(--sab) + 8px)', gap: 10, borderTop: '1px solid var(--line)', background: 'var(--bg)' }}>
        {helper && step === 0 && <div className="row" style={{ gap: 8 }}><button className="t-cap muted" onClick={() => setStatusSheet(true)}>Your status</button>{['On my way', 'Here', 'Late'].map(s => <button key={s} className={'chip' + (status === s ? ' on' : '')} style={{ flex: 'none', height: 36 }} onClick={() => setStat(s)}>{s}</button>)}</div>}
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && <motion.div key="mc" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}><Btn kind="outline" icon={<Check size={18} />} onClick={markComplete} disabled={marked}>{marked ? `Waiting for ${first}…` : 'Mark as complete'}</Btn></motion.div>}
          {step === 1 && !helper && <motion.div key="rel" className="col" style={{ gap: 6 }} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring}><HoldButton icon={<Lock size={18} />} label={`Hold to release · £${fee}`} doneLabel={`Released to ${first}`} onDone={release} /><span className="t-cap muted" style={{ textAlign: 'center', fontSize: 12, fontWeight: 500 }}>Auto-releases in 24h if you don’t.</span></motion.div>}
        </AnimatePresence>
        {step < 2 && <div className="row" style={{ gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {(helper ? ['On my way', 'Here now', '2 min'] : ['Thanks!', 'How long?', 'Code is 4821']).map(q => <motion.button key={q} whileTap={{ scale: 0.92 }} onClick={() => push('me', q)} className="badge secondary" style={{ height: 30, padding: '0 12px', fontSize: 13, flex: 'none', background: '#fff', boxShadow: 'inset 0 0 0 1px var(--line-2)' }}>{q}</motion.button>)}
        </div>}
        <div className="composer"><motion.button whileTap={{ scale: 0.9 }} animate={{ rotate: attach ? 45 : 0 }} className="iconbtn" onClick={() => setAttach(true)} aria-label="Attach"><Plus size={20} /></motion.button><div className="input">Message</div><button className="iconbtn" style={{ background: 'var(--brand)', color: '#fff' }} aria-label="Send"><Send size={18} /></button></div>
      </div>
      <HomeBar />

      <AnimatePresence>{inbound && <MidJobInbound key="mj" onClose={() => setInbound(false)} onOffer={() => { setInbound(false); setToast('Offer sent · queued after Bella') }} />}</AnimatePresence>
      <Toast text={toast} show={!!toast} top />

      {/* Wolt: tap the mini map and it zooms into a tilted, full-screen live map */}
      <AnimatePresence>{mapOpen && (
        <motion.div key="bigmap" style={{ position: 'absolute', inset: 0, zIndex: 75, overflow: 'hidden', background: '#eceee6' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <motion.div initial={{ scale: 1, rotateX: 0 }} animate={{ scale: 1.35, rotateX: 32 }} exit={{ scale: 1, rotateX: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} style={{ position: 'absolute', inset: '-10% -10% 0', transformPerspective: 900, transformOrigin: '50% 60%' }}>
            <MapCanvas area="harrow">
              <Me x={250} y={420} />
              <motion.div className="person" style={{ background: `linear-gradient(135deg, ${PEOPLE[helper ? 'Me' : who].c[0]}, ${PEOPLE[helper ? 'Me' : who].c[1]})`, width: 40, height: 40, margin: '-20px 0 0 -20px', fontSize: 15 }} initial={{ left: 110, top: 520 }} animate={{ left: 215, top: 455 }} transition={{ duration: 20, ease: 'linear' }}>{PEOPLE[helper ? 'Me' : who].ini[0]}</motion.div>
            </MapCanvas>
          </motion.div>
          <motion.div initial={{ y: -80 }} animate={{ y: 0 }} exit={{ y: -80 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.2, delay: 0.15 }} className="row"
            style={{ position: 'absolute', top: 'calc(var(--sat) + 6px)', left: 12, right: 12, padding: '12px 14px', borderRadius: 18, background: '#fff', boxShadow: 'var(--e-3)' }}>
            <Avatar who={helper ? 'Me' : who} size={36} tick={false} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 800 }}>{helper ? 'You’re 6 min away' : `${first} is 6 min away`}</span><span className="t-cap muted">450 m · arriving 14:18</span></span><span className="livedot" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.3, duration: 0.3, ease: EASE_OUT }} style={{ position: 'absolute', left: 16, right: 16, bottom: 'calc(var(--sab) + 8px)' }}>
            <Btn kind="invert" onClick={() => setMapOpen(false)}>Back to chat</Btn>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <Sheet open={actions} onClose={() => setActions(false)}>
        <span className="t-head" style={{ display: 'block', marginBottom: 6 }}>{helper ? 'Walk Bella' : 'Parcel pickup'}</span>
        {[[LifeBuoy, 'Use your Lifeline', 'A friend follows this ask live'], [ShieldCheck, 'Report user', 'We reply within minutes'], [Ban, `Block ${first}`, 'They won’t see your asks'], [MinusCircle, 'Cancel ask', 'Full refund before pickup']].map(([I, t, s]) => {
          const Icon = I as typeof LifeBuoy
          return <button key={t as string} className="row" style={{ width: '100%', padding: '12px 0', textAlign: 'left' }} onClick={() => { if (t === 'Cancel ask') { setActions(false); setCancel(true) } }}><span className="tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon size={18} /></span><span className="col grow"><span className="t-callout">{t as string}</span><span className="t-cap muted" style={{ fontSize: 12 }}>{s as string}</span></span></button>
        })}
        <Btn kind="danger" icon={<Phone size={18} />} style={{ marginTop: 8 }}>Emergency SOS</Btn>
      </Sheet>
      <Sheet open={attach} onClose={() => setAttach(false)}>
        {[[ImageIcon, 'Photo', 'Sent a photo'], [FileText, 'File', 'Sent a receipt.pdf'], [MapPin, 'Location', 'Shared your live location']].map(([I, t, m]) => {
          const Icon = I as typeof MapPin
          return <button key={t as string} className="row" style={{ width: '100%', padding: '12px 0', textAlign: 'left' }} onClick={() => { setAttach(false); push('sys', m as string) }}><span className="tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon size={18} /></span><span className="t-callout grow">{t as string}</span></button>
        })}
      </Sheet>
      <Sheet open={statusSheet} onClose={() => setStatusSheet(false)}>
        <span className="t-head" style={{ display: 'block', marginBottom: 6 }}>Update {first}</span>
        {[[Navigation, 'On my way', 'Shares live location'], [MapPin, 'Here', `${first} gets a ping`], [Clock, 'Late', 'Adds 5 min to the timer']].map(([I, t, s]) => {
          const Icon = I as typeof Navigation
          return <button key={t as string} className="row" style={{ width: '100%', padding: '12px 0', textAlign: 'left' }} onClick={() => setStat(t as string)}><span className="tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon size={18} /></span><span className="col grow"><span className="t-callout">{t as string}</span><span className="t-cap muted" style={{ fontSize: 12 }}>{s as string}</span></span>{status === t && <Check size={18} color="var(--brand)" />}</button>
        })}
        <Btn kind="outline" icon={<Check size={18} />} style={{ marginTop: 8 }} onClick={() => { setStatusSheet(false); markComplete() }}>Done · ask {first} to confirm</Btn>
      </Sheet>
      <Modal open={cancel} onClose={() => setCancel(false)}>
        <span className="tile" style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--urgent-50)' }}><Hourglass size={22} color="#b36b00" /></span>
        <span className="t-title2">Cancel this ask?</span>
        <span className="t-callout muted" style={{ fontWeight: 500 }}>{first}’s already on the way. Cancelling now costs £2 to cover their time. The other £10 comes straight back.</span>
        <div className="col" style={{ gap: 8, width: '100%' }}><Btn kind="invert" onClick={() => setCancel(false)}>Keep my ask</Btn><Btn kind="ghost" style={{ color: 'var(--danger)' }} onClick={() => go('home', undefined, 'fade')}>Cancel for £2</Btn></div>
      </Modal>
      <Confetti run={done} />
      <Modal open={done}>
        <Hop state="happy" size={128} bob />
        <div className="col" style={{ gap: 6 }}><span className="t-title1">All done!</span><span className="t-body muted">£{fee} is on its way to {first}.</span></div>
        <div className="row" style={{ gap: 6 }}>{[1, 2, 3, 4, 5].map(i => <motion.button key={i} whileTap={{ scale: 0.85 }} onClick={() => setStars(i)}><Star size={30} fill={i <= stars ? '#FFB800' : 'none'} color={i <= stars ? '#FFB800' : 'var(--ink-4)'} /></motion.button>)}</div>
        <div className="col" style={{ gap: 8, width: '100%', marginTop: 4 }}><Btn onClick={() => go('rate', { who, stars }, 'push')}>Leave a review</Btn><Btn kind="secondary" icon={<Share size={18} />} onClick={() => go('share')}>Share this ask</Btn><Btn kind="ghost" onClick={() => go('home', undefined, 'fade')}>Done</Btn></div>
      </Modal>
    </div>
  )
}
