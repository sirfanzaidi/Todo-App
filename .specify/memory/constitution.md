<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Change Type: MAJOR - Initial constitution ratification

Modified Principles:
- All principles defined for the first time

Added Sections:
- Core Principles (5 principles covering SDD, Agent Behavior, Phase Governance, Technology Stack, Quality Standards)
- Development Workflow
- Governance

Templates Requiring Updates:
- ✅ plan-template.md: Constitution Check section aligns with principles
- ✅ spec-template.md: User story requirements align with SDD workflow
- ✅ tasks-template.md: Task structure reflects phase governance and testing standards

Follow-up TODOs:
- None - all placeholders filled

Rationale for MAJOR version:
- This is the initial ratification of the constitution
- Establishes foundational governance for all five phases of the project
- Sets non-negotiable rules that all future work must follow
-->

# Evolution of Todo Project Constitution

## Core Principles

### I. Spec-Driven Development (SDD) - MANDATORY

**Rule**: No agent may write code without approved specifications and tasks. All development work MUST follow this strict sequence:

1. **Constitution** → Establish governing principles (this document)
2. **Specs** → Define requirements, user stories, and acceptance criteria
3. **Plan** → Design architecture and technical approach
4. **Tasks** → Break down implementation into testable increments
5. **Implement** → Execute approved tasks

**Rationale**: Spec-Driven Development ensures all code is purposeful, traceable, and aligned with business requirements. It prevents scope creep, reduces rework, and creates an auditable trail from requirement to implementation. By requiring approval at each stage, we maintain control over complexity and architectural decisions.

**Non-Negotiable Rules**:
- Specs MUST be approved before planning begins
- Plans MUST be approved before task breakdown
- Tasks MUST be approved before implementation begins
- Code changes without corresponding specs/tasks are PROHIBITED
- Refinement and changes MUST occur at the spec level, not in code

### II. Agent Behavior and Human-Agent Boundaries

**Rule**: This project follows an agent-first development model with strict boundaries:

**Agent Responsibilities**:
- Execute approved specifications and tasks autonomously
- Follow architectural decisions documented in plans and ADRs
- Implement features according to approved technical designs
- Create PHRs (Prompt History Records) for all work
- Suggest ADRs for architecturally significant decisions
- Flag ambiguities and request clarification

**Agent Prohibitions**:
- MUST NOT invent features or requirements not in specifications
- MUST NOT deviate from approved architectural decisions
- MUST NOT write code without approved specs and tasks
- MUST NOT make architectural decisions without human approval
- MUST NOT skip or modify the SDD workflow stages

**Human Responsibilities**:
- Approve specifications, plans, and tasks
- Make final decisions on architectural approaches
- Provide clarification when requirements are ambiguous
- Review and approve ADRs for significant decisions
- No manual coding - all implementation through approved agent tasks

**Rationale**: Clear boundaries prevent confusion, maintain quality control, and ensure architectural consistency. Agents excel at execution; humans excel at judgment and prioritization. This division of labor maximizes both efficiency and quality.

### III. Phase Governance and Scope Control

**Rule**: The Evolution of Todo project spans five phases (Phase I through Phase V). Each phase is strictly scoped by its specification document. Phase boundaries are hard constraints.

**Phase Boundaries**:
- Each phase has a dedicated specification defining its scope
- Features from future phases MUST NOT leak into earlier phases
- Phase completion requires all specified features to be implemented and tested
- Moving to the next phase requires explicit approval and updated specifications
- Cross-phase dependencies MUST be documented in phase specifications

**Specification Evolution**:
- Architecture MAY evolve between phases through updated specs and plans
- Within-phase changes require spec amendments following SDD workflow
- Breaking changes between phases MUST be documented in ADRs
- Legacy compatibility between phases is NOT guaranteed (document migrations)

**Scope Control**:
- Implementation MUST strictly follow the current phase specification
- Future-phase features discovered during implementation MUST be deferred
- Scope changes require returning to spec level and re-approval
- Each phase should deliver independently valuable, testable functionality

