# Tasks: Phase I - In-Memory Console Todo Application

**Input**: Design documents from `/specs/001-phase-i-console/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create src/ directory for application code
- [x] T002 Create tests/ directory for test files (future use)
- [x] T003 [P] Create .gitignore file with Python patterns (__pycache__, *.pyc, .pytest_cache, .mypy_cache)
- [x] T004 [P] Create README.md with Phase I description and quickstart instructions

**References**:
- plan.md: Project Structure section (lines 101-121)
- quickstart.md: Prerequisites and Running the Application sections

---

## Phase 2: Foundational (Core Data Model & Infrastructure)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create Task model as frozen dataclass with id, description, is_complete fields in src/todo_app.py
- [x] T006 Add type hints to Task model (int, str, bool with defaults per data-model.md)
- [x] T007 Create TaskManager class with __init__ method initializing _tasks dict and _next_id counter in src/todo_app.py
- [x] T008 Implement TaskManager.add_task(description: str) -> Task | None method with ID generation and validation
- [x] T009 Implement TaskManager.get_task(task_id: int) -> Task | None method with dict lookup
- [x] T010 Implement TaskManager.get_all_tasks() -> list[Task] method returning all tasks

**Checkpoint**: Foundation ready - user story implementation can now begin

**References**:
- plan.md: Phase 1 Design & Contracts section (lines 236-295)
- data-model.md: Task Entity specification (lines 8-48)
- research.md: Research decisions 1, 2, 3, 4 (Python dataclass, dict storage, ID generation)

---

## Phase 3: User Story 1 - Add and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks and view their complete task list

**Independent Test**: Launch application, add 3 tasks with different descriptions, view list showing all tasks with IDs and statuses

### Implementation for User Story 1

- [x] T011 [US1] Create CLI class with __init__ accepting TaskManager instance in src/todo_app.py
- [x] T012 [US1] Implement CLI.display_menu() method showing 7 menu options per spec.md lines 184-195
- [x] T013 [US1] Implement CLI.add_task_flow() method: prompt for description, validate non-empty, call TaskManager.add_task(), display success/error
- [x] T014 [US1] Implement CLI.view_tasks_flow() method: call TaskManager.get_all_tasks(), format output as "ID: X | Description: Y | Status: [Complete/Incomplete]"
- [x] T015 [US1] Handle empty task list in view_tasks_flow() by displaying "No tasks found." message per spec.md line 209
- [x] T016 [US1] Implement input validation in add_task_flow() to reject empty descriptions with error message per spec.md line 253
- [x] T017 [US1] Implement CLI.run() method with infinite loop, menu display, and input handling for options 1 and 2
- [x] T018 [US1] Add main entry point: create TaskManager, create CLI, call CLI.run() in src/todo_app.py
- [x] T019 [US1] Add Python version check at startup (require 3.11+) with clear error message if version too old

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can add tasks and view their complete list. This is the MVP!

**References**:
- spec.md: User Story 1 acceptance scenarios (lines 18-24)
- spec.md: CLI interaction flows for Add Task and View Tasks (lines 199-210)
- plan.md: CLI Layer design (lines 296-329)

---

## Phase 4: User Story 5 - Exit Application (Priority: P1)

**Goal**: Provide clean application exit mechanism

**Independent Test**: Launch application, select Exit option, verify application terminates gracefully without errors

### Implementation for User Story 5

- [x] T020 [US5] Add option 7 ("Exit") handling in CLI.run() method to break the infinite loop
- [x] T021 [US5] Display "Goodbye!" message before exiting per spec.md line 247
- [x] T022 [US5] Add invalid menu choice handling in CLI.run() for inputs not in 1-7 range with error message per spec.md line 251

**Checkpoint**: At this point, User Stories 1 AND 5 work independently. Application has core add/view functionality plus clean exit.

**References**:
- spec.md: User Story 5 acceptance scenarios (lines 87-88)
- spec.md: Exit flow (lines 246-248)
- plan.md: CLI menu loop design (lines 195-201)

---

## Phase 5: User Story 2 - Mark Tasks Complete (Priority: P2)

**Goal**: Enable users to track progress by marking tasks complete or incomplete

**Independent Test**: Add tasks (using US1), mark some complete, mark some incomplete, view list showing correct statuses

### Implementation for User Story 2

- [x] T023 [US2] Implement TaskManager.mark_complete(task_id: int) -> Task | None method creating new Task with is_complete=True
- [x] T024 [US2] Implement TaskManager.mark_incomplete(task_id: int) -> Task | None method creating new Task with is_complete=False
- [x] T025 [US2] Implement CLI.mark_complete_flow() method: prompt for ID, validate, call TaskManager.mark_complete(), display success/error
- [x] T026 [US2] Implement CLI.mark_incomplete_flow() method: prompt for ID, validate, call TaskManager.mark_incomplete(), display success/error
- [x] T027 [US2] Add option 5 ("Mark Task Complete") handling in CLI.run() calling mark_complete_flow()
- [x] T028 [US2] Add option 6 ("Mark Task Incomplete") handling in CLI.run() calling mark_incomplete_flow()
- [x] T029 [US2] Add task ID validation in mark_complete_flow() and mark_incomplete_flow() with error message "Task with ID X not found." per spec.md line 252

**Checkpoint**: At this point, User Stories 1, 5, AND 2 should all work independently. Users can now track task completion.

**References**:
- spec.md: User Story 2 acceptance scenarios (lines 37-40)
- spec.md: Mark Complete and Mark Incomplete flows (lines 230-244)
- plan.md: TaskManager service interface (lines 278-288)
- data-model.md: State transitions for mark_complete and mark_incomplete (lines 88-104)

---

## Phase 6: User Story 3 - Update Task Description (Priority: P3)

**Goal**: Allow users to edit task descriptions without deleting and re-adding

**Independent Test**: Add tasks (using US1), update description of a task, verify description changed while ID and status preserved

### Implementation for User Story 3

- [x] T030 [US3] Implement TaskManager.update_task(task_id: int, new_description: str) -> Task | None method creating new Task with updated description
- [x] T031 [US3] Implement CLI.update_task_flow() method: prompt for ID, validate exists, prompt for new description, validate non-empty, call TaskManager.update_task(), display success/error
- [x] T032 [US3] Add option 3 ("Update Task") handling in CLI.run() calling update_task_flow()
- [x] T033 [US3] Add task ID validation in update_task_flow() with error message if ID not found per spec.md line 252
- [x] T034 [US3] Add description validation in update_task_flow() to reject empty descriptions per spec.md line 253

**Checkpoint**: At this point, User Stories 1, 5, 2, AND 3 all work independently. Users can now edit task descriptions.

**References**:
- spec.md: User Story 3 acceptance scenarios (lines 54-56)
- spec.md: Update Task flow (lines 212-220)
- plan.md: TaskManager.update_task() contract (lines 351-358)
- data-model.md: State transition for update_task (lines 73-81)

---

## Phase 7: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Allow users to remove unwanted tasks from the list

**Independent Test**: Add tasks (using US1), delete a task by ID, verify task removed and ID not reused for new tasks

### Implementation for User Story 4

- [x] T035 [US4] Implement TaskManager.delete_task(task_id: int) -> bool method removing task from dict, returning True/False
- [x] T036 [US4] Implement CLI.delete_task_flow() method: prompt for ID, validate, call TaskManager.delete_task(), display success/error
- [x] T037 [US4] Add option 4 ("Delete Task") handling in CLI.run() calling delete_task_flow()
- [x] T038 [US4] Add task ID validation in delete_task_flow() with error message if ID not found per spec.md line 252
- [x] T039 [US4] Verify ID reuse prevention: add task, delete task, add new task, confirm new task gets next sequential ID (not deleted ID)

**Checkpoint**: All user stories (1, 5, 2, 3, 4) are now independently functional. Complete CRUD operations available.

**References**:
- spec.md: User Story 4 acceptance scenarios (lines 70-73)
- spec.md: Delete Task flow (lines 222-228)
- plan.md: TaskManager.delete_task() contract (lines 360-365)
- data-model.md: State transition for delete_task (lines 106-113)
- research.md: Task Deletion ID Handling decision (lines 55-74)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T040 [P] Add docstrings to Task dataclass describing fields and immutability
- [ ] T041 [P] Add docstrings to TaskManager class and all public methods with type signatures
- [ ] T042 [P] Add docstrings to CLI class and all methods
- [ ] T043 [P] Add whitespace stripping to description inputs in add_task_flow() and update_task_flow()
- [ ] T044 [P] Add try-except for ValueError around int() conversions for task IDs with user-friendly error message
- [ ] T045 Verify all error messages match spec.md lines 250-254 format and wording
- [ ] T046 Manual test: Run through all 7 menu options and verify expected behavior per spec.md acceptance scenarios
- [ ] T047 Manual test: Test all edge cases from spec.md lines 94-99 (invalid menu input, invalid IDs, whitespace descriptions, empty list, duplicate status changes)
- [ ] T048 Verify startup time <2s and operation time <1s per spec.md SC-005 and SC-006
- [ ] T049 [P] Run mypy type checking on src/todo_app.py and fix any type errors
- [ ] T050 [P] Run ruff linter on src/todo_app.py and fix any style issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational (Phase 2) - No dependencies on other stories
  - User Story 5 (P1): Can start after User Story 1 (needs CLI.run() loop from US1)
  - User Story 2 (P2): Can start after Foundational (Phase 2) - Independent of US1/US5 implementation
  - User Story 3 (P3): Can start after Foundational (Phase 2) - Independent of other stories
  - User Story 4 (P4): Can start after Foundational (Phase 2) - Independent of other stories
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

**Critical Path (MVP)**:
1. Setup (Phase 1) → 4 tasks
2. Foundational (Phase 2) → 6 tasks (T005-T010)
3. User Story 1 (Phase 3) → 9 tasks (T011-T019) 🎯 **MVP COMPLETE HERE**
4. User Story 5 (Phase 4) → 3 tasks (T020-T022)

**Additional Features** (can be added incrementally):
5. User Story 2 (Phase 5) → 7 tasks (T023-T029)
6. User Story 3 (Phase 6) → 5 tasks (T030-T034)
7. User Story 4 (Phase 7) → 5 tasks (T035-T039)
8. Polish (Phase 8) → 11 tasks (T040-T050)

### Within Each Phase

**Phase 2 (Foundational) - Sequential**:
- T005 (Task model) → T006 (type hints) → T007 (TaskManager init) → T008-T010 (methods)

**Phase 3 (User Story 1) - Mostly Sequential**:
- T011 (CLI init) → T012 (menu) → T013-T016 (flows) → T017 (run loop) → T018 (main) → T019 (version check)
- T013-T016 can be implemented in parallel (different methods)

**Phase 4 (User Story 5) - Sequential**:
- T020 → T021 → T022 (builds on T017 from US1)

**Phase 5 (User Story 2) - Parallel Opportunities**:
- T023-T024 can be done in parallel (different methods)
- T025-T026 can be done in parallel (different flows)
- T027-T029 sequential (depends on T025-T026)

**Phase 6 (User Story 3) - Sequential**:
- T030 → T031 → T032 → T033-T034

**Phase 7 (User Story 4) - Sequential**:
- T035 → T036 → T037 → T038 → T039

**Phase 8 (Polish) - Parallel Opportunities**:
- T040-T044 can all be done in parallel (different sections of code)
- T045-T048 sequential manual tests
- T049-T050 can be done in parallel (different tools)

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T003 and T004 can run in parallel (different files)

**Within Foundational (Phase 2)**:
- No parallelization (all tasks modify same file and depend on previous)

**Within User Story 1 (Phase 3)**:
- T013, T014, T015, T016 can run in parallel (different methods in CLI class)

**Within User Story 2 (Phase 5)**:
- T023 and T024 can run in parallel (TaskManager methods)
- T025 and T026 can run in parallel (CLI flows)

**Within Polish (Phase 8)**:
- T040, T041, T042, T043, T044 can run in parallel (documentation and validation)
- T049 and T050 can run in parallel (type checking and linting)

**Across User Stories** (after Foundational completes):
- User Story 2, 3, 4 can theoretically run in parallel (different methods)
- However, sequential implementation recommended for single developer

---

## Parallel Example: Foundational Phase

```bash
# Foundational tasks are sequential (all in same file, build on each other):
Task T005: Create Task dataclass
Task T006: Add type hints to Task
Task T007: Create TaskManager class
Task T008: Implement add_task method
Task T009: Implement get_task method
Task T010: Implement get_all_tasks method
```

---

## Parallel Example: User Story 1

```bash
# After T012 (menu) completes, these can run in parallel:
Task T013: "Implement add_task_flow in src/todo_app.py (CLI.add_task_flow method)"
Task T014: "Implement view_tasks_flow in src/todo_app.py (CLI.view_tasks_flow method)"
Task T015: "Handle empty list in view_tasks_flow in src/todo_app.py"
Task T016: "Add validation in add_task_flow in src/todo_app.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 5 Only)

