import { useState } from "react";
import { z } from "zod";
import type { CreateTodoPayload } from "@/types/todo";
import { CreateTodoSchema } from "@/schemas/todo.schema";
import { useStatuses } from "@/hooks/use-statuses";
import { AddStatusInline } from "@/components/add-status-inline";
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
  const [status, setStatus] = useState("todo");
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [isAddingStatus, setIsAddingStatus] = useState(false);

  const { statuses, createStatus } = useStatuses();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      const validated = CreateTodoSchema.parse({
        title,
        description: description || undefined,
        status,
      });

      await onSubmit({
        title: validated.title,
        description: validated.description || undefined,
        status: validated.status,
      });
      setTitle("");
      setDescription("");
      setStatus("todo");
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

  const handleNewStatusConfirm = async (label: string) => {
    const created = await createStatus(label);
    setStatus(created.slug);
    setIsAddingStatus(false);
    return created;
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" noValidate>
      <h2>Add a New Todo</h2>

      {error && <div className="error-message">{error}</div>}

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
          <div id="title-error" className="field-error">
            {validationErrors.title}
          </div>
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
          <div id="description-error" className="field-error">
            {validationErrors.description}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading || isAddingStatus}
          className="form-select"
        >
          {statuses.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>

        {!isAddingStatus && (
          <button
            type="button"
            className="add-status-button"
            onClick={() => setIsAddingStatus(true)}
            disabled={isLoading}
          >
            + Add new status
          </button>
        )}

        {isAddingStatus && (
          <AddStatusInline
            onConfirm={handleNewStatusConfirm}
            onCancel={() => setIsAddingStatus(false)}
          />
        )}
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Creating..." : "Add Todo"}
      </button>
    </form>
  );
}
