import { useEffect, useState } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react'
import { Navigation, X, MapPin, Search, Minus, Plus, Users, ImagePlus, Sparkles, Eye, Check, ArrowLeft, Hourglass, Lock, ChevronRight, ChevronDown, Zap, Mic, Pencil } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Ring, Me, Person, MapCanvas, Tile, Avatar, Sheet, SwipeConfirm, ListSheet, Pin, PEOPLE, EASE_OUT } from '../ui'
import { ASK_ICONS, FALLBACK, IDEAS, PLACEHOLDERS, byObj, pickIcon, posted } from '../askIcons'

function Num({ value, prefix = '£' }: { value: number; prefix?: string }) {
  const mv = useMotionValue(value)
  const txt = useTransform(mv, v => prefix + v.toFixed(2))
  useEffect(() => { const c = animate(mv, value, { duration: 0.35, ease: EASE_OUT }); return c.stop }, [value, mv])
  return <motion.span>{txt}</motion.span>
}

// Types out example asks in the empty field, Platen-style
function useTypewriter(lines: string[], on: boolean) {
  const [s, setS] = useState({ i: 0, n: 0, back: false })
  useEffect(() => {
    if (!on) return
    const full = lines[s.i]
    const done = !s.back && s.n === full.length, gone = s.back && s.n === 0
    const t = setTimeout(() => setS(done ? { ...s, back: true } : gone ? { i: (s.i + 1) % lines.length, n: 0, back: false } : { ...s, n: s.n + (s.back ? -1 : 1) }), done ? 1500 : gone ? 250 : s.back ? 18 : 55)
    return () => clearTimeout(t)
  }, [s, on, lines])
  return lines[s.i].slice(0, s.n)
}

