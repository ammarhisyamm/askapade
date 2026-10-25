import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react'
import { MapPin, Coins, ArrowLeft, ChevronDown, Delete, Clock, X, Search, Hourglass, Zap, ChevronRight, Landmark, Check, IdCard, ScanFace, Phone as PhoneIcon, LifeBuoy, ShieldCheck, Link2, Copy, MessageCircle, Camera, Bell, Flashlight } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Btn, Tile, MapCanvas, Me, TabBar, Avatar, SwipeConfirm, DrawCheck, Toast, Tactile, Ticker, Sheet, ListSheet, spring, EASE_OUT } from '../ui'

/* iOS-style number pad with tactile keys */
function Keypad({ onKey, dot }: { onKey: (k: string) => void; dot?: boolean }) {
  const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], [dot ? '.' : '', ''], ['0', ''], ['del', '']]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '6px 6px calc(var(--sab) + 4px)', background: 'rgba(209,213,206,0.55)' }}>
      {keys.map(([k, sub], i) => k === '' ? <span key={i} /> : (
        <motion.button key={i} whileTap={{ scale: 0.94, backgroundColor: '#e2e6df' }} transition={{ duration: 0.08 }} onClick={() => onKey(k)}
          style={{ height: 46, borderRadius: 8, background: k === 'del' ? 'transparent' : '#fff', boxShadow: k === 'del' ? 'none' : '0 1px 0 rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 400, lineHeight: 1 }}>
          {k === 'del' ? <Delete size={22} /> : <>{k}{sub && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>{sub}</span>}</>}
        </motion.button>
      ))}
    </div>
  )
}

export function PhoneNumber() {
  const { go } = useApp()
  const [code, setCode] = useState('🇬🇧 +44'), [cc, setCc] = useState(false)
  const [num, setNum] = useState('7700 900218')
  const digits = num.replace(/\s/g, '')
  const ok = digits.length >= 10
  const key = (k: string) => { const d = k === 'del' ? digits.slice(0, -1) : (digits + k).slice(0, 10); setNum(d.length > 4 ? d.slice(0, 4) + ' ' + d.slice(4) : d) }
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad"><button className="iconbtn" onClick={() => go('intro', undefined, 'back')}><ArrowLeft size={20} /></button></div>
      <div className="pad col" style={{ gap: 10, paddingTop: 12 }}>
        <h1 className="t-title1" style={{ fontSize: 28 }}>give us your number</h1>
        <p className="t-body muted">we’ll text you a code. no spam, ever.</p>
        <div className="row" style={{ gap: 8, marginTop: 8 }}>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setCc(true)} className="field row" style={{ gap: 6, padding: '14px 12px', fontWeight: 700 }}>{code} <ChevronDown size={14} /></motion.button>
          <div className="field grow" style={{ fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', boxShadow: 'inset 0 0 0 2px var(--brand)' }}><Ticker value={num || ' '} /><motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 2, height: 22, background: 'var(--brand)', marginLeft: 2 }} /></div>
        </div>
        <p className="t-cap muted" style={{ fontSize: 12, fontWeight: 500 }}>by tapping “agree & continue” you accept our terms and privacy policy.</p>
        <Btn disabled={!ok} onClick={() => go('code')} style={{ marginTop: 6 }}>agree & continue</Btn>
      </div>
      <div style={{ flex: 1 }} />
      <Keypad onKey={key} />
      <ListSheet open={cc} onClose={() => setCc(false)} title="Country" items={[{ t: '🇬🇧 +44', sub: 'United Kingdom' }, { t: '🇮🇪 +353', sub: 'Ireland' }, { t: '🇫🇷 +33', sub: 'France' }, { t: '🇺🇸 +1', sub: 'United States' }]} selected={code} onPick={setCode} />
    </div>
  )
}

