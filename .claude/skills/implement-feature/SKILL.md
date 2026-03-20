---
name: implement-feature
description: Use this skill to implement a feature from an active execution plan in docs/exec-plans/active/. Reads the plan, implements each action item, marks tasks complete, and moves the plan to completed when done.
version: 1.0.0
---

## Steps

### Step 1 — Load the plan

If the user provides a plan filename or feature name, locate it in `docs/exec-plans/active/`. If none is specified, list all active plans and ask the user which one to implement.

Read the full plan. Note:

- **Action List**: the ordered task checklist
- **AC (Acceptance Criteria)**: the definition of done
- **Plan Overview / Why It Is Needed**: context for making sound implementation decisions
- **Linear Ticket ID**: Identify the corresponding Linear ticket (e.g., LIN-XXX).

### Step 2 - Load ARD

Read `docs/adr/**.md` And follow ADR rules.

### Step 3 — Implement action items

1. Read the affected files.
2. Make the minimal, focused change needed.
3. Check the item off in the plan file: `- [ ]` → `- [x]`.
4. Save the plan file after each item so progress is visible.

Follow project conventions strictly:

- Use the Result type for error handling (do not throw where the codebase uses Result).
- Do not add dependencies not already in the stack unless the plan calls for it.
- Write or update tests for any logic you add (unit tests in `tests/unit/`, integration tests in `tests/integration/` as appropriate).
- Keep changes minimal — only implement what the plan specifies.

### Step 4 — Verify against Acceptance Criteria

- If verifiable by running tests, run them and confirm they pass.
- If verifiable by inspection, confirm the criterion is satisfied.
- Check off each AC item as it is met: `- [ ]` → `- [x]`.

### Step 5 — Ask Code Review Agent to review the changes

- Ask review agent to your code
- check report and fix it if needed. and ask again

### Step 6 — After code review, ask QA Agent to test the feature

- Ask QA agent to test the feature
- check report and fix it if needed. and ask again
