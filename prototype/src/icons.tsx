// One icon vocabulary for the app (Phosphor). Actions and states are filled; navigation follows iOS:
// filled when selected, regular when not. Lucide stays for neutral glyphs inside rows and fields.
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CaretDoubleRight, ChatCircleDots, Check, CheckCircle, Compass, InstagramLogo, LinkSimple, SealCheck, Star, User, Wallet, WhatsappLogo } from '@phosphor-icons/react'

type P = { size?: number; color?: string; style?: CSSProperties }

export const ChatIcon = ({ size = 20, color, style }: P) => <ChatCircleDots weight="fill" size={size} color={color} style={style} />
export const Tick = ({ size = 20, color = 'var(--brand)', style }: P) => <CheckCircle weight="fill" size={size} color={color} style={style} />
export const VerifiedSeal = ({ size = 16, color = 'var(--brand)', style }: P) => <SealCheck weight="fill" size={size} color={color} style={style} />
export const Back = ({ size = 20, color, style }: P) => <ArrowLeft weight="bold" size={size} color={color} style={style} />
export const Go = ({ size = 16, color, style }: P) => <ArrowRight weight="bold" size={size} color={color} style={style} />
export const GoOut = ({ size = 16, color, style }: P) => <ArrowUpRight weight="bold" size={size} color={color} style={style} />
export const Slide = ({ size = 26, color, style }: P) => <CaretDoubleRight weight="fill" size={size} color={color} style={style} />
export const StarFill = ({ size = 12, color = 'var(--rating)', style }: P) => <Star weight="fill" size={size} color={color} style={{ verticalAlign: -1, ...style }} />
export const CheckMark = ({ size = 18, color, style }: P) => <Check weight="bold" size={size} color={color} style={style} />

// Brand marks for sharing — official glyphs, never a generic bubble
export const WhatsApp = ({ size = 26, color = 'var(--on-brand)' }: P) => <WhatsappLogo weight="fill" size={size} color={color} />
export const Instagram = ({ size = 26, color = 'var(--on-brand)' }: P) => <InstagramLogo weight="bold" size={size} color={color} />
export const CopyLink = ({ size = 24, color = 'var(--on-brand)' }: P) => <LinkSimple weight="bold" size={size} color={color} />

// Tab bar glyphs: filled when active, regular otherwise
export const TAB_ICONS = { explore: Compass, asks: ChatCircleDots, wallet: Wallet, you: User } as const
