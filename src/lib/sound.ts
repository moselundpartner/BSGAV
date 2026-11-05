// Kleine Synth-Sounds per WebAudio – keine Audiodateien, nichts zu laden.
import { load, save } from './storage'

type Ctx = AudioContext

let ctx: Ctx | null = null
let enabled = load<boolean>('sound', false)
const listeners = new Set<(v: boolean) => void>()

function getCtx(): Ctx | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function isSoundOn() {
  return enabled
}

export function setSound(v: boolean) {
  enabled = v
  save('sound', v)
  if (v) getCtx() // muss in einer Nutzer-Geste passieren (iOS)
  listeners.forEach((l) => l(v))
}

export function onSoundChange(fn: (v: boolean) => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; delay?: number; slideTo?: number } = {}) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  try {
    const t0 = c.currentTime + (opts.delay ?? 0)
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = opts.type ?? 'sine'
    osc.frequency.setValueAtTime(freq, t0)
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur)
    const vol = opts.vol ?? 0.15
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(gain).connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  } catch {
    /* ignore */
  }
}

export const sfx = {
  tap: () => tone(660, 0.06, { type: 'triangle', vol: 0.08 }),
  ok: () => {
    tone(523, 0.12, { type: 'triangle' })
    tone(659, 0.12, { type: 'triangle', delay: 0.08 })
    tone(784, 0.22, { type: 'triangle', delay: 0.16 })
  },
  bad: () => tone(180, 0.28, { type: 'sawtooth', vol: 0.08, slideTo: 110 }),
  coin: () => {
    tone(988, 0.07, { type: 'square', vol: 0.05 })
    tone(1319, 0.16, { type: 'square', vol: 0.05, delay: 0.07 })
  },
  thud: () => tone(110, 0.15, { type: 'sine', vol: 0.25, slideTo: 60 }),
  alarm: () => {
    for (let i = 0; i < 3; i++) tone(880, 0.18, { type: 'square', vol: 0.05, delay: i * 0.3, slideTo: 620 })
  },
  horn: () => {
    if (!enabled) return
    const c = getCtx()
    if (!c) return
    try {
      const t0 = c.currentTime
      const filter = c.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 600
      const gain = c.createGain()
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.12)
      gain.gain.setValueAtTime(0.18, t0 + 1.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5)
      filter.connect(gain).connect(c.destination)
      for (const f of [73, 110, 146.5]) {
        const o = c.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = f
        o.connect(filter)
        o.start(t0)
        o.stop(t0 + 1.6)
      }
    } catch {
      /* ignore */
    }
  },
  fanfare: () => {
    const notes = [523, 659, 784, 1047, 784, 1047]
    notes.forEach((n, i) => tone(n, i === notes.length - 1 ? 0.5 : 0.14, { type: 'triangle', delay: i * 0.12, vol: 0.12 }))
  },
}
