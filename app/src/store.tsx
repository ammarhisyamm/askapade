import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { SEED_ASKS, PEOPLE, ME, HOME, TXS, type Ask, type Currency, type Person, type Tx } from './data'

export type Phase = 'searching' | 'nobody' | 'matched' | 'chat'
export type MyAsk = Ask & {
  phase: Phase; radiusKm: number; scenario: 1 | 2; boosted: boolean; postedAt: number
  match?: Person; note?: string; declined: boolean
}
export type Msg =
  | { id: string; from: 'me' | 'them' | 'system'; kind: 'text'; text: string }
  | { id: string; from: 'me' | 'them'; kind: 'location'; area: string }
  | { id: string; from: 'me' | 'them'; kind: 'photo'; src: string }
  | { id: string; from: 'me' | 'them'; kind: 'file'; name: string; size: string }
export type FuStatus = 'On my way' | 'Here' | 'Running late' | 'Done' | null
export type Chat = {
  id: string; ask: Ask; with: Person; mine: boolean /* I posted the ask */
  msgs: Msg[]; status: FuStatus; doneMe: boolean; doneThem: boolean
  paidAt?: number; cancelled?: 'me' | 'them'; reviewed?: boolean; unread?: number
}
export type Route =
  | { name: 'chat'; id: string } | { name: 'wallet' } | { name: 'settings' } | { name: 'levels' }
  | { name: 'lifeline' } | { name: 'verify' } | { name: 'notifications' } | { name: 'blocked' }
  | { name: 'edit-profile' } | { name: 'contact' } | { name: 'share'; askId: string } | { name: 'nearby' }
  | { name: 'other-profile'; username: string } | { name: 'receipt'; txId: string }

export type Inbound = { ask: Ask; mode: 'card' | 'banner' } | null
export type Overlay =
  | null | 'post' | 'boost' | 'payout' | 'received' | 'review' | 'cancel' | 'menu' | 'status' | 'attach'
  | 'sos' | 'report' | 'block' | 'levelup' | 'badge' | 'youGotIt' | 'cancelledByThem' | 'contact-done'

type Store = ReturnType<typeof useStoreState>
const Ctx = createContext<Store | null>(null)
export const useStore = () => useContext(Ctx)!

let uid = 0
export const id = () => `m${Date.now()}${uid++}`

function useStoreState() {
  const [onboarded, setOnboarded] = useState(false)
  const [signedUp, setSignedUp] = useState(false)
  const [hasCard, setHasCard] = useState(false)
  const [live, setLive] = useState(true) // false: city not live yet (waitlist)
  const [tab, setTab] = useState<'map' | 'chats' | 'profile'>('map')
  const [stack, setStack] = useState<Route[]>([])
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [asks, setAsks] = useState<Ask[]>(SEED_ASKS)
  const [myAsk, setMyAsk] = useState<MyAsk | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [inbound, setInbound] = useState<Inbound>(null)
  const [offered, setOffered] = useState<string[]>([])
  const [me, setMe] = useState<Person>(ME)
  const [txs, setTxs] = useState<Tx[]>(TXS)
  const [balance, setBalance] = useState(148)
  const [lifeline, setLifeline] = useState<{ name: string; phone: string; sharing: boolean }[]>([
    { name: 'Alex P.', phone: '+44 7700 900123', sharing: true },
  ])
  const [blocked, setBlocked] = useState<Person[]>([])
  const [mute, setMute] = useState(false)
  const [quiet, setQuiet] = useState<{ on: boolean; from: string; to: string }>({ on: true, from: '22:00', to: '07:00' })
  const [signupFor, setSignupFor] = useState<null | (() => void)>(null)
  const [sharedLink, setSharedLink] = useState<null | { askId: string; ended: boolean }>(null)
  const [verifyPrompt, setVerifyPrompt] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastT = useRef(0)

  const [chats, setChats] = useState<Chat[]>(() => {
    const now = Date.now()
    return [
      {
        id: 'c-old', mine: true, with: PEOPLE[2], status: 'Done', doneMe: true, doneThem: true, paidAt: now - 3 * 86400_000, reviewed: true,
        ask: { ...SEED_ASKS[12], state: 'done' },
        msgs: [
          { id: 'o1', from: 'them', kind: 'text', text: 'All swept. Left the brush by the door.' },
          { id: 'o2', from: 'me', kind: 'text', text: 'Looks great, thank you!' },
        ],
      },
    ]
  })

  const push = (r: Route) => setStack(s => [...s, r])
  const pop = () => setStack(s => s.slice(0, -1))
  const showToast = (s: string) => {
    setToast(s); clearTimeout(toastT.current)
    try { navigator.vibrate?.(10) } catch { /* no-op */ }
    toastT.current = window.setTimeout(() => setToast(null), 1900)
  }
  /** Ask only for what the next step needs: sign-up on first post or Offer */
  const requireAccount = (then: () => void) => {
    if (signedUp) then()
    else setSignupFor(() => then)
  }
  const updateChat = (cid: string, fn: (c: Chat) => Chat) => setChats(cs => cs.map(c => (c.id === cid ? fn(c) : c)))

  const reset = () => {
    setMyAsk(null); setSearchOpen(false); setInbound(null); setOverlay(null); setStack([]); setTab('map')
    setAsks(SEED_ASKS); setSharedLink(null); setLive(true); setOffered([])
  }

  return {
    onboarded, setOnboarded, signedUp, setSignedUp, hasCard, setHasCard, live, setLive, tab, setTab,
    stack, push, pop, setStack, overlay, setOverlay, asks, setAsks, myAsk, setMyAsk, searchOpen, setSearchOpen,
    inbound, setInbound, offered, setOffered, me, setMe, txs, setTxs, balance, setBalance, lifeline, setLifeline,
    blocked, setBlocked, mute, setMute, quiet, setQuiet, signupFor, setSignupFor, requireAccount, chats, setChats,
    updateChat, sharedLink, setSharedLink, verifyPrompt, setVerifyPrompt, activeChat, setActiveChat,
    toast, showToast, reset, home: HOME,
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const s = useStoreState()
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>
}

export const currencyFor = (_lngLat: [number, number]): Currency => '£'
