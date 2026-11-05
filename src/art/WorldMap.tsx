import { memo, useEffect, useMemo, useRef, useState } from 'react'

/** Grobe, stilisierte Kontinente in [Längengrad, Breitengrad]. */
const LANDS: [number, number][][] = [
  // Nordamerika
  [[-130,70],[-100,72],[-85,70],[-80,64],[-95,60],[-90,57],[-80,55],[-78,62],[-70,60],[-64,60],[-56,53],[-60,47],[-66,45],[-70,42],[-74,40],[-76,37],[-76,35],[-81,31],[-80,26],[-81,25],[-83,29],[-90,30],[-97,28],[-97,22],[-95,18],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-79,9],[-77,8],[-80,7],[-85,10],[-92,14],[-105,20],[-112,30],[-118,34],[-124,40],[-125,49],[-135,58],[-150,60],[-165,62],[-160,70]],
  // Kuba
  [[-85,22],[-80,23.2],[-74,20],[-78,19.8]],
  // Grönland
  [[-55,82],[-30,83],[-20,75],[-22,70],[-40,65],[-44,60],[-50,62],[-54,68],[-60,76],[-72,78]],
  // Südamerika
  [[-77,8],[-72,12],[-63,11],[-60,8],[-52,5],[-50,0],[-44,-2],[-35,-5],[-35,-9],[-39,-14],[-40,-21],[-44,-23],[-48,-26],[-53,-34],[-58,-35],[-57,-38],[-62,-39],[-65,-42],[-66,-47],[-69,-51],[-68,-55],[-72,-53],[-75,-46],[-73,-37],[-71,-30],[-70,-18],[-76,-14],[-81,-5],[-80,0],[-78,2]],
  // Afrika
  [[-17,21],[-16,14],[-17,13],[-12,8],[-8,4.5],[-2,5],[5,6],[9,4],[9,-1],[12,-6],[13,-12],[12,-17],[15,-27],[18.5,-34.5],[22,-34],[27,-33.5],[32,-28],[35,-24],[35,-18],[40,-15],[40,-10],[39,-5],[41,-1],[44,2],[48,5],[51,11],[44,11],[43,12.5],[38,18],[35,24],[33,28],[32.5,30],[29,31],[20,32],[19,30],[10,34],[11,37],[0,36],[-6,36],[-10,30],[-13,27]],
  // Madagaskar
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
  // Eurasien
  [[-9,37],[-9,43],[-2,43.5],[-1,46],[-4.5,48],[-1.5,48.7],[2,51],[4,52],[5,53.4],[8,53.6],[9,55],[8,57],[10.5,57.7],[12,56],[12,54.5],[14,54],[19,54.5],[21,57],[24,57],[28,60],[23,60],[21,61],[22,65],[25,65.5],[21,64],[17,61],[19,60],[16,57],[13,55.5],[11,58.5],[8,58],[5,59],[5,62],[10,64],[14,67],[20,70],[28,71],[40,67],[45,68],[60,70],[70,73],[100,77],[140,73],[160,70],[180,68],[180,65],[160,60],[142,58],[135,54],[140,50],[133,43],[129,41],[129,35],[126,35],[126,38],[122,40],[118,39],[122,37],[120,33],[122,30],[120,26],[116,23],[110,21],[108,21],[106,18],[109,13],[107,10],[105,9],[103,10],[100,13],[100,8],[103,5],[104,1.3],[101,3],[98.5,8],[98,15],[94,17],[92,22],[89,21.5],[87,21],[80,15],[80,10],[77,8],[76,10],[73,16],[72.5,21],[70,22.5],[67,25],[61,25],[57,26],[56,27],[52,28],[50,30],[48,30],[50,26],[51.5,24],[56,24.5],[56.5,26],[59,22],[57,19],[52,16],[45,13],[43,13],[42,16],[39,21],[35,28],[34.5,29.5],[34,31],[35,33],[36,36],[30,36.5],[27,37],[26,40],[23,40],[24,38],[22,36.5],[21,38],[19.5,40],[19,42],[15,45],[13.5,45.5],[12.5,44],[14,42],[16,41],[18.5,40],[16.5,38],[15.6,38],[16,39.5],[12,42],[10.5,43],[9,44.4],[7,43.7],[3,43.3],[3,42],[0,40],[0,38.5],[-2,36.7],[-5.6,36],[-6.5,36.8]],
  // Großbritannien
  [[-5.7,50],[1.5,51],[1.7,52.7],[0,53.5],[-1.5,55],[-2,57],[-1.8,57.6],[-4,58.6],[-5,58.6],[-6.2,56.5],[-5,55],[-3,54.5],[-3,53.4],[-4.5,53.2],[-4.2,52],[-5.2,51.7],[-3,51.3]],
  // Irland
  [[-6,52],[-6,54],[-7.5,55.3],[-10,54],[-10,51.6]],
  // Island
  [[-24,65.5],[-22,66.5],[-15,66.5],[-13.5,65],[-18,63.4],[-22,63.8]],
  // Japan
  [[130,31],[132,34],[135,34],[140,35],[141,38],[142,41],[140,41.5],[140,38],[136,36.5],[132,35.5],[129.5,33]],
  [[140,42],[142,42],[145,43],[142,45.5],[141,45]],
  // Taiwan
  [[120.2,22],[121,22],[122,25],[121.5,25.3],[120,23.5]],
  // Sri Lanka
  [[79.8,6],[81.8,7],[80.2,9.8]],
  // Sumatra, Borneo, Java, Neuguinea, Philippinen
  [[95,5.5],[98,4],[104,-2],[106,-6],[102,-4],[96,2]],
  [[109,2],[110,-3],[116,-4],[119,1],[117,7],[115,5]],
  [[105,-6.5],[114,-7.8],[114,-8.5],[106,-7.4]],
  [[131,-1],[141,-2.5],[150,-10],[141,-9],[137,-5]],
  [[120,18],[122,18.5],[124,13],[126,7],[122,7],[120,14]],
  // Australien
  [[113,-22],[114,-26],[115,-34],[118,-35],[124,-33.5],[131,-31.5],[135,-35],[138,-35.5],[140,-38],[146,-39],[150,-37],[153,-31],[153,-25],[146,-19],[142,-11],[141,-17],[136,-15],[137,-12],[132,-11.5],[129,-15],[126,-14],[122,-17.5],[116,-20.5]],
]

