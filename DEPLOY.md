# 🚀 Deployment auf Vercel + QR-Code fürs Schild

## Variante A: Über die Vercel-Website (empfohlen, ohne Kommandozeile)

1. Auf <https://vercel.com> mit dem GitHub-Account anmelden (kostenloser „Hobby“-Plan reicht).
2. **Add New… → Project** wählen und das Repository `bsgav` importieren.
3. Vercel erkennt **Vite** automatisch. Die Einstellungen stehen außerdem in `vercel.json`:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Optional unter **Project Name** einen sprechenden Namen eintragen, z. B. `hafen-mission`.
   Daraus wird die URL `https://hafen-mission.vercel.app` (falls noch frei).
5. **Deploy** klicken. Nach ca. 1 Minute ist das Spiel online.
6. Ab jetzt wird jeder Push auf den Haupt-Branch automatisch neu veröffentlicht.

> ⚠️ **Vor dem Infotag:** In Vercel unter *Settings → Deployment Protection* prüfen, dass
> **Vercel Authentication für Production ausgeschaltet** ist. Sonst sehen die Schüler eine Login-Seite.

## Variante B: Mit der Vercel-CLI

```bash
npm install
npm i -g vercel
vercel login
vercel          # erste Vorschau, Fragen mit Enter bestätigen
vercel --prod   # Live-Version veröffentlichen
```

## QR-Code erzeugen

Sobald die finale URL feststeht:

```bash
npm install
npm run qr -- https://hafen-mission.vercel.app
```

Das Skript erzeugt im Projektordner:

- `qr-hafen-mission.png`: 4096 × 4096 px, für jedes Druckformat scharf genug
- `qr-hafen-mission.svg`: Vektorversion für die Druckerei

Eigener Dateiname: `npm run qr -- https://… schild.png`

**Drucktipps**
- Mindestens 5 × 5 cm groß drucken, für ein Aufstellschild besser 10–15 cm
- Den weißen Rand um den Code nicht abschneiden (der Scanner braucht ihn)
- Vor dem Druck mit 2–3 verschiedenen Handys (iPhone + Android) testen
- Kurze URL zusätzlich als Text unter den Code schreiben, falls eine Kamera streikt

## Checkliste vor dem Infotag

- [x] Angaben in `src/content/config.ts` ausgefüllt (Schule, Vergütung, Ansprechpartnerinnen, Website)
- [ ] Spiel einmal komplett auf einem iPhone (Safari) und einem Android-Handy (Chrome) durchgespielt
- [ ] Deployment Protection für Production aus
- [ ] QR-Code mit der **finalen** URL erzeugt und getestet
- [ ] Optional: Schul-WLAN vorab testen (die Seite ist ca. 125 KB groß)
