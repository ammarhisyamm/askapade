/* ---------- Ask icons ----------
   3D icon: /icons3d/{id}.png (cards, picker, chat, share cards only)
   Flat icon: /flat/{id}.svg, used only on maps. Placeholder art from Fluent Emoji Flat (MIT) until the bespoke set is drawn */
export type AskIcon = { id: string; words: string[] }

export const ICONS: AskIcon[] = [
  { id: 'bicycle', words: ['bike', 'bicycle', 'cycle', 'ride'] },
  { id: 'coffee-cup', words: ['coffee', 'flat white', 'latte', 'tea', 'cafe'] },
  { id: 'package-box', words: ['parcel', 'package', 'box', 'collect', 'delivery', 'post'] },
  { id: 'puppy-face', words: ['dog', 'puppy', 'walk', 'pet'] },
  { id: 'hammer', words: ['shelf', 'shelves', 'fix', 'diy', 'hammer', 'build', 'assemble', 'ikea'] },
  { id: 'dslr-camera', words: ['camera', 'photo', 'photographer', 'shoot'] },
  { id: 'suitcase', words: ['suitcase', 'luggage', 'bag', 'travel', 'carry'] },
  { id: 'vacuum-cleaner', words: ['vacuum', 'hoover', 'clean', 'cleaning'] },
  { id: 'pizza', words: ['pizza', 'dinner', 'takeaway'] },
  { id: 'macbook', words: ['laptop', 'macbook', 'charger', 'computer'] },
  { id: 'pink-flower', words: ['flower', 'flowers', 'bouquet', 'plant'] },
  { id: 'sports-car', words: ['lift', 'car', 'drive', 'airport', 'heathrow'] },
  { id: 'city-bus', words: ['bus', 'transport', 'commute'] },
  { id: 'chef', words: ['cook', 'chef', 'meal', 'bake'] },
  { id: 'gift-box', words: ['gift', 'present', 'wrap', 'birthday'] },
  { id: 'dumbbell', words: ['gym', 'dumbbell', 'workout', 'train'] },
  { id: 'burger', words: ['burger', 'food', 'lunch'] },
  { id: 'broomstick', words: ['sweep', 'broom', 'tidy'] },
  { id: 'home', words: ['home', 'house', 'flat', 'move', 'moving'] },
  { id: 'key', words: ['key', 'keys', 'lock', 'locked'] },
  { id: 'shopping-cart', words: ['shopping', 'groceries', 'supermarket', 'shop'] },
  { id: 'buy-basket', words: ['basket', 'market'] },
  { id: 'school-backpack', words: ['school', 'backpack', 'homework', 'tutor'] },
  { id: 'hat', words: ['hat', 'cap'] },
  { id: 'hairdresser', words: ['hair', 'haircut', 'barber', 'trim'] },
  { id: 'notebook', words: ['notes', 'notebook', 'write', 'study'] },
  { id: 'document', words: ['print', 'document', 'form', 'cv'] },
  { id: 'mail-letter-open', words: ['letter', 'mail', 'post', 'stamp'] },
  { id: 'iphone-14-pro', words: ['iphone', 'phone screen', 'mobile'] },
  { id: 'phone', words: ['phone', 'call', 'sim'] },
  { id: 'video-camera', words: ['video', 'film', 'record'] },
  { id: 'movie-and-cinema', words: ['movie', 'cinema', 'film'] },
  { id: 'popcorn', words: ['popcorn', 'snacks'] },
  { id: 'ticket', words: ['ticket', 'tickets', 'gig', 'concert', 'queue'] },
  { id: 'microphone', words: ['mic', 'karaoke', 'sing', 'podcast'] },
  { id: 'party', words: ['party', 'celebration'] },
  { id: 'confetti', words: ['decorate', 'balloons'] },
  { id: 'wine-glass', words: ['wine', 'drinks', 'bartender'] },
  { id: 'ice-cream', words: ['ice cream', 'dessert'] },
  { id: 'paw-print', words: ['cat', 'feed', 'pet sit'] },
  { id: 'tree', words: ['garden', 'tree', 'hedge', 'mow'] },
  { id: 'recycling-bin', words: ['bin', 'rubbish', 'recycle', 'tip'] },
  { id: 'beach-chair', words: ['chair', 'beach', 'deckchair'] },
  { id: 'snowy-mountains', words: ['hike', 'ski', 'mountain'] },
  { id: 'soccer-ball', words: ['football', 'soccer', 'five a side'] },
  { id: 'american-football-ball', words: ['rugby', 'ball'] },
  { id: 'cup-gold', words: ['trophy', 'quiz', 'win'] },
  { id: 'wedding-ring', words: ['ring', 'wedding', 'jewellery'] },
  { id: 'wheelchair', words: ['wheelchair', 'access', 'mobility'] },
  { id: 'heart', words: ['care', 'visit', 'company'] },
  { id: 'conversation', words: ['translate', 'talk', 'language'] },
  { id: 'chat', words: ['advice', 'chat'] },
  { id: 'mystery-box', words: ['anything', 'surprise'] },
  { id: 'money-and-coin', words: ['cash', 'change', 'money'] },
  { id: 'cash', words: ['pay', 'notes'] },
  { id: 'coins', words: ['coins', 'parking meter'] },
  { id: 'sand-timer', words: ['wait', 'queue for'] },
  { id: 'pumpkin', words: ['halloween', 'pumpkin', 'costume'] },
]

