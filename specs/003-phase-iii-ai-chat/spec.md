# Feature Specification: Phase III - AI-Powered Natural Language Todo Interface

**Feature Branch**: `003-phase-iii-ai-chat`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "Create the Phase III specification for the 'Evolution of Todo' project. Add an AI-powered conversational chatbot interface that allows users to manage their todo items using natural language, while keeping the existing Phase II web UI functional."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Task via Natural Language (Priority: P1)

Users can create new todos by typing natural language requests in a chat interface, such as "Add a task to buy groceries" or "Remind me to call the dentist."

**Why this priority**: Creating tasks is the most fundamental todo operation. Users must be able to add tasks before they can manage them. This is the core value proposition of the natural language interface.

**Independent Test**: Can be fully tested by typing various natural language task creation requests and verifying that tasks appear in the todo list with correct titles. Delivers immediate value by enabling the primary use case.

**Acceptance Scenarios**:

1. **Given** the user is logged in and viewing the chat interface, **When** they type "Add a task to buy groceries", **Then** a new task with title "buy groceries" is created and associated with their user account
2. **Given** the user is logged in, **When** they type "Create a todo for finishing the project report", **Then** a new task with title "finishing the project report" is created
3. **Given** the user has no existing tasks, **When** they add a task via chat, **Then** the task appears in their task list immediately
4. **Given** the user types "Add task: Review quarterly reports with description: Check all department submissions", **When** the AI processes the request, **Then** a task is created with title "Review quarterly reports" and description "Check all department submissions"
5. **Given** the user types an ambiguous request like "do something tomorrow", **When** the AI cannot determine a clear task title, **Then** the system asks for clarification
6. **Given** the user is not authenticated, **When** they attempt to add a task, **Then** the system returns an authentication error message

---

### User Story 2 - View/List Tasks via Natural Language (Priority: P2)

Users can view their tasks by asking questions like "What are my tasks?" or "Show me my todos" and receive a natural language response listing their current tasks.

**Why this priority**: After creating tasks, users need to view them. This completes the basic read-write cycle and allows users to interact entirely through the chat interface.

**Independent Test**: Can be fully tested by adding tasks through the existing Phase II interface and then requesting them via natural language. Delivers value by providing a conversational way to review tasks.

**Acceptance Scenarios**:

1. **Given** the user has 3 tasks in their list, **When** they ask "What are my tasks?", **Then** the system responds with a natural language list of all 3 tasks with their IDs and completion status
2. **Given** the user has no tasks, **When** they ask "Show me my todos", **Then** the system responds "You have no tasks"
3. **Given** the user has both completed and incomplete tasks, **When** they ask "What's pending?", **Then** the system lists only incomplete tasks
4. **Given** the user has completed tasks, **When** they ask "Show me completed tasks", **Then** the system lists only completed tasks
5. **Given** the user asks "List all tasks", **When** the AI processes the request, **Then** tasks are displayed with task IDs to enable subsequent operations (update, delete, complete)

---

### User Story 3 - Complete Task via Natural Language (Priority: P3)

Users can mark tasks as complete by saying "Mark task 3 as done" or "Complete the groceries task."

**Why this priority**: Completing tasks is essential for todo management. This priority is lower than viewing because users need to see tasks before they can complete specific ones.

**Independent Test**: Can be fully tested by creating tasks, then using natural language to mark them complete, and verifying status changes. Delivers value by enabling the full task lifecycle through conversation.

**Acceptance Scenarios**:

1. **Given** the user has a task with ID 3, **When** they say "Mark task 3 as done", **Then** the task is marked as completed and the system confirms "Task 3 'buy groceries' has been marked complete"
2. **Given** the user has multiple tasks including one titled "buy groceries", **When** they say "Complete the groceries task", **Then** the matching task is marked complete
3. **Given** the user references a non-existent task ID, **When** they try to complete it, **Then** the system responds "Task not found. Please check your task list."
4. **Given** a task is already completed, **When** the user tries to complete it again, **Then** the system confirms it's already done: "Task 3 is already complete"
5. **Given** multiple tasks match the user's description (e.g., two tasks with "groceries"), **When** they try to complete a task by title, **Then** the system lists matching tasks with IDs and asks "Which task did you mean? Task 3 or Task 7?"
6. **Given** a completed task, **When** the user says "Mark task 3 as incomplete" or "Reopen task 3", **Then** the task is marked as incomplete (toggle behavior)

