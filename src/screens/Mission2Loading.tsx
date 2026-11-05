import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Waves } from '../art/Water'
import { FeedbackSheet } from '../components/FeedbackSheet'
import { MissionHeader } from '../components/MissionHeader'
import { MissionTitle } from '../components/MissionTitle'
import { TimerRing } from '../components/TimerRing'
import { emitFx } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { useCountdown, usePhase, useShake } from '../lib/hooks'
import { shuffle } from '../lib/random'
import { sfx } from '../lib/sound'
import { useGame } from '../state/game'

interface Box {
  id: number
  w: number
}

const COLS = 4
const TIERS = 3
const TIME = 45
const WEIGHTS = [24, 24, 24, 24, 14, 14, 6, 6]

const STYLE: Record<number, { base: string; dark: string; label: string }> = {
  24: { base: '#C2353F', dark: '#7E1F28', label: 'schwer' },
  14: { base: '#E8902A', dark: '#9C5A12', label: 'mittel' },
  6: { base: '#3FB6E8', dark: '#1F6E91', label: 'leicht' },
}

function heelOf(grid: (Box | null)[][]) {
  let m = 0
  grid.forEach((col, c) => col.forEach((b) => b && (m += b.w * (c - (COLS - 1) / 2))))
  return Math.max(-15, Math.min(15, m / 5.5))
}

function ContainerBox({ w, className = '', style }: { w: number; className?: string; style?: React.CSSProperties }) {
  const s = STYLE[w]
  return (
    <div
      className={`container-ribs relative flex flex-col items-center justify-center rounded-[4px] border-2 ${className}`}
      style={{ backgroundColor: s.base, borderColor: s.dark, boxShadow: 'inset 0 2px 0 rgba(255,255,255,.25), 0 3px 6px rgba(0,0,0,.35)', ...style }}
    >
      <span className="text-[17px] font-black leading-none text-white drop-shadow-[0_1px_0_rgba(0,0,0,.5)]">{w} t</span>
      <span className="mt-0.5 text-[9px] font-extrabold uppercase leading-none tracking-wider text-white/85">{s.label}</span>
    </div>
  )
}

