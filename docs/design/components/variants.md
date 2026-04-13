# Component Design System

This document defines the structure, naming, variations, and mapping of UI components.

## Component Responsibilities & Naming

This section defines how UI components are structured and named.

### Naming Rules

- **Files:** kebab-case (e.g., `kanban-card.tsx`).
- **Components:** PascalCase (e.g., `KanbanCard`).
- **Styles:** Matching PascalCase CSS files (e.g., `KanbanCard.css`).

### Component Categories

- **Atoms:** Simple elements (Button, LabelBadge, LabelPicker).
- **Molecules:** Functional groups (AddStatusInline, TodoForm).
- **Organisms:** Large UI blocks (KanbanBoard, KanbanColumn).
- **Templates:** Layout structures for pages.

## Variant Matrix

Mapping design variations to React props.

### Buttons

| Variant   | Prop                  | Styling                        |
| :-------- | :-------------------- | :----------------------------- |
| Primary   | `variant="primary"`   | Blue background, white text.   |
| Secondary | `variant="secondary"` | White background, blue border. |
| Ghost     | `variant="ghost"`     | No background or border.       |

### Kanban Cards

| State    | Prop                | Visual Indicator                 |
| :------- | :------------------ | :------------------------------- |
| Default  | `status="default"`  | White background.                |
| Dragging | `isDragging={true}` | Elevated shadow, subtle opacity. |
| Selected | `isSelected={true}` | Accent border.                   |

## Penpot to React Mapping

This section maintains the synchronization between design assets and code.

### Penpot Component Tree

| Design Component | React Component | Path                                      |
| :--------------- | :-------------- | :---------------------------------------- |
| Card/Todo        | `KanbanCard`    | `client/src/components/kanban-card.tsx`   |
| List/Column      | `KanbanColumn`  | `client/src/components/kanban-column.tsx` |
| Form/Todo        | `TodoForm`      | `client/src/components/todo-form.tsx`     |

### Asset Links

- **Design Source:** [Link to Penpot Project]
- **Icon Set:** `public/icons.svg`
