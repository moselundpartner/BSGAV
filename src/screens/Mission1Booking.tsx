import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { SHIP_ART, SHIP_INFO, type ShipType } from '../art/Ships'
import { WorldMap, type MapRoute } from '../art/WorldMap'
import { FeedbackSheet } from '../components/FeedbackSheet'
import { MissionHeader } from '../components/MissionHeader'
import { MissionTitle } from '../components/MissionTitle'
import { TermCard } from '../components/Term'
import { ORDERS, ROUTE_COLORS, ROUTE_POINTS, SHIP_POINTS, type Order, type RouteOption } from '../content/orders'
import { confettiAt, pointsAt } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { usePhase, useShake } from '../lib/hooks'
import { shuffle } from '../lib/random'
import { sfx } from '../lib/sound'
import { useGame } from '../state/game'

type Phase = 'title' | 'ship' | 'shipFb' | 'route' | 'sailing' | 'routeFb'

const SHIP_ORDER: ShipType[] = ['container', 'bulk', 'roro', 'heavy']

function pickOrders(): Order[] {
  // 3 Aufträge, höchstens einer davon fürs Containerschiff → mehr Abwechslung
  const list = shuffle(ORDERS)
  const out: Order[] = []
  let containerUsed = false
  for (const o of list) {
    if (o.ship === 'container') {
      if (containerUsed) continue
      containerUsed = true
    }
    out.push(o)
    if (out.length === 3) break
  }
  return out
}

