import { useEffect, useState } from 'react'
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'motion/react'
import { ArrowLeft, Settings as Gear, Wallet as WalletIcon, ShieldCheck, LifeBuoy, ChevronRight, Locate, Sparkles, Bell, Landmark, CreditCard, Ban, MessageCircle, Zap, Star, ArrowUpRight, Plus } from 'lucide-react'
import { useApp } from '../store'
import { StatusBar, HomeBar, Hop, Btn, Avatar, Tile, TabBar, Confetti, Toast, PEOPLE, EASE_OUT, spring } from '../ui'

function CountUp({ to, prefix = '£' }: { to: number; prefix?: string }) {
  const mv = useMotionValue(0)
  const txt = useTransform(mv, v => prefix + v.toFixed(2))
  useEffect(() => { const c = animate(mv, to, { duration: 1.1, ease: EASE_OUT, delay: 0.2 }); return c.stop }, [to, mv])
  return <motion.span>{txt}</motion.span>
}

export function Paid(p: { badge?: boolean }) {
  const { go } = useApp()
  const [badge, setBadge] = useState(!!p.badge)
  useEffect(() => { if (p.badge) return; const t = setTimeout(() => setBadge(true), 2400); return () => clearTimeout(t) }, [p.badge])
  return (
    <div className="screen" style={{ background: 'var(--brand-900)', color: '#fff' }}>
      <StatusBar light />
      <Confetti run />
      <div className="scroll col" style={{ paddingBottom: 16 }}>
      <div className="col" style={{ alignItems: 'center', gap: 12, paddingTop: 'clamp(8px, 4vh, 40px)' }}>
        <motion.img src="/icons/coins.png" alt="" width={120} initial={{ scale: 0.6, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={spring} />
        <span className="badge lime">Paid · just now</span>
        <span className="t-display" style={{ fontSize: 76 }}><CountUp to={16.5} /></span>
        <span className="t-callout" style={{ opacity: 0.8, fontWeight: 500 }}>Bella says thanks. So does Ellie.</span>
      </div>
      <div className="col" style={{ margin: '28px 16px 0', borderRadius: 18, background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', padding: '6px 16px' }}>
        {[['Walk Bella', '£15.00'], ['Tip from Ellie', '+£1.50'], ['Landed in wallet', 'Instantly']].map(([l, v], i) => <div key={l} className="row t-cap" style={{ justifyContent: 'space-between', padding: '12px 0', borderTop: i ? '1px solid rgba(255,255,255,0.08)' : 'none', fontSize: 14 }}><span style={{ opacity: 0.75 }}>{l}</span><span style={{ color: i === 1 ? 'var(--lime)' : '#fff', fontWeight: 800 }}>{v}</span></div>)}
      </div>
      </div>
      <div className="col" style={{ gap: 4, padding: '0 16px calc(var(--sab) + 8px)' }}><Btn kind="secondary" style={{ background: 'var(--lime)', color: 'var(--ink)' }} onClick={() => go('home', { inbound: true }, 'fade')}>Find another nearby · 3 within 500 m</Btn><Btn kind="ghost" style={{ color: '#fff' }} onClick={() => go('rate', { who: 'Ellie' })}>Rate Ellie</Btn></div>
      <HomeBar light />
      {/* 04.4 Badge unlocked (Duolingo / CRED reward moment) */}
      <AnimatePresence>{badge && <>
        <motion.div key="s" className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.div key="m" className="modal" style={{ color: 'var(--ink)' }} initial={{ opacity: 0, y: '-30%', scale: 0.9 }} animate={{ opacity: 1, y: '-50%', scale: 1 }} exit={{ opacity: 0, y: '-46%' }} transition={{ type: 'spring', duration: 0.55, bounce: 0.3 }}>
          <div style={{ position: 'relative' }}>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -26, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(200,245,96,0) 0deg, rgba(200,245,96,0.55) 20deg, rgba(200,245,96,0) 40deg, rgba(200,245,96,0) 90deg, rgba(200,245,96,0.55) 110deg, rgba(200,245,96,0) 130deg, rgba(200,245,96,0) 180deg, rgba(200,245,96,0.55) 200deg, rgba(200,245,96,0) 220deg, rgba(200,245,96,0) 270deg, rgba(200,245,96,0.55) 290deg, rgba(200,245,96,0) 310deg)' }} />
            <motion.img src="/icons/cup-gold.png" width={110} alt="" initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.7, bounce: 0.5, delay: 0.15 }} style={{ position: 'relative' }} />
          </div>
          <span className="t-micro green">You unlocked</span>
          <span className="t-title2">Speedy helper</span>
          <span className="t-callout muted" style={{ fontWeight: 500 }}>Done in under 30 minutes. It shows on your profile and helps you get picked first.</span>
          <div className="col" style={{ gap: 6, width: '100%' }}><Btn onClick={() => go('rate', { who: 'Ellie' })}>add to profile</Btn><Btn kind="ghost" onClick={() => setBadge(false)}>not now</Btn></div>
        </motion.div>
        <Confetti key="c" run />
      </>}</AnimatePresence>
    </div>
  )
}

export function Rate(p: { who?: string; stars?: number }) {
  const { go } = useApp()
  const who = (p.who as string) ?? 'Tom'
  const [stars, setStars] = useState((p.stars as number) || 5)
  const [tags, setTags] = useState<string[]>(['Fast'])
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad"><button className="iconbtn" onClick={() => go('home', undefined, 'back')}><ArrowLeft size={20} /></button></div>
      <div className="col pad" style={{ alignItems: 'center', gap: 16, paddingTop: 30, textAlign: 'center' }}>
        <Avatar who={who} size={84} />
        <span className="t-title1">How was {PEOPLE[who].name.split(' ')[0]}?</span>
        <div className="row" style={{ gap: 8 }}>{[1, 2, 3, 4, 5].map(i => <motion.button key={i} whileTap={{ scale: 0.85 }} animate={{ scale: i <= stars ? 1 : 0.92 }} onClick={() => setStars(i)}><Star size={40} fill={i <= stars ? '#FFB800' : 'none'} color={i <= stars ? '#FFB800' : 'var(--ink-4)'} /></motion.button>)}</div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>{['Fast', 'Friendly', 'Careful', 'Great chat'].map(t => <button key={t} className={'chip' + (tags.includes(t) ? ' on' : '')} style={{ flex: 'none' }} onClick={() => setTags(x => x.includes(t) ? x.filter(y => y !== t) : [...x, t])}>{t}</button>)}</div>
      </div>
      <div style={{ flex: 1 }} />
      <div className="pad" style={{ paddingBottom: 'calc(var(--sab) + 8px)' }}><Btn onClick={() => go('home', undefined, 'fade')}>Send rating</Btn></div>
      <HomeBar />
    </div>
  )
}

