import { useEffect } from "react";
import type { Todo, TodoStatus } from "@/types/todo";
import { EditTodoForm } from "./edit-todo-form";
import "./EditTodoModal.css";

interface EditTodoModalProps {
  isOpen: boolean;
  todo: Todo | null;
  onClose: () => void;
  onSave: (
    id: string,
    payload: { title?: string; description?: string | null; status?: TodoStatus },
  ) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function EditTodoModal({
  isOpen,
  todo,
  onClose,
  onSave,
  isLoading = false,
  error,
}: EditTodoModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  // Trap focus in modal when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !todo) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleFormSubmit = async (
    id: string,
    payload: { title?: string; description?: string | null; status?: TodoStatus },
  ) => {
    await onSave(id, payload);
    onClose();
  };

  return (
    <div
      className="edit-todo-modal-backdrop"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="edit-todo-modal-container">
        <div className="edit-todo-modal-header">
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="edit-todo-modal-content">
          <EditTodoForm
            todo={todo}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
