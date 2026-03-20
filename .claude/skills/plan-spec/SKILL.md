---
name: plan-coding
description: Use this skill to check existing code and specification documents, plan tasks, and write execution plans.
version: 1.0.0
---

## Overview

This skill facilitates a structured approach to software development tasks. It begins by analyzing `INDEX.md` to grasp the project's architecture and directory structure, followed by a review of the product overview to align with the core objectives. Finally, it synthesizes this information to create a detailed execution plan for implementing features or resolving issues at /docs/exec-plans.

## Steps

- **READ exist ADRs** and follow ADR rules `docs/adr/**.md`.
- **Plan**: Draft the execution plan.
- **Save**: Save the plan in `docs/tasks/active/`.

## File Name

- **User story names** the file name should be user story. ex: User-can-update-todos
- **Refactoring/Bug fix names** the file name should be fix-name. ex: fix-edit-bugs/ refactor todo domains.

The unit should be 'user story' size like "User can read session".
If it includes multiple user stories, they should be split into separate plans.
