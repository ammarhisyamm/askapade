#!/usr/bin/env node
// Design-system guard: fails when UI code bypasses the tokens in src/design/tokens.css.
// Exceptions must be explicit: put `ds-allow: <reason>` on the line, or wrap a block in
// `ds-allow-start: <reason>` … `ds-allow-end` comments.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('../src/', import.meta.url).pathname
const SKIP = new Set(['design/tokens.css', 'design/tokens.ts', 'vite-env.d.ts'])
const RULES = [
  { id: 'raw-colour', re: /#[0-9a-fA-F]{3,8}\b|\brgba?\(/g, why: 'use a colour token (var(--…))' },
  { id: 'lime', re: /\blime\b|C8F560|F1FCD9/gi, why: 'the lime accent was retired — use --brand / --brand-tint / --brand-light' },
  { id: 'font-size', re: /fontSize: \d+|font-size: \d+px/g, why: 'use a --fs-* token' },
  { id: 'font-weight', re: /fontWeight: \d+|font-weight: \d+/g, why: 'use a --fw-* token (500/600/700/800 only)' },
  { id: 'radius', re: /borderRadius: (\d+)\b(?!\s*[*/+-])|border-radius: (\d+)px/g, why: 'use a --r-* token', test: m => Number(m[1] ?? m[2]) > 4 },
  { id: 'font-family', re: /font-family:(?!\s*var\(--font\))|fontFamily:(?!\s*'var\(--font\)')/g, why: 'Figtree only, via var(--font)' },
]

const files = []
const walk = d => readdirSync(d).forEach(n => { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(n) && files.push(p) })
walk(ROOT)

let count = 0
const report = {}
for (const f of files) {
  const rel = relative(ROOT, f)
  if (SKIP.has(rel)) continue
  let allow = false
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/ds-allow-start/.test(line)) allow = true
    const skip = allow || /ds-allow:/.test(line)
    if (/ds-allow-end/.test(line)) allow = false
    if (skip) return
    for (const r of RULES) for (const m of line.matchAll(r.re)) {
      if (r.test && !r.test(m)) continue
      ;(report[rel] ??= []).push(`  ${i + 1}: [${r.id}] ${m[0]} — ${r.why}`)
      count++
    }
  })
}
for (const [f, lines] of Object.entries(report)) console.log(`\n${f}\n${lines.join('\n')}`)
console.log(count ? `\n✗ ${count} design-system violation(s)` : '✓ design system: no violations')
process.exit(count ? 1 : 0)
