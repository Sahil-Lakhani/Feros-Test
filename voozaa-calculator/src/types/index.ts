export interface CalculatorInputs {
  qty_S: number;
  qty_M: number;
  qty_L: number;
  qty_XL: number;
  rentalsPerDay: number;    // default 8, step 0.5 — vermietete Powerbanks pro Gerät / Tag
  openingDays: number;      // default 30, step 0.5 — Öffnungstage / Monat
  hourlyRate: number;       // default 1.00, step 0.05, € — Mietgebühr / Std.
  rentalHours: number;      // default 2, step 0.5 — durchschnittliche Mietdauer / Std.
  maxDaily: number;         // default 10.00, step 0.5, € — max. / Tag
  deposit: number;          // default 45, € — Deposit
  pbLostRate: number;       // default 0.05 (stored as 0–1 fraction) — PB Lost Quote
  merchantShare: number;    // default 0.20 (stored as 0–1 fraction) — Umsatzshare %
  timeoutDays: number;      // default 3, step 1 — Time-Out Days (user-configurable slider)
}

export interface CalculatorOutputs {
  // Investment
  totalStations: number;
  machineCost: number;
  totalInvestment: number;
  // Monthly
  pricePerRental: number;
  totalRentals_Mo: number;
  rentalRevenue_Mo: number;
  lostPBs_Mo: number;
  incomePerLostPB: number;
  netGainPerLostPB: number;
  pbRefillGains_Mo: number;
  umsatz_Mo: number;
  // Annual
  umsatz_Jahr: number;
  vatExtracted: number;
  partnerFeeAmt: number;
  systemFeeAmt: number;
  merchantFeeAmt_Mo: number;
  merchantFeeAmt_Jahr: number;
  annualNetFlow: number;
  // Profits
  gewinn_Jahr1: number;
  gewinn_Jahr2: number;
  gewinn_Jahr3: number;
  gewinn_Gesamt: number;
  // ROI
  roi_Jahr1: number;
  roi_3Jahre: number;
  // UX
  showWarning: boolean;
}

export interface StationModel {
  id: 'S' | 'M' | 'L' | 'XL';
  key: 'qty_S' | 'qty_M' | 'qty_L' | 'qty_XL';
  label: string;
  capacity: number;
  price: number;
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  qty_S: 5,
  qty_M: 0,
  qty_L: 0,
  qty_XL: 0,
  rentalsPerDay: 1.5,
  openingDays: 27,
  hourlyRate: 4.00,
  rentalHours: 2,
  maxDaily: 15.00,
  deposit: 45,
  pbLostRate: 0.03,
  merchantShare: 0.10,
  timeoutDays: 3,
};

export const STATION_MODELS: StationModel[] = [
  { id: 'S',  key: 'qty_S',  label: 'Model S x 8PB',   capacity: 8,  price: 1000 },
  { id: 'M',  key: 'qty_M',  label: 'Model M x 12PB',  capacity: 12, price: 1200 },
  { id: 'L',  key: 'qty_L',  label: 'Model L x 24PB',  capacity: 24, price: 2000 },
  { id: 'XL', key: 'qty_XL', label: 'Model XL x 32PB', capacity: 32, price: 3500 },
];
