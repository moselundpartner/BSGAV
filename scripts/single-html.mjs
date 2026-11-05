#!/usr/bin/env node
/**
 * Baut aus dist/ eine einzige, eigenständige HTML-Datei (JS, CSS, Favicon inline).
 *   npm run build && npm run single
 * Ergebnis: deploy/index.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
let html = await readFile(new URL('index.html', dist), 'utf8')

// CSS inline
for (const m of [...html.matchAll(/<link rel="stylesheet"[^>]*href="\/([^"]+)"[^>]*>/g)]) {
  const css = await readFile(new URL(m[1], dist), 'utf8')
  html = html.replace(m[0], () => `<style>${css}</style>`)
}
// JS inline (als Modul, ans Ende des body, damit #root existiert)
for (const m of [...html.matchAll(/<script type="module" crossorigin src="\/([^"]+)"><\/script>/g)]) {
  const js = (await readFile(new URL(m[1], dist), 'utf8')).replace(/<\/script/gi, '<\\/script')
  html = html.replace(m[0], '')
  html = html.replace('</body>', () => `<script type="module">${js}</script>\n</body>`)
}
// Favicon als Data-URI
const svg = await readFile(new URL('favicon.svg', dist), 'utf8')
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(svg)}"`)

await mkdir(new URL('../deploy/', import.meta.url), { recursive: true })
await writeFile(new URL('../deploy/index.html', import.meta.url), html)
console.log(`✅ deploy/index.html (${(html.length / 1024).toFixed(0)} KB, alles in einer Datei)`)
