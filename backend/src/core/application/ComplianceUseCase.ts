import { IComplianceRepository } from "../ports/IComplianceRepository";
import { IRouteRepository } from "../ports/IRouteRepository";
import { FuelEUCalculator } from "../domain/FuelEUCalculator";
import { Pool, PoolMember, BankEntry, ShipCompliance } from "../domain/Entities";
import { v4 as uuidv4 } from "uuid";

export class ComplianceUseCase {
  constructor(
    private complianceRepo: IComplianceRepository,
    private routeRepo: IRouteRepository
  ) {}

  /**
   * Generates or fetches current pure CB.
   */
  async computeComplianceBalance(shipId: string, year: number): Promise<ShipCompliance> {
    const existing = await this.complianceRepo.getShipCompliance(shipId, year);
    if (existing) return existing;

    const route = await this.routeRepo.getRouteById(shipId);
    if (!route) throw new Error("Ship/Route not found");

    const cbGco2eq = FuelEUCalculator.calculateComplianceBalance(route.ghgIntensity, route.fuelConsumption);
    
    const compliance: ShipCompliance = {
      id: uuidv4(), // we'll generate properly in DB adapter
      shipId: route.id,
      year,
      cbGco2eq
    };
    
    await this.complianceRepo.saveShipCompliance(compliance);
    return compliance;
  }

  /**
   * Fetch Adjusted CB (after banking).
   */
  async getAdjustedCB(shipId: string, year: number): Promise<number> {
    const pureCB = await this.computeComplianceBalance(shipId, year);
    const bankEntries = await this.complianceRepo.getBankedEntries(shipId, year);
    
    // Sum positive bank surplus applications and negative transfers
    const bankTotal = bankEntries.reduce((sum, e) => sum + e.amountGco2eq, 0);
    return pureCB.cbGco2eq + bankTotal;
  }

  /**
   * Banks a positive CB. Validates that current CB is positive.
   */
  async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    const adjustedCb = await this.getAdjustedCB(shipId, year);
    
    if (adjustedCb <= 0) {
      throw new Error(`Ship ${shipId} has a deficit or 0 CB (${adjustedCb}), cannot bank.`);
    }

    const entry: BankEntry = {
      id: uuidv4(),
      shipId,
      year,
      amountGco2eq: adjustedCb // Banking ALL positive CB
    };
    
    await this.complianceRepo.saveBankEntry(entry);
    return entry;
  }

  /**
   * Applies a banked surplus to a deficit.
   * amountToApply must be positive, and represents how much of the bank is consumed.
   * e.amountGco2eq will go up for the deficit ship. (This means giving away bank to this ship)
   * This is a simplified "apply" - normally implies taking from one user to another, 
   * or taking from previous year's bank. Here we will represent it as a new bank entry 
   * (if it comes from external? The spec just says 'applies banked surplus to a deficit'.
   */
  async applyBankedSurplus(shipId: string, year: number, amountToApply: number, fromShipId: string): Promise<BankEntry> {
    const targetCb = await this.getAdjustedCB(shipId, year);
    
    if (targetCb >= 0) {
      throw new Error("Target ship already has surplus, no need to apply banked surplus.");
    }
    
    // Check if source has enough
    const sourceCb = await this.getAdjustedCB(fromShipId, year);
    if (sourceCb < amountToApply) {
      throw new Error(`Insufficient banked surplus available from ${fromShipId}.`);
    }

    // Deduct from source
    await this.complianceRepo.saveBankEntry({
      id: uuidv4(),
      shipId: fromShipId,
      year,
      amountGco2eq: -amountToApply
    });

    // Add to target
    const targetEntry: BankEntry = {
      id: uuidv4(),
      shipId,
      year,
      amountGco2eq: amountToApply
    };
    await this.complianceRepo.saveBankEntry(targetEntry);
    
    return targetEntry;
  }

  /**
   * Creates a pool for the given year and members.
   */
  async createPool(year: number, requestedMembers: string[]): Promise<Pool> {
    const adjustedCBs = await Promise.all(
        requestedMembers.map(async id => ({
            shipId: id,
            cb: await this.getAdjustedCB(id, year)
        }))
    );

    // Greedy allocation strategy:
    // 1. Sort by CB descending (Surplus first, deficits last)
    const sorted = [...adjustedCBs].sort((a, b) => b.cb - a.cb);
    
    const members: PoolMember[] = sorted.map(m => ({
      poolId: '', // placeholder
      shipId: m.shipId,
      cbBefore: m.cb,
      cbAfter: m.cb
    }));

    // Transfer surplus to deficits sequentially
    for (let i = 0; i < members.length; i++) {
      if (members[i].cbAfter <= 0) break; // no more surplus available at this index

      for (let j = members.length - 1; j > i; j--) {
        if (members[j].cbAfter >= 0) continue; // deficit fixed
        
        const surplusAvailable = members[i].cbAfter;
        const deficitNeeded = Math.abs(members[j].cbAfter);
        const transfer = Math.min(surplusAvailable, deficitNeeded);
        
        members[i].cbAfter -= transfer;
        members[j].cbAfter += transfer;

        if (members[i].cbAfter <= 0) break; // this surplus exhausted
      }
    }

    // Validate the pool
    const validation = FuelEUCalculator.validatePool(members);
    if (!validation.isValid) {
      throw new Error(`Pool validation failed: ${validation.error}`);
    }

    // Create DB Pool
    const pool: Pool = {
      id: uuidv4(),
      year,
      createdAt: new Date()
    };
    members.forEach(m => m.poolId = pool.id);

    return this.complianceRepo.createPool(pool, members);
  }

  /**
   * Fetches analytical comparison for all vessels.
   */
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
