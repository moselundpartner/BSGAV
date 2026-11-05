import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AnimatedNumber, formatNumber } from '../components/AnimatedNumber'
import { Button } from '../components/Button'
import { emitFx } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { addScore as saveScore, loadScores, type ScoreEntry } from '../lib/storage'
import { RANKS, rankFor, useGame } from '../state/game'

const MISSION_NAMES = ['📋 Buchung', '🏗️ Beladen', '⛈️ Krise', '💶 Geld']

// verhindert doppeltes Speichern (z. B. React StrictMode im Dev-Modus)
let lastSavedKey = ''

export function Result() {
  const { name, total, missionScores, round, restart, next } = useGame()
  const rank = rankFor(total)
  const rankIdx = RANKS.indexOf(rank)
  const [board, setBoard] = useState<{ list: ScoreEntry[]; index: number }>({ list: loadScores(), index: -1 })
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const key = `${round}-${name}-${total}`
    if (lastSavedKey !== key) {
      lastSavedKey = key
      setBoard(saveScore(name, total))
    }
  }, [round, name, total])

  useEffect(() => {
    const t1 = window.setTimeout(() => setShown(total), 300)
    const t2 = window.setTimeout(() => {
      sfx.fanfare()
      haptic.big()
      emitFx({ kind: 'confetti', x: window.innerWidth / 2, y: window.innerHeight * 0.3, count: 140, spread: 3.2, power: 14 })
    }, 1600)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [total])

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <div className="pr-14 text-[13px] font-extrabold uppercase tracking-[0.18em] text-signal">Feierabend, {name}!</div>
      <div className="title-font pr-14 text-[28px] leading-tight">Deine Auswertung</div>

      {/* Rang */}
      <div className="relative mt-4 flex flex-col items-center">
        <div className="relative flex h-[132px] w-[132px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, transparent, rgba(255,201,64,.45), transparent 30%, rgba(255,122,26,.4), transparent 60%, rgba(255,201,64,.45), transparent)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full border-4 border-gold bg-gradient-to-br from-night-700 to-night-900 text-[54px] shadow-[0_0_40px_rgba(255,201,64,.45)]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 220, damping: 14 }}
          >
            {rank.emoji}
          </motion.div>
        </div>
        <motion.div className="mt-1 text-[13px] font-extrabold uppercase tracking-[0.2em] text-ink/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          Dein Rang
        </motion.div>
        <motion.div className="title-font text-glow text-center text-[32px] leading-tight text-gold" initial={{ opacity: 0, scale: 1.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.7, type: 'spring', stiffness: 260, damping: 16 }}>
          {rank.title}
        </motion.div>
        <motion.p className="mt-1 max-w-[300px] text-center text-[15px] font-semibold text-ink/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          {rank.text}
        </motion.p>
        <div className="mt-2 text-[42px] font-black leading-none">
          <AnimatedNumber value={shown} duration={1.2} /> <span className="text-[18px] text-ink/60">Punkte</span>
        </div>
        {/* Rang-Leiter */}
        <div className="mt-3 flex w-full gap-1">
          {RANKS.map((r, i) => (
            <div key={r.title} className="flex-1 text-center">
              <div className={`h-2 rounded-full ${i <= rankIdx ? 'bg-gradient-to-r from-signal to-gold' : 'bg-white/10'}`} />
              <div className={`mt-1 text-[16px] ${i <= rankIdx ? '' : 'opacity-30 grayscale'}`}>{r.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Missionen */}
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {missionScores.map((s, i) => (
          <motion.div key={i} className="glass rounded-xl p-2 text-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
            <div className="text-[11px] font-bold leading-tight text-ink/70">{MISSION_NAMES[i]}</div>
            <div className="text-[16px] font-black text-gold">{formatNumber(s)}</div>
          </motion.div>
        ))}
      </div>

      {/* Bestenliste */}
      <div className="glass mt-4 rounded-2xl p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="text-[13px] font-extrabold uppercase tracking-wider text-ink/70">🏆 Bestenliste (nur auf diesem Handy)</div>
        </div>
        <ol className="space-y-1">
          {board.list.slice(0, 5).map((e, i) => (
            <li key={`${e.at}-${i}`} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-[15px] ${i === board.index ? 'bg-signal/25 font-black' : ''}`}>
              <span className="w-6 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
              <span className="min-w-0 flex-1 truncate">{e.name}</span>
              <span className="font-black tabular-nums text-gold">{formatNumber(e.score)}</span>
            </li>
          ))}
          {board.index >= 5 && (
            <li className="flex items-center gap-2 rounded-lg bg-signal/25 px-2 py-1 text-[15px] font-black">
              <span className="w-6 text-center">{board.index + 1}.</span>
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <span className="tabular-nums text-gold">{formatNumber(total)}</span>
            </li>
          )}
        </ol>
      </div>

      <div className="flex-1" />
      <div className="mt-4 space-y-2.5">
        <Button big className="w-full" onClick={next}>
          💼 Das war echt! →
        </Button>
        <Button variant="secondary" className="w-full" onClick={restart}>
          🔄 Nochmal spielen
        </Button>
      </div>
    </div>
  )
}
