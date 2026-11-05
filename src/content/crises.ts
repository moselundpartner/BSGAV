import type { GlossaryKey } from './config'

export type Mood = '😡' | '😠' | '😐' | '🙂' | '😃'

export interface CrisisOption {
  id: string
  label: string
  emoji: string
  cost: number
  delay: number
  mood: Mood
  points: number
  why: string
  term?: GlossaryKey
}

export interface Crisis {
  id: 'storm' | 'strike' | 'canal'
  title: string
  text: string
  options: CrisisOption[]
}

// Alle Euro-Beträge sind ausgedachte Beispielwerte zum Vergleichen.
export const CRISES: Crisis[] = [
  {
    id: 'storm',
    title: 'Orkan in der Biskaya!',
    text: 'Auf deiner Route toben Wellen bis 12 m hoch. Dein Schiff ist voll beladen.',
    options: [
      {
        id: 'through',
        emoji: '🌊',
        label: 'Volle Fahrt durch den Sturm',
        cost: 80000,
        delay: 0,
        mood: '😡',
        points: 40,
        why: 'Gefährlich! Bei so einem Sturm können Container über Bord gehen – und die Crew gerät in Gefahr.',
      },
      {
        id: 'wait-inform',
        emoji: '📞',
        label: 'Im sicheren Hafen abwarten & Kunden anrufen',
        cost: 15000,
        delay: 2,
        mood: '🙂',
        points: 300,
        why: 'Sicherheit geht vor! Und weil der Kunde Bescheid weiß, kann er seine Planung anpassen.',
      },
      {
        id: 'wait-silent',
        emoji: '🤐',
        label: 'Abwarten, dem Kunden aber nichts sagen',
        cost: 15000,
        delay: 2,
        mood: '😠',
        points: 120,
        why: 'Sicher – aber der Kunde wartet ahnungslos auf seine Ware und ist ziemlich sauer.',
      },
    ],
  },
  {
    id: 'strike',
    title: 'Streik im Zielhafen!',
    text: 'Die Hafenarbeiter streiken. Niemand entlädt dein Schiff.',
    options: [
      {
        id: 'wait',
        emoji: '⏳',
        label: 'Vor dem Hafen warten, bis der Streik vorbei ist',
        cost: 60000,
        delay: 6,
        mood: '😐',
        points: 120,
        term: 'liegegeld',
        why: 'Jeder Tag Warten kostet Liegegeld – und keiner weiß, wie lange der Streik dauert.',
      },
      {
        id: 'other-port',
        emoji: '📞',
        label: 'Nachbarhafen anlaufen & Kunden informieren',
        cost: 20000,
        delay: 1,
        mood: '🙂',
        points: 300,
        why: 'Clever! Vom Nachbarhafen geht die Ware per Lkw oder Bahn weiter – und der Kunde ist im Bilde.',
      },
      {
        id: 'back',
        emoji: '↩️',
        label: 'Umdrehen und zurück nach Bremerhaven',
        cost: 150000,
        delay: 20,
        mood: '😡',
        points: 20,
        why: 'Viel zu teuer – und die Ware käme Wochen zu spät beim Kunden an.',
      },
    ],
  },
  {
    id: 'canal',
    title: 'Kanal gesperrt!',
    text: 'Im Suezkanal steckt ein riesiges Schiff quer. Nichts geht mehr – viele Schiffe stauen sich.',
    options: [
      {
        id: 'wait',
        emoji: '⏳',
        label: 'Einfach warten, bis der Kanal frei ist',
        cost: 30000,
        delay: 6,
        mood: '😠',
        points: 120,
        why: 'Kann klappen – aber niemand weiß, wie lange. Und der Kunde erfährt nichts.',
      },
      {
        id: 'cape',
        emoji: '🧭',
        label: 'Umleiten ums Kap der Guten Hoffnung & Kunden informieren',
        cost: 90000,
        delay: 10,
        mood: '🙂',
        points: 300,
        why: 'Länger und teurer, aber planbar – und der Kunde weiß Bescheid.',
      },
      {
        id: 'wait-inform',
        emoji: '📞',
        label: 'Warten & Kunden sofort informieren',
        cost: 30000,
        delay: 6,
        mood: '🙂',
        points: 260,
        why: 'Gute Idee! Der Kunde kann planen. Ein Risiko bleibt: Niemand weiß, wie lange die Sperre dauert.',
      },
    ],
  },
]

export const CRISIS_TIME = 15
export const SPEED_BONUS_PER_SEC = 10
