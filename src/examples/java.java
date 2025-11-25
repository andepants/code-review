/**
 * Java Basics Example
 *
 * This demonstrates:
 * - Classes and object-oriented programming
 * - Generics and collections
 * - Streams and functional programming
 * - Exception handling
 * - Modern Java features
 */

import java.util.*;
import java.util.stream.*;

public class TodoExample {

    // Generic class representing a todo item
    static class Todo {
        private final int id;
        private String text;
        private boolean completed;

        public Todo(int id, String text) {
            this.id = id;
            this.text = text;
            this.completed = false;
        }

        public int getId() { return id; }
        public String getText() { return text; }
        public boolean isCompleted() { return completed; }

        public void toggle() {
            this.completed = !this.completed;
        }

        @Override
        public String toString() {
            String status = completed ? "✓" : "○";
            return String.format("[%s] %s", status, text);
        }
    }

    public static void main(String[] args) {
        // Create a list of todos
        List<Todo> todos = new ArrayList<>();
        todos.add(new Todo(1, "Learn Java"));
        todos.add(new Todo(2, "Understand generics"));
        todos.add(new Todo(3, "Master streams"));

        // Display all todos
        System.out.println("All Todos:");
        todos.forEach(System.out::println);

        // Toggle first todo
        if (!todos.isEmpty()) {
            todos.get(0).toggle();
        }

        // Filter completed todos using streams
        List<Todo> completed = todos.stream()
            .filter(Todo::isCompleted)
            .collect(Collectors.toList());

        System.out.println("\nCompleted: " + completed.size());

        // Filter pending todos
        long pending = todos.stream()
            .filter(todo -> !todo.isCompleted())
            .count();

        System.out.println("Pending: " + pending);

        // Map example: Get all todo texts
        List<String> texts = todos.stream()
            .map(Todo::getText)
            .collect(Collectors.toList());

        System.out.println("\nTodo texts:");
        texts.forEach(text -> System.out.println("  - " + text));

        // Using Optional for safe access
        Optional<Todo> firstCompleted = todos.stream()
            .filter(Todo::isCompleted)
            .findFirst();

        firstCompleted.ifPresent(todo ->
            System.out.println("\nFirst completed: " + todo.getText())
        );

        // Exception handling example
        try {
            Todo todo = todos.get(10); // Out of bounds
        } catch (IndexOutOfBoundsException e) {
            System.out.println("\nError: Index out of bounds");
        }

        // Using try-with-resources (resource management)
        try (Scanner scanner = new Scanner(System.in)) {
            // Scanner will be automatically closed
            System.out.println("\nEnter a todo (or press Ctrl+D to skip):");
            if (scanner.hasNextLine()) {
                String newTodo = scanner.nextLine();
                todos.add(new Todo(todos.size() + 1, newTodo));
            }
        }

        // Final stats
        System.out.println("\nFinal Stats:");
        System.out.println("Total: " + todos.size());
        System.out.println("Completed: " + completed.size());
        System.out.println("Pending: " + pending);
    }
}
