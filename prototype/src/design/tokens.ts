// TS mirror of tokens.css for values that JS needs (motion, mascot palette, confetti).
// Colours stay in CSS; reference them as `var(--token)` in style objects.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const
export const spring = { type: 'spring', duration: 0.5, bounce: 0.2 } as const

/** Brand-derived celebration palette (confetti, sparkles). No lime. */
export const CELEBRATE = ['#008000', '#2E9E3E', '#7CC67F', '#EAF4E7', '#F5A524'] as const
