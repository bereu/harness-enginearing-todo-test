import { useState } from "react";
import type { Todo, TodoStatus } from "@/types/todo";
import { TODO_STATUSES } from "@/constants/todo-statuses";
import { KanbanColumn } from "./KanbanColumn";
import "./KanbanBoard.css";

interface KanbanBoardProps {
  todos: Todo[];
  isLoading?: boolean;
  error?: string;
  onStatusChange: (todoId: string, newStatus: TodoStatus) => void;
}

export function KanbanBoard({ todos, isLoading = false, error, onStatusChange }: KanbanBoardProps) {
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);

  const handleDrop = (todoId: string, newStatus: TodoStatus) => {
    const todo = todos.find((t) => t.id === todoId);
    if (todo && todo.status !== newStatus) {
      onStatusChange(todoId, newStatus);
    }
    setDraggedTodoId(null);
  };

  const handleDragEnd = () => {
    setDraggedTodoId(null);
  };

  if (isLoading) {
    return (
      <div className="kanban-board">
        <div className="loading-message">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kanban-board">
        <div className="error-message">Failed to load todos: {error}</div>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      <h2>Kanban Board</h2>
      <div className="kanban-container">
        {TODO_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            todos={todos}
            onDrop={handleDrop}
            draggedTodoId={draggedTodoId}
            onDragStart={setDraggedTodoId}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
