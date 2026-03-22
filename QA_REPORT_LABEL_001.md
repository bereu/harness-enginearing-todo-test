# QA Validation Report: LABEL-001 Feature

**Feature**: User can create a label
**Date**: 2026-03-20
**Status**: FAILED

---

## Summary

| Metric          | Value |
| --------------- | ----- |
| Total Tests Run | 15    |
| Passed          | 4     |
| Failed          | 7     |
| Warnings        | 4     |

---

## Executive Summary

The LABEL-001 feature has **critical routing issues** that prevent it from meeting acceptance criteria. While the underlying business logic for label creation is sound, the feature fails on two critical fronts:

1. **Route Mapping Mismatch**: Acceptance criteria specify routes at `/labels` (root), but implementation places them at `/todos/labels` (prefixed under todos controller)
2. **GET Route Unreachable**: The `GET /todos/labels` endpoint is unreachable due to NestJS route ordering—the generic `@Get(':id')` route matches "labels" as a parameter before the specific `/labels` route is evaluated

**Verdict**: Feature is **NOT READY** for production. Critical routing architectural issue must be resolved.

---

## Detailed Test Results

### Route Architecture Issues

#### [CRITICAL] Test 1: GET /labels (as per Acceptance Criteria #1)

**Status**: FAILED
**Expected**: HTTP 200, `[]` (empty array on startup)
**Actual**: HTTP 404, `{"statusCode":404,"message":"Cannot GET /labels"...}`
**Root Cause**: Route is implemented at `/todos/labels`, not `/labels`
**Severity**: CRITICAL BLOCKER

**Acceptance Criteria #1**: "GET /labels returns [] on startup" — FAILS because endpoint doesn't exist at specified path.

---

#### [CRITICAL] Test 2: GET /todos/labels (actual implementation path)

**Status**: FAILED
**Expected**: HTTP 200, array of labels
**Actual**: HTTP 404, `{"statusCode":404,"message":"Todo with id labels not found"...}`
**Root Cause**: NestJS router evaluates `@Get(':id')` route (line 67) before `@Get('/labels')` route (line 109). The parameter `:id` matches the string "labels", causing the request to be routed to the todo-by-id handler instead.
**Severity**: CRITICAL BLOCKER
**Issue Code**: Route ordering bug in NestJS controller

**Analysis**: In NestJS, route specificity matters. When multiple `@Get()` decorators exist in a controller, the most specific routes must be evaluated first. The controller currently has:

```
@Get()           → matches /todos
@Get(':id')      → matches /todos/anything
@Get('/labels')  → never reached because :id matches first
```

This is a fundamental architectural issue with how the label routes were added to the TodoController.

---

### Acceptance Criteria Verification

#### Acceptance Criterion #1: GET /labels returns [] on startup

**Status**: FAILED ❌
**Test Result**: Route doesn't exist at `/labels`
**Actual Implementation**: Route at `/todos/labels` but unreachable due to route ordering

---

#### Acceptance Criterion #2: POST /labels { name, color } returns { id, name, color } with HTTP 201

**Status**: PARTIAL PASS (wrong path) ⚠️
**Test Executed**: `POST /todos/labels { "name": "Bug", "color": "#FF0000" }`
**Expected**: HTTP 201 with label object
**Actual**: HTTP 201 with `{"id":"a71353c7-5c16-408c-a029-03f955cd1236","name":"Bug","color":"#FF0000"}`
**Result**: Logic works, but at wrong path (`/todos/labels` instead of `/labels`)
**Severity**: HIGH - Routing mismatch with acceptance criteria

---

#### Acceptance Criterion #3: POST /labels with duplicate name returns 4xx error

**Status**: PASS (at wrong path) ⚠️
**Test Executed**: `POST /todos/labels { "name": "Bug", "color": "#0000FF" }` (Bug already created)
**Expected**: 4xx error
**Actual**: HTTP 400, `{"message":"Label with name \"Bug\" already exists"...}`
**Result**: Validation works correctly, duplicate detection implemented
**Note**: Route is at `/todos/labels`, not `/labels`

---

#### Acceptance Criterion #4: POST /labels with invalid hex color returns 400 validation error

**Status**: PASS (at wrong path) ⚠️
**Test Executed**: `POST /todos/labels { "name": "Invalid", "color": "red" }`
**Expected**: HTTP 400
**Actual**: HTTP 400, `{"message":"color must be a valid hex color (e.g. #FF5733)"...}`
**Result**: Hex validation works correctly
**Note**: Route is at `/todos/labels`, not `/labels`

