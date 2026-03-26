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
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
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
                  ? 'bg-[#FFF7ED] text-black border-[#F59E0B] font-semibold dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/60'
                  : 'bg-[#F0F0EE] text-zinc-700 border-[#0F0F0F] hover:border-[#F59E0B]/60 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-amber-500/40'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {helpText && (
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{helpText}</span>
      )}
    </div>
  );
}
