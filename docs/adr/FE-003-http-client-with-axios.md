---
id: FE-003
title: Http-client-with-axios
domain: frontend
rules: true
---

# Http-client-with-axios

## Context

The frontend application needs a standard, reliable way to communicate with our backend APIs. While the native `fetch` API is available, it is often too simple and lacks built-in features for complex applications, such as automatic JSON transformation, simple timeout handling, or interceptors for requests and responses. We need a robust HTTP client that allows us to manage global configurations (like headers or base URLs) easily, manage networking errors efficiently, and handle token refresh flows or unified error logging concisely.

## Decision

1. **Axios** will be the standardized HTTP client for the entire frontend application.
2. We will create a single, pre-configured Axios **instance** that defines the default base URL, headers, and timeouts for API communication.
3. We will utilize **Axios interceptors** to handle common request/response logic (e.g., injecting authorization tokens, globally handling 401s, or sending errors to Rollbar natively).

## Do's and Don'ts

### Do

- Do use the configured global Axios instance instead of calling `axios` directly or using `fetch` for structured API requests.
- Do leverage interceptors for global error handling, logging, and token management to keep business logic clean.
- Do explicitly handle common HTTP errors properly as defined by our error logic structures.

### Don't

- Don't use the native `fetch` API for making backend API calls unless absolutely necessary for specific streams or edge cases not supported by Axios.
- Don't configure different base URLs in individual component files; centralize API configurations inside the interceptor setup.

## Consequences

### Positive

- Clean, DRY (Don't Repeat Yourself) network code thanks to interceptors managing auth and global errors.
- Built-in handling of JSON, simplifying payloads and responses.
- Easier cancellation and timeout configuration than standard fetch wrappers.

### Negative

- Slightly larger bundle size by including an external HTTP client, though it is usually negligible given modern caching and CDNs.
- Developers must familiarize themselves with Axios configurations if they have only ever used standard Fetch API.

## Compliance and Enforcement

- Code reviews will flag any usage of `fetch` or undeclared Axios instances without documented reasons.
- The standard instance must be imported and used for all domain-specific data-fetching throughout the React components or state hooks (like React Query or SWR).

## References

- [Axios Documentation](https://axios-http.com/docs/intro)
