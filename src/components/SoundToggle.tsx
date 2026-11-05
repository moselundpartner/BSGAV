import { useEffect, useState } from 'react'
import { isSoundOn, onSoundChange, setSound, sfx } from '../lib/sound'

export function SoundToggle() {
  const [on, setOn] = useState(isSoundOn())
  useEffect(() => onSoundChange(setOn), [])
  return (
    <button
      type="button"
      onClick={() => {
        setSound(!on)
        if (!on) window.setTimeout(() => sfx.ok(), 30)
      }}
      className="glass flex h-11 w-11 items-center justify-center rounded-full text-xl active:scale-95"
      aria-label={on ? 'Ton ausschalten' : 'Ton einschalten'}
      aria-pressed={on}
    >
      {on ? '🔊' : '🔇'}
    </button>
  )
}
