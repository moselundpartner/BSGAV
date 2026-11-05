#!/usr/bin/env node
/**
 * Erzeugt einen druckfähigen QR-Code (PNG + SVG) für das Aufstellschild.
 *
 *   npm run qr -- https://hafen-mission.vercel.app
 *   npm run qr -- https://hafen-mission.vercel.app mein-schild.png
 *
 * PNG: 4096 × 4096 px (bei 300 dpi ≈ 35 cm Kantenlänge – beliebig verkleinerbar)
 * SVG: Vektor, verlustfrei skalierbar für die Druckerei
 * Fehlerkorrektur "H" (30 %) – liest sich auch bei Knicken, Spiegelungen oder Glanzfolie.
 */
import QRCode from 'qrcode'
import { writeFile } from 'node:fs/promises'

const [, , url, outArg] = process.argv

if (!url || !/^https?:\/\//i.test(url)) {
  console.error('❌ Bitte eine vollständige URL angeben, z. B.:\n   npm run qr -- https://hafen-mission.vercel.app')
  process.exit(1)
}

const out = outArg ?? 'qr-hafen-mission.png'
const svgOut = out.replace(/\.png$/i, '') + '.svg'

const opts = {
  errorCorrectionLevel: 'H',
  margin: 4, // "Ruhezone" – nötig, damit Scanner den Code finden
  color: { dark: '#061226', light: '#FFFFFF' },
}

await QRCode.toFile(out, url, { ...opts, type: 'png', width: 4096 })
await writeFile(svgOut, await QRCode.toString(url, { ...opts, type: 'svg' }))

console.log(`✅ QR-Code erstellt für: ${url}`)
console.log(`   PNG (4096 px): ${out}`)
console.log(`   SVG (Vektor):  ${svgOut}`)
console.log('   Tipp: Druck mindestens 5 × 5 cm groß, besser 10 × 10 cm. Vorher mit 2–3 Handys testen!')
