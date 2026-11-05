import type { ShipType } from '../art/Ships'
import type { GlossaryKey } from './config'

type LL = [number, number]

export interface RouteOption {
  id: string
  label: string
  days: string
  quality: 'best' | 'ok' | 'bad'
  why: string
  points: LL[]
}

export interface Order {
  id: string
  emoji: string
  customer: string
  cargo: string
  amount: string
  term?: GlossaryKey
  from: { name: string; at: LL }
  to: { name: string; at: LL }
  ship: ShipType
  shipWhy: string
  routes: RouteOption[]
}

// Gemeinsame Wegstücke
const BHV: LL = [8.6, 53.6]
const BRAKE: LL = [8.5, 53.3]
const CHANNEL: LL[] = [[6, 54], [3, 52.3], [1.5, 51.1], [-1, 50.3], [-5, 49.3]]
const TO_GIBRALTAR: LL[] = [[-9.5, 44], [-10, 38], [-5.6, 35.95]]
const MED_TO_SUEZ: LL[] = [[0, 37], [10, 37.6], [20, 34], [30, 32.5], [32.5, 30.5]]
const RED_SEA: LL[] = [[34, 27.5], [38, 20], [44, 12.3]]
const INDIAN_OCEAN: LL[] = [[52, 12.5], [65, 12], [78, 5.5], [90, 5.8], [95.5, 6.3]]
const MALACCA_TO_SCS: LL[] = [[99, 4.6], [102.5, 1.8], [104, 1], [109.5, 8], [114, 15], [119, 21.5]]
const AROUND_AFRICA_WEST: LL[] = [[-12, 44], [-20, 25], [-20, 10], [-5, -5], [5, -20], [12, -32], [18.5, -36.5], [30, -36]]

const SUEZ_ASIA: LL[] = [...CHANNEL, ...TO_GIBRALTAR, ...MED_TO_SUEZ, ...RED_SEA, ...INDIAN_OCEAN, ...MALACCA_TO_SCS]
const CAPE_ASIA: LL[] = [...CHANNEL, ...AROUND_AFRICA_WEST, [50, -30], [70, -15], [85, 0], [95.5, 6.3], ...MALACCA_TO_SCS]

