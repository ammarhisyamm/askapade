// Every 3D icon in /public/icons, with the words that pick it.
// pickIcon() scores the ask text against these and returns the best match, so the map pin
// always gets an icon without the asker choosing one. Devs: same table ships in HANDOFF.md.
export type AskIcon = { obj: string; label: string; words: string[]; fee?: [number, number] }

export const ASK_ICONS: AskIcon[] = [
  { obj: 'puppy-face', label: 'Dog walk', words: ['dog', 'puppy', 'walk', 'bella', 'pup'], fee: [10, 15] },
  { obj: 'paw-print', label: 'Pet care', words: ['pet', 'cat', 'feed', 'paw', 'sit', 'hamster', 'rabbit', 'vet'], fee: [8, 14] },
  { obj: 'package-box', label: 'Parcel', words: ['parcel', 'package', 'collect', 'post office', 'delivery', 'return', 'courier', 'drop off'], fee: [6, 12] },
  { obj: 'mail-letter-open', label: 'Post', words: ['letter', 'mail', 'post a', 'stamp', 'envelope', 'card'], fee: [4, 8] },
  { obj: 'document', label: 'Paperwork', words: ['document', 'print', 'sign', 'form', 'copy', 'scan', 'paper'], fee: [5, 10] },
  { obj: 'coffee-cup', label: 'Coffee run', words: ['coffee', 'latte', 'tea', 'cafe', 'gail', 'starbucks', 'flat white'], fee: [4, 8] },
  { obj: 'burger', label: 'Food pickup', words: ['burger', 'takeaway', 'lunch', 'dinner', 'mcdonald', 'food'], fee: [5, 9] },
  { obj: 'pizza', label: 'Pizza', words: ['pizza', 'domino'], fee: [5, 9] },
  { obj: 'ice-cream', label: 'Treats', words: ['ice cream', 'dessert', 'cake', 'sweets', 'treat'], fee: [4, 8] },
  { obj: 'chef', label: 'Cooking', words: ['cook', 'meal', 'chef', 'bake', 'prep'], fee: [15, 30] },
  { obj: 'wine-glass', label: 'Drinks', words: ['wine', 'drinks', 'beer', 'bottle', 'off licence'], fee: [5, 10] },
  { obj: 'shopping-cart', label: 'Groceries', words: ['shop', 'shopping', 'grocer', 'tesco', 'sainsbury', 'aldi', 'lidl', 'supermarket', 'milk'], fee: [8, 14] },
  { obj: 'buy-basket', label: 'Errand', words: ['buy', 'pharmacy', 'chemist', 'boots', 'pick up', 'errand', 'medicine'], fee: [5, 10] },
  { obj: 'hammer', label: 'DIY', words: ['flatpack', 'ikea', 'assemble', 'build', 'fix', 'shelf', 'hang', 'drill', 'repair', 'mount', 'diy'], fee: [25, 50] },
  { obj: 'broomstick', label: 'Garden & sweep', words: ['sweep', 'garden', 'leaves', 'yard', 'weed', 'mow', 'lawn'], fee: [10, 20] },
  { obj: 'vacuum-cleaner', label: 'Cleaning', words: ['clean', 'hoover', 'vacuum', 'tidy', 'dust', 'wash'], fee: [15, 30] },
  { obj: 'recycling-bin', label: 'Rubbish', words: ['bin', 'rubbish', 'recycl', 'tip', 'trash', 'dump'], fee: [6, 12] },
  { obj: 'home', label: 'Home help', words: ['house', 'home', 'flat', 'plant', 'water the', 'move', 'moving', 'lift'], fee: [10, 25] },
  { obj: 'key', label: 'Keys', words: ['key', 'locked', 'spare', 'let in', 'letting'], fee: [6, 12] },
  { obj: 'key-2', label: 'Car keys', words: ['car key', 'fob'], fee: [6, 12] },
  { obj: 'suitcase', label: 'Luggage', words: ['suitcase', 'luggage', 'bag', 'airport', 'heathrow', 'carry'], fee: [10, 20] },
  { obj: 'sports-car', label: 'Lift', words: ['car', 'drive', 'lift to', 'ride', 'park the', 'jump start'], fee: [10, 25] },
  { obj: 'city-bus', label: 'Travel', words: ['bus', 'train', 'station', 'tube', 'commute', 'travel'], fee: [6, 12] },
  { obj: 'bicycle', label: 'Bike', words: ['bike', 'bicycle', 'cycle', 'puncture', 'tyre'], fee: [8, 15] },
  { obj: 'wheelchair', label: 'Assist', words: ['wheelchair', 'elderly', 'grandma', 'grandad', 'mobility', 'accompany', 'appointment'], fee: [10, 20] },
  { obj: 'macbook', label: 'Tech help', words: ['laptop', 'computer', 'macbook', 'wifi', 'printer', 'setup', 'set up', 'tech', 'install'], fee: [15, 30] },
  { obj: 'iphone', label: 'Phone help', words: ['iphone', 'phone screen', 'charger', 'app'], fee: [8, 15] },
  { obj: 'phone', label: 'Call', words: ['call', 'ring', 'phone'], fee: [4, 8] },
  { obj: 'dslr-camera', label: 'Photos', words: ['photo', 'picture', 'camera', 'headshot', 'shoot'], fee: [20, 40] },
  { obj: 'video-camera', label: 'Video', words: ['video', 'film', 'record'], fee: [20, 40] },
  { obj: 'microphone', label: 'Music', words: ['sing', 'mic', 'music', 'speaker', 'dj', 'karaoke'], fee: [15, 30] },
  { obj: 'school-backpack', label: 'School run', words: ['school', 'kids', 'child', 'nursery', 'homework', 'tutor'], fee: [10, 20] },
  { obj: 'notebook', label: 'Study', words: ['study', 'notes', 'lesson', 'revise', 'essay', 'teach'], fee: [15, 25] },
  { obj: 'hairdresser', label: 'Hair & beauty', words: ['hair', 'haircut', 'nails', 'makeup', 'beauty', 'barber'], fee: [15, 35] },
  { obj: 'hat', label: 'Clothes', words: ['hat', 'clothes', 'dry clean', 'laundry', 'iron', 'outfit', 'tailor'], fee: [6, 15] },
  { obj: 'dumbbell', label: 'Fitness', words: ['gym', 'workout', 'run with', 'train with', 'dumbbell', 'fitness', 'heavy'], fee: [10, 20] },
  { obj: 'soccer-ball', label: 'Football', words: ['football', 'soccer', 'five a side', '5 a side', 'kick'], fee: [5, 10] },
  { obj: 'american-football-ball', label: 'Sport', words: ['rugby', 'american football', 'sport', 'game'], fee: [5, 10] },
  { obj: 'ticket', label: 'Tickets', words: ['ticket', 'queue', 'box office', 'gig', 'concert'], fee: [8, 20] },
  { obj: 'cinema', label: 'Cinema', words: ['cinema', 'movie', 'film night'], fee: [8, 15] },
  { obj: 'popcorn', label: 'Snacks', words: ['popcorn', 'snack', 'crisps'], fee: [4, 8] },
  { obj: 'party', label: 'Party help', words: ['party', 'decorate', 'balloon', 'host'], fee: [15, 30] },
  { obj: 'confetti', label: 'Celebration', words: ['celebrat', 'surprise', 'confetti'], fee: [10, 25] },
  { obj: 'gift-box', label: 'Gift', words: ['gift', 'present', 'wrap', 'birthday'], fee: [6, 15] },
  { obj: 'pink-flower', label: 'Flowers', words: ['flower', 'bouquet', 'florist', 'roses'], fee: [6, 12] },
  { obj: 'wedding-ring', label: 'Wedding', words: ['wedding', 'ring', 'propos', 'engage'], fee: [20, 50] },
  { obj: 'heart', label: 'Kind favour', words: ['favour', 'kind', 'check on', 'company', 'chat with', 'neighbour'], fee: [5, 10] },
  { obj: 'chat', label: 'Advice', words: ['advice', 'help me with', 'question', 'translate'], fee: [5, 15] },
  { obj: 'conversation', label: 'Language', words: ['language', 'speak', 'conversation', 'practice'], fee: [10, 20] },
  { obj: 'cash', label: 'Cash', words: ['cash', 'atm', 'bank'], fee: [5, 10] },
  { obj: 'coins', label: 'Change', words: ['coins', 'change', 'parking meter'], fee: [3, 6] },
  { obj: 'money-coin', label: 'Pay something', words: ['pay', 'bill', 'deposit'], fee: [5, 10] },
  { obj: 'sand-timer', label: 'Wait in line', words: ['wait', 'queue for', 'hold a spot', 'save a spot'], fee: [8, 15] },
  { obj: 'beach-chair', label: 'Outdoors', words: ['beach', 'picnic', 'deckchair', 'chairs', 'park'], fee: [8, 15] },
  { obj: 'tree', label: 'Trees & plants', words: ['tree', 'hedge', 'prune', 'trim'], fee: [15, 30] },
  { obj: 'snowy-mountains', label: 'Snow', words: ['snow', 'ice', 'grit', 'shovel', 'frost'], fee: [10, 20] },
  { obj: 'pumpkin', label: 'Seasonal', words: ['pumpkin', 'halloween', 'christmas', 'seasonal'], fee: [8, 15] },
  { obj: 'cup-gold', label: 'Challenge', words: ['win', 'trophy', 'quiz', 'competition'], fee: [10, 20] },
  { obj: 'mystery-box', label: 'Something else', words: [], fee: [5, 15] },
]

