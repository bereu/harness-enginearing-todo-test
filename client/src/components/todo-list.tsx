import type { Todo } from "@/types/todo";
import { TodoItem } from "@/components/todo-item";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  isLoading?: boolean;
  error?: string;
}

export function TodoList({ todos, isLoading = false, error }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="todo-list-container">
        <div className="loading-message">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-list-container">
        <div className="error-message">Failed to load todos: {error}</div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list-container">
        <div className="empty-state">
          <p>No todos yet. Create one to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <h2>Your Todos ({todos.length})</h2>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoItem todo={todo} />
          </li>
        ))}
      </ul>
    </div>
  );
}
