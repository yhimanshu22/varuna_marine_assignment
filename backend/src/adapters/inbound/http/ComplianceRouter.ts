import { Router } from "express";
import { ComplianceUseCase } from "../../../core/application/ComplianceUseCase";

export const createComplianceRouter = (useCase: ComplianceUseCase) => {
  const router = Router();

  // GET /compliance/cb?shipId&year
  router.get("/cb", async (req, res) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });
      
      const cb = await useCase.computeComplianceBalance(String(shipId), Number(year));
      res.json(cb);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /compliance/adjusted-cb?shipId&year
  router.get("/adjusted-cb", async (req, res) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });
      
      const adjustedCb = await useCase.getAdjustedCB(String(shipId), Number(year));
      res.json({ shipId, year: Number(year), adjustedCb });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export const createBankingRouter = (useCase: ComplianceUseCase) => {
  const router = Router();

  // POST /banking/bank
  router.post("/bank", async (req, res) => {
    try {
      const { shipId, year } = req.body;
      const entry = await useCase.bankSurplus(shipId, year);
      res.json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // POST /banking/apply
  router.post("/apply", async (req, res) => {
    try {
      const { targetShipId, fromShipId, year, amount } = req.body;
      const entry = await useCase.applyBankedSurplus(targetShipId, year, amount, fromShipId);
      res.json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};

export const createPoolingRouter = (useCase: ComplianceUseCase) => {
  const router = Router();

  // POST /pools
  router.post("/", async (req, res) => {
    try {
      const { year, members } = req.body; // members is string[]
      if (!year || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: "Invalid payload" });
      }
      
      const pool = await useCase.createPool(year, members);
      res.json(pool);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
