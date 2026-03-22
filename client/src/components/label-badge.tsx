import type { Label } from "@/types/todo";
import "./LabelBadge.css";

interface LabelBadgeProps {
  label: Label;
  onRemove?: () => void;
}

export function LabelBadge({ label, onRemove }: LabelBadgeProps) {
  return (
    <span className="label-badge" style={{ backgroundColor: label.color }}>
      {label.name}
      {onRemove && (
        <button
          type="button"
          className="label-badge-remove"
          onClick={onRemove}
          aria-label={`Remove label ${label.name}`}
        >
          ✕
        </button>
      )}
    </span>
  );
}
