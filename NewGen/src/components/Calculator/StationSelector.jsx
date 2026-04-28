import { motion } from 'framer-motion';
import { STATION_MODELS } from '../../calculator/types';

const INK = '#1A1A1F';
const BG = '#F4EADC';
const ACCENT = '#FF7A2E';
const SUB = '#6B6B75';

const euro0 = (v) => `€ ${v.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`;

export default function StationSelector({ inputs, outputs, updateInput }) {
  return (
    <section className="station-strip">
      <div className="station-strip-header">
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          ✦ Stationen
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10,
              color: SUB,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Maschinenkosten
          </span>
          <span
            style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: INK,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {euro0(outputs.machineCost)}
          </span>
        </div>
      </div>

      <div className="station-grid">
        {STATION_MODELS.map((m) => {
          const qty = inputs[m.key];
          const active = qty > 0;

          const clamp = (v) => Math.max(0, Math.min(999, v));
          const dec = () => updateInput(m.key, clamp(qty - 1));
          const inc = () => updateInput(m.key, clamp(qty + 1));

          return (
            <motion.div
              key={m.id}
              layout
              style={{
                background: active ? `${ACCENT}0D` : '#FFFFFF',
                border: active ? `2px solid ${ACCENT}` : `1px solid ${INK}14`,
                borderRadius: 20,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow: active
                  ? '0 10px 28px rgba(255,122,46,0.14)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: active ? `${ACCENT}10` : `${BG}CC`,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'background 0.15s',
                }}
              >
                <img
                  src={m.image}
                  alt={m.label}
                  style={{
                    width: '82%',
                    height: '82%',
                    objectFit: 'contain',
                    filter: active ? 'none' : 'saturate(0.9)',
                    transition: 'filter 0.15s',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 500,
                    color: INK,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {m.label}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 10,
                    color: SUB,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {m.capacity} PB · {euro0(m.price)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginTop: 'auto',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 30,
                    fontWeight: 500,
                    color: active ? ACCENT : `${INK}55`,
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}
                >
                  {qty}
                </span>

                <div style={{ display: 'inline-flex', gap: 6 }}>
                  <StepperButton label="−" onClick={dec} disabled={qty <= 0} />
                  <StepperButton label="+" onClick={inc} disabled={qty >= 999} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function StepperButton({ label, onClick, disabled }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.06 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: 'none',
        background: disabled ? `${INK}08` : INK,
        color: disabled ? `${INK}40` : '#F4EADC',
        fontSize: 16,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        fontFamily: "'Inter Tight', system-ui, sans-serif",
      }}
    >
      {label}
    </motion.button>
  );
}
