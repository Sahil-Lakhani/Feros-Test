import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const INK = '#1A1A1F';
const BG = '#F4EADC';
const ACCENT = '#FF7A2E';

export default function CalculatorNav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 20px',
        background: `${BG}E6`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${INK}14`,
        borderRadius: 100,
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textDecoration: 'none',
          color: INK,
        }}
      >
        <img
          src="/logo-light.png"
          alt="VoltSpot"
          style={{ height: 28, width: 'auto', display: 'block' }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            color: ACCENT,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          · Profit Kalkulator
        </span>
      </Link>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 100,
            background: INK,
            color: BG,
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <span aria-hidden>←</span>
          <span>Zur Startseite</span>
        </Link>
      </motion.div>
    </nav>
  );
}

