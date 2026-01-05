# Implementation Plan: Phase III - AI-Powered Natural Language Todo Interface

**Branch**: `003-phase-iii-ai-chat` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-phase-iii-ai-chat/spec.md`

## Summary

Phase III extends the Evolution of Todo application with an AI-powered conversational chatbot interface, enabling users to manage their todo items through natural language while preserving all existing Phase II web UI functionality. The implementation adds:

1. **Backend AI Layer**: OpenAI Agents SDK integrated with MCP (Model Context Protocol) server exposing 5 stateless tools (add_task, list_tasks, update_task, delete_task, complete_task)
2. **Conversation Persistence**: New SQLModel entities (Conversation, Message) stored in Neon PostgreSQL for full conversation history across sessions
3. **Stateless Chat Endpoint**: FastAPI POST `/api/{user_id}/chat` endpoint that authenticates users, loads conversation history, invokes AI agent with MCP tools, and persists responses
4. **Frontend Chat Interface**: OpenAI ChatKit web component integrated into Next.js app, protected by Phase II Better Auth
5. **Agent System Prompt**: Configured to interpret natural language for 5 basic todo operations, confirm actions, handle ambiguity, and politely reject advanced features

**Technical Approach**: Stateless architecture where all state (conversations, messages, tasks) is persisted in the database. MCP tools reuse existing Phase II task CRUD logic but accept user_id parameter for authentication. AI agent acts as a natural language interface layer on top of existing functionality without modifying the Phase II Task model or REST API.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript/ES2020+ (frontend)
**Primary Dependencies**:
- Backend: OpenAI Agents SDK (Python), Model Context Protocol SDK (modelcontextprotocol/python-sdk), FastAPI, SQLModel, Neon PostgreSQL client
- Frontend: OpenAI ChatKit (web component), Next.js 13+, React 18+

**Storage**: Neon Serverless PostgreSQL (extends Phase II schema with Conversation and Message tables)
**Testing**: pytest (backend Python), Jest + React Testing Library (frontend)
**Target Platform**:
- Backend: Linux server (development: local, production: cloud-hosted FastAPI)
- Frontend: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Project Type**: Web application (backend + frontend)
**Performance Goals**:
- Chat response time: p95 < 3 seconds (includes AI inference + database I/O)
- Conversation history load: < 2 seconds for 100 messages
- Support 50 concurrent chat users without >5 second degradation

**Constraints**:
- Stateless API design (no in-memory conversation state)
- All MCP tools must accept user_id parameter
- No modification to existing Phase II Task model or REST endpoints
- OpenAI API rate limits and quota (estimated 10,000 requests/month for pilot)
- Database conversation storage capacity (estimated 25,000 message records for pilot with 500 conversations × 50 messages average)

**Scale/Scope**:
- Initial pilot: 50-100 users
- Conversation retention: indefinite (until user deletion or data retention policy)
- Expected message volume: 10-20 messages per conversation average

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - Spec-Driven Development (SDD)**:
- ✅ **PASS**: Specification approved at specs/003-phase-iii-ai-chat/spec.md before planning began
- ✅ **PASS**: Plan derives all technical decisions from approved specification requirements
- ✅ **PASS**: No code written; planning precedes task breakdown and implementation

**Principle II - Agent Behavior and Human-Agent Boundaries**:
- ✅ **PASS**: Agent executing approved specification autonomously
- ✅ **PASS**: No invention of features beyond spec (5 basic operations only)
- ✅ **PASS**: Will create PHR for this planning work
- ✅ **PASS**: Flagging need for ADR consideration (see Research Phase below)

**Principle III - Phase Governance and Scope Control**:
- ✅ **PASS**: Phase III scope strictly adhered to (5 basic todo operations via natural language)
- ✅ **PASS**: No Phase V features included:
  - ❌ No recurring tasks, due dates, priorities, tags
  - ❌ No advanced search/filter/sort (only basic all/pending/completed filter)
  - ❌ No event-driven architecture (Kafka, Dapr)
- ✅ **PASS**: Phase II features preserved:
  - No modifications to Task model
  - No modifications to existing REST API endpoints
  - No modifications to Better Auth system
  - Phase II web UI remains fully functional

**Principle IV - Technology Stack and Platform Constraints (Phase III)**:
- ✅ **PASS**: Backend AI Framework: OpenAI Agents SDK (Python) - Phase III approved
- ✅ **PASS**: MCP Server: Model Context Protocol SDK (modelcontextprotocol/python-sdk) - Phase III approved
- ✅ **PASS**: Frontend Chat: OpenAI ChatKit web component - Phase III approved
- ✅ **PASS**: Database: Extends Neon PostgreSQL (Phase II) with new tables
- ✅ **PASS**: ORM: SQLModel for new Conversation and Message models
- ✅ **PASS**: Authentication: Reuses Phase II Better Auth (no new auth system)
- ✅ **PASS**: API Framework: FastAPI (Phase II approved, extended with chat endpoint)
- ✅ **PASS**: Frontend Framework: Next.js + TypeScript (Phase II approved, extended with chat page)
- ✅ **PASS**: Stateless MCP tools: All 5 tools accept user_id parameter
- ✅ **PASS**: Conversation persistence: Database storage (not in-memory)
- ❌ **PROHIBITED**: Event-driven architecture (Kafka, Dapr) - deferred to Phase V ✅
- ❌ **PROHIBITED**: Container orchestration (Kubernetes) - deferred to Phase IV+ ✅
- ❌ **PROHIBITED**: Advanced todo features - deferred to Phase V ✅

**Principle V - Quality Standards and Architectural Principles**:
- ✅ **PASS**: Clean Architecture: AI layer (agent, MCP tools) separated from Phase II business logic
- ✅ **PASS**: Stateless Services: Chat endpoint is stateless (state in database only)
- ✅ **PASS**: Separation of Concerns:
  - Models: Conversation, Message (data structures)
  - Services: AI agent orchestration, MCP tool implementations
  - Controllers: Chat API endpoint (FastAPI route)
  - Infrastructure: OpenAI API client, MCP server, database
- ✅ **PASS**: Cloud-Native Readiness: Stateless design supports horizontal scaling
- ✅ **PASS**: Code Quality: Will use type hints (Python) and strict TypeScript
- ✅ **PASS**: Performance: Target p95 < 3 seconds for chat responses (within Phase III standard < 200ms relaxed for AI inference)
- ✅ **PASS**: Security: Authentication enforced at chat endpoint, user_id validated, no PII in logs
- ✅ **PASS**: Testing: All 5 operations independently testable (per spec acceptance scenarios)

**Constitution Check Result**: ✅ **ALL GATES PASS** - Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/003-phase-iii-ai-chat/
├── spec.md              # Feature specification (approved)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology investigation)
├── data-model.md        # Phase 1 output (Conversation, Message entities)
├── quickstart.md        # Phase 1 output (local development guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── chat-api.yaml    # OpenAPI spec for POST /api/{user_id}/chat
│   └── mcp-tools.yaml   # MCP tool definitions (5 tools)
├── checklists/          # Validation checklists
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── task.py              # Existing Phase II Task model (no changes)
│   │   ├── user.py              # Existing Phase II User model (no changes)
│   │   ├── conversation.py      # NEW: Conversation SQLModel
│   │   └── message.py           # NEW: Message SQLModel
│   ├── services/
│   │   ├── task_service.py      # Existing Phase II task CRUD (no changes)
│   │   ├── auth_service.py      # Existing Phase II Better Auth (no changes)
│   │   └── chat_service.py      # NEW: Chat orchestration service
│   ├── api/
│   │   ├── tasks.py             # Existing Phase II task endpoints (no changes)
│   │   ├── auth.py              # Existing Phase II auth endpoints (no changes)
│   │   └── chat.py              # NEW: POST /api/{user_id}/chat endpoint
│   ├── mcp/
│   │   ├── server.py            # NEW: MCP server setup (FastMCP or equivalent)
│   │   └── tools.py             # NEW: 5 MCP tool implementations
│   ├── agent/
│   │   ├── system_prompt.py     # NEW: System prompt for AI agent
│   │   └── runner.py            # NEW: OpenAI Agents SDK runner
│   └── main.py                  # Existing FastAPI app (extend with chat routes)
└── tests/
    ├── unit/
    │   ├── test_conversation_model.py   # NEW: Unit tests for Conversation
    │   ├── test_message_model.py        # NEW: Unit tests for Message
    │   └── test_mcp_tools.py            # NEW: Unit tests for MCP tools
    ├── integration/
    │   └── test_chat_api.py             # NEW: Integration tests for chat endpoint
    └── e2e/
        └── test_chat_flow.py            # NEW: End-to-end chat conversation tests

frontend/
├── src/
│   ├── app/
│   │   ├── tasks/                       # Existing Phase II tasks page (no changes)
│   │   ├── auth/                        # Existing Phase II auth pages (no changes)
│   │   └── chat/                        # NEW: Chat interface page
│   │       ├── page.tsx                 # NEW: Chat page component
│   │       └── layout.tsx               # NEW: Chat page layout (auth-protected)
│   ├── components/
│   │   ├── TaskList.tsx                 # Existing Phase II component (no changes)
│   │   └── ChatInterface.tsx            # NEW: OpenAI ChatKit integration wrapper
│   └── services/
│       └── chatService.ts               # NEW: API client for chat endpoint
└── tests/
    └── components/
        └── ChatInterface.test.tsx       # NEW: Component tests for ChatKit integration

database/
└── migrations/
    └── versions/
        └── <timestamp>_add_conversation_message_tables.py  # NEW: Alembic migration
```