export function PostAsk(p: { tip?: boolean; loc?: boolean; filled?: boolean; pick?: boolean }) {
  const { go } = useApp()
  const prefill = p.filled || p.tip || p.loc || p.pick
  const [text, setText] = useState(prefill ? 'Collect a parcel from the post office and drop it at my flat' : '')
  const [manual, setManual] = useState<string | null>(null), [pick, setPick] = useState(!!p.pick), [iq, setIq] = useState(''), [listening, setListening] = useState(false)
  const [fee, setFee] = useState(prefill ? 10 : 12), [cur, setCur] = useState('£'), [dl, setDl] = useState('1h'), [ff, setFf] = useState(true), [tip, setTip] = useState(!!p.tip)
  const [loc, setLoc] = useState('Harrow Post Office'), [locSheet, setLocSheet] = useState(!!p.loc), [q, setQ] = useState(''), [photos, setPhotos] = useState<string[]>([])
  const has = text.trim().length > 2
  const icon = manual ? byObj(manual) : has ? pickIcon(text) : FALLBACK
  const typed = useTypewriter(PLACEHOLDERS, !text && !listening)
  const total = fee + 1 + (ff ? 1.5 : 0)
  const [lo, hi] = icon.fee ?? [5, 15], mid = Math.round((lo + hi) / 2)
  // Dictation stand-in: words land one by one while the mic is live
  useEffect(() => {
    if (!listening) return
    const words = 'Pick up my prescription from Boots on Station Road'.split(' ')
    let k = 0
    setText('')
    const t = setInterval(() => { k++; setText(words.slice(0, k).join(' ')); if (k >= words.length) { clearInterval(t); setListening(false) } }, 220)
    return () => clearInterval(t)
  }, [listening])
  const icons = ASK_ICONS.filter(i => !iq || (i.label + ' ' + i.words.join(' ')).toLowerCase().includes(iq.toLowerCase()))
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'space-between', padding: '4px 20px 10px' }}><h1 className="t-title1" style={{ fontSize: 28 }}>Post an ask</h1><button className="iconbtn" onClick={() => go('home', undefined, 'down')}><X size={20} /></button></div>
      <div className="scroll pad col" style={{ gap: 16, paddingBottom: 16 }}>
        <div className="field col" style={{ gap: 12, boxShadow: has ? 'inset 0 0 0 1.5px var(--brand)' : undefined, transition: 'box-shadow 200ms' }}>
          <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPick(true)} aria-label="Change icon" style={{ position: 'relative', flex: 'none', width: 56, height: 56 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={icon.obj} initial={{ scale: 0.3, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.3, rotate: 25, opacity: 0 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.5 }} style={{ display: 'block' }}>
                  <Tile obj={icon.obj} size={56} bg={has || manual ? 'var(--lime-50)' : 'var(--surface-2)'} />
                </motion.span>
              </AnimatePresence>
              <span style={{ position: 'absolute', right: -4, bottom: -4, width: 22, height: 22, borderRadius: 11, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 2px #fff' }}><Pencil size={11} /></span>
            </motion.button>
            <div className="grow" style={{ position: 'relative', minHeight: 56 }}>
              {!text && <span aria-hidden style={{ position: 'absolute', inset: 0, font: '500 17px/1.4 var(--font)', color: 'var(--ink-3)', pointerEvents: 'none' }}>{listening ? 'Listening…' : typed}<motion.i animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }} style={{ display: 'inline-block', width: 2, height: 18, background: 'var(--brand)', verticalAlign: -3, marginLeft: 1 }} /></span>}
              <textarea value={text} onChange={e => setText(e.target.value.slice(0, 250))} rows={3} aria-label="What do you need?" style={{ width: '100%', border: 0, outline: 0, resize: 'none', font: '500 17px/1.4 var(--font)', color: 'var(--ink)', background: 'none', padding: 0 }} />
            </div>
          </div>
          <div className="row" style={{ gap: 8, minHeight: 36 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {has || manual
                ? <motion.button key={'b' + icon.obj} onClick={() => setPick(true)} initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', duration: 0.35, bounce: 0.35 }} className="badge success" style={{ height: 28, paddingLeft: 4 }}>
                    {manual ? <Check size={13} style={{ marginLeft: 4 }} /> : <img src="/hop/happy.svg" width={20} height={20} alt="" />}{manual ? icon.label : `Hop picked ${icon.label}`}<ChevronDown size={13} />
                  </motion.button>
                : <motion.span key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="t-cap muted" style={{ fontSize: 13, fontWeight: 500 }}>Hop picks the map icon as you type</motion.span>}
            </AnimatePresence>
            <span className="grow" />
            {has && <span className="t-cap muted" style={{ fontSize: 12 }}>{text.length}/250</span>}
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setListening(l => !l)} aria-label={listening ? 'Stop dictation' : 'Dictate'} style={{ position: 'relative', width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: listening ? 'var(--brand)' : 'var(--surface-2)', color: listening ? '#fff' : 'var(--ink)', transition: 'background-color 160ms' }}>
              {listening && <motion.span animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'var(--brand)' }} />}
              <Mic size={17} style={{ position: 'relative' }} />
            </motion.button>
          </div>
        </div>
        <AnimatePresence initial={false}>{!text && !listening && (
          <motion.div key="ideas" className="col" style={{ gap: 8, overflow: 'hidden', flexShrink: 0 }} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: EASE_OUT }}>
            <span className="t-cap muted">Quick ideas</span>
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {IDEAS.map((d, i) => (
                <motion.button key={d.obj} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035, duration: 0.25, ease: EASE_OUT }} whileTap={{ scale: 0.94 }}
                  onClick={() => { setText(d.t); setFee(d.fee); setManual(null) }} className="row" style={{ height: 40, padding: '0 12px 0 4px', gap: 6, borderRadius: 12, background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--line-2)', fontWeight: 700, fontSize: 14 }}>
                  <img src={`/icons/${d.obj}.png`} width={30} height={30} alt="" />{byObj(d.obj).label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}</AnimatePresence>
        <div className="col" style={{ gap: 6 }}><span className="t-cap muted">Where</span>
          <motion.div role="button" tabIndex={0} aria-label="Change location" whileTap={{ scale: 0.98 }} onClick={() => setLocSheet(true)} style={{ cursor: 'pointer', position: 'relative', flexShrink: 0, height: 128, borderRadius: 14, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--line-2)', textAlign: 'left' }}>
            <MapCanvas area="harrow" pan={false} />
            <div style={{ position: 'absolute', left: 'calc(50% - 24px)', top: 12, pointerEvents: 'none' }}><Pin key={icon.obj} x={0} y={0} obj={icon.obj} price={`${cur}${fee}`} sel /></div>
            <div className="row" style={{ position: 'absolute', left: 8, right: 8, bottom: 8, height: 36, padding: '0 10px', borderRadius: 10, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', gap: 8 }}>
              <MapPin size={16} color="var(--brand)" /><AnimatePresence mode="popLayout" initial={false}><motion.span key={loc} className="t-cap grow" style={{ fontSize: 14 }} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>{loc}</motion.span></AnimatePresence><ChevronRight size={16} color="var(--ink-3)" />
            </div>
          </motion.div>
        </div>
        <div className="col" style={{ gap: 6 }}><span className="t-cap muted">Fee</span>
          <div className="row">
            <div className="field row grow" style={{ padding: 6 }}>
              <button className="iconbtn" style={{ width: 40, height: 40, borderRadius: 10 }} onClick={() => setFee(f => Math.max(3, f - 1))}><Minus size={18} /></button>
              <motion.span key={fee} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18, ease: EASE_OUT }} className="grow t-title2" style={{ textAlign: 'center' }}>{cur}{fee}</motion.span>
              <button className="iconbtn" style={{ width: 40, height: 40, borderRadius: 10 }} onClick={() => setFee(f => f + 1)}><Plus size={18} /></button>
            </div>
            <div className="row" style={{ padding: 4, background: 'var(--surface-2)', borderRadius: 12, gap: 2 }}>{['£', '€', '$'].map(c => <button key={c} onClick={() => setCur(c)} style={{ width: 36, height: 40, borderRadius: 9, fontWeight: 800, background: cur === c ? 'var(--brand)' : 'none', color: cur === c ? '#fff' : 'var(--ink)', transition: 'background-color 160ms' }}>{c}</button>)}</div>
          </div>
          <AnimatePresence initial={false}>{(has || manual) && (
            <motion.div key={icon.obj} className="row" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE_OUT }} style={{ gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', minHeight: 28 }}>
              <Sparkles size={13} color="var(--brand)" /><span className="grow">{icon.label} asks usually get {cur}{lo}–{hi}</span>
              {(fee < lo || fee > hi) && <motion.button whileTap={{ scale: 0.92 }} onClick={() => setFee(mid)} className="badge success" style={{ height: 28 }}>Use {cur}{mid}</motion.button>}
            </motion.div>
          )}</AnimatePresence>
        </div>
        <div className="col" style={{ gap: 6 }}><span className="t-cap muted">Needed within</span><div className="row" style={{ gap: 8 }}>{['1h', '3h', '6h', '12h', '24h'].map(d => <button key={d} className={'chip green' + (dl === d ? ' on' : '')} onClick={() => setDl(d)}>{d}</button>)}</div></div>
        <AnimatePresence>{tip && <motion.div key="tip-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setTip(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 4 }} />}</AnimatePresence>
        <div style={{ position: 'relative', zIndex: tip ? 5 : 'auto' }}>
          <div className="row" style={{ background: tip ? '#fff' : 'transparent', borderRadius: 14, margin: tip ? '-8px -10px' : 0, padding: tip ? '8px 10px' : 0, transition: 'background-color 200ms' }}>
            <button className="row" onClick={() => setFf(!ff)} style={{ textAlign: 'left', whiteSpace: 'nowrap' }}><Users size={20} /><span className="t-callout">Finder’s fee</span></button>
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setTip(t => !t)} aria-label="What is a finder’s fee?" style={{ width: 26, height: 26, borderRadius: 13, boxShadow: `inset 0 0 0 1.5px ${tip ? 'var(--brand)' : 'var(--line-2)'}`, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13, color: tip ? 'var(--brand)' : 'var(--ink-3)' }}>?</motion.button>
            <span className="grow" /><span className="badge lime">£1.50</span><button onClick={() => setFf(!ff)} className={'switch' + (ff ? ' on' : '')} aria-label="Finder’s fee" />
          </div>
          <AnimatePresence>{tip && (
            <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.18, ease: EASE_OUT }} onClick={() => setTip(false)}
              style={{ position: 'absolute', left: 0, right: 40, top: 44, zIndex: 6, padding: '12px 14px', borderRadius: 14, background: 'var(--ink)', color: '#fff', fontWeight: 500, fontSize: 14, lineHeight: 1.35, transformOrigin: '30% 0' }}>
              <span style={{ position: 'absolute', top: -5, left: 132, width: 10, height: 10, background: 'var(--ink)', transform: 'rotate(45deg)' }} />
              Paid to whoever finds your helper — only if the ask gets done.
            </motion.div>
          )}</AnimatePresence>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <AnimatePresence>{photos.map(ph => (
            <motion.div key={ph} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.4 }} style={{ position: 'relative', width: 56, height: 56, borderRadius: 12, background: `center/cover url(${ph})`, flex: 'none' }}>
              <button onClick={() => setPhotos(x => x.filter(y => y !== ph))} aria-label="Remove photo" style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center' }}><X size={12} /></button>
            </motion.div>
          ))}</AnimatePresence>
          <motion.button layout whileTap={{ scale: 0.97 }} onClick={() => setPhotos(x => x.length < 3 ? [...x, ['/icons/package-box.png', '/icons/document.png', '/icons/key.png'][x.length]] : x)} className="row grow" style={{ height: 56, borderRadius: 12, border: '1.5px dashed var(--line-2)', justifyContent: 'center', color: 'var(--ink-3)', fontWeight: 600, fontSize: 14 }}><ImagePlus size={18} />{photos.length ? 'Add another' : 'Add a photo'}</motion.button>
        </div>
      </div>
      <div className="col" style={{ gap: 12, padding: '14px 20px calc(var(--sab) + 8px)', background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="col"><span className="t-callout muted">Total</span><span className="t-cap muted" style={{ fontSize: 12, fontWeight: 500 }}>incl. £1 platform fee{ff ? ' · £1.50 finder’s fee' : ''}</span></span><span className="t-title2"><Num value={total} prefix={cur} /></span></div>
        <Btn disabled={!has} onClick={() => { Object.assign(posted, { obj: icon.obj, label: icon.label, fee, cur, dl }); go('finding', { fee, total }, 'fade') }}>Post ask</Btn>
      </div>
      <HomeBar />
      <Sheet open={pick} onClose={() => setPick(false)} z={60}>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-title2">Map icon</span>
          {manual && <motion.button whileTap={{ scale: 0.94 }} onClick={() => { setManual(null); setPick(false) }} className="badge success" style={{ height: 30, paddingLeft: 4 }}><img src="/hop/happy.svg" width={22} height={22} alt="" />Let Hop pick</motion.button>}</div>
        <div className="row" style={{ height: 46, borderRadius: 12, background: 'var(--surface-2)', padding: '0 12px', gap: 8, margin: '14px 0 12px' }}><Search size={18} color="var(--ink-3)" /><input value={iq} onChange={e => setIq(e.target.value)} placeholder={`Search ${ASK_ICONS.length} icons`} style={{ border: 0, outline: 0, background: 'none', font: '500 16px var(--font)', flex: 1, minWidth: 0 }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 8px', maxHeight: '46vh', overflowY: 'auto', margin: '0 -4px', padding: '2px 4px 4px' }}>
          {icons.map(ic => {
            const on = ic.obj === icon.obj
            return (
              <motion.button key={ic.obj} layout whileTap={{ scale: 0.9 }} onClick={() => { setManual(ic.obj); setPick(false) }} className="col" style={{ alignItems: 'center', gap: 4 }}>
                <span style={{ borderRadius: 18, boxShadow: on ? '0 0 0 2px var(--brand)' : 'none', transition: 'box-shadow 160ms' }}><Tile obj={ic.obj} size={60} bg={on ? 'var(--lime-50)' : undefined} /></span>
                <span style={{ fontSize: 11, fontWeight: 700, color: on ? 'var(--brand)' : 'var(--ink-2)', textAlign: 'center', lineHeight: 1.2 }}>{ic.label}</span>
              </motion.button>
            )
          })}
          {!icons.length && <span className="t-cap muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 20 }}>No match. Hop will use the mystery box.</span>}
        </div>
      </Sheet>
      <Sheet open={locSheet} onClose={() => setLocSheet(false)} z={60}>
        <span className="t-title2">Where?</span>
        <div className="row" style={{ height: 46, borderRadius: 12, background: 'var(--surface-2)', padding: '0 12px', gap: 8, margin: '14px 0 10px' }}><Search size={18} color="var(--ink-3)" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search a place or address" style={{ border: 0, outline: 0, background: 'none', font: '500 16px var(--font)', flex: 1, minWidth: 0 }} /></div>
        <div style={{ position: 'relative', height: 150, borderRadius: 16, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          <MapCanvas area="harrow" />
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none' }}><MapPin size={34} color="#fff" fill="var(--brand)" strokeWidth={1.5} /></motion.div>
          <span className="badge invert" style={{ position: 'absolute', left: 10, bottom: 10, pointerEvents: 'none' }}>Drag the map to move the pin</span>
        </div>
        <div className="col" style={{ marginTop: 6 }}>
          {[['Use current location', 'Harrow · 12 m accuracy', true], ['Harrow Post Office', 'Station Rd · 350 m'], ['Home', '14 Elm Grove · 0 m'], ['St Ann’s Shopping Centre', 'St Ann’s Rd · 600 m'], ['Harrow-on-the-Hill station', 'College Rd · 800 m']].filter(([t]) => !q || (t as string).toLowerCase().includes(q.toLowerCase())).map(([t, sub, cur]) => (
            <motion.button key={t as string} whileTap={{ scale: 0.98 }} className="row" style={{ padding: '11px 0', textAlign: 'left', borderBottom: '1px solid var(--line)' }} onClick={() => { setLoc(cur ? 'Current location · Harrow' : t as string); setLocSheet(false) }}>
              <span className="tile" style={{ width: 36, height: 36, borderRadius: 10, background: cur ? 'var(--lime-50)' : undefined }}>{cur ? <Navigation size={16} color="var(--brand)" /> : <MapPin size={16} />}</span>
              <span className="col grow"><span className="t-callout" style={{ color: cur ? 'var(--brand)' : undefined }}>{t as string}</span><span className="t-cap muted" style={{ fontSize: 12 }}>{sub as string}</span></span>
              {loc === t && <Check size={18} color="var(--brand)" />}
            </motion.button>
          ))}
        </div>
        <Btn style={{ marginTop: 14 }} onClick={() => { setLoc('Pinned spot · Harrow'); setLocSheet(false) }}>Set pinned location</Btn>
      </Sheet>
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
  // Methods-style: offers pop in one by one above the card before the offers screen opens
  const incoming = boosted ? ['Sam', 'Grace', 'Dan'] : ['Tom', 'Priya']
  const [arrived, setArrived] = useState<string[]>([])
  useEffect(() => {
    if (scenario === 2 && !boosted) { const t = setTimeout(() => setBoost(true), 4800); return () => clearTimeout(t) }
    const ts = incoming.map((w, i) => setTimeout(() => setArrived(a => [...a, w]), 2200 + i * 650))
    ts.push(setTimeout(() => go('offers', { n: boosted ? 5 : 2, total: p.total }, 'push'), 2200 + incoming.length * 650 + 900))
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, boosted, go, p.total])
  const nearby = boosted ? 32 : 8
  const ringD = boosted ? 330 : 230
  const people: [string, number, number][] = [['Tom', 117, 236], ['Priya', 281, 203], ['Ellie', 257, 388], ['Dan', 109, 397], ['Sam', 203, 127], ...(boosted ? [['Grace', 330, 120], ['Leo', 60, 150]] as [string, number, number][] : [])]
  return (
    <div className="screen" style={{ justifyContent: 'flex-end' }}>
      <MapCanvas area="wealdstone">
        {!boost && [0, 0.8, 1.6].map(d => <span key={d} className="ripple" style={{ left: 195, top: 300, animationDelay: `${d}s` }} />)}
        <Ring x={195} y={300} d={boost ? 120 + radius * 70 : ringD} label={boost ? `${radius} km` : boosted ? '3 km' : '1 km'} />
        {(scenario === 2 && !boosted ? people.slice(3) : people).map(([w, x, y], i) => <Person key={w} who={w} x={x} y={y} delay={0.4 + i * 0.5} />)}
        <Me x={195} y={300} />
        <Pin x={195} y={286} obj={posted.obj} price={`${posted.cur}${posted.fee + (boosted ? 3 : 0)}`} sel delay={0.15} />
      </MapCanvas>
      <div className="fade-top" />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 }}><StatusBar /></div>
      <div className="row" style={{ position: 'absolute', top: 'calc(var(--sat) + 4px)', left: '50%', transform: 'translateX(-50%)', height: 40, padding: '0 16px', borderRadius: 20, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--e-2)', zIndex: 20, fontWeight: 700, fontSize: 14, gap: 8 }}><span className="livedot" />Sharing within {boosted ? 3 : 1} km</div>
      <div className="col" style={{ position: 'relative', zIndex: 21, gap: 6, margin: '0 112px 30px 20px' }}>
        <AnimatePresence>{arrived.map((w, i) => (
          <motion.div key={w} layout initial={{ scale: 0.6, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.4 }}
            className="row" style={{ padding: '8px 12px 8px 8px', borderRadius: 18, background: '#fff', boxShadow: 'var(--e-2)', transformOrigin: '50% 100%' }}>
            <Avatar who={w} size={30} /><span className="t-cap grow" style={{ fontSize: 14 }}><b>{PEOPLE[w].name}</b> offered · {['450 m', '900 m', '1.2 km'][i]}</span><span className="badge success">new</span>
          </motion.div>
        ))}</AnimatePresence>
      </div>
      <motion.div layout initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }}
        style={{ position: 'relative', zIndex: 20, margin: '0 12px var(--sab)', background: '#fff', borderRadius: 24, padding: '20px 20px 10px', boxShadow: 'var(--e-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!boost && <div style={{ position: 'absolute', right: 14, top: -62, zIndex: 2 }}><Hop state={arrived.length ? 'happy' : 'searching'} size={92} /></div>}
        <div style={{ height: 58, position: 'relative', marginRight: 84 }}>
          <AnimatePresence initial={false}><motion.div key={line} className="t-title2" style={{ fontSize: 21, position: 'absolute', left: 0, top: 0 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: EASE_OUT }}>{LINES[line]}</motion.div></AnimatePresence>
          <div className="t-cap muted" style={{ fontSize: 14, fontWeight: 500, position: 'absolute', left: 0, top: 32 }}>Shared with {nearby} people nearby</div>
        </div>
        <div className="indeterminate"><i /></div>
        <div className="row" style={{ gap: 8 }}><span className="badge secondary"><Users size={12} />{nearby} nearby</span><span className="badge secondary"><Eye size={12} />{viewed} viewed</span>{arrived.length > 0 && <motion.span key={arrived.length} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.5 }} className="badge success"><Check size={12} />{arrived.length} offer{arrived.length > 1 ? 's' : ''}</motion.span>}</div>
        <div className="row" style={{ padding: 8, paddingRight: 14, borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)' }}><Tile obj={posted.obj} size={36} bg="var(--lime-50)" /><span className="t-cap grow" style={{ fontSize: 14 }}>{posted.label} · {posted.dl}</span><span className="t-head" style={{ fontSize: 16 }}>{posted.cur}{posted.fee + (boosted ? 3 : 0)}</span></div>
        <Btn kind="ghost" onClick={() => go('home', undefined, 'down')}>Cancel ask</Btn>
      </motion.div>
      <HomeBar />
      <Sheet open={boost} z={50}>
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

export function Offers(p: { n?: number; total?: number; checkout?: boolean }) {
  const { go } = useApp()
  const list = (p.n === 5 ? OFFERS5 : OFFERS) as { who: string; meta: string; note?: string; badge?: string }[]
  const [sel, setSel] = useState(0), [hold, setHold] = useState(299), [checkout, setCheckout] = useState(!!p.checkout), [method, setMethod] = useState('Apple Pay'), [methodSheet, setMethodSheet] = useState(false)
  useEffect(() => { const t = setInterval(() => setHold(h => Math.max(0, h - 1)), 1000); return () => clearInterval(t) }, [])
  const who = list[sel].who
  const fee = p.n === 5 ? 15 : 12
  const total = fee + 2.5
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'space-between', height: 44 }}><button className="iconbtn" onClick={() => go('home', undefined, 'back')}><ArrowLeft size={20} /></button><span className="row" style={{ gap: 6 }}>{p.n === 5 && <span className="badge success"><Zap size={11} />Boosted · 3 km</span>}<span className="badge warning"><Hourglass size={11} />Held {Math.floor(hold / 60)}:{String(hold % 60).padStart(2, '0')}</span></span></div>
      <div className="pad row" style={{ padding: '8px 20px 14px' }}><span className="col grow" style={{ gap: 4 }}><span className="t-title1">{list.length} offers</span><span className="t-body muted">{p.n === 5 ? 'Boost worked. Pick who helps.' : 'Pick who helps.'}</span></span><Hop state="happy" size={76} bob /></div>
      <div className="scroll pad col" style={{ gap: 8 }}>
        {list.map((o, i) => (
          <motion.button key={o.who} onClick={() => setSel(i)} initial={{ opacity: 0, y: -12, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.3, delay: 0.15 + i * 0.06 }} whileTap={{ scale: 0.98 }}
            className="card col" style={{ position: 'relative', padding: 14, gap: 8, textAlign: 'left' }}>
            {sel === i && <motion.span layoutId="offer-sel" transition={{ type: 'spring', duration: 0.45, bounce: 0.22 }} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'var(--lime-50)', boxShadow: 'inset 0 0 0 2px var(--brand)' }} />}
            <span className="row" style={{ position: 'relative' }}><Avatar who={o.who} size={42} /><span className="col grow" style={{ gap: 2 }}><span className="row" style={{ gap: 6 }}><span className="t-callout" style={{ fontWeight: 700 }}>{PEOPLE[o.who].name}</span>{o.badge && <span className="badge lime" style={{ height: 20, fontSize: 11 }}>{o.badge}</span>}</span><span className="t-cap muted" style={{ fontSize: 12 }}>★ {o.meta}</span></span>
              <span style={{ width: 24, height: 24, borderRadius: 12, display: 'grid', placeItems: 'center', background: sel === i ? 'var(--brand)' : 'none', boxShadow: sel === i ? 'none' : 'inset 0 0 0 1.5px var(--line-2)', transition: 'background-color 160ms' }}>{sel === i && <Check size={14} color="#fff" strokeWidth={3} />}</span></span>
            {o.note && <span className="t-cap ink2" style={{ fontSize: 14, fontWeight: 500, position: 'relative' }}>{o.note}</span>}
          </motion.button>
        ))}
      </div>
      <div className="pad" style={{ padding: '10px 20px calc(var(--sab) + 8px)' }}><Btn onClick={() => setCheckout(true)}>Continue with {who}</Btn></div>
      <HomeBar />
      <Sheet open={checkout} onClose={() => setCheckout(false)}>
        <div className="col" style={{ gap: 16 }}>
          <span className="t-title2">Checkout</span>
          <div className="row"><Avatar who={who} size={40} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>{PEOPLE[who].name}</span><span className="t-cap muted">Parcel pickup · within 1h</span></span></div>
          <div className="col" style={{ gap: 10, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 14 }}>
            {[['Ask', fee], ['Platform fee', 1], ['Finder’s fee', 1.5]].map(([l, v]) => <div key={l as string} className="row t-cap" style={{ justifyContent: 'space-between', fontSize: 14 }}><span className="muted">{l}</span><span>£{(v as number).toFixed(2)}</span></div>)}
            <div className="row" style={{ justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--line)' }}><span className="t-callout" style={{ fontWeight: 800 }}>Total</span><span className="t-head">£{total.toFixed(2)}</span></div>
          </div>
          <button className="row" onClick={() => setMethodSheet(true)} style={{ padding: '12px 14px', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)' }}><span style={{ width: 40, height: 26, borderRadius: 6, background: method === 'Apple Pay' ? 'var(--ink)' : '#1A1F71', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>{method === 'Apple Pay' ? 'Pay' : 'VISA'}</span><span className="t-callout grow" style={{ textAlign: 'left' }}>{method}</span><ChevronRight size={16} color="var(--ink-3)" /></button>
          <div className="row t-cap" style={{ padding: '10px 12px', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--line)', fontSize: 14 }}><Lock size={16} />Held safely until you release it.</div>
          <SwipeConfirm label={`Slide to pay £${total.toFixed(2)}`} doneLabel="Payment held" onDone={() => go('chat', { role: 'asker', who, fee }, 'push')} />
        </div>
      </Sheet>
      <ListSheet open={methodSheet} onClose={() => setMethodSheet(false)} title="Pay with" items={[{ t: 'Apple Pay', sub: 'Face ID' }, { t: 'Visa ••4417', sub: 'Expires 09/28' }]} selected={method} onPick={setMethod} action={{ label: 'Add a card', onClick: () => setMethodSheet(false) }} />
    </div>
  )
}
