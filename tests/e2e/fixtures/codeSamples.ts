/**
 * Code samples for testing in multiple languages
 */

export const CODE_SAMPLES = {
  javascript: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

const cart = [
  { name: 'Apple', price: 1.5, quantity: 3 },
  { name: 'Banana', price: 0.8, quantity: 5 },
];

console.log(calculateTotal(cart));`,

  typescript: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

class UserManager {
  private users: Map<string, User> = new Map();

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllAdmins(): User[] {
    return Array.from(this.users.values())
      .filter(user => user.role === 'admin');
  }
}`,

  python: `def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

class Calculator:
    def __init__(self):
        self.history = []

    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result`,

  react: `import React, { useState, useEffect } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  const addTodo = () => {
    if (input.trim()) {
      const newTodos = [...todos, { id: Date.now(), text: input }];
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
      setInput('');
    }
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </div>
  );
}`,

  sql: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;`,

  vulnerable_sql: `function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}`,

  long_code: `class DataProcessor {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
    this.stats = { processed: 0, errors: 0 };
  }

  async process(data) {
    try {
      const validated = await this.validate(data);
      const transformed = this.transform(validated);
      const enriched = await this.enrich(transformed);
      const result = this.finalize(enriched);
      this.stats.processed++;
      return result;
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  validate(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }
    return data;
  }

  transform(data) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key.toLowerCase()] = data[key];
      return acc;
    }, {});
  }

  async enrich(data) {
    const cached = this.cache.get(data.id);
    if (cached) return { ...data, ...cached };

    const additional = await this.fetchAdditionalData(data.id);
    this.cache.set(data.id, additional);
    return { ...data, ...additional };
  }

  async fetchAdditionalData(id) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ enriched: true }), 100);
    });
  }

  finalize(data) {
    return {
      ...data,
      processedAt: new Date(),
      version: this.config.version
    };
  }

  getStats() {
    return { ...this.stats };
  }
}`,

  empty: '',
};

export const CODE_SNIPPETS = {
  short: 'const greeting = "Hello, World!";',
  medium: `function greet(name) {
  return \`Hello, \${name}!\`;
}`,
  nested: `function outerFunction() {
  function innerFunction() {
    return "nested";
  }
  return innerFunction();
}`,
};
