# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

---

## Repository Overview

This repo has two parts:
1. **`voozaa_calculator_reverse_engineered.md`** — A complete reverse-engineering analysis of the Voozaa investment calculator (https://voozaa.app/calculator), derived through pure UI testing with no source code access.
2. **`voozaa-calculator/`** — A fully functional Vite + React + TypeScript frontend app that implements the reverse-engineered formulas.

---

## Part 1: Reverse-Engineering Document

### What Was Reverse-Engineered

The Voozaa calculator is a German powerbank rental station investment calculator. Investors buy charging stations (models M/L/L+WP/XL), place them at merchant locations, and earn rental revenue from powerbank loans. The calculator projects investment, revenue, costs, profit, and ROI.

### Input Parameters (UI Labels → Variable Names)

| Variable | UI Label | Type | Default | Step |
|---|---|---|---|---|
| `rentalsPerDay` | vermietete Powerbanks pro Gerät / Tag | Slider | 8 | 0.5 |
| `openingDays` | Öffnungstage / Monat | Slider | 30 | 0.5 |
| `hourlyRate` | Mietgebühr / Std. | Input | 1.00 | 0.05 |
| `rentalHours` | durchschnittliche Mietdauer / Std. | Slider | 2 | 0.5 |
| `maxDaily` | max. / Tag | Input | 10.00 | 0.5 |
| `deposit` | Deposit | Input | 45 | — |
| `pbLostRate` | PB Lost Quote | Slider | 5% | — |
| `merchantShare` | Umsatzshare % (Merchants) | Slider | 20% | — |
| `timeoutDays` | Time-Out Days | Slider | 3 | 1 |
| `qty_M/L/LWP/XL` | Anzahl Stationen | Integer inputs | 1×M | — |

### Hardware Constants (Hardcoded)

| Constant | Value |
|---|---|
| `ENTRY_FEE` | €1,900 (one-time, paid once regardless of station count) |
| Model M price | €1,200 (12 PBs capacity) |
| Model L price | €1,900 (24 PBs capacity) |
| Model L+WP price | €2,000 (24 PBs capacity) |
| Model XL price | €2,800 (32 PBs capacity) |
| `REPLACEMENT_COST_PB` | €15 (only hardcoded constant in the lost-PB formula) |

### Fee & Tax Constants

| Constant | Value |
|---|---|
| `VAT_RATE` | 19% — **enthaltene MwSt** (extracted from gross, NOT added on top) |
| `PARTNER_FEE` | 12% of gross revenue |
| `SYSTEM_FEE` | 8% of gross revenue |
| `merchantShare` | variable (default 20%), user-configurable |

### Complete Formula Logic

**Investment:**
```
machineCost     = qty_M×1200 + qty_L×1900 + qty_LWP×2000 + qty_XL×2800
totalInvestment = 1900 + machineCost
```

**Rental Revenue (monthly):**
```
pricePerRental   = hourlyRate × rentalHours
                   ← maxDaily does NOT cap this
totalRentals_Mo  = totalStations × rentalsPerDay × openingDays
rentalRevenue_Mo = totalRentals_Mo × pricePerRental
```

**Lost Powerbank Mechanics (monthly):**
```
lostPBs_Mo       = totalRentals_Mo × pbLostRate
incomePerLostPB  = min(deposit, maxDaily × timeoutDays + 15)
netGainPerLostPB = incomePerLostPB - 15
pbRefillGains_Mo = lostPBs_Mo × netGainPerLostPB
```

**Monthly & Annual Totals:**
```
umsatz_Mo   = rentalRevenue_Mo + pbRefillGains_Mo
umsatz_Jahr = umsatz_Mo × 12
```

**Annual Net Cash Flow:**
```
vatExtracted  = umsatz_Jahr × (0.19 / 1.19)    ← extraction formula, NOT × 0.19
partnerFee    = umsatz_Jahr × 0.12
systemFee     = umsatz_Jahr × 0.08
merchantFee   = umsatz_Jahr × merchantShare
annualNetFlow = umsatz_Jahr × (1 - 0.19/1.19 - 0.12 - 0.08 - merchantShare)
```
At default merchantShare=20%: multiplier ≈ 0.49034

**Profits (3-year):**
```
gewinn_Jahr1  = annualNetFlow - totalInvestment
gewinn_Jahr2  = annualNetFlow
gewinn_Jahr3  = annualNetFlow
gewinn_Gesamt = 3 × annualNetFlow - totalInvestment
```

**ROI:**
```
roi_Jahr1  = (gewinn_Jahr1 / machineCost) × 100
roi_3Jahre = (gewinn_Gesamt / machineCost) × 100
```
> ROI denominator is `machineCost` ONLY — the €1,900 entry fee is excluded.

**Warning trigger:**
```
showWarning = pricePerRental > maxDaily
```

### Key Non-Obvious Behaviors

1. **`maxDaily` does NOT cap rental revenue.** It only enters `incomePerLostPB = min(deposit, maxDaily × timeoutDays + 15)`. Counter-intuitive given the label "Max. Tagessatz".
2. **VAT is extracted, not added.** Formula is `revenue × 0.19/1.19`, not `revenue × 0.19`.
3. **ROI denominator = machineCost only.** Entry fee subtracted from Year 1 profit but excluded from ROI base.
4. **`timeoutDays` is user-configurable** (default 3) — not hardcoded, exposed as a slider in the UI.
5. **`REPLACEMENT_COST_PB = €15` is the only hardcoded constant** in the lost-PB path.
6. **Year 2 and Year 3 profits = `annualNetFlow`** — no additional fees or depreciation.

### Known Uncertainty

- **`pbLostRate` discrepancy**: When tested with real UI inputs (3 stations, 6 rentals/day, 25 days, 3% lost), the formula `lostPBs = totalRentals × pbLostRate` predicts a lower `Umsatz/Monat` than the UI shows (2,587.50€ predicted vs 2,682€ observed — ~94.50€ gap). The exact lostPBs calculation may involve an internal rounding step or different base. All other formulas verified correct.

### UI Output Labels (German → Variable)

| UI Label | Variable |
|---|---|
| Einstiegsgebühr | `ENTRY_FEE` (1,900) |
| Powerbank Automat | `machineCost` |
| Umsatz / Monat | `umsatz_Mo` |
| Umsatz / Jahr | `umsatz_Jahr` |
| enthaltene Umsatzsteuer (19%) | `vatExtracted` |
| Partnergebühr (12%) | `partnerFeeAmt` |
| Systemgebühr (8%) | `systemFeeAmt` |
| Umsatzshare / Monat | `merchantFeeAmt_Mo` |
| Umsatzshare / Jahr | `merchantFeeAmt_Jahr` |
| Gewinn (1./2./3. Jahr) | `gewinn_Jahr1/2/3` |

---

## Part 2: Frontend Web App (`voozaa-calculator/`)

### Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v3** (dark mode via `class`, amber accent palette)
- No backend — all calculations run client-side

### Project Structure

```
voozaa-calculator/
├── index.html                    # lang="de", class="dark"
├── tailwind.config.js            # darkMode: 'class', Inter font
├── src/
│   ├── types/index.ts            # CalculatorInputs, CalculatorOutputs, StationModel, DEFAULT_INPUTS, STATION_MODELS
│   ├── lib/calculations.ts       # All pure calculation functions + calculate()
│   ├── hooks/useCalculator.ts    # State management — useState + useMemo
│   ├── App.tsx                   # Layout: sticky InputPanel (left) + ResultsPanel (right)
│   ├── index.css                 # Tailwind directives + .card, .section-label utilities
│   └── components/
│       ├── InputPanel.tsx        # 5 sections: Stationen, Betrieb, Preise, Finanzen, Verluste
│       ├── StationSelector.tsx   # 2×2 card grid with qty steppers
│       └── ui/
│           ├── NumberStepper.tsx     # [−] [value] [+] — no sliders
│           ├── CurrencyInput.tsx     # € stepper, 2 decimal display
│           ├── PercentageInput.tsx   # % stepper, stores 0–1 fraction
│           ├── TimeoutDaysChips.tsx  # Chip selector for days 1–7
│           ├── MetricRow.tsx         # Label + formatted value row
│           └── ResultsPanel.tsx      # 6 sections: Investment, Einnahmen, Abzüge, Nettozufluss, Gewinn, ROI
```

### Architecture Decisions

- **No business logic in components** — components only call functions from `src/lib/calculations.ts`
- **Each formula is a named exported pure function** — swapping any formula is a one-line change
- **No HTML sliders** — replaced with: card steppers (stations), NumberStepper (rentals/days), CurrencyInput (rates), PercentageInput (%), TimeoutDaysChips (chips 1–7)
- **InputPanel is sticky** on desktop (`lg:sticky top-20`), results scroll alongside
- **Warning banner** rendered in ResultsPanel when `showWarning === true`
- **Profits color-coded**: emerald-400 (positive), red-400 (negative)

### Running the App

```bash
cd voozaa-calculator
npm run dev       # dev server
npm run build     # production build
```

### Design Tokens

| Role | Tailwind Class |
|---|---|
| App background | `bg-zinc-950` |
| Card/panel | `bg-zinc-900 border border-zinc-800 rounded-xl` |
| Accent value | `text-amber-400 font-semibold tabular-nums` |
| Negative/deduction | `text-red-400` |
| Positive/profit | `text-emerald-400` |
| Section label | `text-xs font-semibold uppercase tracking-widest text-zinc-500` |
| Primary text | `text-zinc-100` |
| Secondary text | `text-zinc-400` |

---

## Corrections Made During This Session

| Issue | Was Wrong | Corrected To |
|---|---|---|
| `timeoutDays` classification | Hardcoded constant = 3 (Section 2 & Section 7) | User-configurable slider (default 3) — moved to Section 1 inputs |
| `rentalsPerDay` UI label | "Vermietungen pro Gerät / Tag" | "vermietete Powerbanks pro Gerät / Tag" |
| Several other UI labels | Various mismatches found via screenshot comparison | See input parameters table above |
