import { FuelEUCalculator } from "../src/core/domain/FuelEUCalculator";

describe("FuelEUCalculator Unit Tests", () => {
  it("should calculate correct energy in scope", () => {
    const energy = FuelEUCalculator.calculateEnergyInScope(5000);
    expect(energy).toBe(5000 * 41000); // 205,000,000
  });

  it("should calculate a deficit compliance balance exactly", () => {
    // 5000t -> 205,000,000 MJ
    // Target 89.3368, Actual 91.0 
    // CB = (89.3368 - 91.0) * 205M
    const cb = FuelEUCalculator.calculateComplianceBalance(91.0, 5000);
    const expected = (89.3368 - 91.0) * (5000 * 41000);
    expect(cb).toBe(expected);
    expect(cb).toBeLessThan(0); // Deficit
  });

  it("should calculate a surplus compliance balance exactly", () => {
    const cb = FuelEUCalculator.calculateComplianceBalance(88.0, 4800);
    expect(cb).toBeGreaterThan(0); // Surplus
  });

  it("should block invalid pools with a negative net total", () => {
    const members = [
      { poolId: "1", shipId: "A", cbBefore: -100, cbAfter: -100 },
      { poolId: "1", shipId: "B", cbBefore: 50, cbAfter: 50 }
    ];
    const result = FuelEUCalculator.validatePool(members);
    expect(result.isValid).toBe(false);
  });

  it("should accept valid pools that respect boundaries", () => {
    const members = [
      { poolId: "1", shipId: "A", cbBefore: -50, cbAfter: 0 },
      { poolId: "1", shipId: "B", cbBefore: 100, cbAfter: 50 }
    ];
    const result = FuelEUCalculator.validatePool(members);
    expect(result.isValid).toBe(true);
  });
});
