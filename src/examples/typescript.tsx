import { useState } from 'react';

/**
 * TypeScript Todo App Example
 *
 * This demonstrates:
 * - TypeScript type annotations and interfaces
 * - useState with generic types
 * - Type-safe event handlers
 * - Proper typing for component props and state
 */

// Define types for our data
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn TypeScript', completed: false },
    { id: 2, text: 'Build type-safe apps', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  const [inputValue, setInputValue] = useState<string>('');

  const addTodo = (): void => {
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TypeScript Todo List</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addButton}>
          Add
        </button>
      </div>

      <ul style={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id} style={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={styles.checkbox}
            />
            <span
              style={{
                ...styles.todoText,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#999' : '#333',
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div style={styles.stats}>
        <p>Total: {todos.length}</p>
        <p>Completed: {todos.filter(t => t.completed).length}</p>
        <p>Pending: {todos.filter(t => !t.completed).length}</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  todoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: 'white',
    marginBottom: '8px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  todoText: {
    flex: 1,
    fontSize: '16px',
  },
  deleteButton: {
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  stats: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '14px',
    color: '#666',
  },
};

export default TodoApp;
