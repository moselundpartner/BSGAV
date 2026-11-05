import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GLOSSARY, type GlossaryKey } from '../content/config'

/** Tippbarer Fachbegriff mit kurzer Erklärung. */
export function Term({ k, children }: { k: GlossaryKey; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const g = GLOSSARY[k]
  useEffect(() => {
    if (!open) return
    const close = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const t = window.setTimeout(() => setOpen(false), 6000)
    document.addEventListener('pointerdown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      window.clearTimeout(t)
    }
  }, [open])
  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="inline rounded-md bg-petrol-500/30 px-1 font-extrabold text-petrol-300 underline decoration-dotted underline-offset-4"
      >
        {children ?? g.term}
        <span className="ml-0.5 align-super text-[10px]">?</span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="fixed inset-x-0 z-[60] mx-auto w-[calc(100%-32px)] max-w-[420px] rounded-2xl border border-petrol-300/40 bg-night-800/95 p-4 text-left text-[16px] font-medium leading-snug text-ink shadow-card"
              style={{ bottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
              role="tooltip"
              onClick={() => setOpen(false)}
            >
              <span className="mr-1">💡</span>
              <b className="text-gold">{g.term}:</b> {g.text}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  )
}

/** Fester Info-Chip, der einen neuen Begriff einmal einblendet. */
export function TermCard({ k, className = '' }: { k: GlossaryKey; className?: string }) {
  const g = GLOSSARY[k]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-[14px] leading-snug ${className}`}
    >
      <span className="text-base">💡</span>
      <span>
        <b className="text-gold">{g.term}</b> = {g.text}
      </span>
    </motion.div>
  )
}