**Delivers**: Basic task tracking with add, view, and exit capabilities

1. Complete Phase 1: Setup (4 tasks)
2. Complete Phase 2: Foundational (6 tasks) - CRITICAL blocker
3. Complete Phase 3: User Story 1 (9 tasks) - 🎯 **MVP READY**
4. Complete Phase 4: User Story 5 (3 tasks) - Clean exit
5. **STOP and VALIDATE**: Test MVP independently
6. Deploy/demo if ready

**Total MVP Tasks**: 22 tasks (T001-T022)
**Estimated Effort**: ~4-6 hours for experienced developer

### Incremental Delivery (Add Features One at a Time)

**Iteration 1 - MVP** (Foundation + US1 + US5):
1. Setup + Foundational → Foundation ready (10 tasks)
2. User Story 1 → Add and view tasks (9 tasks)
3. User Story 5 → Clean exit (3 tasks)
4. Test independently → Deploy/Demo (MVP!)

**Iteration 2 - Progress Tracking** (Add US2):
1. User Story 2 → Mark complete/incomplete (7 tasks)
2. Test independently → Deploy/Demo
3. Now users can track progress

**Iteration 3 - Edit Tasks** (Add US3):
1. User Story 3 → Update descriptions (5 tasks)
2. Test independently → Deploy/Demo
3. Now users can correct mistakes

