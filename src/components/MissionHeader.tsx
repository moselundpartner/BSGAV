import { motion } from 'framer-motion'
import { useGame } from '../state/game'
import { AnimatedNumber } from './AnimatedNumber'

export function MissionHeader({ n, title, right }: { n: number; title: string; right?: React.ReactNode }) {
  const { total } = useGame()
  return (
    <div className="relative z-10 px-4 pb-2 pr-16 pt-[max(12px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-signal">Mission {n}/4</div>
          <div className="title-font truncate text-[22px] leading-tight">{title}</div>
        </div>
        {right}
        <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-lg font-black text-gold">
          <span aria-hidden>⭐</span>
          <AnimatedNumber value={total} />
        </div>
      </div>
      <div className="mt-2.5 flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-signal to-gold"
              initial={{ width: i < n ? '100%' : '0%' }}
              animate={{ width: i < n ? '100%' : i === n ? '50%' : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