---

#### Acceptance Criterion #5: POST /labels with empty name returns 400 validation error

**Status**: PASS (at wrong path) ⚠️
**Test Executed**: `POST /todos/labels { "name": "", "color": "#FF0000" }`
**Expected**: HTTP 400
**Actual**: HTTP 400, `{"message":"name should not be empty"...}`
**Result**: Empty name validation works
**Note**: Route is at `/todos/labels`, not `/labels`

---

#### Acceptance Criterion #6: GET /labels after creation returns all created labels

**Status**: FAILED ❌
**Expected**: HTTP 200 with array of created labels
**Actual**: GET /labels returns 404; GET /todos/labels returns 404 (unreachable)
**Note**: Cannot verify due to critical route issues

---

## Edge Case & Validation Testing Results

### Input Validation Testing

| Test Case            | Input                    | HTTP Status | Result | Notes                         |
| -------------------- | ------------------------ | ----------- | ------ | ----------------------------- |
| Missing color field  | `{"name": "Test"}`       | 400         | PASS   | Proper validation             |
| Missing name field   | `{"color": "#FF0000"}`   | 400         | PASS   | Proper validation             |
| Null name            | `{"name": null, ...}`    | 400         | PASS   | Type checking works           |
| Whitespace-only name | `{"name": "   ", ...}`   | 500         | FAIL   | Unhandled case (critical bug) |
| Uppercase hex        | `{"color": "#AABBCC"}`   | 201         | PASS   | Accepts valid hex             |
| Lowercase hex        | `{"color": "#aabbcc"}`   | 201         | PASS   | Case-insensitive validation   |
| Short hex (#ABC)     | `{"color": "#ABC"}`      | 400         | PASS   | Rejects 3-char hex            |
| Long hex (#AABBCCDD) | `{"color": "#AABBCCDD"}` | 400         | PASS   | Rejects 8-char hex            |

---

## Critical Issues Found

### [CRITICAL BLOCKER #1] Route Mismatch with Acceptance Criteria

**Severity**: CRITICAL
**Issue**: Label routes are implemented at `/todos/labels` but acceptance criteria require `/labels`
**Impact**: Feature cannot pass AC #1, #2, #6 as written
**Root Cause**: Controller defined with `@Controller('todos')` prefix
**Suggested Fix**:

- Option A: Create separate `LabelController` with `@Controller('labels')`
- Option B: Change `TodoController` to prefix label routes without 'todos' path (not recommended architecturally)

---

### [CRITICAL BLOCKER #2] GET /labels Endpoint Unreachable

**Severity**: CRITICAL
**Issue**: NestJS routes `GET /todos/labels` to `getTodoById` handler instead of `getLabels` due to route evaluation order
**Impact**: Cannot retrieve labels even at `/todos/labels` path
**Root Cause**: Generic `@Get(':id')` route (line 67) is evaluated before specific `@Get('/labels')` route (line 109)
**Evidence**:

- POST /todos/labels works (no conflict with other POST routes)
- GET /todos/labels fails with "Todo with id labels not found"
- Server logs show route correctly mapped: `{/todos/labels, GET}`
- But request routing is incorrect at runtime

**Suggested Fix**:

1. Move `@Get('/labels')` route before `@Get(':id')` route in controller
2. This ensures specific routes are matched before generic parameter routes

---

### [HIGH SEVERITY] Unhandled Whitespace-Only Name Input

**Severity**: HIGH
**Issue**: `POST /todos/labels { "name": "   " }` returns HTTP 500 instead of 400
**Impact**: Server crash/error not properly handled
**Expected**: HTTP 400 with validation error message
**Actual**: HTTP 500, "Internal server error"
**Root Cause**: Validation passes whitespace string through; likely fails during processing or duplicate check
**Suggested Fix**: Add DTO validator to trim and re-validate whitespace strings:

```typescript
@IsNotEmpty()
@Transform(({ value }) => value?.trim())
@IsString()
name: string;
```

---

## Test Summary by Category

### Routing Tests (2 total, 0 passed)

- GET /labels (AC path): **FAILED** - 404
- GET /todos/labels (impl path): **FAILED** - 404 (route ordering issue)

### Creation Tests (3 total, 1 passed)

- POST /labels (AC path): **FAILED** - 404
- POST /todos/labels valid data: **PASSED** - 201
- POST /todos/labels duplicate name: **PASSED** - 400

### Validation Tests (8 total, 5 passed, 1 critical fail)

- Empty name: **PASSED** - 400
- Invalid color: **PASSED** - 400
- Missing fields: **PASSED** - 400
- Whitespace name: **FAILED** - 500 (critical)
- Valid hex formats: **PASSED** - 201

### Retrieval Tests (1 total, 0 passed)

- GET /labels after creation: **FAILED** - Cannot test due to routing issues

---

## Code Review Findings

### File: `/server/src/todos/todo.controller.ts`

**Issue 1: Route Definition Order**

```typescript
// Lines 57-82: PROBLEMATIC ORDER
@Get()                    // /todos
getTodos(...) { ... }

@Get(':id')               // /todos/:id ← Matches "labels"!
getTodoById(...) { ... }

@Get('/labels')           // /todos/labels ← Never reached
getLabels() { ... }
```

**Issue 2: Architectural Placement**
Label routes should not be under `@Controller('todos')` if they need different root path. This violates separation of concerns.

---

## Files Affected

```
/Users/soheieto/sandbox/harness-for-todo-app/server/src/todos/todo.controller.ts
├─ Contains label routes but under wrong controller
├─ Route ordering issue causing GET to be unreachable
└─ No validation transformation for whitespace names

/Users/soheieto/sandbox/harness-for-todo-app/server/src/todos/dto/create-label.dto.ts
└─ Likely missing whitespace trimming transformation

/Users/soheieto/sandbox/harness-for-todo-app/server/src/todos/command/create-label.command.ts
└─ May need additional whitespace validation
```

---

## Recommendations

### Must-Fix (Blocking Production Release)

1. **Fix Route Ordering** (Priority: CRITICAL)
   - Move `@Get('/labels')` method before `@Get(':id')` method in TodoController
   - Test that GET /todos/labels now works
   - Estimated effort: 5 minutes

2. **Fix Route Path** (Priority: CRITICAL)
   - Create separate `LabelController` with `@Controller('labels')`
   - OR: Modify routing to serve label routes at `/labels` (root path)
   - This ensures acceptance criteria are met
   - Estimated effort: 30 minutes

3. **Fix Whitespace Validation** (Priority: HIGH)
   - Add transformation to trim whitespace in CreateLabelDto
   - Re-validate after trimming
   - Prevents 500 errors on whitespace input
   - Estimated effort: 10 minutes

### Should-Fix (Quality Improvements)

4. **Add Integration Tests** (Priority: MEDIUM)
   - Test label CRUD operations at both root and todos paths
   - Test route ordering doesn't regress
   - Test all validation scenarios
   - Estimated effort: 1-2 hours

5. **Documentation** (Priority: MEDIUM)
   - Document label API endpoints clearly
   - Update API docs to reflect actual route paths
   - Clarify whether labels are sub-resources of todos or top-level

---

## Test Environment Details

- **Backend Framework**: NestJS 11.1.16
- **Server Port**: 3000
- **Test Date/Time**: 2026-03-20, 04:57-05:00 UTC
- **API Base URL**: http://localhost:3000
- **Test Method**: curl (HTTP requests)
- **Database**: In-memory (based on DataSource pattern)

---

## Conclusion

**VERDICT: FEATURE DOES NOT MEET ACCEPTANCE CRITERIA**

The LABEL-001 feature has been partially implemented with correct business logic but has **two critical blocking issues**:

1. **Route path mismatch**: Implementation at `/todos/labels` vs. AC requirement for `/labels`
2. **Route ordering bug**: GET endpoint unreachable due to NestJS route evaluation order

Additionally, there is **one high-severity validation bug**: whitespace-only names crash with 500 error.

The feature is **NOT READY FOR MERGE** until these critical issues are resolved. While the underlying domain logic (validation, duplicate detection, creation) works correctly, the API contract violations make the feature unusable as specified.

---

## Next Steps

1. **Developer**: Review and fix critical blockers identified above
2. **Developer**: Re-run QA tests after fixes
3. **QA**: Re-validate all acceptance criteria
4. **QA**: Regression test existing todo/status features to ensure no breakage
5. **Team**: Consider architectural decision: should labels be at `/labels` or `/todos/labels`?

---

**QA Tester**: Claude Code (QA Agent)
**Report Generated**: 2026-03-20
**Test Environment**: Harness for Todo App - Server
