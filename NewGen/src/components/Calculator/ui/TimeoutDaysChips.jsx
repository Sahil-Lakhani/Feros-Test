import { motion } from 'framer-motion';

const INK = '#1A1A1F';
const BG = '#F4EADC';

export default function TimeoutDaysChips({ value, onChange, range = [1, 2, 3, 4, 5, 6, 7] }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {range.map((n) => {
        const active = value === n;
        return (
          <motion.button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            whileHover={active ? {} : { scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            style={{
              minWidth: 36,
              height: 32,
              padding: '0 12px',
              borderRadius: 100,
              border: active ? `1px solid ${INK}` : `1px solid ${INK}1A`,
              background: active ? INK : '#FFFFFF',
              color: active ? BG : INK,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {n}
          </motion.button>
        );
      })}
    </div>
  );
}
