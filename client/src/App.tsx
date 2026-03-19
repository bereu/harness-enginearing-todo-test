import { useState, useEffect } from "react";
import { TodoForm } from "@/components/todo-form";
import { TodoList } from "@/components/todo-list";
import { KanbanBoard } from "@/components/kanban-board";
import { EditTodoModal } from "@/components/edit-todo-modal";
import { todoService } from "@/services/todo-service";
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
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    setEditingTodo(null);
    setEditError(null);
  };

  const handleSaveTodo = async (
    id: string,
    payload: { title?: string; description?: string | null; status?: TodoStatus },
  ) => {
    setIsEditLoading(true);
    setEditError(null);
    try {
      const updatedTodo = await todoService.updateTodo(id, payload);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      handleCloseEditModal();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to save todo");
      throw err;
    } finally {
      setIsEditLoading(false);
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
          <TodoList
            todos={todos}
            isLoading={isLoading}
            error={error || undefined}
            onEdit={handleEditTodo}
          />
        ) : (
          <KanbanBoard
            todos={todos}
            isLoading={isLoading}
            error={error || undefined}
            onStatusChange={handleStatusChange}
          />
        )}
        <EditTodoModal
          isOpen={editingTodo !== null}
          todo={editingTodo}
          onClose={handleCloseEditModal}
          onSave={handleSaveTodo}
          isLoading={isEditLoading}
          error={editError || undefined}
        />
      </main>
    </div>
  );
}

export { App };
