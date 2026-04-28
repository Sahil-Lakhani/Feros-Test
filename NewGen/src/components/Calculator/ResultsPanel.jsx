import { motion } from 'framer-motion';
import MetricRow from './ui/MetricRow';

const INK = '#1A1A1F';
const BG = '#F4EADC';
const ACCENT = '#FF7A2E';
const SUB = '#6B6B75';
const CARD_A = '#FFC87A';
const CARD_B = '#F5A687';
const CARD_C = '#D8C9B0';
const POSITIVE = '#10B981';
const NEGATIVE = '#EF4444';

const currencyDE = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const currencyDE2 = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numberDE = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const numberDE1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

const fmtEur = (v) => currencyDE.format(v);
const fmtEur2 = (v) => currencyDE2.format(v);
const fmtNum = (v) => numberDE.format(v);
const fmtNum1 = (v) => numberDE1.format(v);
const fmtPct = (v) => `${v.toLocaleString('de-DE', { maximumFractionDigits: 1 })} %`;

export default function ResultsPanel({ outputs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {outputs.showWarning && <WarningBanner />}

      {/* INVESTMENT */}
      <Card>
        <SectionLabel>Investment</SectionLabel>
        <MetricRow label="Einstiegsgebühr" value={fmtEur(1900)} />
        <MetricRow label="Powerbank Automaten" value={fmtEur(outputs.machineCost)} />
        <MetricRow label="Gesamtinvestition" value={fmtEur(outputs.totalInvestment)} variant="bold" />
      </Card>

      {/* EINNAHMEN */}
      <Card>
        <SectionLabel>Einnahmen</SectionLabel>
        <MetricRow label="Umsatz / Monat" value={fmtEur(outputs.umsatz_Mo)} variant="accent" />
        <MetricRow label="Umsatz / Jahr" value={fmtEur(outputs.umsatz_Jahr)} variant="bold" />

        <Divider label="Details" />

        <MetricRow label="Preis pro Vermietung" value={fmtEur2(outputs.pricePerRental)} variant="muted" />
        <MetricRow label="Vermietungen / Monat" value={fmtNum(outputs.totalRentals_Mo)} variant="muted" />
        <MetricRow label="Verlorene PBs / Monat" value={fmtNum1(outputs.lostPBs_Mo)} variant="muted" />
        <MetricRow
          label="Einnahme pro verlorene PB"
          value={fmtEur2(outputs.incomePerLostPB)}
          variant="muted"
          hint="min(Deposit, Max/Tag × Time-Out + 15€)"
        />
        <MetricRow label="PB-Refill-Gewinn / Monat" value={fmtEur(outputs.pbRefillGains_Mo)} variant="muted" />
      </Card>

      {/* ABZÜGE (JÄHRLICH) */}
      <Card>
        <SectionLabel>Abzüge (jährlich)</SectionLabel>
        <MetricRow label="MwSt (extrahiert · 19%)" value={fmtEur(outputs.vatExtracted)} />
        <MetricRow label="Partnergebühr (12%)" value={fmtEur(outputs.partnerFeeAmt)} />
        <MetricRow label="Systemgebühr (8%)" value={fmtEur(outputs.systemFeeAmt)} />
        <MetricRow label="Umsatzshare Merchants" value={fmtEur(outputs.merchantFeeAmt_Jahr)} />
      </Card>

      {/* NETTOZUFLUSS */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${INK} 0%, #2A2A32 100%)`,
          color: BG,
          border: `1px solid ${INK}`,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: 12,
          }}
        >
          ✦ Nettozufluss
        </div>
        <div
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(44px, 7vw, 72px)',
            fontWeight: 500,
            color: ACCENT,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmtEur(outputs.annualNetFlow)}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: `${BG}99`,
            letterSpacing: '0.1em',
            marginTop: 8,
            textTransform: 'uppercase',
          }}
        >
          pro Jahr (nach allen Abzügen)
        </div>
      </Card>

      {/* GEWINN */}
      <div>
        <div style={{ paddingLeft: 4, marginBottom: 14 }}>
          <SectionLabel>Gewinn</SectionLabel>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}
          className="gewinn-grid"
        >
          <YearCard
            year="Jahr 1"
            value={outputs.gewinn_Jahr1}
            bg={CARD_A}
            note="− volle Investition"
          />
          <YearCard year="Jahr 2" value={outputs.gewinn_Jahr2} bg={CARD_B} />
          <YearCard year="Jahr 3" value={outputs.gewinn_Jahr3} bg={CARD_C} />
        </div>

        <Card style={{ marginTop: 12 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span
                style={{
                  fontFamily: "'Inter Tight', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  color: INK,
                }}
              >
                Gesamtgewinn (3 Jahre)
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
                3 × Nettozufluss − Gesamtinvestition
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(28px, 4.5vw, 40px)',
                fontWeight: 500,
                color: outputs.gewinn_Gesamt >= 0 ? POSITIVE : NEGATIVE,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              {fmtEur(outputs.gewinn_Gesamt)}
            </span>
          </div>
        </Card>
      </div>

      {/* ROI */}
      <Card>
        <SectionLabel>ROI</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
            marginTop: 4,
          }}
        >
          <RoiStat label="ROI · 1 Jahr" value={fmtPct(outputs.roi_Jahr1)} positive={outputs.roi_Jahr1 >= 0} />
          <RoiStat label="ROI · 3 Jahre" value={fmtPct(outputs.roi_3Jahre)} positive={outputs.roi_3Jahre >= 0} />
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            color: SUB,
            letterSpacing: '0.05em',
            lineHeight: 1.5,
          }}
        >
          Basis: Maschinenkosten (Einstiegsgebühr ausgeschlossen)
        </div>
      </Card>

      <style>{`
        @media (max-width: 640px) {
          .gewinn-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${INK}10`,
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 11,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: ACCENT,
        marginBottom: 12,
      }}
    >
      ✦ {children}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '10px 0 2px',
      }}
    >
      <div style={{ flex: 1, height: 1, background: `${INK}10` }} />
      <span
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 9,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: `${SUB}CC`,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: `${INK}10` }} />
    </div>
  );
}

function YearCard({ year, value, bg, note }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 20,
        padding: 20,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: INK,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.75,
        }}
      >
        {year}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 500,
            color: value >= 0 ? INK : NEGATIVE,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {fmtEur(value)}
        </span>
        {note && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10,
              opacity: 0.7,
              letterSpacing: '0.05em',
            }}
          >
            {note}
          </span>
        )}
      </div>
    </div>
  );
}

function RoiStat({ label, value, positive }) {
  return (
    <div
      style={{
        padding: 16,
        background: positive ? `${POSITIVE}0D` : `${NEGATIVE}0D`,
        border: `1px solid ${positive ? POSITIVE : NEGATIVE}33`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10,
          color: SUB,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(28px, 4vw, 36px)',
          fontWeight: 500,
          color: positive ? POSITIVE : NEGATIVE,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function WarningBanner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 18px',
        background: `${ACCENT}12`,
        border: `1px solid ${ACCENT}66`,
        borderRadius: 14,
        color: INK,
      }}
    >
      <span style={{ fontSize: 16, lineHeight: '20px' }}>⚠</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Mietgebühr überschreitet max. Tagessatz
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            color: SUB,
            letterSpacing: '0.05em',
          }}
        >
          Rein kosmetisch — hat keinen Einfluss auf die Berechnung
        </span>
      </div>
    </div>
  );
}
