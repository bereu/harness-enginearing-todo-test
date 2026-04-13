# Frontend Project Index

## Overview

The frontend is a React 19 application using Vite, TypeScript, and Zod for form validation. The application focuses on providing a robust user interface with proper error handling and data validation.

## Directory Structure

```
src/
├── main.tsx                # Application entry point
├── app.tsx                 # Root component
├── index.css               # Global styles
├── App.css                 # App-level styles
├── components/             # Reusable UI components
│   └── [ComponentName]/     # Component-specific folders
│       ├── [ComponentName].tsx
│       └── [ComponentName].module.css
├── services/               # API clients and business logic
│   ├── api/                # HTTP API clients (Axios-based)
│   └── [domain]/           # Domain-specific service logic
├── hooks/                  # Custom React hooks
├── schemas/                # Zod validation schemas
├── types/                  # TypeScript type definitions
├── constants/              # Application constants
└── assets/                 # Images, icons, and static files
```

## Core Technologies

- **React 19.2.4**: UI library
- **TypeScript ~5.9.3**: Type safety
- **Vite 8.0.0**: Build tool and dev server
- **Axios 1.7.7**: HTTP client
- **Zod 3.24.1**: Schema validation and type inference
- **Rollbar 2.26.3**: Error tracking and monitoring

## Key Directories

### Components (`src/components/`)

Reusable UI components organized by feature. Each component should be self-contained with its own styles and types.

### Services (`src/services/`)

Contains API client integrations (via Axios) and domain-specific business logic for data fetching and manipulation.

### Hooks (`src/hooks/`)

Custom React hooks for state management, side effects, and reusable component logic.

### Schemas (`src/schemas/`)

Zod validation schemas for:

- Form validation
- API request/response validation
- Type-safe data parsing

### Types (`src/types/`)

Shared TypeScript type definitions and interfaces used across components.

### Constants (`src/constants/`)

Application-wide constants like API endpoints, enums, and magic values.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Error Handling

The frontend implements comprehensive error handling as documented in [FE-001-error-handling.md](../docs/adr/FE-001-error-handling.md):

- **Business Logic Errors**: Expected application errors (validation failures, auth issues)
- **System Errors**: Unexpected technical failures
- **Rollbar Integration**: Critical and unexpected errors are reported to Rollbar with contextual properties
- **Error Boundaries**: Prevent entire app crashes by isolating failing components

### Best Practices

- Attach relevant context (route, component, action) when logging errors
- Never send sensitive data (PII, passwords, tokens) to Rollbar
- Use Error Boundaries around major application views
- Distinguish between expected and unexpected errors

## Form Validation

All forms use **Zod schemas** for validation:

1. Define validation schema in `src/schemas/`
2. Use schema for client-side validation
3. API validation happens on the backend (DTO validation)
4. Display validation errors to users

See [FE-002-form-validation-with-zod.md](../docs/adr/FE-002-form-validation-with-zod.md) for details.

## API Communication

HTTP requests are handled via **Axios** configured in `src/services/api/`:

- Base configuration with default headers and error handling
- Request/response interceptors for common concerns
- Error handling and Rollbar logging integration

See [FE-003-http-client-with-axios.md](../docs/adr/FE-003-http-client-with-axios.md) for details.

## Styling

- Global styles in `src/index.css`
- Component-scoped CSS modules: `ComponentName.module.css`
- Avoid inline styles; prefer CSS modules for scoped styling

## Additional Resources

- [FE-001-error-handling.md](../docs/adr/FE-001-error-handling.md) - Error handling with Rollbar
- [FE-002-form-validation-with-zod.md](../docs/adr/FE-002-form-validation-with-zod.md) - Form validation approach
- [FE-003-http-client-with-axios.md](../docs/adr/FE-003-http-client-with-axios.md) - API client configuration
