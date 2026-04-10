import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import { ManageRoutesUseCase } from "../../../core/application/ManageRoutesUseCase";
import { ComplianceUseCase } from "../../../core/application/ComplianceUseCase";

import { PrismaRouteRepository } from "../../outbound/postgres/PrismaRouteRepository";
import { PrismaComplianceRepository } from "../../outbound/postgres/PrismaComplianceRepository";

import { createRoutesRouter } from "./RoutesRouter";
import { createComplianceRouter, createBankingRouter, createPoolingRouter } from "./ComplianceRouter";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Setup standard adapters
  const prisma = new PrismaClient();
  const routeRepo = new PrismaRouteRepository(prisma);
  const complianceRepo = new PrismaComplianceRepository(prisma);

  // Setup Use Cases
  const routeUseCase = new ManageRoutesUseCase(routeRepo);
  const complianceUseCase = new ComplianceUseCase(complianceRepo, routeRepo);

  // Setup Routes
  app.use("/routes", createRoutesRouter(routeUseCase));
  app.use("/compliance", createComplianceRouter(complianceUseCase));
  app.use("/banking", createBankingRouter(complianceUseCase));
  app.use("/pools", createPoolingRouter(complianceUseCase));

  return app;
}