export const iconById = (id: string) => ICONS.find(i => i.id === id) ?? ICONS.find(i => i.id === 'mystery-box')!
export const icon3d = (id: string) => `/icons3d/${id}.png`
export const iconFlat = (id: string) => `/flat/${id}.svg`

/** The app picks one icon from the ask text; the person can swap it */
export function pickIcon(text: string): string {
  const t = text.toLowerCase()
  let best = { id: 'mystery-box', score: 0 }
  for (const i of ICONS) for (const w of i.words) {
    if (t.includes(w) && w.length > best.score) best = { id: i.id, score: w.length }
  }
  return best.id
}

/* ---------- Money ---------- */
export type Currency = '£' | '€' | '$'
export const PLATFORM_RATE = 0.2
export const money = (c: Currency, n: number) => {
  const whole = Math.abs(n % 1) < 0.001
  return `${n < 0 ? '−' : ''}${c}${whole ? Math.abs(n).toFixed(0) : Math.abs(n).toFixed(2)}`
}
/** Platform fee is 20% of the ask's fee only, never on the finder's fee */
export const totals = (fee: number, finder: number) => {
  const platform = Math.round(fee * PLATFORM_RATE * 100) / 100
  return { platform, total: fee + finder + platform }
}

/* ---------- Places ---------- */
export const HOME: [number, number] = [-0.1745, 51.5155] // Paddington
export type Area = { name: string; at: [number, number] }

/* ---------- People ---------- */
export type Level = 'Newbie' | 'Regular' | 'Apprentice' | 'Expert' | 'Veteran'
export const LEVELS: { name: Level; at: number; color: string }[] = [
  { name: 'Newbie', at: 0, color: 'var(--lv-newbie)' },
  { name: 'Regular', at: 10, color: 'var(--lv-regular)' },
  { name: 'Apprentice', at: 25, color: 'var(--lv-apprentice)' },
  { name: 'Expert', at: 50, color: 'var(--lv-expert)' },
  { name: 'Veteran', at: 100, color: 'var(--lv-veteran)' },
]
export const levelFor = (n: number) => [...LEVELS].reverse().find(l => n >= l.at)!

