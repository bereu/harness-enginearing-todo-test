# Button Component

Buttons allow users to take actions, and make choices, with a single tap.

## Anatomy

1. **Label:** Text that describes the action.
2. **Container:** The background of the button.
3. **Icon (Optional):** Visual cue for the action.

## Variants

### Primary

Used for the most important action on a screen.

- **Tokens:** `brand.primary` background, `neutral.50` text.
- **State:** Hover increases darkness (`brand.primary-dark`).

### Secondary / Outline

Used for secondary actions.

- **Tokens:** `transparent` background, `brand.primary` border (1px), `brand.primary` text.

### Ghost

Used for subtle actions or inside other components like toolbars.

- **Tokens:** `transparent` background, `brand.primary` text.

### Danger

Used for destructive actions like deleting.

- **Tokens:** `semantic.error` background, `neutral.50` text.

## Usage Guidelines

- Button labels should be actionable (e.g., "Create Task" instead of "Submit").
- Use only one primary button per view or modal.
- Disabled state should be used when an action is not available.

## Code Example (HTML)

```html
<!-- Primary Button -->
<button class="btn btn-primary">Create Task</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Cancel</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">Add Item</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>

<!-- Disabled Button -->
<button class="btn btn-primary" disabled>Saving...</button>
```
