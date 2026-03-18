---
name: refactor-adr
description: Use this skill to read all Architecture Decision Records (ADRs), check for any violations in the codebase, and refactor the codebase to align with ADR requirements.
version: 1.0.0
---

## Overview

This skill ensures that the codebase adheres to the rules defined in the Architecture Decision Records (ADRs). It involves a systematic review of the ADR documents, analyzing the codebase to identify any points of violation, and executing the necessary refactoring to fix them.

## Steps

1. **Read all ADRs**:
   - Scan and read all the markdown files within `.archgate/adrs/` (or `docs/adr/`).
   - Note the core "Decision" and "Do's and Don'ts" rules for each ADR.
2. **Check for Violations**:
   - Inspect the codebase (both frontend `client/` and backend `server/` depending on the ADR's target domain) to identify where these rules are being violated.
   - For frontend, check for improper form validations, `fetch` calls, or improper error handling.
   - For backend, check layer architecture boundaries, domain class rules, error handling structures, or testing conventions.

3. **Fix Violations**:
   - Refactor the codebase to resolve any identified violations.
   - Prioritize fixing issues without breaking business logic, and ensure tests still pass after refactoring.
