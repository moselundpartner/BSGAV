import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { FeedbackSheet } from '../components/FeedbackSheet'
import { MissionHeader } from '../components/MissionHeader'
import { MissionTitle } from '../components/MissionTitle'
import { TermCard } from '../components/Term'
import { TimerRing } from '../components/TimerRing'
import { MATH_BONUS_PER_SEC, MATH_POINTS, MATH_TIME, TASKS_OFFER, TASKS_RATE, type MathTask } from '../content/math'
import { confettiAt, pointsAt } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { useCountdown, usePhase, useShake } from '../lib/hooks'
import { pick, shuffle } from '../lib/random'
import { sfx } from '../lib/sound'
import { useGame } from '../state/game'

interface Coin {
  id: number
  x0: number
  y0: number
  x1: number
  y1: number
  d: number
}

export function Mission4Money() {
  const { addScore, next } = useGame()
  const tasks = useMemo(() => [pick(TASKS_RATE), pick(TASKS_OFFER)], [])
  const opts = useMemo(() => tasks.map((t) => shuffle(t.options.map((o, i) => ({ text: o, right: i === 0 })))), [tasks])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase, phaseRef] = usePhase<'title' | 'ask' | 'fb'>('title')
  const [picked, setPicked] = useState<number | null>(null)
  const [hint, setHint] = useState(false)
  const [kasse, setKasse] = useState(0)
  const [coins, setCoins] = useState<Coin[]>([])
  const [lastPts, setLastPts] = useState(0)
  const [ctl, shake] = useShake()
  const rootRef = useRef<HTMLDivElement>(null)
  const kasseRef = useRef<HTMLDivElement>(null)
  const coinId = useRef(0)

  const task: MathTask = tasks[idx]
  const options = opts[idx]

  const answer = useCallback(
    (i: number, el: HTMLElement | null, timeLeft: number) => {
      if (phaseRef.current !== 'ask') return
      setPhase('fb')
      setPicked(i)
      const right = i >= 0 && options[i].right
      if (right) {
        const pts = MATH_POINTS + Math.round(timeLeft * MATH_BONUS_PER_SEC)
        setLastPts(pts)
        addScore(3, pts)
        sfx.ok()
        haptic.ok()
        confettiAt(el, 60)
        pointsAt(el, pts)
        // Münzen fliegen in die Firmenkasse
        const root = rootRef.current?.getBoundingClientRect()
        const a = el?.getBoundingClientRect()
        const b = kasseRef.current?.getBoundingClientRect()
        if (root && a && b) {
          const list: Coin[] = Array.from({ length: 7 }, (_, k) => ({
            id: ++coinId.current,
            x0: a.left - root.left + a.width / 2 + (Math.random() - 0.5) * 60,
            y0: a.top - root.top + a.height / 2,
            x1: b.left - root.left + 24,
            y1: b.top - root.top + b.height / 2,
            d: k * 0.07,
          }))
          setCoins(list)
          list.forEach((_, k) => window.setTimeout(() => sfx.coin(), 450 + k * 70))
          window.setTimeout(() => setKasse((v) => v + pts), 650)
          window.setTimeout(() => setCoins([]), 1500)
        } else setKasse((v) => v + pts)
      } else {
        setLastPts(0)
        sfx.bad()
        haptic.bad()
        shake()
      }
    },
    [phaseRef, setPhase, options, addScore, shake],
  )

  const { left, reset } = useCountdown(MATH_TIME, phase === 'ask', () => answer(-1, null, 0))

  const nextTask = () => {
    if (phaseRef.current !== 'fb') return
    if (idx < tasks.length - 1) {
      setIdx(idx + 1)
      setPicked(null)
      setHint(false)
      reset(MATH_TIME)
      setPhase('ask')
    } else next()
  }

  const onTitleDone = useCallback(() => setPhase((p) => (p === 'title' ? 'ask' : p)), [setPhase])
  const right = picked != null && picked >= 0 && options[picked]?.right
  const timedOut = picked === -1

  return (
    <div ref={rootRef} className="relative flex h-full flex-col">
      <MissionHeader n={4} title="Das Geld" right={phase !== 'title' ? <TimerRing left={left} total={MATH_TIME} size={50} /> : undefined} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {/* Firmenkasse */}
        <div ref={kasseRef} className="glass mt-1 flex items-center gap-3 rounded-2xl px-3.5 py-2.5">
          <motion.span className="text-3xl" key={kasse} initial={{ scale: 1 }} animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 0.35 }}>
            💰
          </motion.span>
          <div className="flex-1">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-ink/60">Deine Punkte-Kasse</div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div className="shimmer h-full rounded-full" style={{ backgroundImage: 'linear-gradient(90deg,#FFC940,#FF7A1A,#FFC940)' }} animate={{ width: `${Math.min(100, (kasse / 500) * 100)}%` }} transition={{ type: 'spring', stiffness: 80, damping: 15 }} />
            </div>
          </div>
          <div className="text-xl font-black text-gold">
            <AnimatedNumber value={kasse} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={task.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
            <motion.div animate={ctl} className="glass-strong relative mt-3 overflow-hidden rounded-3xl p-4">
              <div className="absolute -right-4 -top-4 text-[90px] opacity-[0.07]" aria-hidden>
                🧮
              </div>
              <div className="text-[12px] font-extrabold uppercase tracking-wider text-signal">
                🧾 Aufgabe {idx + 1}/{tasks.length}
              </div>
              <p className="mt-1.5 text-[18px] font-bold leading-snug">{task.text}</p>
              <div className="mt-3 rounded-xl bg-night-900/70 px-3 py-2 text-center text-[15px] font-extrabold tracking-wide text-gold">{task.visual}</div>
              <div className="mt-2 min-h-[28px]">
                {hint ? (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[15px] font-bold text-petrol-300">
                    💡 {task.hint}
                  </motion.div>
                ) : (
                  <button type="button" onClick={() => setHint(true)} disabled={phase !== 'ask'} className="text-[15px] font-bold text-petrol-300 underline decoration-dotted underline-offset-4">
                    💡 Tipp anzeigen
                  </button>
                )}
              </div>
            </motion.div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {options.map((o, i) => {
                const reveal = phase === 'fb'
                const state = reveal ? (o.right ? 'right' : picked === i ? 'wrong' : 'dim') : 'idle'
                return (
                  <motion.button
                    key={o.text}
                    type="button"
                    disabled={phase !== 'ask'}
                    onClick={(e) => answer(i, e.currentTarget, left)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: state === 'dim' ? 0.4 : 1, y: 0, scale: state === 'right' ? 1.04 : 1 }}
                    transition={{ delay: reveal ? 0 : 0.1 + i * 0.06 }}
                    whileTap={{ scale: 0.95 }}
                    className={`min-h-[68px] rounded-2xl border-2 px-2 text-[19px] font-black leading-tight ${
                      state === 'right' ? 'border-ok bg-ok/20 text-ok' : state === 'wrong' ? 'border-bad bg-bad/20 text-bad' : 'border-petrol-400/30 bg-night-800/80 active:border-signal'
                    }`}
                  >
                    {o.text}
                  </motion.button>
                )
              })}
            </div>
            {task.term && <TermCard k={task.term} className="mt-3" />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* fliegende Münzen */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
        {coins.map((c) => (
          <motion.div
            key={c.id}
            className="absolute text-2xl"
            style={{ left: 0, top: 0 }}
            initial={{ x: c.x0, y: c.y0, scale: 0.4, opacity: 0 }}
            animate={{ x: [c.x0, (c.x0 + c.x1) / 2 + 40, c.x1], y: [c.y0, Math.min(c.y0, c.y1) - 80, c.y1], scale: [0.6, 1.3, 0.7], opacity: [1, 1, 0.9] }}
            transition={{ duration: 0.75, delay: c.d, ease: 'easeInOut' }}
          >
            🪙
          </motion.div>
        ))}
      </div>

      <FeedbackSheet
        open={phase === 'fb'}
        tone={right ? 'ok' : 'bad'}
        title={right ? `Richtig gerechnet! +${lastPts}` : timedOut ? 'Zeit ist um!' : 'Leider falsch'}
        onContinue={nextTask}
        autoMs={right ? 3600 : 5200}
        cta={idx < tasks.length - 1 ? 'Nächste Aufgabe' : 'Mission abschließen'}
      >
        {task.explain}
      </FeedbackSheet>

      <MissionTitle show={phase === 'title'} n={4} title="Das Geld" sub="Rechne Frachtpreise aus – mit Plus, Minus und Mal." emoji="💶" onDone={onTitleDone} />
    </div>
  )
}
