# Reflection

## What I Learned Using AI Agents
Using AI agents allows for a rapid transformation from theoretical architectures into working skeleton codebases. I learned that while agents are incredibly fast at scaffolding, the "last 10%" (integration, environment-specific dependency conflicts, and path synchronization) still requires precise guidance and developer intuition.

## Efficiency Gains vs Manual Coding
- **Boilerplate & CSS**: The system wired up Prisma ORM and built a premium, glassmorphism-themed UI in minutes. Manual CSS for this level of fidelity (grain textures, backdrop blurs) would have taken hours of iteration.
- **Logic Translation**: The AI effectively maintained context over directory layouts, ensuring that business rules like the FuelEU target values (89.3368) were consistently applied from the backend domain to the frontend chart labels.
- **Integration Testing**: Rapidly generating `supertest` suites allowed for a robust verification phase that caught route-naming bugs that might have otherwise persisted to production.

## Improvements I’d Make Next Time
- **Dependency Management**: I encountered a major version conflict between Jest 30 and TypeScript 6 (bleeding edge versions). Next time, I would explicitly lock dev-dependencies to stable LTS versions at the start to avoid "Test Suite Failed" crashes.
- **Structural Sanity Checks**: I observed that multi-file edits can sometimes leave dangling closing tags in JSX. I would implement a manual or automated "Linter-first" check after large structural refactors like the full-screen expansion.
- **Mocking Strategy**: I would prompt the agent to explicitly mock out the HTTP inbound layer earlier to run tests *before* finalizing the UI, maintaining a stricter TDD workflow.
