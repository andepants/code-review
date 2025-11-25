// Rust Todo Example
//
// This demonstrates:
// - Ownership and borrowing
// - Structs and implementations
// - Pattern matching
// - Result type for error handling
// - Iterators and functional programming
// - Option type for nullable values

use std::fmt;

#[derive(Debug, Clone)]
struct Todo {
    id: u32,
    text: String,
    completed: bool,
}

impl Todo {
    // Constructor (associated function)
    fn new(id: u32, text: String) -> Self {
        Todo {
            id,
            text,
            completed: false,
        }
    }

    // Toggle completion status
    fn toggle(&mut self) {
        self.completed = !self.completed;
    }

    // Check if completed
    fn is_completed(&self) -> bool {
        self.completed
    }
}

// Implement Display trait for pretty printing
impl fmt::Display for Todo {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let status = if self.completed { "✓" } else { "○" };
        write!(f, "  [{}] {}", status, self.text)
    }
}

struct TodoList {
    todos: Vec<Todo>,
    next_id: u32,
}

impl TodoList {
    // Create new todo list
    fn new() -> Self {
        TodoList {
            todos: Vec::new(),
            next_id: 1,
        }
    }

    // Add a new todo (takes ownership of text)
    fn add(&mut self, text: String) -> &Todo {
        let todo = Todo::new(self.next_id, text);
        self.next_id += 1;
        self.todos.push(todo);
        self.todos.last().unwrap()
    }

    // Toggle todo by ID (returns Result for error handling)
    fn toggle(&mut self, id: u32) -> Result<(), String> {
        match self.todos.iter_mut().find(|t| t.id == id) {
            Some(todo) => {
                todo.toggle();
                Ok(())
            }
            None => Err(format!("Todo with id {} not found", id)),
        }
    }

    // Remove todo by ID
    fn remove(&mut self, id: u32) -> Result<Todo, String> {
        match self.todos.iter().position(|t| t.id == id) {
            Some(index) => Ok(self.todos.remove(index)),
            None => Err(format!("Todo with id {} not found", id)),
        }
    }

    // Get all todos (returns a reference, no ownership transfer)
    fn get_all(&self) -> &[Todo] {
        &self.todos
    }

    // Get completed todos (uses iterator and filter)
    fn get_completed(&self) -> Vec<&Todo> {
        self.todos
            .iter()
            .filter(|todo| todo.is_completed())
            .collect()
    }

    // Get pending todos
    fn get_pending(&self) -> Vec<&Todo> {
        self.todos
            .iter()
            .filter(|todo| !todo.is_completed())
            .collect()
    }

    // Display all todos
    fn display_all(&self) {
        println!("All Todos:");
        for todo in &self.todos {
            println!("{}", todo);
        }
    }
}

fn main() {
    // Create a mutable todo list
    let mut todo_list = TodoList::new();

    // Add todos (String::from creates owned strings)
    todo_list.add(String::from("Learn Rust"));
    todo_list.add(String::from("Understand ownership"));
    todo_list.add(String::from("Master pattern matching"));

    // Display all
    todo_list.display_all();

    // Toggle first todo with error handling
    match todo_list.toggle(1) {
        Ok(()) => println!("\nToggled todo 1"),
        Err(e) => eprintln!("Error: {}", e),
    }

    // Calculate stats using functional approach
    let total = todo_list.get_all().len();
    let completed = todo_list.get_completed().len();
    let pending = todo_list.get_pending().len();

    println!("\nStats:");
    println!("  Total: {}", total);
    println!("  Completed: {}", completed);
    println!("  Pending: {}", pending);

    // Demonstrate Option type (safe null handling)
    let first_todo: Option<&Todo> = todo_list.get_all().first();
    match first_todo {
        Some(todo) => println!("\nFirst todo: {}", todo.text),
        None => println!("\nNo todos found"),
    }

    // Demonstrate iterator methods
    let todo_texts: Vec<&str> = todo_list
        .get_all()
        .iter()
        .map(|todo| todo.text.as_str())
        .collect();

    println!("\nTodo texts:");
    for text in todo_texts {
        println!("  - {}", text);
    }
}
