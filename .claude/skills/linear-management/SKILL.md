---
name: linear-management
description: Use this skill to manage Linear tickets using the linear-cli, including status transitions, linking to execution plans, and updating issues.
version: 1.1.0
---

## Overview

This skill provides a bridge between the local execution plans in `docs/exec-plans/` and Linear tickets using the `linear-cli`. It ensures that the project management state in Linear is always in sync with the actual development progress.

## Status Mapping

When working on a ticket, use the following status transitions:

| Local Step | Linear Status |
|---|---|
| Plan Created | `Todo` |
| Implementation Started | `In Progress` |
| Code Review Requested | `In Review` |
| QA Feature Validation Started | `Ready for QA` |
| QA Feature Validation In Progress | `In QA` |
| Plan Completed | `Done` |

## Core Activities

1.  **Ticket Linking**: 
    *   Ensure the local execution plan filename or title contains the Linear ticket ID (e.g., `[LIN-123] feature-name.md`).
    *   If no ticket exists, create one using:
        `linear-cli issues create "Ticket Title" --team PER --state "Todo"`
2.  **Status Transitions**: 
    *   As you move through the phases of implementation, update the Linear issue status using:
        `linear-cli issues update ISSUE_ID --state "STATUS_NAME"`
3.  **Finding Tickets**:
    *   List or search for tickets if needed:
        `linear-cli issues list --filter "title~=SEARCH_TERM"`

## Mandatory Rules

*   **Always Verify State**: Before updating a status, verify the current state of the issue using `linear-cli issues show ISSUE_ID`.
*   **Unique Mapping**: Each execution plan should correspond to exactly one Linear issue.
*   **Documentation updates**: When a ticket is marked as `Done`, ensure the execution plan is moved to `docs/exec-plans/completed/`.
