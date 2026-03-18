import { useState } from "react";
import { z } from "zod";
import type { CreateTodoPayload } from "@/types/todo";
import { CreateTodoSchema } from "@/schemas/todo.schema";
import "./TodoForm.css";

interface TodoFormProps {
  onSubmit: (payload: CreateTodoPayload) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export function TodoForm({ onSubmit, isLoading = false, error }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      const validated = CreateTodoSchema.parse({
        title,
        description: description || undefined,
      });

      await onSubmit({
        title: validated.title,
        description: validated.description || undefined,
      });
      setTitle("");
      setDescription("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: FormErrors = {};
        err.errors.forEach((error) => {
          const field = error.path[0];
          if (field) {
            errors[field as keyof FormErrors] = error.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" noValidate>
      <h2>Add a New Todo</h2>

      {error && (
        <div className="error-message">{error}</div>
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
          className={`form-input ${validationErrors.title ? "input-error" : ""}`}
          aria-invalid={!!validationErrors.title}
          aria-describedby={validationErrors.title ? "title-error" : undefined}
        />
        <small className="char-count">{title.length}/255</small>
        {validationErrors.title && (
          <div id="title-error" className="field-error">{validationErrors.title}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter optional description"
          disabled={isLoading}
          className={`form-textarea ${validationErrors.description ? "input-error" : ""}`}
          rows={4}
          aria-invalid={!!validationErrors.description}
          aria-describedby={validationErrors.description ? "description-error" : undefined}
        />
        {validationErrors.description && (
          <div id="description-error" className="field-error">{validationErrors.description}</div>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Creating..." : "Add Todo"}
      </button>
    </form>
  );
}
