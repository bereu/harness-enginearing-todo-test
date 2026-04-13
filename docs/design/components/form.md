# Form Components

Forms are used to collect user input.

## Anatomy

1. **Field Label:** Describes what information is needed.
2. **Input Area:** Where users enter data.
3. **Helper Text (Optional):** Provides additional context or instructions.
4. **Error Message (Optional):** Shown when validation fails.

## Elements

### Text Input

The standard field for short text.

- **Border:** `neutral.200`
- **Focus:** `brand.primary` border + `shadows.outline`
- **Radius:** `radius.md`

### Textarea

Used for longer descriptions.

- Same styling as text input but with a larger vertical height.

### Labels

- **Typography:** `font-xs`, `semibold`
- **Color:** `neutral-700`

### Validation States

- **Error:** `semantic.error` border and text.
- **Focus:** `brand.primary` focus ring.

## Usage Guidelines

- Group related fields together.
- Use helper text to prevent errors before they happen.
- Show errors inline, immediately after the field.

## Code Example (HTML)

```html
<!-- Standard Text Input -->
<div class="form-field">
  <label class="label" for="task-name">Task Name</label>
  <input class="input" type="text" id="task-name" placeholder="e.g. Clean the room" />
  <p class="helper-text">Enter a short, descriptive name.</p>
</div>

<!-- Textarea -->
<div class="form-field">
  <label class="label" for="task-desc">Description</label>
  <textarea class="input" id="task-desc" rows="3"></textarea>
</div>

<!-- Input with Error State -->
<div class="form-field error">
  <label class="label" for="task-date">Deadline</label>
  <input class="input" type="date" id="task-date" value="invalid-date" />
  <span class="error-message">Please enter a valid date.</span>
</div>
```
