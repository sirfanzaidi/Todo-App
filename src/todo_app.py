"""
Phase I: Evolution of Todo - In-Memory Console Application

A simple command-line todo list manager with menu-driven interface.
All data is stored in memory and lost when the application exits.

Requirements: Python 3.11+
"""

import sys
import os
from dataclasses import dataclass

# Set UTF-8 encoding for Windows compatibility
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


# ============================================================================
# ANSI Color Codes for Beautiful Terminal Output
# ============================================================================

class Colors:
    """ANSI color codes for colorful terminal output."""
    # Text colors
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'

    # Styles
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

    # Reset
    RESET = '\033[0m'

    # Emojis for visual appeal
    CHECKMARK = '✅'
    CROSS = '❌'
    STAR = '⭐'
    ROCKET = '🚀'
    PENCIL = '✏️'
    TRASH = '🗑️'
    LIST = '📋'
    PLUS = '➕'
    EXIT_EMOJI = '👋'


# ============================================================================
# Task Model (Phase 2: T005-T006)
# ============================================================================

@dataclass(frozen=True)
class Task:
    """
    Represents a single todo task (immutable).

    Attributes:
        id: Unique sequential integer identifier (auto-assigned, never reused)
        description: Non-empty text describing what needs to be done
        is_complete: Boolean indicating whether the task is complete (default: False)
    """
    id: int
    description: str
    is_complete: bool = False


# ============================================================================
# TaskManager Service (Phase 2: T007-T010, Phase 5: T023-T024,
#                       Phase 6: T030, Phase 7: T035)
# ============================================================================

