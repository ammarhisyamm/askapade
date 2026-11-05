import { useState } from 'react'
import { motion } from 'motion/react'
import { Receipt as ReceiptIcon, CheckCircle, Bank } from '@phosphor-icons/react'
import { useStore } from '../store'
import { money } from '../data'
import { CountUp, Icon3D, Button, Empty, Sheet, haptic, Confetti } from '../ui'
import { Header } from './Profile'

/** Glassy depth, a balance with character */
export function WalletCard({ balance, small }: { balance: number; small?: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <motion.div className={`wallet-card ${small ? 'is-small' : ''}`}
      onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 }) }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
      <span className="wallet-blob b1" /><span className="wallet-blob b2" /><span className="wallet-blob b3" />
      <span className="wallet-shine" />
      <span className="wallet-label t-caption">Balance</span>
      <span className="wallet-balance">
        <span className="wallet-cur">£</span>
        <CountUp value={balance} decimals={balance % 1 ? 2 : 0} className="t-display" />
      </span>
      <svg className="wallet-clover" viewBox="0 0 40 40" aria-hidden>
        {[0, 90, 180, 270].map(r => <circle key={r} cx="20" cy="11" r="8" transform={`rotate(${r} 20 20)`} />)}
      </svg>
    </motion.div>
  )
}

export function Wallet() {
  const s = useStore()
  const [withdraw, setWithdraw] = useState<null | 'confirm' | 'done'>(null)
  return (
    <div className="screen">
      <Header title="Wallet" />
      <div className="wallet-hero">
        <WalletCard balance={s.balance} />
        <Button full disabled={s.balance <= 0} onClick={() => setWithdraw('confirm')}>Withdraw</Button>
      </div>
      <h3 className="t-title3 section-label">Activity</h3>
      {s.txs.length === 0 ? <Empty icon={<ReceiptIcon size={30} weight="duotone" />} /> : (
        <ul className="tx-list">
          {s.txs.map(t => (
            <li key={t.id}>
              <button className="tx" onClick={() => s.push({ name: 'receipt', txId: t.id })}>
                <Icon3D id={t.icon} size={40} />
                <span className="tx-mid">
                  <span className="t-callout ellipsis">{t.label}</span>
                  <span className="t-caption t-quiet">{t.when}</span>
                </span>
                <span className="tx-right">
                  <span className={`t-num tx-amt ${t.amount > 0 ? 'is-in' : ''} ${t.tag === 'Failed' ? 'is-struck' : ''}`}>{t.amount > 0 ? '+' : ''}{money('£', t.amount)}</span>
                  {t.tag && <span className={`tx-tag t-micro tag-${t.tag.toLowerCase()}`}>{t.tag}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!withdraw} onClose={() => setWithdraw(null)} dark label="Withdraw">
        <div className="sheet-body center">
          {withdraw === 'done' ? (
            <>
              <Confetti run />
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="done-tick"><CheckCircle size={64} weight="fill" /></motion.span>
              <h2 className="t-title2">On its way!</h2>
              <Button full onClick={() => setWithdraw(null)}>Done</Button>
            </>
          ) : (
            <>
              <span className="bank-mark"><Bank size={30} weight="duotone" /></span>
              <span className="t-display">{money('£', s.balance)}</span>
              <span className="t-callout on-dark-quiet">Monzo, ending 4021</span>
              <Button full onClick={() => {
                haptic()
                s.setTxs(t => [{ id: `w${Date.now()}`, icon: 'money-and-coin', label: 'Withdrawal', amount: -s.balance, when: 'Today', tag: 'Pending' }, ...t])
                s.setBalance(0); setWithdraw('done')
              }}>Withdraw</Button>
            </>
          )}
        </div>
      </Sheet>
    </div>
  )
}

export function Receipt({ txId }: { txId: string }) {
  const s = useStore()
  const t = s.txs.find(x => x.id === txId)
  if (!t) return null
  const fee = Math.abs(t.amount)
  return (
    <div className="screen">
      <Header title="Receipt" />
      <div className="receipt">
        <Icon3D id={t.icon} size={72} />
        <span className="t-display">{t.amount > 0 ? '+' : ''}{money('£', t.amount)}</span>
        {t.tag && <span className={`tx-tag t-micro tag-${t.tag.toLowerCase()}`}>{t.tag}</span>}
        <p className="t-callout">{t.label}</p>
        <dl className="receipt-rows">
          <dt>Date</dt><dd>{t.when}</dd>
          <dt>Reference</dt><dd className="t-num">ASK-{t.id.toUpperCase()}</dd>
          {t.amount < 0 && t.label !== 'Withdrawal' && <><dt>Platform fee</dt><dd className="t-num">{money('£', Math.round((fee / 1.2) * 0.2 * 100) / 100)}</dd></>}
          <dt>Total</dt><dd className="t-num">{money('£', fee)}</dd>
        </dl>
      </div>
    </div>
  )
}