export function Code() {
  const { go } = useApp()
  const [code, setCode] = useState('')
  const [secs, setSecs] = useState(24)
  const verified = code.length === 4
  useEffect(() => { const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (verified) { const t = setTimeout(() => go('skills', undefined, 'push'), 1300); return () => clearTimeout(t) } }, [verified, go])
  const autofill = () => '9302'.split('').forEach((d, i) => setTimeout(() => setCode(c => (c + d).slice(0, 4)), 90 * i))
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad"><button className="iconbtn" onClick={() => go('phone', undefined, 'back')}><ArrowLeft size={20} /></button></div>
      <div className="pad col" style={{ gap: 10, paddingTop: 12 }}>
        <h1 className="t-title1" style={{ fontSize: 28 }}>enter the code</h1>
        <p className="t-body muted">sent to +44 7700 •••218</p>
        <div style={{ position: 'relative', height: 72, marginTop: 8 }}>
          <AnimatePresence mode="wait">
            {!verified ? (
              <motion.div key="tiles" className="row" style={{ gap: 10 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ width: 66, height: 72, borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 800, background: code[i] ? 'var(--brand)' : '#fff', color: '#fff', boxShadow: code[i] ? 'none' : `inset 0 0 0 ${i === code.length ? 2 : 1}px ${i === code.length ? 'var(--brand)' : 'var(--line-2)'}`, transition: 'background-color 160ms' }}>
                    <AnimatePresence>{code[i] && <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.35, bounce: 0.5 }}>{code[i]}</motion.span>}</AnimatePresence>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="ok" className="row" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} style={{ height: 72, borderRadius: 18, background: 'var(--brand)', color: '#fff', padding: '0 20px', gap: 10, fontWeight: 800, fontSize: 18, width: 'fit-content' }}>
                <DrawCheck size={30} /> verified
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="row t-cap muted" style={{ gap: 6 }}><Clock size={14} />{secs > 0 ? `resend code in 0:${String(secs).padStart(2, '0')}` : 'resend code'}</p>
      </div>
      <div style={{ flex: 1 }} />
      {!verified && <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, ...spring }} onClick={autofill} style={{ alignSelf: 'center', marginBottom: 8, padding: '8px 16px', borderRadius: 12, background: '#fff', boxShadow: 'var(--e-2)', fontWeight: 600, fontSize: 14 }}>From Messages · <b>9302</b></motion.button>}
      <Keypad onKey={k => setCode(c => (k === 'del' ? c.slice(0, -1) : (c + k).slice(0, 4)))} />
    </div>
  )
}

const SKILLS = [['puppy-face', 'dog walks'], ['package-box', 'parcels'], ['hammer', 'DIY'], ['shopping-cart', 'shopping'], ['broomstick', 'cleaning'], ['home', 'moving'], ['macbook', 'tech help'], ['dslr-camera', 'photos'], ['coffee-cup', 'coffee runs']]

export function Skills() {
  const { go } = useApp()
  const [sel, setSel] = useState<string[]>(['dog walks', 'parcels', 'shopping'])
  const toggle = (s: string) => setSel(x => x.includes(s) ? x.filter(y => y !== s) : [...x, s])
  return (
    <div className="screen" style={{ justifyContent: 'flex-end' }}>
      <MapCanvas area="harrow"><Me x={200} y={240} /></MapCanvas>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><StatusBar /></div>
      <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} style={{ position: 'relative', zIndex: 10 }}>
        <div className="handle" />
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-title2">what can you help with?</span><span className="badge success"><Ticker value={`${sel.length}`} />/9</span></div>
        <p className="t-cap muted" style={{ fontSize: 14, fontWeight: 500, margin: '4px 0 14px' }}>we’ll ping you for these first.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {SKILLS.map(([o, l], i) => {
            const on = sel.includes(l)
            return (
              <motion.button key={l} onClick={() => toggle(l)} whileTap={{ scale: 0.92 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, backgroundColor: on ? '#F1FCD9' : '#EEF1EA' }} transition={{ type: 'spring', duration: 0.35, bounce: 0.35, delay: i * 0.03 }}
                style={{ position: 'relative', height: 92, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: on ? 'inset 0 0 0 2px var(--brand)' : 'none', fontWeight: 700, fontSize: 13 }}>
                <motion.img src={`/icons/${o}.png`} alt="" width={40} animate={{ scale: on ? 1.1 : 1, rotate: on ? -6 : 0 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.5 }} />{l}
                <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', duration: 0.35, bounce: 0.5 }} style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 10, background: 'var(--brand)', display: 'grid', placeItems: 'center' }}><Check size={12} color="#fff" strokeWidth={3.5} /></motion.span>}</AnimatePresence>
              </motion.button>
            )
          })}
        </div>
        <Btn disabled={!sel.length} onClick={() => go('permissions')} style={{ marginTop: 14 }}>continue</Btn>
      </motion.div>
    </div>
  )
}

