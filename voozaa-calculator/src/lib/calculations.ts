import type { CalculatorInputs, CalculatorOutputs } from '../types';

// ─── SYSTEM CONSTANTS ─────────────────────────────────────────────────────────
export const ENTRY_FEE = 1900;            // One-time entry fee (€)
export const REPLACEMENT_COST_PB = 15;    // Cost to replace a lost powerbank (€)
export const VAT_RATE = 0.19;             // German MwSt — enthaltene (extracted, not added on top)
export const PARTNER_FEE = 0.12;          // Partner fee on gross revenue
export const SYSTEM_FEE = 0.08;           // System/platform fee on gross revenue

// ─── INVESTMENT ───────────────────────────────────────────────────────────────
export function calcMachineCost(qty_S: number, qty_M: number, qty_L: number, qty_XL: number): number {
  return qty_S * 1000 + qty_M * 1200 + qty_L * 2000 + qty_XL * 3500;
}

export function calcTotalInvestment(machineCost: number): number {
  return ENTRY_FEE + machineCost;
}

// ─── RENTAL REVENUE ───────────────────────────────────────────────────────────
// IMPORTANT: maxDaily does NOT cap rental revenue — it only affects incomePerLostPB
export function calcPricePerRental(hourlyRate: number, rentalHours: number): number {
  return hourlyRate * rentalHours;
}

export function calcTotalRentals(totalStations: number, rentalsPerDay: number, openingDays: number): number {
  return totalStations * rentalsPerDay * openingDays;
}

export function calcRentalRevenue(totalRentals: number, pricePerRental: number): number {
  return totalRentals * pricePerRental;
}

// ─── LOST PB MECHANICS ────────────────────────────────────────────────────────
export function calcLostPBs(totalRentals: number, pbLostRate: number): number {
  return totalRentals * pbLostRate;
}

// deposit can cap income: incomePerLostPB = min(deposit, maxDaily × timeoutDays + 15)
export function calcIncomePerLostPB(deposit: number, maxDaily: number, timeoutDays: number): number {
  return Math.min(deposit, maxDaily * timeoutDays + REPLACEMENT_COST_PB);
}

export function calcNetGainPerLostPB(incomePerLostPB: number): number {
  return incomePerLostPB - REPLACEMENT_COST_PB;
}

export function calcPBRefillGains(lostPBs: number, netGainPerLostPB: number): number {
  return lostPBs * netGainPerLostPB;
}

// ─── ANNUAL CASH FLOW ─────────────────────────────────────────────────────────
// VAT is EXTRACTED from revenue (enthaltene MwSt) — formula: revenue × 0.19/1.19
export function calcVATExtracted(umsatz_Jahr: number): number {
  return umsatz_Jahr * (VAT_RATE / (1 + VAT_RATE));
}

export function calcPartnerFee(umsatz_Jahr: number): number {
  return umsatz_Jahr * PARTNER_FEE;
}

export function calcSystemFee(umsatz_Jahr: number): number {
  return umsatz_Jahr * SYSTEM_FEE;
}

export function calcMerchantFee(umsatz_Jahr: number, merchantShare: number): number {
  return umsatz_Jahr * merchantShare;
}

export function calcAnnualNetFlow(umsatz_Jahr: number, merchantShare: number): number {
  const deductionRate = VAT_RATE / (1 + VAT_RATE) + PARTNER_FEE + SYSTEM_FEE + merchantShare;
  return umsatz_Jahr * (1 - deductionRate);
}

// ─── PROFITS ──────────────────────────────────────────────────────────────────
// Year 1: subtract full investment. Years 2 & 3: = annualNetFlow (no additional costs)
export function calcGewinnJahr1(annualNetFlow: number, totalInvestment: number): number {
  return annualNetFlow - totalInvestment;
}

export function calcGewinnGesamt(annualNetFlow: number, totalInvestment: number): number {
  return 3 * annualNetFlow - totalInvestment;
}