**Rationale**: Phase governance prevents scope creep and maintains project momentum. By enforcing phase boundaries, we ensure each phase delivers tangible value without being derailed by future considerations. This enables incremental delivery and reduces risk.

### IV. Technology Stack and Platform Constraints

**Rule**: The Evolution of Todo project MUST use the following technology stack. Deviations require constitutional amendment.

**Backend (All Phases)**:
- **Language**: Python 3.11+
- **Web Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: Neon DB (PostgreSQL-compatible, serverless)
- **API Design**: RESTful APIs with OpenAPI documentation

**Frontend (Phase III and Later)**:
- **Framework**: Next.js (React-based)
- **Language**: TypeScript
- **State Management**: As determined in phase-specific plans

**AI and Agents (Phase III and Later)**:
- **Agent Framework**: OpenAI Agents SDK
- **Protocol**: Model Context Protocol (MCP) for tool integration

**Infrastructure (Phase IV and Later)**:
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Message Queue**: Apache Kafka
- **Deployment**: Cloud-native architecture (provider TBD in phase specs)

**Development Tools (All Phases)**:
- **Testing**: pytest for Python, Jest/React Testing Library for frontend
- **Linting**: Ruff (Python), ESLint (JavaScript/TypeScript)
- **Type Checking**: mypy (Python), TypeScript compiler
- **Version Control**: Git with conventional commits

**Technology Evolution Rules**:
- Core technologies (Python, FastAPI, SQLModel, Neon DB, Next.js) are LOCKED
- Supporting tools may be updated within version constraints (e.g., pytest 7.x → 8.x)
- New tools may be added if they complement (not replace) the stack
- Major technology changes require constitutional amendment

**Rationale**: A consistent technology stack ensures architectural coherence, reduces cognitive load, and enables code reuse across phases. These technologies were chosen for their modern capabilities, strong typing, cloud-native design, and agent integration support.

### V. Quality Standards and Architectural Principles

**Rule**: All code MUST adhere to the following quality standards and architectural principles:

**Clean Architecture**:
- Clear separation of concerns (models, services, controllers, infrastructure)
- Business logic independent of frameworks and UI
- Dependencies point inward (infrastructure depends on business logic, not vice versa)
- Testable core logic without external dependencies

**Stateless Services**:
- API endpoints MUST be stateless where feasible
- State stored in database or external state stores (Redis, etc.)
- No in-memory session state that prevents horizontal scaling
- Idempotent operations where possible

**Separation of Concerns**:
- Models: Data structures and domain logic only
- Services: Business logic and orchestration
- Controllers/Routes: HTTP handling and validation
- Infrastructure: Database, external APIs, message queues
- Tests: Independent of implementation details where possible

**Cloud-Native Readiness**:
- Services MUST support horizontal scaling
- Configuration via environment variables (12-factor app)
- Logging to stdout/stderr for aggregation
- Health check endpoints for orchestration
- Graceful shutdown and startup
- Containerizable (Dockerfile in each service)

**Code Quality Standards**:
- Type hints MUST be used for all Python functions
- TypeScript MUST use strict mode
- Test coverage targets: 80%+ for business logic
- No compiler/linter warnings in production code
- All public APIs MUST have OpenAPI/docstring documentation

**Performance Standards**:
- API endpoints: p95 latency < 500ms (Phase I-II), < 200ms (Phase III+)
- Database queries: Indexed for common access patterns
- Frontend: First Contentful Paint < 1.5s (Phase III+)
- Memory: Services MUST run efficiently in containerized environments

**Security Standards**:
- Authentication and authorization MUST be enforced at API layer
- Input validation MUST occur before business logic
- Secrets MUST be stored in environment variables or secret managers
- SQL injection prevention through ORM (SQLModel)
- HTTPS/TLS for all production traffic
- OWASP Top 10 vulnerabilities MUST be addressed

**Testing Standards**:
- Unit tests for business logic and services
- Integration tests for API endpoints
- Contract tests for external APIs
- End-to-end tests for critical user journeys (Phase III+)
- Tests MUST be automated and run in CI/CD
- Test data MUST be isolated and reproducible