class TaskManager:
    """
    Business logic for task management.

    Manages task storage (in-memory dict), ID generation, and CRUD operations.
    """

    def __init__(self) -> None:
        """Initialize task manager with empty storage and ID counter starting at 1."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add_task(self, description: str) -> Task | None:
        """
        Add a new task with unique sequential ID.

        Args:
            description: Task description (validated by CLI layer)

        Returns:
            New Task object with assigned ID, or None if description is empty after strip

        Side Effects:
            - Increments internal ID counter
            - Adds task to storage dict
        """
        # Defensive: strip and check for empty (CLI should have validated)
        desc = description.strip()
        if not desc:
            return None

        task_id = self._next_id
        self._next_id += 1
        task = Task(id=task_id, description=desc, is_complete=False)
        self._tasks[task_id] = task
        return task

    def get_task(self, task_id: int) -> Task | None:
        """
        Retrieve a task by ID.

        Args:
            task_id: Task ID to retrieve

        Returns:
            Task object if found, None otherwise
        """
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> list[Task]:
        """
        Get all tasks.

        Returns:
            List of all Task objects (may be empty)
        """
        return list(self._tasks.values())

    def update_task(self, task_id: int, new_description: str) -> Task | None:
        """
        Update task description (creates new Task instance due to immutability).

        Args:
            task_id: Task ID to update
            new_description: New description (validated by CLI layer)

        Returns:
            Updated Task object, or None if ID not found or description empty

        Side Effects:
            - Replaces task in storage with new Task instance
        """
        old_task = self._tasks.get(task_id)
        if old_task is None:
            return None

        # Defensive: strip and check for empty (CLI should have validated)
        desc = new_description.strip()
        if not desc:
            return None

        new_task = Task(id=task_id, description=desc, is_complete=old_task.is_complete)
        self._tasks[task_id] = new_task
        return new_task

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by ID (ID is never reused).

        Args:
            task_id: Task ID to delete

        Returns:
            True if deleted, False if ID not found

        Side Effects:
            - Removes task from storage
            - ID counter does NOT decrement (IDs never reused)
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def mark_complete(self, task_id: int) -> Task | None:
        """
        Mark task as complete (creates new Task instance).

        Args:
            task_id: Task ID to mark complete

        Returns:
            Updated Task with is_complete=True, or None if ID not found

        Side Effects:
            - Replaces task in storage with new Task instance
        """
        old_task = self._tasks.get(task_id)
        if old_task is None:
            return None

        new_task = Task(id=task_id, description=old_task.description, is_complete=True)
        self._tasks[task_id] = new_task
        return new_task

    def mark_incomplete(self, task_id: int) -> Task | None:
        """
        Mark task as incomplete (creates new Task instance).

        Args:
            task_id: Task ID to mark incomplete

        Returns:
            Updated Task with is_complete=False, or None if ID not found

        Side Effects:
            - Replaces task in storage with new Task instance
        """
        old_task = self._tasks.get(task_id)
        if old_task is None:
            return None

        new_task = Task(id=task_id, description=old_task.description, is_complete=False)
        self._tasks[task_id] = new_task
        return new_task


# ============================================================================
# CLI Interface (Phase 3: T011-T018, Phase 4: T020-T022, Phase 5: T025-T029,
#               Phase 6: T031-T034, Phase 7: T036-T039)
# ============================================================================

class CLI:
    """
    Command-line interface for todo application.

    Handles user interaction, input validation, and display.
    """

    def __init__(self, manager: TaskManager) -> None:
        """
        Initialize CLI with TaskManager instance.

        Args:
            manager: TaskManager instance for business logic
        """
        self.manager = manager

    def display_menu(self) -> None:
        """Display main menu with 7 colorful options."""
        print(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 40}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.YELLOW}    ✨ TODO APPLICATION ✨{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.CYAN}{'=' * 40}{Colors.RESET}\n")
        print(f"{Colors.BOLD}{Colors.GREEN}1.{Colors.RESET} {Colors.PLUS}  {Colors.WHITE}Add Task{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.GREEN}2.{Colors.RESET} {Colors.LIST}  {Colors.WHITE}View Tasks{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.GREEN}3.{Colors.RESET} {Colors.PENCIL}  {Colors.WHITE}Update Task{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.GREEN}4.{Colors.RESET} {Colors.TRASH}  {Colors.WHITE}Delete Task{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.GREEN}5.{Colors.RESET} {Colors.CHECKMARK}  {Colors.WHITE}Mark Task Complete{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.GREEN}6.{Colors.RESET} {Colors.CROSS}  {Colors.WHITE}Mark Task Incomplete{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.GREEN}7.{Colors.RESET} {Colors.EXIT_EMOJI}  {Colors.WHITE}Exit{Colors.RESET}")

    def add_task_flow(self) -> None:
        """
        Add task flow: prompt for description, validate, add task, display result.

        Validation:
            - Description must not be empty after stripping whitespace
        """
        description = input(f"\n{Colors.CYAN}{Colors.PLUS} Enter task description: {Colors.RESET}").strip()
        if not description:
            print(f"{Colors.RED}{Colors.CROSS} Error: Description cannot be empty.{Colors.RESET}")
            return

        task = self.manager.add_task(description)
        if task:
            print(f"{Colors.GREEN}{Colors.ROCKET} Task added successfully with ID: {Colors.BOLD}{Colors.YELLOW}{task.id}{Colors.RESET}")
        else:
            print(f"{Colors.RED}{Colors.CROSS} Error: Failed to add task.{Colors.RESET}")

    def view_tasks_flow(self) -> None:
        """
        View tasks flow: retrieve all tasks, format and display.

        Format: "ID: X | Description: Y | Status: [Complete/Incomplete]"
        Empty list: "No tasks found."
        """
        tasks = self.manager.get_all_tasks()
        if not tasks:
            print(f"\n{Colors.YELLOW}{Colors.STAR} No tasks found. Add some tasks to get started!{Colors.RESET}")
            return

        print(f"\n{Colors.BOLD}{Colors.MAGENTA}📋 YOUR TODO LIST 📋{Colors.RESET}")
        print(f"{Colors.CYAN}{'─' * 60}{Colors.RESET}")
        for task in tasks:
            if task.is_complete:
                status_icon = Colors.CHECKMARK
                status_text = f"{Colors.GREEN}{Colors.BOLD}Complete{Colors.RESET}"
            else:
                status_icon = Colors.CROSS
                status_text = f"{Colors.YELLOW}Incomplete{Colors.RESET}"

            id_colored = f"{Colors.BOLD}{Colors.BLUE}{task.id}{Colors.RESET}"
            desc_colored = f"{Colors.WHITE}{task.description}{Colors.RESET}"
            print(f"{status_icon} {Colors.CYAN}ID:{Colors.RESET} {id_colored} {Colors.CYAN}|{Colors.RESET} {desc_colored} {Colors.CYAN}|{Colors.RESET} Status: {status_text}")
        print(f"{Colors.CYAN}{'─' * 60}{Colors.RESET}")

    def update_task_flow(self) -> None:
        """
        Update task flow: prompt for ID and new description, validate, update, display result.

        Validation:
            - Task ID must exist
            - New description must not be empty after stripping
        """
        try:
            task_id = int(input(f"\n{Colors.CYAN}{Colors.PENCIL} Enter task ID to update: {Colors.RESET}"))
        except ValueError:
            print(f"{Colors.RED}{Colors.CROSS} Error: Please enter a valid number.{Colors.RESET}")
            return

        task = self.manager.get_task(task_id)
        if task is None:
            print(f"{Colors.RED}{Colors.CROSS} Error: Task with ID {Colors.BOLD}{task_id}{Colors.RESET}{Colors.RED} not found.{Colors.RESET}")
            return

        new_description = input(f"{Colors.CYAN}Enter new description: {Colors.RESET}").strip()
        if not new_description:
            print(f"{Colors.RED}{Colors.CROSS} Error: Description cannot be empty.{Colors.RESET}")
            return

        updated_task = self.manager.update_task(task_id, new_description)
        if updated_task:
            print(f"{Colors.GREEN}{Colors.STAR} Task updated successfully!{Colors.RESET}")
        else:
            print(f"{Colors.RED}{Colors.CROSS} Error: Failed to update task.{Colors.RESET}")

    def delete_task_flow(self) -> None:
        """
        Delete task flow: prompt for ID, validate, delete, display result.

        Validation:
            - Task ID must exist
        """
        try:
            task_id = int(input(f"\n{Colors.RED}{Colors.TRASH} Enter task ID to delete: {Colors.RESET}"))
        except ValueError:
            print(f"{Colors.RED}{Colors.CROSS} Error: Please enter a valid number.{Colors.RESET}")
            return

        if self.manager.delete_task(task_id):
            print(f"{Colors.GREEN}{Colors.CHECKMARK} Task deleted successfully!{Colors.RESET}")
        else:
            print(f"{Colors.RED}{Colors.CROSS} Error: Task with ID {Colors.BOLD}{task_id}{Colors.RESET}{Colors.RED} not found.{Colors.RESET}")

    def mark_complete_flow(self) -> None:
        """
        Mark complete flow: prompt for ID, validate, mark complete, display result.

        Validation:
            - Task ID must exist
        """
        try:
            task_id = int(input(f"\n{Colors.GREEN}{Colors.CHECKMARK} Enter task ID to mark complete: {Colors.RESET}"))
        except ValueError:
            print(f"{Colors.RED}{Colors.CROSS} Error: Please enter a valid number.{Colors.RESET}")
            return

        task = self.manager.mark_complete(task_id)
        if task:
            print(f"{Colors.GREEN}{Colors.BOLD}{Colors.ROCKET} Task marked as complete! Great job! {Colors.RESET}")
        else:
            print(f"{Colors.RED}{Colors.CROSS} Error: Task with ID {Colors.BOLD}{task_id}{Colors.RESET}{Colors.RED} not found.{Colors.RESET}")

    def mark_incomplete_flow(self) -> None:
        """
        Mark incomplete flow: prompt for ID, validate, mark incomplete, display result.

        Validation:
            - Task ID must exist
        """
        try:
            task_id = int(input(f"\n{Colors.YELLOW}{Colors.CROSS} Enter task ID to mark incomplete: {Colors.RESET}"))
        except ValueError:
            print(f"{Colors.RED}{Colors.CROSS} Error: Please enter a valid number.{Colors.RESET}")
            return

        task = self.manager.mark_incomplete(task_id)
        if task:
            print(f"{Colors.YELLOW}{Colors.STAR} Task marked as incomplete.{Colors.RESET}")
        else:
            print(f"{Colors.RED}{Colors.CROSS} Error: Task with ID {Colors.BOLD}{task_id}{Colors.RESET}{Colors.RED} not found.{Colors.RESET}")

    def run(self) -> None:
        """
        Main application loop.

        Display menu, get user choice, dispatch to appropriate flow.
        Loop continues until user selects Exit (option 7).
        """
        while True:
            self.display_menu()
            choice = input(f"\n{Colors.BOLD}{Colors.MAGENTA}👉 Enter your choice: {Colors.RESET}").strip()

            if choice == "1":
                self.add_task_flow()
            elif choice == "2":
                self.view_tasks_flow()
            elif choice == "3":
                self.update_task_flow()
            elif choice == "4":
                self.delete_task_flow()
            elif choice == "5":
                self.mark_complete_flow()
            elif choice == "6":
                self.mark_incomplete_flow()
            elif choice == "7":
                print(f"\n{Colors.CYAN}{Colors.BOLD}{Colors.EXIT_EMOJI} Goodbye! Have a productive day! {Colors.EXIT_EMOJI}{Colors.RESET}\n")
                break
            else:
                print(f"{Colors.RED}{Colors.CROSS} Invalid choice. Please enter a number between {Colors.BOLD}1{Colors.RESET}{Colors.RED} and {Colors.BOLD}7{Colors.RESET}{Colors.RED}.{Colors.RESET}")


# ============================================================================
# Main Entry Point (Phase 3: T018-T019)
# ============================================================================

def main() -> None:
    """
    Application entry point.

    Checks Python version, creates TaskManager and CLI, runs application.
    """
    # Check Python version (require 3.11+)
    if sys.version_info < (3, 11):
        print(f"{Colors.RED}{Colors.CROSS} Error: This application requires Python 3.11 or higher.{Colors.RESET}")
        print(f"{Colors.YELLOW}Your Python version: {sys.version}{Colors.RESET}")
        print(f"{Colors.CYAN}Please upgrade Python and try again.{Colors.RESET}")
        sys.exit(1)

    # Display welcome banner
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 50}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.YELLOW}    🚀 WELCOME TO EVOLUTION OF TODO 🚀{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}         Phase I - Console Edition{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}         Made for GIAIC Students{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'=' * 50}{Colors.RESET}\n")
    print(f"{Colors.CYAN}💡 Tip: All data is stored in memory only!{Colors.RESET}")
    print(f"{Colors.YELLOW}⚠️  Your tasks will be lost when you exit.{Colors.RESET}\n")

    # Create TaskManager and CLI, run application
    manager = TaskManager()
    cli = CLI(manager)
    cli.run()


if __name__ == "__main__":
    main()
