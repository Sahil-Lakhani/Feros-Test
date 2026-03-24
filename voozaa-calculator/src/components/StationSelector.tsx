import type { CalculatorInputs } from '../types';
import { STATION_MODELS } from '../types';

interface StationSelectorProps {
  inputs: Pick<CalculatorInputs, 'qty_M' | 'qty_L' | 'qty_LWP' | 'qty_XL'>;
  onChange: (key: keyof CalculatorInputs, value: number) => void;
}

export function StationSelector({ inputs, onChange }: StationSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATION_MODELS.map((model) => {
        const qty = inputs[model.key];
        const isActive = qty > 0;

        return (
          <div
            key={model.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 transition-all duration-150 ${
              isActive
                ? 'border-amber-500/50 bg-amber-500/5 shadow-sm shadow-amber-500/10'
                : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            {/* Placeholder image */}
            <div className={`w-full aspect-[4/3] rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${
              isActive ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-zinc-800/60 border border-zinc-700/50'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className={`w-7 h-7 transition-colors duration-150 ${isActive ? 'text-amber-400/70' : 'text-zinc-600'}`}>
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <rect x="8" y="5" width="8" height="5" rx="1" />
                <circle cx="12" cy="15" r="1.5" />
                <path d="M10 18h4" />
              </svg>
              <span className={`text-[10px] font-medium transition-colors duration-150 ${isActive ? 'text-amber-400/60' : 'text-zinc-600'}`}>
                {model.capacity} Slots
              </span>
            </div>

            {/* Model info */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-zinc-100">
                {model.label}
              </span>
              <span className="text-xs text-zinc-400">
                {model.capacity} PBs
              </span>
              <span className="text-sm font-semibold text-amber-400">
                €{model.price.toLocaleString('de-DE')}
              </span>
            </div>

            {/* Quantity stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange(model.key, Math.max(0, qty - 1))}
                disabled={qty === 0}
                className={`w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all duration-150 select-none ${
                  qty === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
                aria-label={`Decrease ${model.label} quantity`}
              >
                <span className="text-base leading-none">−</span>
              </button>

              <div className="flex-1 flex items-center justify-center min-w-[2rem]">
                <span className="text-lg font-semibold text-amber-400 tabular-nums">
                  {qty}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onChange(model.key, qty + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all duration-150 cursor-pointer select-none"
                aria-label={`Increase ${model.label} quantity`}
              >
                <span className="text-base leading-none">+</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