**Structure Decision**: Web application structure (Option 2) selected because Phase III extends the existing Phase II full-stack web application. Backend Python (FastAPI) and frontend TypeScript (Next.js) are already established. New directories added:
- `backend/src/mcp/`: MCP server and tool implementations
- `backend/src/agent/`: AI agent configuration and runner
- `frontend/src/app/chat/`: Chat interface page
- `frontend/src/components/ChatInterface.tsx`: ChatKit wrapper

All Phase II directories and files remain unchanged.

## Complexity Tracking

**No violations** - Constitution Check passed all gates. No justifications required.

## Architecture Decisions Requiring ADRs

The following architecturally significant decisions were made during planning and should be documented with ADRs after user consent:

**📋 Architectural decision detected: MCP Server Architecture for AI Tool Integration**

**Decision**: Use Model Context Protocol (MCP) SDK to expose task operations as stateless tools to the AI agent, rather than directly calling Python functions from the agent.

**Context**: Need to enable AI agent to perform task operations while maintaining Phase II separation of concerns.

**Alternatives Considered**:
1. **Direct function calls** from agent to task_service.py → Rejected: tight coupling, harder to test, violates clean architecture
2. **REST API calls** from agent to Phase II endpoints → Rejected: redundant HTTP overhead, no authentication context sharing, unnecessary serialization
3. **MCP tools** (chosen) → Provides clean abstraction, stateless design, testable, reusable for future AI features

