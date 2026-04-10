import axios from "axios";
import { IApiClient } from "../../core/ports/IApiClient";
import { Route, ShipCompliance, Pool } from "../../core/domain/Entities";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export class AxiosApiClient implements IApiClient {
  async getRoutes(): Promise<Route[]> {
    const res = await axios.get(`${API_BASE}/routes`);
    return res.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const res = await axios.post(`${API_BASE}/routes/${routeId}/baseline`);
    return res.data;
  }

  async getComparison(): Promise<Route[]> {
    const res = await axios.get(`${API_BASE}/routes/comparison`);
    return res.data;
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance> {
    const res = await axios.get(`${API_BASE}/compliance/cb`, { params: { shipId, year } });
    return res.data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<{ shipId: string; year: number; adjustedCb: number }> {
    const res = await axios.get(`${API_BASE}/compliance/adjusted-cb`, { params: { shipId, year } });
    return res.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<any> {
    const res = await axios.post(`${API_BASE}/banking/bank`, { shipId, year });
    return res.data;
  }

  async applySurplus(targetShipId: string, fromShipId: string, year: number, amount: number): Promise<any> {
    const res = await axios.post(`${API_BASE}/banking/apply`, { targetShipId, fromShipId, year, amount });
    return res.data;
  }

  async createPool(year: number, members: string[]): Promise<Pool> {
    const res = await axios.post(`${API_BASE}/pools`, { year, members });
    return res.data;
  }
}

export const apiClient = new AxiosApiClient();