**Iteration 4 - Delete Tasks** (Add US4):
1. User Story 4 → Delete tasks (5 tasks)
2. Test independently → Deploy/Demo
3. Full CRUD operations available

**Iteration 5 - Polish**:
1. Polish phase → Documentation and quality (11 tasks)
2. Final validation and testing
3. Production ready

### Full Implementation (All Features)

**Complete all phases sequentially**:
1. Phase 1: Setup (4 tasks)
2. Phase 2: Foundational (6 tasks)
3. Phase 3: User Story 1 (9 tasks)
4. Phase 4: User Story 5 (3 tasks)
5. Phase 5: User Story 2 (7 tasks)
6. Phase 6: User Story 3 (5 tasks)
7. Phase 7: User Story 4 (5 tasks)
8. Phase 8: Polish (11 tasks)

**Total Tasks**: 50 tasks
**Estimated Effort**: ~10-15 hours for experienced developer

---

## Task Breakdown Summary

### By Phase

| Phase | Tasks | Purpose |
|-------|-------|---------|
| Phase 1: Setup | T001-T004 (4 tasks) | Project structure |
| Phase 2: Foundational | T005-T010 (6 tasks) | Core data model and storage |
| Phase 3: User Story 1 (P1) | T011-T019 (9 tasks) | Add and view tasks (MVP) |
| Phase 4: User Story 5 (P1) | T020-T022 (3 tasks) | Clean exit |
| Phase 5: User Story 2 (P2) | T023-T029 (7 tasks) | Mark complete/incomplete |
| Phase 6: User Story 3 (P3) | T030-T034 (5 tasks) | Update descriptions |
| Phase 7: User Story 4 (P4) | T035-T039 (5 tasks) | Delete tasks |
| Phase 8: Polish | T040-T050 (11 tasks) | Documentation and quality |
| **TOTAL** | **50 tasks** | **Complete Phase I** |

