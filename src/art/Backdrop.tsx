import { memo } from 'react'
import { Waves } from './Water'

// Deterministische "Zufalls"-Sterne, damit nichts bei jedem Render springt
const STARS = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 999.13 + n * 77.7) * 10000
    return x - Math.floor(x)
  }
  return { x: r(1) * 100, y: r(2) * 55, s: r(3) > 0.85 ? 3 : r(3) > 0.5 ? 2 : 1.5, d: r(4) * 3 }
})

const BOX_COLORS = ['#2B5466', '#5B2E35', '#6B5222', '#24425E', '#3E5B3A', '#5C3A1E']

/** Hafen-Skyline Bremerhaven-Stil: Containerbrücken, Stapel, Autoterminal. Keine echten Logos. */
export const Skyline = memo(function Skyline() {
  const crane = (x: number, h: number, flip = false, key?: number) => (
    <g key={key} transform={`translate(${x} 0) ${flip ? 'scale(-1 1)' : ''}`}>
      {/* Beine */}
      <path d={`M0 120 L5 ${120 - h} M18 120 L13 ${120 - h}`} stroke="#061629" strokeWidth="2.6" />
      <path d={`M2 ${120 - h * 0.45} H16`} stroke="#061629" strokeWidth="1.6" />
      {/* Ausleger */}
      <rect x={-34} y={120 - h - 4} width={64} height={3.4} fill="#061629" />
      {/* Spitze & Seile */}
      <path d={`M7 ${120 - h - 4} L9 ${120 - h - 20} L11 ${120 - h - 4}`} fill="#061629" />
      <path d={`M9 ${120 - h - 20} L-32 ${120 - h - 3} M9 ${120 - h - 20} L28 ${120 - h - 3}`} stroke="#061629" strokeWidth="0.8" />
      {/* Positionslicht */}
      <circle className="blink" cx={9} cy={120 - h - 21} r={1.6} fill="#FF4D5E" style={{ animationDelay: `${(x % 7) * 0.2}s` }} />
      <circle cx={-32} cy={120 - h - 4} r={1} fill="#FFC940" opacity={0.9} />
    </g>
  )

  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="landGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0A2238" />
          <stop offset="1" stopColor="#061629" />
        </linearGradient>
      </defs>
      {/* ferne Uferlinie */}
      <path d="M0 108 Q 60 100 120 106 T 260 104 T 400 106 V120 H0Z" fill="#0A2238" opacity="0.8" />
      {/* Autoterminal-Parkhaus links */}
      <g>
        <rect x="8" y="88" width="54" height="24" fill="url(#landGrad)" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x="10" y={91 + r * 7} width="50" height="1" fill="#0E2E48" />
            {Array.from({ length: 9 }, (_, c) => (
              <rect key={c} x={11 + c * 5.5} y={92.5 + r * 7} width="3.4" height="2.2" rx="0.8" fill={['#9FB4C4', '#FF7A1A', '#4FC3CF', '#F2F7FA', '#B9475A'][(r * 3 + c) % 5]} opacity="0.55" />
            ))}
          </g>
        ))}
      </g>
      {/* Containerstapel */}
      {Array.from({ length: 16 }, (_, i) => {
        const h = 1 + ((i * 7) % 4)
        return Array.from({ length: h }, (_, j) => (
          <rect key={`${i}-${j}`} x={150 + i * 10} y={112 - (j + 1) * 5.5} width="9.4" height="5" fill={BOX_COLORS[(i + j * 3) % BOX_COLORS.length]} opacity="0.85" />
        ))
      })}
      {/* Containerbrücken */}
      {[110, 200, 255, 310, 365].map((x, i) => crane(x, 58 + (i % 2) * 8, false, i))}
      {/* Kai */}
      <rect x="0" y="112" width="400" height="8" fill="#061629" />
      {/* Kaibeleuchtung */}
      {[30, 90, 140, 230, 290, 350].map((x) => (
        <g key={x}>
          <rect x={x} y="96" width="1" height="16" fill="#061629" />
          <circle cx={x + 0.5} cy="96" r="1.4" fill="#FFC940" />
          <circle cx={x + 0.5} cy="96" r="5" fill="#FFC940" opacity="0.12" />
        </g>
      ))}
    </svg>
  )
})

interface BackdropProps {
  /** Horizont in % von oben */
  horizon?: number
  stormy?: boolean
  showSkyline?: boolean
  showMoon?: boolean
}

export const Backdrop = memo(function Backdrop({ horizon = 64, stormy = false, showSkyline = true, showMoon = true }: BackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Himmel */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: stormy
            ? 'linear-gradient(180deg, #05080F 0%, #101A26 50%, #1B2A36 100%)'
            : 'linear-gradient(180deg, #030A18 0%, #061226 35%, #0B2A3F 70%, #12455A 100%)',
        }}
      />
      {/* Sterne */}
      {!stormy &&
        STARS.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
          />
        ))}
      {/* Mond */}
      {!stormy && showMoon && (
        <div className="absolute" style={{ right: '12%', top: '7%' }}>
          <div className="absolute -inset-10 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,233,170,.22), transparent 65%)' }} />
          <div className="relative h-12 w-12 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #FFF6D8, #F6D98B 60%, #D9B45E)' }} />
        </div>
      )}
      {/* Leuchtfeuer-Kegel */}
      {!stormy && (
        <div
          className="beam absolute"
          style={{
            left: '18%',
            top: `${horizon - 22}%`,
            width: 140,
            height: '30%',
            background: 'linear-gradient(180deg, rgba(255,201,64,.18), transparent)',
            clipPath: 'polygon(48% 0, 52% 0, 100% 100%, 0 100%)',
          }}
        />
      )}
      {/* Skyline */}
      {showSkyline && (
        <div className="absolute inset-x-0" style={{ top: `${horizon - 16}%`, height: '16.4%' }}>
          <Skyline />
        </div>
      )}
      {/* Wasser */}
      <Waves stormy={stormy} style={{ top: `${horizon}%`, bottom: 0 }} />
      {/* Lichtreflexe */}
      {!stormy && (
        <div className="absolute inset-x-0" style={{ top: `${horizon + 2}%`, height: '14%' }}>
          {[22, 47, 58, 72, 88].map((x, i) => (
            <span
              key={x}
              className="twinkle absolute h-full"
              style={{
                left: `${x}%`,
                width: 3,
                background: 'repeating-linear-gradient(180deg, rgba(255,201,64,.55) 0 3px, transparent 3px 9px)',
                animationDelay: `${i * 0.5}s`,
                maskImage: 'linear-gradient(180deg, black, transparent)',
                WebkitMaskImage: 'linear-gradient(180deg, black, transparent)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
})
