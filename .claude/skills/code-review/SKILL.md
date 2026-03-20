---
name: code-review
description: Use this skill to improve code and fix error. After implementing features we must use this.
---

## Overview

1. **Useless duplicate file:** Check if there are any redundantly created files that duplicate existing ones.
   _Example:_ Creating a new `user-profile.service.ts` when a `users.service.ts` already exists and handles profile operations.

2. **Useless duplicate code:** Identify and abstract any repeated code logic into reusable functions or components.
   _Example:_

   ```typescript
   // Bad: Duplicating logic across different files
   const isAdult = new Date().getFullYear() - user.birthYear >= 18;

   // Good: Abstracting into a reusable function or entity method
   const isAdult = user.isAdult();
   ```

3. **Useless comment:** Remove commented-out code, obvious comments that don't add value, and outdated explanations.
   _Example:_

   ```typescript
   // Bad: Obvious comments and left-over dead code
   // Increment the retry count by 1
   retryCount++;
   // console.log("retrying...");

   // Good: Self-documenting code without clutter
   retryCount++;
   ```

4. **Security issues:** Scan the changes for potential vulnerabilities, such as hardcoded secrets, lack of validation, or improper authorization checks.
   _Example:_

   ```typescript
   // Bad: Hardcoding secrets and lack of validation
   const token = "my-super-secret-dev-token";
   const query = `SELECT * FROM users WHERE id = ${req.body.id}`;

   // Good: Using config services and proper ORMs/query builders
   const token = this.configService.get("API_TOKEN");
   const user = await this.userRepository.findOne({ where: { id: dto.id } });
   ```

5. **Magic numbers and raw strings:** Avoid using magic numbers or raw strings for representing statuses or configuration values. Refer to `GEN-001`.
   _Example:_

   ```typescript
   // Bad: Using raw strings for status check
   if (status === "done") {
     // ...
   }

   // Good: Using a central constant array and derived type
   export const TODO_STATUSES = ["todo", "in-progress", "done"] as const;
   export type TodoStatus = (typeof TODO_STATUSES)[number];

   function updateStatus(status: TodoStatus) {
     // ...
   }
   ```
