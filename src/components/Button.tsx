import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { sfx } from '../lib/sound'
import { haptic } from '../lib/haptics'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant
  big?: boolean
}

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-signal-light to-signal text-night-900 shadow-btn active:shadow-btn-pressed active:translate-y-[3px]',
  secondary: 'glass text-ink',
  ghost: 'bg-transparent text-ink/80 underline-offset-4',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', big = false, className = '', children, onClick, disabled, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return
        sfx.tap()
        haptic.tap()
        onClick?.(e)
      }}
      className={`relative inline-flex select-none items-center justify-center gap-2 rounded-2xl px-6 font-extrabold tracking-tight transition-[box-shadow,transform,opacity] duration-100 disabled:opacity-40 ${
        big ? 'min-h-[60px] text-xl' : 'min-h-[52px] text-lg'
      } ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
})