**Rationale**: These principles ensure the codebase remains maintainable, scalable, and secure as the project grows across five phases. Clean architecture and separation of concerns enable independent evolution of components. Cloud-native readiness ensures the system can scale to meet demand. Quality and security standards protect users and reduce technical debt.

## Development Workflow

**Workflow Stages** (MUST be followed in order):

1. **Constitution Review**: Verify the work aligns with constitutional principles
2. **Specification**: Create or update feature specs with user stories and acceptance criteria
3. **Clarification** (if needed): Use `/sp.clarify` to resolve ambiguities in specs
4. **Planning**: Design architecture, create data models, define contracts
5. **Task Breakdown**: Decompose plan into testable, independently valuable tasks
6. **Implementation**: Execute tasks following TDD (test-first where applicable)
7. **Review**: Code review, testing, quality gates
8. **Documentation**: Update ADRs, create PHRs, update quickstart/runbooks

**Mandatory Artifacts**:
- **Constitution**: This document (project-level)
- **Specs**: Feature specifications with user stories (`specs/<feature>/spec.md`)
- **Plans**: Architecture and technical design (`specs/<feature>/plan.md`)
- **Tasks**: Implementation checklist (`specs/<feature>/tasks.md`)
- **PHRs**: Prompt History Records (`history/prompts/<category>/`)
- **ADRs**: Architecture Decision Records (`history/adr/`)

**Quality Gates**:
- Specs MUST include prioritized user stories and acceptance criteria
- Plans MUST pass constitution check and identify architectural decisions
- Tasks MUST be testable and map to user stories
- Code MUST pass linting, type checking, and tests before merge
- ADRs MUST be created for significant architectural decisions
- PHRs MUST be created for all agent interactions (except `/sp.phr` itself)

**Review and Approval**:
- All specs require human approval before planning
- All plans require human approval before task breakdown
- All tasks require human approval before implementation
- Agents MUST flag ambiguities and request clarification
- Agents MUST suggest ADRs but NOT create them without consent

## Governance

**Constitutional Authority**: This constitution supersedes all other practices, conventions, and preferences. In case of conflict, constitutional rules take precedence.

**Amendment Process**:
1. Proposed amendments MUST be documented with rationale
2. Impact analysis MUST identify affected specs, plans, and code
3. Amendments require explicit human approval
4. Amendments trigger version bump (see Versioning Policy)
5. Migration plan required for MAJOR amendments affecting existing code
6. All dependent templates and docs MUST be updated after amendment

**Versioning Policy** (Semantic Versioning):
- **MAJOR** (X.0.0): Backward-incompatible governance changes, principle removals or redefinitions
- **MINOR** (0.X.0): New principles added, sections expanded, new requirements introduced
- **PATCH** (0.0.X): Clarifications, wording improvements, typo fixes, non-semantic refinements

**Compliance and Enforcement**:
- All PRs and agent outputs MUST verify compliance with this constitution
- Constitution violations MUST be rejected during review
- Complexity and deviations MUST be justified in plan documents
- Agents MUST create PHRs for all work (except `/sp.phr` command itself)
- Agents MUST suggest ADRs for architecturally significant decisions

**Constitution Review Cadence**:
- Constitution MUST be reviewed at phase boundaries (before starting new phase)
- Constitution MAY be amended within phases for clarifications (PATCH)
- Constitution SHOULD be amended between phases for new requirements (MINOR/MAJOR)
- Review ensures principles remain relevant and enforceable

**Conflict Resolution**:
- Constitutional principles override template guidance
- Explicit spec requirements override default architectural patterns
- Approved ADRs override default technology choices within constitutional constraints
- When in doubt, agents MUST ask for human clarification

**Phase-Specific Governance**:
- Each phase MUST have a specification defining its scope and features
- Phase specs MUST align with constitutional principles
- Phase boundaries are enforcement points for architectural consistency
- Cross-phase changes require returning to spec level and re-approval

---

**Version**: 1.0.0 | **Ratified**: 2025-12-28 | **Last Amended**: 2025-12-28
