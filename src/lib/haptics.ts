// iOS Safari unterstützt navigator.vibrate nicht – dann passiert einfach nichts.
export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    /* ignore */
  }
}

export const haptic = {
  tap: () => vibrate(8),
  ok: () => vibrate(30),
  bad: () => vibrate([50, 30, 50]),
  thud: () => vibrate(18),
  big: () => vibrate([30, 40, 30, 40, 80]),
}
