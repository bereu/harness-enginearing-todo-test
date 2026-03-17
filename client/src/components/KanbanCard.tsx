import type { Todo } from '@/types/todo';
import './KanbanCard.css';

interface KanbanCardProps {
  todo: Todo;
  onDragStart: (todoId: string) => void;
  onDragEnd?: () => void;
}

export function KanbanCard({ todo, onDragStart, onDragEnd }: KanbanCardProps) {
  const createdDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', todo.id);
        onDragStart(todo.id);
      }}
      onDragEnd={onDragEnd}
    >
      <div className="kanban-card-header">
        <h4 className="kanban-card-title">{todo.title}</h4>
        {todo.completed && <span className="completed-badge">✓</span>}
      </div>
      {todo.description && (
        <p className="kanban-card-description">{todo.description}</p>
      )}
      <small className="kanban-card-date">{createdDate}</small>
    </div>
  );
}
