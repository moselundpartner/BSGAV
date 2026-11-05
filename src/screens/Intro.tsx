import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { introHorizon } from '../art/Backdrop'
import { ContainerShip } from '../art/Ships'
import { Button } from '../components/Button'
import { Term } from '../components/Term'
import { useShake } from '../lib/hooks'
import { pick } from '../lib/random'
import { sfx } from '../lib/sound'
import { haptic } from '../lib/haptics'
import { useGame } from '../state/game'

const NAMES = ['Kapitän Möwe', 'Boje Ben', 'Tide Tilda', 'Kran-Kai', 'Lotsin Lu', 'Welle Wilma', 'Anker Anni', 'Funker Finn', 'Leuchtturm Lea', 'Kompass Kim', 'Hafen-Held', 'Möwe Mo', 'Deich Dani', 'Kai Kante']
const BLOCKED = ['arsch', 'fick', 'fuck', 'hure', 'nazi', 'hitler', 'schlampe', 'wichs', 'fotze', 'spast', 'behindert', 'nutte', 'bitch', 'porn', 'penis', 'vagina', 'kanake', 'schwuchtel', 'neger', 'sex', 'cock', 'dick', 'hurensohn', 'opfer', 'missgeburt', 'idiot', 'kacke', 'scheiß', 'scheiss', 'shit']

const TITLE = 'HAFEN-MISSION'

export function Intro() {
  const { start, name: savedName } = useGame()
  const [ready, setReady] = useState(false)
  const [name, setName] = useState(savedName)
  const [error, setError] = useState('')
  const [controls, shake] = useShake()
  const hornPlayed = useRef(false)
  const horizon = introHorizon()

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 2300)
    return () => window.clearTimeout(t)
  }, [])

  const submit = () => {
    let n = name.trim().replace(/\s+/g, ' ').slice(0, 14)
    if (!n) n = pick(NAMES)
    const low = n.toLowerCase().replace(/[^a-zäöüß]/g, '')
    if (BLOCKED.some((b) => low.includes(b))) {
      setError('Hm, nimm lieber einen anderen Namen 😉')
      shake()
      haptic.bad()
      return
    }
    start(n)
  }

  return (
    <div className="relative flex h-full flex-col" onClick={() => !ready && setReady(true)}>
      {/* Einlaufendes Schiff */}
      <motion.div
        className="absolute"
        style={{ top: `calc(${horizon}% - min(330px, 46vh) * 0.34)`, width: 'min(330px, 46vh)', left: 'calc(50% - min(330px, 46vh) / 2)' }}
        initial={{ x: 380 }}
        animate={{ x: -10 }}
        transition={{ duration: 2.2, ease: [0.16, 0.84, 0.3, 1] }}
        onAnimationComplete={() => {
          if (!hornPlayed.current) {
            hornPlayed.current = true
            sfx.horn()
          }
        }}
      >
        <div className="bob">
          <ContainerShip className="w-full" style={{ transform: 'scaleX(-1)' }} />
        </div>
        {/* Bugwelle */}
        <motion.div
          className="absolute rounded-full"
          style={{ left: -6, top: '78%', width: 60, height: 10, background: 'radial-gradient(ellipse, rgba(255,255,255,.55), transparent 70%)' }}
          animate={{ opacity: [0.9, 0.4, 0.9], scaleX: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {/* Kielwasser */}
        <motion.div
          className="absolute"
          style={{ right: -140, top: '80%', width: 180, height: 8, background: 'linear-gradient(90deg, rgba(255,255,255,.35), transparent)', borderRadius: 8 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1.8, duration: 1.2 }}
        />
      </motion.div>

      {/* Titel */}
      <div className="relative z-10 px-6 pt-[max(48px,calc(env(safe-area-inset-top)+40px))] text-center">
        <motion.div
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.2em] text-signal"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ⚓ Bremen · Bremerhaven
        </motion.div>
        <h1 className="title-font text-glow whitespace-nowrap text-[min(44px,10.6vw)] leading-none" aria-label={TITLE}>
          {TITLE.split('').map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{ color: i < 5 ? '#F2F7FA' : '#FFC940' }}
              initial={{ y: -60, opacity: 0, rotate: -20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 400, damping: 14 }}
            >
              {c}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mx-auto mt-3 max-w-[300px] text-[17px] font-semibold leading-snug text-ink/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Dein erster Tag als Azubi in einer Bremer <Term k="reederei" />.
        </motion.p>
      </div>

      <div className="flex-1" />

      {/* Name + Start */}
      <motion.div
        className="relative z-10 px-4 pb-[max(20px,env(safe-area-inset-bottom))]"
        initial={{ y: 260, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: 260, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        <motion.div animate={controls} className="glass-strong rounded-3xl p-4">
          <label htmlFor="nick" className="mb-2 block text-[15px] font-bold text-ink/80">
            Dein Spitzname
          </label>
          <div className="flex gap-2">
            <input
              id="nick"
              value={name}
              maxLength={14}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="z. B. Kapitän Möwe"
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="min-h-[54px] w-full min-w-0 rounded-2xl border-2 border-petrol-400/50 bg-night-900/80 px-4 text-[18px] font-bold text-ink placeholder:text-ink/35 focus:border-signal focus:outline-none"
            />
            <Button
              variant="secondary"
              className="!min-h-[54px] !px-0 w-[54px] shrink-0 text-2xl"
              aria-label="Zufälliger Name"
              onClick={() => {
                setName(pick(NAMES))
                setError('')
              }}
            >
              🎲
            </Button>
          </div>
          <div className="mt-1 min-h-[20px] text-[14px] font-semibold text-bad">{error}</div>
          <Button big className="mt-1 w-full" onClick={submit}>
            Los geht's <span aria-hidden>→</span>
          </Button>
          <p className="mt-2.5 text-center text-[11px] text-ink/50">Ohne Anmeldung · Keine Daten verlassen dein Handy</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
