# Language Examples

This folder contains example code for all supported programming languages in the AI Code Review Assistant.

## Overview

The examples are automatically loaded when you switch languages in the editor (if the editor is empty). Each example demonstrates key language features and best practices.

## Available Examples

### Web Languages (Todo Apps)

**JavaScript** (`javascript.jsx`)
- React functional component with hooks
- State management, event handling, CRUD operations
- Inline styling

**TypeScript** (`typescript.tsx`)
- Type-safe React component with interfaces
- Generic type parameters for useState
- Type annotations and compile-time safety

**Python** (`python.py`)
- Class-based todo application
- File I/O for persistence
- List comprehensions and Python idioms

**PHP** (`php.php`)
- Web-based todo with session handling
- Form processing with $_POST
- Array manipulation and HTML templating

**Ruby** (`ruby.rb`)
- Object-oriented Ruby application
- Blocks, procs, and enumerable
- Idiomatic Ruby patterns

### Systems Languages (Syntax Examples)

**Java** (`java.java`)
- Classes, generics, and collections
- Streams and functional programming
- Exception handling and try-with-resources

**Go** (`go.go`)
- Structs, interfaces, and methods
- Goroutines and channels (concurrency)
- Error handling patterns

**C++** (`cpp.cpp`)
- Modern C++ (C++11+) features
- Smart pointers and RAII
- STL containers and algorithms

**Rust** (`rust.rs`)
- Ownership and borrowing
- Pattern matching and Result types
- Traits and functional patterns

## How Examples Are Loaded

Examples are imported as raw strings using Vite's `?raw` suffix and stored in `languageExamples.ts`. When you switch to a new language in the editor:

1. The system checks if the editor is empty
2. If empty, it loads the corresponding example for that language
3. If the editor has content, it preserves your code

## Manual Usage

You can also import and use these examples directly in your code:

```typescript
import { getExampleForLanguage } from './examples/languageExamples';

const pythonExample = getExampleForLanguage('python');
console.log(pythonExample);
```
