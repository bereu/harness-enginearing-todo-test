import { useState } from "react";
import type { CreateTodoPayload } from "@/types/todo";
import "./TodoForm.css";

interface TodoFormProps {
  onSubmit: (payload: CreateTodoPayload) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function TodoForm({ onSubmit, isLoading = false, error }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
    } catch {
      // Error is handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>Add a New Todo</h2>

      {(validationError || error) && (
        <div className="error-message">{validationError || error}</div>
      )}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          maxLength={255}
          disabled={isLoading}
          className="form-input"
        />
        <small className="char-count">{title.length}/255</small>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter optional description"
          disabled={isLoading}
          className="form-textarea"
          rows={4}
        />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Creating..." : "Add Todo"}
      </button>
    </form>
  );
}
