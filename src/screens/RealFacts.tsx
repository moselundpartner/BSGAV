import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { ContainerShip } from '../art/Ships'
import { Waves } from '../art/Water'
import { Button } from '../components/Button'
import { INFO } from '../content/config'
import { useGame } from '../state/game'

interface Fact {
  emoji: string
  title: string
  body: ReactNode
  accent: string
}

const P = ({ children }: { children: ReactNode }) => <mark className="rounded bg-gold/20 px-1 font-black text-gold">{children}</mark>

const FACTS: Fact[] = [
  {
    emoji: '🎓',
    title: '3 Jahre Ausbildung',
    accent: '#FF7A1A',
    body: (
      <>
        Du lernst im Betrieb – z. B. in einer Reederei oder bei einem Schiffsmakler – und in der Berufsschule <P>{INFO.schoolName}</P>. Mit Abi oder guten Noten geht es oft schneller.
      </>
    ),
  },
  {
    emoji: '🌍',
    title: 'Dein Alltag',
    accent: '#4FC3CF',
    body: <>Du organisierst Transporte rund um den Globus: am Rechner, am Telefon und im Hafen. Englisch sprichst du fast jeden Tag.</>,
  },
  {
    emoji: '💶',
    title: 'Geld & was du mitbringst',
    accent: '#FFC940',
    body: (
      <>
        Ausbildungsvergütung: <P>{INFO.trainingPay}</P>. Wichtig sind Spaß am Organisieren, Englisch und sicheres Rechnen mit den Grundrechenarten.
      </>
    ),
  },
  {
    emoji: '🚀',
    title: 'Deine Karriere',
    accent: '#2EE6A6',
    body: <>Danach kannst du z. B. Schiffe befrachten, Linien betreuen oder im Hafen Schiffe abfertigen. Später sind Weiterbildungen, ein Studium oder Jobs im Ausland drin.</>,
  },
  {
    emoji: '👋',
    title: 'Neugierig geworden?',
    accent: '#FF7A1A',
    body: (
      <span className="block space-y-1.5">
        <span className="block">Sprich uns direkt hier am Stand an!</span>
        <span className="block">
          👤 <P>{INFO.contactPerson}</P>
        </span>
        <span className="block">
          📞 <P>{INFO.contact}</P>
        </span>
        <span className="block">
          🌐 <P>{INFO.website}</P>
        </span>
        <span className="block">
          🏫 <P>{INFO.schoolName}</P>
        </span>
      </span>
    ),
  },
]

export function RealFacts() {
  const { restart } = useGame()
  const [[i, dir], setI] = useState<[number, number]>([0, 0])
  const go = (d: number) => {
    const n = i + d
    if (n < 0 || n >= FACTS.length) return
    setI([n, d])
  }
  const f = FACTS[i]

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 50 || info.velocity.x > 400) go(-1)
  }

  return (
    <div className="flex h-full flex-col px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <div className="pr-14 text-[13px] font-extrabold uppercase tracking-[0.18em] text-signal">Schifffahrtskaufmann/-frau</div>
      <div className="title-font pr-14 text-[32px] leading-tight">
        Das war <span className="text-gold">echt!</span>
      </div>
      <p className="mt-1 text-[15px] font-semibold text-ink/75">Alles, was du heute gemacht hast, gehört wirklich zum Beruf.</p>

      <div className="relative mt-4 min-h-[300px] flex-1">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={i}
            custom={dir}
            className="glass-strong absolute inset-0 flex touch-pan-y flex-col overflow-hidden rounded-3xl p-5"
            style={{ borderColor: f.accent + '88' }}
            variants={{
              enter: (d: number) => ({ x: d >= 0 ? 300 : -300, opacity: 0, rotate: d >= 0 ? 6 : -6 }),
              center: { x: 0, opacity: 1, rotate: 0 },
              exit: (d: number) => ({ x: d >= 0 ? -300 : 300, opacity: 0, rotate: d >= 0 ? -6 : 6 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={onDragEnd}
          >
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-30 blur-2xl" style={{ background: f.accent }} />
            <div className="text-[64px] leading-none">{f.emoji}</div>
            <div className="title-font mt-3 text-[28px] leading-tight" style={{ color: f.accent }}>
              {f.title}
            </div>
            <div className="mt-2 text-[18px] font-semibold leading-snug text-ink/90">{f.body}</div>
            <div className="flex-1" />
            <div className="pointer-events-none relative -mx-5 -mb-5 mt-2 h-[92px] overflow-hidden" aria-hidden>
              <div className="bob absolute bottom-[26px] left-[18%] w-[56%] opacity-90">
                <ContainerShip className="w-full" />
              </div>
              <Waves style={{ top: 58, bottom: 0 }} />
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center text-[13px] font-bold text-ink/60">{i < FACTS.length - 1 ? '← Wischen für mehr →' : ' '}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} className="glass flex h-12 w-12 items-center justify-center rounded-full text-xl disabled:opacity-30" aria-label="Zurück">
          ←
        </button>
        <div className="flex gap-2">
          {FACTS.map((_, k) => (
            <button key={k} type="button" aria-label={`Karte ${k + 1}`} onClick={() => setI([k, k > i ? 1 : -1])} className="p-1">
              <span className={`block h-2.5 rounded-full transition-all ${k === i ? 'w-7 bg-signal' : 'w-2.5 bg-white/25'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(1)} disabled={i === FACTS.length - 1} className="glass flex h-12 w-12 items-center justify-center rounded-full text-xl disabled:opacity-30" aria-label="Weiter">
          →
        </button>
      </div>

      <Button big className="mt-4 w-full" onClick={restart}>
        🔄 Nochmal spielen
      </Button>
    </div>
  )
}
