import { Route } from "../domain/Entities";

export interface IRouteRepository {
  getAllRoutes(): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | null>;
  getBaselineRoute(): Promise<Route | null>;
  setBaselineRoute(id: string): Promise<Route>;
}