**Tradeoffs**:
- ✅ Clean separation between AI layer and business logic
- ✅ Stateless tool design supports horizontal scaling
- ✅ Reusable tools for future AI features (e.g., voice interface, Slack bot)
- ⚠️ Additional abstraction layer adds slight latency (~10-50ms per tool call)

**Recommendation**: Document with `/sp.adr "MCP Server Architecture"`

---

**📋 Architectural decision detected: Conversation Persistence Strategy**

**Decision**: Store full conversation history in PostgreSQL with Conversation and Message tables, load history on each chat request.

**Context**: Need to maintain conversation context across user sessions while keeping API stateless per Phase III constitution requirement.

**Alternatives Considered**:
1. **In-memory conversation state** → Rejected: violates Phase III constitution requirement for database persistence, prevents horizontal scaling
2. **Redis cache** with PostgreSQL backup → Rejected: premature optimization, adds complexity without proven need, increases operational cost
3. **Database persistence** (chosen) → Meets constitutional requirements, proven scalable, simple architecture

**Tradeoffs**:
- ✅ Stateless API design (no in-memory session state)
- ✅ Full conversation history available for context
- ✅ Supports horizontal scaling (any server can handle any request)
- ⚠️ Database query latency for large conversations (mitigated: indexed queries, limit to recent 100 messages)

