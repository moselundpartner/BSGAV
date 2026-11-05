import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const fmt = new Intl.NumberFormat('de-DE')

export function AnimatedNumber({ value, duration = 0.8, className = '', prefix = '', suffix = '' }: { value: number; duration?: number; className?: string; prefix?: string; suffix?: string }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const ctrl = animate(from.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => {
        from.current = v
        setShown(Math.round(v))
      },
    })
    return () => ctrl.stop()
  }, [value, duration])
  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {fmt.format(shown)}
      {suffix}
    </span>
  )
}

export function formatNumber(n: number) {
  return fmt.format(n)
}
