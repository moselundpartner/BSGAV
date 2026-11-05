/** Kim, deine Ausbilderin – einfache, freundliche Illustration. */
export function Avatar({ size = 56, mood = 'happy' }: { size?: number; mood?: 'happy' | 'worried' | 'wow' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="avBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#1C93A3" />
          <stop offset="1" stopColor="#0B3F4C" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#avBg)" />
      {/* Haare hinten */}
      <path d="M14 34 Q 12 12 32 11 Q 52 12 50 34 Q 50 46 44 50 H 20 Q 14 46 14 34 Z" fill="#2A1A14" />
      {/* Jacke */}
      <path d="M12 64 Q 14 48 32 47 Q 50 48 52 64 Z" fill="#FF7A1A" />
      <path d="M26 48 L32 58 L38 48" fill="#F2F7FA" />
      {/* Hals & Kopf */}
      <rect x="28" y="40" width="8" height="9" rx="3" fill="#C98B63" />
      <ellipse cx="32" cy="31" rx="13" ry="14" fill="#E0A77F" />
      {/* Pony */}
      <path d="M19 28 Q 22 15 34 16 Q 44 17 45 27 Q 38 21 28 24 Q 23 26 19 28 Z" fill="#2A1A14" />
      {/* Augen */}
      {mood === 'wow' ? (
        <>
          <circle cx="27" cy="31" r="2.2" fill="#1A1A1A" />
          <circle cx="37" cy="31" r="2.2" fill="#1A1A1A" />
        </>
      ) : (
        <>
          <ellipse cx="27" cy="31" rx="1.7" ry="2" fill="#1A1A1A" />
          <ellipse cx="37" cy="31" rx="1.7" ry="2" fill="#1A1A1A" />
        </>
      )}
      {mood === 'worried' && <path d="M24 26 L29 27.5 M40 26 L35 27.5" stroke="#2A1A14" strokeWidth="1.4" strokeLinecap="round" />}
      {/* Mund */}
      {mood === 'happy' && <path d="M27 37 Q 32 41 37 37" stroke="#7A3B2A" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
      {mood === 'worried' && <path d="M28 39 Q 32 36.5 36 39" stroke="#7A3B2A" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
      {mood === 'wow' && <ellipse cx="32" cy="38.5" rx="2.4" ry="3" fill="#7A3B2A" />}
      {/* Wangen */}
      <circle cx="23.5" cy="35" r="2" fill="#F08A7A" opacity=".45" />
      <circle cx="40.5" cy="35" r="2" fill="#F08A7A" opacity=".45" />
      {/* Headset */}
      <path d="M18 30 Q 18 14 32 14 Q 46 14 46 30" stroke="#0B2A3F" strokeWidth="2" fill="none" />
      <rect x="15.5" y="28" width="5" height="8" rx="2" fill="#0B2A3F" />
      <path d="M18 36 Q 20 42 26 41" stroke="#0B2A3F" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
