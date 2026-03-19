import type { Todo, TodoStatus } from "@/types/todo";
import { STATUS_LABELS } from "@/constants/todo-statuses";
import { KanbanCard } from "./kanban-card";
import "./KanbanColumn.css";

interface KanbanColumnProps {
  status: TodoStatus;
  todos: Todo[];
  onDrop: (todoId: string, newStatus: TodoStatus) => void;
  draggedTodoId: string | null;
  onDragStart: (todoId: string) => void;
  onDragEnd?: () => void;
}

export function KanbanColumn({
  status,
  todos,
  onDrop,
  draggedTodoId,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    if (draggedTodoId) {
      onDrop(draggedTodoId, status);
    }
  };

  const statusLabel = STATUS_LABELS[status];
  const columnTodos = todos.filter((todo) => todo.status === status);

  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <h3>{statusLabel}</h3>
        <span className="todo-count">{columnTodos.length}</span>
      </div>
      <div className="kanban-column-content">
        {columnTodos.length === 0 ? (
          <div className="empty-column">
            <p>No todos yet</p>
          </div>
        ) : (
          columnTodos.map((todo) => (
            <KanbanCard key={todo.id} todo={todo} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          ))
        )}
      </div>
    </div>
  );
}