export const ORDERS: Order[] = [
  {
    id: 'cars',
    emoji: '🚗',
    customer: 'Ein Autohersteller',
    cargo: 'Neuwagen',
    amount: '1.200 Neuwagen',
    from: { name: 'Bremerhaven', at: BHV },
    to: { name: 'Baltimore', at: [-76.4, 39.2] },
    ship: 'roro',
    shipWhy: 'Autos rollen beim Autotransporter einfach über Rampen an Bord. Bremerhaven ist einer der größten Autohäfen Europas.',
    routes: [
      {
        id: 'atl',
        label: 'Direkt über den Atlantik',
        days: '≈ 12 Tage',
        quality: 'best',
        why: 'Kürzester sicherer Weg – spart Zeit und Treibstoff.',
        points: [BHV, ...CHANNEL, [-20, 46], [-45, 42], [-65, 38.5], [-74.5, 37], [-76.4, 39.2]],
      },
      {
        id: 'scot',
        label: 'Nördlich um Schottland',
        days: '≈ 14 Tage',
        quality: 'ok',
        why: 'Geht auch – ist aber ein Umweg von rund zwei Tagen.',
        points: [BHV, [6, 56], [2, 58.5], [-3, 59.6], [-12, 58], [-30, 52], [-50, 44], [-65, 38.5], [-74.5, 37], [-76.4, 39.2]],
      },
    ],
  },
  {
    id: 'coffee',
    emoji: '☕',
    customer: 'Eine Kaffeerösterei in Bremen',
    cargo: 'Kaffeebohnen',
    amount: '40 Container Kaffee',
    term: 'container',
    from: { name: 'Santos', at: [-46.3, -24] },
    to: { name: 'Bremerhaven', at: BHV },
    ship: 'container',
    shipWhy: 'Kaffee reist in Säcken – gut geschützt in Containern. Die passen auf Schiff, Zug und Lkw.',
    routes: [
      {
        id: 'north',
        label: 'Über den Atlantik nach Norden',
        days: '≈ 16 Tage',
        quality: 'best',
        why: 'Der direkte Weg – Brasilien und Europa liegen am selben Ozean.',
        points: [[-46.3, -24], [-41, -23], [-36, -10], [-30, 0], [-22, 15], [-16, 30], [-12, 40], [-7, 47], [-5, 49.3], [-1, 50.3], [1.5, 51.1], [3, 52.3], [6, 54], BHV],
      },
      {
        id: 'suez',
        label: 'Um Afrika & durch den Suezkanal',
        days: '≈ 40 Tage',
        quality: 'bad',
        why: 'Riesenumweg um ganz Afrika! Der Kaffee wäre wochenlang unterwegs.',
        points: [[-46.3, -24], [-30, -30], [0, -36], [18.5, -36.5], [35, -30], [42, -15], [48, 0], [52, 12.5], [44, 12.3], [38, 20], [34, 27.5], [32.5, 30.5], [30, 32.5], [20, 34], [10, 37.6], [0, 37], [-5.6, 35.95], [-10, 38], [-10, 43], [-5, 49.3], [-1, 50.3], [1.5, 51.1], [3, 52.3], [6, 54], BHV],
      },
    ],
  },
  {
    id: 'wind',
    emoji: '🌬️',
    customer: 'Ein Windpark-Bauer',
    cargo: 'Windradflügel',
    amount: '6 Windradflügel (je über 80 m lang)',
    from: { name: 'Bremerhaven', at: BHV },
    to: { name: 'Taiwan', at: [120.3, 24.1] },
    ship: 'heavy',
    shipWhy: 'Ein Windradflügel passt in keinen Container. Das Schwergutschiff hebt ihn mit eigenen Kränen an Bord.',
    routes: [
      {
        id: 'suez',
        label: 'Durch den Suezkanal',
        days: '≈ 32 Tage',
        quality: 'best',
        why: 'Die Abkürzung zwischen Mittelmeer und Rotem Meer spart über 10 Tage.',
        points: [BHV, ...SUEZ_ASIA, [120.3, 24.1]],
      },
      {
        id: 'cape',
        label: 'Ums Kap der Guten Hoffnung',
        days: '≈ 43 Tage',
        quality: 'ok',
        why: 'Möglich, aber über 10 Tage länger – das kostet Treibstoff und Geld.',
        points: [BHV, ...CAPE_ASIA, [120.3, 24.1]],
      },
    ],
  },
  {
    id: 'grain',
    emoji: '🌾',
    customer: 'Ein Getreidehändler',
    cargo: 'Weizen (lose)',
    amount: '50.000 Tonnen Weizen',
    term: 'hafen',
    from: { name: 'Brake (Weser)', at: BRAKE },
    to: { name: 'Alexandria', at: [29.9, 31.4] },
    ship: 'bulk',
    shipWhy: 'Getreide wird lose direkt in die riesigen Laderäume geschüttet. Brake an der Weser ist dafür ein wichtiger Hafen.',
    routes: [
      {
        id: 'gib',
        label: 'Durch die Straße von Gibraltar',
        days: '≈ 12 Tage',
        quality: 'best',
        why: 'Direkt ins Mittelmeer – Ägypten liegt gleich am anderen Ende.',
        points: [BRAKE, ...CHANNEL, ...TO_GIBRALTAR, [0, 37], [10, 37.6], [20, 34], [29.9, 31.4]],
      },
      {
        id: 'africa',
        label: 'Einmal um Afrika herum',
        days: '≈ 38 Tage',
        quality: 'bad',
        why: 'Viel zu weit! Durchs Mittelmeer ist es ein Drittel der Strecke.',
        points: [BRAKE, ...CHANNEL, ...AROUND_AFRICA_WEST, [50, -30], [55, -15], [52, 0], [52, 12.5], [44, 12.3], [38, 20], [34, 27.5], [32.5, 30.5], [29.9, 31.4]],
      },
    ],
  },
  {
    id: 'parts',
    emoji: '⚙️',
    customer: 'Ein Maschinenbauer',
    cargo: 'Autoteile',
    amount: '25 Container Autoteile',
    term: 'container',
    from: { name: 'Bremerhaven', at: BHV },
    to: { name: 'Shanghai', at: [121.9, 31.1] },
    ship: 'container',
    shipWhy: 'Autoteile sind Stückgut – sicher verpackt in Containern.',
    routes: [
      {
        id: 'suez',
        label: 'Durch den Suezkanal',
        days: '≈ 35 Tage',
        quality: 'best',
        why: 'Der kürzeste Weg nach Asien führt durch den Suezkanal.',
        points: [BHV, ...SUEZ_ASIA, [120.3, 24.1], [122, 28], [121.9, 31.1]],
      },
      {
        id: 'cape',
        label: 'Ums Kap der Guten Hoffnung',
        days: '≈ 46 Tage',
        quality: 'ok',
        why: 'Klappt, dauert aber deutlich länger.',
        points: [BHV, ...CAPE_ASIA, [120.3, 24.1], [122, 28], [121.9, 31.1]],
      },
    ],
  },
]

export const ROUTE_COLORS = ['#FFC940', '#4FC3CF']

export const SHIP_POINTS = 150
export const ROUTE_POINTS = { best: 200, ok: 100, bad: 0 } as const
