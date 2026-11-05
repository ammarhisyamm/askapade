import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CaretDown, Lightning, ArrowsOutSimple, TrendUp, LockSimple, Hourglass, Plus, Minus } from '@phosphor-icons/react'
import { useStore, id, type Chat } from '../store'
import { PEOPLE, money, hhmm, levelFor, fullName } from '../data'
import { Button, Icon3D, Fee, useNow, Avatar, Rating, LevelChip, VerifiedMark, haptic, spring, softSpring, Sheet, CoinIcon } from '../ui'

/** Scenario timing for the prototype */
const FIND_AFTER = 5200

export function SearchSheet() {
  const s = useStore()
  const a = s.myAsk
  const now = useNow(1000)
  const show = !!a && s.searchOpen && (a.phase === 'searching' || a.phase === 'nobody')

  // The backend finds someone, or nobody (scenario 2, before a boost)
  useEffect(() => {
    if (!a || a.phase !== 'searching') return
    const t = setTimeout(() => {
      if (a.scenario === 2 && !a.boosted) s.setMyAsk({ ...a, phase: 'nobody' })
      else {
        const who = a.declined ? PEOPLE[1] : PEOPLE[0]
        s.setMyAsk({ ...a, phase: 'matched', match: who, note: a.declined ? undefined : 'Can be there in 10' })
        s.setSearchOpen(true)
        haptic()
      }
    }, a.boosted ? FIND_AFTER - 1200 : FIND_AFTER)
    return () => clearTimeout(t)
  }, [a?.phase, a?.boosted, a?.declined])

  if (!a) return null
  const left = a.endsAt - now
  const nobody = a.phase === 'nobody'

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="search-sheet" role="dialog" aria-label="Searching"
          initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={spring}>
          <button className="search-min" aria-label="Minimise" onClick={() => s.setSearchOpen(false)}><CaretDown size={18} weight="bold" /></button>
          <div className="search-head">
            <motion.div className="search-icon" animate={nobody ? { rotate: 0 } : { rotate: [0, -6, 6, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
              <Icon3D id={a.icon} size={52} />
            </motion.div>
            <div className="search-count">
              <span className="t-display">{hhmm(left)}</span>
              <span className="search-bar"><motion.span animate={{ width: `${Math.max(2, (left / (a.endsAt - a.postedAt)) * 100)}%` }} /></span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {nobody ? (
              <motion.div key="nobody" className="search-copy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="t-title3">We can’t find anyone nearby. Tap ‘Boost’ to expand the radius.</p>
                <Button full icon={<Lightning size={18} weight="fill" />} onClick={() => s.setOverlay('boost')}>Boost</Button>
              </motion.div>
            ) : (
              <motion.div key="wait" className="search-copy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="t-title2">{a.boosted ? 'One moment' : 'Hang tight'}</p>
                <div className="search-ask">
                  <p className="t-body">{a.text}</p>
                  <Fee fee={a.fee} finder={a.finder} currency={a.currency} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="link-danger t-callout" onClick={() => s.setOverlay('cancel')}>Cancel ask</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Small live status on the map while the search keeps running */
export function LiveStatus() {
  const s = useStore()
  const a = s.myAsk
  const now = useNow(1000)
  const show = !!a && !s.searchOpen && a.phase !== 'chat' && s.stack.length === 0
  return (
    <AnimatePresence>
      {show && a && (
        <motion.button className="live-status glass" onClick={() => s.setSearchOpen(true)}
          initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }} transition={spring}
          aria-label="Reopen search">
          <Icon3D id={a.icon} size={28} />
          <span className="t-num live-status-time">{hhmm(a.endsAt - now)}</span>
          {a.phase === 'nobody' && <span className="live-dot is-warn" />}
          {a.phase === 'searching' && <span className="live-dot" />}
          {a.phase === 'matched' && <span className="live-status-found t-caption">{a.match?.first}</span>}
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/** Three boosts in the local currency; Broker Boost suggested first */
export function BoostSheet() {
  const s = useStore()
  const a = s.myAsk
  const [broker, setBroker] = useState(true)
  const [km, setKm] = useState(5)
  const [wide, setWide] = useState(true)
  const [raise, setRaise] = useState(0)
  useEffect(() => { if (s.overlay === 'boost') { setBroker(true); setWide(true); setKm(5); setRaise(0) } }, [s.overlay])
  if (!a) return null
  const c = a.currency
  const cost = (broker ? 5 : 0) + (wide ? km / 5 : 0) + raise
  const go = () => {
    s.setMyAsk({
      ...a, phase: 'searching', boosted: true, radiusKm: a.radiusKm + (wide ? km : 0),
      finder: broker ? a.finder + 5 : a.finder, fee: a.fee + raise,
    })
    s.setOverlay(null); haptic()
  }
  return (
    <Sheet open={s.overlay === 'boost'} onClose={() => s.setOverlay(null)} label="Boost">
      <div className="sheet-body">
        <h2 className="t-title2">Boost</h2>
        <div className="boosts">
          <BoostOpt on={broker} onToggle={() => setBroker(v => !v)} icon={<CoinIcon size={22} />} title="Broker Boost" suggested
            value={`+${money(c, 5)}`} />
          <BoostOpt on={wide} onToggle={() => setWide(v => !v)} icon={<ArrowsOutSimple size={22} weight="bold" />} title="Widen radius"
            value={`+${money(c, km / 5)}`}>
            <Stepper value={`${a.radiusKm + km} km`} onMinus={() => setKm(k => Math.max(5, k - 5))} onPlus={() => setKm(k => Math.min(25, k + 5))} />
          </BoostOpt>
          <BoostOpt on={raise > 0} onToggle={() => setRaise(r => (r ? 0 : 2))} icon={<TrendUp size={22} weight="bold" />} title="Raise fee"
            value={`+${money(c, raise)}`}>
            <Stepper value={money(c, a.fee + raise)} onMinus={() => setRaise(r => Math.max(0, r - 1))} onPlus={() => setRaise(r => r + 1)} />
          </BoostOpt>
        </div>
        <Button full disabled={cost === 0} onClick={go}>Boost for {money(c, cost)}</Button>
      </div>
    </Sheet>
  )
}

function BoostOpt({ on, onToggle, icon, title, value, suggested, children }: { on: boolean; onToggle: () => void; icon: React.ReactNode; title: string; value: string; suggested?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`boost ${on ? 'is-on' : ''}`}>
      <button className="boost-head" onClick={() => { onToggle(); haptic() }} role="checkbox" aria-checked={on}>
        <span className="boost-icon">{icon}</span>
        <span className="boost-title">
          <span className="t-title3">{title}</span>
          {suggested && <span className="tag-suggested t-micro">Suggested</span>}
        </span>
        <span className="t-num boost-val">{value}</span>
        <span className={`check ${on ? 'is-on' : ''}`} aria-hidden />
      </button>
      {children && on && <div className="boost-extra">{children}</div>}
    </div>
  )
}

export function Stepper({ value, onMinus, onPlus }: { value: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <span className="stepper">
      <button aria-label="Less" onClick={onMinus}><Minus size={16} weight="bold" /></button>
      <span className="t-num">{value}</span>
      <button aria-label="More" onClick={onPlus}><Plus size={16} weight="bold" /></button>
    </span>
  )
}

/** One person is matched: the card rises, money is held, the chat opens on its own */
export function MatchCard() {
  const s = useStore()
  const a = s.myAsk
  const show = !!a && a.phase === 'matched' && s.searchOpen
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (!show) { setHeld(false); return }
    const h = setTimeout(() => { setHeld(true); haptic() }, 900)
    const t = setTimeout(() => openChat(), 4800)
    return () => { clearTimeout(h); clearTimeout(t) }
  }, [show])

  const openChat = () => {
    const cur = s.myAsk
    if (!cur || !cur.match) return
    const cid = `c-${cur.id}`
    const chat: Chat = {
      id: cid, ask: { ...cur }, with: cur.match, mine: true, status: null, doneMe: false, doneThem: false,
      msgs: [
        ...(cur.note ? [{ id: id(), from: 'them' as const, kind: 'text' as const, text: cur.note }] : []),
      ],
    }
    s.setChats(cs => [chat, ...cs.filter(c => c.id !== cid)])
    s.setMyAsk({ ...cur, phase: 'chat' })
    s.setSearchOpen(false)
    s.setTab('chats')
    s.setStack([{ name: 'chat', id: cid }])
  }

  if (!a?.match) return null
  const p = a.match
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="match-card" role="dialog" aria-label="We found someone"
          initial={{ y: '110%', scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: '110%' }} transition={softSpring}>
          <p className="t-title2 match-title">We found someone</p>
          <button className="match-person" onClick={openChat}>
            <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ ...softSpring, delay: 0.15 }}>
              <Avatar p={p} size={72} />
            </motion.span>
            <span className="match-info">
              <span className="t-title3">{fullName(p)}</span>
              <span className="match-meta">
                <Rating p={p} />
                <LevelChip level={levelFor(p.askapades).name} />
              </span>
              <span className="t-caption t-quiet">{p.askapades} askapades</span>
            </span>
          </button>
          {a.note && <p className="match-note t-body">“{a.note}”</p>}
          <div className={`held-row ${held ? 'is-held' : ''}`}>
            <span className="held-icon">{held ? <LockSimple size={16} weight="fill" /> : <Hourglass size={16} weight="fill" />}</span>
            <span className="t-callout">Payment held</span>
            <span className="t-num">{money(a.currency, a.fee + a.finder + a.fee * 0.2)}</span>
          </div>
          <span className="match-progress" aria-hidden><motion.span initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 4.8, ease: 'linear' }} /></span>
          {!a.declined && (
            <button className="link-quiet t-callout" onClick={() => { s.setMyAsk({ ...a, phase: 'searching', match: undefined, declined: true }) }}>Find someone else</button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { VerifiedMark }