// Kartenausschnitt
const LON0 = -100
const LON1 = 140
const LAT0 = 66
const LAT1 = -42
export const MAP_W = (LON1 - LON0) * 2
export const MAP_H = (LAT0 - LAT1) * 2

export function project([lon, lat]: [number, number]): [number, number] {
  return [(lon - LON0) * 2, (LAT0 - lat) * 2]
}

function toPath(pts: [number, number][], close = true) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${project(p).map((n) => n.toFixed(1)).join(' ')}`).join(' ') + (close ? 'Z' : '')
}

const LAND_PATH = LANDS.map((l) => toPath(l)).join(' ')

/** Punkte entlang eines Polygonzugs gleichmäßig interpolieren */
function samplePolyline(pts: [number, number][]) {
  const p = pts.map(project)
  const segs: number[] = []
  let total = 0
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])
    segs.push(d)
    total += d
  }
  return (t: number): { x: number; y: number; angle: number } => {
    let dist = Math.max(0, Math.min(1, t)) * total
    for (let i = 0; i < segs.length; i++) {
      if (dist <= segs[i] || i === segs.length - 1) {
        const f = segs[i] ? Math.min(1, dist / segs[i]) : 0
        const a = p[i]
        const b = p[i + 1]
        return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, angle: Math.atan2(b[1] - a[1], b[0] - a[0]) }
      }
      dist -= segs[i]
    }
    return { x: p[0][0], y: p[0][1], angle: 0 }
  }
}

export interface MapRoute {
  id: string
  points: [number, number][]
  color: string
}

export interface MapPort {
  name: string
  at: [number, number]
  kind: 'home' | 'dest'
}

interface WorldMapProps {
  routes: MapRoute[]
  selected?: string | null
  ports: MapPort[]
  /** Wenn gesetzt, fährt das Schiff diese Route ab */
  sailing?: string | null
  sailMs?: number
  onSailEnd?: () => void
  dimOthers?: boolean
}

export const WorldMap = memo(function WorldMap({ routes, selected, ports, sailing, sailMs = 2200, onSailEnd, dimOthers }: WorldMapProps) {
  const sailRoute = routes.find((r) => r.id === sailing)
  const sampler = useMemo(() => (sailRoute ? samplePolyline(sailRoute.points) : null), [sailRoute])
  const [shipPos, setShipPos] = useState<{ x: number; y: number; angle: number } | null>(null)
  const endRef = useRef(onSailEnd)
  endRef.current = onSailEnd

  useEffect(() => {
    if (!sampler) {
      setShipPos(null)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / sailMs)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setShipPos(sampler(eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else endRef.current?.()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sampler, sailMs])

  // Längen für Strich-Animation
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-full w-full" role="img" aria-label="Weltkarte mit Seerouten">
      <defs>
        <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#4FC3CF" strokeOpacity=".07" strokeWidth="1" />
        </pattern>
        <radialGradient id="seaGlow" cx="50%" cy="45%" r="70%">
          <stop offset="0" stopColor="#0E4D5C" />
          <stop offset="1" stopColor="#061A2C" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="url(#seaGlow)" />
      <rect width={MAP_W} height={MAP_H} fill="url(#mapGrid)" />
      <path d={LAND_PATH} fill="#1A3B52" stroke="#2C5D7A" strokeWidth="1" strokeLinejoin="round" />

      {routes.map((r) => {
        const isSel = r.id === selected || r.id === sailing
        const dim = dimOthers && (selected || sailing) && !isSel
        return (
          <g key={r.id} opacity={dim ? 0.18 : 1} style={{ transition: 'opacity .3s' }}>
            <path d={toPath(r.points, false)} fill="none" stroke={r.color} strokeOpacity={isSel ? 0.35 : 0.2} strokeWidth={isSel ? 9 : 6} strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={toPath(r.points, false)}
              fill="none"
              stroke={r.color}
              strokeWidth={isSel ? 3.2 : 2.2}
              strokeDasharray={isSel ? undefined : '6 5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={isSel ? 'url(#glow)' : undefined}
            />
          </g>
        )
      })}

      {ports.map((p) => {
        const [x, y] = project(p.at)
        const home = p.kind === 'home'
        const labelLeft = x > MAP_W * 0.75
        return (
          <g key={p.name + p.kind}>
            <circle cx={x} cy={y} r="9" fill={home ? '#FF7A1A' : '#2EE6A6'} opacity=".25" className="pulse-ring" style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }} />
            <circle cx={x} cy={y} r="4.2" fill={home ? '#FF7A1A' : '#2EE6A6'} stroke="#061226" strokeWidth="1.5" />
            <text
              x={labelLeft ? x - 9 : x + 9}
              y={y + (home ? -7 : 4)}
              textAnchor={labelLeft ? 'end' : 'start'}
              fontSize="17"
              fontWeight="800"
              fill="#F2F7FA"
              stroke="#061226"
              strokeWidth="3.5"
              paintOrder="stroke"
            >
              {p.name}
            </text>
          </g>
        )
      })}

      {shipPos && (
        <g transform={`translate(${shipPos.x} ${shipPos.y}) rotate(${(shipPos.angle * 180) / Math.PI})`}>
          <circle r="11" fill="#FFC940" opacity=".25" />
          <path d="M-8 -4 H4 L9 0 L4 4 H-8 Z" fill="#FFC940" stroke="#061226" strokeWidth="1.2" />
        </g>
      )}
    </svg>
  )
})
