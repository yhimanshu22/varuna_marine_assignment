# AI Agent Workflow Log

## Agents Used
- DeepMind Antigravity Agent (Code Generation & Architecture Definition)

## Prompts & Outputs
- **Example 1: Initializing Hexagonal Architecture**
  - *Prompt*: "Build a minimal yet structured implementation of the Fuel EU Maritime compliance module with: Frontend: React... Backend: Node.js"
  - *Action*: The agent parallelized the instantiation of `src/core/domain`, `src/core/application`, and `src/adapters` using concurrent file writing tools. Generated `Entities.ts` and `FuelEUCalculator.ts`.
- **Example 2: Fixing Windows CLI Issues**
  - *Correction*: The agent encountered Windows folder-locking conflicts when cleaning Vite workspaces. It dynamically corrected the output by modifying the folder scaffolding strategy directly onto `frontend-tmp`.

## Validation / Corrections
- **Imports Tracking**: The agent correctly recognized the difference in path depths between `inbound/http` adapters and the core domain. I validated and patched an `App.ts` lint error directly with regex-replacement tool calls without rebuilding the whole file.
- **Pooling Algorithms**: When implementing the greedy algorithm for Article 21 Pooling, the logic was meticulously guarded by a domain-level validation hook (`validatePool`) preventing deficits from exiting worse than they started.

## Observations
- **Where agent saved time**: Abstracting Express routes away from Business logic. Setting up the Prisma adapter files `PrismaRouteRepository.ts` taking merely seconds. Translating backend calculations into dynamic Recharts React UI.
- **Where it failed or hallucinated**: Shell commands using `rm -rf` locked on the user environment.
- **Combination**: Parallel execution of `npm install` and Node compilation meant zero idle phases during backend generation.

## Best Practices Followed
- Utilized an internal `task.md` scratchpad to track the status globally.
- Created `implementation_plan.md` first before rushing to execution.
- Enforced Clean Architecture interfaces (`IApiClient` frontend, `IComplianceRepository` backend) preventing leakage of framework logic.
