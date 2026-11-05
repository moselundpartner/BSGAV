import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Avatar } from '../art/Avatar'

/** Sprechblase von Kim, der Ausbilderin. */
export function Speech({ children, mood = 'happy', delay = 0, className = '' }: { children: ReactNode; mood?: 'happy' | 'worried' | 'wow'; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`flex items-end gap-2.5 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
    >
      <Avatar size={52} mood={mood} />
      <div className="glass-strong relative rounded-2xl rounded-bl-md px-4 py-3 text-[17px] font-semibold leading-snug">
        {children}
      </div>
    </motion.div>
  )
}
