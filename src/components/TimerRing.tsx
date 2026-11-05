export function TimerRing({ left, total, size = 56 }: { left: number; total: number; size?: number }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const f = Math.max(0, Math.min(1, left / total))
  const danger = f < 0.3
  const color = danger ? '#FF4D5E' : f < 0.6 ? '#FFC940' : '#2EE6A6'
  return (
    <div className={`relative shrink-0 ${danger && left > 0 ? 'animate-pulse' : ''}`} style={{ width: size, height: size }} role="timer" aria-label={`${Math.ceil(left)} Sekunden übrig`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.12)" strokeWidth="6" fill="rgba(6,18,38,.6)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - f)}
          style={{ transition: 'stroke-dashoffset .12s linear, stroke .3s' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-black tabular-nums" style={{ color }}>
        {Math.ceil(left)}
      </span>
    </div>
  )
}
