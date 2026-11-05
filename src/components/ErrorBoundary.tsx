import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  componentDidCatch(err: unknown) {
    console.error(err)
  }
  render() {
    if (this.state.error)
      return (
        <div className="flex h-full flex-col items-center justify-center gap-5 bg-night-900 p-8 text-center">
          <div className="text-6xl">🌊</div>
          <div className="text-2xl font-black">Huch, eine Monsterwelle!</div>
          <p className="text-ink/80">Da ist etwas schiefgelaufen. Starte einfach neu.</p>
          <button className="min-h-[56px] rounded-2xl bg-signal px-8 text-lg font-extrabold text-night-900" onClick={() => window.location.reload()}>
            Neu starten
          </button>
        </div>
      )
    return this.props.children
  }
}