export type Person = {
  first: string; initial: string; username: string; photo?: string; verified: boolean
  rating: number; reviews: number; askapades: number
}
export const ME: Person = {
  first: 'Sam', initial: 'R', username: 'samr', verified: false,
  rating: 4.9, reviews: 21, askapades: 24,
}
export const PEOPLE: Person[] = [
  { first: 'Maya', initial: 'K', username: 'mayak', verified: true, rating: 4.9, reviews: 58, askapades: 61, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=faces' },
  { first: 'Tomás', initial: 'R', username: 'tomasr', verified: true, rating: 4.8, reviews: 30, askapades: 33, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces' },
  { first: 'Grace', initial: 'N', username: 'gracen', verified: false, rating: 5.0, reviews: 4, askapades: 6 },
]
export const fullName = (p: Person) => `${p.first} ${p.initial}.`
export const initials = (p: Person) => `${p.first[0]}${p.initial}`

/* ---------- Asks ---------- */
export type Ask = {
  id: string; text: string; icon: string; fee: number; finder: number; currency: Currency
  area: string; at: [number, number]; km: number; endsAt: number; verified: boolean
  state: 'open' | 'done'
}

const H = 3600_000, M = 60_000
const now = Date.now()
export const SEED_ASKS: Ask[] = [
  { id: 'A2301', text: 'I need a bike for the day', icon: 'bicycle', fee: 15, finder: 0, currency: '£', area: 'Little Venice', at: [-0.1838, 51.5214], km: 0.9, endsAt: now + 5 * H + 20 * M, verified: true, state: 'open' },
  { id: 'A2302', text: 'Two flat whites from the café on Praed Street, delivered to my desk', icon: 'coffee-cup', fee: 6, finder: 0, currency: '£', area: 'Paddington', at: [-0.1712, 51.5168], km: 0.3, endsAt: now + 40 * M, verified: true, state: 'open' },
  { id: 'A2303', text: 'Collect a parcel from the Post Office before it closes', icon: 'package-box', fee: 8, finder: 2, currency: '£', area: 'Marylebone', at: [-0.1585, 51.5205], km: 1.2, endsAt: now + 2 * H + 5 * M, verified: false, state: 'open' },
  { id: 'A2304', text: 'Walk my dog around Hyde Park for 30 minutes', icon: 'puppy-face', fee: 12, finder: 0, currency: '£', area: 'Bayswater', at: [-0.1876, 51.5117], km: 1.0, endsAt: now + 3 * H + 45 * M, verified: true, state: 'open' },
  { id: 'A2305', text: 'Help me put up two shelves. I have the drill', icon: 'hammer', fee: 30, finder: 5, currency: '£', area: 'Maida Vale', at: [-0.1905, 51.5272], km: 1.6, endsAt: now + 11 * H, verified: true, state: 'open' },
  { id: 'A2306', text: 'Lend me a camera for a gig tonight', icon: 'dslr-camera', fee: 25, finder: 0, currency: '£', area: 'Edgware Road', at: [-0.1688, 51.5203], km: 0.6, endsAt: now + 4 * H + 10 * M, verified: false, state: 'open' },
  { id: 'A2307', text: 'Carry two suitcases from my flat to Paddington station', icon: 'suitcase', fee: 10, finder: 0, currency: '£', area: 'Westbourne Park', at: [-0.2005, 51.5195], km: 1.9, endsAt: now + 55 * M, verified: true, state: 'open' },
  { id: 'A2308', text: 'Borrow a vacuum for an hour', icon: 'vacuum-cleaner', fee: 5, finder: 0, currency: '£', area: 'Paddington', at: [-0.1768, 51.5139], km: 0.4, endsAt: now + 1 * H + 30 * M, verified: true, state: 'open' },
  { id: 'A2309', text: 'A bouquet for a birthday, by 6pm', icon: 'pink-flower', fee: 20, finder: 4, currency: '£', area: 'Marylebone', at: [-0.1525, 51.5178], km: 1.5, endsAt: now + 6 * H, verified: true, state: 'open' },
  { id: 'A2310', text: 'A lift to Heathrow at 5am', icon: 'sports-car', fee: 40, finder: 5, currency: '£', area: 'Notting Hill', at: [-0.2055, 51.5128], km: 2.4, endsAt: now + 18 * H, verified: true, state: 'open' },
  { id: 'A2311', text: 'Lend me a USB-C laptop charger for the afternoon', icon: 'macbook', fee: 8, finder: 0, currency: '£', area: 'Paddington', at: [-0.1726, 51.5181], km: 0.3, endsAt: now + 2 * H + 40 * M, verified: false, state: 'open' },
  // Completed asks stay on the map, greyed out
  { id: 'A2290', text: 'Pick up a pizza', icon: 'pizza', fee: 7, finder: 0, currency: '£', area: 'Bayswater', at: [-0.1812, 51.5098], km: 1.0, endsAt: now, verified: true, state: 'done' },
  { id: 'A2291', text: 'Sweep my balcony', icon: 'broomstick', fee: 10, finder: 0, currency: '£', area: 'Marylebone', at: [-0.1622, 51.5236], km: 1.1, endsAt: now, verified: true, state: 'done' },
  { id: 'A2292', text: 'Wrap five presents', icon: 'gift-box', fee: 12, finder: 0, currency: '£', area: 'Maida Vale', at: [-0.1832, 51.5262], km: 1.3, endsAt: now, verified: true, state: 'done' },
  { id: 'A2293', text: 'Spot me at the gym', icon: 'dumbbell', fee: 8, finder: 0, currency: '£', area: 'Edgware Road', at: [-0.1652, 51.5168], km: 0.7, endsAt: now, verified: false, state: 'done' },
]

/** Countdown in hours and minutes: 00:45 for 45 minutes, 12:10 for 12 hours */
export function hhmm(ms: number) {
  const m = Math.max(0, Math.floor(ms / M))
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
/** Short span for cards: 45m, 5h, 5h 20m */
export function span(ms: number) {
  const m = Math.max(0, Math.round(ms / M))
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60), r = m % 60
  return r ? `${h}h ${r}m` : `${h}h`
}

/* ---------- Wallet ---------- */
export type Tx = { id: string; icon: string; label: string; amount: number; when: string; tag?: 'Pending' | 'Refunded' | 'Failed' }
export const TXS: Tx[] = [
  { id: 't1', icon: 'bicycle', label: 'Lent a bike for the day', amount: 15, when: 'Today', tag: 'Pending' },
  { id: 't2', icon: 'home', label: 'Helped with a move', amount: 40, when: 'Yesterday' },
  { id: 't3', icon: 'coins', label: 'Finder’s fee', amount: 5, when: 'Yesterday' },
  { id: 't4', icon: 'coffee-cup', label: 'Two flat whites', amount: -7.2, when: '28 Oct' },
  { id: 't5', icon: 'package-box', label: 'Collect a parcel', amount: 9.6, when: '27 Oct', tag: 'Refunded' },
  { id: 't6', icon: 'money-and-coin', label: 'Withdrawal', amount: -60, when: '25 Oct', tag: 'Failed' },
  { id: 't7', icon: 'hammer', label: 'Put up shelves', amount: 30, when: '24 Oct' },
  { id: 't8', icon: 'puppy-face', label: 'Walked a dog', amount: 12, when: '22 Oct' },
]

export const ACHIEVEMENTS = [
  { id: 'first-askapade', name: 'First askapade', earned: true },
  { id: 'first-ask', name: 'First ask posted', earned: true },
  { id: 'first-finder', name: 'First finder’s fee', earned: true },
  { id: 'first-review', name: 'First review', earned: true },
  { id: 'verified', name: 'Verified', earned: false },
  { id: 'five', name: '5 askapades', earned: true },
  { id: 'five-finder', name: '5 finder’s fees', earned: false },
  { id: 'ten-stars', name: '10 five-star reviews', earned: true },
  { id: 'two-fifty', name: '250 askapades', earned: false },
] as const
