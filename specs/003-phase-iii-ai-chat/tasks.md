# Implementation Tasks: Phase III - AI-Powered Natural Language Todo Interface

**Branch**: `003-phase-iii-ai-chat`
**Date**: 2026-01-05
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

## Overview

This document breaks down the Phase III implementation into atomic, executable tasks organized by user story priority. Each user story represents an independently testable increment that delivers user value.

**Key Findings from Research**:
- "OpenAI Agents SDK" → Use `openai` Python SDK with Chat Completions API
- "OpenAI ChatKit" → Use Vercel AI SDK (`ai` npm package)
- MCP SDK (`mcp`) is production-ready

**Implementation Strategy**: Build each user story as a complete vertical slice (database → backend → frontend) to enable independent testing and incremental delivery.

---

## Phase 1: Setup & Dependencies

**Goal**: Install required dependencies and verify Phase II integration points.

### Tasks

- [X] T001 Install backend dependencies in phases/phase2-web/backend/requirements.txt (openai>=1.0.0, mcp>=1.0.0)
- [X] T002 Install frontend dependencies in phases/phase2-web/frontend/package.json (ai>=3.0.0 for Vercel AI SDK)
- [X] T003 [P] Verify Phase II Better Auth integration by reading phases/phase2-web/backend/src/services/auth_service.py
- [X] T004 [P] Verify Phase II Task model by reading phases/phase2-web/backend/src/models/todo.py (actual filename)
- [X] T005 [P] Document OpenAI API key configuration in phases/phase2-web/backend/.env.example (OPENAI_API_KEY, OPENAI_MODEL)

**Completion Criteria**: All dependencies installed, Phase II integration points verified, environment configuration documented.

---

## Phase 2: Foundational Infrastructure (US6 - Conversation Persistence)

**Goal**: Implement conversation persistence foundation required by all user stories.

**User Story**: US6 - Conversation History Persistence (Priority: P2)
**Why First**: All chat functionality depends on the ability to store and retrieve conversations.
**Independent Test**: Create conversation, refresh browser, verify history restored.

### Database Models & Migration

- [X] T006 [US6] Create Conversation SQLModel in phases/phase2-web/backend/src/models/conversation.py
- [X] T007 [US6] Create Message SQLModel in phases/phase2-web/backend/src/models/message.py
- [X] T008 [US6] Create Alembic migration for conversations and messages tables in phases/phase2-web/backend/alembic/versions/
- [ ] T009 [US6] Run migration locally and verify tables created (alembic upgrade head)

### Chat Service Foundation

- [X] T010 [US6] Create ChatService class in phases/phase2-web/backend/src/services/chat_service.py with conversation CRUD methods
- [X] T011 [US6] Implement get_or_create_conversation(user_id, conversation_id?) method in chat_service.py
- [X] T012 [US6] Implement save_message(conversation_id, role, content) method in chat_service.py
- [X] T013 [US6] Implement load_conversation_history(conversation_id, limit=100) method in chat_service.py

### Chat API Endpoint

- [X] T014 [US6] Create POST /api/{user_id}/chat endpoint in phases/phase2-web/backend/src/api/chat.py
- [X] T015 [US6] Implement authentication middleware integration (reuse Phase II Better Auth)
- [X] T016 [US6] Implement user_id validation (authenticated user must match URL parameter)
- [X] T017 [US6] Implement conversation_id handling (create new or load existing)
- [X] T018 [US6] Implement request/response schema (ChatRequest, ChatResponse) using Pydantic

### Frontend Chat UI

- [X] T019 [P] [US6] Create chat page at phases/phase2-web/frontend/src/app/chat/page.tsx
- [X] T020 [P] [US6] Create auth-protected layout at phases/phase2-web/frontend/src/app/chat/layout.tsx
- [X] T021 [US6] Integrate chat UI (custom implementation, Vercel AI SDK for Phase 3) in chat/page.tsx
- [X] T022 [US6] Configure chat to call /api/{user_id}/chat with auth headers
- [X] T023 [US6] Implement conversation_id persistence using localStorage in chatService.ts
- [X] T024 [US6] Create chatService.ts in phases/phase2-web/frontend/src/services/ for API client logic

**Phase 2 Completion Criteria**:
- ✅ Conversation and Message tables exist in database
- ✅ Chat endpoint accepts messages and persists to database
- ✅ Frontend chat UI displays and persists conversation history
- ✅ Users can refresh browser and see conversation history restored
- ✅ Authentication enforced (401 if not logged in, 403 if user_id mismatch)

