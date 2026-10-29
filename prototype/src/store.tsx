import { createContext, useContext } from 'react'

export type Kind = 'push' | 'back' | 'fade' | 'up' | 'down' | 'tab'
export type Route = { name: string; p?: Record<string, unknown>; kind: Kind; key: number }

export type AppCtx = {
  route: Route
  go: (name: string, p?: Record<string, unknown>, kind?: Kind) => void
  scenario: 1 | 2
  setScenario: (s: 1 | 2) => void
}

export const Ctx = createContext<AppCtx>(null as unknown as AppCtx)
export const useApp = () => useContext(Ctx)