---

### User Story 4 - Update Task via Natural Language (Priority: P4)

Users can modify existing tasks by saying "Change task 2 title to 'Call mom tonight'" or "Update the dentist task description to 'Bring insurance card'."

**Why this priority**: Updating tasks is less critical than creating, viewing, and completing them. Users can work around missing update functionality by deleting and recreating tasks.

**Independent Test**: Can be fully tested by creating a task and then modifying it via natural language, verifying the changes persist. Delivers value by allowing task refinement without switching interfaces.

**Acceptance Scenarios**:

1. **Given** the user has a task with ID 2 titled "buy groceries", **When** they say "Change task 2 title to 'buy groceries and milk'", **Then** the task title is updated and the system confirms the change
2. **Given** the user has a task with ID 5, **When** they say "Update task 5 description to 'Remember to check expiration dates'", **Then** the task description is updated
3. **Given** the user references a non-existent task ID, **When** they try to update it, **Then** the system responds "Task 42 not found"
4. **Given** the user says "Change the groceries task to...", **When** multiple tasks contain "groceries", **Then** the system asks "Which task did you mean?" and lists matching tasks with IDs
5. **Given** the user updates a task, **When** they view the task list, **Then** the updated task reflects the new title and/or description

---

### User Story 5 - Delete Task via Natural Language (Priority: P5)

Users can remove tasks by saying "Delete task 7" or "Remove the groceries task from my list."

**Why this priority**: Deletion is the least critical core operation. Users can ignore unwanted tasks or mark them complete as a workaround. It's included for completeness of the basic todo operations.

**Independent Test**: Can be fully tested by creating tasks and then deleting them via natural language, verifying they're removed from the list. Delivers value by completing the full CRUD operations through conversation.

**Acceptance Scenarios**:

1. **Given** the user has a task with ID 7, **When** they say "Delete task 7", **Then** the task is permanently removed and the system confirms "Task 7 'buy groceries' has been deleted"
2. **Given** the user references a non-existent task ID, **When** they try to delete it, **Then** the system responds "Task 42 not found"
3. **Given** the user says "Delete the groceries task", **When** multiple tasks match the description, **Then** the system asks for confirmation: "Which task did you mean? Task 3 or Task 7?"
4. **Given** the user deletes a task, **When** they ask to view their tasks, **Then** the deleted task does not appear in the list
5. **Given** the user has one task, **When** they delete it, **Then** their task list becomes empty and subsequent list requests return "You have no tasks"

---

### User Story 6 - Conversation History Persistence (Priority: P2)

Users' chat conversations with the AI are saved to the database and persist across browser sessions, allowing users to review past interactions.

**Why this priority**: Conversation persistence is essential for a good chat experience. Without it, users lose context every time they refresh the page, which would be frustrating and undermine the conversational UI value.

**Independent Test**: Can be fully tested by having a conversation, closing the browser, reopening, and verifying the conversation history is restored. Delivers value by maintaining context and enabling users to review past todo operations.

**Acceptance Scenarios**:

1. **Given** the user has a conversation with the AI assistant, **When** they refresh the browser, **Then** the full conversation history is restored in chronological order
2. **Given** the user closes their browser and returns later, **When** they open the chat interface, **Then** their previous conversations are still visible
3. **Given** the user has multiple conversations over several days, **When** they view the chat interface, **Then** messages are displayed in chronological order with timestamps
4. **Given** the user creates a task via chat, **When** they return later, **Then** both the task and the conversation about creating it are preserved
5. **Given** the user is logged out, **When** they log back in, **Then** their conversation history is associated with their user account and fully restored
6. **Given** a user sends a message, **When** the database save operation completes, **Then** the message is immediately visible in the chat interface even after refresh

---

### Edge Cases

- **Ambiguous Requests**: What happens when the user types a message that doesn't clearly map to any of the 5 basic operations (add, list, update, delete, complete)? System should respond with a helpful message: "I can help you add, list, update, complete, or delete tasks. What would you like to do?"

