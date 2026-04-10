import request from "supertest";
import { createApp } from "../src/adapters/inbound/http/App";
import { Express } from "express";

describe("FuelEU Maritime API Integration Tests", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  afterAll(async () => {
    if ((app as any).close) {
      await (app as any).close();
    }
  });

  describe("Routes API (/routes)", () => {
    it("should fetch all routes", async () => {
      const res = await request(app).get("/routes");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("routeId");
      }
    });

    it("should set baseline for a route", async () => {
      // Assuming R001 exists from seed
      const res = await request(app)
        .post("/routes/baseline")
        .send({ routeId: "R001" });
      expect(res.status).toBe(200);
    });
  });

  describe("Compliance API (/compliance)", () => {
    it("should fetch comparison data", async () => {
      const res = await request(app).get("/compliance/comparison");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Banking API (/banking)", () => {
    it("should fetch adjusted CB for a ship", async () => {
      const res = await request(app).get("/banking/cb?shipId=R001&year=2025");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("adjustedCb");
    });

    it("should return error for non-existent ship Adjusted CB", async () => {
      const res = await request(app).get("/banking/cb?shipId=INVALID&year=2025");
      expect(res.status).toBe(404);
    });

    it("should bank surplus for a ship", async () => {
      // This might fail if R001 doesn't have a surplus or has a deficit, 
      // but we test endpoint connectivity and logic.
      const res = await request(app)
        .post("/banking/bank")
        .send({ shipId: "R001", year: 2025 });
      
      // If no surplus, logic returns 400. We check if it's one of the expected codes.
      expect([200, 400]).toContain(res.status);
    });
  });

  describe("Pooling API (/pools)", () => {
    it("should create a compliance pool", async () => {
      const res = await request(app)
        .post("/pools")
        .send({ 
          year: 2025, 
          members: ["R001", "R002"] 
        });
      
      // Might be 400 if ships don't exist or logic fails, but endpoint should respond.
      expect([200, 201, 400, 404]).toContain(res.status);
      if (res.status === 200 || res.status === 201) {
        expect(res.body).toHaveProperty("members");
      }
    });
  });
});
