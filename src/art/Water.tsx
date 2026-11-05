import type { CSSProperties } from 'react'

/** Nahtlos kachelnde Welle (2 Perioden pro Hälfte → translate -50% ist nahtlos). */
function wavePath(amp: number, period = 150) {
  const w = 1200
  let d = `M0 20 Q ${period / 4} ${20 - amp} ${period / 2} 20`
  for (let x = period / 2; x < w; x += period / 2) d += ` T ${x + period / 2} 20`
  return d + ` V 60 H 0 Z`
}

const LAYERS = [
  { amp: 6, period: 200, color: '#0E4D5C', opacity: 0.9, dur: 14, top: 0 },
  { amp: 8, period: 150, color: '#0B3F4C', opacity: 0.95, dur: 10, top: 10 },
  { amp: 7, period: 300, color: '#082F3D', opacity: 1, dur: 7, top: 22 },
]

export function Waves({ className = '', style, stormy = false }: { className?: string; style?: CSSProperties; stormy?: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`} style={style}>
      {LAYERS.map((l, i) => (
        <svg
          key={i}
          className="wave-layer absolute left-0"
          style={{
            width: '200%',
            height: 60,
            top: l.top,
            animationDuration: `${stormy ? l.dur / 2.2 : l.dur}s`,
            animationDirection: i % 2 ? 'reverse' : 'normal',
          }}
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={wavePath(stormy ? l.amp * 2.2 : l.amp, l.period)} fill={l.color} opacity={l.opacity} />
          <path d={wavePath(stormy ? l.amp * 2.2 : l.amp, l.period).split(' V')[0]} fill="none" stroke="#4FC3CF" strokeOpacity={0.25 - i * 0.05} strokeWidth="1.5" />
        </svg>
      ))}
      <div className="absolute inset-x-0 bottom-0" style={{ top: 40, background: 'linear-gradient(#082F3D, #051F2B)' }} />
    </div>
  )
}
