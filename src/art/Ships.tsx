import type { CSSProperties } from 'react'

export type ShipType = 'container' | 'bulk' | 'roro' | 'heavy'

interface ShipProps {
  className?: string
  style?: CSSProperties
}

const CONTAINER_COLORS = ['#FF7A1A', '#13707F', '#C2353F', '#FFC940', '#2F6FB5', '#3FAE8C', '#E8EEF2', '#8B4FB8']

/** Gemeinsamer Rumpf: Bug rechts, Heck links. Wasserlinie bei y≈80. */
function Hull({ color = '#17263C', stripe = '#FF7A1A' }: { color?: string; stripe?: string }) {
  return (
    <g>
      <path d="M6 58 H224 L238 54 L228 86 Q 120 92 22 88 Q 10 76 6 58 Z" fill={color} />
      {/* Antifouling unten */}
      <path d="M14 80 Q 120 84 231 78 L228 86 Q 120 92 22 88 Q 16 84 14 80 Z" fill="#B8323A" />
      {/* Zierstreifen */}
      <path d="M6 61 H226 L236 57.5" stroke={stripe} strokeWidth="2" fill="none" />
      {/* Ankerklüse */}
      <circle cx="222" cy="66" r="2" fill="#0A1626" />
      {/* Glanzkante */}
      <path d="M8 58 H224 L238 54" stroke="#ffffff" strokeOpacity=".25" strokeWidth="1" fill="none" />
    </g>
  )
}

function Bridge({ x = 16, top = 24, w = 26 }: { x?: number; top?: number; w?: number }) {
  return (
    <g>
      {/* Schornstein */}
      <rect x={x - 4} y={top + 6} width="9" height="20" fill="#E8EEF2" />
      <rect x={x - 4} y={top + 9} width="9" height="4" fill="#FF7A1A" />
      <rect x={x - 4} y={top + 4} width="9" height="3" fill="#0A1626" />
      {/* Aufbau */}
      <rect x={x} y={top} width={w} height={58 - top} fill="#F2F7FA" rx="1.5" />
      <rect x={x - 3} y={top} width={w + 6} height="6" fill="#DCE6EC" rx="1" />
      <rect x={x + 2} y={top + 1.5} width={w - 4} height="3" fill="#0B2A3F" />
      {Array.from({ length: Math.floor((58 - top - 10) / 6) }, (_, i) => (
        <rect key={i} x={x + 3} y={top + 10 + i * 6} width={w - 6} height="2" fill="#9FB4C4" />
      ))}
      {/* Mast + Licht */}
      <rect x={x + w / 2 - 0.6} y={top - 10} width="1.2" height="10" fill="#DCE6EC" />
      <circle className="blink" cx={x + w / 2} cy={top - 11} r="1.8" fill="#FFF6D8" />
    </g>
  )
}

export function ContainerShip({ className, style }: ShipProps) {
  return (
    <svg viewBox="0 0 240 100" className={className} style={style} aria-hidden>
      {Array.from({ length: 14 }, (_, c) =>
        Array.from({ length: c < 2 ? 3 : c > 11 ? 2 : 4 }, (_, r) => (
          <g key={`${c}-${r}`}>
            <rect
              x={50 + c * 12}
              y={50 - r * 8.4}
              width="11.2"
              height="8"
              fill={CONTAINER_COLORS[(c * 3 + r * 5) % CONTAINER_COLORS.length]}
            />
            <rect x={50 + c * 12} y={50 - r * 8.4} width="11.2" height="8" fill="url(#ribs)" />
          </g>
        )),
      )}
      <defs>
        <pattern id="ribs" width="2.4" height="8" patternUnits="userSpaceOnUse">
          <rect width="0.8" height="8" fill="#000" opacity=".18" />
        </pattern>
      </defs>
      <Hull />
      <Bridge x={20} top={18} w={24} />
    </svg>
  )
}