export function Mission1Booking() {
  const { addScore, next } = useGame()
  const orders = useMemo(pickOrders, [])
  const routeOrder = useMemo(() => orders.map((o) => shuffle(o.routes)), [orders])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase, phaseRef] = usePhase<Phase>('title')
  const [ship, setShip] = useState<ShipType | null>(null)
  const [route, setRoute] = useState<RouteOption | null>(null)
  const [gridCtl, shakeGrid] = useShake()

  const order = orders[idx]
  const routes = routeOrder[idx]
  const shipOk = ship === order.ship

  const mapRoutes: MapRoute[] = useMemo(
    () => routes.map((r, i) => ({ id: r.id, points: r.points, color: ROUTE_COLORS[i] })),
    [routes],
  )

  const onTitleDone = useCallback(() => setPhase((p) => (p === 'title' ? 'ship' : p)), [setPhase])

  const chooseShip = (t: ShipType, el: HTMLElement) => {
    if (phaseRef.current !== 'ship') return
    setPhase('shipFb')
    setShip(t)
    if (t === order.ship) {
      sfx.ok()
      haptic.ok()
      confettiAt(el, 50)
      pointsAt(el, SHIP_POINTS)
      addScore(0, SHIP_POINTS)
    } else {
      sfx.bad()
      haptic.bad()
      shakeGrid()
    }
  }

  const chooseRoute = (r: RouteOption, el: HTMLElement) => {
    if (phaseRef.current !== 'route') return
    setPhase('sailing')
    setRoute(r)
    sfx.horn()
    // Punkte erst nach der Fahrt
    window.setTimeout(() => {
      const pts = ROUTE_POINTS[r.quality]
      if (r.quality === 'best') {
        sfx.ok()
        haptic.ok()
        confettiAt(el, 70)
      } else if (r.quality === 'bad') {
        sfx.bad()
        haptic.bad()
      } else {
        sfx.coin()
        haptic.tap()
      }
      if (pts) {
        pointsAt(el, pts)
        addScore(0, pts)
      }
    }, 2300)
  }

  const nextOrder = () => {
    if (phaseRef.current !== 'routeFb') return
    if (idx < orders.length - 1) {
      setIdx(idx + 1)
      setShip(null)
      setRoute(null)
      setPhase('ship')
    } else {
      next()
    }
  }

  const routeTone = route?.quality === 'best' ? 'ok' : route?.quality === 'ok' ? 'meh' : 'bad'
  const routeTitle =
    route?.quality === 'best' ? `Top-Route! +${ROUTE_POINTS.best}` : route?.quality === 'ok' ? `Geht – aber nicht optimal. +${ROUTE_POINTS.ok}` : 'Umweg-Alarm! +0'

  const inRoute = phase === 'route' || phase === 'sailing' || phase === 'routeFb'

  return (
    <div className="relative flex h-full flex-col">
      <MissionHeader n={1} title="Die Buchung" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {/* Auftrag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={order.id}
            className="glass-strong mt-1 rounded-3xl p-3.5"
            initial={{ opacity: 0, y: -20, rotateX: 40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-signal/30 to-gold/10 text-3xl">
                {order.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wider text-signal">
                  📨 Auftrag {idx + 1}/{orders.length}
                  <span className="flex gap-1">
                    {orders.map((_, i) => (
                      <span key={i} className={`h-1.5 w-4 rounded-full ${i < idx ? 'bg-ok' : i === idx ? 'bg-signal' : 'bg-white/15'}`} />
                    ))}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-ink/70">{order.customer} braucht einen Transport:</div>
              </div>
            </div>
            <div className="mt-2 text-[20px] font-black leading-tight">{order.amount}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[15px] font-bold">
              <span className="rounded-lg bg-signal/20 px-2 py-0.5 text-signal-light">{order.from.name}</span>
              <span className="text-ink/60">→</span>
              <span className="rounded-lg bg-ok/15 px-2 py-0.5 text-ok">{order.to.name}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!inRoute ? (
            <motion.section key={`ship-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="mb-2 mt-4 text-[19px] font-black">
                <span className="text-signal">1.</span> Welches Schiff passt?
              </h2>
              <motion.div animate={gridCtl} className="grid grid-cols-2 gap-2.5">
                {SHIP_ORDER.map((t, i) => {
                  const Art = SHIP_ART[t]
                  const info = SHIP_INFO[t]
                  const reveal = phase === 'shipFb'
                  const state = reveal ? (t === order.ship ? 'right' : t === ship ? 'wrong' : 'dim') : 'idle'
                  return (
                    <motion.button
                      key={t}
                      type="button"
                      onClick={(e) => chooseShip(t, e.currentTarget)}
                      disabled={phase !== 'ship'}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: state === 'dim' ? 0.45 : 1, scale: state === 'right' ? 1.03 : 1 }}
                      transition={{ delay: phase === 'ship' ? i * 0.06 : 0, type: 'spring', stiffness: 300, damping: 20 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex min-h-[132px] flex-col items-center overflow-hidden rounded-2xl border-2 p-2 text-center transition-colors ${
                        state === 'right'
                          ? 'border-ok bg-ok/15'
                          : state === 'wrong'
                            ? 'border-bad bg-bad/15'
                            : 'border-petrol-400/30 bg-night-800/70 active:border-signal'
                      }`}
                    >
                      <div className="relative h-[58px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-night-700 to-petrol-700">
                        <div className="bob absolute inset-x-1 bottom-0" style={{ animationDelay: `${i * 0.4}s` }}>
                          <Art className="w-full" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-petrol-600/80" />
                      </div>
                      <div className="mt-1.5 text-[15px] font-black leading-tight">{info.name}</div>
                      <div className="text-[12px] font-medium leading-tight text-ink/65">{info.short}</div>
                      {state === 'right' && <span className="absolute right-1.5 top-1.5 text-xl">✅</span>}
                      {state === 'wrong' && <span className="absolute right-1.5 top-1.5 text-xl">❌</span>}
                    </motion.button>
                  )
                })}
              </motion.div>
              {order.term && idx === orders.findIndex((o) => o.term === order.term) && <TermCard k={order.term} className="mt-3" />}
            </motion.section>
          ) : (
            <motion.section key={`route-${idx}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="mb-2 mt-4 text-[19px] font-black">
                <span className="text-signal">2.</span> Welche Route nimmst du?
              </h2>
              <div className="overflow-hidden rounded-2xl border border-petrol-400/30 shadow-card">
                <WorldMap
                  routes={mapRoutes}
                  ports={[
                    { name: order.from.name, at: order.from.at, kind: 'home' },
                    { name: order.to.name, at: order.to.at, kind: 'dest' },
                  ]}
                  selected={route?.id}
                  sailing={phase === 'sailing' || phase === 'routeFb' ? route?.id : null}
                  sailMs={2200}
                  dimOthers
                  onSailEnd={() => setPhase((p) => (p === 'sailing' ? 'routeFb' : p))}
                />
              </div>
              <div className="mt-3 space-y-2.5">
                {routes.map((r, i) => {
                  const sel = route?.id === r.id
                  return (
                    <motion.button
                      key={r.id}
                      type="button"
                      disabled={phase !== 'route'}
                      onClick={(e) => chooseRoute(r, e.currentTarget)}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: route && !sel ? 0.4 : 1, y: 0 }}
                      transition={{ delay: phase === 'route' ? 0.15 + i * 0.08 : 0 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex min-h-[62px] w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-2 text-left ${
                        sel ? 'border-gold bg-gold/10' : 'border-petrol-400/30 bg-night-800/70'
                      }`}
                    >
                      <span className="h-8 w-2 shrink-0 rounded-full" style={{ background: ROUTE_COLORS[i], boxShadow: `0 0 12px ${ROUTE_COLORS[i]}` }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-black leading-tight">{r.label}</span>
                        <span className="block text-[14px] font-semibold text-ink/65">{r.days}</span>
                      </span>
                      <span className="text-xl" aria-hidden>
                        {sel ? '🚢' : '›'}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <FeedbackSheet
        open={phase === 'shipFb'}
        tone={shipOk ? 'ok' : 'bad'}
        title={shipOk ? `Perfekt! +${SHIP_POINTS}` : `Besser wäre: ${SHIP_INFO[order.ship].name}`}
        onContinue={() => setPhase((p) => (p === 'shipFb' ? 'route' : p))}
        autoMs={4200}
        cta="Zur Route"
      >
        {order.shipWhy}
      </FeedbackSheet>

      <FeedbackSheet open={phase === 'routeFb'} tone={routeTone} title={routeTitle} onContinue={nextOrder} autoMs={3600} cta={idx < orders.length - 1 ? 'Nächster Auftrag' : 'Mission abschließen'}>
        {route?.why}
      </FeedbackSheet>

      <MissionTitle show={phase === 'title'} n={1} title="Die Buchung" sub="Finde für jede Ladung das passende Schiff und den besten Weg." emoji="📋" onDone={onTitleDone} />
    </div>
  )
}
