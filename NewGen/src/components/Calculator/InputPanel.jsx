import NumberStepper from './ui/NumberStepper';
import CurrencyInput from './ui/CurrencyInput';
import PercentageInput from './ui/PercentageInput';
import TimeoutDaysChips from './ui/TimeoutDaysChips';

const INK = '#1A1A1F';
const ACCENT = '#FF7A2E';

export default function InputPanel({ inputs, updateInput, resetInputs }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      {/* BETRIEB */}
      <Section label="Betrieb">
        <FieldRow
          label="Vermietete PB / Gerät / Tag"
          control={
            <NumberStepper
              value={inputs.rentalsPerDay}
              onChange={(v) => updateInput('rentalsPerDay', v)}
              min={0}
              max={100}
              step={0.5}
              format={(v) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 })}
            />
          }
        />
        <FieldRow
          label="Öffnungstage / Monat"
          control={
            <NumberStepper
              value={inputs.openingDays}
              onChange={(v) => updateInput('openingDays', v)}
              min={0}
              max={31}
              step={0.5}
              format={(v) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 })}
            />
          }
        />
      </Section>

      {/* PREISE */}
      <Section label="Preise">
        <FieldRow
          label="Mietgebühr / Std."
          control={
            <CurrencyInput
              value={inputs.hourlyRate}
              onChange={(v) => updateInput('hourlyRate', v)}
              min={0}
              max={100}
              step={0.05}
            />
          }
        />
        <FieldRow
          label="Ø Mietdauer / Std."
          control={
            <NumberStepper
              value={inputs.rentalHours}
              onChange={(v) => updateInput('rentalHours', v)}
              min={0}
              max={24}
              step={0.5}
              format={(v) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 })}
            />
          }
        />
        <FieldRow
          label="Max. / Tag"
          control={
            <CurrencyInput
              value={inputs.maxDaily}
              onChange={(v) => updateInput('maxDaily', v)}
              min={0}
              max={500}
              step={0.5}
            />
          }
        />
      </Section>

      {/* FINANZEN */}
      <Section label="Finanzen">
        <FieldRow
          label="Deposit"
          control={
            <CurrencyInput
              value={inputs.deposit}
              onChange={(v) => updateInput('deposit', v)}
              min={0}
              max={1000}
              step={1}
            />
          }
        />
        <FieldRow
          label="Umsatzshare Merchants"
          control={
            <PercentageInput
              value={inputs.merchantShare}
              onChange={(v) => updateInput('merchantShare', v)}
              min={0}
              max={100}
              step={1}
            />
          }
        />
      </Section>

      {/* VERLUSTE */}
      <Section label="Verluste">
        <FieldRow
          label="PB Lost Quote"
          control={
            <PercentageInput
              value={inputs.pbLostRate}
              onChange={(v) => updateInput('pbLostRate', v)}
              min={0}
              max={100}
              step={0.5}
            />
          }
        />
        <FieldRow
          label="Time-Out Days"
          stacked
          control={
            <TimeoutDaysChips
              value={inputs.timeoutDays}
              onChange={(v) => updateInput('timeoutDays', v)}
            />
          }
        />
      </Section>

      {/* RESET */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          type="button"
          onClick={resetInputs}
          style={{
            background: 'transparent',
            border: `1px solid ${INK}20`,
            borderRadius: 100,
            padding: '8px 16px',
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: INK,
            cursor: 'pointer',
          }}
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <section>
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: ACCENT,
          marginBottom: 14,
        }}
      >
        ✦ {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </section>
  );
}

function FieldRow({ label, control, stacked = false }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: stacked ? 10 : 12,
        padding: '4px 0',
      }}
    >
      <span
        style={{
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          fontSize: 14,
          color: INK,
          flex: '1 1 auto',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      <div style={{ flex: '0 0 auto' }}>{control}</div>
    </div>
  );
}
