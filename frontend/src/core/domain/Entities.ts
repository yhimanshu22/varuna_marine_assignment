export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  percentDiff?: number;
  isCompliant?: boolean;
}

export interface ShipCompliance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
}

export interface Pool {
  id: string;
  year: number;
  createdAt: string;
  members?: PoolMember[];
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}
