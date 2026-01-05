# Quickstart Guide: Phase I Todo Application

**Version**: Phase I (In-Memory Console Application)
**Last Updated**: 2025-12-28
**Target Audience**: End users

## Overview

This guide will help you run and use the Phase I Todo Application - a simple command-line tool for managing your daily tasks. All data is stored in memory and will be lost when you close the application.

---

## Prerequisites

**Required**:
- Python 3.11 or higher installed on your computer

**To Check Your Python Version**:
```bash
python --version
# or
python3 --version
```

You should see output like: `Python 3.11.0` or higher.

**Don't Have Python 3.11+?**
- Download from [python.org/downloads](https://www.python.org/downloads/)
- Install with default options
- Restart your terminal after installation

---

## Installation

**1. Clone or Download the Repository**
```bash
git clone <repository-url>
cd todo-app
```

**2. No Dependencies to Install!**
Phase I uses only Python's standard library, so no `pip install` needed.

---

## Running the Application

**From the Project Root Directory**:
```bash
python src/todo_app.py
```

**On Windows** (if `python` doesn't work):
```cmd
python3 src/todo_app.py
```

**On macOS/Linux**:
```bash
python3 src/todo_app.py
```

---

## Using the Application

### Main Menu

When you start the application, you'll see this menu:

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

**Navigation**: Type a number (1-7) and press Enter.

---

## Basic Operations

### 1. Adding a Task

**Steps**:
1. Select option `1` from the main menu
2. Enter a description for your task when prompted
3. Press Enter

**Example**:
```
Enter your choice: 1
Enter task description: Buy groceries
Task added successfully with ID: 1
```

**Tips**:
- Task descriptions can be any length
- Empty descriptions are not allowed
- You'll see a unique ID assigned to each task

---

### 2. Viewing Your Tasks

**Steps**:
1. Select option `2` from the main menu
2. See all your tasks displayed

**Example with Tasks**:
```
Enter your choice: 2

ID: 1 | Description: Buy groceries | Status: Incomplete
ID: 2 | Description: Call dentist | Status: Complete
ID: 3 | Description: Finish report | Status: Incomplete
```

**Example with No Tasks**:
```
Enter your choice: 2
No tasks found.
```

**Task Display Format**:
- **ID**: Unique number for referencing the task
- **Description**: What you need to do
- **Status**: Either "Complete" or "Incomplete"

---

### 3. Updating a Task

**Steps**:
1. Select option `3` from the main menu
2. Enter the ID of the task you want to update
3. Enter the new description
4. Press Enter

**Example**:
```
Enter your choice: 3
Enter task ID to update: 1
Enter new description: Buy organic groceries
Task updated successfully
```

**What Gets Updated**:
- ✅ Task description changes
- ✅ Task ID stays the same
- ✅ Completion status stays the same

---

### 4. Deleting a Task

**Steps**:
1. Select option `4` from the main menu
2. Enter the ID of the task you want to delete
3. Press Enter

**Example**:
```
Enter your choice: 4
Enter task ID to delete: 2
Task deleted successfully
```

**What Happens**:
- Task is permanently removed from the list
- Task ID is never reused (even if you add new tasks)

---

### 5. Marking a Task Complete

**Steps**:
1. Select option `5` from the main menu
2. Enter the ID of the task you completed
3. Press Enter

**Example**:
```
Enter your choice: 5
Enter task ID to mark complete: 1
Task marked as complete
```

**Result**: Task status changes from "Incomplete" to "Complete"

---

### 6. Marking a Task Incomplete

**Steps**:
1. Select option `6` from the main menu
2. Enter the ID of the task you want to mark incomplete
3. Press Enter

**Example**:
```
Enter your choice: 6
Enter task ID to mark incomplete: 1
Task marked as incomplete
```

**Result**: Task status changes from "Complete" to "Incomplete"

---

### 7. Exiting the Application

**Steps**:
1. Select option `7` from the main menu
2. Application closes immediately

**Example**:
```
Enter your choice: 7
Goodbye!
```

**⚠️ Important**: All your tasks will be lost when you exit (data is not saved).

---

## Common Workflows

### Daily Task Management

**Morning Routine**:
1. Start the application
2. Add all today's tasks (option 1)
3. View your task list (option 2)

**Throughout the Day**:
1. Mark tasks as complete when finished (option 5)
2. Add new tasks as they come up (option 1)
3. View progress frequently (option 2)

**End of Day**:
1. Review completed tasks (option 2)
2. Exit application (option 7)

**Next Day**: Start fresh (all data lost overnight)

---

### Correcting Mistakes

**Wrong Task Description**:
1. Use "Update Task" (option 3)
2. Enter the task ID
3. Type the correct description

**Wrong Task Added**:
1. Use "Delete Task" (option 4)
2. Enter the task ID
3. Task is removed

**Accidentally Marked Complete**:
1. Use "Mark Task Incomplete" (option 6)
2. Enter the task ID
3. Status resets to incomplete

---

## Error Messages

### "Invalid choice. Please enter a number between 1 and 7."
**Cause**: You entered something other than 1-7
**Fix**: Type a number from the menu (1, 2, 3, 4, 5, 6, or 7)

### "Description cannot be empty."
**Cause**: You pressed Enter without typing a task description
**Fix**: Type at least one character for the task description

### "Task with ID X not found."
**Cause**: You entered a task ID that doesn't exist
**Fix**:
1. View all tasks (option 2) to see valid IDs
2. Use a task ID from the list

**Common Reasons for Missing IDs**:
- Task was deleted
- You typed the wrong number
- Task was never created

---

## Troubleshooting

### Application Won't Start

**Problem**: "python: command not found" or "python3: command not found"
**Solution**:
1. Check if Python is installed: `python --version`
2. If not, install Python 3.11+ from [python.org](https://www.python.org)
3. Restart your terminal after installation

**Problem**: "No such file or directory: src/todo_app.py"
**Solution**:
1. Make sure you're in the project root directory
2. Check if the file exists: `ls src/` (Mac/Linux) or `dir src\` (Windows)
3. If missing, the application hasn't been implemented yet

**Problem**: "SyntaxError" or "unexpected indent"
**Solution**:
1. Your Python version may be too old
2. Check: `python --version` should be 3.11+
3. Upgrade Python if needed

### Application Crashes

**Problem**: Application closes unexpectedly
**Solution**:
1. Restart the application
2. If it happens repeatedly, check for Python errors in the terminal
3. Report the error message (for developers)

### Lost My Tasks

**Problem**: I added tasks but they're gone
**Solution**: This is expected behavior!
- Phase I does NOT save data
- All tasks are lost when you:
  - Close the application (option 7)
  - Close your terminal window
  - Restart your computer

**Workaround**: Keep the application running while working

---

## Limitations (Phase I)

**What Phase I Does NOT Do**:
- ❌ Save tasks to a file or database
- ❌ Support multiple users
- ❌ Set task due dates or priorities
- ❌ Search or filter tasks
- ❌ Sort tasks
- ❌ Undo or redo actions
- ❌ Export or import task lists
- ❌ Run as a web application
- ❌ Sync across devices

**What Phase I DOES**:
- ✅ Add tasks with unique IDs
- ✅ View all tasks
- ✅ Update task descriptions
- ✅ Delete tasks
- ✅ Mark tasks complete/incomplete
- ✅ Work offline (no internet needed)
- ✅ Simple and fast

**Future Phases**: More features coming in Phase II+ (persistence, web UI, multi-user, etc.)

---

## Frequently Asked Questions

### Q: How do I save my tasks?
**A**: Phase I does not support saving. All tasks are lost when you close the application. This is by design for the initial version.

### Q: Can I use this on multiple computers?
**A**: Yes, but each computer will have its own separate task list (no sync).

### Q: What happens if I enter a really long task description?
**A**: The application will accept it. Very long descriptions (>1000 characters) may wrap in the display.

### Q: Can I have duplicate task descriptions?
**A**: Yes! Tasks are identified by ID, not description. You can have multiple tasks with the same description.

### Q: Why do task IDs have gaps (e.g., 1, 3, 5)?
**A**: IDs are never reused after deletion. If you delete task 2, the next task will be ID 6 (not 2).

### Q: Can I change the menu options?
**A**: No, the menu is fixed in Phase I. Future versions may add customization.

### Q: Does this work on Windows/Mac/Linux?
**A**: Yes! Python 3.11+ runs on all major operating systems.

### Q: How many tasks can I add?
**A**: Practically unlimited. The application is tested with 100+ tasks without performance issues.

### Q: Can I run multiple instances of the application?
**A**: Yes, but each instance will have its own separate task list (no sharing between windows).

---

## Tips & Best Practices

### 1. Keep Descriptions Clear
- ✅ Good: "Buy milk at grocery store"
- ❌ Vague: "Shopping"

### 2. Use Task IDs Efficiently
- Write down important task IDs if you'll reference them frequently
- Use View Tasks (option 2) often to see current IDs

### 3. Mark Tasks Complete Regularly
- Complete tasks throughout the day (not all at once at the end)
- Provides sense of progress

### 4. Don't Rely on Data Persistence
- Phase I is for temporary task lists only
- Write down important tasks elsewhere before exiting

### 5. Restart Fresh Daily
- Exit and restart each morning for a clean slate
- Yesterday's tasks don't carry over (by design)

---

## Next Steps

### After Mastering Phase I
- Phase II (Coming Soon): Data persistence (tasks saved to database)
- Phase III (Future): Web interface and multi-user support
- Phase IV (Future): Cloud deployment and mobile apps
- Phase V (Future): AI-powered task suggestions and automation

### Provide Feedback
- Found a bug? Report it to the development team
- Have feature requests? They'll be considered for future phases
- Enjoying the app? Let us know!

---

## Summary

**To Use Phase I Todo Application**:
1. Install Python 3.11+
2. Run: `python src/todo_app.py`
3. Use numbered menu to manage tasks
4. Remember: Data is not saved (exit loses all tasks)
5. Have fun staying organized!

**Quick Reference**:
- Add Task: Option 1
- View Tasks: Option 2
- Update Task: Option 3
- Delete Task: Option 4
- Mark Complete: Option 5
- Mark Incomplete: Option 6
- Exit: Option 7

**Support**: For technical issues, contact the development team or check the project README.

---

**Version**: Phase I - In-Memory Console Application
**Last Updated**: 2025-12-28
