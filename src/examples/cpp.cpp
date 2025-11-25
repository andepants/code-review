/**
 * Modern C++ Example
 *
 * This demonstrates:
 * - Classes and object-oriented programming
 * - Smart pointers (unique_ptr, shared_ptr)
 * - STL containers and algorithms
 * - Lambda expressions
 * - Move semantics
 * - RAII (Resource Acquisition Is Initialization)
 */

#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <algorithm>

class Todo {
private:
    int id;
    std::string text;
    bool completed;

public:
    // Constructor
    Todo(int id, std::string text)
        : id(id), text(std::move(text)), completed(false) {}

    // Getters
    int getId() const { return id; }
    std::string getText() const { return text; }
    bool isCompleted() const { return completed; }

    // Toggle completion
    void toggle() {
        completed = !completed;
    }

    // Display todo
    void display() const {
        std::string status = completed ? "✓" : "○";
        std::cout << "  [" << status << "] " << text << std::endl;
    }
};

class TodoList {
private:
    std::vector<std::unique_ptr<Todo>> todos;
    int nextId = 1;

public:
    // Add a new todo (demonstrates move semantics)
    Todo* add(std::string text) {
        auto todo = std::make_unique<Todo>(nextId++, std::move(text));
        Todo* ptr = todo.get();
        todos.push_back(std::move(todo));
        return ptr;
    }

    // Toggle todo by ID
    bool toggle(int id) {
        auto it = std::find_if(todos.begin(), todos.end(),
            [id](const std::unique_ptr<Todo>& todo) {
                return todo->getId() == id;
            });

        if (it != todos.end()) {
            (*it)->toggle();
            return true;
        }
        return false;
    }

    // Remove todo by ID
    bool remove(int id) {
        auto it = std::remove_if(todos.begin(), todos.end(),
            [id](const std::unique_ptr<Todo>& todo) {
                return todo->getId() == id;
            });

        if (it != todos.end()) {
            todos.erase(it, todos.end());
            return true;
        }
        return false;
    }

    // Display all todos
    void displayAll() const {
        std::cout << "All Todos:" << std::endl;
        for (const auto& todo : todos) {
            todo->display();
        }
    }

    // Count completed todos
    size_t countCompleted() const {
        return std::count_if(todos.begin(), todos.end(),
            [](const std::unique_ptr<Todo>& todo) {
                return todo->isCompleted();
            });
    }

    // Get total count
    size_t count() const {
        return todos.size();
    }
};

int main() {
    // Create todo list (RAII - automatic cleanup)
    TodoList todoList;

    // Add todos
    todoList.add("Learn modern C++");
    todoList.add("Understand smart pointers");
    todoList.add("Master STL algorithms");

    // Display all
    todoList.displayAll();

    // Toggle first todo
    todoList.toggle(1);

    // Calculate stats using lambda
    size_t total = todoList.count();
    size_t completed = todoList.countCompleted();
    size_t pending = total - completed;

    std::cout << "\nStats:" << std::endl;
    std::cout << "  Total: " << total << std::endl;
    std::cout << "  Completed: " << completed << std::endl;
    std::cout << "  Pending: " << pending << std::endl;

    // Demonstrate algorithm with lambda
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    std::cout << "\nSquared numbers: ";
    std::for_each(numbers.begin(), numbers.end(),
        [](int n) { std::cout << n * n << " "; });
    std::cout << std::endl;

    return 0;
    // RAII: todoList automatically cleaned up here
}
