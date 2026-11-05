import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationControls } from 'framer-motion'

/** Pausiert, wenn der Tab im Hintergrund ist oder das Handy quer gehalten wird. */
export function usePaused(): boolean {
  const get = () => {
    if (typeof document === 'undefined') return false
    const hidden = document.visibilityState === 'hidden'
    let landscape = false
    try {
      landscape = window.matchMedia('(orientation: landscape) and (max-height: 520px)').matches
    } catch {
      /* ignore */
    }
    return hidden || landscape
  }
  const [paused, setPaused] = useState(get)
  useEffect(() => {
    const update = () => setPaused(get())
    document.addEventListener('visibilitychange', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])
  return paused
}

/**
 * Countdown in Sekunden (mit Nachkommastellen für flüssige Ringe).
 * Läuft nur, wenn `running` true ist und das Spiel nicht pausiert.
 */
export function useCountdown(total: number, running: boolean, onEnd?: () => void) {
  const [left, setLeft] = useState(total)
  const paused = usePaused()
  const endRef = useRef(onEnd)
  endRef.current = onEnd
  const leftRef = useRef(total)

  const reset = useCallback(
    (t = total) => {
      leftRef.current = t
      setLeft(t)
    },
    [total],
  )

  useEffect(() => {
    if (!running || paused) return
    let last = performance.now()
    let raf = 0
    let ended = false
    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      const prev = leftRef.current
      leftRef.current = Math.max(0, leftRef.current - dt)
      // nur ~10x pro Sekunde neu rendern
      if (Math.floor(prev * 10) !== Math.floor(leftRef.current * 10)) setLeft(leftRef.current)
      if (leftRef.current <= 0) {
        if (!ended) {
          ended = true
          endRef.current?.()
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, paused])

  return { left, reset }
}

export function useShake() {
  const controls = useAnimationControls()
  const shake = useCallback(() => {
    void controls.start({
      x: [0, -12, 11, -9, 7, -4, 2, 0],
      transition: { duration: 0.45, ease: 'easeOut' },
    })
  }, [controls])
  return [controls, shake] as const
}

/** Verhindert Doppel-Taps während Animationen. */
export function useLock(): [boolean, (ms: number) => void, (v: boolean) => void] {
  const [locked, setLocked] = useState(false)
  const timer = useRef<number>()
  const lockFor = useCallback((ms: number) => {
    setLocked(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLocked(false), ms)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return [locked, lockFor, setLocked]
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/**
 * State + Ref, die sofort aktualisiert wird. Für Spiel-Phasen, damit auch
 * Buttons, die gerade ausgeblendet werden (alte Closures), keine Punkte doppelt vergeben.
 */
export function usePhase<T>(initial: T): [T, (v: T | ((p: T) => T)) => void, { readonly current: T }] {
  const [state, setState] = useState(initial)
  const ref = useRef(initial)
  const set = useCallback((v: T | ((p: T) => T)) => {
    const nv = typeof v === 'function' ? (v as (p: T) => T)(ref.current) : v
    ref.current = nv
    setState(nv)
  }, [])
  return [state, set, ref]
}
