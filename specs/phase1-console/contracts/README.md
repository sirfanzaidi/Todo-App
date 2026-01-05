# Contracts: Phase I - In-Memory Console Todo Application

**Feature**: Phase I - In-Memory Console Todo Application
**Date**: 2025-12-28
**Status**: Not Applicable (N/A)

## Overview

This directory typically contains API contracts (OpenAPI/Swagger specs, GraphQL schemas, gRPC proto files) for services with external interfaces. **Phase I does not have any API contracts** because it is a console-only application with no web endpoints, REST APIs, or external service integrations.

---

## Why No Contracts for Phase I?

### Application Type: Console Application
Phase I is a command-line interface (CLI) application that:
- Runs locally on the user's machine
- Has no network connectivity
- Does not expose HTTP endpoints
- Does not provide programmatic APIs
- Does not integrate with external services

### Spec Requirements Exclude APIs
From Phase I specification (`spec.md`):
- **Out of Scope**: "Web interface or API endpoints"
- **Constraints**: "Console/terminal application only"
- **FR-001**: "System MUST provide a text-based menu interface" (not API interface)

### Internal Interfaces Only
Phase I has internal Python method signatures (TaskManager class), but these are:
- **Not external contracts**: Only used within the application
- **Not versioned**: No backwards compatibility concerns
- **Documented elsewhere**: See `data-model.md` and `plan.md` for internal method contracts

---

## Internal Method Contracts (Reference)

For internal Python method signatures, see:

### TaskManager Service Interface

**Location**: `specs/001-phase-i-console/plan.md` (Phase 1: Design & Contracts section)

**Summary of Internal Methods**:
```python
class TaskManager:
    def add_task(self, description: str) -> Task | None
    def get_task(self, task_id: int) -> Task | None
    def get_all_tasks(self) -> list[Task]
    def update_task(self, task_id: int, new_description: str) -> Task | None
    def delete_task(self, task_id: int) -> bool
    def mark_complete(self, task_id: int) -> Task | None
    def mark_incomplete(self, task_id: int) -> Task | None
```

**These are NOT API contracts** because:
- They are Python methods, not HTTP endpoints
- They are called internally (CLI layer), not by external clients
- They have no network serialization (JSON, XML, Protobuf)
- They have no authentication or authorization requirements
- They do not need versioning or backwards compatibility

---

## When Will Contracts Be Added?

### Phase II: Persistence + REST API (Future)

When Phase II adds FastAPI web endpoints, this directory will contain:

**Expected Files** (Phase II+):
```
contracts/
├── openapi.yaml          # OpenAPI 3.0+ specification
├── todo-api-v1.json      # JSON schema for v1 endpoints
└── examples/
    ├── add-task-request.json
    ├── add-task-response.json
    ├── get-tasks-response.json
    └── error-response.json
```

**Contract Examples** (Phase II):
```yaml
# openapi.yaml (excerpt)
openapi: 3.0.0
info:
  title: Todo API
  version: 1.0.0
paths:
  /tasks:
    post:
      summary: Create a new task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                description:
                  type: string
                  minLength: 1
                  example: "Buy groceries"
      responses:
        '201':
          description: Task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
```

### Phase III: GraphQL or Advanced APIs (Future)

If Phase III adds GraphQL, contracts might include:
```
contracts/
└── schema.graphql        # GraphQL schema definition
```

---

## Contract-Like Documentation in Phase I

While Phase I has no formal API contracts, the following documents serve similar purposes for internal interfaces:

### 1. Data Model (`data-model.md`)
- Defines Task entity structure
- Specifies validation rules
- Documents state transitions
- Equivalent to API schema for internal use

### 2. Implementation Plan (`plan.md`)
- Documents TaskManager method signatures
- Specifies input/output contracts
- Defines error handling behavior
- Equivalent to API endpoint specifications for internal methods

### 3. Feature Specification (`spec.md`)
- Defines user-facing behavior
- Specifies CLI interaction flows
- Documents expected outputs
- Equivalent to API documentation for CLI interactions

---

## Summary

**Phase I Status**: ✅ No contracts needed (console application)
**Phase II Status**: 🔄 OpenAPI contracts will be added (REST API)
**Phase III+ Status**: 🔮 Additional contracts as needed (GraphQL, gRPC, etc.)

**For Phase I Implementation**:
- Focus on internal Python interfaces (see `plan.md`)
- No need to design API contracts
- No need to consider HTTP status codes, JSON serialization, or REST conventions
- Keep it simple: Python methods with type hints

**For Future Phases**:
- This directory will be populated with formal API contracts
- OpenAPI/Swagger specs for REST endpoints
- GraphQL schemas if applicable
- Contract testing will be added to test suite

---

## References

- **Phase I Specification**: `specs/001-phase-i-console/spec.md`
- **Implementation Plan**: `specs/001-phase-i-console/plan.md` (see "Phase 1: Design & Contracts" section)
- **Data Model**: `specs/001-phase-i-console/data-model.md` (see "Task Entity" definition)
- **Constitution**: `.specify/memory/constitution.md` (see technology stack: FastAPI for Phase II+)

---

**Last Updated**: 2025-12-28
**Next Update**: Phase II planning (when REST API is added)
