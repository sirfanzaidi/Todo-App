# Data Model: Phase I - In-Memory Console Todo Application

**Feature**: Phase I - In-Memory Console Todo Application
**Date**: 2025-12-28
**Purpose**: Define data structures, validation rules, state transitions, and invariants

## Overview

Phase I uses a minimal data model with a single entity: **Task**. All data is stored in memory (no database) and lost when the application exits. The model design prioritizes simplicity, type safety, and immutability.

---

## Entity: Task

### Definition

A Task represents a single todo item with a unique identifier, description, and completion status.

### Python Implementation

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Task:
    """
    Represents a single todo task.

    Immutable: Once created, fields cannot be modified. Updates create new Task instances.

    Attributes:
        id: Unique sequential integer identifier (auto-assigned, never reused)
        description: Non-empty text describing what needs to be done
        is_complete: Boolean indicating whether the task is complete (default: False)
    """
    id: int
    description: str
    is_complete: bool = False
```

### Field Specifications

#### `id: int`
- **Type**: Positive integer
- **Assignment**: Auto-assigned by TaskManager on task creation
- **Range**: 1 to 2^31-1 (practical limit, Python ints have unlimited precision)
- **Uniqueness**: No two tasks in memory have the same ID at any point
- **Immutability**: ID never changes after task creation
- **Reuse Policy**: IDs are NEVER reused after task deletion
- **Generation**: Sequential counter starting at 1, incremented by 1 for each new task

**Justification**: Meets spec requirement FR-003 ("unique sequential integer ID starting from 1")

#### `description: str`
- **Type**: String (UTF-8 text)
- **Constraints**:
  - MUST NOT be empty after stripping whitespace
  - MUST have at least one non-whitespace character
  - Length: No maximum (handle gracefully, warn if >1000 characters)
- **Mutability**: Can be updated via `update_task` operation (creates new Task)
- **Validation**: Performed at CLI layer before TaskManager call
- **Storage**: Python string (immutable, efficient memory representation)

**Justification**: Meets spec requirement FR-002, FR-007, FR-010 (task description with validation)

#### `is_complete: bool`
- **Type**: Boolean (True or False)
- **Default**: `False` (incomplete) when task is created
- **Mutability**: Can be toggled via `mark_complete` / `mark_incomplete` operations
- **Display**:
  - `True` → "Complete"
  - `False` → "Incomplete"
- **Storage**: Single byte in memory

**Justification**: Meets spec requirement FR-005, FR-006 (completion status tracking)

---

## Validation Rules

### Pre-Creation Validation (CLI Layer)

**Rule V1: Description Non-Empty**
- **Check**: `description.strip() != ""`
- **Timing**: Before calling `TaskManager.add_task()`
- **Error**: "Description cannot be empty."
- **Reason**: Spec requirement FR-010

**Rule V2: Description Valid Characters**
- **Check**: Allow all UTF-8 characters (no restrictions)
- **Timing**: No validation needed (Python strings support UTF-8)
- **Reason**: Spec does not restrict character set

### Post-Creation Invariants (TaskManager)

**Invariant I1: ID Uniqueness**
- **Rule**: No two tasks in `dict[int, Task]` have the same ID
- **Enforcement**: Dict keys are unique by definition
- **Verification**: Automatic (Python dict guarantees)

**Invariant I2: ID Positivity**
- **Rule**: All task IDs are positive integers (>= 1)
- **Enforcement**: Counter starts at 1, only increments
- **Verification**: No code path can create ID < 1

**Invariant I3: Description Non-Empty in Storage**
- **Rule**: No task in storage has empty description
- **Enforcement**: CLI validation prevents empty descriptions
- **Verification**: Manual testing (automated in Phase II)

**Invariant I4: Sequential ID Gaps**
- **Rule**: ID sequence may have gaps (after deletions), but no ID is ever reused
- **Enforcement**: Counter never decrements or resets
- **Verification**: Manual testing of delete operations

---

## State Transitions

### Task Lifecycle

```
[No Task]
    |
    | add_task(description) → Task(id=N, description=desc, is_complete=False)
    v
[Incomplete Task]
    |
    |-- update_task(new_desc) → Task(id=N, description=new_desc, is_complete=False)
    |-- mark_complete() → Task(id=N, description=desc, is_complete=True)
    |-- delete_task() → [No Task]
    v
[Complete Task]
    |
    |-- update_task(new_desc) → Task(id=N, description=new_desc, is_complete=True)
    |-- mark_incomplete() → Task(id=N, description=desc, is_complete=False)
    |-- delete_task() → [No Task]
