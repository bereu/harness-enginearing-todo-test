---
name: code-review
description: Use this skill to audit code changes for compliance with project standards, strict typing, architecture rules, and security best practices.
version: 1.0.0
---

## Overview

This skill provides a systematic way to review code changes. It ensures that all contributions adhere to the strict rules defined in `AGENTS.md`, follow the NestJS + CQRS architectural patterns, and maintain high security and performance standards.

## Linear Integration

Before starting a review, ensure the Linear ticket status is updated:

1.  **Update Status**: `linear-cli issues update ISSUE_ID --state "In Review"`
2.  **Post Review**: Once the review is complete, add the summary as a comment to the ticket using `linear-cli issues comment ISSUE_ID --body "REVIEW_SUMMARY"`.

## Review Checklist

### 1. Type Safety (Strict)

- **No `any`**: Ensure `any` is not used. Use `unknown` + type guards or precise interfaces. (Enforced by `noExplicitAny`)
- **No `!` (Non-null assertions)**: Check for explicit null/undefined handling. (Enforced by `noNonNullAssertion`)
- **Discriminated Unions**: Verify use of discriminated unions for state and error handling.
- **Strict Imports**: Ensure `@/` path aliases are used for all project-internal imports. No `../` parent relative imports. (Enforced by `noParentIndexImport` and project conventions)

### 2. NestJS & Architecture

- **Dependency Injection**: Ensure services are injected via constructors and not manually instantiated or accessed via globals.
- **Modularization**: Check that logic is placed in the correct Module, Controller, or Service.
- **CQRS Compliance**:
  - **Record Layer**: Only handles write/state-modifying operations.
  - **Read Layer**: Only handles query/data-retrieval operations.
- **Named Exports**: Ensure no default exports are used.

### 4. Testing

- **Meaningful Assertions**: Avoid shallow tests; ensure tests verify actual behavior and side effects. especially bussiness logic(ex: CQRS part)

### 5. error handling

- **Error Handling**: Ensure error handling is implemented correctly. especially when using external API or subprocess.
- **Error tracing**: Are we using Rollbar to trace errors?

## Review Output Format

Reviews should produce a categorized report:

- 🔴 **Must Fix**: Critical violations (e.g., use of `any`, shell interpolation, broken DI).
- 🟡 **Improvement**: Suggested optimizations or readability enhancements.
- 🔵 **Nitpick**: Minor stylistic comments.
- ✅ **LGTM**: Section is approved.
