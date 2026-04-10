import { ComplianceUseCase } from "../src/core/application/ComplianceUseCase";

describe("ComplianceUseCase Deep Unit Tests", () => {
  let useCase: ComplianceUseCase;
  let mockCompRepo: any;
  let mockRouteRepo: any;

  beforeEach(() => {
    mockCompRepo = {
      getShipCompliance: jest.fn(),
      getBankedEntries: jest.fn(),
      saveShipCompliance: jest.fn(),
      saveBankEntry: jest.fn(),
      createPool: jest.fn()
    };
    mockRouteRepo = {
      getRouteById: jest.fn(),
      getAllRoutes: jest.fn(),
      getBaselineRoute: jest.fn()
    };
    useCase = new ComplianceUseCase(mockCompRepo, mockRouteRepo);
  });

  describe("bankSurplus", () => {
    it("should throw error if ship has a deficit", async () => {
      // Mock a negative CB
      mockCompRepo.getShipCompliance.mockResolvedValue({ cbGco2eq: -1000 });
      mockCompRepo.getBankedEntries.mockResolvedValue([]);
      
      await expect(useCase.bankSurplus("R001", 2025))
        .rejects.toThrow(/has a deficit/);
    });

    it("should successfully bank a surplus", async () => {
      mockCompRepo.getShipCompliance.mockResolvedValue({ cbGco2eq: 5000 });
      mockCompRepo.getBankedEntries.mockResolvedValue([]);
      
      const entry = await useCase.bankSurplus("R001", 2025);
      expect(entry.amountGco2eq).toBe(5000);
      expect(mockCompRepo.saveBankEntry).toHaveBeenCalled();
    });
  });

  describe("applyBankedSurplus", () => {
    it("should throw error if target ship already has surplus", async () => {
      // Target has 2000 surplus
      mockCompRepo.getShipCompliance.mockResolvedValue({ cbGco2eq: 2000 });
      mockCompRepo.getBankedEntries.mockResolvedValue([]);

      await expect(useCase.applyBankedSurplus("TARGET", 2025, 1000, "SOURCE"))
        .rejects.toThrow("Target ship already has surplus");
    });

    it("should throw error if source has insufficient banked surplus", async () => {
      // Target has deficit -5000
      mockCompRepo.getShipCompliance.mockImplementation((id: string) => {
          if (id === "TARGET") return Promise.resolve({ cbGco2eq: -5000 });
          if (id === "SOURCE") return Promise.resolve({ cbGco2eq: 1000 });
          return Promise.resolve(null);
      });
      mockCompRepo.getBankedEntries.mockResolvedValue([]);

      // Try to apply 2000 when source only has 1000
      await expect(useCase.applyBankedSurplus("TARGET", 2025, 2000, "SOURCE"))
        .rejects.toThrow("Insufficient banked surplus");
    });
  });

  describe("createPool", () => {
     it("should sort members and allocate surplus correctly", async () => {
        mockRouteRepo.getAllRoutes.mockResolvedValue([
            { id: "A", ghgIntensity: 100, fuelConsumption: 1 }, // Deficit
            { id: "B", ghgIntensity: 80, fuelConsumption: 1 }   // Surplus
        ]);
        // Simple mock CBs
        mockCompRepo.getShipCompliance.mockImplementation((id: string) => {
            if (id === "A") return Promise.resolve({ cbGco2eq: -1000 });
            if (id === "B") return Promise.resolve({ cbGco2eq: 1000 });
            return Promise.resolve(null);
        });
        mockCompRepo.getBankedEntries.mockResolvedValue([]);
        mockCompRepo.createPool.mockImplementation((p: any, m: any) => ({ ...p, members: m }));

        const pool: any = await useCase.createPool(2025, ["A", "B"]);
        
        // Net zero pool
        expect(pool.members.find((m: any) => m.shipId === "A").cbAfter).toBe(0);
        expect(pool.members.find((m: any) => m.shipId === "B").cbAfter).toBe(0);
     });
  });
});
