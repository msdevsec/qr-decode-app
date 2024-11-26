# Testing Strategy

This document outlines the testing strategy for the QR Decode API backend.

## Test Structure

```
__test__/
├── integration/           # Integration tests
│   ├── auth/             # Authentication flows
│   │   ├── login.test.ts
│   │   └── register.test.ts
│   └── scans/           # Scanning operations
│       └── scans.test.ts
├── unit/                # Unit tests
│   ├── controllers/     # Controller tests
│   │   ├── authController.test.ts
│   │   └── scanController.test.ts
│   ├── lib/            # Database client tests
│   │   ├── prisma.test.ts
│   │   └── redis.test.ts
│   ├── middleware/     # Middleware tests
│   │   ├── auth.test.ts
│   │   ├── errorHandler.test.ts
│   │   └── rateLimit.test.ts
│   └── utils/         # Utility tests
│       └── errors.test.ts
└── setups.ts          # Test setup and utilities
```

## Testing Approach

### 1. Unit Tests

Unit tests focus on testing individual components in isolation. We use Jest's mocking capabilities to mock dependencies.

#### Database Client Mocking

For database clients (Redis and Prisma), we use the following approach:

```typescript
// 1. Create mock instance
const mockRedis = {
  get: jest.fn().mockResolvedValue('value'),
  set: jest.fn().mockResolvedValue('OK')
};

// 2. Mock the module
jest.mock('../lib/redis', () => ({
  redisClient: mockRedis
}));

// 3. Test against mock
expect(mockRedis.set).toHaveBeenCalledWith('key', 'value');
```

#### Event Handler Testing

For modules with event handlers (like Redis):

```typescript
// Mock event handler implementation
mockRedis.on.mockImplementation((event, handler) => {
  if (event === 'connect') handler();
  return mockRedis;
});

// Test event registration
expect(mockRedis.on).toHaveBeenCalledWith(
  'connect', 
  expect.any(Function)
);
```

### 2. Integration Tests

Integration tests verify that different components work together correctly. These tests:

- Use a test database
- Test complete flows (e.g., registration → login)
- Verify HTTP responses
- Check database state

Example:
```typescript
describe('Auth Flow', () => {
  it('should register and login', async () => {
    // 1. Register
    const registerRes = await request(app)
      .post('/auth/register')
      .send(userData);
    expect(registerRes.status).toBe(201);

    // 2. Login
    const loginRes = await request(app)
      .post('/auth/login')
      .send(loginData);
    expect(loginRes.status).toBe(200);
  });
});
```

### 3. Test Coverage

We aim for high test coverage across all components:

- Controllers: 100% coverage
- Middleware: 100% coverage
- Database clients: 100% coverage
- Utility functions: 100% coverage

Current coverage:
```
Test Suites: 12 passed, 12 total
Tests:       72 passed, 72 total
```

## Best Practices

1. **Mocking Strategy**
   - Mock at the module level
   - Use `jest.fn()` for individual methods
   - Implement event handlers in mocks
   - Test against mock instances directly

2. **Test Organization**
   - Group related tests in describe blocks
   - Use clear test descriptions
   - Follow AAA pattern (Arrange, Act, Assert)

3. **Error Handling**
   - Test both success and error cases
   - Verify error messages and status codes
   - Test edge cases and invalid inputs

4. **Database Testing**
   - Use mock instances for unit tests
   - Use test database for integration tests
   - Clean up test data after each test

## Mocking Patterns

### 1. Direct Module Mocking
Best for simple modules:
```typescript
jest.mock('../lib/module', () => ({
  exportedFunction: jest.fn()
}));
```

### 2. Constructor Mocking
For classes like Redis and Prisma:
```typescript
jest.mock('module', () => {
  return function() {
    return mockInstance;
  };
});
```

### 3. Event Handler Mocking
For event-based modules:
```typescript
mockInstance.on.mockImplementation((event, handler) => {
  if (event === 'connect') handler();
  return mockInstance;
});
```

### 4. Promise Mocking
For async operations:
```typescript
mockInstance.method
  .mockResolvedValueOnce(successValue)  // Success case
  .mockRejectedValueOnce(error);        // Error case
```

### 5. Spy Mocking
For partial mocking:
```typescript
jest.spyOn(object, 'method')
  .mockImplementation(() => mockValue);
```

### 6. Module Factory Mocking
For complex modules:
```typescript
jest.mock('module', () => {
  return {
    __esModule: true,
    default: mockInstance,
    namedExport: mockFunction
  };
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.ts

# Run with coverage
npm test -- --coverage
```

## Continuous Integration

Tests are run automatically on:
- Pull requests
- Merges to main branch
- Release builds

## Future Improvements

1. Add more edge case tests
2. Implement E2E tests
3. Add performance tests
4. Improve test documentation
5. Add visual regression tests for frontend
6. Implement load testing
7. Add security testing
8. Improve mock type safety
