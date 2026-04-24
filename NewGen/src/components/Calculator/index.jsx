import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CalculatorNav from './CalculatorNav';
import StationSelector from './StationSelector';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import { useCalculator } from '../../hooks/useCalculator';

const BG = '#F4EADC';
const INK = '#1A1A1F';
const SUB = '#6B6B75';

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  html { scrollbar-gutter: stable; }
  body {
    margin: 0;
    font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
    background: ${BG};
    color: ${INK};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  * { box-sizing: border-box; }
  button { font-family: inherit; }

  .station-strip {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 36px;
  }
  .station-strip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .station-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .calc-section {
    background: #f0e8daff;
    border: 2px solid ${INK}1F;
    border-radius: 24px;
    padding: 32px;
  }

  .calc-grid {
    display: grid;
    grid-template-columns: minmax(360px, 440px) 1fr;
    gap: 40px;
    align-items: start;
  }

  .calc-input-col {
    position: sticky;
    top: 96px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding-right: 4px;
  }

  .calc-input-col::-webkit-scrollbar { width: 6px; }
  .calc-input-col::-webkit-scrollbar-thumb {
    background: ${INK}1A;
    border-radius: 3px;
  }

  @media (max-width: 1100px) {
    .station-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 900px) {
    .calc-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .calc-input-col {
      position: static;
      max-height: none;
      overflow-y: visible;
      padding-right: 0;
    }
  }

  @media (max-width: 900px) {
    .calc-section {
      padding: 24px;
      border-radius: 20px;
    }
  }

  @media (max-width: 640px) {
    .calc-wrap { padding: 16px 14px 64px !important; }
    .calc-nav-spacer { height: 12px !important; }
    .station-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .station-strip { margin-bottom: 24px; }
    .calc-section {
      padding: 18px;
      border-radius: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default function Calculator() {
  const { inputs, outputs, updateInput, resetInputs } = useCalculator();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{globalCSS}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          minHeight: '100vh',
          background: BG,
          color: INK,
          paddingTop: 16,
        }}
      >
        <CalculatorNav />

        <div
          className="calc-wrap"
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '32px 32px 80px',
          }}
        >
          {/* STATIONS STRIP — full width, 4 models with images */}
          <StationSelector
            inputs={inputs}
            outputs={outputs}
            updateInput={updateInput}
          />

          {/* TWO-COLUMN GRID — unified section panel */}
          <div className="calc-section">
            <div className="calc-grid">
              <div className="calc-input-col">
                <InputPanel
                  inputs={inputs}
                  updateInput={updateInput}
                  resetInputs={resetInputs}
                />
              </div>
              <div>
                <ResultsPanel outputs={outputs} />
              </div>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div
            style={{
              marginTop: 56,
              paddingTop: 24,
              borderTop: `1px solid ${INK}14`,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10,
              color: SUB,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span>VoltSpot · Investitions-Kalkulator</span>
            <span>Alle Angaben ohne Gewähr</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
