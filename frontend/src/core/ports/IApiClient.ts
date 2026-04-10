import type { Route, ShipCompliance, Pool } from "../domain/Entities";

export interface IApiClient {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<Route[]>;
  
  getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance>;
  getAdjustedCB(shipId: string, year: number): Promise<{ shipId: string, year: number, adjustedCb: number }>;
  
  bankSurplus(shipId: string, year: number): Promise<any>;
  applySurplus(targetShipId: string, fromShipId: string, year: number, amount: number): Promise<any>;
  
  createPool(year: number, members: string[]): Promise<Pool>;
}
