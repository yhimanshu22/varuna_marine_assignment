import { Route, PoolMember } from "./Entities";

export class FuelEUCalculator {
  // Fuel EU Maritime 2025 Target
  public static readonly TARGET_INTENSITY_2025 = 89.3368; // gCO2e/MJ
  public static readonly ENERGY_PER_TONNE = 41000; // MJ/t

  /**
   * Calculates the Energy in scope (MJ)
   * Formula: fuelConsumption (t) * 41,000 MJ/t
   */
  public static calculateEnergyInScope(fuelConsumptionTonnes: number): number {
    return fuelConsumptionTonnes * this.ENERGY_PER_TONNE;
  }

  /**
   * Calculates Compliance Balance (CB) in gCO2eq
   * Formula: (Target - Actual) * Energy in scope
   * Positive = Surplus, Negative = Deficit
   */
  public static calculateComplianceBalance(
    actualIntensity: number,
    fuelConsumptionTonnes: number
  ): number {
    const energyInScope = this.calculateEnergyInScope(fuelConsumptionTonnes);
    return (this.TARGET_INTENSITY_2025 - actualIntensity) * energyInScope;
  }

  /**
   * Calculates percentage difference between a comparison intensity and a baseline
   * percentDiff = ((comparison / baseline) - 1) * 100
   */
  public static calculateIntensityDifference(
    comparisonIntensity: number,
    baselineIntensity: number
  ): number {
    if (baselineIntensity === 0) return 0; // Guard against division by zero
    return ((comparisonIntensity / baselineIntensity) - 1) * 100;
  }

  /**
   * Validates if a pool is mathematically valid according to Article 21
   * 1. Sum(CB) >= 0
   * 2. Deficit ship cannot exit worse (cbAfter >= cbBefore)
   * 3. Surplus ship cannot exit negative (cbAfter >= 0)
   */
  public static validatePool(members: PoolMember[]): { isValid: boolean; error?: string } {
    const totalCB = members.reduce((sum, m) => sum + m.cbAfter, 0); // After allocation, sum should be same as before conceptually
    const originalSum = members.reduce((sum, m) => sum + m.cbBefore, 0);

    // Sum(adjustedCB) >= 0
    if (originalSum < 0) {
      return { isValid: false, error: "Total pooled Compliance Balance is negative." };
    }

    // Verify mathematical integrity of allocations (no created/destroyed CB)
    // allowing small floating point drift
    if (Math.abs(totalCB - originalSum) > 0.01) {
       return { isValid: false, error: "Allocation total does not equal original total." };
    }

    for (const m of members) {
      if (m.cbBefore < 0) {
        // Deficit ship cannot exit worse
        if (m.cbAfter < m.cbBefore) {
          return { isValid: false, error: `Deficit ship ${m.shipId} exited with a worse CB.` };
        }
      } else {
        // Surplus ship cannot exit negative
        if (m.cbAfter < 0) {
          return { isValid: false, error: `Surplus ship ${m.shipId} exited with a negative CB.` };
        }
      }
    }

    return { isValid: true };
  }
}
