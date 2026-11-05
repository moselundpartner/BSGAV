import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { onFx, type FxEvent } from '../lib/fx'
import { prefersReducedMotion } from '../lib/hooks'

const COLORS = ['#FF7A1A', '#FFC940', '#2EE6A6', '#4FC3CF', '#F2F7FA', '#FF4D5E']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  w: number
  h: number
  color: string
  life: number
  max: number
}

interface FloatText {
  id: number
  x: number
  y: number
  text: string
  color: string
}

/** Eine Canvas-Ebene für Konfetti + DOM-Ebene für schwebende Punkte. rAF läuft nur, solange Partikel leben. */
export function FxLayer() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const parts = useRef<Particle[]>([])
  const raf = useRef(0)
  const [texts, setTexts] = useState<FloatText[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = window.innerWidth * dpr
      cv.height = window.innerHeight * dpr
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const ps = parts.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.vy += 0.32
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.life++
        if (p.life > p.max || p.y > window.innerHeight + 20) {
          ps.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.max)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 1.7)))
        ctx.restore()
      }
      if (ps.length) raf.current = requestAnimationFrame(loop)
      else raf.current = 0
    }

    const off = onFx((e: FxEvent) => {
      if (e.kind === 'confetti') {
        const reduced = prefersReducedMotion()
        const n = reduced ? Math.min(12, e.count ?? 60) : e.count ?? 60
        const power = e.power ?? 11
        const colors = e.colors ?? COLORS
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (Math.random() - 0.5) * (e.spread ?? 2.4)
          const v = power * (0.45 + Math.random() * 0.75)
          parts.current.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.4,
            w: 5 + Math.random() * 5,
            h: 8 + Math.random() * 6,
            color: colors[i % colors.length],
            life: 0,
            max: 70 + Math.random() * 50,
          })
        }
        if (parts.current.length > 400) parts.current.splice(0, parts.current.length - 400)
        if (!raf.current) raf.current = requestAnimationFrame(loop)
      } else if (e.kind === 'points') {
        const id = ++idRef.current
        setTexts((t) => [...t.slice(-5), { id, x: e.x, y: e.y, text: e.text, color: e.color ?? '#FFC940' }])
        window.setTimeout(() => setTexts((t) => t.filter((x) => x.id !== id)), 1100)
      }
    })

    return () => {
      off()
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <AnimatePresence>
        {texts.map((t) => (
          <motion.div
            key={t.id}
            className="absolute text-3xl font-black"
            style={{ left: t.x, top: t.y, color: t.color, textShadow: '0 2px 0 #061226, 0 0 16px rgba(0,0,0,.6)', x: '-50%' }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -70, scale: 1.1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
