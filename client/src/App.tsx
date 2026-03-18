import { useState, useEffect } from "react";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { KanbanBoard } from "@/components/KanbanBoard";
import { todoService } from "@/services/todoService";
import type { Todo, CreateTodoPayload, TodoStatus } from "@/types/todo";
import "./App.css";

type ViewMode = "list" | "kanban";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    void loadTodos();
  }, []);

  const loadTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async (payload: CreateTodoPayload) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const newTodo = await todoService.createTodo(payload);
      setTodos([...todos, newTodo]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create todo");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (todoId: string, newStatus: TodoStatus) => {
    try {
      const updatedTodo = await todoService.updateTodo(todoId, { status: newStatus });
      setTodos(todos.map((todo) => (todo.id === todoId ? updatedTodo : todo)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo status");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Todo App</h1>
        <p>Stay organized with your todos</p>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>
          <button
            className={`toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
            onClick={() => setViewMode("kanban")}
          >
            Kanban View
          </button>
        </div>
      </header>

      <main className="app-main">
        <TodoForm
          onSubmit={handleCreateTodo}
          isLoading={isSubmitting}
          error={formError || undefined}
        />
        {viewMode === "list" ? (
          <TodoList todos={todos} isLoading={isLoading} error={error || undefined} />
        ) : (
          <KanbanBoard
            todos={todos}
            isLoading={isLoading}
            error={error || undefined}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
