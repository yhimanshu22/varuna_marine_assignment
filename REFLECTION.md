# Reflection

## What I Learned Using AI Agents
Using AI agents allows for a rapid transformation from theoretical architectures into working skeleton codebases. Designing a proper Hexagonal Architecture often requires significant boilerplate to correctly invert dependencies. AI agents excelled at scaffolding these boundaries accurately, allowing me to focus exclusively on describing core domain rules like the FuelEU target values (89.3368) instead of repetitive repository typings. 

## Efficiency Gains vs Manual Coding
- **Boilerplate generation**: The system quickly wired up Prisma ORM, Express routers, and TS Configs—a manual process that often consumes the first few hours of a project. Using parallel CLI commands with the agent drastically limited local environment setup bottlenecks.
- **Architectural consistency**: The AI effectively maintained context over directory layouts (`adapters/outbound`, `inbound/http`, `core/domain`), minimizing human translation errors when adhering to clean architecture.
- **Data UI Rendering**: Writing repetitive Table layouts and mapping complex nested structures in Tailwind CSS took seconds versus traditional trial-and-error hand coding.

## Improvements I’d Make Next Time
- **Dependency Flow**: I noticed some tool execution race conditions locally on Windows when creating UI directories while package installations were ongoing. Next time, I would write a single comprehensive declarative file (`package.json` scaffolding script) instead of relying on granular shell commands.
- **Iterative Testing**: I would prompt the agent to explicitly mock out the HTTP inbound layer earlier to run jest tests *before* writing the API routes, maintaining an authentic Test-Driven Development (TDD) workflow alongside the Hexagonal rules.
