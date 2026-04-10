import { ShipCompliance, BankEntry, Pool, PoolMember } from "../domain/Entities";

export interface IComplianceRepository {
  getShipCompliance(shipId: string, year: number): Promise<ShipCompliance | null>;
  saveShipCompliance(compliance: ShipCompliance): Promise<void>;
  
  // Banking
  getBankedEntries(shipId: string, year: number): Promise<BankEntry[]>;
  saveBankEntry(entry: BankEntry): Promise<void>;

  // Pooling
  createPool(pool: Pool, members: PoolMember[]): Promise<Pool>;
  getPoolsByYear(year: number): Promise<Pool[]>;
}
