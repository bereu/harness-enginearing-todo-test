# Modal Component

Modals are overlays that require users to interact with the application before they can return to their previous workflow.

## Anatomy

1. **Overlay (Backdrop):** Semi-transparent layer that dims the background.
2. **Container:** The box that holds the modal's content.
3. **Header:** Contains the modal title and a close button.
4. **Body:** The primary content area (e.g., a form or confirmation message).
5. **Footer:** Contains action buttons (e.g., "Cancel" and "Save").

## Variants

### Standard

Used for complex tasks like creating or editing a task.

- **Header:** Clear title (e.g., "Edit Task").
- **Footer:** Secondary action ("Cancel") and Primary action ("Save").

### Confirmation / Danger

Used to confirm critical or destructive actions.

- **Header:** Warning title (e.g., "Delete Task?").
- **Footer:** Secondary action ("Cancel") and Danger action ("Delete").

## Usage Guidelines

- Use modals sparingly to avoid breaking the user's flow.
- Ensure the focus is trapped within the modal when it is open.
- Allow users to close the modal by clicking the overlay, pressing the `Esc` key, or clicking the close button.
- Always provide a clear, descriptive title in the header.

## Code Example (HTML)

```html
<!-- Modal Overlay -->
<div class="modal-overlay">
  <!-- Modal Container -->
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-header">
      <h2 id="modal-title">Edit Task</h2>
      <button class="modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <!-- Form or content goes here -->
      <div class="form-field">
        <label class="label" for="edit-name">Task Name</label>
        <input class="input" type="text" id="edit-name" value="Setup design system" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Save Changes</button>
    </div>
  </div>
</div>
```