const PUSHES = [
  { t: 'New ask 450 m away · £15', b: 'Walk Bella for 30 mins. Ends in 42 min.', obj: 'puppy-face', when: 'now', to: ['home', { inbound: true }] },
  { t: 'Tom’s 2 min away', b: 'Your parcel’s on its way. Tap to track.', obj: 'package-box', when: '2m ago', to: ['chat', { role: 'asker' }] },
  { t: '£16.50 just landed', b: 'Thanks for walking Bella. Cash out anytime.', obj: 'coins', when: '10m ago', to: ['wallet'] },
]

export function Push() {
  const { go } = useApp()
  return (
    <div className="screen" style={{ background: 'linear-gradient(#0f3d17, #062a10)', color: '#fff' }} onClick={e => { if (e.target === e.currentTarget) go('home', undefined, 'fade') }}>
      <StatusBar light />
      <div className="col" style={{ alignItems: 'center', marginTop: 16 }}><span className="t-callout" style={{ opacity: 0.85 }}>Friday 23 October</span><span style={{ fontSize: 88, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>9:41</span></div>
      <div className="col" style={{ gap: 8, padding: '28px 10px 0' }}>
        {PUSHES.map((n, i) => (
          <motion.button key={n.t} onClick={() => go(n.to[0] as string, n.to[1] as Record<string, unknown>, 'fade')} whileTap={{ scale: 0.97 }}
            initial={{ y: -30, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.55, bounce: 0.35, delay: 0.3 + i * 0.45 }}
            className="row" style={{ padding: 12, borderRadius: 20, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', textAlign: 'left', color: '#fff', alignItems: 'flex-start' }}>
            <span style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--brand)', display: 'grid', placeItems: 'center', flex: 'none' }}><img src="/ears.svg" width={22} alt="" style={{ filter: 'brightness(0) invert(1)' }} /></span>
            <span className="col grow" style={{ gap: 2 }}><span className="row" style={{ justifyContent: 'space-between' }}><span className="t-micro" style={{ opacity: 0.7 }}>askapade</span><span className="t-cap" style={{ opacity: 0.6, fontSize: 12 }}>{n.when}</span></span><span className="t-callout" style={{ fontWeight: 700 }}>{n.t}</span><span className="t-cap" style={{ opacity: 0.8, fontWeight: 500 }}>{n.b}</span></span>
            <img src={`/icons/${n.obj}.png`} width={34} alt="" />
          </motion.button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div className="row" style={{ justifyContent: 'space-between', padding: '0 46px calc(var(--sab) + 20px)' }}>
        <span className="iconbtn" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}><Flashlight size={20} /></span>
        <button className="t-cap" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => go('home', undefined, 'fade')}>tap a notification</button>
        <span className="iconbtn" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}><Camera size={20} /></span>
      </div>
      <HomeBar light />
    </div>
  )
}

const LIST = [
  { obj: 'puppy-face', t: 'Walk my dog for 30 mins', d: '450 m', left: '42m left', fee: '£15', urgent: true },
  { obj: 'package-box', t: 'Collect a parcel from the post office', d: '700 m', left: '3h 10m', fee: '£8' },
  { obj: 'coffee-cup', t: 'Grab 2 coffees from Gail’s', d: '850 m', left: '25m left', fee: '£6', urgent: true },
  { obj: 'hammer', t: 'Build a flatpack wardrobe', d: '1.1 km', left: '20h', fee: '£45' },
  { obj: 'shopping-cart', t: 'Weekly shop from Tesco Extra', d: '1.3 km', left: '6h', fee: '£10' },
  { obj: 'broomstick', t: 'Sweep the front garden', d: '1.6 km', left: '9h', fee: '£12' },
  { obj: 'macbook', t: 'Set up my new laptop', d: '1.4 km', left: '5h', fee: '£20' },
  { obj: 'key', t: 'Let a plumber into my flat', d: '1.7 km', left: '2h', fee: '£8' },
  { obj: 'paw-print', t: 'Feed my cat tonight', d: '1.9 km', left: '11h', fee: '£9' },
  { obj: 'gift-box', t: 'Wrap and post a birthday present', d: '2.2 km', left: '18h', fee: '£10' },
]

export function List(p: { filter?: 'km' | 'h' | 'fee' }) {
  const { go } = useApp()
  const [tab, setTab] = useState('nearby')
  const [q, setQ] = useState('')
  // v1 filters: distance, time left and fee, each a single slider in a small sheet
  const [maxKm, setMaxKm] = useState(10), [maxH, setMaxH] = useState(24), [minFee, setMinFee] = useState(0), [filter, setFilter] = useState<null | 'km' | 'h' | 'fee'>(p.filter ?? null)
  const km = (d: string) => d.endsWith('km') ? parseFloat(d) : parseFloat(d) / 1000
  const hrs = (l: string) => l.includes('m left') ? parseInt(l) / 60 : parseFloat(l)
  const rows = LIST.filter(r => r.t.toLowerCase().includes(q.toLowerCase()) && km(r.d) <= maxKm && hrs(r.left) <= maxH && parseInt(r.fee.slice(1)) >= minFee).sort((a, b) => tab === 'top fee' ? parseInt(b.fee.slice(1)) - parseInt(a.fee.slice(1)) : tab === 'ending soon' ? Number(!!b.urgent) - Number(!!a.urgent) : 0)
  return (
    <div className="screen">
      <MapCanvas area="harrow" />
      <motion.div className="sheet col" initial={{ top: '56%' }} animate={{ top: 'calc(var(--sat) + 30px)' }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.5 }} onDragEnd={(_, i) => { if (i.offset.y > 120) go('home', undefined, 'fade') }}
        style={{ padding: '8px 0 0', overflow: 'hidden', zIndex: 20 }}>
        <div className="handle" />
        <div className="pad row" style={{ justifyContent: 'space-between' }}><span className="t-title2">Asks nearby</span><span className="badge success">12 live</span></div>
        <div className="pad" style={{ margin: '12px 0' }}><div className="row" style={{ height: 44, borderRadius: 12, background: 'var(--surface-2)', padding: '0 12px', gap: 8 }}><Search size={18} color="var(--ink-3)" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="search asks, e.g. “dog walk”" style={{ border: 0, outline: 0, background: 'none', font: '500 16px var(--font)', flex: 1, minWidth: 0 }} /></div></div>
        <div className="pad"><Tactile id="list" options={['nearby', 'ending soon', 'top fee']} value={tab} onChange={setTab} /></div>
        <div className="pad row" style={{ gap: 6, marginTop: 10 }}>
          {([['km', <MapPin size={14} key="k" />, maxKm < 10 ? `≤ ${maxKm} km` : 'Distance'], ['h', <Clock size={14} key="h" />, maxH < 24 ? `≤ ${maxH}h left` : 'Time left'], ['fee', <Coins size={14} key="f" />, minFee > 0 ? `£${minFee}+` : 'Fee']] as const).map(([k, ic, l]) => {
            const on = (k === 'km' && maxKm < 10) || (k === 'h' && maxH < 24) || (k === 'fee' && minFee > 0)
            return <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => setFilter(k)} className="row badge" style={{ height: 32, padding: '0 12px', gap: 5, fontSize: 13, background: on ? 'var(--lime-50)' : '#fff', color: on ? 'var(--brand)' : 'var(--ink-2)', boxShadow: `inset 0 0 0 1px ${on ? 'var(--brand)' : 'var(--line-2)'}` }}>{ic}{l}<ChevronDown size={13} /></motion.button>
          })}
        </div>
        <motion.div layout className="scroll col" style={{ padding: '10px 20px 140px', gap: 2 }}>
          <AnimatePresence initial={false}>
            {rows.map((r, i) => (
              <motion.div layout key={r.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.2, delay: 0.15 + i * 0.04 }}
                className="row" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }} onClick={() => go('preview')}>
                <Tile obj={r.obj} size={48} />
                <span className="col grow" style={{ gap: 4 }}><span className="t-callout" style={{ fontWeight: 700 }}>{r.t}</span><span className="row t-cap muted" style={{ gap: 6 }}>{r.d}<span className={'badge ' + (r.urgent ? 'warning' : 'secondary')} style={{ height: 22 }}>{r.urgent ? <Hourglass size={11} /> : <Clock size={11} />}{r.left}</span></span></span>
                <span className="col" style={{ alignItems: 'flex-end', gap: 6 }}><span className="t-head">{r.fee}</span><motion.button whileTap={{ scale: 0.9 }} className="btn primary sm" onClick={e => { e.stopPropagation(); go('preview') }}>offer</motion.button></span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <TabBar active="explore" />
      <Sheet open={!!filter} onClose={() => setFilter(null)} z={70}>
        {filter && (() => {
          const cfg = { km: { t: 'Distance', min: 0.5, max: 10, step: 0.5, v: maxKm, set: setMaxKm, fmt: (v: number) => `up to ${v} km`, reset: 10 }, h: { t: 'Time left', min: 1, max: 24, step: 1, v: maxH, set: setMaxH, fmt: (v: number) => `ends within ${v}h`, reset: 24 }, fee: { t: 'Fee', min: 0, max: 50, step: 1, v: minFee, set: setMinFee, fmt: (v: number) => `£${v} or more`, reset: 0 } }[filter]
          return <>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-title2">{cfg.t}</span><span className="t-callout green" style={{ fontWeight: 800 }}>{cfg.fmt(cfg.v)}</span></div>
            <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={cfg.v} onChange={e => cfg.set(+e.target.value)} style={{ accentColor: '#008000', width: '100%', margin: '18px 0 6px' }} />
            <p className="t-cap muted" style={{ marginBottom: 14 }}>{rows.length} asks match</p>
            <div className="row" style={{ gap: 8 }}><Btn kind="secondary" onClick={() => cfg.set(cfg.reset)}>Reset</Btn><Btn onClick={() => setFilter(null)}>Show {rows.length}</Btn></div>
          </>
        })()}
      </Sheet>
      <HomeBar />
    </div>
  )
}

export function CashOut() {
  const { go } = useApp()
  const [amt, setAmt] = useState('248.50')
  const [speed, setSpeed] = useState('Instant · £0.50')
  const [verified] = useState(false)
  const key = (k: string) => setAmt(a => { if (k === 'del') return a.slice(0, -1) || '0'; if (k === '.' && a.includes('.')) return a; if (a.includes('.') && a.split('.')[1].length >= 2) return a; return a === '0' && k !== '.' ? k : a + k })
  const [whole, dec] = amt.split('.')
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'space-between' }}><button className="iconbtn" onClick={() => go('wallet', undefined, 'back')}><ArrowLeft size={20} /></button><span className="t-callout">Cash out</span><span style={{ width: 44 }} /></div>
      <div className="col" style={{ alignItems: 'center', gap: 10, paddingTop: 18 }}>
        <span style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-0.04em' }}>£<Ticker value={whole} />{amt.includes('.') && <span style={{ color: 'var(--ink-4)' }}>.<Ticker value={dec ?? ''} /></span>}</span>
        <motion.button whileTap={{ scale: 0.92 }} className="badge secondary" style={{ height: 30, padding: '0 14px', fontSize: 13 }} onClick={() => setAmt('248.50')}>Max</motion.button>
      </div>
      <div className="pad col" style={{ gap: 10, marginTop: 16 }}>
        <div className="row" style={{ padding: 4, background: 'var(--surface-2)', borderRadius: 14 }}>
          {['Instant · £0.50', 'Standard · free'].map(o => <button key={o} onClick={() => setSpeed(o)} style={{ position: 'relative', flex: 1, height: 38, borderRadius: 10, fontWeight: 700, fontSize: 13 }}>{speed === o && <motion.span layoutId="speed" transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }} style={{ position: 'absolute', inset: 0, borderRadius: 10, background: '#fff', boxShadow: 'var(--e-2)' }} />}<span className="row" style={{ position: 'relative', justifyContent: 'center', gap: 4 }}>{o.startsWith('Instant') && <Zap size={13} />}{o}</span></button>)}
        </div>
        <div className="card row" style={{ padding: 12 }}><span className="tile" style={{ width: 36, height: 36, borderRadius: 10, background: '#FFE3E0' }}><Landmark size={18} color="#F2453D" /></span><span className="col grow"><span className="t-callout">Monzo •••• 4417</span><span className="t-cap muted" style={{ fontSize: 12 }}>{speed.startsWith('Instant') ? 'Arrives in seconds' : 'Arrives in 1–2 days'}</span></span><ChevronRight size={16} color="var(--ink-3)" /></div>
      </div>
      <div style={{ flex: 1 }} />
      <div className="pad" style={{ paddingBottom: 10 }}><SwipeConfirm label={`Slide to cash out £${amt}`} doneLabel="On its way" busyLabel="Sending to bank…" onDone={() => go(verified ? 'wallet' : 'scan', { first: true }, 'push')} /></div>
      <Keypad onKey={key} dot />
    </div>
  )
}

