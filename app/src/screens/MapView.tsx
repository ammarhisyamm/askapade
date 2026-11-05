import { useEffect, useRef, useState } from "react"
import maplibregl from 'maplibre-gl'
import { AnimatePresence, motion } from 'motion/react'
import { ShareFat, X } from '@phosphor-icons/react'
import { useStore } from '../store'
import { HOME, type Ask } from '../data'
import { FlatMarker, Fee, VerifiedMark, Button, useNow, span, distance, spring, Avatar } from '../ui'

const STYLE = 'https://tiles.openfreemap.org/styles/positron'

/** Metres per pixel at a latitude and zoom (web mercator) */
const mpp = (lat: number, z: number) => (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** z

export function MapView({ onOffer, onShare }: { onOffer: (a: Ask) => void; onShare: (a: Ask) => void }) {
  const s = useStore()
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [, force] = useState(0)
  const [sel, setSel] = useState<{ id: string; open: boolean } | null>(null)
  const now = useNow(15000)

  useEffect(() => {
    const m = new maplibregl.Map({
      container: el.current!, style: STYLE, center: HOME, zoom: 13.7, attributionControl: { compact: true },
      dragRotate: false, pitchWithRotate: false, preserveDrawingBuffer: true,
    })
    m.touchZoomRotate.disableRotation()
    m.on('move', () => force(x => x + 1))
    m.on('load', () => force(x => x + 1))
    m.on('click', () => setSel(null))
    map.current = m
    ;(window as any).__map = m
    return () => m.remove()
  }, [])

  // Searching and matched: centre on the person who asked
  const phase = s.myAsk?.phase
  useEffect(() => {
    const m = map.current; if (!m) return
    if (phase === 'searching' || phase === 'nobody') {
      const z = s.myAsk!.radiusKm > 1 ? 12.2 : 14.2
      m.flyTo({ center: HOME, zoom: z, offset: [0, -110], duration: 1200, essential: true })
      setSel(null)
    }
    if (phase === 'matched' || phase === 'chat') m.flyTo({ center: HOME, zoom: 14.6, offset: [0, -60], duration: 1000 })
  }, [phase, s.myAsk?.radiusKm])

  // Recenter requests from the map controls
  useEffect(() => {
    const h = () => map.current?.flyTo({ center: HOME, zoom: 13.7, duration: 900 })
    window.addEventListener('askapade:recenter', h)
    return () => window.removeEventListener('askapade:recenter', h)
  }, [])

  const m = map.current
  const project = (at: [number, number]) => (m ? m.project(at) : { x: -999, y: -999 })

  // Busy areas: pins group so the map stays calm
  const groups = (() => {
    if (!m) return []
    const out: { asks: Ask[]; x: number; y: number }[] = []
    const visible = s.asks.filter(a => !(s.myAsk && a.id === s.myAsk.id))
    for (const a of visible) {
      const p = project(a.at)
      const g = out.find(o => Math.hypot(o.x - p.x, o.y - p.y) < 46)
      if (g) { g.asks.push(a); g.x = (g.x + p.x) / 2; g.y = (g.y + p.y) / 2 } else out.push({ asks: [a], x: p.x, y: p.y })
    }
    return out
  })()

  const me = project(HOME)
  const z = m?.getZoom() ?? 14
  const radiusPx = s.myAsk ? (s.myAsk.radiusKm * 1000) / mpp(HOME[1], z) : 0
  const searching = phase === 'searching' || phase === 'nobody'
  const openInView = groups.some(g => g.asks.some(a => a.state === 'open') && g.x > 0 && g.y > 60 && g.x < (el.current?.clientWidth ?? 0) && g.y < (el.current?.clientHeight ?? 0) - 100)

  const selAsk = sel && s.asks.find(a => a.id === sel.id)

  return (
    <div className={`map-wrap ${!s.live ? 'is-blurred' : ''}`}>
      <div ref={el} className="map" aria-label="Map of asks nearby" />
      <div className="map-layer">
        {/* Radius pulse while searching */}
        {searching && (
          <div className="pulse" style={{ left: me.x, top: me.y }}>
            <motion.span className="pulse-area" animate={{ width: radiusPx * 2, height: radiusPx * 2 }} transition={{ type: 'spring', stiffness: 60, damping: 16 }} />
            {[0, 1, 2].map(i => (
              <motion.span key={i} className="pulse-ring" style={{ width: radiusPx * 2, height: radiusPx * 2 }}
                initial={{ scale: 0.05, opacity: 0.7 }} animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.86, ease: [0.2, 0.6, 0.35, 1] }} />
            ))}
          </div>
        )}

        {/* Matched: the ask’s area and the other person’s approximate approach */}
        {(phase === 'matched' || phase === 'chat') && s.myAsk?.match && <Approach me={me} radiusPx={300 / mpp(HOME[1], z)} p={s.myAsk.match} />}

        {/* Ask pins */}
        {!searching && groups.map(g => {
          if (g.asks.length > 1) {
            const done = g.asks.every(a => a.state === 'done')
            return (
              <button key={g.asks.map(a => a.id).join()} className={`cluster ${done ? 'is-done' : ''}`} style={{ left: g.x, top: g.y }}
                aria-label={`${g.asks.length} asks`}
                onClick={e => { e.stopPropagation(); m?.easeTo({ center: m.unproject([g.x, g.y]), zoom: z + 1.4, duration: 600 }) }}>
                <span className="cluster-stack">
                  {g.asks.slice(0, 2).map(a => <FlatMarker key={a.id} id={a.icon} size={30} done={a.state === 'done'} />)}
                </span>
                <span className="cluster-count t-micro">{g.asks.length}</span>
              </button>
            )
          }
          const a = g.asks[0]
          if (sel?.id === a.id) return null
          return (
            <motion.button key={a.id} className="pin" style={{ left: g.x, top: g.y }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}
              aria-label={`${a.text}, ${a.area}`}
              onClick={e => { e.stopPropagation(); setSel({ id: a.id, open: false }) }}>
              <FlatMarker id={a.icon} done={a.state === 'done'} />
            </motion.button>
          )
        })}

        {/* Tapped and open pin, morphing in place */}
        <AnimatePresence>
          {selAsk && sel && !searching && (() => {
            const p = project(selAsk.at)
            // Keep the card on screen; the tail still points at the pin
            const w = sel.open ? 290 : 220, W = el.current?.clientWidth ?? 393
            const cx = Math.min(Math.max(p.x, w / 2 + 12), W - w / 2 - 12)
            const left = selAsk.endsAt - now
            return (
              <motion.div key={selAsk.id} className={`pin-card ${sel.open ? 'is-open' : ''}`} style={{ left: cx, top: p.y }}
                layout initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                transition={spring} onClick={e => { e.stopPropagation(); if (!sel.open) setSel({ ...sel, open: true }) }}>
                <motion.div layout="position" className="pin-card-head">
                  <FlatMarker id={selAsk.icon} size={36} done={selAsk.state === 'done'} />
                  <div className="pin-card-sum">
                    <Fee fee={selAsk.fee} finder={selAsk.finder} currency={selAsk.currency} />
                    <span className="t-caption t-quiet">
                      {selAsk.state === 'done' ? 'Completed' : `${span(left)} left`}, {distance(selAsk.km)}
                    </span>
                  </div>
                  {sel.open && <button className="icon-btn sm" aria-label="Close" onClick={e => { e.stopPropagation(); setSel(null) }}><X size={16} weight="bold" /></button>}
                </motion.div>
                {sel.open && (
                  <motion.div className="pin-card-more" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <p className="t-body">{selAsk.text}</p>
                    <div className="pin-card-area t-caption">
                      <span>{selAsk.area}</span>
                      <VerifiedMark on={selAsk.verified} size={16} />
                    </div>
                    {selAsk.state === 'open' && (
                      <div className="row-2">
                        <Button kind="secondary" icon={<ShareFat size={18} weight="bold" />} onClick={() => onShare(selAsk)}>Share</Button>
                        <Button disabled={s.offered.includes(selAsk.id)} onClick={() => onOffer(selAsk)}>{s.offered.includes(selAsk.id) ? 'Offer sent' : 'Send offer'}</Button>
                      </div>
                    )}
                  </motion.div>
                )}
                <span className="pin-card-tail" style={{ left: p.x - cx + w / 2 }} />
              </motion.div>
            )
          })()}
        </AnimatePresence>

        {/* You */}
        <span className={`me-dot ${searching ? 'is-searching' : ''}`} style={{ left: me.x, top: me.y }} aria-label="Your location" />

        {/* Quiet area: a light prompt to post */}
        <AnimatePresence>
          {s.live && m && !openInView && !s.myAsk && !sel && (
            <motion.button className="quiet-prompt glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              onClick={() => s.setOverlay('post')}>
              <span className="t-callout">Post an ask</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Approach({ me, radiusPx, p }: { me: { x: number; y: number }; radiusPx: number; p: import('../data').Person }) {
  // Approximate approach only: never an exact location
  const from = { x: me.x + 120, y: me.y - 150 }
  return (
    <>
      <span className="area-circle" style={{ left: me.x, top: me.y, width: radiusPx * 2, height: radiusPx * 2 }} />
      <svg className="approach-line" style={{ left: 0, top: 0 }} width="100%" height="100%">
        <path d={`M${from.x} ${from.y} Q ${me.x + 110} ${me.y - 30} ${me.x + 22} ${me.y - 8}`} />
      </svg>
      <motion.span className="approach-avatar" style={{ left: from.x, top: from.y }}
        animate={{ x: [0, -40, -70], y: [0, 60, 110] }} transition={{ duration: 14, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}>
        <Avatar p={p} size={36} badge={false} />
      </motion.span>
    </>
  )
}