export const FALLBACK = ASK_ICONS[ASK_ICONS.length - 1]

// Best match by keyword hits; longer phrases count more. Ties keep table order (common asks first).
export function pickIcon(text: string): AskIcon {
  const t = ' ' + text.toLowerCase() + ' '
  let best = FALLBACK, score = 0
  for (const ic of ASK_ICONS) {
    const s = ic.words.reduce((n, w) => n + (t.includes(w) ? w.length : 0), 0)
    if (s > score) { best = ic; score = s }
  }
  return best
}

export const byObj = (obj: string) => ASK_ICONS.find(i => i.obj === obj) ?? FALLBACK

// Quick ideas on an empty composer: one tap fills text, icon and fee.
export const IDEAS: { obj: string; t: string; fee: number }[] = [
  { obj: 'puppy-face', t: 'Walk my dog for 30 mins', fee: 12 },
  { obj: 'package-box', t: 'Collect a parcel from the post office', fee: 8 },
  { obj: 'coffee-cup', t: 'Grab me a coffee from Gail’s', fee: 5 },
  { obj: 'hammer', t: 'Build a flatpack wardrobe', fee: 35 },
  { obj: 'shopping-cart', t: 'Do a quick Tesco shop', fee: 10 },
  { obj: 'macbook', t: 'Help set up my new laptop', fee: 20 },
  { obj: 'key', t: 'Let a plumber into my flat', fee: 8 },
  { obj: 'vacuum-cleaner', t: 'Hoover the living room', fee: 18 },
]

// Typed out in the empty field, one after another.
export const PLACEHOLDERS = ['Walk Bella around the park…', 'Pick up my prescription…', 'Carry a sofa up 2 floors…', 'Return a parcel to Royal Mail…', 'Water my plants this weekend…']

// The ask that was just posted, so the waiting screens show the same icon and fee
export const posted = { obj: 'package-box', label: 'Parcel', fee: 12, cur: '£', dl: '1h' }
