# Evolution of Todo - Phase I

**In-Memory Console Todo Application**

A simple command-line todo list manager for tracking tasks. All data is stored in memory and lost when the application closes.

## Features

- ✅ Add tasks with unique sequential IDs
- ✅ View all tasks with descriptions and completion status
- ✅ Update task descriptions
- ✅ Delete tasks
- ✅ Mark tasks as complete or incomplete
- ✅ Clean application exit

## Prerequisites

- Python 3.11 or higher

To check your Python version:
```bash
python --version
# or
python3 --version
```

## Installation

No external dependencies required! This application uses only Python's standard library.

```bash
# Clone the repository
git clone <repository-url>
cd todo-app
```

## Running the Application

From the project root directory:

```bash
python src/todo_app.py
```

Or on some systems:
```bash
python3 src/todo_app.py
```

## Usage

The application presents a menu-driven interface:

```
=== Todo Application ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Mark Task Complete
6. Mark Task Incomplete
7. Exit

Enter your choice:
```

### Basic Operations

**Add a Task**:
1. Select option `1`
2. Enter a description for your task
3. Task is added with a unique ID

**View Tasks**:
1. Select option `2`
2. See all tasks with IDs, descriptions, and statuses

**Update a Task**:
1. Select option `3`
2. Enter the task ID
3. Enter the new description

**Delete a Task**:
1. Select option `4`
2. Enter the task ID to delete

**Mark Task Complete/Incomplete**:
1. Select option `5` (complete) or `6` (incomplete)
2. Enter the task ID

**Exit**:
1. Select option `7`
2. Application closes (all data is lost)

## Important Notes

⚠️ **Data is NOT saved** - All tasks are stored in memory only and will be lost when you:
- Exit the application
- Close your terminal
- Restart your computer

This is by design for Phase I. Data persistence will be added in Phase II.

## Project Structure

```
todo-app/
├── src/
│   └── todo_app.py      # Main application (single file)
├── tests/               # Test files (future use)
├── specs/               # Specifications and documentation
│   └── 001-phase-i-console/
│       ├── spec.md      # Feature specification
│       ├── plan.md      # Implementation plan
│       ├── data-model.md    # Data model design
│       ├── quickstart.md    # User guide
│       └── tasks.md     # Task breakdown
└── README.md            # This file
```

## Development

**Type Checking** (requires mypy):
```bash
mypy src/todo_app.py
```

**Linting** (requires ruff):
```bash
ruff check src/todo_app.py
```

## Phase Information

This is **Phase I** of the Evolution of Todo project:
- **Phase I**: In-memory console application (current)
- **Phase II**: Data persistence with database
- **Phase III**: Web interface and multi-user support
- **Phase IV**: Cloud deployment
- **Phase V**: AI-powered features

## License

See project license file.

## Contributing

This project follows Spec-Driven Development (SDD). All changes must go through:
1. Specification update
2. Planning
3. Task breakdown
4. Implementation

See `.specify/memory/constitution.md` for governance rules.