```

### Operation Details

#### 1. Create Task (`add_task`)
- **Input**: `description: str` (validated by CLI)
- **Process**:
  1. Generate new ID: `id = next_id`
  2. Increment counter: `next_id += 1`
  3. Create Task: `Task(id=id, description=description, is_complete=False)`
  4. Store: `tasks[id] = task`
- **Output**: New `Task` object
- **State Change**: `[No Task]` → `[Incomplete Task]`

#### 2. Update Description (`update_task`)
- **Input**: `task_id: int`, `new_description: str` (validated by CLI)
- **Process**:
  1. Retrieve old task: `old_task = tasks[task_id]`
  2. Create new task: `Task(id=task_id, description=new_description, is_complete=old_task.is_complete)`
  3. Replace: `tasks[task_id] = new_task`
- **Output**: Updated `Task` object (or `None` if not found)
- **State Change**: `[Task]` → `[Task with new description]`
- **Preservation**: ID and completion status remain unchanged

#### 3. Mark Complete (`mark_complete`)
- **Input**: `task_id: int`
- **Process**:
  1. Retrieve old task: `old_task = tasks[task_id]`
  2. Create new task: `Task(id=task_id, description=old_task.description, is_complete=True)`
  3. Replace: `tasks[task_id] = new_task`
- **Output**: Updated `Task` object (or `None` if not found)
- **State Change**: `[Incomplete Task]` → `[Complete Task]`
- **Preservation**: ID and description remain unchanged

#### 4. Mark Incomplete (`mark_incomplete`)
- **Input**: `task_id: int`
- **Process**:
  1. Retrieve old task: `old_task = tasks[task_id]`
  2. Create new task: `Task(id=task_id, description=old_task.description, is_complete=False)`
  3. Replace: `tasks[task_id] = new_task`
- **Output**: Updated `Task` object (or `None` if not found)
- **State Change**: `[Complete Task]` → `[Incomplete Task]`
- **Preservation**: ID and description remain unchanged

#### 5. Delete Task (`delete_task`)
- **Input**: `task_id: int`
- **Process**:
  1. Check existence: `task_id in tasks`
  2. Remove: `del tasks[task_id]`
- **Output**: `True` if deleted, `False` if not found
- **State Change**: `[Task]` → `[No Task]`
- **Note**: ID is never reused (`next_id` does not decrement)

#### 6. View Task (`get_task`)
- **Input**: `task_id: int`
- **Process**: Return `tasks.get(task_id)`
- **Output**: `Task` object or `None`
- **State Change**: None (read-only operation)

#### 7. View All Tasks (`get_all_tasks`)
- **Input**: None
- **Process**: Return `list(tasks.values())`
- **Output**: `list[Task]` (may be empty)
- **State Change**: None (read-only operation)

---

## Storage Model

### In-Memory Structure

```python
class TaskManager:
    def __init__(self):
        self._tasks: dict[int, Task] = {}  # Task storage (ID → Task)
        self._next_id: int = 1             # Sequential ID counter
```

### Storage Characteristics

| Property | Value | Justification |
|----------|-------|---------------|
| **Data Structure** | `dict[int, Task]` | O(1) lookup by ID |
| **Key Type** | `int` (task ID) | Simple, efficient, user-friendly |
| **Value Type** | `Task` (frozen dataclass) | Immutable, type-safe |
| **Capacity** | Unlimited (practical: 10k+ tasks) | Python dict scales well |
| **Memory per Task** | ~150 bytes | Task object + dict overhead |
| **Persistence** | None (lost on exit) | Phase I spec requirement FR-014, FR-015 |

### Memory Estimates

| Task Count | Memory Usage (approx) |
|------------|-----------------------|
| 10 tasks   | ~1.5 KB               |
| 100 tasks  | ~15 KB                |
| 1000 tasks | ~150 KB               |
| 10000 tasks| ~1.5 MB               |

**Conclusion**: Memory usage is negligible for Phase I target (<100 tasks per SC-006)

---

## Data Integrity

### Immutability Guarantees

**Why Immutable?**
- Prevents accidental mutation bugs
- Clear update semantics (replace entire task)
- Easier to reason about state changes
- Thread-safe (future consideration)

**How Enforced?**
- `@dataclass(frozen=True)` prevents attribute assignment after creation
- Python raises `FrozenInstanceError` on mutation attempts
- Example:
  ```python
  task = Task(id=1, description="Buy milk", is_complete=False)
  task.description = "Buy bread"  # ❌ FrozenInstanceError
  ```

### Update Pattern (Correct)

```python
# Retrieve old task
old_task = manager.get_task(1)

