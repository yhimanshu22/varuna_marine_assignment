# FuelEU Maritime Compliance Platform

## Overview
A full-stack implementation of the Fuel EU Maritime compliance module, catering to Routes Comparison, Banking (Article 20), and Pooling (Article 21).

## Architecture Summary
The application follows a strictly layered **Hexagonal Architecture** (Ports & Adapters) on both the Frontend and Backend to guarantee full separation of concerns between external dependencies (React, REST APIs, Databases) and Core Domain Business Logic.

- **Backend (Node.js + PostgreSQL)**:
  - `core/domain`: Contains `FuelEUCalculator` holding pure formulas (gCO2eq conversions) and mathematical logic.
  - `core/application`: Contains Use Cases such as `ComplianceUseCase` orchestrating logic between the repos.
  - `adapters`: `inbound/http` (Express REST APIs) and `outbound/postgres` (Prisma Clients).
- **Frontend (React + Tailwind)**:
  - `core/domain`: TS Entities mimicking the backend structures.
  - `core/ports`: The HTTP Outbound definition (`IApiClient`).
  - `adapters`: The implementations (Axios) and the UI layer (React Components acting as Driving Adapters).

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- npm

### 1. Database Setup
Ensure PostgreSQL is running locally on port 5432.
Update `backend/.env` with your DB string, e.g. `DATABASE_URL="postgresql://postgres:password@localhost:5432/fueleu"`.

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. `npx prisma migrate dev --name init` (Initializes Schema)
4. `npm run seed` (Seeds the 5 given dataset routes)
5. `npm run dev` (Starts Server on Port 3001)

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts Vite server on local port)

## Execution & Flow
1. Load the UI: **Routes Tab** displays the mocked data.
2. Select **Set Baseline** on R001.
3. Open **Compare Tab**: See actual Target 2025 vs Real performance, and whether a ship is Compliant.
4. Open **Banking Tab**: Bank surplus from compliant ships, or apply them.
5. Open **Pooling Tab**: Put 2+ ships together. The backend calculates deficits and surplus allocations to balance out mathematically according to Art 21.

## Sample Execution screenshots/behaviors
- Setting a route baseline recalculates the differences dynamically.
- Trying to apply banking points that don't exist emits a logical domain error explicitly blocking the math.
- Pooling distributes surpluses iteratively from best ship to worst ship.