**Independent Test (US6)**:
1. Log in as test user
2. Navigate to /chat page
3. Send message "Hello"
4. Verify message saved to database
5. Refresh browser
6. Verify "Hello" message still visible
7. Log out and log in again
8. Verify conversation history still present

---

## Phase 3: US1 - Add Task via Natural Language (Priority: P1)

**Goal**: Users can create todos by typing natural language like "Add a task to buy groceries".

**User Story**: US1 - Add Task via Natural Language
**Independent Test**: Type "Add a task to buy groceries" → Verify task appears in database and Phase II task list.

### MCP Tool: add_task

- [X] T025 [P] [US1] Create MCP server setup in phases/phase2-web/backend/src/mcp/server.py
- [X] T026 [US1] Implement add_task MCP tool in phases/phase2-web/backend/src/mcp/tools.py
- [X] T027 [US1] Implement tool parameter schema (user_id: str, title: str, description: str?)
- [X] T028 [US1] Integrate with Phase II todo_service.py (reuse create_todo logic)
- [X] T029 [US1] Implement error handling (missing title, validation errors, database errors)

### AI Agent Integration

- [X] T030 [US1] Create system prompt in phases/phase2-web/backend/src/agent/system_prompt.py
- [X] T031 [US1] Design prompt to recognize task creation keywords (add, create, new task, remind me)
- [X] T032 [US1] Create OpenAI agent runner in phases/phase2-web/backend/src/agent/runner.py
- [X] T033 [US1] Implement MCP tool to OpenAI function schema converter in agent/runner.py
- [X] T034 [US1] Implement tool call executor (route OpenAI tool requests to MCP tools)
- [X] T035 [US1] Inject user_id from authentication (security: never trust LLM input)

### Chat Endpoint Integration

- [X] T036 [US1] Integrate agent runner into chat endpoint in api/chat.py
- [X] T037 [US1] Implement chat loop: load history → call agent → handle tool calls → save response
- [X] T038 [US1] Implement agent error handling (OpenAI API errors, tool execution errors)
- [X] T039 [US1] Return agent response with tool_calls array to frontend

**Phase 3 Completion Criteria**:
- ✅ User can type "Add a task to buy groceries" in chat
- ✅ Task is created in database with title "buy groceries"
- ✅ Task appears in Phase II /tasks page
- ✅ Agent confirms: "I've added a new task: 'buy groceries' (Task ID: X)"
- ✅ Ambiguous requests (e.g., "do something tomorrow") prompt clarification
- ✅ Unauthenticated requests return 401 error

**Independent Test (US1)**:
1. Log in and navigate to /chat
2. Type: "Add a task to buy groceries"
3. Verify agent responds with confirmation including task ID
4. Navigate to /tasks (Phase II page)
5. Verify "buy groceries" task appears in list
6. Type: "Create a todo for finishing the project report"
7. Verify second task created
8. Type: "do something tomorrow" (ambiguous)
9. Verify agent asks for clarification

---

## Phase 4: US2 - View/List Tasks via Natural Language (Priority: P2)

**Goal**: Users can view tasks by asking "What are my tasks?" or "Show me my todos".

**User Story**: US2 - View/List Tasks via Natural Language
**Independent Test**: Create tasks via Phase II, then ask "What are my tasks?" → Verify natural language list with IDs.

### MCP Tool: list_tasks

- [X] T040 [P] [US2] Implement list_tasks MCP tool in phases/phase2-web/backend/src/mcp/tools.py
- [X] T041 [US2] Implement tool parameter schema (user_id: str, status: "all"|"pending"|"completed" = "all")
- [X] T042 [US2] Integrate with Phase II todo_service.py (reuse get_user_todos logic)
- [X] T043 [US2] Return task list with IDs, titles, status, timestamps
- [X] T044 [US2] Implement error handling (invalid status, database errors)

### AI Agent Integration

