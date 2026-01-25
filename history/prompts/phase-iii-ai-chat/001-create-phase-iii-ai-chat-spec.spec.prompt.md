---
id: 001
title: Create Phase III AI Chat Spec
stage: spec
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: phase-iii-ai-chat
branch: 003-phase-iii-ai-chat
user: user
command: /sp.specify
labels: ["spec", "phase-iii", "ai-chat", "mcp", "openai-agents"]
links:
  spec: specs/003-phase-iii-ai-chat/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-phase-iii-ai-chat/spec.md
 - specs/003-phase-iii-ai-chat/checklists/requirements.md
tests:
 - Specification quality validation checklist (all items passed)
---

## Prompt

Create the Phase III specification for the "Evolution of Todo" project.

PHASE III GOAL:
Add an AI-powered conversational chatbot interface that allows users to manage their todo items using natural language, while keeping the existing Phase II web UI functional.

SCOPE – BASIC LEVEL FEATURES ONLY (same as Phase I & II):
1. Add a new task
2. List / view tasks (with optional status filter: all / pending / completed)
3. Update task (title and/or description)
4. Delete a task
5. Mark a task as complete / incomplete

REQUIREMENTS:
1. Conversational interface via OpenAI ChatKit (frontend)
2. Backend exposes an MCP server with the following stateless tools:
   - add_task(user_id: str, title: str, description: str | None) → task_id, title
   - list_tasks(user_id: str, status: "all" | "pending" | "completed" = "all") → list of tasks
   - update_task(user_id: str, task_id: int, title: str | None, description: str | None) → task_id, title
   - delete_task(user_id: str, task_id: int) → task_id, title
   - complete_task(user_id: str, task_id: int) → task_id, title (toggles completion)
3. New stateless chat endpoint: POST /api/{user_id}/chat
   Request: { "conversation_id": int | null, "message": str }
   Response: { "conversation_id": int, "response": str, "tool_calls": array? }
4. Conversation & message history persisted in Neon PostgreSQL:
   - Conversation table (id, user_id, title?, created_at, updated_at)
   - Message table (id, conversation_id, role, content, message_order, tool_calls_json?, created_at)

NON-FUNCTIONAL CONSTRAINTS:
- No intermediate/advanced features (priorities, tags, due dates, recurring, search, sort)
- No Kafka, Dapr, event-driven architecture
- No voice input, multi-language (unless bonus)
- Stateless server (state in database only)

SPEC MUST INCLUDE:
- User stories for chatbot
- Detailed MCP tool definitions (parameters, returns, examples)
- Agent behavior & confirmation rules
- Database schema additions
- Chat API request/response format
- Acceptance criteria & error cases

Example natural language interactions:
- "Add a task to buy groceries"
- "What tasks do I have?"
- "What's pending?"
- "Mark task 3 as done"
- "Delete task 7"
- "Change task 2 title to 'Call mom tonight'"

## Response snapshot

Created comprehensive Phase III specification at `specs/003-phase-iii-ai-chat/spec.md` including:

**User Scenarios & Testing**:
- 6 prioritized user stories (P1-P5) with 36 acceptance scenarios covering:
  - Add task via natural language (P1)
  - View/list tasks via natural language (P2)
  - Complete task via natural language (P3)
  - Update task via natural language (P4)
  - Delete task via natural language (P5)
  - Conversation history persistence (P2)
- 10 edge cases identified (ambiguous requests, advanced features, AI service unavailable, duplicate task names, rate limiting, large conversation history, database failures, etc.)

**Requirements** (37 functional requirements):
- AI Chat Interface: 6 requirements for stateless chat endpoint, authentication, OpenAI integration
- MCP Server and Tools: 6 requirements for MCP server and 5 stateless tools
- Conversation Persistence: 8 requirements for database storage (no in-memory state)
- AI Agent Behavior: 7 requirements for natural language interpretation and user interaction
- Error Handling: 6 requirements for graceful error handling
- Phase II Integration: 4 requirements to preserve existing functionality

