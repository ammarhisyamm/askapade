import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Crosshair, MagnifyingGlass, Question, CaretDown, MapPin, CreditCard, LockSimple } from '@phosphor-icons/react'
import { useStore, type MyAsk } from '../store'
import { ICONS, pickIcon, money, totals, HOME, type Currency } from '../data'
import { Sheet, Button, Icon3D, CoinIcon, haptic, spring } from '../ui'

const DEADLINES = [1, 3, 6, 12, 24]
const PLACES = ['Paddington', 'Marylebone', 'Bayswater', 'Maida Vale', 'Little Venice', 'Notting Hill', 'Edgware Road']

export function PostSheet() {
  const s = useStore()
  const open = s.overlay === 'post'
  const [text, setText] = useState('')
  const [icon, setIcon] = useState('mystery-box')
  const [swapped, setSwapped] = useState(false)
  const [currency, setCurrency] = useState<Currency>('£')
  const [fee, setFee] = useState('')
  const [deadline, setDeadline] = useState(3)
  const [finder, setFinder] = useState(0)
  const [place, setPlace] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [q, setQ] = useState('')
  const [tip, setTip] = useState<null | 'finder' | 'total'>(null)
  const [cardStep, setCardStep] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)

  // The app picks one icon from the ask text; the person can swap it
  useEffect(() => { if (!swapped) setIcon(pickIcon(text)) }, [text, swapped])
  useEffect(() => {
    // Scroll only the row: scrollIntoView would also scroll the phone frame
    const row = rowRef.current
    const el = row?.querySelector<HTMLElement>(`[data-id="${icon}"]`)
    if (row && el) row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [icon])
  useEffect(() => { if (open) { setText(''); setFee(''); setFinder(0); setSwapped(false); setDeadline(3); setPlace(null); setCardStep(false) } }, [open])

  const feeN = Math.max(0, Math.floor(Number(fee) || 0))
  const maxFinder = Math.max(0, feeN - 1)
  useEffect(() => { if (finder > maxFinder) setFinder(maxFinder) }, [maxFinder])
  const t = totals(feeN, finder)
  const ready = text.trim().length >= 3 && feeN >= 1
  const order = useMemo(() => [icon, ...ICONS.map(i => i.id).filter(i => i !== icon)], [open])

  const post = () => {
    const go = () => {
      if (!s.hasCard) { setCardStep(true); return }
      launch()
    }
    s.requireAccount(go)
  }
  const launch = () => {
    const a: MyAsk = {
      id: 'A2312', text: text.trim(), icon, fee: feeN, finder, currency, area: place ?? 'Paddington', at: HOME, km: 0,
      endsAt: Date.now() + deadline * 3600_000, verified: s.me.verified, state: 'open',
      phase: 'searching', radiusKm: 1, scenario: (window as any).__scenario ?? 1, boosted: false, postedAt: Date.now(), declined: false,
    }
    s.setMyAsk(a); s.setOverlay(null); s.setSearchOpen(true); s.setTab('map'); s.setStack([])
    haptic()
  }

  return (
    <>
      <Sheet open={open && !cardStep} onClose={() => s.setOverlay(null)} label="Post an ask" className="post-sheet">
        <div className="sheet-body">
          <h2 className="t-title2">Post an ask</h2>

          <label className="field field-ask">
            <span className="sr-only">Ask</span>
            <textarea autoFocus maxLength={250} rows={2} placeholder="I need…" value={text} onChange={e => setText(e.target.value)} />
            {text.length > 200 && <span className="field-count t-micro">{250 - text.length}</span>}
          </label>

          <div className="icon-row" ref={rowRef} role="radiogroup" aria-label="Icon">
            {order.map(id => (
              <button key={id} data-id={id} role="radio" aria-checked={icon === id} aria-label={id.replace(/-/g, ' ')}
                className={`icon-opt ${icon === id ? 'is-on' : ''}`}
                onClick={() => { setIcon(id); setSwapped(true); haptic() }}>
                <Icon3D id={id} size={40} />
              </button>
            ))}
          </div>

          <div className="post-grid">
            {/* Location: current, searchable */}
            <button className="row-field" onClick={() => setSearching(v => !v)}>
              <span className="row-field-label t-caption t-quiet">Location</span>
              <span className="row-field-value">
                {place ? <MapPin size={18} weight="fill" className="pin-green" /> : <Crosshair size={18} weight="bold" className="pin-green" />}
                <span className="t-callout">{place ?? 'Current location'}</span>
                <CaretDown size={14} weight="bold" />
              </span>
            </button>
            <AnimatePresence>
              {searching && (
                <motion.div className="place-search" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <label className="field field-inline">
                    <MagnifyingGlass size={18} />
                    <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} autoFocus />
                  </label>
                  <div className="place-list">
                    <button onClick={() => { setPlace(null); setSearching(false) }}><Crosshair size={16} weight="bold" className="pin-green" /> Current location</button>
                    {PLACES.filter(p => p.toLowerCase().includes(q.toLowerCase())).map(p => (
                      <button key={p} onClick={() => { setPlace(p); setSearching(false) }}><MapPin size={16} /> {p}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="fee-row">
              <div className="row-field">
                <span className="row-field-label t-caption t-quiet">Fee</span>
                <span className="fee-input">
                  <span className="t-title2">{currency}</span>
                  <input inputMode="numeric" aria-label="Fee" placeholder="0" className="t-title2" value={fee}
                    onChange={e => setFee(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} />
                </span>
              </div>
              <div className="seg seg-cur" role="radiogroup" aria-label="Currency">
                {(['£', '€', '$'] as Currency[]).map(c => (
                  <button key={c} role="radio" aria-checked={c === currency} className={c === currency ? 'is-on' : ''} onClick={() => setCurrency(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="row-field">
              <span className="row-field-label t-caption t-quiet">Deadline</span>
              <div className="seg seg-full" role="radiogroup" aria-label="Deadline">
                {DEADLINES.map(h => (
                  <button key={h} role="radio" aria-checked={h === deadline} className={h === deadline ? 'is-on' : ''} onClick={() => setDeadline(h)}>{h}h</button>
                ))}
              </div>
            </div>

            <div className={`row-field ${feeN < 2 ? 'is-inactive' : ''}`}>
              <span className="row-field-label t-caption t-quiet">
                Finder’s fee
                <button className="tip-btn" aria-label="What is this?" onClick={() => setTip(tip === 'finder' ? null : 'finder')}><Question size={15} weight="bold" /></button>
              </span>
              <AnimatePresence>{tip === 'finder' && <Tip onClose={() => setTip(null)}>What someone earns for finding the person who fulfils your ask.</Tip>}</AnimatePresence>
              <div className="slider-row">
                <input type="range" min={0} max={maxFinder} step={1} value={finder} disabled={feeN < 2} aria-label="Finder’s fee"
                  style={{ ['--p' as string]: `${maxFinder ? (finder / maxFinder) * 100 : 0}%` }}
                  onChange={e => { setFinder(Number(e.target.value)); haptic() }} className="slider" />
                <span className="slider-val t-num">{money(currency, finder)}<CoinIcon /></span>
              </div>
            </div>
          </div>

          <div className="post-foot">
            <button className="total" onClick={() => setTip(tip === 'total' ? null : 'total')} aria-expanded={tip === 'total'}>
              <span className="t-caption t-quiet">Total</span>
              <span className="t-title3 t-num">{money(currency, t.total)}</span>
            </button>
            <AnimatePresence>
              {tip === 'total' && (
                <Tip onClose={() => setTip(null)} up>
                  <span className="breakdown">
                    <span>Fee</span><b>{money(currency, feeN)}</b>
                    {finder > 0 && <><span>Finder’s fee</span><b>{money(currency, finder)}</b></>}
                    <span>Platform fee (20%)</span><b>{money(currency, t.platform)}</b>
                  </span>
                </Tip>
              )}
            </AnimatePresence>
            <Button disabled={!ready} onClick={post}>Post an ask</Button>
          </div>
        </div>
      </Sheet>

      <CardSheet open={open && cardStep} total={money(currency, t.total)} onBack={() => setCardStep(false)} onDone={() => { s.setHasCard(true); launch() }} />
    </>
  )
}

export function Tip({ children, onClose, up }: { children: React.ReactNode; onClose: () => void; up?: boolean }) {
  return (
    <motion.div className={`tip ${up ? 'is-up' : ''}`} role="tooltip" onClick={onClose}
      initial={{ opacity: 0, y: up ? 6 : -6, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={spring}>
      {children}
    </motion.div>
  )
}

/** First post: a payment card. Held when posted, charged only once someone is matched */
function CardSheet({ open, total, onBack, onDone }: { open: boolean; total: string; onBack: () => void; onDone: () => void }) {
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const ok = num.replace(/\s/g, '').length >= 15 && exp.length === 5 && cvc.length >= 3
  return (
    <Sheet open={open} onClose={onBack} dark label="Add a card">
      <div className="sheet-body">
        <div className="card-hero">
          <CreditCard size={30} weight="duotone" />
        </div>
        <h2 className="t-title2">Add a card</h2>
        <p className="t-body on-dark-quiet">{total} is held when you post, and only charged once we find someone.</p>
        <div className="dark-fields">
          <input className="dark-input" inputMode="numeric" placeholder="Card number" aria-label="Card number" value={num}
            onChange={e => setNum(e.target.value.replace(/[^0-9]/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} />
          <div className="row-2">
            <input className="dark-input" inputMode="numeric" placeholder="MM/YY" aria-label="Expiry" value={exp}
              onChange={e => { const d = e.target.value.replace(/[^0-9]/g, '').slice(0, 4); setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d) }} />
            <input className="dark-input" inputMode="numeric" placeholder="CVC" aria-label="CVC" value={cvc}
              onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} />
          </div>
        </div>
        <Button full disabled={!ok} icon={<LockSimple size={18} weight="bold" />} onClick={onDone}>Post an ask</Button>
      </div>
    </Sheet>
  )
}