export function ScanId() {
  const { go } = useApp()
  const [step, setStep] = useState(0)
  useEffect(() => { const ts = [900, 1800, 2700, 3600].map((d, i) => setTimeout(() => setStep(i + 1), d)); const done = setTimeout(() => go('verified', undefined, 'fade'), 4300); return () => { ts.forEach(clearTimeout); clearTimeout(done) } }, [go])
  const chips = ['Good light', 'No glare', 'Reading…']
  return (
    <div className="screen" style={{ background: '#0c140d', color: '#fff' }}>
      <StatusBar light />
      <div className="pad row" style={{ justifyContent: 'space-between' }}><button className="iconbtn" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }} onClick={() => go('wallet', undefined, 'back')}><X size={20} /></button><span className="row" style={{ gap: 6 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 22, height: 4, borderRadius: 2, background: i === 0 ? 'var(--lime)' : 'rgba(255,255,255,0.25)' }} />)}</span><span style={{ width: 44 }} /></div>
      <div className="col" style={{ alignItems: 'center', gap: 6, marginTop: 18, textAlign: 'center' }}><span className="t-title2">Hold your ID in the frame</span><span className="t-cap" style={{ opacity: 0.7, fontWeight: 500 }}>We’ll snap it automatically.</span></div>
      <div style={{ position: 'relative', margin: '26px 26px 0', aspectRatio: '1.45', borderRadius: 18, background: 'rgba(255,255,255,0.05)' }}>
        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ position: 'absolute', inset: 0, borderRadius: 18 }}>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([r, b], i) => <span key={i} style={{ position: 'absolute', [r ? 'right' : 'left']: -2, [b ? 'bottom' : 'top']: -2, width: 34, height: 34, border: '4px solid var(--lime)', borderRadius: 14, clipPath: `polygon(${r ? '50% 0, 100% 0, 100% 100%, 50% 100%' : '0 0, 50% 0, 50% 100%, 0 100%'})`, ...(b ? { borderTopColor: 'transparent' } : { borderBottomColor: 'transparent' }) }} />)}
        </motion.div>
        <div style={{ position: 'absolute', inset: 22, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', gap: 12, padding: 14 }}>
          <span style={{ width: '30%', borderRadius: 8, background: 'rgba(255,255,255,0.14)' }} />
          <span className="col grow" style={{ gap: 8 }}>{[80, 60, 70].map(w => <span key={w} style={{ height: 8, width: `${w}%`, borderRadius: 4, background: 'rgba(255,255,255,0.18)' }} />)}</span>
        </div>
        <motion.span animate={{ top: ['8%', '88%', '8%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: 8, right: 8, height: 2, background: 'var(--lime)', boxShadow: '0 0 18px var(--lime)' }} />
        <AnimatePresence>{step >= 4 && <motion.span key="flash" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: -400, background: '#fff' }} />}</AnimatePresence>
      </div>
      <div className="row" style={{ justifyContent: 'center', gap: 8, marginTop: 20 }}>
        {chips.map((c, i) => step > i && <motion.span key={c} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.45 }} className="badge" style={{ background: i < 2 ? 'var(--lime)' : 'rgba(255,255,255,0.12)', color: i < 2 ? 'var(--ink)' : '#fff' }}>{i < 2 && <Check size={12} strokeWidth={3} />}{c}</motion.span>)}
      </div>
      <div style={{ flex: 1 }} />
      <div className="col" style={{ alignItems: 'center', paddingBottom: 'calc(var(--sab) + 16px)' }}><span style={{ width: 76, height: 76, borderRadius: 38, border: '4px solid #fff', display: 'grid', placeItems: 'center' }}><span style={{ width: 60, height: 60, borderRadius: 30, background: '#fff' }} /></span></div>
      <HomeBar light />
    </div>
  )
}