- [X] T045 [US2] Update system prompt to recognize list keywords (show, list, what are, what's, view)
- [X] T046 [US2] Update MCP server to register list_tasks tool
- [X] T047 [US2] Implement natural language formatting guidelines for task lists (include IDs for subsequent operations)
- [X] T048 [US2] Handle empty task list case ("You have no tasks")
- [X] T049 [US2] Implement status filter recognition in system prompt ("What's pending?" → status=pending)

**Phase 4 Completion Criteria**:
- ✅ User can type "What are my tasks?" and see all tasks
- ✅ User can type "What's pending?" and see only incomplete tasks
- ✅ User can type "Show me completed tasks" and see only completed tasks
- ✅ Task IDs are included in response (needed for update/delete/complete operations)
- ✅ Empty list returns "You have no tasks"

**Independent Test (US2)**:
1. Create 3 tasks via Phase II interface (2 pending, 1 completed)
2. Navigate to /chat
3. Type: "What are my tasks?"
4. Verify response lists all 3 tasks with IDs and completion status
5. Type: "What's pending?"
6. Verify response lists only 2 pending tasks
7. Type: "Show me completed tasks"
8. Verify response lists only 1 completed task
9. Delete all tasks via Phase II
10. Type: "What are my tasks?"
11. Verify response: "You have no tasks"

---

## Phase 5: US3 - Complete Task via Natural Language (Priority: P3)

**Goal**: Users can mark tasks complete by saying "Mark task 3 as done" or toggle completion.

**User Story**: US3 - Complete Task via Natural Language
**Independent Test**: Create task, say "Mark task X as done" → Verify task marked complete in database.

### MCP Tool: complete_task

- [X] T050 [P] [US3] Implement complete_task MCP tool in phases/phase2-web/backend/src/mcp/tools.py
- [X] T051 [US3] Implement tool parameter schema (user_id: str, task_id: int)
- [X] T052 [US3] Integrate with Phase II task_service.py (toggle completion status)
- [X] T053 [US3] Return updated task with new completion status
- [X] T054 [US3] Implement error handling (task not found, unauthorized access, database errors)

### AI Agent Integration

- [X] T055 [US3] Update system prompt to recognize completion keywords (mark done, complete, finish, mark incomplete, reopen)
- [X] T056 [US3] Update agent runner to register complete_task tool
- [X] T057 [US3] Implement task ID extraction from natural language ("Mark task 3 as done" → task_id=3)
- [X] T058 [US3] Implement task title matching ("Complete the groceries task" → search by title)
- [X] T059 [US3] Handle multiple matches (ask "Which task did you mean? Task 3 or Task 7?")
- [X] T060 [US3] Implement confirmation message with task details ("Task 3 'buy groceries' has been marked complete")
- [X] T061 [US3] Handle already-complete case ("Task 3 is already complete")

**Phase 5 Completion Criteria**:
- ✅ User can complete task by ID: "Mark task 3 as done"
- ✅ User can complete task by title: "Complete the groceries task"
- ✅ User can reopen task: "Mark task 3 as incomplete"
- ✅ Multiple matches trigger clarification
- ✅ Non-existent task returns "Task not found"
- ✅ Confirmation includes task ID and title

**Independent Test (US3)**:
1. Create task "buy groceries" via chat (get task ID X)
2. Type: "Mark task X as done"
3. Verify response confirms completion
4. Verify task marked complete in Phase II /tasks
5. Type: "Mark task X as incomplete"
6. Verify task reopened
7. Create two tasks with "groceries" in title
8. Type: "Complete the groceries task"
9. Verify agent asks for clarification with both task IDs
10. Type: "Complete task 99" (doesn't exist)
11. Verify response: "Task not found. Please check your task list."

---

## Phase 6: US4 - Update Task via Natural Language (Priority: P4)

**Goal**: Users can modify tasks by saying "Change task 2 title to 'Call mom tonight'".

**User Story**: US4 - Update Task via Natural Language
**Independent Test**: Create task, say "Change task X title to 'new title'" → Verify update in database.

### MCP Tool: update_task

- [X] T062 [P] [US4] Implement update_task MCP tool in phases/phase2-web/backend/src/mcp/tools.py
- [X] T063 [US4] Implement tool parameter schema (user_id: str, task_id: int, title: str?, description: str?)
- [X] T064 [US4] Integrate with Phase II task_service.py (update task logic)
- [X] T065 [US4] Validate at least one field provided (title or description)
- [X] T066 [US4] Return updated task with new values
- [X] T067 [US4] Implement error handling (task not found, no updates provided, validation errors)

### AI Agent Integration

- [X] T068 [US4] Update system prompt to recognize update keywords (change, update, modify, edit)
- [X] T069 [US4] Update agent runner to register update_task tool
- [X] T070 [US4] Implement task ID and field extraction ("Change task 2 title to 'X'" → task_id=2, title="X")
- [X] T071 [US4] Implement title vs description detection ("Update task 5 description to 'X'" → description="X")
- [X] T072 [US4] Handle multiple matches when using title search
- [X] T073 [US4] Implement confirmation message with updated details

**Phase 6 Completion Criteria**:
- ✅ User can update task title by ID
- ✅ User can update task description by ID
- ✅ User can update both title and description
- ✅ Multiple matches trigger clarification
- ✅ Non-existent task returns error
- ✅ Confirmation shows updated values

**Independent Test (US4)**:
1. Create task "buy groceries" (task ID X)
2. Type: "Change task X title to 'buy groceries and milk'"
3. Verify title updated in database and Phase II /tasks
4. Type: "Update task X description to 'Remember to check expiration dates'"
5. Verify description updated
6. Type: "Change task 99 title to 'test'" (doesn't exist)
7. Verify response: "Task 42 not found"
8. Create two tasks with "groceries"
9. Type: "Change the groceries task to 'weekly shopping'"
10. Verify clarification request

---

## Phase 7: US5 - Delete Task via Natural Language (Priority: P5)

**Goal**: Users can remove tasks by saying "Delete task 7".

**User Story**: US5 - Delete Task via Natural Language
**Independent Test**: Create task, say "Delete task X" → Verify task removed from database.

### MCP Tool: delete_task

- [X] T074 [P] [US5] Implement delete_task MCP tool in phases/phase2-web/backend/src/mcp/tools.py
- [X] T075 [US5] Implement tool parameter schema (user_id: str, task_id: int)
- [X] T076 [US5] Integrate with Phase II task_service.py (delete task logic)
- [X] T077 [US5] Return deleted task details for confirmation
- [X] T078 [US5] Implement error handling (task not found, unauthorized access, database errors)

### AI Agent Integration

- [X] T079 [US5] Update system prompt to recognize deletion keywords (delete, remove, cancel)
- [X] T080 [US5] Update agent runner to register delete_task tool
- [X] T081 [US5] Implement task ID extraction from natural language
- [X] T082 [US5] Handle multiple matches (ask for confirmation with specific IDs)
- [X] T083 [US5] Implement confirmation message ("Task 7 'buy groceries' has been deleted")

**Phase 7 Completion Criteria**:
- ✅ User can delete task by ID: "Delete task 7"
- ✅ User can delete by title with confirmation if multiple matches
- ✅ Non-existent task returns error
- ✅ Confirmation includes deleted task title
- ✅ Task removed from database and Phase II /tasks

**Independent Test (US5)**:
1. Create task "buy groceries" (task ID X)
2. Type: "Delete task X"
3. Verify confirmation with task title
4. Verify task removed from Phase II /tasks
5. Type: "Delete task X" (already deleted)
6. Verify response: "Task X not found"
7. Create two tasks with "groceries"
8. Type: "Delete the groceries task"
9. Verify clarification request with both IDs
10. Create and delete single remaining task
11. Type: "What are my tasks?"
12. Verify response: "You have no tasks"

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Add error handling, edge cases, and production readiness.

### Error Handling

- [ ] T084 [P] Implement OpenAI API error handling in agent/runner.py (rate limiting, quota exceeded, service unavailable)
- [ ] T085 [P] Implement database retry logic in chat_service.py (3 retries with exponential backoff)
- [ ] T086 [P] Add user-friendly error messages for all error types
- [ ] T087 [P] Implement empty/whitespace message validation in chat API endpoint
- [ ] T088 [P] Implement message length validation (max 2000 characters)

### Agent Behavior

- [X] T089 Add rejection messages for advanced features in system_prompt.py (priorities, due dates, tags, search/filter)
- [ ] T090 Add helpful fallback for ambiguous requests ("I can help you add, list, update, complete, or delete tasks")
- [ ] T091 Implement large conversation history handling (load recent 100 messages, pagination strategy)

### Logging & Monitoring

- [X] T092 [P] Add MCP tool invocation logging (user_id, tool_name, parameters, timestamp) (Integrated in server.py/chat.py)
- [X] T093 [P] Add chat endpoint request/response logging (exclude PII) (Added in chat.py)
- [ ] T094 [P] Add OpenAI API usage tracking (tokens, cost estimation)

### Documentation

- [ ] T095 [P] Update quickstart.md with actual dependency installation commands
- [ ] T096 [P] Document OpenAI API key setup and model configuration
- [ ] T097 [P] Add example natural language commands to quickstart
- [ ] T098 [P] Document error handling and troubleshooting

### Testing (Optional - only if TDD requested)

- [ ] T099 [P] Create unit tests for Conversation model in phases/phase2-web/backend/tests/unit/test_conversation_model.py
- [ ] T100 [P] Create unit tests for Message model in phases/phase2-web/backend/tests/unit/test_message_model.py
- [ ] T101 [P] Create unit tests for all 5 MCP tools in phases/phase2-web/backend/tests/unit/test_mcp_tools.py
- [ ] T102 [P] Create integration tests for chat API in phases/phase2-web/backend/tests/integration/test_chat_api.py
- [ ] T103 [P] Create end-to-end test for full chat flow in phases/phase2-web/backend/tests/e2e/test_chat_flow.py
- [ ] T104 [P] Create component tests for ChatInterface in phases/phase2-web/frontend/tests/components/ChatInterface.test.tsx

**Phase 8 Completion Criteria**:
- ✅ All error cases handled gracefully with user-friendly messages
- ✅ Advanced feature requests politely rejected
- ✅ Logging in place for debugging and monitoring
- ✅ Documentation updated for developers
- ✅ (Optional) Tests passing if TDD approach used

---

## Dependency Graph

```text
Phase 1 (Setup)
  ↓
Phase 2 (US6 - Conversation Persistence) ← FOUNDATIONAL
  ↓
  ├─→ Phase 3 (US1 - Add Task) [P1] ← MVP
  ├─→ Phase 4 (US2 - List Tasks) [P2]
  ├─→ Phase 5 (US3 - Complete Task) [P3]
  ├─→ Phase 6 (US4 - Update Task) [P4]
  └─→ Phase 7 (US5 - Delete Task) [P5]
  ↓
Phase 8 (Polish & Cross-Cutting)
```

**Notes**:
- Phase 1 must complete before any other phase
- Phase 2 (US6) must complete before Phases 3-7 (provides chat infrastructure)
- Phases 3-7 are independent and can be implemented in parallel after Phase 2
- Phase 8 can be done incrementally alongside Phases 3-7

---

## Parallel Execution Opportunities

### After Phase 2 Completion:

**Parallel Track 1: Core CRUD Operations**
- US1 (Add Task) - T025-T039
- US2 (List Tasks) - T040-T049
- US3 (Complete Task) - T050-T061
- US4 (Update Task) - T062-T073
- US5 (Delete Task) - T074-T083

*These can be developed in parallel since each operates on different MCP tools and agent prompts.*

**Parallel Track 2: Infrastructure Tasks**
- Error handling (T084-T088)
- Logging (T092-T094)
- Documentation (T095-T098)

**Parallel Track 3: Testing (if requested)**
- All test tasks (T099-T104) can be done in parallel

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**Goal**: Deliver basic chat functionality ASAP

1. **Phase 1**: Setup (T001-T005)
2. **Phase 2**: Conversation Persistence (T006-T024)
3. **Phase 3**: Add Task Only (T025-T039)

**MVP Deliverable**: Users can chat and create tasks via natural language. Proves the AI chat concept works.

### Full Feature Set
**Goal**: Complete all 5 basic todo operations

1. MVP (Phases 1-3)
2. **Phase 4**: List Tasks (T040-T049)
3. **Phase 5**: Complete Task (T050-T061)
4. **Phase 6**: Update Task (T062-T073)
5. **Phase 7**: Delete Task (T074-T083)
6. **Phase 8**: Polish (T084-T098)

### Testing Strategy (if requested)
- Unit tests alongside each implementation
- Integration tests after backend complete
- E2E tests after full stack complete

---

## Task Summary

**Total Tasks**: 104
**By Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (US6 - Foundational): 19 tasks
- Phase 3 (US1 - Add Task): 15 tasks
- Phase 4 (US2 - List Tasks): 10 tasks
- Phase 5 (US3 - Complete Task): 12 tasks
- Phase 6 (US4 - Update Task): 12 tasks
- Phase 7 (US5 - Delete Task): 10 tasks
- Phase 8 (Polish): 21 tasks

**Parallelizable Tasks**: 38 tasks marked with [P]

**By User Story**:
- US1 (Add Task): 15 tasks
- US2 (List Tasks): 10 tasks
- US3 (Complete Task): 12 tasks
- US4 (Update Task): 12 tasks
- US5 (Delete Task): 10 tasks
- US6 (Conversation Persistence): 19 tasks
- Infrastructure/Polish: 26 tasks

**MVP Scope**: 39 tasks (Phases 1-3)
**Full Feature Set**: 104 tasks (All phases)

---

## Next Steps

1. **Review & Approve**: Review this task breakdown for completeness
2. **Choose Scope**: Decide between MVP (Phases 1-3) or Full Feature Set (all phases)
3. **Begin Implementation**: Start with Phase 1 (Setup)
4. **Track Progress**: Update checkboxes as tasks complete
5. **Test Incrementally**: Test each user story independently as you complete it

**Recommended Approach**: Implement MVP first (Phases 1-3), test thoroughly, then add remaining features (Phases 4-7) in priority order.
