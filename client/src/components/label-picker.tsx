import { useState } from "react";
import type { Label } from "@/types/todo";
import { PRESET_COLORS } from "@/constants/label-colors";
import "./LabelPicker.css";

interface LabelPickerProps {
  allLabels: Label[];
  assignedLabelIds: string[];
  onToggle: (labelId: string) => void;
  onCreateLabel: (name: string, color: string) => Promise<void>;
}

export function LabelPicker({
  allLabels,
  assignedLabelIds,
  onToggle,
  onCreateLabel,
}: LabelPickerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!newName.trim()) return;
    setIsSubmitting(true);
    setCreateError(null);
    try {
      await onCreateLabel(newName.trim(), selectedColor);
      setNewName("");
      setSelectedColor(PRESET_COLORS[0]);
      setIsAddingNew(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create label");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewName("");
    setSelectedColor(PRESET_COLORS[0]);
    setIsAddingNew(false);
  };

  return (
    <div className="label-picker">
      <div className="label-picker-list">
        {allLabels.length === 0 && !isAddingNew && (
          <span className="label-picker-empty">No labels yet</span>
        )}
        {allLabels.map((label) => (
          <label key={label.id} className="label-picker-item" htmlFor={`label-check-${label.id}`}>
            <input
              id={`label-check-${label.id}`}
              name={`label-check-${label.id}`}
              type="checkbox"
              checked={assignedLabelIds.includes(label.id)}
              onChange={() => onToggle(label.id)}
            />
            <span className="label-picker-dot" style={{ backgroundColor: label.color }} />
            {label.name}
          </label>
        ))}
      </div>

      {!isAddingNew && (
        <button type="button" className="add-label-button" onClick={() => setIsAddingNew(true)}>
          + New label
        </button>
      )}

      {isAddingNew && (
        <div className="new-label-form">
          <input
            type="text"
            className="new-label-name-input"
            placeholder="Label name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={100}
            autoFocus
          />
          <div className="color-swatches">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-swatch${selectedColor === color ? " selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
              />
            ))}
          </div>
          {createError && <div className="label-create-error">{createError}</div>}
          <div className="new-label-actions">
            <button
              type="button"
              className="confirm-label-button"
              disabled={!newName.trim() || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? "Creating..." : "Confirm"}
            </button>
            <button type="button" className="cancel-label-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