export function Verified() {
  const { go } = useApp()
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sheen = useTransform(ry, [-14, 14], ['0%', '100%'])
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * 28); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 20) }
  const reset = () => { animate(rx, 0, spring); animate(ry, 0, spring) }
  useEffect(() => { const c = animate(ry, [0, 12, -10, 0], { duration: 2.2, ease: 'easeInOut', delay: 0.4 }); return c.stop }, [ry])
  const checks: [typeof IdCard, string, string, string][] = [[IdCard, 'Government ID', 'Passport · checked 23 Oct', 'Verified'], [ScanFace, 'Face match', 'Live selfie matched', 'Verified'], [PhoneIcon, 'Phone', '+44 ••••• ••• 218', 'Verified'], [LifeBuoy, 'Lifeline contact', 'Someone we alert if you need help', 'Add']]
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'space-between' }}><button className="iconbtn" onClick={() => go('profile', undefined, 'back')}><ArrowLeft size={20} /></button><span className="t-callout">ID verification</span><span style={{ width: 44 }} /></div>
      <div className="scroll pad col" style={{ gap: 14, paddingTop: 10, paddingBottom: 'calc(var(--sab) + 12px)' }}>
        <div style={{ perspective: 900 }} onPointerMove={onMove} onPointerLeave={reset}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={spring}
            style={{ rotateX: rx, rotateY: ry, position: 'relative', borderRadius: 22, padding: 18, height: 196, color: '#fff', background: 'linear-gradient(135deg, #0b4d1a, #062a10)', overflow: 'hidden', boxShadow: 'var(--e-3)' }}>
            <motion.span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 30%, rgba(200,245,96,0.28) 45%, rgba(154,208,255,0.22) 52%, transparent 65%)', backgroundSize: '220% 100%', backgroundPositionX: sheen }} />
            <div className="row" style={{ justifyContent: 'space-between', position: 'relative' }}><img src="/ears.svg" width={30} alt="" style={{ filter: 'brightness(0) invert(1)' }} /><motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.5, delay: 0.5 }} className="badge lime"><Check size={12} strokeWidth={3} />VERIFIED</motion.span></div>
            <div className="row" style={{ gap: 12, marginTop: 26, position: 'relative' }}><Avatar who="Me" size={56} tick={false} /><span className="col"><span className="t-title2">Ammar H.</span><span className="t-cap" style={{ opacity: 0.7 }}>Member since Oct 2026</span></span></div>
            <div className="row t-cap" style={{ justifyContent: 'space-between', position: 'absolute', left: 18, right: 18, bottom: 16, opacity: 0.7, fontSize: 12 }}><span>AK · •••• 7731</span><span>Harrow, UK</span></div>
          </motion.div>
          <p className="t-cap muted" style={{ textAlign: 'center', marginTop: 8, fontSize: 12 }}>Tilt to shine</p>
        </div>
        <div className="card">
          {checks.map(([I, t, s, v], i) => (
            <motion.div key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08, duration: 0.3, ease: EASE_OUT }} className="row" style={{ padding: '13px 16px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
              <span className="tile" style={{ width: 36, height: 36, borderRadius: 10, background: v === 'Add' ? '#FFECEA' : 'var(--lime-50)' }}><I size={18} color={v === 'Add' ? 'var(--danger)' : 'var(--brand)'} /></span>
              <span className="col grow"><span className="t-callout">{t}</span><span className="t-cap muted" style={{ fontSize: 12 }}>{s}</span></span>
              <span className="t-cap" style={{ color: v === 'Add' ? 'var(--ink)' : 'var(--brand)', fontWeight: 800 }}>{v === 'Add' ? 'Add ›' : '✓ ' + v}</span>
            </motion.div>
          ))}
        </div>
        <div className="row t-cap" style={{ padding: 12, borderRadius: 14, background: 'var(--lime-50)', color: 'var(--brand)', gap: 8 }}><ShieldCheck size={18} />Verified people get picked 2.4× faster</div>
        <Btn onClick={() => go('wallet', { cashedOut: true }, 'fade')}>Done</Btn>
      </div>
    </div>
  )
}