- **Advanced Features Requests**: How does the system handle requests for advanced features that are prohibited in Phase III (priorities, due dates, tags, search/filter/sort)? System should politely explain: "That feature isn't available yet, but I can help you [suggest alternative using basic features]."

- **AI Service Unavailable**: What happens when the AI agent is unavailable or the OpenAI API returns an error? System should display: "The AI assistant is temporarily unavailable. Please try again in a moment or use the standard todo interface."

- **Duplicate Task Names**: What happens if two tasks have very similar or identical names and the user tries to update or delete one? System should ask for clarification by showing task IDs: "I found 2 tasks matching 'groceries': Task 3 (created Jan 5) and Task 7 (created Jan 6). Which one?"

- **Rate Limiting**: How does the system handle rate limiting or API quota exhaustion? System should respond gracefully: "I'm experiencing high demand right now. Please try again in a few moments."

- **Large Conversation History**: What happens when a user's conversation history grows very large (hundreds of messages)? System should load the most recent 100 messages initially and provide a way to load older messages if needed.

- **Database Connection Failure**: What happens if the database connection fails while persisting a conversation message? System should retry the operation (up to 3 attempts) and inform the user if persistence fails: "Your message couldn't be saved. Please try again."

- **Task ID vs Title Ambiguity**: What happens when a user says "Complete task buy groceries" (mixing ID reference pattern with a title)? System should attempt to parse the intent and ask for clarification if ambiguous.

- **Empty or Whitespace-Only Messages**: What happens when the user sends an empty message or only whitespace? System should ignore it or prompt: "Please tell me what you'd like to do with your tasks."

- **Very Long Messages**: What happens when the user sends an extremely long message (>1000 characters)? System should process it but may ask for clarification if the request is unclear.

## Requirements *(mandatory)*

### Functional Requirements

**AI Chat Interface**:
- **FR-001**: System MUST provide a stateless POST endpoint at `/api/{user_id}/chat` that accepts natural language messages and returns AI-generated responses
- **FR-002**: System MUST authenticate all chat requests using the existing Phase II Better Auth authentication system
- **FR-003**: System MUST validate that the authenticated user matches the user_id in the chat endpoint URL
- **FR-004**: System MUST integrate OpenAI Agents SDK (Python) for AI agent functionality
- **FR-005**: System MUST use OpenAI ChatKit web component for the frontend chat interface
- **FR-006**: System MUST display conversation history in chronological order with clear visual distinction between user and assistant messages

**MCP Server and Tools**:
- **FR-007**: System MUST implement an MCP server using the Model Context Protocol SDK (modelcontextprotocol/python-sdk)
- **FR-008**: System MUST implement 5 stateless MCP tools: `add_task`, `list_tasks`, `update_task`, `delete_task`, `complete_task`
- **FR-009**: Each MCP tool MUST accept an authenticated user_id parameter and operate only on that user's data
- **FR-010**: All MCP tools MUST interact with the existing Task model from Phase II without modification
- **FR-011**: System MUST validate all MCP tool inputs before executing operations
- **FR-012**: System MUST log all MCP tool invocations with timestamps, user_id, tool name, and parameters for debugging and audit purposes

**Conversation Persistence**:
- **FR-013**: System MUST persist all chat conversations in the PostgreSQL database using new Conversation and Message models
- **FR-014**: System MUST NOT use in-memory conversation state; all state MUST be persisted in the database
- **FR-015**: System MUST associate each Conversation with a specific user from the Phase II authentication system
- **FR-016**: System MUST store each message with timestamp, role (user/assistant), content, and sequence order in the Message model
- **FR-017**: System MUST retrieve conversation history from the database on page load and display it in the chat interface
- **FR-018**: System MUST use SQLModel for Conversation and Message models, consistent with Phase II patterns
- **FR-019**: System MUST create a new Conversation when a user starts their first chat session
- **FR-020**: System MUST append new messages to the existing Conversation for subsequent chat interactions

