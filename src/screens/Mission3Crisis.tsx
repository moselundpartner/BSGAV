import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Skyline } from '../art/Backdrop'
import { ContainerShip } from '../art/Ships'
import { Waves } from '../art/Water'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { Button } from '../components/Button'
import { MissionHeader } from '../components/MissionHeader'
import { MissionTitle } from '../components/MissionTitle'
import { Speech } from '../components/Speech'
import { TermCard } from '../components/Term'
import { TimerRing } from '../components/TimerRing'
import { CRISES, CRISIS_TIME, SPEED_BONUS_PER_SEC, type Crisis, type CrisisOption } from '../content/crises'
import { confettiAt, pointsAt } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { useCountdown, usePhase, useShake } from '../lib/hooks'
import { pick, shuffle } from '../lib/random'
import { sfx } from '../lib/sound'
import { useGame } from '../state/game'

type Phase = 'title' | 'calm' | 'alarm' | 'outcome'

function StormScene() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#05080F,#1B2A36)' }} />
      <motion.div
        className="absolute left-1/2 top-[18%] w-[62%]"
        style={{ marginLeft: '-31%' }}
        animate={{ rotate: [-7, 6, -7], y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ContainerShip className="w-full" />
      </motion.div>
      <Waves stormy style={{ top: '58%', bottom: 0 }} />
      <div
        className="rain pointer-events-none absolute -inset-[30%]"
        style={{ background: 'repeating-linear-gradient(105deg, transparent 0 14px, rgba(180,210,230,.35) 14px 15px)' }}
      />
      <div className="lightning pointer-events-none absolute inset-0 bg-white" />
      <svg className="lightning absolute right-[14%] top-[2%] h-[45%]" viewBox="0 0 20 60" aria-hidden>
        <path d="M12 0 L4 28 H11 L6 60 L18 22 H11 L16 0 Z" fill="#FFF6D8" />
      </svg>
    </>
  )
}

function StrikeScene() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#061226,#12455A)' }} />
      <div className="absolute inset-x-0 top-[22%] h-[40%]">
        <Skyline />
      </div>
      <Waves style={{ top: '62%', bottom: 0 }} />
      <div className="bob absolute bottom-[14%] left-[-6%] w-[50%]">
        <ContainerShip className="w-full" />
      </div>
      <div className="absolute bottom-[30%] left-[30%] text-2xl" aria-hidden>
        ⚓
      </div>
      {/* Absperrung */}
      <div className="absolute right-[6%] top-[46%] h-3 w-[44%] rounded-sm" style={{ background: 'repeating-linear-gradient(45deg,#FF4D5E 0 10px,#F2F7FA 10px 20px)' }} />
      <motion.div
        className="absolute right-[8%] top-[12%] rotate-[-6deg] rounded-lg border-4 border-bad bg-ink px-3 py-1 text-xl font-black text-bad shadow-card"
        animate={{ rotate: [-6, -2, -6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        ✊ STREIK
      </motion.div>
      <div className="absolute right-[12%] top-[34%] flex gap-1 text-xl" aria-hidden>
        <span className="float-y">🧑‍🏭</span>
        <span className="float-y" style={{ animationDelay: '.4s' }}>
          👷
        </span>
        <span className="float-y" style={{ animationDelay: '.8s' }}>
          🧑‍🏭
        </span>
      </div>
    </>
  )
}

function CanalScene() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#C9A15A,#A9803F)' }} />
      {/* Kanal (Draufsicht) */}
      <div className="absolute -inset-x-[20%] top-[32%] h-[36%] rotate-[-12deg]" style={{ background: 'linear-gradient(180deg,#13707F,#0E4D5C 50%,#13707F)' }}>
        <div className="wave-layer absolute inset-y-0 left-0 w-[200%] opacity-30" style={{ animationDuration: '6s', background: 'repeating-linear-gradient(90deg, transparent 0 30px, rgba(255,255,255,.4) 30px 34px)' }} />
      </div>
      {/* quer steckendes Schiff */}
      <motion.div
        className="absolute left-1/2 top-[47%] h-[13%] w-[62%] rounded-r-[40%] rounded-l-md"
        style={{ marginLeft: '-31%', marginTop: '-3%', background: 'linear-gradient(180deg,#17263C,#2F4A6A)', rotate: 28 }}
        animate={{ x: [0, 2, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.2 }}
      >
        <div className="absolute inset-y-[18%] left-[8%] right-[18%] flex gap-[2px]">
          {['#FF7A1A', '#13707F', '#C2353F', '#FFC940', '#2F6FB5', '#3FAE8C', '#FF7A1A', '#E8EEF2'].map((c, i) => (
            <div key={i} className="flex-1 rounded-[2px]" style={{ background: c }} />
          ))}
        </div>
      </motion.div>
      {/* Stau */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute h-[6%] w-[11%] rounded-r-full bg-night-700" style={{ left: `${2 + i * 9}%`, top: `${37 + i * 1.9}%`, rotate: '-12deg' }} />
      ))}
      <motion.div className="absolute left-[64%] top-[6%] text-3xl" animate={{ rotate: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity }} aria-hidden>
        🚜
      </motion.div>
      <div className="absolute bottom-[8%] right-[6%] rounded-lg bg-bad px-2 py-1 text-sm font-black text-ink shadow-card">⛔ GESPERRT</div>
    </>
  )
}

