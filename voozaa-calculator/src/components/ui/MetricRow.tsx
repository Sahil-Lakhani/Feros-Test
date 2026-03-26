interface MetricRowProps {
  label: string;
  value: number;
  format: 'currency' | 'percentage' | 'number';
  variant?: 'default' | 'negative' | 'positive' | 'highlight' | 'amber';
  decimals?: number;
  suffix?: string;
  className?: string;
}

const variantClass: Record<NonNullable<MetricRowProps['variant']>, string> = {
  default: 'text-zinc-900 font-semibold tabular-nums dark:text-zinc-100',
  negative: 'text-red-600 font-semibold tabular-nums dark:text-red-400',
  positive: 'text-emerald-700 font-semibold tabular-nums dark:text-emerald-400',
  highlight: 'text-zinc-900 font-bold text-base tabular-nums dark:text-zinc-100',
  amber: 'text-[#C2410C] font-semibold tabular-nums dark:text-amber-400',
};

function formatValue(value: number, format: MetricRowProps['format'], decimals?: number): string {
  if (format === 'currency') {
    const abs = Math.abs(value);
    const formatted = abs.toLocaleString('de-DE', {
      minimumFractionDigits: decimals ?? 2,
      maximumFractionDigits: decimals ?? 2,
    });
    return '€' + formatted;
  }
  if (format === 'percentage') {
    return value.toFixed(decimals ?? 2) + '%';
  }
  // number
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  });
}

export function MetricRow({
  label,
  value,
  format,
  variant = 'default',
  decimals,
  suffix,
  className = '',
}: MetricRowProps) {
  const valueClass = variantClass[variant];
  const displayValue = formatValue(value, format, decimals);

  return (
    <div className={`flex justify-between items-center py-2.5 transition-all duration-150 ${className}`}>
      <span className="text-zinc-500 dark:text-zinc-400 text-sm">{label}</span>
      <span className={valueClass}>
        {displayValue}
        {suffix && <span className="text-zinc-400 dark:text-zinc-500 font-normal text-xs ml-1">{suffix}</span>}
      </span>
    </div>
  );
}
