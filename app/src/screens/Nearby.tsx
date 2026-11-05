import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapTrifold, CaretDown, Check, ListMagnifyingGlass } from '@phosphor-icons/react'
import { useStore } from '../store'
import { type Ask } from '../data'
import { AskCard, useNow, Empty, Button, spring } from '../ui'

type F = { dist: number | null; time: number | null; fee: number | null }
const OPTS = {
  dist: [null, 1, 3, 5].map(v => ({ v, l: v ? `Within ${v} km` : 'All' })),
  time: [null, 1, 6, 24].map(v => ({ v, l: v ? `Under ${v}h` : 'All' })),
  fee: [null, 10, 25].map(v => ({ v, l: v ? `£${v}+` : 'All' })),
}
const LABEL = { dist: 'Distance', time: 'Time', fee: 'Fee' }

/** Open asks nearby, as a list beside the map: nothing missed */
export function Nearby({ onOffer, onShare }: { onOffer: (a: Ask) => void; onShare: (a: Ask) => void }) {
  const s = useStore()
  const now = useNow(30000)
  const [f, setF] = useState<F>({ dist: null, time: null, fee: null })
  const [menu, setMenu] = useState<keyof F | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const list = s.asks
    .filter(a => a.state === 'open')
    .filter(a => !f.dist || a.km <= f.dist)
    .filter(a => !f.time || a.endsAt - now <= f.time * 3600_000)
    .filter(a => !f.fee || a.fee + a.finder >= f.fee)
    .sort((a, b) => a.km - b.km)

  return (
    <div className="screen nearby">
      <div className="nearby-head">
        <h1 className="t-title1">Nearby</h1>
        <button className="map-toggle" aria-label="Show map" onClick={s.pop}><MapTrifold size={20} weight="bold" /></button>
      </div>
      <div className="filters">
        {(Object.keys(OPTS) as (keyof F)[]).map(k => (
          <div key={k} className="filter-wrap">
            <button className={`filter ${f[k] ? 'is-on' : ''}`} onClick={() => setMenu(menu === k ? null : k)} aria-expanded={menu === k}>
              <span className="t-callout">{f[k] ? OPTS[k].find(o => o.v === f[k])!.l : LABEL[k]}</span>
              <CaretDown size={12} weight="bold" />
            </button>
            <AnimatePresence>
              {menu === k && (
                <motion.div className="filter-menu" initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={spring}>
                  {OPTS[k].map(o => (
                    <button key={o.l} onClick={() => { setF({ ...f, [k]: o.v }); setMenu(null) }}>
                      {o.l}{f[k] === o.v && <Check size={14} weight="bold" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {list.length === 0 ? <Empty icon={<ListMagnifyingGlass size={30} weight="duotone" />} /> : (
        <motion.ul className="nearby-list" layout>
          <AnimatePresence>
            {list.map(a => (
              <motion.li key={a.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                <AskCard ask={a} now={now} onClick={() => setOpenId(openId === a.id ? null : a.id)}>
                  <AnimatePresence>
                    {openId === a.id && (
                      <motion.div className="ask-card-actions" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        onClick={e => e.stopPropagation()}>
                        <span className="t-caption t-quiet">{a.area}</span>
                        <div className="row-2">
                          <Button kind="secondary" onClick={() => onShare(a)}>Share</Button>
                          <Button disabled={s.offered.includes(a.id)} onClick={() => onOffer(a)}>{s.offered.includes(a.id) ? 'Offer sent' : 'Send offer'}</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AskCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}
