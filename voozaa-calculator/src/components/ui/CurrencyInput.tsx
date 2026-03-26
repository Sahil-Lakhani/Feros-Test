import { useState } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;          // default 0.05
  label?: string;
  helpText?: string;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  min,
  max,
  step = 0.05,
  label,
  helpText,
  className = '',
}: CurrencyInputProps) {
  const [raw, setRaw] = useState<string | null>(null);

  const canDecrement = min === undefined || value - step >= min - 1e-9;
  const canIncrement = max === undefined || value + step <= max + 1e-9;

  const handleDecrement = () => {
    if (!canDecrement) return;
    const next = Math.round((value - step) * 1e9) / 1e9;
    onChange(min !== undefined ? Math.max(min, next) : next);
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    const next = Math.round((value + step) * 1e9) / 1e9;
    onChange(max !== undefined ? Math.min(max, next) : next);
  };

  const handleFocus = () => {
    setRaw(value.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
  };

  const commit = () => {
    if (raw !== null) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        let clamped = parsed;
        if (min !== undefined) clamped = Math.max(min, clamped);
        if (max !== undefined) clamped = Math.min(max, clamped);
        onChange(Math.round(clamped * 1e9) / 1e9);
      }
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

  const displayValue = raw !== null ? raw : value.toFixed(2);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={`w-9 h-9 flex items-center justify-center rounded-lg bg-[#FFF7ED] border border-[#FB923C] text-black hover:bg-orange-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all duration-150 select-none ${
            !canDecrement ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          }`}
          aria-label="Decrease"
        >
          <span className="text-base leading-none">−</span>
        </button>

        <div className="flex-1 flex items-center justify-center min-w-[5rem]">
          <div className="flex items-center gap-0.5">
            <span className="text-lg font-semibold text-[#C2410C] dark:text-amber-400 tabular-nums select-none">€</span>
            <input
              type="text"
              inputMode="decimal"
              value={displayValue}
              onFocus={handleFocus}
              onChange={handleChange}
              onBlur={commit}
              onKeyDown={handleKeyDown}
              className="w-16 text-left text-lg font-semibold text-[#C2410C] dark:text-amber-400 tabular-nums bg-transparent border-none outline-none focus:outline-none focus:ring-0 cursor-text"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={`w-9 h-9 flex items-center justify-center rounded-lg bg-[#FFF7ED] border border-[#FB923C] text-black hover:bg-orange-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all duration-150 select-none ${
            !canIncrement ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          }`}
          aria-label="Increase"
        >
          <span className="text-base leading-none">+</span>
        </button>
      </div>
      {helpText && (
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{helpText}</span>
      )}
    </div>
  );
}
