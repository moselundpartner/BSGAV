import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Button } from '../components/Button'
import { Speech } from '../components/Speech'
import { emitFx } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { MISSION_MAX, useGame } from '../state/game'

const REAL: Record<number, { emoji: string; title: string; text: string }> = {
  1: {
    emoji: '📋',
    title: 'Die Buchung',
    text: 'Du findest für jede Ladung das passende Schiff und den besten Weg – und buchst den Platz für deinen Kunden.',
  },
  2: {
    emoji: '🏗️',
    title: 'Das Beladen',
    text: 'Du planst mit, wo welcher Container auf dem Schiff steht, damit es sicher und stabil fährt. Das nennt man Stauplanung.',
  },
  3: {
    emoji: '⛈️',
    title: 'Die Krise',
    text: 'Wenn etwas schiefgeht, findest du schnell eine Lösung. Und du hältst den Kunden immer auf dem Laufenden.',
  },
  4: {
    emoji: '💶',
    title: 'Das Geld',
    text: 'Du rechnest Angebote durch, damit eure Firma Geld verdient und der Kunde einen fairen Preis zahlt.',
  },
}

const NEXT_LABEL: Record<number, string> = {
  1: 'Weiter zu Mission 2',
  2: 'Weiter zu Mission 3',
  3: 'Weiter zu Mission 4',
  4: 'Zur Auswertung 🏆',
}

export function MissionOutro({ n }: { n: number }) {
  const { missionScores, next } = useGame()
  const score = missionScores[n - 1]
  const ratio = score / MISSION_MAX[n - 1]
  const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.2 ? 1 : 0
  const real = REAL[n]
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers: number[] = []
    for (let i = 0; i < stars; i++) {
      timers.push(
        window.setTimeout(() => {
          sfx.coin()
          haptic.tap()
        }, 500 + i * 280),
      )
    }
    timers.push(
      window.setTimeout(() => {
        if (stars >= 2 && starsRef.current) {
          const r = starsRef.current.getBoundingClientRect()
          emitFx({ kind: 'confetti', x: r.left + r.width / 2, y: r.top + r.height / 2, count: stars === 3 ? 90 : 45 })
        }
      }, 500 + stars * 280),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [stars])

  const mood = stars >= 2 ? 'wow' : stars === 1 ? 'happy' : 'worried'
  const comment = stars === 3 ? 'Wow, das war stark!' : stars === 2 ? 'Gut gemacht!' : stars === 1 ? 'Nicht schlecht für den ersten Tag.' : 'Halb so wild – Übung macht den Profi.'

  return (
    <div className="flex h-full flex-col px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <div className="pr-14 text-[13px] font-extrabold uppercase tracking-[0.18em] text-signal">Mission {n} geschafft</div>
      <div className="title-font pr-14 text-[30px] leading-tight">
        {real.emoji} {real.title}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div ref={starsRef} className="flex items-end gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={i === 1 ? 'text-[68px]' : 'text-[52px]'}
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.28, type: 'spring', stiffness: 400, damping: 12 }}
              style={{ filter: i < stars ? 'drop-shadow(0 0 14px rgba(255,201,64,.7))' : 'grayscale(1) brightness(.45)' }}
            >
              ⭐
            </motion.div>
          ))}
        </div>
        <div className="mt-2 text-[44px] font-black text-gold text-glow">
          +<AnimatedNumber value={score} duration={1.2} />
        </div>
        <div className="text-[14px] font-bold text-ink/60">Punkte in dieser Mission</div>
      </div>

      <motion.div
        className="mt-6 overflow-hidden rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-gold/15 to-signal/5 p-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 220, damping: 20 }}
      >
        <div className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.14em] text-gold">💼 Im echten Beruf heißt das:</div>
        <p className="mt-1.5 text-[18px] font-bold leading-snug">{real.text}</p>
      </motion.div>

      <Speech className="mt-4" mood={mood} delay={1.5}>
        {comment}
      </Speech>

      <div className="flex-1" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
        <Button big className="mt-4 w-full" onClick={next}>
          {NEXT_LABEL[n]} <span aria-hidden>→</span>
        </Button>
      </motion.div>
    </div>
  )
}