function CalmScene() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#0B2A3F,#12455A)' }} />
      <motion.div className="absolute top-[22%] w-[60%]" initial={{ left: '-10%' }} animate={{ left: '24%' }} transition={{ duration: 2.4, ease: 'easeOut' }}>
        <div className="bob">
          <ContainerShip className="w-full" />
        </div>
      </motion.div>
      <Waves style={{ top: '62%', bottom: 0 }} />
      <div className="absolute left-3 top-3 rounded-full bg-ok/20 px-3 py-1 text-sm font-bold text-ok">✓ Alles im Plan</div>
    </>
  )
}

const MOOD_TEXT: Record<string, string> = { '😡': 'stinksauer', '😠': 'verärgert', '😐': 'genervt', '🙂': 'zufrieden', '😃': 'begeistert' }

export function Mission3Crisis() {
  const { addScore, next } = useGame()
  const crisis = useMemo<Crisis>(() => pick(CRISES), [])
  const options = useMemo(() => shuffle(crisis.options), [crisis])
  const [phase, setPhase, phaseRef] = usePhase<Phase>('title')
  const [choice, setChoice] = useState<CrisisOption | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [bonus, setBonus] = useState(0)
  const [ctl, shake] = useShake()
  const flashRef = useRef<HTMLDivElement>(null)
  const ptsRef = useRef<HTMLDivElement>(null)

  const decide = useCallback(
    (opt: CrisisOption | null, timeLeft: number) => {
      if (phaseRef.current !== 'alarm') return
      setPhase('outcome')
      let o = opt
      if (!o) {
        // Zeit abgelaufen → teuerste Folge, keine Punkte
        setTimedOut(true)
        o = [...crisis.options].sort((a, b) => a.points - b.points)[0]
      }
      const b = opt && o.points >= 200 ? Math.round(timeLeft * SPEED_BONUS_PER_SEC) : 0
      setBonus(b)
      setChoice(o)
      const pts = opt ? o.points + b : 0
      addScore(2, pts)
      window.setTimeout(() => {
        if (opt && o!.points >= 200) {
          sfx.ok()
          haptic.ok()
          confettiAt(ptsRef.current, 80)
        } else {
          sfx.bad()
          haptic.bad()
          shake()
        }
        if (pts) pointsAt(ptsRef.current, pts)
      }, 500)
    },
    [phaseRef, setPhase, crisis, addScore, shake],
  )

  const { left } = useCountdown(CRISIS_TIME, phase === 'alarm', () => decide(null, 0))

  // ruhige Fahrt → Alarm
  useEffect(() => {
    if (phase !== 'calm') return
    const t = window.setTimeout(() => {
      setPhase('alarm')
      sfx.alarm()
      haptic.big()
    }, 1800)
    return () => window.clearTimeout(t)
  }, [phase, setPhase])

  const onTitleDone = useCallback(() => setPhase((p) => (p === 'title' ? 'calm' : p)), [setPhase])

  const Scene = phase === 'calm' || phase === 'title' ? CalmScene : crisis.id === 'storm' ? StormScene : crisis.id === 'strike' ? StrikeScene : CanalScene
  const good = !!choice && !timedOut && choice.points >= 200

  return (
    <div className="relative flex h-full flex-col">
      <MissionHeader n={3} title="Die Krise" right={phase === 'alarm' ? <TimerRing left={left} total={CRISIS_TIME} size={50} /> : undefined} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {/* Szene */}
        <motion.div animate={ctl} className="relative mt-1 aspect-[16/9] max-h-[30vh] w-full overflow-hidden rounded-3xl border border-petrol-400/25 shadow-card">
          <Scene />
          <AnimatePresence>
            {phase === 'alarm' && (
              <motion.div
                ref={flashRef}
                className="pointer-events-none absolute inset-0 border-4 border-signal"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.3, 1, 0.3] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'calm' && (
            <motion.div key="calm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
              <Speech>Dein Schiff ist unterwegs. Läuft alles nach Plan … oder? 🤔</Speech>
            </motion.div>
          )}

          {phase === 'alarm' && (
            <motion.div key="alarm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }}>
              <motion.div
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-signal px-3 py-1 text-sm font-black uppercase tracking-wider text-night-900"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                🚨 Alarm
              </motion.div>
              <div className="title-font mt-1.5 text-[26px] leading-tight">{crisis.title}</div>
              <p className="mt-1 text-[16px] font-semibold leading-snug text-ink/85">{crisis.text}</p>
              <div className="mt-1 text-[15px] font-black text-gold">Was tust du? Schnell!</div>
              <div className="mt-2.5 space-y-2.5">
                {options.map((o, i) => (
                  <motion.button
                    key={o.id}
                    type="button"
                    onClick={() => decide(o, left)}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex min-h-[64px] w-full items-center gap-3 rounded-2xl border-2 border-petrol-400/30 bg-night-800/80 px-3.5 py-2.5 text-left active:border-signal"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">{o.emoji}</span>
                    <span className="text-[16px] font-extrabold leading-snug">{o.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'outcome' && choice && (
            <motion.div key="outcome" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`mt-3 text-[13px] font-black uppercase tracking-wider ${good ? 'text-ok' : 'text-bad'}`}>
                {timedOut ? '⏰ Zu spät entschieden!' : good ? '✅ Starke Entscheidung' : '❌ Das ging nach hinten los'}
              </div>
              <div className="title-font text-[22px] leading-tight">{timedOut ? 'Ohne Entscheidung läuft alles schief.' : choice.label}</div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <motion.div className="glass rounded-2xl p-2.5 text-center" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-ink/60">Mehrkosten</div>
                  <div className={`text-[19px] font-black ${choice.cost > 50000 ? 'text-bad' : 'text-gold'}`}>
                    <AnimatedNumber value={choice.cost} duration={1} suffix=" €" />
                  </div>
                </motion.div>
                <motion.div className="glass rounded-2xl p-2.5 text-center" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-ink/60">Verspätung</div>
                  <div className={`text-[19px] font-black ${choice.delay > 5 ? 'text-bad' : 'text-gold'}`}>
                    +<AnimatedNumber value={choice.delay} duration={1} /> {choice.delay === 1 ? 'Tag' : 'Tage'}
                  </div>
                </motion.div>
                <motion.div className="glass rounded-2xl p-2.5 text-center" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-ink/60">Kunde</div>
                  <motion.div className="text-[28px] leading-none" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ delay: 0.8, duration: 0.5 }}>
                    {choice.mood}
                  </motion.div>
                  <div className="text-[11px] font-bold text-ink/70">{MOOD_TEXT[choice.mood]}</div>
                </motion.div>
              </div>

              <p className="mt-3 text-[16px] font-semibold leading-snug">
                {timedOut ? 'Wer nicht entscheidet, verliert Zeit und Geld. Im Job heißt es: ruhig bleiben – aber handeln!' : choice.why}
              </p>
              {choice.term && <TermCard k={choice.term} className="mt-2" />}

              <div ref={ptsRef} className="mt-3 flex items-center justify-between rounded-2xl bg-night-800/70 px-4 py-2.5">
                <span className="text-[15px] font-bold text-ink/80">Punkte{bonus ? ` (inkl. ${bonus} Tempo-Bonus)` : ''}</span>
                <span className="text-[24px] font-black text-gold">+{timedOut ? 0 : choice.points + bonus}</span>
              </div>
              <p className="mt-1.5 text-[11px] text-ink/45">Alle Beträge sind Beispielwerte.</p>

              <Button big className="mt-3 w-full" onClick={next}>
                Mission abschließen →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MissionTitle show={phase === 'title'} n={3} title="Die Krise" sub="Auf See läuft nicht immer alles glatt. Entscheide schnell!" emoji="⛈️" onDone={onTitleDone} />
    </div>
  )
}
