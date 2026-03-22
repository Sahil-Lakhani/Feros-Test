interface TimeoutDaysChipsProps {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  helpText?: string;
}

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export function TimeoutDaysChips({
  value,
  onChange,
  label,
  helpText,
}: TimeoutDaysChipsProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-medium text-zinc-400">{label}</span>
      )}
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => {
          const isSelected = value === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onChange(day)}
              className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all duration-150 border select-none ${
                isSelected
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/60 font-semibold'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-amber-500/40'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {helpText && (
        <span className="text-xs text-zinc-500">{helpText}</span>
      )}
    </div>
  );
}
