// Go Syntax Example
//
// This demonstrates:
// - Package structure and imports
// - Structs and methods
// - Interfaces and polymorphism
// - Goroutines and channels (concurrency)
// - Error handling

package main

import (
	"fmt"
	"sync"
	"time"
)

// Todo represents a single todo item
type Todo struct {
	ID        int
	Text      string
	Completed bool
}

// Toggle toggles the completion status
func (t *Todo) Toggle() {
	t.Completed = !t.Completed
}

// TodoList manages a collection of todos
type TodoList struct {
	todos []Todo
	mu    sync.Mutex // Mutex for thread-safe operations
}

// NewTodoList creates a new todo list
func NewTodoList() *TodoList {
	return &TodoList{
		todos: make([]Todo, 0),
	}
}

// Add adds a new todo
func (tl *TodoList) Add(text string) *Todo {
	tl.mu.Lock()
	defer tl.mu.Unlock()

	todo := Todo{
		ID:        len(tl.todos) + 1,
		Text:      text,
		Completed: false,
	}
	tl.todos = append(tl.todos, todo)
	return &todo
}

// Toggle toggles a todo by ID
func (tl *TodoList) Toggle(id int) bool {
	tl.mu.Lock()
	defer tl.mu.Unlock()

	for i := range tl.todos {
		if tl.todos[i].ID == id {
			tl.todos[i].Toggle()
			return true
		}
	}
	return false
}

// GetAll returns all todos
func (tl *TodoList) GetAll() []Todo {
	tl.mu.Lock()
	defer tl.mu.Unlock()

	// Return a copy to prevent external modification
	result := make([]Todo, len(tl.todos))
	copy(result, tl.todos)
	return result
}

// GetCompleted returns only completed todos
func (tl *TodoList) GetCompleted() []Todo {
	tl.mu.Lock()
	defer tl.mu.Unlock()

	completed := make([]Todo, 0)
	for _, todo := range tl.todos {
		if todo.Completed {
			completed = append(completed, todo)
		}
	}
	return completed
}

// processTodo simulates async processing using goroutines
func processTodo(todo Todo, ch chan<- string) {
	time.Sleep(100 * time.Millisecond) // Simulate work
	status := "pending"
	if todo.Completed {
		status = "completed"
	}
	ch <- fmt.Sprintf("Processed: %s [%s]", todo.Text, status)
}

func main() {
	// Create todo list
	todoList := NewTodoList()

	// Add todos
	todoList.Add("Learn Go")
	todoList.Add("Understand goroutines")
	todoList.Add("Build a web service")

	// Display all todos
	fmt.Println("All Todos:")
	for _, todo := range todoList.GetAll() {
		status := "○"
		if todo.Completed {
			status = "✓"
		}
		fmt.Printf("  [%s] %s\n", status, todo.Text)
	}

	// Toggle first todo
	if len(todoList.todos) > 0 {
		todoList.Toggle(1)
	}

	// Demonstrate goroutines and channels
	todos := todoList.GetAll()
	ch := make(chan string, len(todos))

	// Process each todo concurrently
	for _, todo := range todos {
		go processTodo(todo, ch)
	}

	// Collect results from channel
	fmt.Println("\nAsync Processing Results:")
	for i := 0; i < len(todos); i++ {
		result := <-ch
		fmt.Println("  " + result)
	}
	close(ch)

	// Stats
	completed := todoList.GetCompleted()
	all := todoList.GetAll()
	fmt.Printf("\nStats:\n")
	fmt.Printf("  Total: %d\n", len(all))
	fmt.Printf("  Completed: %d\n", len(completed))
	fmt.Printf("  Pending: %d\n", len(all)-len(completed))
}
