# Python Todo App Example
#
# This demonstrates:
# - Classes and object-oriented programming
# - List comprehensions
# - File I/O for persistence
# - Python idioms and best practices

import json
from datetime import datetime
from typing import List, Dict

class Todo:
    """Represents a single todo item"""

    def __init__(self, text: str, todo_id: int = None):
        self.id = todo_id or int(datetime.now().timestamp() * 1000)
        self.text = text
        self.completed = False
        self.created_at = datetime.now().isoformat()

    def toggle(self):
        """Toggle the completion status"""
        self.completed = not self.completed

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed,
            'created_at': self.created_at
        }

    @staticmethod
    def from_dict(data: Dict) -> 'Todo':
        """Create Todo from dictionary"""
        todo = Todo(data['text'], data['id'])
        todo.completed = data['completed']
        todo.created_at = data['created_at']
        return todo


class TodoList:
    """Manages a list of todos with persistence"""

    def __init__(self, filename: str = 'todos.json'):
        self.filename = filename
        self.todos: List[Todo] = []
        self.load()

    def add(self, text: str) -> Todo:
        """Add a new todo"""
        todo = Todo(text)
        self.todos.append(todo)
        self.save()
        return todo

    def remove(self, todo_id: int) -> bool:
        """Remove a todo by ID"""
        initial_length = len(self.todos)
        self.todos = [t for t in self.todos if t.id != todo_id]
        if len(self.todos) < initial_length:
            self.save()
            return True
        return False

    def toggle(self, todo_id: int) -> bool:
        """Toggle a todo's completion status"""
        for todo in self.todos:
            if todo.id == todo_id:
                todo.toggle()
                self.save()
                return True
        return False

    def get_all(self) -> List[Todo]:
        """Get all todos"""
        return self.todos

    def get_completed(self) -> List[Todo]:
        """Get only completed todos"""
        return [t for t in self.todos if t.completed]

    def get_pending(self) -> List[Todo]:
        """Get only pending todos"""
        return [t for t in self.todos if not t.completed]

    def save(self):
        """Save todos to file"""
        try:
            with open(self.filename, 'w') as f:
                data = [todo.to_dict() for todo in self.todos]
                json.dump(data, f, indent=2)
        except IOError as e:
            print(f"Error saving todos: {e}")

    def load(self):
        """Load todos from file"""
        try:
            with open(self.filename, 'r') as f:
                data = json.load(f)
                self.todos = [Todo.from_dict(item) for item in data]
        except FileNotFoundError:
            # File doesn't exist yet, start with empty list
            self.todos = []
        except (IOError, json.JSONDecodeError) as e:
            print(f"Error loading todos: {e}")
            self.todos = []


# Example usage
if __name__ == '__main__':
    # Create todo list
    todo_list = TodoList()

    # Add some todos
    todo_list.add('Learn Python')
    todo_list.add('Build a REST API')
    todo_list.add('Deploy to production')

    # Display todos
    print("All Todos:")
    for todo in todo_list.get_all():
        status = '✓' if todo.completed else '○'
        print(f"  [{status}] {todo.text}")

    # Toggle first todo
    if todo_list.todos:
        todo_list.toggle(todo_list.todos[0].id)

    # Show stats
    print(f"\nStats:")
    print(f"  Total: {len(todo_list.get_all())}")
    print(f"  Completed: {len(todo_list.get_completed())}")
    print(f"  Pending: {len(todo_list.get_pending())}")