// ─── ROI ──────────────────────────────────────────────────────────────────────
// CRITICAL: denominator is machineCost ONLY — entry fee (€1,900) is excluded
export function calcROIJahr1(gewinn_Jahr1: number, machineCost: number): number {
  if (machineCost === 0) return 0;
  return (gewinn_Jahr1 / machineCost) * 100;
}

export function calcROI3Jahre(gewinn_Gesamt: number, machineCost: number): number {
  if (machineCost === 0) return 0;
  return (gewinn_Gesamt / machineCost) * 100;
}

// ─── MAIN CALCULATE FUNCTION ──────────────────────────────────────────────────
export function calculate(inputs: CalculatorInputs): CalculatorOutputs {
  const {
    qty_S, qty_M, qty_L, qty_XL,
    rentalsPerDay, openingDays,
    hourlyRate, rentalHours, maxDaily, deposit,
    pbLostRate, merchantShare, timeoutDays
  } = inputs;

  // Investment
  const totalStations = qty_S + qty_M + qty_L + qty_XL;
  const machineCost = calcMachineCost(qty_S, qty_M, qty_L, qty_XL);
  const totalInvestment = calcTotalInvestment(machineCost);

  // Revenue
  const pricePerRental = calcPricePerRental(hourlyRate, rentalHours);
  const totalRentals_Mo = calcTotalRentals(totalStations, rentalsPerDay, openingDays);
  const rentalRevenue_Mo = calcRentalRevenue(totalRentals_Mo, pricePerRental);

  // Lost PBs
  const lostPBs_Mo = calcLostPBs(totalRentals_Mo, pbLostRate);
  const incomePerLostPB = calcIncomePerLostPB(deposit, maxDaily, timeoutDays);
  const netGainPerLostPB = calcNetGainPerLostPB(incomePerLostPB);
  const pbRefillGains_Mo = calcPBRefillGains(lostPBs_Mo, netGainPerLostPB);

  // Totals
  const umsatz_Mo = rentalRevenue_Mo + pbRefillGains_Mo;
  const umsatz_Jahr = umsatz_Mo * 12;

  // Deductions (annual)
  const vatExtracted = calcVATExtracted(umsatz_Jahr);
  const partnerFeeAmt = calcPartnerFee(umsatz_Jahr);
  const systemFeeAmt = calcSystemFee(umsatz_Jahr);
  const merchantFeeAmt_Jahr = calcMerchantFee(umsatz_Jahr, merchantShare);
  const merchantFeeAmt_Mo = merchantFeeAmt_Jahr / 12;
  const annualNetFlow = calcAnnualNetFlow(umsatz_Jahr, merchantShare);

  // Profits
  const gewinn_Jahr1 = calcGewinnJahr1(annualNetFlow, totalInvestment);
  const gewinn_Jahr2 = annualNetFlow;
  const gewinn_Jahr3 = annualNetFlow;
  const gewinn_Gesamt = calcGewinnGesamt(annualNetFlow, totalInvestment);

  // ROI
  const roi_Jahr1 = calcROIJahr1(gewinn_Jahr1, machineCost);
  const roi_3Jahre = calcROI3Jahre(gewinn_Gesamt, machineCost);

  // Warning: shown when rental price exceeds maxDaily
  const showWarning = pricePerRental > maxDaily;

  return {
    totalStations, machineCost, totalInvestment,
    pricePerRental, totalRentals_Mo, rentalRevenue_Mo,
    lostPBs_Mo, incomePerLostPB, netGainPerLostPB, pbRefillGains_Mo,
    umsatz_Mo, umsatz_Jahr,
    vatExtracted, partnerFeeAmt, systemFeeAmt,
    merchantFeeAmt_Mo, merchantFeeAmt_Jahr,
    annualNetFlow,
    gewinn_Jahr1, gewinn_Jahr2, gewinn_Jahr3, gewinn_Gesamt,
    roi_Jahr1, roi_3Jahre,
    showWarning,
  };
}
