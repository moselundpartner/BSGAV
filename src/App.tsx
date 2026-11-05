import { AnimatePresence, motion } from 'framer-motion'
import { Backdrop } from './art/Backdrop'
import { FxLayer } from './components/FxLayer'
import { SoundToggle } from './components/SoundToggle'
import { useGame, type Screen } from './state/game'
import { Intro } from './screens/Intro'
import { Briefing } from './screens/Briefing'
import { Mission1Booking } from './screens/Mission1Booking'
import { Mission2Loading } from './screens/Mission2Loading'
import { Mission3Crisis } from './screens/Mission3Crisis'
import { Mission4Money } from './screens/Mission4Money'
import { MissionOutro } from './screens/MissionOutro'
import { Result } from './screens/Result'
import { RealFacts } from './screens/RealFacts'

function renderScreen(s: Screen) {
  switch (s) {
    case 'intro':
      return <Intro />
    case 'briefing':
      return <Briefing />
    case 'm1':
      return <Mission1Booking />
    case 'm2':
      return <Mission2Loading />
    case 'm3':
      return <Mission3Crisis />
    case 'm4':
      return <Mission4Money />
    case 'o1':
      return <MissionOutro n={1} />
    case 'o2':
      return <MissionOutro n={2} />
    case 'o3':
      return <MissionOutro n={3} />
    case 'o4':
      return <MissionOutro n={4} />
    case 'result':
      return <Result />
    case 'facts':
      return <RealFacts />
  }
}

export default function App() {
  const { screen, round } = useGame()
  const horizon = screen === 'intro' ? 62 : screen === 'm2' ? 82 : 70
  return (
    <div className="app-h relative mx-auto w-full max-w-[480px] overflow-hidden bg-night-900 shadow-[0_0_80px_rgba(0,0,0,.6)]">
      <Backdrop horizon={horizon} stormy={screen === 'm3'} showSkyline={screen !== 'm2'} showMoon={screen === 'intro'} />
      {screen !== 'intro' && <div className="pointer-events-none absolute inset-0 bg-night-950/35" />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={`${screen}-${round}`}
          className="absolute inset-0 flex flex-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {renderScreen(screen)}
        </motion.main>
      </AnimatePresence>
      <div className="absolute right-3 z-30" style={{ top: 'max(12px, env(safe-area-inset-top))' }}>
        <SoundToggle />
      </div>
      <FxLayer />
    </div>
  )
}
