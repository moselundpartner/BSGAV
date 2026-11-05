// Nur localStorage, keine Cookies. Alles in try/catch, weil private Tabs/Safari werfen können.
const PREFIX = 'hafen-mission:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* Speicher nicht verfügbar – Spiel läuft trotzdem */
  }
}

export interface ScoreEntry {
  name: string
  score: number
  at: number
}

export function loadScores(): ScoreEntry[] {
  const list = load<ScoreEntry[]>('scores', [])
  if (!Array.isArray(list)) return []
  return list
    .filter((e) => e && typeof e.name === 'string' && typeof e.score === 'number')
    .slice(0, 10)
}

/** Speichert den Score und liefert die neue Liste + den Index des neuen Eintrags. */
export function addScore(name: string, score: number): { list: ScoreEntry[]; index: number } {
  const entry: ScoreEntry = { name, score, at: Date.now() }
  const list = [...loadScores(), entry].sort((a, b) => b.score - a.score || a.at - b.at).slice(0, 10)
  save('scores', list)
  return { list, index: list.indexOf(entry) }
}
