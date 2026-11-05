import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Speech } from '../components/Speech'
import { Term } from '../components/Term'
import { useGame } from '../state/game'

const MISSIONS = [
  { emoji: '📋', title: 'Die Buchung', text: 'Schiff & Route wählen' },
  { emoji: '🏗️', title: 'Das Beladen', text: 'Container clever stapeln' },
  { emoji: '⛈️', title: 'Die Krise', text: 'Schnell entscheiden' },
  { emoji: '💶', title: 'Das Geld', text: 'Angebot durchrechnen' },
]

export function Briefing() {
  const { name, next } = useGame()
  return (
    <div className="flex h-full flex-col px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <div className="mb-1 pr-14 text-[13px] font-extrabold uppercase tracking-[0.18em] text-signal">08:00 Uhr · Bremen</div>
      <div className="title-font mb-4 pr-14 text-[28px] leading-tight">Dein erster Arbeitstag</div>

      <div className="space-y-3">
        <Speech delay={0.1}>
          Moin, <span className="text-gold">{name}</span>! 👋 Ich bin Kim, deine Ausbilderin.
        </Speech>
        <Speech delay={0.5}>
          Wir sind eine <Term k="reederei" />: Wir bringen <Term k="fracht" /> per Schiff um die ganze Welt.
        </Speech>
        <Speech delay={0.9}>Heute erledigst du 4 echte Aufträge. Bereit?</Speech>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {MISSIONS.map((m, i) => (
          <motion.div
            key={m.title}
            className="glass rounded-2xl p-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.3 + i * 0.12, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl">{m.emoji}</span>
              <span className="rounded-full bg-signal/20 px-2 py-0.5 text-xs font-black text-signal">{i + 1}</span>
            </div>
            <div className="mt-1 text-[16px] font-extrabold leading-tight">{m.title}</div>
            <div className="text-[13px] leading-tight text-ink/70">{m.text}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>
        <Button big className="mt-4 w-full" onClick={next}>
          Ab an die Arbeit! 🚢
        </Button>
      </motion.div>
    </div>
  )
}
