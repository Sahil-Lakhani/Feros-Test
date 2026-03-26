import type { CalculatorInputs, CalculatorOutputs } from '../types';
import { MetricRow } from './ui/MetricRow';

interface ResultsPanelProps {
  outputs: CalculatorOutputs;
  inputs: CalculatorInputs;
}

function formatCurrency(v: number): string {
  return '€' + Math.abs(v).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function profitSign(v: number): string {
  const abs = Math.abs(v).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (v < 0 ? '-€' : '€') + abs;
}

function roiSign(v: number): string {
  return v.toFixed(2) + '%';
}

export function ResultsPanel({ outputs, inputs }: ResultsPanelProps) {
  const sectionLabel = 'text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2';
  const card = 'bg-white border border-[#0F0F0F] dark:bg-zinc-900 dark:border-zinc-800 rounded-xl p-4';
  const divider = <div className="border-t border-[#0F0F0F]/20 dark:border-zinc-800 my-1" />;

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      {outputs.showWarning && (
        <div className="bg-orange-50 dark:bg-amber-500/10 border border-orange-300 dark:border-amber-500/30 rounded-xl p-3">
          <p className="text-orange-700 dark:text-amber-400 text-sm">
            ⚠️ Mietpreis ({formatCurrency(outputs.pricePerRental)}) übersteigt Max. Tagessatz ({formatCurrency(inputs.maxDaily)}) — beeinflusst die Kautions-Formel.
          </p>
        </div>
      )}

      {/* Section 1: Investment */}
      <div>
        <p className={sectionLabel}>Investment</p>
        <div className={card}>
          <MetricRow label="Einstiegsgebühr (einmalig)" value={1900} format="currency" variant="default" />
          <MetricRow label="Powerbank Automaten" value={outputs.machineCost} format="currency" variant="default" />
          {divider}
          <MetricRow label="Gesamtinvestition" value={outputs.totalInvestment} format="currency" variant="highlight" />
        </div>
        <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-2 px-1">{outputs.totalStations} Station(en) konfiguriert</p>
      </div>

      {/* Section 2: Einnahmen */}
      <div>
        <p className={sectionLabel}>Einnahmen</p>
        <div className={card}>
          <MetricRow label="Umsatz / Monat" value={outputs.umsatz_Mo} format="currency" variant="positive" />
          <div className="flex justify-between items-center py-2.5 transition-all duration-150">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">Umsatz / Jahr</span>
            <span className="text-[#C2410C] dark:text-amber-400 font-bold text-lg tabular-nums">
              {formatCurrency(outputs.umsatz_Jahr)}
            </span>
          </div>
          {divider}
          <MetricRow label="Mietpreis / Rental" value={outputs.pricePerRental} format="currency" variant="default" suffix="/ Ausleihe" />
          <MetricRow label="Rentals / Monat" value={outputs.totalRentals_Mo} format="number" variant="default" />
          {divider}
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-600 mt-1 mb-0.5">PB Details</p>
          <MetricRow label="Verlorene PBs / Monat" value={outputs.lostPBs_Mo} format="number" variant="default" decimals={1} />
          <MetricRow label="Einnahmen / Verlorene PB" value={outputs.incomePerLostPB} format="currency" variant="default" />
          <MetricRow label="Gewinn aus PB-Refill / Monat" value={outputs.pbRefillGains_Mo} format="currency" variant="default" />
        </div>
      </div>

      {/* Section 3: Abzüge (Jährlich) */}
      <div>
        <p className={sectionLabel}>Abzüge (Jährlich)</p>
        <div className={card}>
          <MetricRow label="enthaltene MwSt (19%)" value={outputs.vatExtracted} format="currency" variant="negative" />
          <MetricRow label="Partnergebühr (12%)" value={outputs.partnerFeeAmt} format="currency" variant="negative" />
          <MetricRow label="Systemgebühr (8%)" value={outputs.systemFeeAmt} format="currency" variant="negative" />
          <MetricRow
            label={`Umsatzshare (${(inputs.merchantShare * 100).toFixed(0)}%) / Monat`}
            value={outputs.merchantFeeAmt_Mo}
            format="currency"
            variant="negative"
          />
          <MetricRow label="Umsatzshare / Jahr" value={outputs.merchantFeeAmt_Jahr} format="currency" variant="negative" />
        </div>
      </div>

      {/* Section 4: Nettozufluss */}
      <div>
        <p className={sectionLabel}>Nettozufluss</p>
        <div className="bg-white border border-[#0F0F0F] dark:bg-zinc-900 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-1">Jährlicher Nettozufluss</p>
          <p className="text-3xl font-bold text-[#C2410C] dark:text-amber-400 tabular-nums transition-all duration-150">
            {formatCurrency(outputs.annualNetFlow)}
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-2">nach MwSt, Gebühren &amp; Umsatzshare</p>
        </div>
      </div>

      {/* Section 5: Gewinn */}
      <div>
        <p className={sectionLabel}>Gewinn</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Jahr 1 */}
          <div
            className={`bg-white dark:bg-zinc-900 rounded-xl p-4 border transition-all duration-150 ${
              outputs.gewinn_Jahr1 >= 0 ? 'border-[#F59E0B]/30 dark:border-amber-500/30' : 'border-red-400/40 dark:border-red-500/30'
            }`}
          >
            <p className={sectionLabel}>Jahr 1</p>
            <p
              className={`font-bold text-xl tabular-nums ${
                outputs.gewinn_Jahr1 >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {profitSign(outputs.gewinn_Jahr1)}
            </p>
          </div>

          {/* Jahr 2 */}
          <div className="bg-white dark:bg-zinc-900 border border-[#0F0F0F] dark:border-zinc-800 rounded-xl p-4 transition-all duration-150">
            <p className={sectionLabel}>Jahr 2</p>
            <p
              className={`font-bold text-xl tabular-nums ${
                outputs.gewinn_Jahr2 >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {profitSign(outputs.gewinn_Jahr2)}
            </p>
          </div>

          {/* Jahr 3 */}
          <div className="bg-white dark:bg-zinc-900 border border-[#0F0F0F] dark:border-zinc-800 rounded-xl p-4 transition-all duration-150">
            <p className={sectionLabel}>Jahr 3</p>
            <p
              className={`font-bold text-xl tabular-nums ${
                outputs.gewinn_Jahr3 >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {profitSign(outputs.gewinn_Jahr3)}
            </p>
          </div>
        </div>

        {/* Gesamtgewinn */}
        <div className="mt-3 bg-white dark:bg-zinc-900 border border-[#0F0F0F] dark:border-zinc-800 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">Gesamtgewinn (3 Jahre):</span>
          <span
            className={`font-bold text-lg tabular-nums transition-all duration-150 ${
              outputs.gewinn_Gesamt >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {profitSign(outputs.gewinn_Gesamt)}
          </span>
        </div>
      </div>

      {/* Section 6: ROI */}
      <div>
        <p className={sectionLabel}>ROI</p>
        <div className={card}>
          <div className="flex justify-between items-center py-2.5 transition-all duration-150">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">ROI Jahr 1</span>
            <span
              className={`font-semibold tabular-nums ${
                outputs.roi_Jahr1 >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {roiSign(outputs.roi_Jahr1)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2.5 transition-all duration-150">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">ROI 3 Jahre</span>
            <span
              className={`font-semibold tabular-nums ${
                outputs.roi_3Jahre >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {roiSign(outputs.roi_3Jahre)}
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 px-1">Basis: Maschinenkosten (Einstiegsgebühr exkludiert)</p>
      </div>
    </div>
  );
}
