# ⚓ Hafen-Mission

Ein kurzes Browser-Lernspiel (3–5 Minuten) zum Ausbildungsberuf **Schifffahrtskaufmann/-frau**,
gemacht für Neuntklässler am Infostand. Spieler scannen einen QR-Code und spielen direkt auf dem
eigenen Handy: ohne Installation, ohne Login, ohne Tracking.

## Ablauf

| Screen | Inhalt |
|---|---|
| Intro | Schiff läuft in Bremerhaven ein, Spitzname wählen (oder 🎲) |
| Briefing | Kim, die Ausbilderin, erklärt Reederei & Fracht |
| Mission 1 – Die Buchung | 3 Kundenaufträge: passendes Schiff wählen, dann Route auf der Weltkarte |
| Mission 2 – Das Beladen | 8 Container in 45 s stapeln: schwer nach unten, Krängung im Blick |
| Mission 3 – Die Krise | Sturm, Streik oder Kanalsperre: in 15 s entscheiden, Folgen sehen |
| Mission 4 – Das Geld | 2 Rechenaufgaben (Grundrechenarten, Multiple Choice) |
| Auswertung | Punkte, Rang (Deckshand → Kapitän des Büros), lokale Bestenliste |
| „Das war echt!“ | 4 Wischkarten zur Ausbildung + Kontaktkarte |

Nach jeder Mission folgt ein Satz „Im echten Beruf heißt das: …“.

## ✏️ Platzhalter ausfüllen (wichtig vor dem Infotag!)

Alle Angaben für euren Stand stehen in **`src/content/config.ts`**:

```ts
export const INFO = {
  schoolName: '[SCHULNAME]',
  trainingPay: '[AUSBILDUNGSVERGÜTUNG]',
  contact: '[KONTAKT]',
  contactPerson: '[ANSPRECHPARTNER]',
  website: '[WEBSITE]',
}
```

Ersetzt die Texte in eckigen Klammern durch eure echten Angaben. Danach neu deployen.
Alle Euro-Beträge im Spiel (Mission 3 & 4) sind als Beispielwerte gekennzeichnet.

## Lokal starten

```bash
npm install
npm run dev        # Entwicklungsserver (auch im WLAN erreichbar: --host)
npm run build      # Produktions-Build nach dist/
npm run preview    # Build lokal ansehen
```

## Technik

- Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion
- Alle Grafiken sind eigene Inline-SVGs bzw. CSS, keine Bilddateien, keine Webfonts, keine externen Aufrufe
- Bundle: ca. 125 KB gzip (JS + CSS). Spielbereit nach ca. 0,5 s auf 4G und ca. 1,1 s auf „Slow 4G“
- Sound wird per WebAudio erzeugt (standardmäßig **aus**, Umschalter oben rechts)
- Vibration über `navigator.vibrate` (Android; iOS ignoriert das)
- Querformat → Hinweis „Dreh dein Handy“, Timer pausieren dabei und im Hintergrund

## Datenschutz

- Keine Cookies, kein Tracking, keine Analytics, keine externen Requests
- Gespeichert wird nur **lokal im Browser** (localStorage): Spitzname, Bestenliste, Ton an/aus
- Nichts verlässt das Handy

## Struktur

```
src/
├─ App.tsx                 Screen-Wechsel + Hintergrund
├─ state/game.tsx          Spielstand, Ablauf, Ränge
├─ content/                ← Texte & Daten (Platzhalter, Aufträge, Krisen, Rechenaufgaben)
├─ art/                    SVG-Illustrationen (Schiffe, Weltkarte, Hafen, Wasser, Avatar)
├─ components/             UI-Bausteine (Buttons, Timer, Effekte, Glossar …)
├─ screens/                Intro, Briefing, Missionen 1–4, Zwischenscreens, Auswertung, Infos
└─ lib/                    Sound, Vibration, localStorage, Hooks
scripts/make-qr.mjs        QR-Code-Generator fürs Aufstellschild
```

Deployment & QR-Code: siehe **[DEPLOY.md](DEPLOY.md)**.