**AI Agent Behavior**:
- **FR-021**: AI agent MUST correctly interpret natural language requests for all 5 basic todo operations (add, list, update, delete, complete)
- **FR-022**: AI agent MUST ask for clarification when user intent is ambiguous
- **FR-023**: AI agent MUST provide task IDs in list responses to enable subsequent operations
- **FR-024**: AI agent MUST provide confirmation messages after successful task operations (e.g., "Task 3 'buy groceries' has been completed")
- **FR-025**: AI agent MUST handle multiple tasks matching a description by asking the user to specify which task by ID
- **FR-026**: AI agent MUST politely decline requests for advanced features (priorities, due dates, tags, search/filter/sort) and explain they are not yet available
- **FR-027**: AI agent MUST handle errors gracefully and return user-friendly error messages without exposing technical details

**Error Handling**:
- **FR-028**: System MUST handle AI agent errors gracefully and return user-friendly error messages
- **FR-029**: System MUST handle database connection failures with retry logic (up to 3 attempts)
- **FR-030**: System MUST handle OpenAI API errors (rate limiting, quota, service unavailable) with appropriate user messages
- **FR-031**: System MUST validate all user input before passing to AI agent or MCP tools
- **FR-032**: System MUST return a 401 Unauthorized error for unauthenticated chat requests
- **FR-033**: System MUST return a 403 Forbidden error if authenticated user does not match the user_id in the request

**Phase II Integration**:
- **FR-034**: System MUST maintain all existing Phase II features (REST API, web UI) without breaking changes
- **FR-035**: System MUST ensure all MCP tools interact with the existing Task model from Phase II without schema modification
- **FR-036**: System MUST maintain API endpoint authentication using Phase II's Better Auth system
- **FR-037**: System MUST allow users to switch seamlessly between the chat interface and the traditional Phase II web UI

### MCP Tool Definitions

#### Tool 1: add_task

**Purpose**: Create a new task for the authenticated user.

**Parameters**:
- `user_id` (string, required): Authenticated user's unique identifier
- `title` (string, required): Task title (1-200 characters)
- `description` (string, optional): Task description (0-1000 characters, null if not provided)

**Returns**:
```json
{
  "task_id": 42,
  "title": "buy groceries",
  "description": "milk, eggs, bread",
  "is_completed": false,
  "created_at": "2026-01-05T14:30:00Z"
}
```

**Example Invocations**:
1. Simple task: `add_task(user_id="user123", title="buy groceries", description=null)`
2. Task with description: `add_task(user_id="user123", title="Finish project report", description="Include Q4 metrics and team feedback")`

**Error Cases**:
- Missing required title: Return error "Title is required"
- Title exceeds 200 characters: Return error "Title must be 200 characters or less"
- Description exceeds 1000 characters: Return error "Description must be 1000 characters or less"
- Database error: Return error "Unable to create task. Please try again."

---

#### Tool 2: list_tasks

**Purpose**: Retrieve tasks for the authenticated user with optional status filter.

**Parameters**:
- `user_id` (string, required): Authenticated user's unique identifier
- `status` (string, optional): Filter by status - "all" (default), "pending", or "completed"

**Returns**:
```json
{
  "tasks": [
    {
      "task_id": 42,
      "title": "buy groceries",
      "description": "milk, eggs, bread",
      "is_completed": false,
      "created_at": "2026-01-05T14:30:00Z"
    },
    {
      "task_id": 43,
      "title": "call dentist",
      "description": null,
      "is_completed": true,
      "created_at": "2026-01-05T10:15:00Z"
    }
  ],
  "total_count": 2,
  "filter_applied": "all"
}
```

**Example Invocations**:
1. All tasks: `list_tasks(user_id="user123", status="all")`
2. Pending only: `list_tasks(user_id="user123", status="pending")`
3. Completed only: `list_tasks(user_id="user123", status="completed")`

**Error Cases**:
- Invalid status value: Return error "Status must be 'all', 'pending', or 'completed'"
- Database error: Return error "Unable to retrieve tasks. Please try again."

---

#### Tool 3: update_task

**Purpose**: Update the title and/or description of an existing task.

**Parameters**:
- `user_id` (string, required): Authenticated user's unique identifier
- `task_id` (integer, required): Task identifier
- `title` (string, optional): New task title (1-200 characters, null if not updating)
- `description` (string, optional): New task description (0-1000 characters, null if not updating)

