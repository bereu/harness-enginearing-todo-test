# Token Implementation Contract

The "Source of Truth" for design tokens is the `tokens.json` file. All CSS implementations must align with these values.

## Implementation Rules

1. **CSS Variables:** All tokens are exposed as CSS variables in `client/src/index.css`.
2. **Naming Convention:** Use kebab-case (e.g., `--color-text-primary`).
3. **Overriding:** Avoid hardcoding hex values; always reference the CSS variable.
4. **Validation:** Automated scripts should ideally verify that the CSS variables match the `tokens.json` values.