export function ShareEarn() {
  const { go } = useApp()
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1800); return () => clearTimeout(t) }, [toast])
  const targets: [string, string, React.ReactNode][] = [['WhatsApp', '#25D366', <MessageCircle size={22} color="#fff" key="w" />], ['Messages', '#34C759', <MessageCircle size={22} color="#fff" key="m" />], ['Stories', 'linear-gradient(45deg,#f9a03f,#e1306c,#833ab4)', <Camera size={22} color="#fff" key="s" />], ['Copy link', 'var(--ink)', <Copy size={20} color="#fff" key="c" />]]
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad"><button className="iconbtn" onClick={() => go('preview', undefined, 'back')}><X size={20} /></button></div>
      <div className="scroll pad col" style={{ gap: 14, paddingBottom: 'calc(var(--sab) + 12px)' }}>
        <div style={{ position: 'relative', alignSelf: 'center', marginTop: 6 }}>
          <motion.img src="/icons/gift-box.png" width={120} alt="" initial={{ scale: 0.5, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: [0, -6, 6, 0], opacity: 1 }} transition={{ scale: spring, opacity: { duration: 0.2 }, rotate: { duration: 0.8, delay: 0.4 } }} />
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.5, delay: 0.5 }} className="badge lime" style={{ position: 'absolute', top: 4, right: -50 }}>You earn £1.50</motion.span>
        </div>
        <h1 className="t-title1">Know someone who’d be perfect?</h1>
        <p className="t-body muted">Share Sam’s ask. If they finish it, you get <b style={{ color: 'var(--ink)' }}>£1.50</b>.</p>
        <div className="card row" style={{ padding: 12 }}><Tile obj="mystery-box" size={44} /><span className="col grow"><span className="t-callout" style={{ fontWeight: 700 }}>Help carry a sofa up 2 floors</span><span className="t-cap muted" style={{ fontSize: 12 }}>£25 · 1.2 km · ends in 45m</span><span className="row t-cap green" style={{ gap: 4, fontSize: 12 }}><Link2 size={12} />askapade.app/a/7HK2</span></span></div>
        <div className="row" style={{ justifyContent: 'space-between', padding: '4px 6px' }}>
          {targets.map(([l, bg, ic], i) => (
            <motion.button key={l} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.35, delay: 0.25 + i * 0.05 }} whileTap={{ scale: 0.88 }} onClick={() => setToast(l === 'Copy link' ? 'Link copied' : `Shared to ${l}`)} className="col" style={{ alignItems: 'center', gap: 6 }}>
              <span style={{ width: 56, height: 56, borderRadius: 16, background: bg, display: 'grid', placeItems: 'center' }}>{ic}</span><span className="t-cap" style={{ fontSize: 12 }}>{l}</span>
            </motion.button>
          ))}
        </div>
        <div className="row t-cap" style={{ padding: 12, borderRadius: 14, background: 'var(--lime-50)', color: 'var(--brand)', gap: 8, justifyContent: 'center' }}><Zap size={14} />12 finds this month · £18.00 earned</div>
      </div>
      <Toast text={toast} show={!!toast} />
      <HomeBar />
    </div>
  )
}

