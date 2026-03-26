import { useState, useEffect } from 'react';
import logoDark from './assets/Logo-Dark.png';
import logoLight from './assets/Logo-Light.png';
import { useCalculator } from './hooks/useCalculator';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { StationSelector } from './components/StationSelector';
import { STATION_MODELS } from './types';

export default function App() {
  const { inputs, outputs, updateInput, resetInputs } = useCalculator();

  const [isDark, setIsDark] = useState<boolean>(
    () => localStorage.getItem('theme') !== 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 flex items-center justify-between">
          <div className="flex items-center">
            <img src={isDark ? logoDark : logoLight} alt="Voozaa" className="h-12 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-400 hidden md:block dark:text-zinc-500">
              {outputs.totalStations} Station(en) · €{outputs.machineCost.toLocaleString('de-DE')} Maschinen
            </div>

            {/* Theme toggle button */}
            <button
              type="button"
              onClick={() => setIsDark(prev => !prev)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700 transition-all duration-150 cursor-pointer"
              aria-label={isDark ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
            >
              {isDark ? (
                /* Sun icon — shown in dark mode to switch to light */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Moon icon — shown in light mode to switch to dark */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Top: Station selector — full width, 4 cards in a row */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="uppercase text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500">Stationen</p>
            {outputs.machineCost > 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Maschinenkosten:{' '}
                <span className="text-zinc-700 font-medium dark:text-zinc-300">
                  €{outputs.machineCost.toLocaleString('de-DE')}
                </span>
                {' '}·{' '}
                <span className="text-zinc-400 dark:text-zinc-500">
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
      <footer className="border-t border-gray-200 mt-12 py-4 text-center dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">Voozaa Investitionsrechner — Reverse-Engineered Model</p>
      </footer>
    </div>
  );
}
