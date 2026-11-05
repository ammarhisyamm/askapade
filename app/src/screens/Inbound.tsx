import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, MapPin, Clock, NotePencil } from '@phosphor-icons/react'
import { useStore, id, type Chat } from '../store'
import { PEOPLE, type Ask, hhmm } from '../data'
import { Icon3D, Fee, Button, VerifiedMark, distance, span, haptic, spring, softSpring, useNow, Confetti } from '../ui'

const RESPOND = 30 // seconds to respond

/** A new ask reaches you: full card when idle, banner when mid-ask */
export function InboundCard() {
  const s = useStore()
  const inb = s.inbound
  const now = useNow(1000)
  const [t0, setT0] = useState(Date.now())
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  useEffect(() => { if (inb?.mode === 'card') { setT0(Date.now()); setNoteOpen(false); setNote(''); haptic() } }, [inb?.ask.id, inb?.mode])
  const left = Math.max(0, RESPOND - Math.floor((now - t0) / 1000))
  useEffect(() => { if (inb?.mode === 'card' && left === 0) s.setInbound(null) }, [left])

  if (!inb) return null
  const a = inb.ask
  const offer = () => s.requireAccount(() => sendOffer(s, a))

  return (
    <AnimatePresence>
      {inb.mode === 'banner' ? (
        <motion.button key="banner" className="inbound-banner glass" onClick={() => s.setInbound({ ask: a, mode: 'card' })}
          initial={{ y: -90 }} animate={{ y: 0 }} exit={{ y: -90 }} transition={spring}>
          <Icon3D id={a.icon} size={36} />
          <span className="inbound-banner-mid">
            <span className="t-callout">New ask {distance(a.km)} away</span>
            <span className="t-caption t-quiet ellipsis">{a.text}</span>
          </span>
          <Fee fee={a.fee} finder={a.finder} currency={a.currency} size="sm" />
        </motion.button>
      ) : (
        <motion.div key="card" className="inbound" role="dialog" aria-label="New ask"
          initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%', transition: { duration: 0.25 } }} transition={softSpring}>
          <div className="inbound-timer" aria-label={`${left} seconds to respond`}>
            <motion.span initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: RESPOND, ease: 'linear' }} key={a.id} />
          </div>
          <button className="icon-btn inbound-x" aria-label="Close" onClick={() => s.setInbound(null)}><X size={20} weight="bold" /></button>
          <div className="inbound-top">
            <motion.span initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...softSpring, delay: 0.1 }}>
              <Icon3D id={a.icon} size={84} />
            </motion.span>
            <Fee fee={a.fee} finder={a.finder} currency={a.currency} size="lg" />
          </div>
          <p className="t-title3 inbound-text">{a.text}</p>
          <div className="inbound-facts t-callout">
            <span><MapPin size={18} weight="fill" />{a.area}, {distance(a.km)}</span>
            <span><Clock size={18} weight="bold" />{hhmm(a.endsAt - now)}</span>
            <VerifiedMark on={a.verified} size={18} />
          </div>
          <AnimatePresence initial={false}>
            {noteOpen ? (
              <motion.input key="n" autoFocus className="field-plain" placeholder="Add a note (optional)" value={note} onChange={e => setNote(e.target.value)}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 48 }} />
            ) : (
              <motion.button key="b" className="link-quiet t-callout inbound-note" onClick={() => setNoteOpen(true)}><NotePencil size={16} weight="bold" />Add a note</motion.button>
            )}
          </AnimatePresence>
          <Button full onClick={offer}>Send offer</Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Offer, then the backend picks one person. Picked: “You got it”, then the chat opens */
export function sendOffer(s: ReturnType<typeof useStore>, a: Ask) {
  s.setOffered(o => [...o, a.id])
  s.setInbound(null)
  s.showToast('Offer sent')
  setTimeout(() => s.setOverlay('youGotIt'), 2600)
  ;(window as any).__gotAsk = a
}

export function YouGotIt() {
  const s = useStore()
  const a: Ask | undefined = (window as any).__gotAsk
  const open = s.overlay === 'youGotIt' && !!a
  useEffect(() => {
    if (!open || !a) return
    haptic()
    const t = setTimeout(() => {
      const cid = `c-${a.id}`
      const chat: Chat = {
        id: cid, ask: a, with: PEOPLE[2], mine: false, status: null, doneMe: false, doneThem: false,
        msgs: [{ id: id(), from: 'them', kind: 'text', text: 'Thanks for taking this!' }],
      }
      s.setChats(cs => [chat, ...cs.filter(c => c.id !== cid)])
      s.setAsks(as => as.filter(x => x.id !== a.id))
      s.setOverlay(null); s.setTab('chats'); s.setStack([{ name: 'chat', id: cid }])
    }, 2400)
    return () => clearTimeout(t)
  }, [open])
  return (
    <AnimatePresence>
      {open && a && (
        <motion.div className="got-it" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="You got it">
          <Confetti run />
          <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 13 }}>
            <Icon3D id={a.icon} size={128} />
          </motion.span>
          <motion.h2 className="t-title1" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>You got it!</motion.h2>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Fee fee={a.fee} finder={0} currency={a.currency} size="lg" />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const _span = span
