import type { CalculatorInputs } from '../types';
import { STATION_MODELS } from '../types';
import { StationSelector } from './StationSelector';
import { NumberStepper } from './ui/NumberStepper';
import { CurrencyInput } from './ui/CurrencyInput';
import { PercentageInput } from './ui/PercentageInput';
import { TimeoutDaysChips } from './ui/TimeoutDaysChips';

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: (key: keyof CalculatorInputs, value: number) => void;
  onReset?: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="uppercase text-xs font-semibold tracking-widest text-zinc-500 mb-3">
      {children}
    </p>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      {children}
    </div>
  );
}

export function InputPanel({ inputs, onChange, onReset }: InputPanelProps) {
  const machineCost = STATION_MODELS.reduce(
    (sum, model) => sum + inputs[model.key] * model.price,
    0
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Einstellungen</h2>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Section 1: STATIONEN */}
      <div className="mb-6">
        <SectionLabel>Stationen</SectionLabel>
        <SectionCard>
          <StationSelector
            inputs={inputs}
            onChange={onChange}
          />
          {machineCost > 0 && (
            <p className="mt-3 text-xs text-zinc-400">
              Maschinenkosten:{' '}
              <span className="text-zinc-300 font-medium">
                €{machineCost.toLocaleString('de-DE')}
              </span>
            </p>
          )}
        </SectionCard>
      </div>

      {/* Section 2: BETRIEB */}
      <div className="mb-6">
        <SectionLabel>Betrieb</SectionLabel>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberStepper
              value={inputs.rentalsPerDay}
              onChange={(v) => onChange('rentalsPerDay', v)}
              min={0.5}
              max={30}
              step={0.5}
              label="Vermietungen / Tag"
              helpText="pro Gerät"
            />
            <NumberStepper
              value={inputs.openingDays}
              onChange={(v) => onChange('openingDays', v)}
              min={1}
              max={31}
              step={1}
              label="Öffnungstage / Monat"
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 3: PREISE */}
      <div className="mb-6">
        <SectionLabel>Preise</SectionLabel>
        <SectionCard>
          <div className="flex flex-col gap-4">
            <CurrencyInput
              value={inputs.hourlyRate}
              onChange={(v) => onChange('hourlyRate', v)}
              min={0.05}
              max={10}
              step={0.05}
              label="Mietgebühr / Std."
            />
            <NumberStepper
              value={inputs.rentalHours}
              onChange={(v) => onChange('rentalHours', v)}
              min={0.5}
              max={8}
              step={0.5}
              format={(v) => `${v}h`}
              label="Mietdauer / Std."
            />
            <CurrencyInput
              value={inputs.maxDaily}
              onChange={(v) => onChange('maxDaily', v)}
              min={0.5}
              max={50}
              step={0.5}
              label="Max. / Tag"
              helpText="Beeinflusst nur die Kautions-Formel"
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 4: FINANZEN */}
      <div className="mb-6">
        <SectionLabel>Finanzen</SectionLabel>
        <SectionCard>
          <div className="flex flex-col gap-4">
            <CurrencyInput
              value={inputs.deposit}
              onChange={(v) => onChange('deposit', v)}
              min={1}
              max={200}
              step={1}
              label="Deposit (Kaution)"
            />
            <PercentageInput
              value={inputs.merchantShare}
              onChange={(v) => onChange('merchantShare', v)}
              min={0}
              max={1}
              step={0.01}
              label="Umsatzshare (Händler)"
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 5: VERLUSTE */}
      <div className="mb-6">
        <SectionLabel>Verluste</SectionLabel>
        <SectionCard>
          <div className="flex flex-col gap-4">
            <PercentageInput
              value={inputs.pbLostRate}
              onChange={(v) => onChange('pbLostRate', v)}
              min={0}
              max={0.5}
              step={0.005}
              label="PB Lost Quote"
              helpText="Anteil verlorener Powerbanks"
            />
            <TimeoutDaysChips
              value={inputs.timeoutDays}
              onChange={(v) => onChange('timeoutDays', v)}
              label="Time-Out Days"
              helpText="Tage bis eine nicht zurückgegebene PB als 'verloren' gilt"
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
