# Backend (NestJS) Index

## Architecture Overview

The backend is a **NestJS application** following **layered architecture with CQRS (Command Query Responsibility Segregation)** principles. Refer to [BE-001-layer-architecture.md](../docs/adr/BE-001-layer-architecture.md) for detailed architectural decisions.

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── app.controller.ts       # Main controller
├── app.service.ts          # Root service
├── shared/                 # Shared utilities and infrastructure
│   ├── infrastructure/     # Database, ORM, external services
│   └── domain/             # Shared domain entities and value objects
└── [feature]/              # Feature modules (todos, statuses, etc.)
    ├── dto/                # Data Transfer Objects
    ├── datasource/         # Database table mappings (1:1)
    ├── repository/         # Domain object reconstruction
    ├── command/            # Write operations
    ├── query/              # Read operations
    ├── domain/             # Business logic and entities
    └── [feature].module.ts # NestJS module
```

## Architectural Layers

### 1. **Controller**

- HTTP request entry point
- Maps requests to DTOs
- Converts Domain objects to Response DTOs
- Coordinates Queries, Commands, or Coordinators

### 2. **Coordinator**

- Orchestrates complex business flows
- Combines multiple Query/Command operations
- Only used when logic exceeds single operation scope
- Operates on Domain objects

### 3. **Query & Command**

- **Query**: Read-only data operations → return Domain objects
- **Command**: Write/modification operations → return Domain objects

### 4. **Repository**

- Reconstructs Domain objects from raw data
- Accesses DataSource layer
- Aggregates data for domain-unit operations

### 5. **DataSource**

- Direct database access
- 1:1 mapping to database tables
- Raw data representation

### 6. **Domain**

- Business logic and validation
- Enforces business rules
- Independent of infrastructure concerns

## Core Design Principles

- **Layered Architecture**: Clear separation of concerns
- **CQRS**: Separate read (Query) and write (Command) operations
- **Domain-Driven Design**: Business logic resides in Domain classes
- **Single Responsibility**: Each function does one thing
- **Domain Language**: Names reflect business concepts, not technical details

## Development Commands

```bash
# Development server with auto-reload
npm run dev:server

# Run tests
npm run test
npm run test:watch
npm run test:cov
npm run test:debug
npm run test:e2e

# Code quality
npm run lint
npm run format

# Production
npm run build
npm run start:prod

# Debugging
npm run start:debug
```

## Data Structures

- **DTO**: API request/response mapping (Controller layer)
- **Domain**: Business entities with validation and logic
- **DataModel**: Raw database representation

## Feature Modules

| Module       | Responsibility                               |
| ------------ | -------------------------------------------- |
| **Todos**    | Todo item CRUD operations and business logic |
| **Statuses** | Status definitions and assignments           |

## Architecture Decision Records

- [BE-001: Layered Architecture & CQRS](../docs/adr/BE-001-layer-architecture.md)
- [BE-002: Domain Management](../docs/adr/BE-002-manage-data-domain.md)
- [BE-003: Error Handling](../docs/adr/BE-003-error-handling.md)
- [BE-004: Testing Strategy](../docs/adr/BE-004-test-for-bussiness-logic.md)
- [BE-005: Value Objects](../docs/adr/BE-005-value-domain.md)
- [BE-006: List/Collection Patterns](../docs/adr/BE-006-list-domain.md)

## Quick Start

1. Install dependencies: `npm install`
2. Start development server: `npm run dev:server`
3. Run tests: `npm run test:watch`
4. Review ADRs in `docs/adr/` for implementation details
