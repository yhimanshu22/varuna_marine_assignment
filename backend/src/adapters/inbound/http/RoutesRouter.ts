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

  // POST /routes/baseline
  router.post("/baseline", async (req, res) => {
    try {
      const { routeId } = req.body;
      const route = await useCase.setBaseline(routeId);
      res.json(route);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
