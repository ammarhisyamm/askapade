// Dev-only helpers that capture prototype screens as Figma layer trees (see figma/README.md).
// Load in the browser console: await import('/_capture.js')
const wait = ms => new Promise(r => setTimeout(r, ms))
const waitFor = async (sel, t = 8000) => {
  const t0 = Date.now()
  while (Date.now() - t0 < t) { const e = document.querySelector(sel); if (e) return e; await wait(100) }
  throw new Error('timeout ' + sel)
}
const setValue = (el, v) => {
  const p = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}
const panel = t => [...document.querySelectorAll('.panel-btn')].find(b => b.textContent.startsWith(t)).click()

const family = f => /maname/i.test(f) ? 'Maname' : /apfel|askapade currency/i.test(f) ? 'Apfel Grotezk' : /aileron/i.test(f) ? 'Aileron' : null
const style = (fam, w) => fam === 'Maname' ? 'Regular' : fam === 'Apfel Grotezk' ? 'Bold' : w >= 700 ? 'Bold' : w >= 600 ? 'SemiBold' : 'Regular'
// When the DOM can't be hit, follow the type scale: Aileron weight by size
const guessWeight = size => ({ 11: 700, 12: 700, 13: 600, 14: 700, 15: 600 })[Math.round(size)] || 400

/** Inputs don't serialise their values: mirror them as plain elements while capturing */
function mirrorInputs() {
  const added = []
  document.querySelectorAll('.phone-screen input, .phone-screen textarea').forEach(el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    if (r.width < 2 || cs.opacity === '0' || cs.visibility === 'hidden' || el.type === 'checkbox' || el.type === 'radio') return
    const host = el.offsetParent || el.parentElement, hr = host.getBoundingClientRect()
    const d = document.createElement('div')
    if (el.type === 'range') {
      const p = (el.value - el.min) / ((el.max - el.min) || 1)
      d.innerHTML = `<div style="position:absolute;left:0;right:0;top:${r.height / 2 - 3}px;height:6px;border-radius:3px;background:linear-gradient(to right,#249B40 ${p * 100}%,#E4E4E1 ${p * 100}%)"></div><div style="position:absolute;top:${r.height / 2 - 13}px;left:calc(${p * 100}% - ${p * 26}px);width:26px;height:26px;border-radius:6px;background:#fff;box-shadow:0 0 0 1px rgba(17,17,17,.08),0 2px 6px rgba(17,17,17,.25)"></div>`
    } else {
      const v = el.value || el.placeholder || ''
      if (!v) return
      d.textContent = v
      for (const k of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingLeft', 'paddingRight', 'textAlign']) d.style[k] = cs[k]
      d.style.color = el.value ? cs.color : el.closest('.sheet.is-dark') ? 'rgba(255,255,255,.4)' : el.matches('.field-ask textarea') ? '#B5B5B1' : '#8E8E8A'
      d.style.whiteSpace = el.tagName === 'TEXTAREA' ? 'pre-wrap' : 'nowrap'
      d.style.overflow = 'hidden'
    }
    Object.assign(d.style, { position: 'absolute', left: r.left - hr.left + host.scrollLeft + 'px', top: r.top - hr.top + host.scrollTop + 'px', width: r.width + 'px', height: r.height + 'px', pointerEvents: 'none', boxSizing: 'border-box' })
    host.appendChild(d)
    added.push([d, el, el.style.color, el.style.webkitTextFillColor])
    el.style.color = 'transparent'; el.style.webkitTextFillColor = 'transparent'
  })
  return () => added.forEach(([d, el, c, w]) => { d.remove(); el.style.color = c; el.style.webkitTextFillColor = w })
}

/** WebGL maps can't be serialised: swap each canvas for a snapshot image */
function snapshotMaps() {
  const tmp = []
  document.querySelectorAll('.phone-screen canvas.maplibregl-canvas').forEach(c => {
    const img = document.createElement('img')
    img.src = c.toDataURL('image/jpeg', 0.8)
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
    c.parentElement.appendChild(img); c.style.visibility = 'hidden'; tmp.push([img, c])
  })
  return () => tmp.forEach(([img, c]) => { img.remove(); c.style.visibility = '' })
}

