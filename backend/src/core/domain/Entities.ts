export interface Route {
  id: string; // Internal DB ID
  routeId: string; // e.g. R001
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // actual gCO2e/MJ
  fuelConsumption: number; // tonnes
  distance: number; // km
  totalEmissions: number; // tonnes
  isBaseline: boolean;
}

export interface ShipCompliance {
  id: string;
  shipId: string; // Maps to routeId for this exercise
  year: number;
  cbGco2eq: number; // Compliance Balance
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number; // positive = banked surplus
}

export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}
