import { motion } from 'framer-motion';

const EASE = [0.2, 0.8, 0.2, 1];
const BG = '#F4EADC';
const ACCENT = '#FF7A2E';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 28,
        overflow: 'hidden',
        willChange: 'opacity',
      }}
    >
      {/* Soft glow behind logo */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,122,46,0.45) 0%, rgba(255,122,46,0) 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <motion.img
        src="/logo 2.png"
        alt="VoltSpot"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: 1,
        }}
        transition={{
          opacity: { duration: 0.5, ease: EASE },
          scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          width: 140,
          height: 'auto',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 8px 24px rgba(255,122,46,0.25))',
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: 'relative',
          width: 180,
          height: 2,
          background: 'rgba(26,26,31,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: ACCENT,
            borderRadius: 2,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#1A1A1F',
          zIndex: 1,
        }}
      >
        Powering up
      </motion.div>
    </motion.div>
  );
}