### By User Story

| User Story | Priority | Tasks | Description |
|------------|----------|-------|-------------|
| US1 | P1 | 9 tasks (T011-T019) | Add and view tasks |
| US5 | P1 | 3 tasks (T020-T022) | Exit application |
| US2 | P2 | 7 tasks (T023-T029) | Mark complete/incomplete |
| US3 | P3 | 5 tasks (T030-T034) | Update task descriptions |
| US4 | P4 | 5 tasks (T035-T039) | Delete tasks |

### MVP Scope

**MVP = Setup + Foundational + US1 + US5**
- **Total Tasks**: 22 tasks (T001-T022)
- **Deliverables**: Add tasks, view tasks, clean exit
- **Value**: Basic task tracking application
- **Testing**: Covers spec.md User Story 1 and 5 acceptance scenarios

### Parallel Opportunities

**Tasks that CAN run in parallel** (marked with [P]):
- Phase 1: T003, T004 (2 tasks)
- Phase 3: T013-T016 (4 methods)
- Phase 5: T023-T024 (2 methods), T025-T026 (2 flows)
- Phase 8: T040-T044 (5 tasks), T049-T050 (2 tasks)

**Total Parallelizable**: ~15 tasks out of 50 (30%)

---

## Notes

- Each user story is independently testable per spec.md requirements
- MVP (US1 + US5) delivers immediate value as basic task tracker
- Incremental delivery allows testing and feedback between iterations
- No test automation tasks included (manual testing per plan.md Phase I strategy)
- All tasks reference specific sections in spec.md, plan.md, data-model.md, or research.md
- Stop at any checkpoint to validate story independently
- File path is single file: src/todo_app.py (per plan.md single-file approach)
- Avoid: vague tasks, cross-story dependencies that break independence

