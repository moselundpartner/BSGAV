import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

type Tone = 'ok' | 'meh' | 'bad'

const TONE: Record<Tone, { icon: string; color: string; border: string }> = {
  ok: { icon: '✅', color: 'text-ok', border: 'border-ok/50' },
  meh: { icon: '🤔', color: 'text-gold', border: 'border-gold/50' },
  bad: { icon: '❌', color: 'text-bad', border: 'border-bad/50' },
}

/**
 * Feedback von unten. Geht nach `autoMs` automatisch weiter, Tippen überspringt.
 * Steht absolut im Screen (nicht fixed), damit es mit dem Screen ausblendet.
 */
export function FeedbackSheet({
  open,
  tone,
  title,
  children,
  onContinue,
  autoMs = 3200,
  cta = 'Weiter',
}: {
  open: boolean
  tone: Tone
  title: string
  children?: ReactNode
  onContinue: () => void
  autoMs?: number
  cta?: string
}) {
  const done = useRef(false)
  const cb = useRef(onContinue)
  cb.current = onContinue

  useEffect(() => {
    if (!open) return
    done.current = false
    const t = window.setTimeout(() => {
      if (!done.current) {
        done.current = true
        cb.current()
      }
    }, autoMs)
    return () => window.clearTimeout(t)
  }, [open, autoMs])

  const go = () => {
    if (done.current) return
    done.current = true
    cb.current()
  }

  const t = TONE[tone]
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-night-950/40" onClick={go} />
          <motion.button
            type="button"
            onClick={go}
            className={`glass-strong relative mx-3 mb-[max(14px,env(safe-area-inset-bottom))] overflow-hidden rounded-3xl border-2 ${t.border} p-4 text-left`}
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 220 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="flex items-start gap-3">
              <motion.span
                className="text-3xl"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 12, delay: 0.1 }}
              >
                {t.icon}
              </motion.span>
              <div className="min-w-0 flex-1">
                <div className={`text-xl font-black leading-tight ${t.color}`}>{title}</div>
                {children && <div className="mt-1 text-[16px] font-medium leading-snug text-ink/90">{children}</div>}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-[15px] font-extrabold text-signal">
              {cta} <span aria-hidden>→</span>
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-signal/70"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: autoMs / 1000, ease: 'linear' }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
