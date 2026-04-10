import { Router } from "express";
import { ManageRoutesUseCase } from "../../../core/application/ManageRoutesUseCase";

export const createRoutesRouter = (useCase: ManageRoutesUseCase) => {
  const router = Router();

  // GET /routes
  router.get("/", async (req, res) => {
    try {
      const routes = await useCase.getAllRoutes();
      res.json(routes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /routes/:id/baseline
  router.post("/:id/baseline", async (req, res) => {
    try {
      const route = await useCase.setBaseline(req.params.id);
      res.json(route);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // GET /routes/comparison
  router.get("/comparison", async (req, res) => {
    try {
      const comp = await useCase.getComparison();
      res.json(comp);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
