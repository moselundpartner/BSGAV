import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

/** Großes Einblend-Banner "MISSION 2 – Das Beladen". Tippen überspringt. */
export function MissionTitle({ show, n, title, sub, emoji, onDone }: { show: boolean; n: number; title: string; sub: string; emoji: string; onDone: () => void }) {
  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(onDone, 1900)
    return () => window.clearTimeout(t)
  }, [show, onDone])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={onDone}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-night-950/80 px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          aria-label="Weiter"
        >
          <motion.div
            className="mb-3 text-7xl"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
          >
            {emoji}
          </motion.div>
          <motion.div
            className="text-sm font-extrabold uppercase tracking-[0.3em] text-signal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Mission {n} von 4
          </motion.div>
          <motion.div
            className="title-font text-glow mt-1 text-5xl"
            initial={{ opacity: 0, scale: 1.4, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '-0.02em' }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 18 }}
          >
            {title}
          </motion.div>
          <motion.div className="mt-3 max-w-xs text-lg font-semibold text-ink/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {sub}
          </motion.div>
          <motion.div
            className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div className="h-full bg-signal" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.6, ease: 'linear', delay: 0.3 }} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