**Recommendation**: Document with `/sp.adr "Conversation Persistence Strategy"`

---

**📋 Architectural decision detected: OpenAI Agents SDK vs Direct API Integration**

**Decision**: Use OpenAI Agents SDK (Python) as prescribed by Phase III constitution, pending research validation.

**Context**: Phase III constitution mandates OpenAI Agents SDK. Need to validate this choice is production-ready and supports our MCP integration requirements.

**Research Needed** (Phase 0):
- Is OpenAI Agents SDK production-ready?
- Does it support MCP tool integration natively?
- Can it handle stateless conversation (pass full history per request)?
- What are error handling patterns?

**Alternatives If SDK Unsuitable**:
1. **Direct OpenAI Chat Completions API** with function calling + manual MCP integration
2. **LangChain** for multi-provider support (if we need non-OpenAI models later)

**Recommendation**: Research in Phase 0, then document with `/sp.adr "AI Agent Framework Selection"`

---

## Phase 0: Research & Investigation

### Research Tasks

The following unknowns require investigation before detailed design:

#### RT-001: OpenAI Agents SDK Investigation
**Status**: Not Started
**Question**: What is the current state of OpenAI Agents SDK (Python)? Is it production-ready for Phase III?

**Research Actions**:
1. Search for official OpenAI Agents SDK documentation (Python version)
2. Identify pip package name and installation method
3. Verify MCP tool integration capability (native support or manual integration needed?)
4. Check system prompt configuration API
5. Validate stateless conversation handling (can we pass full message history per request?)
6. Review error handling patterns (API failures, rate limiting, retries)
7. Check version stability and production readiness indicators

**Decision Criteria**:
- ✅ If SDK supports MCP integration and stateless operation → use as planned
- ⚠️ If SDK lacks MCP support → investigate workaround: direct OpenAI Chat Completions API + manual MCP integration
- ❌ If SDK is not production-ready → escalate to user (may require constitution amendment to use alternative)

**Output**: Document findings in research.md with installation instructions and code examples

---

#### RT-002: Model Context Protocol (MCP) SDK Best Practices
**Status**: Not Started
**Question**: How to set up MCP server using modelcontextprotocol/python-sdk? What are best practices for tool registration and error handling?

**Research Actions**:
1. Review MCP SDK documentation (modelcontextprotocol/python-sdk on GitHub)
2. Identify tool registration pattern (decorators vs manual registration)
3. Understand stateless tool requirements (how to pass user_id parameter)
4. Verify integration approach with OpenAI Agents SDK or Chat Completions API
5. Review error handling and validation patterns
6. Check if FastMCP library exists as higher-level abstraction
7. Examine example implementations

**Decision Criteria**:
- Use FastMCP if available and stable (reduces boilerplate)
- Fall back to direct MCP SDK if FastMCP not suitable
- Document tool signature pattern and error handling approach

**Output**: Document MCP server setup pattern in research.md with example tool implementation code

---

#### RT-003: OpenAI ChatKit Integration
**Status**: Not Started
**Question**: How to integrate OpenAI ChatKit web component into Next.js TypeScript application?

**Research Actions**:
1. Search for OpenAI ChatKit documentation (npm package, CDN, or GitHub repo)
2. Verify existence and current status (is it released? beta? deprecated?)
3. Check Next.js compatibility (SSR vs client-side rendering requirements)
4. Identify configuration options (API endpoint, authentication headers, conversation_id)
5. Review styling and customization capabilities
6. Validate browser compatibility matrix
7. Examine example integrations

**Decision Criteria**:
- ✅ If ChatKit is available as npm package → install via package.json
- ⚠️ If ChatKit is CDN-only → include via Next.js Script component
- ❌ If ChatKit doesn't exist or is deprecated → investigate alternatives: react-chatbot-kit, custom chat UI, or simple textarea-based interface

**Output**: Document ChatKit integration approach in research.md with installation and configuration code examples

---

