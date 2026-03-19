---
id: FE-001
title: Error-handling-with-Rollbar
domain: frontend
rules: true
---

# Error-handling-with-Rollbar

## Context

We need to establish a consistent pattern for error handling across the frontend application and define a structured way to report these errors to our monitoring service, Rollbar. In the frontend context, we primarily encounter the following types of errors:

1. **Business Logic / Application Errors**: These are errors related to the valid application workflow. For example: A user attempting to submit an invalid form, or failing to fetch data due to authorization issues.
2. **System Errors**: Unexpected technical failures such as unhandled exceptions in the UI components, network failures, or unhandled promise rejections.

Both types of errors need to be tracked and handled appropriately to ensure a seamless and robust user experience.

## Decision

1. We must consistently manage error handling across the frontend application, categorizing errors into **Business Logic / Application Errors** and **System Errors**.
2. Handled critical errors and unexpected system errors must be sent to Rollbar for tracking and monitoring.
3. Every Rollbar error report must include relevant **properties** (e.g., user context, component name, route, action attempted) that provide sufficient debugging information without compromising data privacy.
4. Unhandled exceptions in the UI must be caught by global configurations or React Error Boundaries, providing gracefully degraded UI states while sending reports to Rollbar.

## Do's and Don'ts

### Do

- Do attach relevant contextual properties when logging errors to Rollbar (e.g., application state, route, user IDs, or specific user actions).
- Do distinguish between expected frontend business logic errors (like validation failures) and unexpected system behaviors.
- Do implement global and component-level Error Boundaries to prevent the entire frontend application from crashing.

### Don't

- Don't send sensitive user information (PII, passwords, auth tokens, financial data) in the properties sent to Rollbar.
- Don't swallow unexpected system errors in `try/catch` blocks without logging them to Rollbar.
- Don't let a failing component bring down the entire application; always isolate features using Error Boundaries.

## Consequences

### Positive

- Faster debugging and issue resolution due to detailed, property-rich error logs available in Rollbar.
- A clear separation between expected UI validations and unexpected crashes.
- Increased reliability of the frontend and better visibility into the real-world user experience and browser-specific bugs.

### Negative

- Slightly more boilerplate code required for implementing comprehensive error boundaries and detailed logging.
- Increased reliance on the external Rollbar service for frontend monitoring.

### Risks

- Accidental leakage of sensitive user data if error properties or Redux/React states are not correctly sanitized before transmission.
- Potential to overwhelm Rollbar quotas if non-critical validation errors are logged excessively.

## Compliance and Enforcement

- Code reviews will rigorously check that appropriate context and sanitized properties are passed when logging to Rollbar.
- Setup of a global mechanism (e.g., standard Error Handling Utilities) will be provided to make logging rich business and system errors a straightforward process.
- Usage of Error Boundaries around major application views and features is mandatory.

## References

- [Rollbar Browser/Client JavaScript Documentation](https://docs.rollbar.com/docs/browser-js)