// v1's chat list and "my asks" merged: one place for everything you're in, posting or helping (no roles)
export function MyAsks() {
  const { go } = useApp()
  const live = [
    { who: 'Tom', o: 'package-box', t: 'Parcel pickup', last: 'Got it. About 6 min away.', when: 'now', unread: 1, role: 'asker', tag: 'Held' },
    { who: 'Ellie', o: 'puppy-face', t: 'Walk Bella', last: 'She loves the park on Station Rd.', when: '2m', unread: 0, role: 'helper', tag: 'Earning' },
  ]
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad" style={{ padding: '8px 20px 14px' }}><h1 className="t-title1">My asks</h1></div>
      <div className="scroll pad col" style={{ gap: 10, paddingBottom: 120 }}>
        <span className="t-micro muted">Live</span>
        {live.map((c, i) => (
          <motion.button key={c.t} className="card row" style={{ padding: 12, textAlign: 'left' }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25, ease: EASE_OUT }} onClick={() => go('chat', { role: c.role, who: c.who })}>
            <div style={{ position: 'relative' }}><Avatar who={c.who} size={48} /><span style={{ position: 'absolute', right: -4, bottom: -4 }}><Tile obj={c.o} size={24} bg="#fff" /></span></div>
            <span className="col grow" style={{ gap: 2, minWidth: 0 }}>
              <span className="row" style={{ gap: 6 }}><span className="t-callout" style={{ fontWeight: 700 }}>{c.t}</span><span className={'badge ' + (c.role === 'asker' ? 'secondary' : 'success')} style={{ height: 20, fontSize: 11 }}>{c.tag}</span></span>
              <span className="t-cap" style={{ color: c.unread ? 'var(--ink)' : 'var(--ink-3)', fontWeight: c.unread ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{PEOPLE[c.who].name.split(' ')[0]}: {c.last}</span>
            </span>
            <span className="col" style={{ alignItems: 'flex-end', gap: 6 }}><span className="t-cap muted" style={{ fontSize: 12 }}>{c.when}</span>{c.unread > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.5, delay: 0.3 }} style={{ minWidth: 20, height: 20, borderRadius: 10, background: 'var(--brand)', color: '#fff', fontSize: 12, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{c.unread}</motion.span>}</span>
          </motion.button>
        ))}
        <span className="t-micro muted" style={{ marginTop: 10 }}>Earlier</span>
        {[['Grace', 'shopping-cart', 'Weekly shop', 'Completed · £10'], ['Dan', 'hammer', 'Flatpack wardrobe', 'Completed · £45']].map(([w, o, t, st]) => <div key={t} className="card row" style={{ padding: 12, opacity: 0.75 }}><Avatar who={w} size={40} /><span className="col grow"><span className="t-callout">{t}</span><span className="t-cap muted">{st}</span></span><Tile obj={o} size={36} /></div>)}
        <Btn kind="secondary" icon={<Plus size={18} />} onClick={() => go('post', undefined, 'up')}>Post an ask</Btn>
      </div>
      <TabBar active="asks" />
      <HomeBar />
    </div>
  )
}

