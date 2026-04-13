# Kanban Column Component

Columns represent the stages of a workflow (e.g., "To Do", "In Progress", "Done").

## Anatomy

1. **Header:** Contains the column title and a task count.
2. **Scroll Area:** A vertical list where Kanban cards are displayed.
3. **Footer Action:** Typically an "+ Add Task" button.

## Styling

- **Background:** `neutral.100` (or similar light gray) to distinguish from the board background.
- **Radius:** `radius.lg` or `radius.xl`.
- **Width:** Fixed width (e.g., `300px`) to ensure horizontal consistency.

## Usage Guidelines

- Columns should be scrollable independently if they contain many cards.
- Limit the number of columns to prevent excessive horizontal scrolling.
- The task count in the header helps users quickly assess workload at each stage.

## Code Example (HTML)

```html
<div class="kanban-column">
  <div class="column-header">
    <h3 class="column-title">To Do</h3>
    <span class="column-count">3</span>
  </div>
  <div class="column-content">
    <!-- Kanban Cards go here -->
  </div>
  <div class="column-footer">
    <button class="btn btn-ghost">+ Add Task</button>
  </div>
</div>
```
