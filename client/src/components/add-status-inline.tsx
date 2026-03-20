import { useState } from "react";
import type { StatusOption } from "@/services/status-service";
import type { ApiError } from "@/services/http-client";

interface AddStatusInlineProps {
  onConfirm: (label: string) => Promise<StatusOption>;
  onCancel: () => void;
}

export function AddStatusInline({ onConfirm, onCancel }: AddStatusInlineProps) {
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleConfirm = async () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Status name is required");
      return;
    }
    if (trimmed.length > 50) {
      setError("Status name must be no longer than 50 characters");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await onConfirm(trimmed);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message || "Failed to create status");
      setIsCreating(false);
    }
  };

  return (
    <div className="add-status-inline">
      <input
        type="text"
        className="form-input add-status-input"
        placeholder="New status name (e.g. In Review)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        maxLength={50}
        disabled={isCreating}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            void handleConfirm();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        aria-label="New status name"
        autoFocus
      />
      <div className="add-status-actions">
        <button
          type="button"
          className="confirm-status-button"
          onClick={() => void handleConfirm()}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Confirm"}
        </button>
        <button
          type="button"
          className="cancel-status-button"
          onClick={onCancel}
          disabled={isCreating}
        >
          Cancel
        </button>
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
