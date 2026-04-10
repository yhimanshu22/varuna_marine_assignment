import { PrismaClient } from "@prisma/client";
import { IComplianceRepository } from "../../../core/ports/IComplianceRepository";
import { ShipCompliance, BankEntry, Pool, PoolMember } from "../../../core/domain/Entities";

export class PrismaComplianceRepository implements IComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async getShipCompliance(shipId: string, year: number): Promise<ShipCompliance | null> {
    const record = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year }
      }
    });
    return record ? (record as ShipCompliance) : null;
  }

  async saveShipCompliance(compliance: ShipCompliance): Promise<void> {
    await this.prisma.shipCompliance.upsert({
      where: {
        shipId_year: { shipId: compliance.shipId, year: compliance.year }
      },
      update: { cbGco2eq: compliance.cbGco2eq },
      create: {
        id: compliance.id,
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq
      }
    });
  }

  async getBankedEntries(shipId: string, year: number): Promise<BankEntry[]> {
    const records = await this.prisma.bankEntry.findMany({
      where: { shipId, year }
    });
    return records.map(r => r as BankEntry);
  }

  async saveBankEntry(entry: BankEntry): Promise<void> {
    await this.prisma.bankEntry.create({
      data: {
        id: entry.id,
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq
      }
    });
  }

  async createPool(pool: Pool, members: PoolMember[]): Promise<Pool> {
    return await this.prisma.$transaction(async (tx) => {
      const createdPool = await tx.pool.create({
        data: {
          id: pool.id,
          year: pool.year,
          createdAt: pool.createdAt,
          members: {
            create: members.map(m => ({
              shipId: m.shipId,
              cbBefore: m.cbBefore,
              cbAfter: m.cbAfter
            }))
          }
        },
        include: { members: true }
      });
      return createdPool as unknown as Pool; // simplified for assignment typing
    });
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true }
    });
    return pools as unknown as Pool[];
  }
}
