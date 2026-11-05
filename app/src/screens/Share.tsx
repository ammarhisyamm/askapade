import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { InstagramLogo, TiktokLogo, ChatCircleText, LinkSimple, WhatsappLogo, Clock, MapPin, AppStoreLogo } from '@phosphor-icons/react'
import { useStore } from '../store'
import { span, type Ask } from '../data'
import { Icon3D, Fee, useNow, Button, AskCard, VerifiedMark } from '../ui'
import { Header } from './Profile'

/** Story (9:16) and square post: 3D icon, fee + finder’s fee, area, time left, ask text, askapade */
export function ShareCard({ ask, shape, now }: { ask: Ask; shape: 'story' | 'square'; now: number }) {
  return (
    <div className={`share-card is-${shape}`}>
      <span className="share-deco d1" /><span className="share-deco d2" />
      <Icon3D id={ask.icon} size={shape === 'story' ? 120 : 92} className="share-icon" />
      <p className="share-text">{ask.text}</p>
      <Fee fee={ask.fee} finder={ask.finder} currency={ask.currency} size="lg" />
      <div className="share-facts">
        <span><MapPin size={14} weight="fill" />{ask.area}</span>
        <span><Clock size={14} weight="bold" />{span(ask.endsAt - now)} left</span>
      </div>
      <span className="share-brand">askapade</span>
    </div>
  )
}

export function Share({ askId }: { askId: string }) {
  const s = useStore()
  const now = useNow(30000)
  const ask = s.asks.find(a => a.id === askId) ?? s.chats.find(c => c.ask.id === askId)?.ask ?? s.myAsk
  const [shape, setShape] = useState<'story' | 'square'>('story')
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(false); const t = setTimeout(() => setReady(true), 900); return () => clearTimeout(t) }, [shape])
  if (!ask) return null
  const copy = () => { navigator.clipboard?.writeText(`https://askapade.com/ask/${ask.id}/f${s.me.username}`).catch(() => {}); s.showToast('Link copied') }
  const apps = [
    { n: 'Instagram', i: <InstagramLogo size={26} weight="fill" />, c: 'ig' },
    { n: 'TikTok', i: <TiktokLogo size={26} weight="fill" />, c: 'tt' },
    { n: 'WhatsApp', i: <WhatsappLogo size={26} weight="fill" />, c: 'wa' },
    { n: 'Messages', i: <ChatCircleText size={26} weight="fill" />, c: 'msg' },
  ]
  return (
    <div className="screen share-screen">
      <Header title="Share" />
      <div className="seg seg-share" role="tablist">
        {(['story', 'square'] as const).map(k => (
          <button key={k} role="tab" aria-selected={shape === k} className={shape === k ? 'is-on' : ''} onClick={() => setShape(k)}>{k === 'story' ? 'Story' : 'Post'}</button>
        ))}
      </div>
      <div className="share-stage">
        {/* Morph: the card shape morphs while preparing */}
        <motion.div className="share-morph" layout
          animate={ready ? { borderRadius: 6 } : { borderRadius: [6, 28, 10, 22, 6] }}
          transition={ready ? { duration: 0.2 } : { duration: 1, ease: 'easeInOut' }}
          style={{ aspectRatio: shape === 'story' ? '9 / 16' : '1 / 1' }}>
          <AnimatePresence mode="wait">
            {ready ? (
              <motion.div key={shape} className="share-morph-in" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <ShareCard ask={ask} shape={shape} now={now} />
              </motion.div>
            ) : (
              <motion.div key="prep" className="share-prep" exit={{ opacity: 0 }}>
                <Icon3D id={ask.icon} size={56} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="share-apps">
        {apps.map(a => (
          <button key={a.n} className="share-app" onClick={() => s.showToast(`Shared to ${a.n}`)}>
            <span className={`share-app-icon is-${a.c}`}>{a.i}</span>
            <span className="t-micro">{a.n}</span>
          </button>
        ))}
        <button className="share-app" onClick={copy}>
          <span className="share-app-icon"><LinkSimple size={26} weight="bold" /></span>
          <span className="t-micro">Copy link</span>
        </button>
      </div>
    </div>
  )
}

/** Opens straight to the ask: no sign-up or install needed to see it */
export function SharedLink() {
  const s = useStore()
  const now = useNow(30000)
  const link = s.sharedLink!
  const ask = s.asks.find(a => a.id === link.askId) ?? s.asks[0]
  const nearby = s.asks.filter(a => a.state === 'open' && a.id !== ask.id).slice(0, 3)
  return (
    <div className="web">
      <div className="web-bar"><span className="t-caption">askapade.com/ask/{ask.id}</span></div>
      <div className="web-body">
        {link.ended ? (
          <>
            <div className="web-ended">
              <span className="web-ended-icon"><Icon3D id={ask.icon} size={72} /></span>
              <h1 className="t-title1">This ask has ended.</h1>
            </div>
            <h2 className="t-title3 section-label">Asks nearby</h2>
            <ul className="nearby-list">{nearby.map(a => <li key={a.id}><AskCard ask={a} now={now} /></li>)}</ul>
          </>
        ) : (
          <>
            <div className="web-hero">
              <Icon3D id={ask.icon} size={112} />
              <Fee fee={ask.fee} finder={ask.finder} currency={ask.currency} size="lg" />
              <p className="t-title2 web-ask">{ask.text}</p>
              <div className="share-facts is-dark">
                <span><MapPin size={14} weight="fill" />{ask.area}</span>
                <span><Clock size={14} weight="bold" />{span(ask.endsAt - now)} left</span>
                <VerifiedMark on={ask.verified} size={16} />
              </div>
            </div>
            <Button full onClick={() => { s.setSharedLink(null); s.setOnboarded(true) }}>Send offer</Button>
            <div className="web-what">
              <span className="t-title3">askapade</span>
              <p className="t-body t-quiet">Ask for anything. Get paid for anything.</p>
              <button className="store-badge"><AppStoreLogo size={20} weight="fill" /><span className="t-callout">Get the app</span></button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