/** html-to-figma drops font weights: read the real font of every text layer from the DOM */
function addFonts(layers) {
  const walk = (n, ox, oy) => {
    const x = ox + (n.x || 0), y = oy + (n.y || 0)
    if (n.type === 'TEXT') {
      const probe = (n.characters || '').trim().slice(0, 6)
      const el = document.elementsFromPoint(x + Math.min(n.width / 2, 6), y + n.height / 2)
        .find(e => e.textContent && e.textContent.includes(probe) && [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()))
      const cs = el ? getComputedStyle(el) : null
      const fam = cs ? family(cs.fontFamily) : family(n.fontFamily || '')
      if (fam) n.fontName = { family: fam, style: style(fam, cs ? parseInt(cs.fontWeight) : guessWeight(n.fontSize)) }
      else if (/apple|helvetica|system-ui/i.test(n.fontFamily || '')) n.fontName = { family: 'Inter', style: cs && parseInt(cs.fontWeight) >= 600 ? 'Semi Bold' : 'Regular' }
    }
    for (const c of n.children || []) walk(c, x, y)
  }
  ;(Array.isArray(layers) ? layers : [layers]).forEach(l => walk(l, 0, 0))
}

async function capture(name) {
  await Promise.all([...document.querySelectorAll('.phone-screen img')].map(i => (i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r }))))
  const undoInputs = mirrorInputs(), undoMaps = snapshotMaps()
  await wait(150)
  try {
    const layers = window.__htmlToFigma('.phone-screen', true)
    addFonts(layers)
    const r = await fetch('/__figma?name=' + name, { method: 'POST', body: JSON.stringify(layers) })
    return name + ':' + (await r.text())
  } finally { undoInputs(); undoMaps() }
}

const $ = s => document.querySelector(s)
const btn = (scope, text) => [...document.querySelectorAll(scope)].find(b => b.textContent.trim().startsWith(text))
const back = async () => { $('.pushed [aria-label="Back"]').click(); await wait(700) }
const postAsk = async (text, fee, finder) => {
  await waitFor('.field-ask textarea'); await wait(500)
  setValue($('.field-ask textarea'), text); setValue($('input[aria-label="Fee"]'), fee); await wait(300)
  if (finder) setValue($('input[aria-label="Finder’s fee"]'), finder)
  await wait(1200)
}

