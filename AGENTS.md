# Agent Constitution & Rules

This document defines the core principles, behaviors, and rules for AI agents working on the Hackathon Todo project.

## Project Vision

Build a production-ready todo application through iterative phases, demonstrating modern software development practices including:
- Spec-Driven Development (SDD)
- Progressive enhancement through phases
- Proper documentation and architecture decisions
- Production deployment patterns

## Agent Principles

### 1. Clarity Over Cleverness
- Write explicit, readable code
- Prefer simple solutions over complex abstractions
- Document architectural decisions in ADRs
- Keep specs and plans synchronized with implementation

### 2. Test-Driven Quality
- Write tests before implementation (Red-Green-Refactor)
- Maintain high test coverage
- Validate against acceptance criteria
- Document test strategies in plans

### 3. Incremental Progress
- Work in small, verifiable steps
- Complete one phase before starting the next
- Maintain backward compatibility when evolving
- Track progress through PHRs (Prompt History Records)

### 4. Production-First Mindset
- Security by default (no hardcoded secrets, proper auth)
- Error handling and validation at boundaries
- Observability (logging, metrics, tracing)
- Deployment readiness from day one

## Phase-Specific Guidelines

### Phase 1: Console App
- Focus: Core business logic and data models
- Keep it simple: CLI-only, no web dependencies
- Establish patterns for data persistence
- Write comprehensive unit tests

### Phase 2: Web Application
- Focus: RESTful API and modern web UI
- Separate concerns: frontend and backend
- Implement proper authentication and authorization
- Add API documentation (OpenAPI/Swagger)

### Phase 3: Chatbot Integration
- Focus: Natural language interface via MCP
- Extend Phase 2 without breaking it
- Follow MCP protocol specifications
- Design conversational flows carefully

### Phase 4: Kubernetes
- Focus: Container orchestration and scalability
- Create production-grade Helm charts
- Design for high availability
- Plan resource limits and autoscaling

### Phase 5: Cloud & CI/CD
- Focus: Infrastructure automation and deployment
- Use Infrastructure as Code (Terraform)
- Implement comprehensive CI/CD pipelines
- Set up monitoring and alerting

## Decision-Making Framework

### When to Create ADRs
Run the three-part test:
1. **Impact**: Does this have long-term consequences?
2. **Alternatives**: Are there multiple viable approaches?
3. **Scope**: Does this influence the broader system design?

If all three are YES, create an ADR using `/sp.adr <title>`

### When to Create PHRs
After every user interaction that involves:
- Code changes or implementation work
- Architectural or planning discussions
- Debugging or problem-solving
- Spec, plan, or task creation

Use the appropriate routing:
- `history/prompts/constitution/` - Project principles
- `history/prompts/<feature-name>/` - Feature work
- `history/prompts/general/` - General tasks

## Code Quality Standards

### Security
- Never commit secrets or credentials
- Use environment variables for configuration
- Validate and sanitize all inputs
- Follow OWASP top 10 guidelines
- Implement proper CORS and CSRF protection

### Performance
- Design for scalability from the start
- Implement caching where appropriate
- Optimize database queries (use indexes)
- Monitor and profile performance bottlenecks

### Maintainability
- Follow consistent naming conventions
- Write self-documenting code
- Add comments only for non-obvious logic
- Keep functions small and focused
- Use type hints (Python) and TypeScript (frontend)

## Agent Collaboration

### With Users
- Ask clarifying questions before making assumptions
- Present options when multiple approaches exist
- Explain architectural tradeoffs clearly
- Confirm significant changes before proceeding

### With Other Agents
- Respect phase boundaries and dependencies
- Share patterns and learnings via documentation
- Keep specs and implementation in sync
- Use PHRs to maintain context across sessions

## Anti-Patterns to Avoid

❌ **Don't:**
- Make changes without reading existing code first
- Add features beyond what was requested
- Skip testing "because it's simple"
- Hardcode configuration or secrets
- Create abstractions prematurely
- Ignore existing patterns in the codebase

✅ **Do:**
- Read before writing
- Follow the spec
- Write tests first
- Use environment variables
- Keep it simple (YAGNI - You Aren't Gonna Need It)
- Maintain consistency with existing code

## Monorepo Structure

All phases are organized under:
```
hackathon-todo/
├── specs/          # Specifications for each phase
├── phases/         # Implementation code for each phase
├── shared/         # Shared utilities (use sparingly)
└── history/        # PHRs and ADRs
```

Respect phase isolation:
- Phase 1 has no dependencies
- Phase 2 builds on Phase 1 concepts (but separate code)
- Phase 3+ extend Phase 2
- Use `shared/` only for truly common code

## Success Metrics

A successful agent session includes:
- ✅ Clear understanding of user intent
- ✅ Spec-driven approach (spec → plan → tasks → implementation)
- ✅ All tests passing
- ✅ PHR created and properly categorized
- ✅ ADR suggested for significant decisions
- ✅ Code follows project conventions
- ✅ Documentation updated as needed

---

**Remember**: The goal is not just working code, but maintainable, testable, production-ready software that demonstrates best practices across all phases.
