---
id: BE-002
title: domain class rules
domain: backend
rules: true
---

# Domain Class Rules

## Context

To minimize side effects, ensure data integrity, and prevent bugs across the backend, we need a strict set of rules for how Domain classes are implemented. This ADR defines the structural and behavioral requirements for all domain-related objects.

## Decision

All Domain classes must adhere to the following foundational rules to remain immutable and self-validating:

### General Implementation Rules

1.  **Immutability (Getters Only)**: Domain classes must only provide `getter` methods. Properties must be private or read-only to ensure no side effects after instantiation.
2.  **Complete Constructors**: The constructor must require all properties necessary for a valid domain object. Partial or empty domain objects are not allowed.
3.  **Self-Validation**: Validation logic must be executed within the **constructor**. If any value is invalid, the constructor must throw an error, ensuring that an invalid domain object can never exist in memory.
4.  **Derivation Methods**: Domains can have methods for calculations or combining data (e.g., `user.fullName() => user.firstName + user.lastName`).

### Domain Types

Domains are categorized into two specific types based on their underlying data structure:

#### A. Value Domain (Single Value)

Wraps a single primitive or specific value. Primarily used to represent specific domain primitives like IDs or Statuses.

- **Property**: Always named `_value` (accessed via `.value()`).
- **Example**: `UserId.value()` returns the raw ID string.

#### B. List Domain (Collection)

Wraps a collection of other Domain objects to manage list-wide business logic.

- **Property**: The main collection is held in a `.list` property.
- **Logic**: Provides filtering or orchestration across the collection.
- **Example**: `UsersDomain.filterActiveUsers()` returns a new `UsersDomain` containing only active `UserDomain` objects.

## Do's and Don'ts

### Do

- Throw errors in the constructor if input values violate business rules.
- Use private fields with public getters for all properties.
- Create specific Value Domains for important identifiers (e.g., `OrderId`, `EmailAddress`).
- Implement descriptive methods for calculated values rather than letting consumers calculate them.

### Don't

- Use setters (`set propertyName`) in any domain class.
- Return raw database types from a domain; always wrap them in domain logic.
- Perform asynchronous operations (e.g., DB calls) inside a domain constructor or method.

## Consequences

### Positive

- **No Side Effects**: Immutable objects prevent accidental state changes during execution.
- **Guaranteed Validity**: Once you have a domain object, you know it is valid, reducing null/type checks elsewhere.
- **Domain Clarity**: Business logic is localized within the domain itself.

### Negative

- **Verbose Initialization**: Constructors can become large when many properties are required.
- **Mapping Overhead**: Requires more mapping logic when converting from DataSources or DTOs.

### Risks

- Potential performance impact if deep-validating extremely large lists (mitigated by efficient list domain logic).

## Compliance and Enforcement

Enforced through peer reviews and strict TypeScript typing (e.g., using `Readonly` interfaces).

## References

- Domain-Driven Design (DDD)
- Value Object Pattern
- Immutability in Software Design
