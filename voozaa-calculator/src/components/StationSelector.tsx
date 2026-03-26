import { useState } from 'react';
import type { CalculatorInputs } from '../types';
import { STATION_MODELS } from '../types';
import img8S  from '../assets/8-S.png';
import img12M from '../assets/12-M.png';
import img24L from '../assets/24-L.png';
import img48XL from '../assets/48-XL.png';

const MODEL_IMAGES: Record<string, string> = {
  M:   img8S,
  L:   img12M,
  LWP: img24L,
  XL:  img48XL,
};

interface StationSelectorProps {
  inputs: Pick<CalculatorInputs, 'qty_M' | 'qty_L' | 'qty_LWP' | 'qty_XL'>;
  onChange: (key: keyof CalculatorInputs, value: number) => void;
}

function QtyInput({ qty, onChange }: { qty: number; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState<string | null>(null);

  const handleFocus = () => setRaw(String(qty));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setRaw(e.target.value);

  const commit = () => {
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) onChange(Math.max(0, parsed));
      setRaw(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commit();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setRaw(null);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={raw !== null ? raw : String(qty)}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className="w-full text-center text-lg font-semibold text-[#C2410C] dark:text-amber-400 tabular-nums bg-transparent border-none outline-none focus:outline-none focus:ring-0 cursor-text"
    />
  );
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
                ? 'border-[#F59E0B] dark:border-amber-500/50 bg-[#FFF7ED] dark:bg-amber-500/5 shadow-sm shadow-orange-200/50 dark:shadow-amber-500/10'
                : 'border-[#0F0F0F] dark:border-zinc-800 bg-[#F0F0EE] dark:bg-zinc-900'
            }`}
          >
            {/* Station image */}
            <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-50 dark:from-amber-500/20 dark:via-zinc-800 dark:to-zinc-800'
                : 'bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 dark:from-zinc-700/50 dark:via-zinc-800/80 dark:to-zinc-800/80'
            }`}>
              <img
                src={MODEL_IMAGES[model.id]}
                alt={model.label}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Model info */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {model.label}
              </span>
              <span className="text-sm font-semibold text-[#C2410C] dark:text-amber-400">
                €{model.price.toLocaleString('de-DE')}
              </span>
            </div>

            {/* Quantity stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange(model.key, Math.max(0, qty - 1))}
                disabled={qty === 0}
                className={`w-9 h-9 flex items-center justify-center rounded-lg bg-[#FFF7ED] dark:bg-zinc-800 border border-[#FB923C] dark:border-zinc-700 text-black dark:text-zinc-300 hover:bg-orange-100 dark:hover:bg-zinc-700 transition-all duration-150 select-none ${
                  qty === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
                aria-label={`Decrease ${model.label} quantity`}
              >
                <span className="text-base leading-none">−</span>
              </button>

              <div className="flex-1 flex items-center justify-center min-w-[2rem]">
                <QtyInput qty={qty} onChange={(v) => onChange(model.key, v)} />
              </div>

              <button
                type="button"
                onClick={() => onChange(model.key, qty + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FFF7ED] dark:bg-zinc-800 border border-[#FB923C] dark:border-zinc-700 text-black dark:text-zinc-300 hover:bg-orange-100 dark:hover:bg-zinc-700 transition-all duration-150 cursor-pointer select-none"
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
