import { Router } from "express";
import { ManageRoutesUseCase } from "../../../core/application/ManageRoutesUseCase";
import { Logger } from "../../../shared/utils/Logger";

export const createRoutesRouter = (useCase: ManageRoutesUseCase) => {
  const router = Router();

  // GET /routes
  router.get("/", async (req, res) => {
    try {
      const routes = await useCase.getAllRoutes();
      res.json(routes);
    } catch (err: any) {
      Logger.error(`Routes API Error (GET /): ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /routes/:id/baseline
  router.post("/:id/baseline", async (req, res) => {
    try {
      Logger.info(`Setting baseline for route: ${req.params.id}`);
      const route = await useCase.setBaseline(req.params.id);
      res.json(route);
    } catch (err: any) {
      Logger.error(`Routes API Error (POST /baseline): ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  });

  // GET /routes/comparison
  router.get("/comparison", async (req, res) => {
    try {
      const comp = await useCase.getComparison();
      // Map isCompliant to compliant as per spec
      const mapped = comp.map(c => ({
          ...c,
          compliant: c.isCompliant
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