export function NotifPrimer() {
  const { go, route } = useApp()
  const back = (route.p?.back as string) ?? 'permissions'
  const [t, setT] = useState([true, true, true])
  const pills = ['New ask 400 m away · £8', 'Boosted ask 4 km away · £25', '£16.50 just landed']
  return (
    <div className="screen">
      <StatusBar />
      <div className="col" style={{ gap: 10, padding: '20px 20px 0' }}>
        {pills.map((p, i) => (
          <motion.span key={p} initial={{ scale: 0.6, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.45, delay: 0.2 + i * 0.35 }}
            className="row" style={{ alignSelf: i === 1 ? 'center' : 'flex-start', marginLeft: i === 2 ? 20 : 0, gap: 8, padding: '8px 14px 8px 8px', borderRadius: 18, background: '#fff', boxShadow: 'var(--e-2)', fontWeight: 700, fontSize: 14 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--brand)', display: 'grid', placeItems: 'center' }}><img src="/ears.svg" width={15} alt="" style={{ filter: 'brightness(0) invert(1)' }} /></span>{p}
          </motion.span>
        ))}
      </div>
      <div className="pad col" style={{ gap: 10, marginTop: 26 }}>
        <h1 className="t-title1">Don’t miss asks nearby</h1>
        <p className="t-body muted">Only for asks nearby, or when money moves.</p>
        <div className="card" style={{ marginTop: 6 }}>
          {['New asks within 1 km', 'Boosted asks up to 5 km', 'Payments & matches'].map((l, i) => (
            <button key={l} className="row" style={{ width: '100%', padding: '14px 16px', borderTop: i ? '1px solid var(--line)' : 'none', textAlign: 'left' }} onClick={() => i < 2 && setT(x => x.map((v, j) => j === i ? !v : v))}>
              <span className="col grow"><span className="t-callout">{l}</span>{i === 2 && <span className="t-cap muted" style={{ fontSize: 12 }}>Always on</span>}</span><span className={'switch' + (t[i] ? ' on' : '')} style={{ opacity: i === 2 ? 0.5 : 1 }} />
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div className="pad col" style={{ gap: 4, paddingBottom: 'var(--sab)' }}>
        <Btn icon={<Bell size={18} />} onClick={() => go(back, { notif: true }, 'back')}>Turn on notifications</Btn>
        <Btn kind="ghost" onClick={() => go(back, undefined, 'back')}>Maybe later</Btn>
      </div>
      <HomeBar />
    </div>
  )
}