export function BulkCarrier({ className, style }: ShipProps) {
  return (
    <svg viewBox="0 0 240 100" className={className} style={style} aria-hidden>
      {/* Luken */}
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <rect x={56 + i * 33} y="48" width="26" height="10" rx="2" fill="#2F6FB5" />
          <rect x={56 + i * 33} y="48" width="26" height="3" rx="1" fill="#5A93D1" />
        </g>
      ))}
      {/* Deckskräne */}
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <rect x={83 + i * 33} y="30" width="3" height="28" fill="#FFC940" />
          <path d={`M84.5 32 L${100 + i * 33} 22`} stroke="#FFC940" strokeWidth="2.2" />
          <path d={`M${100 + i * 33} 22 V 34`} stroke="#DCE6EC" strokeWidth="0.6" />
        </g>
      ))}
      <Hull color="#1E3A2E" stripe="#FFC940" />
      <Bridge x={18} top={22} w={24} />
    </svg>
  )
}

export function CarCarrier({ className, style }: ShipProps) {
  return (
    <svg viewBox="0 0 240 100" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="roroBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F2F7FA" />
          <stop offset="1" stopColor="#C9D6DF" />
        </linearGradient>
      </defs>
      {/* Kastenförmiger Aufbau */}
      <path d="M10 60 V 22 Q 10 16 16 16 H 214 Q 230 16 234 30 L 236 56 H 10 Z" fill="url(#roroBody)" />
      <rect x="10" y="40" width="226" height="5" fill="#13707F" />
      <rect x="10" y="46" width="226" height="2" fill="#FF7A1A" />
      {/* Fensterreihe Brücke vorn */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={196 + i * 5.5} y="20" width="4" height="4" rx="0.6" fill="#0B2A3F" />
      ))}
      {/* Bullaugen */}
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={20 + i * 8.4} cy="30" r="1.1" fill="#9FB4C4" />
      ))}
      {/* Heckrampe */}
      <path d="M10 56 L 2 72 L 6 72 L 14 56 Z" fill="#9FB4C4" />
      <Hull color="#0E2F4A" stripe="#4FC3CF" />
      <circle className="blink" cx="214" cy="14" r="1.8" fill="#FFF6D8" />
    </svg>
  )
}

export function HeavyLiftShip({ className, style }: ShipProps) {
  return (
    <svg viewBox="0 0 240 100" className={className} style={style} aria-hidden>
      {/* Rotorblatt auf Deck */}
      <path d="M40 50 Q 44 44 60 44 L 210 48 Q 214 49 210 50 L 60 54 Q 44 55 40 50 Z" fill="#F2F7FA" />
      <path d="M44 50 L 208 49" stroke="#C9D6DF" strokeWidth="1" />
      <rect x="40" y="44" width="10" height="12" rx="2" fill="#DCE6EC" />
      {/* Zwei Schwergutkräne */}
      {[98, 132].map((x, i) => (
        <g key={x}>
          <rect x={x} y="22" width="6" height="36" fill="#FF7A1A" />
          <rect x={x - 2} y="54" width="10" height="4" fill="#D95F05" />
          <path d={`M${x + 3} 26 L ${i ? x + 34 : x - 30} 6`} stroke="#FF7A1A" strokeWidth="3.4" strokeLinecap="round" />
          <path d={`M${i ? x + 34 : x - 30} 6 V 40`} stroke="#DCE6EC" strokeWidth="0.7" />
          <path d={`M${x + 3} 22 L ${i ? x + 34 : x - 30} 6`} stroke="#DCE6EC" strokeWidth="0.5" />
        </g>
      ))}
      <Hull color="#3A1E2E" stripe="#F2F7FA" />
      <Bridge x={198} top={24} w={22} />
    </svg>
  )
}

export const SHIP_ART: Record<ShipType, (p: ShipProps) => JSX.Element> = {
  container: ContainerShip,
  bulk: BulkCarrier,
  roro: CarCarrier,
  heavy: HeavyLiftShip,
}

export const SHIP_INFO: Record<ShipType, { name: string; short: string; emoji: string }> = {
  container: { name: 'Containerschiff', short: 'Für alles, was in Container passt', emoji: '📦' },
  bulk: { name: 'Massengutfrachter', short: 'Für lose Ladung wie Getreide oder Kohle', emoji: '🌾' },
  roro: { name: 'Autotransporter', short: 'Fahrzeuge rollen über Rampen an Bord', emoji: '🚗' },
  heavy: { name: 'Schwergutschiff', short: 'Mit eigenen Kränen für XXL-Teile', emoji: '🏗️' },
}
