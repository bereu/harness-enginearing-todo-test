import { useEffect } from "react";
import type { CreateTodoPayload } from "@/types/todo";
import { TodoForm } from "@/components/todo-form";
import "./add-todo-modal.css";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTodoPayload) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function AddTodoModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error,
}: AddTodoModalProps) {
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

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleFormSubmit = async (payload: CreateTodoPayload) => {
    await onSubmit(payload);
    onClose();
  };

  return (
    <div
      className="add-todo-modal-backdrop"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="add-todo-modal-container">
        <div className="add-todo-modal-header">
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
        <div className="add-todo-modal-content">
          <TodoForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}
