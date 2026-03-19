import type { Todo } from "../types/todo";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/todo-statuses";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  onStatusChange?: (status: string) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const createdDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statusLabel = STATUS_LABELS[todo.status];
  const statusColor = STATUS_COLORS[todo.status];

  const handleClick = () => {
    if (onEdit) {
      onEdit(todo);
    }
  };

  return (
    <div
      className="todo-item"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      style={{ cursor: onEdit ? "pointer" : "default" }}
    >
      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && <p className="todo-description">{todo.description}</p>}
        <small className="todo-date">Created: {createdDate}</small>
      </div>
      <div className="todo-status">
        <span className={`status-badge ${statusColor}`}>{statusLabel}</span>
        <span className={`status-badge ${todo.completed ? "completed" : "pending"}`}>
          {todo.completed ? "✓ Completed" : "Pending"}
        </span>
      </div>
    </div>
  );
}
