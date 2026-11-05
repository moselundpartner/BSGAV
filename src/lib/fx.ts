// Globaler Effekt-Bus: Konfetti & schwebende Punkte werden in einer Overlay-Ebene gerendert.
export type FxEvent =
  | { kind: 'confetti'; x: number; y: number; count?: number; colors?: string[]; spread?: number; power?: number }
  | { kind: 'points'; x: number; y: number; text: string; color?: string }

const subs = new Set<(e: FxEvent) => void>()

export function onFx(fn: (e: FxEvent) => void) {
  subs.add(fn)
  return () => {
    subs.delete(fn)
  }
}

export function emitFx(e: FxEvent) {
  subs.forEach((s) => s(e))
}

/** Mittelpunkt eines Elements (für Effekte an Buttons etc.) */
export function centerOf(el: Element | null | undefined): { x: number; y: number } {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

export function confettiAt(el: Element | null | undefined, count = 60) {
  const { x, y } = centerOf(el)
  emitFx({ kind: 'confetti', x, y, count })
}

export function pointsAt(el: Element | null | undefined, points: number) {
  const { x, y } = centerOf(el)
  emitFx({
    kind: 'points',
    x,
    y,
    text: points > 0 ? `+${points}` : `${points}`,
    color: points > 0 ? '#FFC940' : '#FF4D5E',
  })
}