**Detailed MCP Tool Definitions** (as requested):
- **add_task**: Create new task with user_id, title, optional description. Returns task object. Error cases: missing title, length validation, database errors.
- **list_tasks**: Retrieve tasks with optional status filter (all/pending/completed). Returns task array with count. Error cases: invalid status, database errors.
- **update_task**: Modify task title and/or description. Returns updated task. Error cases: task not found, unauthorized, validation errors.
- **delete_task**: Permanently remove task. Returns deleted task info. Error cases: task not found, unauthorized, database errors.
- **complete_task**: Toggle task completion status. Returns updated task. Error cases: task not found, unauthorized, database errors.

**Chat API Definition** (as requested):
- Endpoint: POST /api/{user_id}/chat
- Request: conversation_id (optional), message (required, 1-2000 chars)
- Response: conversation_id, message_id, response, tool_calls array, timestamp
- Error codes: 400, 401, 403, 404, 429, 500, 503 with detailed descriptions

**Database Schema Additions** (as requested):
- **conversations table**: id, user_id (FK to users), title (nullable), created_at, updated_at
  - Indexes: PK on id, FK on user_id, composite on (user_id, updated_at)
- **messages table**: id, conversation_id (FK), role (user/assistant), content, message_order, tool_calls_json, created_at
  - Indexes: PK on id, FK on conversation_id, composite on (conversation_id, message_order)
  - Constraints: CASCADE deletes, UNIQUE on (conversation_id, message_order)

**Agent Behavior & Confirmation Rules** (as requested):
- Interpretation rules for 5 operations (keywords: add/create, show/list, complete/done, change/update, delete/remove)
- Confirmation rules: successful operations, clarifications, not found errors, unsupported features, ambiguous intent
- Context handling: single-turn operations, multi-turn clarifications, conversation memory
- Error recovery: tool errors, API errors, database errors with retry logic

**Success Criteria** (12 measurable outcomes):
- Task creation in <10 seconds
- 100% accuracy for task listing
- 90% first-attempt success for single-task operations
- 100% conversation history retention
- <2 second history load for 100 messages
- All 5 operations accessible via chat
- <3 second response time (95% of requests)
- 100% correct rejection of advanced features
- No degradation of Phase II functionality
- 50 concurrent users without >5 second degradation
- 85% correct natural language interpretation
- 100% inclusion of task IDs in list responses

**Constitutional Compliance**:
- Validates against Constitution v1.2.0
- Uses only Phase III approved technologies (OpenAI Agents SDK, MCP SDK, ChatKit)
- All MCP tools stateless with user_id parameter
- Database persistence (no in-memory state)
- Builds on Phase II Better Auth
- No Phase V features (advanced todos, event-driven architecture)
- Preserves all Phase II functionality

**Validation Results**:
- Created quality checklist at `specs/003-phase-iii-ai-chat/checklists/requirements.md`
- All checklist items PASSED:
  - Content quality: No implementation details, user-focused, non-technical language
  - Requirement completeness: No clarification markers, testable, measurable, technology-agnostic
  - Feature readiness: Clear acceptance criteria, primary flows covered, measurable outcomes

Specification is ready for `/sp.plan` phase.

## Outcome

- ✅ Impact: Comprehensive Phase III specification created with all required sections (user stories, MCP tools, chat API, database schema, agent behavior, success criteria, constitutional compliance)
- 🧪 Tests: Specification quality validation checklist created and passed (all items validated)
- 📁 Files: specs/003-phase-iii-ai-chat/spec.md (613 lines), specs/003-phase-iii-ai-chat/checklists/requirements.md (83 lines)
- 🔁 Next prompts: `/sp.clarify` (if needed) or `/sp.plan` to create technical architecture and design
- 🧠 Reflection: Specification successfully includes all requested details (MCP tool definitions with parameters/returns/examples, chat API format with request/response structure, database schema with tables/columns/constraints/indexes, agent behavior and confirmation rules). Spec balances business requirements with necessary interface contracts while maintaining technology-agnostic spirit. Ready for planning phase.

## Evaluation notes (flywheel)

- Failure modes observed: None - specification creation completed successfully without issues
- Graders run and results (PASS/FAIL): Specification quality checklist - PASS (all 14 items validated)
- Prompt variant (if applicable): Standard /sp.specify command with detailed feature description
- Next experiment (smallest change to try): Proceed to `/sp.plan` to design technical architecture for Phase III AI chat implementation
