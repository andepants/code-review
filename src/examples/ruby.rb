# Ruby Todo App Example
#
# This demonstrates:
# - Ruby classes and object-oriented programming
# - Blocks, procs, and symbols
# - Array methods and enumerable
# - Ruby idioms and conventions

require 'json'
require 'time'

class Todo
  attr_accessor :id, :text, :completed, :created_at

  def initialize(text, id: nil)
    @id = id || (Time.now.to_f * 1000).to_i
    @text = text
    @completed = false
    @created_at = Time.now
  end

  # Toggle completion status
  def toggle!
    @completed = !@completed
  end

  # Check if completed
  def completed?
    @completed
  end

  # Convert to hash for JSON serialization
  def to_hash
    {
      id: @id,
      text: @text,
      completed: @completed,
      created_at: @created_at.iso8601
    }
  end

  # Create from hash
  def self.from_hash(data)
    todo = new(data['text'], id: data['id'])
    todo.completed = data['completed']
    todo.created_at = Time.parse(data['created_at'])
    todo
  end
end

class TodoList
  attr_reader :todos

  def initialize(filename = 'todos.json')
    @filename = filename
    @todos = []
    load
  end

  # Add a new todo
  def add(text)
    todo = Todo.new(text)
    @todos << todo
    save
    todo
  end

  # Remove a todo by ID
  def remove(todo_id)
    initial_size = @todos.size
    @todos.reject! { |t| t.id == todo_id }
    save if @todos.size < initial_size
    @todos.size < initial_size
  end

  # Toggle a todo's completion status
  def toggle(todo_id)
    todo = @todos.find { |t| t.id == todo_id }
    if todo
      todo.toggle!
      save
      true
    else
      false
    end
  end

  # Get all todos
  def all
    @todos
  end

  # Get completed todos
  def completed
    @todos.select(&:completed?)
  end

  # Get pending todos
  def pending
    @todos.reject(&:completed?)
  end

  # Save todos to file
  def save
    File.open(@filename, 'w') do |file|
      data = @todos.map(&:to_hash)
      file.write(JSON.pretty_generate(data))
    end
  rescue IOError => e
    puts "Error saving todos: #{e.message}"
  end

  # Load todos from file
  def load
    return unless File.exist?(@filename)

    data = JSON.parse(File.read(@filename))
    @todos = data.map { |item| Todo.from_hash(item) }
  rescue IOError, JSON::ParserError => e
    puts "Error loading todos: #{e.message}"
    @todos = []
  end
end

# Example usage
if __FILE__ == $PROGRAM_NAME
  # Create todo list
  todo_list = TodoList.new

  # Add some todos
  todo_list.add('Learn Ruby')
  todo_list.add('Build a web app')
  todo_list.add('Deploy to production')

  # Display all todos
  puts "All Todos:"
  todo_list.all.each do |todo|
    status = todo.completed? ? '✓' : '○'
    puts "  [#{status}] #{todo.text}"
  end

  # Toggle first todo
  todo_list.toggle(todo_list.todos.first.id) unless todo_list.todos.empty?

  # Show stats
  puts "\nStats:"
  puts "  Total: #{todo_list.all.count}"
  puts "  Completed: #{todo_list.completed.count}"
  puts "  Pending: #{todo_list.pending.count}"
end