/** Every screen in the Figma file, in capture order. Each part stays short enough for one devtools call. */
const parts = [
  async out => {
    panel('Reset'); await wait(800); panel('Intro carousel'); await waitFor('.carousel-foot .btn')
    for (let i = 0; i < 4; i++) { await wait(2000); out.push(await capture('0' + (i + 1) + '-carousel')); $('.carousel-foot .btn').click() }
    await waitFor('.pin', 10000); await wait(3000); out.push(await capture('05-map-idle'))
    const s = $('.phone-screen').getBoundingClientRect(), cx = s.x + s.width / 2, cy = s.y + s.height * 0.55
    const pin = [...document.querySelectorAll('.pin')].map(p => { const r = p.getBoundingClientRect(); return [Math.hypot(r.x - cx, r.y - cy), p] }).sort((a, b) => a[0] - b[0])[0][1]
    pin.click(); await wait(1200); out.push(await capture('06-map-pin-tapped'))
    $('.pin-card').click(); await wait(1200); out.push(await capture('07-map-pin-open'))
    panel('Reset'); await wait(600); $('[aria-label="Nearby list"]').click(); await waitFor('.nearby-list'); await wait(1500); out.push(await capture('08-nearby'))
  },
  async out => {
    panel('Scenario 1'); await postAsk('Help me put up two shelves this afternoon', '30', '5'); out.push(await capture('09-post-an-ask'))
    $('.post-foot .btn').click(); await waitFor('.search-sheet'); await wait(2500); out.push(await capture('10-searching'))
    await waitFor('.match-card', 12000); await wait(1500); out.push(await capture('11-match'))
    await waitFor('.chat', 9000); await wait(3800); out.push(await capture('12-chat'))
    $('.chat [aria-label="Menu"]').click(); await waitFor('.menu-list'); await wait(900); out.push(await capture('13-chat-menu'))
    btn('.menu-list button', 'Cancel ask').click(); await waitFor('.modal'); await wait(1000); out.push(await capture('14-cancel-confirm'))
    $('.modal .btn').click(); await wait(800)
  },
  async out => {
    $('.chat [aria-label="Menu"]').click(); await waitFor('.menu-list'); await wait(700)
    btn('.menu-list button', 'SOS').click(); await waitFor('.sos'); await wait(1000); out.push(await capture('15-sos'))
    $('.scrim').click(); await wait(900)
    $('.chat [aria-label="Add attachment"]').click(); await waitFor('.attach-grid'); await wait(900); out.push(await capture('16-attachments'))
    $('.scrim').click(); await wait(900)
    const sw = $('.swipe'); sw.focus(); sw.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await waitFor('.payout', 6000); await wait(900); out.push(await capture('17-release-payout'))
    btn('.payout .btn', 'Release payout').click(); await wait(1400); out.push(await capture('18-payout-released'))
    await waitFor('.levelup', 6000); await wait(1500); out.push(await capture('19-level-up'))
    $('.levelup .btn').click(); await wait(600)
    btn('.payout .btn', 'Leave a review').click(); await waitFor('.stars'); await wait(800)
    document.querySelectorAll('.stars button')[4].click(); await wait(700); out.push(await capture('20-review'))
    $('.review .btn').click(); await wait(600)
  },
  async out => {
    panel('Scenario 2'); await postAsk('Lend me a bike for the day', '15')
    $('.post-foot .btn').click(); await waitFor('.search-copy .btn', 12000); await wait(1200); out.push(await capture('21-nobody-yet'))
    $('.search-copy .btn').click(); await waitFor('.boosts'); await wait(1500); out.push(await capture('22-boost'))
    $('.scrim').click(); await wait(700)
    $('.search-min').click(); await waitFor('.live-status'); await wait(1200); out.push(await capture('23-live-status-on-map'))
    panel('Receive an ask (mid'); await waitFor('.inbound-banner'); await wait(1300); out.push(await capture('24-inbound-banner'))
    panel('Reset'); await wait(900)
    panel('Receive an ask (idle)'); await waitFor('.inbound .btn'); await wait(1500); out.push(await capture('25-inbound-card'))
    $('.inbound .btn').click(); await waitFor('.got-it', 6000); await wait(900); out.push(await capture('26-you-got-it'))
    await waitFor('.chat', 9000); await wait(3500); out.push(await capture('27-chat-fulfilling'))
    $('.status-chip').click(); await waitFor('.status-grid'); await wait(1200); out.push(await capture('28-status-sheet'))
    $('.scrim').click(); await wait(700)
  },
  async out => {
    panel('Reset'); await wait(800)
    btn('.tab', 'Chats').click(); await wait(1200); out.push(await capture('29-chats'))
    btn('.tab', 'Profile').click(); await wait(1800); out.push(await capture('30-profile'))
    $('.wallet-mini').click(); await wait(2000); out.push(await capture('31-wallet')); await back()
    $('.stat-row button.stat').click(); await wait(1800); out.push(await capture('32-levels')); await back()
    $('[aria-label="Settings"]').click(); await wait(1200); out.push(await capture('33-settings'))
    const row = t => [...document.querySelectorAll('.set-row')].find(b => b.textContent.includes(t))
    row('Notifications').click(); await wait(1200); out.push(await capture('34-notification-settings')); await back()
    row('Lifeline').click(); await wait(1200); out.push(await capture('35-lifeline')); await back()
    row('Blocked').click(); await wait(1200); out.push(await capture('36-blocked-empty')); await back()
    row('Contact us').click(); await wait(1200); out.push(await capture('37-contact-us'))
    $('.topic').click(); await wait(300); btn('.pushed .btn', 'Send').click(); await wait(1300); out.push(await capture('38-were-on-it')); await back()
  },
  async out => {
    const row = t => [...document.querySelectorAll('.set-row')].find(b => b.textContent.includes(t))
    row('ID verification').click(); await wait(1300); out.push(await capture('39-verify-entry'))
    btn('.pushed .btn', 'Verify ID').click(); await wait(1300); out.push(await capture('40-verify-waiting'))
    await waitFor('.verify-warn', 6000); await wait(900); out.push(await capture('41-verify-try-again'))
    btn('.pushed .btn', 'Try again').click(); await wait(4200); out.push(await capture('42-verified'))
    panel('Reset'); await wait(1200)
    panel('Verify prompt'); await waitFor('.modal'); await wait(1200); out.push(await capture('43-verify-prompt-6h'))
    $('.scrim').click(); await wait(700)
  },
  async out => {
    panel('Reset'); await wait(600)
    $('[aria-label="Nearby list"]').click(); await waitFor('.nearby-list'); await wait(1100)
    document.querySelectorAll('.nearby-list .ask-card')[4].click(); await wait(700)
    btn('.ask-card-actions .btn', 'Share').click(); await wait(2400); out.push(await capture('44-share-story'))
    document.querySelectorAll('.seg-share button')[1].click(); await wait(2200); out.push(await capture('45-share-post'))
    panel('Waitlist'); await waitFor('.waitlist'); await wait(1600); out.push(await capture('46-waitlist'))
    panel('Shared link,'); await waitFor('.web-ended'); await wait(1200); out.push(await capture('48-shared-link-ended'))
    panel('Shared link'); await waitFor('.web-hero'); await wait(1200); out.push(await capture('47-shared-link'))
  },
  async out => {
    panel('Reset'); await wait(800); panel('First post'); await postAsk('Walk my dog for 30 minutes', '12')
    $('.post-foot .btn').click()
    setValue(await waitFor('.signup input[type=email]'), 'sam@example.com'); await wait(900); out.push(await capture('49-signup-email'))
    await wait(300); $('.signup .btn').click()
    setValue(await waitFor('.code-boxes input'), '482'); await wait(800); out.push(await capture('50-signup-code'))
    setValue($('.code-boxes input'), '482913')
    setValue(await waitFor('.signup input[aria-label="First name"]'), 'Sam'); await wait(300); $('.photo-pick').click(); await wait(1200); out.push(await capture('51-signup-name-photo'))
    $('.signup .btn').click(); await waitFor('.perm-me'); await wait(1400); out.push(await capture('52-signup-location'))
  },
  async out => {
    $('.signup .btn').click(); await waitFor('.ios-alert'); await wait(600); out.push(await capture('53-ios-always'))
    $('.ios-alert button').click(); await waitFor('.perm-scene.is-notif'); await wait(1500); out.push(await capture('54-signup-notifications'))
    btn('.signup button', 'Not now').click(); await waitFor('.perm-scene.is-life'); await wait(1400); out.push(await capture('55-signup-lifeline'))
    btn('.signup button', 'Skip').click(); await waitFor('.dark-input'); await wait(1300); out.push(await capture('56-add-card'))
    $('.scrim')?.click(); await wait(500); panel('Reset'); await wait(1500)
    for (const [b, name] of [['No connection', '57-no-connection'], ['Location off', '58-location-off'], ['Payment failed', '59-payment-failed']]) {
      panel(b); await waitFor('.modal'); await wait(1100); out.push(await capture(name)); $('.modal .btn').click(); await wait(900)
    }
    panel('Account paused'); await waitFor('.modal'); await wait(1100); out.push(await capture('60-account-paused'))
  },
]
const runPart = async i => { const out = []; await parts[i](out); return out }

Object.assign(window, { __wait: wait, __for: waitFor, __set: setValue, __panel: panel, __cap: capture, __runPart: runPart })
export { capture, runPart }
