import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { load, save } from '../lib/storage'

export type Screen =
  | 'intro'
  | 'briefing'
  | 'm1'
  | 'o1'
  | 'm2'
  | 'o2'
  | 'm3'
  | 'o3'
  | 'm4'
  | 'o4'
  | 'result'
  | 'facts'

export const FLOW: Screen[] = ['intro', 'briefing', 'm1', 'o1', 'm2', 'o2', 'm3', 'o3', 'm4', 'o4', 'result', 'facts']

/** Maximal erreichbare Punkte je Mission (für Sterne & Ränge). */
export const MISSION_MAX = [1050, 900, 450, 500]

interface GameState {
  screen: Screen
  name: string
  missionScores: number[]
  round: number
}

interface GameApi extends GameState {
  total: number
  start: (name: string) => void
  go: (s: Screen) => void
  next: () => void
  addScore: (mission: number, pts: number) => void
  restart: () => void
}

const Ctx = createContext<GameApi | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => ({
    screen: 'intro',
    name: load<string>('name', ''),
    missionScores: [0, 0, 0, 0],
    round: 0,
  }))

  // Navigations-Sperre: verhindert, dass wildes Doppeltippen Screens überspringt
  const lastNav = useRef(0)
  const navOk = () => {
    const now = Date.now()
    if (now - lastNav.current < 700) return false
    lastNav.current = now
    return true
  }

  const go = useCallback((screen: Screen) => {
    if (!navOk()) return
    setState((s) => ({ ...s, screen }))
    window.scrollTo(0, 0)
  }, [])

  const next = useCallback(() => {
    if (!navOk()) return
    setState((s) => {
      const i = FLOW.indexOf(s.screen)
      return { ...s, screen: FLOW[Math.min(FLOW.length - 1, i + 1)] }
    })
    window.scrollTo(0, 0)
  }, [])

  const start = useCallback((name: string) => {
    if (!navOk()) return
    save('name', name)
    setState((s) => ({ ...s, name, screen: 'briefing', missionScores: [0, 0, 0, 0] }))
  }, [])

  const addScore = useCallback((mission: number, pts: number) => {
    setState((s) => {
      const ms = [...s.missionScores]
      ms[mission] = Math.max(0, ms[mission] + pts)
      return { ...s, missionScores: ms }
    })
  }, [])

  const restart = useCallback(() => {
    if (!navOk()) return
    setState((s) => ({ ...s, screen: 'briefing', missionScores: [0, 0, 0, 0], round: s.round + 1 }))
  }, [])

  const api = useMemo<GameApi>(
    () => ({
      ...state,
      total: state.missionScores.reduce((a, b) => a + b, 0),
      start,
      go,
      next,
      addScore,
      restart,
    }),
    [state, start, go, next, addScore, restart],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useGame(): GameApi {
  const c = useContext(Ctx)
  if (!c) throw new Error('useGame außerhalb von GameProvider')
  return c
}

export const RANKS = [
  { min: 0, title: 'Deckshand', emoji: '🧽', text: 'Aller Anfang ist nass. Nochmal – du schaffst mehr!' },
  { min: 900, title: 'Leichtmatrose', emoji: '⚓', text: 'Solider Start! Der Hafen hat dich auf dem Schirm.' },
  { min: 1500, title: 'Ladungsoffizier', emoji: '📦', text: 'Stark! Du hast den Überblick über Schiff und Ladung.' },
  { min: 2050, title: 'Erster Offizier', emoji: '🧭', text: 'Richtig gut! Die Reederei will dich behalten.' },
  { min: 2500, title: 'Kapitän des Büros', emoji: '👑', text: 'Legendär! Du hast den Laden voll im Griff.' },
]

export function rankFor(score: number) {
  let r = RANKS[0]
  for (const x of RANKS) if (score >= x.min) r = x
  return r
}
