/**
 * ============================================================
 *  HIER ANPASSEN: Platzhalter für euren Infostand
 * ============================================================
 *  Alles in [ECKIGEN KLAMMERN] bitte durch echte Angaben ersetzen.
 *  Keine erfundenen Zahlen oder Firmennamen eintragen!
 */
export const INFO = {
  schoolName: 'BSGAV Bremen',
  trainingPay: '800–1.200 € im Monat',
  /** Telefon oder E-Mail – leer lassen, dann wird die Zeile ausgeblendet */
  contact: '',
  contactPerson: 'Sabine Rohrßen und Nicole Wessels',
  website: 'https://bs-gav.de',
}

/** Glossar: Fachbegriffe, einfach erklärt. */
export const GLOSSARY = {
  reederei: { term: 'Reederei', text: 'Eine Firma, die Schiffe besitzt oder betreibt und damit Waren über das Meer transportiert.' },
  fracht: { term: 'Fracht', text: 'Die Ware, die transportiert wird – und auch der Preis für den Transport.' },
  container: { term: 'Container', text: 'Eine genormte Stahlkiste. Passt auf Schiff, Lkw und Zug – ohne umzupacken.' },
  teu: { term: 'TEU', text: '„Twenty-foot Equivalent Unit“: ein 20-Fuß-Container (ca. 6 m lang). Die Maßeinheit, in der man Containerschiffe misst.' },
  hafen: { term: 'Hafen', text: 'Der Ort, an dem Schiffe be- und entladen werden. Bremerhaven hat einen der größten Containerterminals Europas.' },
  makler: { term: 'Schiffsmakler', text: 'Vermittelt zwischen Kunden mit Ladung und Reedereien mit Schiffen – und kümmert sich um die Abfertigung im Hafen.' },
  kraengung: { term: 'Krängung', text: 'Die seitliche Schieflage eines Schiffs. Zu viel Krängung ist gefährlich.' },
  liegegeld: { term: 'Liegegeld', text: 'Geld, das fällig wird, wenn ein Schiff länger als geplant im Hafen liegt.' },
} as const

export type GlossaryKey = keyof typeof GLOSSARY
