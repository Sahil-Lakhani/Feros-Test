interface PercentageInputProps {
  value: number;          // stored as 0–1
  onChange: (v: number) => void;  // emits 0–1
  min?: number;           // default 0 (as fraction)
  max?: number;           // default 1 (as fraction)
  step?: number;          // default 0.01 (= 1% step)
  label?: string;
  helpText?: string;
  className?: string;
}

export function PercentageInput({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  label,
  helpText,
  className = '',
}: PercentageInputProps) {
  const canDecrement = value - step >= min - 1e-9;
  const canIncrement = value + step <= max + 1e-9;

  const handleDecrement = () => {
    if (!canDecrement) return;
    const next = Math.round((value - step) * 1e9) / 1e9;
    onChange(Math.max(min, next));
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    const next = Math.round((value + step) * 1e9) / 1e9;
    onChange(Math.min(max, next));
  };

  const displayPct = (value * 100).toFixed(1) + '%';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-xs font-medium text-zinc-400">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={`w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all duration-150 select-none ${
            !canDecrement ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          }`}
          aria-label="Decrease"
        >
          <span className="text-base leading-none">−</span>
        </button>

        <div className="flex-1 flex items-center justify-center min-w-[4rem]">
          <span className="text-lg font-semibold text-amber-400 tabular-nums">
            {displayPct}
          </span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={`w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all duration-150 select-none ${
            !canIncrement ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          }`}
          aria-label="Increase"
        >
          <span className="text-base leading-none">+</span>
        </button>
      </div>
      {helpText && (
        <span className="text-xs text-zinc-500">{helpText}</span>
      )}
    </div>
  );
}
