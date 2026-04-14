# Kanban Card Component

Cards are the fundamental building blocks of the Kanban board, representing individual tasks.

## Anatomy

1. **Container:** White background with a subtle shadow and rounded corners.
2. **Header:** Contains the task title and an optional completion status badge.
3. **Description (Optional):** A brief summary of the task details.
4. **Footer:** Displays the creation date and provides space for contextual action buttons.
5. **Actions (On Hover):** Edit and Delete buttons that appear when the user hovers over the card.

## Variants

### Default

The standard state for a task.

- **Tokens:** `neutral.200` border, `radius.lg`, `spacing.3` padding.
- **State:** Border color changes on hover.

### Dragging / Active

Visual feedback when a user is moving a card or interacting with it.

- **Styling:** Reduced opacity (0.8) and changed cursor to `grabbing`.

### Completed Status

Indicates the task has been finished.

- **Visual Indicator:** A small green circle with a checkmark (✓) in the header.

## Usage Guidelines

- Card titles should be descriptive but concise.
- Actions (Edit/Delete) are hidden by default to keep the UI clean, becoming visible only on hover.
- Use the footer date to track task aging at a glance.

## Code Example (HTML)

```html
<div class="kanban-card">
  <div class="kanban-card-header">
    <h4 class="kanban-card-title">Setup design system</h4>
    <!-- Optional Completion Badge -->
    <span class="completed-badge">✓</span>
  </div>

  <p class="kanban-card-description">Create tokens and sample components for the team.</p>

  <div class="kanban-card-footer">
    <small class="kanban-card-date">Apr 15, 2024</small>

    <!-- Action buttons appear on hover -->
    <div class="kanban-card-actions">
      <button class="kanban-card-action-btn" title="Edit todo">✎</button>
      <button class="kanban-card-action-btn delete" title="Delete todo">🗑️</button>
    </div>
  </div>
</div>
```

## Styling Reference (CSS Classes)

- `.kanban-card`: The main container.
- `.kanban-card-title`: Bolded text for the task title.
- `.completed-badge`: Small green circular badge (`semantic.success`).
- `.kanban-card-actions`: Flex container for action icons, hidden by default (`opacity: 0`).
