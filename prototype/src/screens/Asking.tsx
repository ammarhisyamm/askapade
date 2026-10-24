import { useEffect, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react'
import { X, MapPin, Search, Minus, Plus, Users, ImagePlus, Sparkles, Eye, Check, ArrowLeft, Hourglass, Lock, ChevronRight, Zap } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Ring, Me, Person, MapBg, Tile, Avatar, Sheet, PEOPLE, spring, EASE_OUT } from '../ui'

function Num({ value, prefix = '£' }: { value: number; prefix?: string }) {
  const mv = useMotionValue(value)
  const txt = useTransform(mv, v => prefix + v.toFixed(2))
  useEffect(() => { const c = animate(mv, value, { duration: 0.35, ease: EASE_OUT }); return c.stop }, [value, mv])
  return <motion.span>{txt}</motion.span>
}

export function PostAsk() {
  const { go } = useApp()
  const [text, setText] = useState('Collect a parcel from the post office and drop it at my flat')
  const [fee, setFee] = useState(12), [cur, setCur] = useState('£'), [dl, setDl] = useState('1h'), [ff, setFf] = useState(true)
  const total = fee + 1 + (ff ? 1.5 : 0)
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'space-between', padding: '4px 20px 10px' }}><h1 className="t-title1" style={{ fontSize: 28 }}>Post an ask</h1><button className="iconbtn" onClick={() => go('home', undefined, 'down')}><X size={20} /></button></div>
      <div className="scroll pad col" style={{ gap: 16, paddingBottom: 16 }}>
        <div className="field col" style={{ gap: 10 }}>
          <AnimatePresence>{text.length > 8 && <motion.div className="row" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.16, ease: EASE_OUT }} style={{ gap: 8 }}><Tile obj="package-box" size={32} bg="var(--lime-50)" /><span className="badge success"><Sparkles size={11} />parcel</span></motion.div>}</AnimatePresence>
          <textarea value={text} onChange={e => setText(e.target.value.slice(0, 250))} rows={2} style={{ border: 0, outline: 0, resize: 'none', font: '500 16px/1.4 var(--font)', color: 'var(--ink)', background: 'none' }} />
          <span className="t-cap muted" style={{ textAlign: 'right', fontSize: 12 }}>{text.length}/250</span>
        </div>
        <div className="col" style={{ gap: 6 }}><span className="t-cap muted">Location</span><div className="field row" style={{ padding: '12px 14px' }}><MapPin size={18} color="var(--brand)" /><span className="t-callout grow">Harrow Post Office</span><Search size={18} color="var(--ink-3)" /></div></div>
        <div className="col" style={{ gap: 6 }}><span className="t-cap muted">Fee</span>
          <div className="row">
            <div className="field row grow" style={{ padding: 6 }}>
              <button className="iconbtn" style={{ width: 40, height: 40, borderRadius: 10 }} onClick={() => setFee(f => Math.max(3, f - 1))}><Minus size={18} /></button>
              <motion.span key={fee} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18, ease: EASE_OUT }} className="grow t-title2" style={{ textAlign: 'center' }}>{cur}{fee}</motion.span>
              <button className="iconbtn" style={{ width: 40, height: 40, borderRadius: 10 }} onClick={() => setFee(f => f + 1)}><Plus size={18} /></button>
            </div>
            <div className="row" style={{ padding: 4, background: 'var(--surface-2)', borderRadius: 12, gap: 2 }}>{['£', '€', '$'].map(c => <button key={c} onClick={() => setCur(c)} style={{ width: 36, height: 40, borderRadius: 9, fontWeight: 800, background: cur === c ? 'var(--brand)' : 'none', color: cur === c ? '#fff' : 'var(--ink)', transition: 'background-color 160ms' }}>{c}</button>)}</div>
          </div>
        </div>
        <div className="col" style={{ gap: 6 }}><span className="t-cap muted">Needed within</span><div className="row" style={{ gap: 8 }}>{['1h', '3h', '6h', '12h', '24h'].map(d => <button key={d} className={'chip green' + (dl === d ? ' on' : '')} onClick={() => setDl(d)}>{d}</button>)}</div></div>
        <button className="row" onClick={() => setFf(!ff)} style={{ textAlign: 'left' }}><Users size={20} /><span className="t-callout">Finder’s fee</span><span style={{ width: 22, height: 22, borderRadius: 11, boxShadow: 'inset 0 0 0 1px var(--line-2)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, color: 'var(--ink-3)' }}>?</span><span className="grow" /><span className="badge lime">£1.50</span><span className={'switch' + (ff ? ' on' : '')} /></button>
        <button className="row" style={{ height: 56, borderRadius: 12, border: '1.5px dashed var(--line-2)', justifyContent: 'center', color: 'var(--ink-3)', fontWeight: 600, fontSize: 14 }}><ImagePlus size={18} />Add a photo</button>
      </div>
      <div className="col" style={{ gap: 12, padding: '14px 20px 42px', background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="col"><span className="t-callout muted">Total</span><span className="t-cap muted" style={{ fontSize: 12, fontWeight: 500 }}>incl. £1 platform fee{ff ? ' · £1.50 finder’s fee' : ''}</span></span><span className="t-title2"><Num value={total} prefix={cur} /></span></div>
        <Btn onClick={() => go('finding', { fee, total }, 'fade')}>Post ask</Btn>
      </div>
      <HomeBar />
    </div>
  )
}

const LINES = ['Hop is finding someone…', 'Sharing with people nearby', 'Ellie is having a look', 'One moment…']

export function Finding(p: { boosted?: boolean; total?: number }) {
  const { go, scenario } = useApp()
  const [line, setLine] = useState(0), [viewed, setViewed] = useState(0), [boost, setBoost] = useState(false), [radius, setRadius] = useState(3), [top, setTop] = useState(3)
  const boosted = !!p.boosted
  useEffect(() => { const t = setInterval(() => setLine(l => (l + 1) % LINES.length), 2200); return () => clearInterval(t) }, [])
  useEffect(() => { const t = setInterval(() => setViewed(v => Math.min(v + 1, boosted ? 14 : 5)), 900); return () => clearInterval(t) }, [boosted])
  useEffect(() => {
    const t = setTimeout(() => { if (scenario === 2 && !boosted) setBoost(true); else go('offers', { n: boosted ? 5 : 2, total: p.total }, 'push') }, boosted ? 3800 : 4800)
    return () => clearTimeout(t)
  }, [scenario, boosted, go, p.total])
  const nearby = boosted ? 32 : 8
  const ringD = boosted ? 330 : 230
  const people: [string, number, number][] = [['Tom', 117, 236], ['Priya', 281, 203], ['Ellie', 257, 388], ['Dan', 109, 397], ['Sam', 203, 127], ...(boosted ? [['Grace', 330, 120], ['Leo', 60, 150]] as [string, number, number][] : [])]
  return (
    <div className="screen" style={{ justifyContent: 'flex-end' }}>
      <MapBg area="wealdstone" />
      <div className="fade-top" />
      {!boost && [0, 0.8, 1.6].map(d => <span key={d} className="ripple" style={{ left: 195, top: 300, animationDelay: `${d}s` }} />)}
      <Ring x={195} y={300} d={boost ? 120 + radius * 70 : ringD} label={boost ? `${radius} km` : boosted ? '3 km' : '1 km'} />
      {(scenario === 2 && !boosted ? people.slice(3) : people).map(([w, x, y], i) => <Person key={w} who={w} x={x} y={y} delay={0.4 + i * 0.5} />)}
      <Me x={195} y={300} />
      {!boost && <div style={{ position: 'absolute', left: 225, top: 180, zIndex: 8 }}><Hop state="searching" size={96} bob /></div>}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 }}><StatusBar /></div>
      <div className="row" style={{ position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', height: 40, padding: '0 16px', borderRadius: 20, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', zIndex: 20, fontWeight: 700, fontSize: 14, gap: 8 }}><span className="livedot" />Sharing within {boosted ? 3 : 1} km</div>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }}
        style={{ position: 'relative', zIndex: 20, margin: '0 12px 34px', background: '#fff', borderRadius: 24, padding: '20px 20px 10px', boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ height: 58, position: 'relative' }}>
          <AnimatePresence initial={false}><motion.div key={line} className="t-title2" style={{ fontSize: 21, position: 'absolute', left: 0, top: 0 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: EASE_OUT }}>{LINES[line]}</motion.div></AnimatePresence>
          <div className="t-cap muted" style={{ fontSize: 14, fontWeight: 500, position: 'absolute', left: 0, top: 32 }}>Shared with {nearby} people nearby</div>
        </div>
        <div className="indeterminate"><i /></div>
        <div className="row" style={{ gap: 8 }}><span className="badge secondary"><Users size={12} />{nearby} nearby</span><span className="badge secondary"><Eye size={12} />{viewed} viewed</span>{scenario === 1 || boosted ? viewed > 3 && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="badge success"><Check size={12} />1 offer</motion.span> : null}</div>
        <div className="row" style={{ padding: 8, paddingRight: 14, borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)' }}><Tile obj="package-box" size={36} /><span className="t-cap grow" style={{ fontSize: 14 }}>Parcel pickup · 1h</span><span className="t-head" style={{ fontSize: 16 }}>£{boosted ? 15 : 12}</span></div>
        <Btn kind="ghost" onClick={() => go('home', undefined, 'down')}>Cancel ask</Btn>
      </motion.div>
      <HomeBar />
      <Sheet open={boost} z={50} scrim={false}>
        <div className="row" style={{ gap: 12 }}><Hop state="sad" size={76} /><span className="col grow" style={{ gap: 4 }}><span className="t-title2">No one free yet</span><span className="t-cap muted" style={{ fontSize: 14, fontWeight: 500 }}>Reach further or add a little more.</span></span></div>
        <div className="col" style={{ gap: 10, marginTop: 18 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-callout">Radius</span><span className="t-callout green" style={{ fontWeight: 800 }}>{radius} km</span></div>
          <input type="range" min={1} max={5} step={1} value={radius} onChange={e => setRadius(+e.target.value)} style={{ accentColor: '#008000', width: '100%' }} />
          <div className="row t-cap muted" style={{ justifyContent: 'space-between', fontSize: 12 }}><span>1 km</span><span>5 km</span></div>
        </div>
        <div className="col" style={{ gap: 10, marginTop: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-callout">Fee</span><span className="t-callout green" style={{ fontWeight: 800 }}>£12 → £{12 + top}</span></div>
          <div className="row" style={{ gap: 8 }}>{[0, 2, 3, 5].map(v => <button key={v} className={'chip' + (top === v ? ' on' : '')} onClick={() => setTop(v)}>{v ? `+£${v}` : 'Same'}</button>)}</div>
        </div>
        <div className="row t-cap" style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--surface-2)', margin: '16px 0 14px', fontSize: 14 }}><Users size={16} />Reaches about {radius * 8 + top * 2} more people</div>
        <Btn icon={<Zap size={18} />} onClick={() => go('finding', { boosted: true, total: p.total }, 'fade')}>Boost & retry · £{12 + top}</Btn>
        <Btn kind="ghost" onClick={() => go('home', undefined, 'down')}>Cancel ask</Btn>
      </Sheet>
    </div>
  )
}

const OFFERS = [
  { who: 'Tom', meta: '4.8 · 126 asks · 450 m away', note: '“Can be there in 6 min.”', badge: 'Closest' },
  { who: 'Priya', meta: '5.0 · 212 asks · 900 m away', note: '“Free right now — happy to help.”', badge: 'Top rated' },
]
const OFFERS5 = [
  { who: 'Sam', meta: '4.9 · 88 asks · 1.2 km', note: '“On my bike — 8 min.”', badge: 'Fastest' },
  { who: 'Grace', meta: '5.0 · 301 asks · 2.1 km', badge: 'Top rated' },
  { who: 'Dan', meta: '4.7 · 40 asks · 1.8 km' }, { who: 'Leo', meta: '4.8 · 65 asks · 2.6 km' }, { who: 'Ellie', meta: '4.6 · 19 asks · 2.9 km' },
]

export function Offers(p: { n?: number; total?: number }) {
  const { go } = useApp()
  const list = (p.n === 5 ? OFFERS5 : OFFERS) as { who: string; meta: string; note?: string; badge?: string }[]
  const [sel, setSel] = useState(0), [hold, setHold] = useState(299), [checkout, setCheckout] = useState(false), [paying, setPaying] = useState<0 | 1 | 2>(0)
  useEffect(() => { const t = setInterval(() => setHold(h => Math.max(0, h - 1)), 1000); return () => clearInterval(t) }, [])
  const who = list[sel].who
  const fee = p.n === 5 ? 15 : 12
  const total = fee + 2.5
  const pay = () => { setPaying(1); setTimeout(() => setPaying(2), 900); setTimeout(() => go('chat', { role: 'asker', who, fee }, 'push'), 1500) }
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'space-between', height: 44 }}><button className="iconbtn" onClick={() => go('home', undefined, 'back')}><ArrowLeft size={20} /></button><span className="row" style={{ gap: 6 }}>{p.n === 5 && <span className="badge success"><Zap size={11} />Boosted · 3 km</span>}<span className="badge warning"><Hourglass size={11} />Held {Math.floor(hold / 60)}:{String(hold % 60).padStart(2, '0')}</span></span></div>
      <div className="pad row" style={{ padding: '8px 20px 14px' }}><span className="col grow" style={{ gap: 4 }}><span className="t-title1">{list.length} offers</span><span className="t-body muted">{p.n === 5 ? 'Boost worked. Pick who helps.' : 'Pick who helps.'}</span></span><Hop state="happy" size={76} bob /></div>
      <div className="scroll pad col" style={{ gap: 8 }}>
        {list.map((o, i) => (
          <motion.button key={o.who} onClick={() => setSel(i)} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE_OUT, delay: 0.15 + i * 0.05 }} whileTap={{ scale: 0.98 }}
            className="card col" style={{ padding: 14, gap: 8, textAlign: 'left', boxShadow: sel === i ? 'inset 0 0 0 2px var(--brand)' : 'inset 0 0 0 1px var(--line)', background: sel === i ? 'var(--lime-50)' : '#fff', transition: 'box-shadow 160ms, background-color 160ms' }}>
            <span className="row"><Avatar who={o.who} size={42} /><span className="col grow" style={{ gap: 2 }}><span className="row" style={{ gap: 6 }}><span className="t-callout" style={{ fontWeight: 700 }}>{PEOPLE[o.who].name}</span>{o.badge && <span className="badge lime" style={{ height: 20, fontSize: 11 }}>{o.badge}</span>}</span><span className="t-cap muted" style={{ fontSize: 12 }}>★ {o.meta}</span></span>
              <span style={{ width: 24, height: 24, borderRadius: 12, display: 'grid', placeItems: 'center', background: sel === i ? 'var(--brand)' : 'none', boxShadow: sel === i ? 'none' : 'inset 0 0 0 1.5px var(--line-2)', transition: 'background-color 160ms' }}>{sel === i && <Check size={14} color="#fff" strokeWidth={3} />}</span></span>
            {o.note && <span className="t-cap ink2" style={{ fontSize: 14, fontWeight: 500 }}>{o.note}</span>}
          </motion.button>
        ))}
      </div>
      <div className="pad" style={{ padding: '10px 20px 42px' }}><Btn onClick={() => setCheckout(true)}>Continue with {who}</Btn></div>
      <HomeBar />
      <Sheet open={checkout} onClose={() => paying === 0 && setCheckout(false)}>
        <div className="col" style={{ gap: 16 }}>
          <span className="t-title2">Checkout</span>
          <div className="row"><Avatar who={who} size={40} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>{PEOPLE[who].name}</span><span className="t-cap muted">Parcel pickup · within 1h</span></span></div>
          <div className="col" style={{ gap: 10, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 14 }}>
            {[['Ask', fee], ['Platform fee', 1], ['Finder’s fee', 1.5]].map(([l, v]) => <div key={l as string} className="row t-cap" style={{ justifyContent: 'space-between', fontSize: 14 }}><span className="muted">{l}</span><span>£{(v as number).toFixed(2)}</span></div>)}
            <div className="row" style={{ justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--line)' }}><span className="t-callout" style={{ fontWeight: 800 }}>Total</span><span className="t-head">£{total.toFixed(2)}</span></div>
          </div>
          <button className="row" style={{ padding: '12px 14px', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)' }}><span style={{ width: 40, height: 26, borderRadius: 6, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>Pay</span><span className="t-callout grow" style={{ textAlign: 'left' }}>Apple Pay</span><ChevronRight size={16} color="var(--ink-3)" /></button>
          <div className="row t-cap" style={{ padding: '10px 12px', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--line)', fontSize: 14 }}><Lock size={16} />Held safely until you release it.</div>
          <Btn kind="invert" onClick={pay} disabled={paying > 0 && false}>
            <AnimatePresence mode="wait" initial={false}>
              {paying === 0 && <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Pay £{total.toFixed(2)}</motion.span>}
              {paying === 1 && <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' } }} style={{ width: 20, height: 20, borderRadius: 10, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'block' }} />}
              {paying === 2 && <motion.span key="c" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="row" style={{ gap: 6 }}><Check size={20} strokeWidth={3} />Paid · held</motion.span>}
            </AnimatePresence>
          </Btn>
        </div>
      </Sheet>
    </div>
  )
}
