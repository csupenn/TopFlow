# Testing Guide for TopFlow

This guide explains how to write and run tests in the TopFlow project.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Organization](#test-organization)
- [Best Practices](#best-practices)
- [Continuous Integration](#continuous-integration)

---

## Overview

TopFlow uses a comprehensive testing strategy following the Test-Driven Development (TDD) approach:

### Test Pyramid

```
         /\
        /E2E\       ← Few (Manual/Playwright) - Critical user flows
       /------\
      /  Integ \    ← Some (RTL + MSW) - Component integration
     /----------\
    /   Unit     \  ← Many (Jest) - Utilities, hooks, pure functions
   /--------------\
```

**Distribution:**
- 70% Unit tests (fast, isolated)
- 20% Integration tests (component + API interactions)
- 10% E2E tests (critical paths only)

---

## Testing Stack

### Core Tools

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking
- **Testing Library User Event** - User interaction simulation
- **Jest DOM** - Custom DOM matchers
- **Vitest** - Alternative test runner with UI

### Why This Stack?

- **Jest**: Industry standard, great Next.js integration
- **React Testing Library**: Tests user behavior, not implementation
- **MSW**: Realistic API mocking at network level
- **Vitest**: Fast, modern alternative with great DX

---

## Running Tests

### Available Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for TDD)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests with Vitest UI
pnpm test:ui

# Run tests in CI mode
pnpm test:ci
```

### Watch Mode Tips

When using `pnpm test:watch`:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by test file name
- Press `t` to filter by test name
- Press `q` to quit

---

## Writing Tests

### File Naming Convention

Place test files in `__tests__` directories or use `.test.ts` / `.spec.ts` suffixes:

```
lib/
├── utils.ts
└── __tests__/
    └── utils.test.ts

components/
├── button.tsx
└── button.test.tsx
```

### Basic Test Structure

```typescript
import { functionToTest } from '../my-module'

describe('functionToTest', () => {
  it('should do something specific', () => {
    const result = functionToTest('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge cases', () => {
    const result = functionToTest(null)
    expect(result).toBe(undefined)
  })
})
```

### Testing Utilities

Example from `lib/__tests__/utils.test.ts`:

```typescript
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should merge Tailwind classes correctly', () => {
    const result = cn('p-4 p-8')
    expect(result).toBe('p-8') // twMerge keeps last class
  })
})
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from 'test-setup/utils/test-utils'
import { Button } from '../button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Testing with User Interactions

```typescript
import { render, screen } from 'test-setup/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../login-form'

describe('LoginForm', () => {
  it('should submit form with user input', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    render(<LoginForm onSubmit={handleSubmit} />)

    // Type in email and password
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

### Testing with MSW (API Mocking)

```typescript
import { render, screen, waitFor } from 'test-setup/utils/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from 'test-setup/mocks/server'
import { WorkflowList } from '../workflow-list'

describe('WorkflowList', () => {
  it('should display workflows from API', async () => {
    // Mock successful API response
    server.use(
      http.get('/api/workflows', () => {
        return HttpResponse.json([
          { id: '1', name: 'Workflow 1' },
          { id: '2', name: 'Workflow 2' },
        ])
      })
    )

    render(<WorkflowList />)

    await waitFor(() => {
      expect(screen.getByText('Workflow 1')).toBeInTheDocument()
      expect(screen.getByText('Workflow 2')).toBeInTheDocument()
    })
  })

  it('should handle API errors', async () => {
    // Mock API error
    server.use(
      http.get('/api/workflows', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )

    render(<WorkflowList />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

---

## Test Organization

### Directory Structure

```
topflow/
├── test-setup/               # Test configuration and utilities
│   ├── mocks/
│   │   ├── handlers.ts      # MSW request handlers
│   │   └── server.ts        # MSW server setup
│   └── utils/
│       └── test-utils.tsx   # Custom render, utilities
├── app/
│   └── __tests__/           # App Router tests
├── components/
│   ├── button.tsx
│   └── button.test.tsx      # Co-located component tests
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts    # Library function tests
├── hooks/
│   └── __tests__/
├── jest.config.js           # Jest configuration
└── jest.setup.js            # Jest setup file
```

### Test Categories

**Unit Tests** (`lib/__tests__/`, `hooks/__tests__/`):
- Pure functions
- Utilities
- Hooks (with `renderHook`)
- Business logic

**Component Tests** (`components/**/*.test.tsx`):
- UI components
- User interactions
- Props validation
- Rendering logic

**Integration Tests** (`app/__tests__/`):
- API routes
- Page components
- Full workflows
- State management

---

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ BAD: Testing implementation details
it('should call useState with initial value', () => {
  const spy = jest.spyOn(React, 'useState')
  render(<Component />)
  expect(spy).toHaveBeenCalledWith(initialValue)
})

// ✅ GOOD: Testing user-visible behavior
it('should display initial value', () => {
  render(<Component />)
  expect(screen.getByText(initialValue)).toBeInTheDocument()
})
```

### 2. Use Accessible Queries

```typescript
// ❌ BAD: Over-reliance on data-testid
screen.getByTestId('submit-button')

// ✅ GOOD: Use accessible queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByText(/welcome/i)
```

### 3. Keep Tests Independent

```typescript
// ❌ BAD: Tests depend on each other
describe('Counter', () => {
  let count = 0

  it('starts at 0', () => {
    expect(count).toBe(0)
  })

  it('increments', () => {
    count++
    expect(count).toBe(1)
  })
})

// ✅ GOOD: Each test is independent
describe('Counter', () => {
  it('starts at 0', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments when button clicked', () => {
    render(<Counter />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
```

### 4. Use Descriptive Test Names

```typescript
// ❌ BAD: Vague test name
it('works', () => { /* ... */ })

// ✅ GOOD: Descriptive test name
it('should display error message when email is invalid', () => {
  /* ... */
})
```

### 5. Follow AAA Pattern

```typescript
it('should update count when button is clicked', () => {
  // Arrange
  render(<Counter initialCount={0} />)

  // Act
  fireEvent.click(screen.getByRole('button', { name: /increment/i }))

  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 6. Test Edge Cases

```typescript
describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero')
  })

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })

  it('should handle decimals', () => {
    expect(divide(5, 2)).toBe(2.5)
  })
})
```

---

## Coverage Goals

### Targets vs. what is enforced

Aspirational targets: utilities 95%, hooks 85%, components 75%. What CI actually **enforces** is
narrower and honest — see "Coverage Thresholds" below and `TESTING.md` for current numbers.

### Viewing Coverage

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Set in `jest.config.js` and enforced by `pnpm test:ci` in CI:

- **Security-critical modules** (`lib/security/ssrf.ts`, `rate-limit.ts`, `workflow-graph.ts`,
  `urw.ts`) and `app/api/execute-workflow/route.ts` are held near their current 90–100% coverage,
  so a regression fails the build.
- **Global** is a ratchet floor at today's measured level (~13% for files without their own
  threshold). Raise it as tests land; never lower it to make a PR pass.

---

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests
- Before deployments

### CI Test Command

```bash
pnpm test:ci
```

This runs tests with:
- `--ci` flag (optimized for CI)
- `--coverage` (generates coverage reports)
- `--maxWorkers=2` (limits parallel workers)

---

## Common Issues

### Issue: "Cannot find module"

**Solution**: Check module path aliases in `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
},
```

### Issue: "TextEncoder is not defined"

**Solution**: Already fixed in `jest.setup.js` with polyfills:

```javascript
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
```

### Issue: Tests pass locally but fail in CI

**Solution**: Ensure tests don't depend on:
- Local file system paths
- Environment variables not set in CI
- System time/timezone
- Random data without seeds

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TDD Strategy Guide](../reference/tdd_guideline/tdd-strategy-frontend.md)

---

## Next Steps

1. Write tests for existing utilities and hooks
2. Add component tests for critical UI elements
3. Set up E2E tests with Playwright (future)
4. Integrate coverage reports with CI/CD
5. Document domain-specific testing patterns

---

**Questions?** Open an issue or check the [TDD Strategy Guide](../reference/tdd_guideline/tdd-strategy-frontend.md) for more details.