export function Wallet(p: { cashedOut?: boolean }) {
  const { go } = useApp()
  const [toast, setToast] = useState<string | null>(p.cashedOut ? '£248.50 is on its way to Monzo' : null)
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2400); return () => clearTimeout(t) }, [toast])
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad" style={{ padding: '8px 20px 14px' }}><h1 className="t-title1">Wallet</h1></div>
      <div className="scroll pad col" style={{ gap: 14, paddingBottom: 120 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} style={{ borderRadius: 24, padding: 20, background: 'var(--brand-900)', color: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="t-cap" style={{ opacity: 0.7 }}>Available</span>
          <span className="t-display" style={{ fontSize: 52 }}><CountUp to={248.5} /></span>
          <div className="row" style={{ gap: 8 }}><Btn kind="secondary" style={{ background: 'var(--lime)', color: 'var(--ink)', height: 46 }} icon={<ArrowUpRight size={18} />} onClick={() => go('cashout')}>Cash out</Btn><Btn kind="secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', height: 46 }}>History</Btn></div>
        </motion.div>
        <div className="row" style={{ gap: 10 }}>{[['This week', '£64.50'], ['Finder’s fees', '£4.50'], ['Held', '£14.50']].map(([l, v]) => <div key={l} className="card col grow" style={{ padding: 12, gap: 4 }}><span className="t-cap muted" style={{ fontSize: 12 }}>{l}</span><span className="t-head">{v}</span></div>)}</div>
        <span className="t-micro muted">Recent</span>
        {[['puppy-face', 'Walk Bella', '+£16.50'], ['coins', 'Finder’s fee · Sam', '+£1.50'], ['package-box', 'Parcel pickup (held)', '−£14.50']].map(([o, t, v]) => <div key={t} className="card row" style={{ padding: 12 }}><Tile obj={o} size={40} /><span className="t-callout grow">{t}</span><span className="t-callout" style={{ fontWeight: 800, color: v.startsWith('+') ? 'var(--brand)' : 'var(--ink)' }}>{v}</span></div>)}
      </div>
      <TabBar active="wallet" />
      <Toast text={toast} show={!!toast} top />
      <HomeBar />
    </div>
  )
}

export function Profile() {
  const { go } = useApp()
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad row" style={{ justifyContent: 'flex-end' }}><button className="iconbtn" onClick={() => go('settings')} aria-label="Settings"><Gear size={20} /></button></div>
      <div className="scroll pad col" style={{ gap: 16, paddingBottom: 120 }}>
        <div className="col" style={{ alignItems: 'center', gap: 6 }}><Avatar who="Me" size={96} /><span className="t-title2">Ammar H.</span><span className="t-cap muted">Harrow · helping since Oct 2026</span></div>
        <div className="card row" style={{ padding: 14, justifyContent: 'space-around', textAlign: 'center' }}>{[['4.9 ★', '38 reviews'], ['41', 'asks done'], ['2m', 'avg pickup']].map(([v, l]) => <span key={l} className="col"><span className="t-head">{v}</span><span className="t-cap muted" style={{ fontSize: 12 }}>{l}</span></span>)}</div>
        <span className="t-head">Badges</span>
        <div className="row" style={{ gap: 10 }}>{[['cup-gold', 'Top helper'], ['sand-timer', 'Speedy'], ['heart', 'Kind'], ['paw-print', 'Dog person']].map(([o, l], i) => <motion.div key={l} className="col" style={{ alignItems: 'center', gap: 4, flex: 1 }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: i * 0.05 }}><Tile obj={o} size={60} bg="var(--lime-50)" /><span className="t-cap" style={{ fontSize: 12 }}>{l}</span></motion.div>)}</div>
        <div className="card">
          {[[WalletIcon, 'Wallet', '£248.50', 'wallet'], [ShieldCheck, 'ID verification', 'Verified', 'verified'], [LifeBuoy, 'Lifeline', '2 contacts', '']].map(([I, t, v, to], i) => { const Icon = I as typeof Gear; return <button key={t as string} className="row" style={{ width: '100%', padding: '14px 16px', borderTop: i ? '1px solid var(--line)' : 'none', textAlign: 'left' }} onClick={() => to && go(to as string, undefined, to === 'wallet' ? 'fade' : 'push')}><Icon size={20} /><span className="t-callout grow">{t as string}</span><span className="t-cap muted">{v as string}</span><ChevronRight size={16} color="var(--ink-3)" /></button> })}
        </div>
      </div>
      <TabBar active="you" />
      <HomeBar />
    </div>
  )
}

