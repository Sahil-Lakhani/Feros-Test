import { useCalculator } from './hooks/useCalculator';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { StationSelector } from './components/StationSelector';
import { STATION_MODELS } from './types';

export default function App() {
  const { inputs, outputs, updateInput, resetInputs } = useCalculator();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-xs">V</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100">Voozaa Rechner</h1>
              <p className="text-xs text-zinc-500 hidden sm:block">Investitionsrechner</p>
            </div>
          </div>
          <div className="text-xs text-zinc-500 hidden md:block">
            {outputs.totalStations} Station(en) · €{outputs.machineCost.toLocaleString('de-DE')} Maschinen
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Top: Station selector — full width, 4 cards in a row */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="uppercase text-xs font-semibold tracking-widest text-zinc-500">Stationen</p>
            {outputs.machineCost > 0 && (
              <p className="text-xs text-zinc-400">
                Maschinenkosten:{' '}
                <span className="text-zinc-300 font-medium">
                  €{outputs.machineCost.toLocaleString('de-DE')}
                </span>
                {' '}·{' '}
                <span className="text-zinc-500">
                  {STATION_MODELS.filter(m => inputs[m.key] > 0).map(m => `${inputs[m.key]}×${m.id}`).join(', ')}
                </span>
              </p>
            )}
          </div>
          <StationSelector inputs={inputs} onChange={updateInput} />
        </div>

        {/* Bottom: Inputs (left) + Results (right) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Input controls — sticky on desktop */}
          <aside className="w-full lg:w-[380px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-6 lg:pr-3">
              <InputPanel inputs={inputs} onChange={updateInput} onReset={resetInputs} />
            </div>
          </aside>

          {/* Right: Results */}
          <section className="flex-1 min-w-0">
            <ResultsPanel outputs={outputs} inputs={inputs} />
          </section>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 py-4 text-center">
        <p className="text-xs text-zinc-600">Voozaa Investitionsrechner — Reverse-Engineered Model</p>
      </footer>
    </div>
  );
}
