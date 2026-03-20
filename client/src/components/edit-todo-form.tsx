import { useState } from "react";
import { z } from "zod";
import type { Todo } from "@/types/todo";
import { UpdateTodoSchema } from "@/schemas/todo.schema";
import { useStatuses } from "@/hooks/use-statuses";
import { AddStatusInline } from "@/components/add-status-inline";
import "./EditTodoForm.css";

interface EditTodoFormProps {
  todo: Todo;
  onSubmit: (
    id: string,
    payload: { title?: string; description?: string | null; status?: string },
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  status?: string;
}

export function EditTodoForm({
  todo,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: EditTodoFormProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [status, setStatus] = useState(todo.status);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [isAddingStatus, setIsAddingStatus] = useState(false);

  const { statuses, createStatus } = useStatuses();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      const validated = UpdateTodoSchema.parse({
        title: title !== todo.title ? title : undefined,
        description: description !== (todo.description || "") ? description || null : undefined,
        status: status !== todo.status ? status : undefined,
      });

      await onSubmit(todo.id, {
        title: validated.title,
        description: validated.description,
        status: validated.status,
      });
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
    <form onSubmit={handleSubmit} className="edit-todo-form" noValidate>
      <h2>Edit Todo</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="edit-title">Title *</label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          maxLength={255}
          disabled={isLoading}
          className={`form-input ${validationErrors.title ? "input-error" : ""}`}
          aria-invalid={!!validationErrors.title}
          aria-describedby={validationErrors.title ? "edit-title-error" : undefined}
        />
        <small className="char-count">{title.length}/255</small>
        {validationErrors.title && (
          <div id="edit-title-error" className="field-error">
            {validationErrors.title}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="edit-description">Description</label>
        <textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter optional description"
          disabled={isLoading}
          className={`form-textarea ${validationErrors.description ? "input-error" : ""}`}
          rows={4}
          aria-invalid={!!validationErrors.description}
          aria-describedby={validationErrors.description ? "edit-description-error" : undefined}
        />
        {validationErrors.description && (
          <div id="edit-description-error" className="field-error">
            {validationErrors.description}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="edit-status">Status</label>
        <select
          id="edit-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading || isAddingStatus}
          className={`form-select ${validationErrors.status ? "input-error" : ""}`}
          aria-invalid={!!validationErrors.status}
          aria-describedby={validationErrors.status ? "edit-status-error" : undefined}
        >
          {statuses.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
        {validationErrors.status && (
          <div id="edit-status-error" className="field-error">
            {validationErrors.status}
          </div>
        )}

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

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading} className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  );
}
