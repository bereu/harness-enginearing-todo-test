# Toast Component

Toasts are brief, non-intrusive messages that provide feedback about an operation.

## Anatomy

1. **Icon:** Visual indicator of the message type (e.g., checkmark for success, exclamation for error).
2. **Message:** Concise text explaining the status.
3. **Container:** The background of the toast, often with a subtle shadow and border-left accent.
4. **Close Button (Optional):** Allows users to dismiss the toast manually.

## Variants

### Success

Used to confirm a successful action, such as creating or updating a task.

- **Tokens:** `semantic.success` for the icon and left border accent.
- **Behavior:** Usually disappears automatically after 3-5 seconds.

### Error

Used to notify the user of a failure or critical issue.

- **Tokens:** `semantic.error` for the icon and left border accent.
- **Behavior:** May require manual dismissal if the error is critical.

## Usage Guidelines

- Keep messages short and direct (under 10 words).
- Place toasts in a consistent location, typically the bottom-right or top-center of the screen.
- Do not use toasts for information that requires immediate user action; use a Modal instead.
- Ensure toasts are accessible to screen readers using `role="alert"`.

## Code Example (HTML)

```html
<div class="toast-container">
  <!-- Success Toast -->
  <div class="toast toast-success" role="alert">
    <span class="toast-icon">✓</span>
    <span class="toast-message">Task created successfully!</span>
  </div>

  <!-- Error Toast -->
  <div class="toast toast-error" role="alert">
    <span class="toast-icon">⚠</span>
    <span class="toast-message">Failed to connect to the server.</span>
  </div>
</div>
```