# Create new task with updated field
new_task = Task(
    id=old_task.id,
    description="Buy bread",  # Updated
    is_complete=old_task.is_complete  # Preserved
)

# Replace in storage
manager._tasks[1] = new_task
```

---

## Edge Cases & Constraints

### ID Generation Edge Cases

| Scenario | Behavior | Justification |
|----------|----------|---------------|
| **First task** | ID = 1 | Spec requirement FR-003 |
| **After delete** | IDs not reused | Prevents user confusion |
| **100+ tasks** | Sequential increment continues | No maximum limit |
| **Python int limit** | ~2^63 on 64-bit systems | Effectively unlimited |

### Description Edge Cases

| Scenario | Behavior | Validation Point |
|----------|----------|------------------|
| **Empty string** | Rejected | CLI (before TaskManager) |
| **Whitespace only** | Rejected after strip | CLI (before TaskManager) |
| **1000+ chars** | Accepted (warn user) | Future enhancement |
| **Special chars** | Accepted | No restrictions |
| **UTF-8 emoji** | Accepted | Python strings support UTF-8 |

### Completion Status Edge Cases

| Scenario | Behavior | Justification |
|----------|----------|---------------|
| **Mark complete twice** | Idempotent (no change) | CLI displays success both times |
| **Mark incomplete twice** | Idempotent (no change) | CLI displays success both times |
| **Toggle rapidly** | Each operation creates new Task | Immutability requires replacement |

---

## Relationships

Phase I has **no relationships** between entities (only one entity: Task).

**Future Phases**:
- Phase II: Task → User (many-to-one)
- Phase III: Task → Tag (many-to-many)
- Phase IV: Task → Project (many-to-one)

---

## Schema Evolution (Future Phases)

### Phase I → Phase II Migration

**Challenge**: Transition from in-memory dict to database (SQLModel + Neon DB)

**Planned Changes**:
1. Add `created_at: datetime` field (timestamp)
2. Add `updated_at: datetime` field (auto-updated)
3. Add `user_id: int` field (foreign key to User table)
4. Convert Task to SQLModel model (inherits from SQLModel + table=True)

**Backwards Compatibility**: Not required (Phase I has no persistence)

### Phase II → Phase III Migration

**Planned Additions**:
1. Add `due_date: datetime | None` field (optional)
2. Add `priority: int` field (1=low, 2=medium, 3=high)
3. Add many-to-many relationship with Tag table

### Phase III+ Evolution

Deferred to future phase specifications per constitution (Phase Governance).

---

## Validation Summary

### CLI Layer Validations
- ✅ Description non-empty after strip
- ✅ Menu choice is 1-7
- ✅ Task ID is positive integer
- ✅ Task ID exists before update/delete/mark operations

### TaskManager Layer Validations
- ✅ No validations needed (assumes CLI validates)
- ✅ Defensive: return None/False for not-found cases

### Python Type System Validations
- ✅ Type hints enforced by mypy (static analysis)
- ✅ Dataclass frozen=True prevents mutation
- ✅ Dict key uniqueness prevents ID collisions

---

## Performance Characteristics

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| `add_task` | O(1) | O(1) | Dict insert |
| `get_task` | O(1) | O(1) | Dict lookup |
| `get_all_tasks` | O(n) | O(n) | Dict values iteration |
| `update_task` | O(1) | O(1) | Dict replace |
| `delete_task` | O(1) | O(1) | Dict delete |
| `mark_complete` | O(1) | O(1) | Dict replace |
| `mark_incomplete` | O(1) | O(1) | Dict replace |

**where** n = number of tasks in memory (target: ≤ 100 per spec SC-006)

---

## Conclusion

The Phase I data model is minimal, type-safe, and immutable. It satisfies all spec requirements (FR-001 through FR-016) while maintaining simplicity appropriate for a console application. Future phases will extend this model with persistence, relationships, and additional fields following the same principled approach.

**Key Design Decisions**:
1. ✅ Immutable Task dataclass (frozen=True)
2. ✅ Sequential integer IDs starting at 1
3. ✅ In-memory dict storage (no persistence)
4. ✅ Validation at CLI layer (separation of concerns)
5. ✅ Type hints throughout (mypy compliance)

**Status**: ✅ Data model complete, ready for implementation