#### RT-004: Database Migration Strategy
**Status**: Not Started
**Question**: How to add Conversation and Message tables to existing Neon PostgreSQL database without disrupting Phase II?

**Research Actions**:
1. Review existing Alembic migration setup from Phase II codebase
2. Design migration DDL for Conversation table (per data-model.md schema)
3. Design migration DDL for Message table (per data-model.md schema)
4. Verify foreign key constraints (users.id, conversations.id) syntax
5. Plan index creation (avoid locking existing tables during migration)
6. Design rollback/downgrade script
7. Test migration on local database copy

**Decision Criteria**:
- Use Alembic (consistent with Phase II migration tooling)
- Create single migration file for both tables (atomic change)
- Ensure no locks on existing Phase II tables during migration
- Verify CASCADE delete behavior for foreign keys

**Output**: Document migration approach in research.md with example Alembic script

---

#### RT-005: Authentication Integration
**Status**: Not Started
**Question**: How to extract user_id from Phase II Better Auth JWT tokens in the chat endpoint?

**Research Actions**:
1. Locate and review existing Better Auth middleware in Phase II codebase
2. Identify JWT verification pattern (library used, token validation logic)
3. Understand how to extract user_id from token claims/payload
4. Check if authentication middleware is reusable for new chat endpoint
5. Verify error response format for 401 Unauthorized and 403 Forbidden
6. Confirm user_id data type and format (UUID string, integer, etc.)
7. Test JWT verification with Phase II tokens

**Decision Criteria**:
- Reuse existing authentication middleware if available (DRY principle)
- Extract user_id from verified token claims
- Validate authenticated user_id matches URL parameter {user_id} (403 if mismatch)

**Output**: Document authentication integration in research.md with code example showing JWT verification and user_id extraction

---

#### RT-006: Natural Language Intent Recognition System Prompt
**Status**: Not Started
**Question**: What system prompt patterns enable the AI agent to reliably interpret the 5 basic todo operations and handle edge cases?

**Research Actions**:
1. Research system prompt engineering best practices for task-oriented chatbots
2. Design system prompt structure:
   - Role definition ("You are a helpful todo list assistant...")
   - Available tools and their purpose (list 5 MCP tools with brief descriptions)
   - Instruction to always confirm successful actions with specific details
   - Instruction to ask for clarification when user intent is ambiguous
   - Examples of polite rejections for unsupported features (Phase V features)
3. Create few-shot examples for each operation type (optional, if needed for accuracy)
4. Define error handling instructions for the agent
5. Test prompt with sample user inputs to validate interpretation accuracy

**Decision Criteria**:
- System prompt should be concise (<500 tokens) to minimize API cost
- Must include clear tool usage guidelines
- Must handle all 5 operations (add, list, update, delete, complete)
- Must politely reject Phase V features (priorities, due dates, tags, etc.)
- Target 85%+ correct interpretation rate per spec success criteria

**Output**: Draft complete system prompt in research.md with rationale for design choices

---

### Expected Research Output (research.md)

After completing all research tasks, create `specs/003-phase-iii-ai-chat/research.md`:

```markdown
# Research: Phase III AI Chat Implementation

**Status**: [Complete/In Progress]
**Completed**: [Date]

## RT-001: OpenAI Agents SDK
**Status**: Investigated
**Decision**: [Use SDK / Use alternative]
**Installation**: `pip install [package-name]`
**Key Findings**:
- [Production readiness assessment]
- [MCP integration capability]
- [Stateless conversation support]
**Code Example**:
```python
# Example agent setup code
```

## RT-002: MCP SDK Setup
**Status**: Investigated
**Decision**: [FastMCP / Direct MCP SDK]
**Installation**: `pip install modelcontextprotocol`
**Tool Registration Pattern**:
```python
# Example tool registration
```

## RT-003: OpenAI ChatKit
**Status**: Investigated
**Decision**: [npm package / CDN / Alternative]
**Installation**: [Steps]
**Integration Example**:
```typescript
// ChatKit integration code
```

## RT-004: Database Migration
**Status**: Investigated
**Migration Approach**: Alembic
**Schema DDL**:
```sql
-- Conversation table
CREATE TABLE conversations (...);
-- Message table
CREATE TABLE messages (...);
```

## RT-005: Authentication Integration
**Status**: Investigated
**JWT Verification**:
```python
# JWT extraction code
```

## RT-006: System Prompt Design
**Status**: Investigated
**System Prompt**:
```
You are a helpful todo list assistant that helps users manage their tasks through natural language conversation.

