---
name: qa-features
description: Use this skill to test implemented features. After finish code review. We must use this.
metadata:
  step: 5
---

## Overview

It focuses on translating high-level Acceptance Criteria (AC) into executable tests (using Vitest for unit/integration and Playwright for E2E) and identifying potential failure points that may have been overlooked during development.

## Core Steps

1.  **AC-to-Test Mapping**: Analyze the `docs/task/active` or specific task requirements to extract all Acceptance Criteria. For each AC, identify the corresponding test file and test case.
2.  **Edge Case Identification**: Systematically check for:
    - Boundary conditions (min/max values, empty strings, nulls).
    - Network failure scenarios (retry logic, timeouts).
    - Concurrent state mutations (multiple session workers).
    - Security constraints (path traversal, secret leakage).
    - Error handling (unexpected inputs, exception throwing, display messages).
3.  **Verification Run**: Execute the test suite and confirm all tests pass.
4.  **E2E testing**: Please verify if does the feature run correctly or not with `chrome dev tools MCP`.
5.  **run testing script**: Run `npm run test && npm run lint`

## Mandatory Rules

- **Environment Isolation**: Tests must never share state or interfere with a running production/dev environment.
- **Report Failures Clearly**: If a feature fails verification, provide a structured report of which AC failed and why.
