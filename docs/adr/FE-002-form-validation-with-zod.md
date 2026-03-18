---
id: FE-002
title: Form-validation-with-zod
domain: frontend
rules: true
---

# Form-validation-with-zod

## Context

Forms are a critical part of the user experience in our application. Different forms have distinct validation rules, and relying on default HTML form validation messages provides a poor and inconsistent user experience across different browsers. We need a robust, type-safe, and standardized method for validating form inputs and displaying clear, customized error messages to our users.

## Decision

1. We will use **Zod** as our single source of truth for schema declaration and validation in the frontend.
2. Zod will be integrated with our form management library (e.g., React Hook Form) to handle validation dynamically on the client side.
3. We must explicitly display custom validation error messages derived from Zod schemas within the UI, bypassing or disabling native HTML5 default validation messages.

## Do's and Don'ts

### Do

- Do define a clear Zod schema for every form in the application to ensure type safety and consistent validation.
- Do display validation error messages in the UI clearly to the user using the customized error messages specified in the Zod schemas.
- Do keep validation logic centralized within the schema definition rather than scattering it across component business logic.

### Don't

- Don't rely on or display default HTML5 validation messages (using `required`, `minlength`, etc., without custom UI validation).
- Don't hardcode validation logic directly within the React components if it can be abstracted into a Zod schema.

## Consequences

### Positive

- Strong compile-time type safety for forms and their expected data structures.
- Consistent user experience with fully customized and properly styled error messages instead of browser-dependent tooltips.
- Easily shareable validation rules that can potentially be reused across different parts of the application or even shared with the backend if integrated properly.

### Negative

- Adds an external dependency (Zod) to the frontend bundle.
- Slight learning curve for developers unfamiliar with Zod's schema syntax.

### Risks

- Schema duplication if backend and frontend models drift over time.
- Overcomplicating simple forms that might not strictly require heavy validation schemas, though consistency mitigates this risk.

## Compliance and Enforcement

- Code reviews will require that all new or modified forms use Zod for validation.
- Native HTML form validations (like `required`) should be accompanied by `novalidate` on the `<form>` tag, or gracefully overridden by our custom error UI.

## References

- [Zod Documentation](https://zod.dev/)