---

## Acceptance Criteria (Phase I Complete)

### Functional Requirements (All 16 from spec.md)

- ✅ FR-001: Text-based menu interface with 7 numbered options
- ✅ FR-002: Add tasks with text description
- ✅ FR-003: Unique sequential integer IDs starting from 1
- ✅ FR-004: Display all tasks with ID, description, status
- ✅ FR-005: Mark tasks complete by ID
- ✅ FR-006: Mark tasks incomplete by ID
- ✅ FR-007: Update task descriptions by ID
- ✅ FR-008: Delete tasks by ID
- ✅ FR-009: Validate task IDs with error messages
- ✅ FR-010: Prevent empty/whitespace descriptions
- ✅ FR-011: Display message when task list empty
- ✅ FR-012: Clean application exit
- ✅ FR-013: Handle invalid menu selections gracefully
- ✅ FR-014: In-memory storage only (no persistence)
- ✅ FR-015: Data lost on exit
- ✅ FR-016: Single-user application

### Success Criteria (All 7 from spec.md)

- ✅ SC-001: Add task and view within 10 seconds
- ✅ SC-002: 100% accurate task display
- ✅ SC-003: All operations succeed on first attempt
- ✅ SC-004: Graceful error handling
- ✅ SC-005: <2s startup time
- ✅ SC-006: Handle 100+ tasks without degradation
- ✅ SC-007: Data consistency maintained

### Quality Standards (per plan.md and constitution)

- ✅ Type hints on all functions (mypy compliance)
- ✅ Clean architecture (model/service/CLI separation)
- ✅ Input validation before business logic
- ✅ Clear error messages per spec
- ✅ No compiler/linter warnings
- ✅ Immutable Task dataclass (frozen=True)
- ✅ Sequential ID generation (never reused)
- ✅ Performance targets met (<2s startup, <1s operations)

---

**Status**: ✅ Task breakdown complete, ready for implementation
**Next Step**: Execute tasks sequentially or by iteration strategy
**MVP Target**: Tasks T001-T022 (22 tasks for basic functionality)
