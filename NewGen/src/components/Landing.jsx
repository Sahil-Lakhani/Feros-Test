import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Globe from './Globe';
import Loader from './Loader';

const light = {
  bg: '#F4EADC',
  ink: '#1A1A1F',
  accent: '#FF7A2E',
  sub: '#6B6B75',
  cardA: '#FFC87A',
  cardB: '#F5A687',
  cardC: '#D8C9B0',
};

const dark = {
  bg: '#1A1A1F',
  ink: '#F4EADC',
  accent: '#FF7A2E',
  sub: '#9A9AA5',
  cardA: '#FF7A2E',
  cardB: '#2A2A32',
  cardC: '#3A3A44',
};

const EASE = [0.2, 0.8, 0.2, 1];

const fonts = {
  display: "'Fraunces', 'Times New Roman', serif",
  body: "'Inter Tight', 'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { margin: 0; padding: 0; }
body {
  font-family: ${fonts.body};
  cursor: none;
  background: ${light.bg};
  color: ${light.ink};
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
canvas { cursor: grab !important; }
canvas:active { cursor: grabbing !important; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: none; border: none; background: none; }
.section-label {
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
@media (max-width: 900px) {
  .nav-center { display: none !important; }
  .hero-grid { grid-template-columns: 1fr !important; }
  .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
`;

function CustomCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      el.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: light.accent,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transition: 'transform 0.05s linear',
      }}
    />
  );
}

function Nav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 100,
        background: 'rgba(244, 234, 220, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 100,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(26, 26, 31, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: light.accent,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
          }}
        >
          ⚡
        </div>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 20,
            fontWeight: 500,
            color: light.ink,
          }}
        >
          VoltSpot
        </span>
      </div>
      <div
        className="nav-center"
        style={{
          display: 'flex',
          gap: 28,
          fontSize: 14,
          color: light.ink,
          fontWeight: 500,
        }}
      >
        {['How it works', 'Locations', 'For business', 'Pricing', 'About'].map(
          (l) => (
            <a key={l} href="#">{l}</a>
          )
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="#" style={{ fontSize: 14, color: light.ink, fontWeight: 500 }}>
          Sign in
        </a>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: light.ink,
            color: light.bg,
            padding: '10px 20px',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Get the app
        </motion.button>
      </div>
    </motion.nav>
  );
}

function Hero({ paused }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const headline = ['Never', 'run', 'out', 'of', 'battery,'];
  const headlineAccent = 'anywhere.';

  return (
    <section
      style={{
        background: light.bg,
        color: light.ink,
        padding: '140px 48px 100px',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          y,
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 48,
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              border: `1px solid ${light.ink}20`,
              fontSize: 12,
              fontFamily: fonts.mono,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: light.accent,
              }}
            />
            Now live in 42 European cities
          </motion.div>

          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              marginBottom: 28,
            }}
          >
            {headline.map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: headline.length * 0.08,
                ease: EASE,
              }}
              style={{
                display: 'inline-block',
                fontStyle: 'italic',
                color: light.accent,
              }}
            >
              {headlineAccent}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: light.sub,
              maxWidth: 520,
              marginBottom: 36,
            }}
          >
            Rent a portable powerbank at any station across Europe. Return it
            anywhere. Pay only for the minutes you use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
            style={{ display: 'flex', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: light.ink,
                color: light.bg,
                padding: '14px 24px',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Download the app →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'transparent',
                color: light.ink,
                padding: '14px 24px',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 500,
                border: `1px solid ${light.ink}40`,
              }}
            >
              Find a station
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}
          >
            {[
              ['2,400+', 'stations'],
              ['42', 'cities'],
              ['500k', 'rentals'],
            ].map(([num, label]) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 36,
                    color: light.accent,
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: light.sub,
                    marginTop: 6,
                    fontFamily: fonts.mono,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 540,
          }}
        >
          {/* Radial glow */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: 560,
              height: 560,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,122,46,0.4) 0%, rgba(255,122,46,0) 65%)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Globe size={500} paused={paused} />
          </div>

          {/* Floating chip top-right */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: EASE }}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              background: light.ink,
              color: light.bg,
              padding: '8px 14px',
              borderRadius: 100,
              fontSize: 11,
              fontFamily: fonts.mono,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 2,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: light.accent,
              }}
            />
            HEADQUARTERS · Berlin, DE
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2, duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: fonts.mono,
              fontSize: 11,
              color: light.sub,
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
            }}
          >
            ← drag to rotate →
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function Features() {
  const cards = [
    { n: '01', title: 'Scan', body: 'Open the app and scan the QR code on any VoltSpot station.', bg: dark.cardB, text: dark.ink },
    { n: '02', title: 'Grab', body: 'A powerbank unlocks instantly. USB-C, Lightning, and Micro-USB built in.', bg: dark.cardC, text: dark.ink },
    { n: '03', title: 'Charge', body: 'Take it with you. 10,000 mAh lasts up to 3 full phone charges.', bg: dark.cardB, text: dark.ink },
    { n: '04', title: 'Return', body: 'Drop it at any station across Europe. You only pay for time used.', bg: dark.accent, text: dark.bg },
  ];

  return (
    <section
      style={{
        background: dark.bg,
        color: dark.ink,
        padding: '120px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,122,46,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="section-label"
          style={{ color: dark.accent, marginBottom: 20 }}
        >
          ✦ How it works
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 56,
            maxWidth: 900,
          }}
        >
          Rent. Use.{' '}
          <span style={{ fontStyle: 'italic', color: dark.accent }}>
            Drop it off.
          </span>
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {cards.map((c, i) => (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -4 }}
              style={{
                background: c.bg,
                color: c.text,
                borderRadius: 20,
                padding: '32px 28px',
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  opacity: 0.7,
                }}
              >
                {c.n}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 32,
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.9 }}>
                  {c.body}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const items = [
    ['€0.99', 'per 30 minutes'],
    ['22.5W', 'fast charge output'],
    ['3x', 'full phone charges'],
    ['24/7', 'station availability'],
  ];
  return (
    <section
      style={{
        background: light.bg,
        color: light.ink,
        padding: '120px 48px',
      }}
    >
      <div
        className="metrics-grid"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
        }}
      >
        {items.map(([num, label], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 64,
                color: light.accent,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontSize: 14,
                color: light.sub,
                marginTop: 12,
                fontFamily: fonts.mono,
              }}
            >
              {label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section
      style={{
        background: dark.bg,
        color: dark.ink,
        padding: '140px 48px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,122,46,0.18) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="section-label"
          style={{ color: dark.accent, marginBottom: 32 }}
        >
          ✦ What people say
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            fontFamily: fonts.display,
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 400,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            marginBottom: 40,
          }}
        >
          “Saved me three times this month alone. I've completely stopped
          carrying a charger on nights out.”
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: dark.accent,
              color: dark.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 17,
            }}
          >
            LS
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Lena Schmidt</div>
            <div
              style={{
                fontSize: 12,
                color: dark.sub,
                fontFamily: fonts.mono,
                marginTop: 2,
              }}
            >
              Berlin · user since 2024
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section
      style={{
        background: light.bg,
        padding: '100px 48px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          borderRadius: 24,
          padding: '80px 48px',
          background:
            'linear-gradient(135deg, #FF7A2E 0%, #E55A1F 100%)',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 20,
            }}
          >
            Stay powered up{' '}
            <span style={{ fontStyle: 'italic' }}>wherever.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            style={{
              fontSize: 17,
              lineHeight: 1.5,
              maxWidth: 520,
              margin: '0 auto 36px',
              opacity: 0.9,
            }}
          >
            Download the VoltSpot app and find your nearest station. First 30
            minutes free on us.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['App Store', 'Google Play'].map((label) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: dark.bg,
                  color: light.bg,
                  padding: '14px 28px',
                  borderRadius: 100,
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'Product', links: ['How it works', 'Locations', 'App', 'Pricing'] },
    { title: 'Business', links: ['Host a station', 'Partners', 'API', 'Enterprise'] },
    { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
    { title: 'Support', links: ['Help center', 'Contact', 'Privacy', 'Terms'] },
  ];
  return (
    <footer
      style={{
        background: dark.bg,
        color: dark.ink,
        padding: '80px 48px 40px',
      }}
    >
      <div
        className="footer-grid"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(4, 1fr)',
          gap: 40,
          marginBottom: 64,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: dark.accent,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
              }}
            >
              ⚡
            </div>
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              VoltSpot
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: dark.sub,
              lineHeight: 1.5,
              maxWidth: 280,
            }}
          >
            Europe's powerbank-sharing network. One rental. Every city.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div
              className="section-label"
              style={{ color: dark.accent, marginBottom: 16 }}
            >
              {c.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{ fontSize: 14, color: dark.ink, opacity: 0.85 }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          paddingTop: 28,
          borderTop: `1px solid ${dark.sub}30`,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: fonts.mono,
          fontSize: 12,
          color: dark.sub,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>© 2026 VoltSpot GmbH. All rights reserved.</div>
        <div>Made in Europe ⚡</div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  // Pin to top on mount and disable browser scroll restoration
  useEffect(() => {
    try {
      window.history.scrollRestoration = 'manual';
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);
  }, []);

  // Lock scroll while the loader is showing; scroll to top on reveal
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    const fontsReady =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready
        : Promise.resolve();

    let holdTimer;
    const finish = () => {
      fontsReady.then(() => {
        holdTimer = window.setTimeout(() => setLoading(false), 900);
      });
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }
    const fallback = window.setTimeout(() => setLoading(false), 4500);
    return () => {
      window.clearTimeout(fallback);
      if (holdTimer) window.clearTimeout(holdTimer);
    };
  }, []);

  return (
    <>
      <style>{globalCSS}</style>
      {mounted && !loading && <CustomCursor />}
      {/* Mount content from the start so Three.js, borders, and fonts finish initializing behind the loader — makes the reveal smooth */}
      <div aria-hidden={loading} style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <Nav />
        <Hero paused={loading} />
        <Features />
        <Metrics />
        <Testimonial />
        <CTA />
        <Footer />
      </div>
      <AnimatePresence>
        {loading && <Loader key="loader" />}
      </AnimatePresence>
    </>
  );
}
