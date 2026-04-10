import { PrismaClient } from "@prisma/client";
import { IRouteRepository } from "../../../core/ports/IRouteRepository";
import { Route } from "../../../core/domain/Entities";

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllRoutes(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany();
    return routes.map((r: any) => r as Route);
  }

  async getRouteById(id: string): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({ where: { routeId: id } });
    return route ? (route as Route) : null;
  }

  async getBaselineRoute(): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({ where: { isBaseline: true } });
    return route ? (route as Route) : null;
  }

  async setBaselineRoute(routeId: string): Promise<Route> {
    // Reset all others to false
    await this.prisma.route.updateMany({ data: { isBaseline: false } });
    
    // Set requested one to true
    const updated = await this.prisma.route.update({
      where: { routeId }, 
      data: { isBaseline: true }
    });
    
    return updated as Route;
  }
}
