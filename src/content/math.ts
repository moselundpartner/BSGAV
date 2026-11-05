import type { GlossaryKey } from './config'

export interface MathTask {
  id: string
  text: string
  visual: string
  hint: string
  options: string[] // options[0] ist richtig
  explain: string
  term?: GlossaryKey
}

// Alle Beträge sind ausgedachte Rechenbeispiele.
export const TASKS_RATE: MathTask[] = [
  {
    id: 'rate',
    text: 'Ein Kunde verschifft 12 Container. Die Fracht kostet 900 € pro Container. Wie viel zahlt der Kunde insgesamt?',
    visual: '📦 × 12   ·   900 € pro Stück',
    hint: 'Anzahl × Preis pro Container',
    options: ['10.800 €', '9.000 €', '1.080 €', '12.900 €'],
    explain: '12 × 900 € = 10.800 €. So berechnest du die Frachtrate für den ganzen Auftrag.',
  },
  {
    id: 'teu',
    text: 'Ein 40-Fuß-Container zählt als 2 TEU. Das Schiff lädt 15 solche Container. Wie viele TEU sind das?',
    visual: '📦📦 = 2 TEU   ·   15 Stück',
    hint: 'Anzahl × 2',
    options: ['30 TEU', '15 TEU', '17 TEU', '60 TEU'],
    explain: '15 × 2 = 30 TEU. In TEU misst man, wie viel ein Containerschiff laden kann.',
    term: 'teu',
  },
  {
    id: 'demurrage',
    text: 'Dein Schiff liegt 3 Tage länger im Hafen. Jeder Tag kostet 4.000 € Liegegeld. Wie hoch sind die Mehrkosten?',
    visual: '📅 × 3   ·   4.000 € pro Tag',
    hint: 'Tage × Kosten pro Tag',
    options: ['12.000 €', '7.000 €', '4.003 €', '1.333 €'],
    explain: '3 × 4.000 € = 12.000 €. Deshalb lohnt es sich, Wartezeiten clever zu vermeiden.',
    term: 'liegegeld',
  },
]

export const TASKS_OFFER: MathTask[] = [
  {
    id: 'profit',
    text: 'Der Transport kostet eure Reederei 7.500 €. Ihr wollt 2.000 € Gewinn machen. Welchen Preis bietest du dem Kunden an?',
    visual: '💸 Kosten 7.500 €   ·   🎯 Gewinn 2.000 €',
    hint: 'Kosten + Gewinn = Preis',
    options: ['9.500 €', '5.500 €', '7.500 €', '2.000 €'],
    explain: 'Kosten + Gewinn = Preis: 7.500 € + 2.000 € = 9.500 €.',
  },
  {
    id: 'compare',
    text: 'Angebot A: 20 Container × 1.000 €. Angebot B: 18.000 € pauschal für alle. Was ist für den Kunden günstiger?',
    visual: '🅰️ 20 × 1.000 €   ·   🅱️ 18.000 €',
    hint: 'Rechne erst Angebot A aus, dann vergleiche.',
    options: ['B – 2.000 € günstiger', 'A – 2.000 € günstiger', 'Beide gleich teuer', 'B – 200 € günstiger'],
    explain: 'A = 20 × 1.000 € = 20.000 €. B = 18.000 €. B ist also 2.000 € günstiger.',
  },
  {
    id: 'margin',
    text: 'Der Kunde zahlt 12.000 €. Der Treibstoff kostet 5.000 €, die Hafengebühren 3.000 €. Wie viel Gewinn bleibt übrig?',
    visual: '💶 12.000 €   ·   ⛽ −5.000 €   ·   ⚓ −3.000 €',
    hint: 'Einnahmen minus alle Kosten',
    options: ['4.000 €', '7.000 €', '9.000 €', '20.000 €'],
    explain: '12.000 € − 5.000 € − 3.000 € = 4.000 € Gewinn.',
  },
]

export const MATH_TIME = 25
export const MATH_POINTS = 200
export const MATH_BONUS_PER_SEC = 2
