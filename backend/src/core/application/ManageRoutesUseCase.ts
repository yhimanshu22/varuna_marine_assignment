import { IRouteRepository } from "../ports/IRouteRepository";
import { FuelEUCalculator } from "../domain/FuelEUCalculator";

export class ManageRoutesUseCase {
  constructor(private routeRepo: IRouteRepository) {}

  async getAllRoutes() {
    return this.routeRepo.getAllRoutes();
  }

  async setBaseline(routeId: string) {
    return this.routeRepo.setBaselineRoute(routeId);
  }

  async getComparison() {
    const routes = await this.routeRepo.getAllRoutes();
    const baseline = await this.routeRepo.getBaselineRoute();
    
    // Use true baseline if set, otherwise fallback to 2025 Target
    const baselineIntensity = baseline ? baseline.ghgIntensity : FuelEUCalculator.TARGET_INTENSITY_2025;

    return routes.map(route => {
      const percentDiff = FuelEUCalculator.calculateIntensityDifference(route.ghgIntensity, baselineIntensity);
      // Compliant if Actual <= Target (89.3368)
      const isCompliant = route.ghgIntensity <= FuelEUCalculator.TARGET_INTENSITY_2025;
      
      return {
        ...route,
        percentDiff: Number(percentDiff.toFixed(2)),
        isCompliant
      };
    });
  }
}