export function Settings() {
  const { go } = useApp()
  const [radius, setRadius] = useState(1)
  const Group = ({ label, rows }: { label: string; rows: [typeof Gear, string, string?, (() => void)?][] }) => (
    <div className="col" style={{ gap: 8 }}>
      <span className="t-micro muted" style={{ padding: '0 4px' }}>{label}</span>
      <div className="card">{rows.map(([Icon, t, v, on], i) => <button key={t} className="row" style={{ width: '100%', padding: '14px 16px', borderTop: i ? '1px solid var(--line)' : 'none', textAlign: 'left' }} onClick={on}><Icon size={20} /><span className="t-callout grow">{t}</span>{v && <span className="t-cap" style={{ fontWeight: 700 }}>{v}</span>}<ChevronRight size={16} color="var(--ink-3)" /></button>)}</div>
    </div>
  )
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad"><button className="iconbtn" onClick={() => go('profile', undefined, 'back')}><ArrowLeft size={20} /></button></div>
      <div className="pad" style={{ padding: '4px 20px 8px' }}><h1 className="t-title1">Settings</h1></div>
      <div className="scroll col" style={{ gap: 14, padding: '4px 16px calc(var(--sab) + 8px)' }}>
        <Group label="Nearby" rows={[[Locate, 'Alert radius', `${radius} km`, () => setRadius(r => (r % 5) + 1)], [Sparkles, 'What you help with', '4 skills'], [Bell, 'Notifications', 'On', () => go('notif', { back: 'settings' })]]} />
        <Group label="Money" rows={[[Landmark, 'Payout account', 'Monzo ••42'], [CreditCard, 'Payment method', 'Apple Pay']]} />
        <Group label="Safety & help" rows={[[LifeBuoy, 'Lifeline contacts', '2'], [Ban, 'Blocked people', '0'], [MessageCircle, 'Help & support']]} />
        <button className="btn ghost" style={{ color: 'var(--danger)' }} onClick={() => go('splash', undefined, 'fade')}>Log out</button>
        <span className="row t-cap muted" style={{ justifyContent: 'center', fontSize: 12, fontWeight: 500, gap: 6 }}><Hop state="idle" size={22} pop={false} />askapade 2.0 · Hop says hi <Zap size={12} /></span>
      </div>
      <HomeBar />
    </div>
  )
}