function HeelGauge({ heel }: { heel: number }) {
  const abs = Math.abs(heel)
  const color = abs <= 3 ? '#2EE6A6' : abs <= 7 ? '#FFC940' : '#FF4D5E'
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-[42px] w-[84px] shrink-0 overflow-hidden">
        <svg viewBox="0 0 84 44" className="absolute inset-0 h-full w-full">
          <path d="M6 42 A36 36 0 0 1 78 42" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="8" strokeLinecap="round" />
          <path d="M6 42 A36 36 0 0 1 18 15" fill="none" stroke="#FF4D5E" strokeWidth="8" strokeLinecap="round" opacity=".7" />
          <path d="M66 15 A36 36 0 0 1 78 42" fill="none" stroke="#FF4D5E" strokeWidth="8" strokeLinecap="round" opacity=".7" />
          <path d="M30 8.5 A36 36 0 0 1 54 8.5" fill="none" stroke="#2EE6A6" strokeWidth="8" opacity=".8" />
        </svg>
        <motion.div
          className="absolute bottom-0 left-1/2 h-[36px] w-[3px] -ml-[1.5px] rounded-full"
          style={{ background: color, transformOrigin: '50% 100%' }}
          animate={{ rotate: heel * 6 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
        />
        <div className="absolute bottom-0 left-1/2 -ml-[5px] h-[10px] w-[10px] rounded-full bg-ink" />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-extrabold uppercase tracking-wider text-ink/60">Krängung (Schieflage)</div>
        <div className="text-[20px] font-black tabular-nums leading-tight" style={{ color }}>
          {abs.toFixed(1).replace('.', ',')}° {abs <= 3 ? 'stabil' : abs <= 7 ? 'wackelig' : 'gefährlich!'}
        </div>
      </div>
    </div>
  )
}

export function Mission2Loading() {
  const { addScore, next } = useGame()
  const [phase, setPhase, phaseRef] = usePhase<'title' | 'play' | 'done'>('title')
  const [quay, setQuay] = useState<Box[]>(() => shuffle(WEIGHTS).map((w, i) => ({ id: i, w })))
  const [grid, setGrid] = useState<(Box | null)[][]>(() => Array.from({ length: COLS }, () => Array(TIERS).fill(null)))
  const [selected, setSelected] = useState<Box | null>(null)
  const [craneCol, setCraneCol] = useState<number | null>(null)
  const [busy, setBusy, busyRef] = usePhase(false)
  const [violations, setViolations] = useState(0)
  const [warn, setWarn] = useState<string>('')
  const [result, setResult] = useState<{ balance: number; stack: number; time: number } | null>(null)
  const [quayCtl, shakeQuay] = useShake()
  const shipCtl = useAnimationControls()
  const sceneWrap = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 340, h: 340 })
  const lastDanger = useRef(false)

  const heel = useMemo(() => heelOf(grid), [grid])
  const placed = WEIGHTS.length - quay.length

  // Szene in den verfügbaren Platz einpassen (Seitenverhältnis 1 : 0.9)
  useLayoutEffect(() => {
    const el = sceneWrap.current
    if (!el) return
    const fit = () => {
      const r = el.getBoundingClientRect()
      const w = Math.max(240, r.width)
      setDims({ w, h: Math.max(240, Math.min(r.height, w * 1.3)) })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const doneRef = useRef(false)
  const finish = useCallback(
    (timeLeft: number) => {
      if (doneRef.current) return
      doneRef.current = true
      const h = Math.abs(heelOf(grid))
      const count = grid.flat().filter(Boolean).length
      const frac = count / WEIGHTS.length
      const balance = Math.round((h <= 1.5 ? 350 : h <= 4 ? 220 : h <= 8 ? 100 : 0) * frac)
      const stack = Math.round(Math.max(0, 300 - violations * 100) * frac)
      const time = count === WEIGHTS.length ? Math.round(timeLeft * 5) : 0
      const total = balance + stack + time
      setResult({ balance, stack, time })
      setSelected(null)
      setPhase('done')
      addScore(1, total)
      window.setTimeout(() => {
        if (total >= 600) {
          sfx.fanfare()
          haptic.big()
          emitFx({ kind: 'confetti', x: window.innerWidth / 2, y: window.innerHeight * 0.35, count: 110 })
        } else sfx.ok()
      }, 200)
    },
    [grid, violations, addScore, setPhase],
  )

  const { left } = useCountdown(TIME, phase === 'play', () => finish(0))

  // Fertig, wenn alles verladen
  useEffect(() => {
    if (phase === 'play' && quay.length === 0 && !busy) {
      const t = window.setTimeout(() => finish(left), 500)
      return () => window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quay.length, busy, phase])

  // Warnung bei gefährlicher Schieflage
  useEffect(() => {
    const danger = Math.abs(heel) > 7
    if (danger && !lastDanger.current) {
      setWarn('⚠️ Schlagseite! Gleich das Gewicht auf der anderen Seite aus.')
      haptic.bad()
      sfx.bad()
    }
    if (!danger && lastDanger.current) setWarn('')
    lastDanger.current = danger
  }, [heel])

  const selectBox = (b: Box) => {
    if (phaseRef.current !== 'play' || busyRef.current) return
    sfx.tap()
    haptic.tap()
    setSelected((s) => (s?.id === b.id ? null : b))
  }

  const placeIn = (c: number) => {
    if (phaseRef.current !== 'play' || busyRef.current) return
    if (!selected) {
      setWarn('👇 Tipp zuerst einen Container auf dem Kai an!')
      shakeQuay()
      haptic.bad()
      return
    }
    const tier = grid[c].findIndex((x) => x === null)
    if (tier === -1) {
      setWarn('Diese Reihe ist voll – wähl eine andere.')
      haptic.bad()
      sfx.bad()
      return
    }
    const box = selected
    setBusy(true)
    setCraneCol(c)
    window.setTimeout(() => {
      const below = tier > 0 ? grid[c][tier - 1] : null
      const bad = !!below && below.w < box.w
      setGrid((g) => {
        const ng = g.map((col) => [...col])
        ng[c][tier] = box
        return ng
      })
      setQuay((q) => q.filter((x) => x.id !== box.id))
      setSelected(null)
      sfx.thud()
      haptic.thud()
      void shipCtl.start({ y: [0, 5, -1, 0], transition: { duration: 0.5 } })
      if (bad) {
        setViolations((v) => v + 1)
        setWarn('😬 Schwer gehört nach unten! Sonst kippelt der Stapel.')
        window.setTimeout(() => {
          sfx.bad()
          haptic.bad()
        }, 120)
      } else if (Math.abs(heel) <= 7) setWarn('')
      window.setTimeout(() => {
        setCraneCol(null)
        setBusy(false)
      }, 260)
    }, 380)
  }

  // Geometrie
  const S = dims.w
  const H = dims.h
  const colW = S * 0.185
  const gap = S * 0.015
  const tierH = colW / 1.55
  const hullH = S * 0.16
  const deckY = H - hullH - S * 0.03
  const colX = (c: number) => S / 2 + (c - (COLS - 1) / 2) * (colW + gap)
  const craneX = craneCol == null ? S / 2 : colX(craneCol)
  const hookY = H * 0.12

  const onTitleDone = useCallback(() => setPhase((p) => (p === 'title' ? 'play' : p)), [setPhase])
  const total = result ? result.balance + result.stack + result.time : 0

  return (
    <div className="relative flex h-full flex-col">
      <MissionHeader n={2} title="Das Beladen" right={<TimerRing left={left} total={TIME} size={50} />} />

      <div className="px-4">
        <div className="min-h-[44px] rounded-xl bg-night-800/60 px-3 py-2 text-[14px] font-semibold leading-snug">
          <AnimatePresence mode="wait">
            <motion.div key={warn || 'hint'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={warn ? 'text-gold' : 'text-ink/85'}>
              {warn || (
                <>
                  <b className="text-signal">①</b> Container antippen <b className="text-signal">②</b> Platz auf dem Schiff antippen. <b>Schwer nach unten</b>, Gewicht gleichmäßig verteilen!
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Szene */}
      <div ref={sceneWrap} className="relative mx-4 mt-2 flex min-h-0 flex-1 items-start justify-center">
        <div className="relative overflow-hidden rounded-3xl border border-petrol-400/25" style={{ width: S, height: H, background: 'linear-gradient(180deg,#061226 0%, #0B2A3F 70%, #12455A 100%)' }}>
          {/* Kranbrücke */}
          <div className="absolute inset-x-0 top-[3%] h-[10px] bg-gradient-to-b from-signal to-signal-dark shadow-[0_3px_0_rgba(0,0,0,.4)]" />
          <div className="absolute left-[2%] top-[3%] h-full w-[8px] bg-signal-dark/60" />
          <div className="absolute right-[2%] top-[3%] h-full w-[8px] bg-signal-dark/60" />
          <motion.div className="absolute top-[3%]" animate={{ x: craneX - 22 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }} style={{ left: 0 }}>
            <div className="h-[18px] w-[44px] rounded-md bg-night-700 shadow-md ring-2 ring-signal" />
            <div className="mx-auto h-[1px] w-[44px]" />
            {/* Seil */}
            <div className="mx-auto w-[2px] bg-ink/60" style={{ height: hookY - H * 0.03 - 18 }} />
            <AnimatePresence>
              {selected && (
                <motion.div
                  key={selected.id}
                  className="swing absolute left-1/2"
                  style={{ top: hookY - H * 0.03, width: colW, marginLeft: -colW / 2 }}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <div className="mx-auto h-[4px] w-[70%] rounded bg-ink/70" />
                  <ContainerBox w={selected.w} style={{ height: tierH }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Schiff (kippt mit der Krängung) */}
          <motion.div className="absolute inset-0" animate={shipCtl}>
            <motion.div
              className="absolute inset-0"
              style={{ transformOrigin: `50% ${deckY + 20}px` }}
              animate={{ rotate: heel }}
              transition={{ type: 'spring', stiffness: 60, damping: 7 }}
            >
              {/* Rumpf */}
              <svg className="absolute left-0" style={{ top: deckY - 2, width: S, height: hullH }} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
                <path d="M3 0 H92 L99 -2 L95 22 Q 50 26 8 22 Q 4 12 3 0 Z" fill="#17263C" />
                <path d="M6 16 Q 50 19 96 15 L95 22 Q 50 26 8 22 Z" fill="#B8323A" />
                <path d="M3 1.5 H93 L99 -0.5" stroke="#FF7A1A" strokeWidth="1" fill="none" />
              </svg>
              {/* Stellplätze */}
              {grid.map((col, c) =>
                col.map((b, t) => {
                  const x = colX(c) - colW / 2
                  const y = deckY - (t + 1) * tierH
                  return (
                    <div key={`${c}-${t}`} className="absolute" style={{ left: x, top: y, width: colW, height: tierH }}>
                      {b ? (
                        <motion.div
                          initial={{ y: -(y - hookY), opacity: 0.6 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                          className="h-full w-full"
                        >
                          <ContainerBox w={b.w} className="h-full w-full" />
                        </motion.div>
                      ) : (
                        <div className="h-full w-full rounded-[4px] border-2 border-dashed border-white/15" />
                      )}
                    </div>
                  )
                }),
              )}
            </motion.div>
          </motion.div>

          {/* Wasser */}
          <Waves style={{ top: deckY + hullH * 0.45, bottom: 0 }} stormy={Math.abs(heel) > 7} />

          {/* Tippflächen je Reihe */}
          {Array.from({ length: COLS }, (_, c) => {
            const full = grid[c].every(Boolean)
            return (
              <button
                key={c}
                type="button"
                aria-label={`Reihe ${c + 1}${full ? ' (voll)' : ''}`}
                onClick={() => placeIn(c)}
                className={`absolute rounded-xl transition-colors ${selected && !full ? 'bg-signal/10 ring-2 ring-signal/50 active:bg-signal/25' : 'active:bg-white/5'}`}
                style={{ left: colX(c) - (colW + gap) / 2, width: colW + gap, top: H * 0.16, height: deckY - H * 0.16 + 6 }}
              >
                {selected && !full && (
                  <span className="float-y absolute left-1/2 top-1 -ml-3 text-2xl" aria-hidden>
                    ⬇️
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Anzeige + Kai */}
      <div className="px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-center justify-between gap-2">
          <HeelGauge heel={heel} />
          <div className="text-right text-[13px] font-bold text-ink/60">
            <div className="text-[22px] font-black text-ink">
              {placed}/{WEIGHTS.length}
            </div>
            verladen
          </div>
        </div>
        <div className="mt-2 text-[12px] font-extrabold uppercase tracking-wider text-ink/50">🏗️ Kai – deine Container</div>
        <motion.div animate={quayCtl} className="mt-1 grid grid-cols-4 gap-2">
          {quay.map((b) => {
            const sel = selected?.id === b.id
            return (
              <motion.button
                key={b.id}
                layout
                type="button"
                onClick={() => selectBox(b)}
                className="relative h-[50px] rounded-lg"
                animate={{ y: sel ? -8 : 0, scale: sel ? 1.06 : 1 }}
                whileTap={{ scale: 0.92 }}
                exit={{ opacity: 0, scale: 0.5 }}
                aria-pressed={sel}
                aria-label={`Container ${b.w} Tonnen`}
              >
                <ContainerBox w={b.w} className="h-full w-full" style={sel ? { boxShadow: '0 0 0 3px #FFC940, 0 8px 20px rgba(255,201,64,.5)' } : undefined} />
              </motion.button>
            )
          })}
          {Array.from({ length: WEIGHTS.length - quay.length }, (_, i) => (
            <div key={`e${i}`} className="h-[50px] rounded-lg border-2 border-dashed border-white/10" />
          ))}
        </motion.div>
      </div>

      <FeedbackSheet open={phase === 'done' && !!result} tone={total >= 600 ? 'ok' : total >= 350 ? 'meh' : 'bad'} title={`Schiff beladen! +${total}`} onContinue={next} autoMs={6000} cta="Mission abschließen">
        {result && (
          <span className="block space-y-0.5 text-[15px]">
            <span className="flex justify-between">
              <span>⚖️ Gleichgewicht</span>
              <b className="text-gold">+{result.balance}</b>
            </span>
            <span className="flex justify-between">
              <span>📦 Schwer nach unten {violations ? `(${violations}× falsch)` : ''}</span>
              <b className="text-gold">+{result.stack}</b>
            </span>
            <span className="flex justify-between">
              <span>⏱️ Zeitbonus</span>
              <b className="text-gold">+{result.time}</b>
            </span>
          </span>
        )}
      </FeedbackSheet>

      <MissionTitle show={phase === 'title'} n={2} title="Das Beladen" sub="Belade das Schiff in 45 Sekunden. Es darf nicht kippen!" emoji="🏗️" onDone={onTitleDone} />
    </div>
  )
}