**Returns**:
```json
{
  "task_id": 42,
  "title": "buy groceries and milk",
  "description": "milk, eggs, bread, cheese",
  "is_completed": false,
  "updated_at": "2026-01-05T15:00:00Z"
}
```

**Example Invocations**:
1. Update title only: `update_task(user_id="user123", task_id=42, title="buy groceries and milk", description=null)`
2. Update description only: `update_task(user_id="user123", task_id=42, title=null, description="Remember to check expiration dates")`
3. Update both: `update_task(user_id="user123", task_id=42, title="Weekly shopping", description="Grocery store and pharmacy")`

**Error Cases**:
- Task not found: Return error "Task 42 not found"
- Task belongs to different user: Return error "Task 42 not found" (don't reveal it exists for another user)
- Neither title nor description provided: Return error "Please provide a title or description to update"
- Title exceeds 200 characters: Return error "Title must be 200 characters or less"
- Description exceeds 1000 characters: Return error "Description must be 1000 characters or less"
- Database error: Return error "Unable to update task. Please try again."

---

#### Tool 4: delete_task

**Purpose**: Permanently delete a task.

**Parameters**:
- `user_id` (string, required): Authenticated user's unique identifier
- `task_id` (integer, required): Task identifier

**Returns**:
```json
{
  "task_id": 42,
  "title": "buy groceries",
  "deleted": true,
  "deleted_at": "2026-01-05T15:30:00Z"
}
```

**Example Invocations**:
1. Delete by ID: `delete_task(user_id="user123", task_id=42)`

**Error Cases**:
- Task not found: Return error "Task 42 not found"
- Task belongs to different user: Return error "Task 42 not found" (don't reveal it exists for another user)
- Database error: Return error "Unable to delete task. Please try again."

---

#### Tool 5: complete_task

**Purpose**: Toggle the completion status of a task (mark as complete or incomplete).

**Parameters**:
- `user_id` (string, required): Authenticated user's unique identifier
- `task_id` (integer, required): Task identifier

**Returns**:
```json
{
  "task_id": 42,
  "title": "buy groceries",
  "is_completed": true,
  "completed_at": "2026-01-05T16:00:00Z"
}
```

**Example Invocations**:
1. Mark complete: `complete_task(user_id="user123", task_id=42)` → sets `is_completed=true`
2. Mark incomplete (reopen): `complete_task(user_id="user123", task_id=42)` → sets `is_completed=false` if already complete

**Error Cases**:
- Task not found: Return error "Task 42 not found"
- Task belongs to different user: Return error "Task 42 not found"
- Database error: Return error "Unable to update task status. Please try again."

### Chat API Definition

**Endpoint**: `POST /api/{user_id}/chat`

**Authentication**: Required (Better Auth from Phase II)

**Request Body**:
```json
{
  "conversation_id": 123,
  "message": "Add a task to buy groceries"
}
```

**Request Fields**:
- `conversation_id` (integer, optional): Existing conversation ID to continue, or `null` to start a new conversation
- `message` (string, required): User's natural language message (1-2000 characters)

**Response Body (Success)**:
```json
{
  "conversation_id": 123,
  "message_id": 456,
  "response": "I've added a new task: 'buy groceries' (Task ID: 42).",
  "tool_calls": [
    {
      "tool_name": "add_task",
      "parameters": {
        "user_id": "user123",
        "title": "buy groceries",
        "description": null
      },
      "result": {
        "task_id": 42,
        "title": "buy groceries"
      }
    }
  ],
  "timestamp": "2026-01-05T16:30:00Z"
}
```

**Response Fields**:
- `conversation_id` (integer): The conversation ID (newly created or existing)
- `message_id` (integer): The unique ID of the assistant's response message
- `response` (string): The AI assistant's natural language response
- `tool_calls` (array, optional): List of MCP tools invoked during this interaction
- `timestamp` (string): ISO 8601 timestamp of the response

**Response Body (Error)**:
```json
{
  "error": "authentication_required",
  "message": "You must be logged in to use the chat interface",
  "timestamp": "2026-01-05T16:30:00Z"
}
```

**Error Codes**:
- `400 Bad Request`: Invalid request format (missing message, message too long, invalid conversation_id)
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: Authenticated user does not match user_id in URL
- `404 Not Found`: Conversation ID provided does not exist or belongs to another user
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: AI service unavailable or database error
- `503 Service Unavailable`: OpenAI API temporarily unavailable

### Database Schema Additions

**New Table: conversations**

| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique conversation identifier |
| user_id | STRING/UUID | FOREIGN KEY (users.id), NOT NULL, INDEX | Reference to authenticated user from Phase II |
| title | VARCHAR(200) | NULLABLE | Optional conversation title (derived from first message or user-provided) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the conversation was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last time a message was added |

**Indexes**:
- Primary key on `id`
- Foreign key index on `user_id`
- Composite index on `(user_id, updated_at)` for efficient conversation retrieval

---

**New Table: messages**

| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique message identifier |
| conversation_id | INTEGER | FOREIGN KEY (conversations.id), NOT NULL, INDEX | Reference to parent conversation |
| role | ENUM('user', 'assistant') | NOT NULL | Who sent the message |
| content | TEXT | NOT NULL | Message content (up to 10,000 characters) |
| message_order | INTEGER | NOT NULL | Sequence number within conversation (1, 2, 3, ...) |
| tool_calls_json | JSON | NULLABLE | JSON array of MCP tool calls made (if role is 'assistant') |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the message was created |

**Indexes**:
- Primary key on `id`
- Foreign key index on `conversation_id`
- Composite index on `(conversation_id, message_order)` for efficient message retrieval in order

**Constraints**:
- FOREIGN KEY constraint on `conversations.user_id` references `users.id` ON DELETE CASCADE
- FOREIGN KEY constraint on `messages.conversation_id` references `conversations.id` ON DELETE CASCADE
- UNIQUE constraint on `(conversation_id, message_order)` to prevent duplicate sequence numbers

### Agent Behavior and Confirmation Rules

**Interpretation Rules**:
1. **Task Creation**: Extract task title from natural language. Keywords like "add", "create", "new task", "remind me" trigger `add_task` tool.
2. **Task Listing**: Keywords like "show", "list", "what are", "what's", "view" trigger `list_tasks` tool.
3. **Task Completion**: Keywords like "complete", "done", "finish", "mark as complete" trigger `complete_task` tool.
4. **Task Update**: Keywords like "change", "update", "modify", "edit" trigger `update_task` tool.
5. **Task Deletion**: Keywords like "delete", "remove", "cancel" trigger `delete_task` tool.

**Confirmation Rules**:
1. **Successful Operations**: Always confirm with specific details: "Task 3 'buy groceries' has been completed."
2. **Clarification Required**: When multiple tasks match, list them with IDs: "I found 2 tasks: Task 3 'buy groceries' and Task 7 'buy milk'. Which one?"
3. **Not Found**: Provide helpful error: "Task 99 not found. Type 'list tasks' to see all your tasks."
4. **Unsupported Features**: Polite decline: "I can't set due dates yet, but I can add 'Finish by Friday' to the task description if you'd like."
5. **Ambiguous Intent**: Ask for clarification: "I'm not sure what you'd like to do. Did you want to add a task, view your tasks, or something else?"

**Context Handling**:
1. **Single-Turn Operations**: Most operations complete in one user message + one assistant response.
2. **Multi-Turn Clarifications**: When clarification is needed, the assistant asks a question and waits for the user's next message.
3. **Conversation Memory**: The AI agent has access to the conversation history to maintain context (e.g., "the groceries task" refers to a task mentioned earlier in the conversation).

**Error Recovery**:
1. **Tool Errors**: If an MCP tool returns an error, the assistant explains it in natural language: "I couldn't complete that task because Task 42 doesn't exist."
2. **API Errors**: If OpenAI API fails, return cached error message: "I'm temporarily unavailable. Please try again shortly."
3. **Database Errors**: If conversation persistence fails, attempt retry (up to 3 times) and notify user if all retries fail.

### Key Entities *(mandatory)*

- **Conversation**: Represents a chat session between a user and the AI assistant. Attributes: unique identifier (integer), user_id (foreign key to User from Phase II), created timestamp, updated timestamp, optional conversation title (string, derived from first message or user-provided).

- **Message**: Represents a single message in a conversation. Attributes: unique identifier (integer), conversation_id (foreign key to Conversation), role (enum: 'user' or 'assistant'), content (text), message_order (integer sequence number), optional tool_calls_json (JSON array of MCP tool invocations), created timestamp.

- **Task**: Existing entity from Phase II (no modifications). Represents a todo item. Attributes: unique identifier (integer), user_id (foreign key to User), title (string), description (optional string), is_completed (boolean), created timestamp, updated timestamp. The AI agent operates on this entity through MCP tools.

- **User**: Existing entity from Phase II (no modifications). Represents an authenticated user. Attributes: unique identifier (UUID or string), email, hashed password, authentication tokens. Conversations and tasks are associated with users.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create a task using natural language in under 10 seconds from typing to task appearing in the list
- **SC-002**: Users can view all their tasks through natural language query with 100% accuracy (all tasks displayed, no incorrect tasks shown)
- **SC-003**: 90% of single-task operations (complete, update, delete) via natural language succeed on first attempt without requiring clarification when using task IDs
- **SC-004**: Conversation history persists across browser sessions with 100% message retention (no lost messages)
- **SC-005**: The chat interface loads conversation history in under 2 seconds for conversations up to 100 messages
- **SC-006**: All 5 basic todo operations (add, list, update, delete, complete) are accessible entirely through the chat interface without using the Phase II web UI
- **SC-007**: Users receive a response from the AI assistant within 3 seconds for 95% of requests under normal load
- **SC-008**: System correctly rejects and explains unavailability of 100% of advanced feature requests (priorities, due dates, tags, search/filter/sort) with helpful alternative suggestions
- **SC-009**: All existing Phase II functionality (REST API, web UI, authentication) continues to work without degradation or breaking changes
- **SC-010**: The system handles at least 50 concurrent chat users without response time degradation beyond 5 seconds (p95 latency)
- **SC-011**: The AI agent correctly interprets at least 85% of natural language task operation requests on first attempt
- **SC-012**: Task IDs are included in 100% of list responses to enable unambiguous subsequent operations

## Assumptions *(optional)*

- Users have a working Phase II deployment with authentication (Better Auth) and todo functionality already operational
- Users have access to valid OpenAI API credentials with sufficient quota for the expected usage volume (estimated 10,000 requests/month for pilot)
- The frontend environment supports modern web components required by OpenAI ChatKit (modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Database schema can be extended with new tables (Conversation, Message) without migration issues or breaking existing Phase II functionality
- Users have basic familiarity with chat interfaces and understand how to type natural language requests (similar to ChatGPT, Siri, Alexa)
- Network connectivity is stable enough to support real-time chat interactions with external AI services (latency <500ms, uptime >99%)
- The OpenAI API and MCP SDK are production-ready and stable for this use case
- Neon PostgreSQL database has sufficient capacity for conversation storage (estimated 500 conversations with 50 messages each = 25,000 message records for pilot)
- Users understand that the chat interface is complementary to the Phase II web UI, not a replacement
- OpenAI Agents SDK supports stateless MCP server integration (if not, alternative integration approach will be determined during planning)

## Dependencies *(optional)*

- **Phase II Completion**: All Phase II features (Better Auth authentication, task CRUD REST API, Next.js web UI) must be fully implemented, tested, and deployed before Phase III begins
- **OpenAI API Access**: Valid API key and sufficient quota for OpenAI services (GPT-4 or GPT-3.5 model, decision TBD during planning)
- **OpenAI Agents SDK**: Python SDK must be installed and configured (version compatibility and installation TBD during planning)
- **MCP SDK**: Model Context Protocol Python SDK (modelcontextprotocol/python-sdk) must be installed and compatible with OpenAI Agents SDK
- **OpenAI ChatKit**: Frontend web component must be available and compatible with the Next.js/TypeScript frontend (version and integration approach TBD during planning)
- **Database Migration Tools**: Ability to add new tables (Conversation, Message) to existing Neon PostgreSQL database using Alembic or equivalent migration tool
- **Existing Task Model**: Phase II Task model and REST API endpoints must remain unchanged and functional
- **Phase II Authentication**: Better Auth system must be accessible from both the chat API endpoint and MCP tools to validate user_id

## Scope Boundaries *(optional)*

### In Scope
- Natural language interface for 5 basic todo operations (add, list, update, delete, complete)
- OpenAI ChatKit web component integrated into existing Phase II Next.js web application
- Stateless chat API endpoint (`POST /api/{user_id}/chat`) with conversation_id parameter
- Conversation and message persistence in PostgreSQL database
- Stateless MCP server with 5 tools (add_task, list_tasks, update_task, delete_task, complete_task)
- Integration with existing Phase II Better Auth authentication
- Error handling for AI service failures, database failures, and invalid requests
- Conversation history retrieval and display on page load
- AI agent clarification prompts when user intent is ambiguous
- Polite rejection messages for advanced features not available in Phase III

### Out of Scope (Deferred to Phase V per Constitution v1.2.0)
- Advanced todo features: recurring tasks, due dates, reminders, priorities, tags
- Search, filter, and sort capabilities beyond basic "all/pending/completed" filter
- Event-driven architecture (Kafka, Dapr, message queues)
- Multi-turn complex task operations (e.g., bulk operations: "delete all completed tasks")
- Voice input or other non-text interaction modes (speech-to-text)
- Multi-language support (Phase III is English-only)
- Mobile native applications (web-only for Phase III, responsive design assumed from Phase II)
- Custom AI model training, fine-tuning, or RAG (Retrieval-Augmented Generation)
- Analytics dashboard for conversation data or usage metrics
- Admin interface for managing or viewing other users' conversations
- Export or backup of conversation history
- AI agent proactive suggestions ("You haven't completed 'buy groceries' in 3 days")
- Integration with external services (calendar, email, Slack, etc.)

## Constitutional Compliance *(mandatory)*

This specification complies with the Evolution of Todo Project Constitution v1.2.0:

**Principle I - Spec-Driven Development**:
- ✅ This specification is created before planning or task breakdown
- ✅ Spec defines WHAT and WHY (user value), not HOW (implementation)
- ✅ Approval required before proceeding to `/sp.plan`

**Principle IV - Technology Stack (Phase III)**:
- ✅ Backend AI Framework: OpenAI Agents SDK (Python) - Phase III approved
- ✅ MCP Server: Model Context Protocol SDK (modelcontextprotocol/python-sdk) - Phase III approved
- ✅ Frontend Chat: OpenAI ChatKit web component - Phase III approved
- ✅ Database: Extends Phase II Neon PostgreSQL with new tables (Conversation, Message)
- ✅ ORM: SQLModel for new models, consistent with Phase II
- ✅ Authentication: Reuses Phase II Better Auth, no new auth system
- ✅ Stateless MCP Tools: All 5 tools accept user_id parameter, no in-memory state
- ✅ Conversation Persistence: Database storage, not in-memory
- ❌ Advanced todo features (recurring, priorities, tags, search/filter/sort) - Prohibited in Phase III, deferred to Phase V
- ❌ Event-driven architecture (Kafka, Dapr) - Prohibited in Phase III, deferred to Phase V
- ❌ Container orchestration (Kubernetes, Docker) - Prohibited in Phase III, deferred to Phase IV+

**Principle III - Phase Governance**:
- ✅ Phase III scope strictly limited to 5 basic todo operations via natural language
- ✅ No Phase V features included (advanced todo capabilities)
- ✅ Phase II features remain unchanged and operational
- ✅ Phase boundary respected: AI/MCP only introduced in Phase III per constitution

**Principle V - Quality Standards**:
- ✅ Stateless Services: Chat API and MCP tools are stateless (state in database)
- ✅ Separation of Concerns: AI layer (agent, MCP) separated from existing Phase II business logic
- ✅ Cloud-Native Readiness: Stateless design supports horizontal scaling
- ✅ Security: Authentication enforced, user_id validated, no PII in logs
- ✅ Performance: Target p95 latency <3 seconds for chat responses
- ✅ Testing: All 5 operations independently testable (acceptance scenarios provided)
