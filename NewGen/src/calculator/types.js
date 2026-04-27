import imgS from '../assets/stations/8-S.png';
import imgM from '../assets/stations/12-M.png';
import imgL from '../assets/stations/24-L.png';
import imgXL from '../assets/stations/48-XL.png';

export const DEFAULT_INPUTS = {
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

export const STATION_MODELS = [
  { id: 'S',  key: 'qty_S',  label: 'Model S',  capacity: 8,  price: 1000, image: imgS },
  { id: 'M',  key: 'qty_M',  label: 'Model M',  capacity: 12, price: 1200, image: imgM },
  { id: 'L',  key: 'qty_L',  label: 'Model L',  capacity: 24, price: 2000, image: imgL },
  { id: 'XL', key: 'qty_XL', label: 'Model XL', capacity: 32, price: 3500, image: imgXL },
];