You have access to the following tools:
- add_task: Create a new task
- list_tasks: Show user's tasks (all, pending, or completed)
- update_task: Modify task title or description
- delete_task: Remove a task
- complete_task: Mark task as done or undone

Always confirm actions with specific details. Example: "Task 3 'buy groceries' has been completed."

If the user asks for features not yet available (priorities, due dates, tags, search), politely explain:
"That feature isn't available yet, but I can help you [suggest workaround using basic features]."

When user intent is unclear, ask clarifying questions before taking action.
```
**Rationale**: [Why this design]
```

---

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

This phase will generate detailed design artifacts after research is complete. Proceeding with placeholder structure for now, to be filled after Phase 0 research validation.

### Data Model (data-model.md)

*See plan.md for full entity definitions (Conversation, Message)*

Will create `specs/003-phase-iii-ai-chat/data-model.md` with:
- Conversation entity (fields, relationships, validation, indexes)
- Message entity (fields, relationships, validation, indexes)
- SQLModel implementation code

### API Contracts (contracts/)

*See plan.md for full OpenAPI specs*

Will create:
- `specs/003-phase-iii-ai-chat/contracts/chat-api.yaml` (OpenAPI 3.0 for POST /api/{user_id}/chat)
- `specs/003-phase-iii-ai-chat/contracts/mcp-tools.yaml` (5 MCP tool definitions)

### Quickstart (quickstart.md)

*See plan.md for quickstart template*

Will create `specs/003-phase-iii-ai-chat/quickstart.md` with:
- Prerequisites checklist
- Dependency installation (backend + frontend)
- Database migration steps
- Environment variable configuration
- Local development server commands
- Example natural language interactions
- Troubleshooting guide

---

## Implementation Sequence (For /sp.tasks)

*This plan does NOT generate tasks. The `/sp.tasks` command will create tasks.md based on this plan.*

**Recommended implementation order**:

1. **Backend Foundation**: Install dependencies, create models, run migration
2. **MCP Tools**: Implement 5 tools, register with MCP server, write tests
3. **AI Agent**: Design system prompt, implement agent runner, test with examples
4. **Chat API Endpoint**: Create FastAPI route, authentication, conversation handling, agent invocation
5. **Frontend Chat Interface**: Install ChatKit, create /chat page, integrate with backend
6. **Testing & Documentation**: Run all tests, update quickstart.md, verify Phase II unaffected

---

## Next Steps

1. **User Approval Required**: Review this plan document for approval
2. **Phase 0 Execution**: Execute research tasks RT-001 through RT-006 (within this /sp.plan command)
3. **Phase 1 Execution**: Create data-model.md, contracts/, quickstart.md
4. **ADR Creation**: After plan approval, create 3 ADRs using `/sp.adr`
5. **Task Breakdown**: Run `/sp.tasks` to generate tasks.md from this approved plan

---

## Plan Metadata

**Status**: Draft - Awaiting Phase 0 Research
**Constitution Compliance**: ✅ All gates passed
**Next Command**: Research execution (automated within /sp.plan)

**Artifacts To Generate**:
- [x] plan.md (this file)
- [ ] research.md (Phase 0)
- [ ] data-model.md (Phase 1)
- [ ] contracts/chat-api.yaml (Phase 1)
- [ ] contracts/mcp-tools.yaml (Phase 1)
- [ ] quickstart.md (Phase 1)

**Estimated Complexity**: Medium (~1400 total lines including tests)
**Risk Assessment**:
- 🟡 OpenAI Agents SDK maturity (mitigated by research)
- 🟡 OpenAI API rate limits (documented, estimated usage)
- 🟢 Phase II preservation (no modifications)
- 🟢 Database migration (established tooling)
