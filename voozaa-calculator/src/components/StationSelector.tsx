import type { CalculatorInputs } from '../types';
import { STATION_MODELS } from '../types';

interface StationSelectorProps {
  inputs: Pick<CalculatorInputs, 'qty_M' | 'qty_L' | 'qty_LWP' | 'qty_XL'>;
  onChange: (key: keyof CalculatorInputs, value: number) => void;
}

export function StationSelector({ inputs, onChange }: StationSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
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
