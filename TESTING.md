# Testing Documentation

![Test Status](https://img.shields.io/badge/tests-603%20passing-brightgreen)
![E2E Tests](https://img.shields.io/badge/e2e-5%20smoke%20tests-blue)
![Coverage](https://img.shields.io/badge/coverage-19%25%20overall%20%C2%B7%2090%25%2B%20security%20core-yellow)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Overview

TopFlow follows Test-Driven Development (TDD) principles to ensure code quality, maintainability, and reliability. We maintain comprehensive test coverage for all critical business logic.

## Quick Start

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci
```

## Test Statistics

| Metric | Value |
|--------|-------|
| **Total Test Suites** | 20 (19 unit/integration + 1 E2E) |
| **Total Tests** | 437 passing (432 unit/integration + 5 E2E) |
| **Test Speed** | ~3.6s (unit/integration), ~5.2s (E2E) |
| **Critical Modules Covered** | 19/19 (100%) |
| **Build Status** | ✅ Passing |

### Coverage by Module

**Phase 1: Core Business Logic**
| Module | Statements | Branches | Functions | Lines | Tests |
|--------|-----------|----------|-----------|-------|-------|
| **lib/utils.ts** | 100% | 100% | 100% | 100% | 6 |
| **lib/storage.ts** | 95.23% | 83.33% | 100% | 93.93% | 21 |
| **lib/workflow-store.ts** | 95% | 80% | 100% | 94.44% | 32 |

**Phase 2: Hooks**
| Module | Tests |
|--------|-------|
| **hooks/use-mobile.ts** | 9 |
| **hooks/use-workflow-validation.ts** | 11 |
| **hooks/use-auto-save.ts** | 12 |
| **hooks/use-keyboard-shortcuts.ts** | 20 |
| **hooks/use-toast.ts** | 22 |

**Phase 3: Components**
| Module | Tests |
|--------|-------|
| **components/auto-save-indicator.tsx** | 14 |
| **components/undo-redo-toolbar.tsx** | 16 |

**Phase 4: Integration (API Routes)**
| Module | Tests |
|--------|-------|
| **app/api/execute-workflow/route.ts** | 17 |
| **app/api/demo-country/route.ts** | 9 |

**Phase 5: E2E Testing (Playwright)**
| Module | Tests | Status |
|--------|-------|--------|
| **e2e/smoke.spec.ts** | 5 | ✅ Passing |
| **e2e/workflow-creation.spec.ts** | 11 | 📋 Needs UI tuning |
| **e2e/template-gallery.spec.ts** | 10 | 📋 Needs UI tuning |
| **e2e/demo-mode.spec.ts** | 8 | 📋 Needs UI tuning |
| **e2e/api-settings.spec.ts** | 8 | 📋 Needs UI tuning |
| **e2e/validation.spec.ts** | 7 | 📋 Needs UI tuning |

**Phase 6: Node Component Tests (React Testing Library)**
| Module | Tests |
|--------|-------|
| **components/nodes/start-node.tsx** | 16 |
| **components/nodes/end-node.tsx** | 28 |
| **components/nodes/text-model-node.tsx** | 43 |
| **components/nodes/prompt-node.tsx** | 34 |
| **components/nodes/javascript-node.tsx** | 38 |
| **components/nodes/conditional-node.tsx** | 40 |
| **components/nodes/http-request-node.tsx** | 44 |
| **Total Node Component Tests** | **243** |

## Test Architecture

### Test Pyramid

```
         /\
        /E2E\       ← Few - Critical user flows
       /------\
      /  Integ \    ← Some - Component + API integration
     /----------\
    /   Unit     \  ← Many - Business logic, utilities, stores
   /--------------\
```

**Current Distribution:**
- 88% Unit Tests (382 tests)
- 11% Integration Tests (50 tests)
- 1% E2E Tests (5 smoke tests passing)

### Testing Stack

- **Jest** 30.2.0 - Test runner and assertion library
- **React Testing Library** 16.3.1 - Component testing
- **MSW** 2.12.7 - API mocking at network level
- **Testing Library User Event** 14.6.1 - User interaction simulation
- **Vitest** 4.0.16 - Alternative test runner with UI
- **Playwright** 1.57.0 - E2E testing framework

## Test Suites

### 1. Utils Tests (`lib/__tests__/utils.test.ts`)

**Purpose**: Test utility functions for className merging

**Coverage**: 100% (6/6 tests passing)

**Tests:**
- ✅ Class name merging
- ✅ Conditional class handling
- ✅ Array input support
- ✅ Tailwind class deduplication
- ✅ Null/undefined handling
- ✅ Empty input handling

```bash
pnpm jest utils.test.ts
```

---

### 2. Storage Tests (`lib/__tests__/storage.test.ts`)

**Purpose**: Test localStorage abstraction layer for workflow persistence

**Coverage**: 95.23% statements (21/21 tests passing)

**Test Categories:**

**Workflow Management:**
- ✅ Save new workflows
- ✅ Update existing workflows (with timestamp)
- ✅ Retrieve workflows by ID
- ✅ List all workflows
- ✅ Delete workflows (with cascading version deletion)
- ✅ SSR safety (window undefined check)

**Version Control:**
- ✅ Save workflow versions
- ✅ Retrieve versions by workflow ID
- ✅ Sort versions (descending)
- ✅ Delete specific versions
- ✅ Version isolation

**Templates:**
- ✅ Include default templates
- ✅ Include public user workflows
- ✅ Exclude private workflows
- ✅ Security template integration

```bash
pnpm jest storage.test.ts
```

---

### 3. Workflow Store Tests (`lib/__tests__/workflow-store.test.ts`)

**Purpose**: Test Zustand state management for undo/redo and workflow state

**Coverage**: 95% statements (32/32 tests passing)

**Test Categories:**

**State Management:**
- ✅ Initial state verification
- ✅ Node updates
- ✅ Edge updates
- ✅ Deep copy verification

**History & Undo/Redo:**
- ✅ History entry creation
- ✅ Undo functionality
- ✅ Redo functionality
- ✅ canUndo/canRedo guards
- ✅ History limit (50 entries max)
- ✅ History branching (future history removal)
- ✅ History clearing

**Save Status:**
- ✅ Save status updates
- ✅ Timestamp tracking
- ✅ Idle state on changes

```bash
pnpm jest workflow-store.test.ts
```

---

## Running Tests

### Development Workflow

**TDD Cycle (Red-Green-Refactor):**

```bash
# 1. Start watch mode
pnpm test:watch

# 2. Write failing test (RED)
# 3. Implement code to pass (GREEN)
# 4. Refactor while keeping tests green (REFACTOR)
```

### CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop`
- All pull requests
- Pre-deployment verification

**CI Command:**
```bash
pnpm test:ci
```

This runs tests with:
- `--ci` flag (optimized for CI)
- `--coverage` (generates coverage reports)
- `--maxWorkers=2` (limits parallel execution)

### Coverage Reports

**Generate HTML coverage report:**
```bash
pnpm test:coverage
open coverage/lcov-report/index.html
```

**View in terminal:**
```bash
pnpm jest --coverage --coverageReporters=text
```

---

## Writing Tests

### File Structure

```
lib/
├── storage.ts
└── __tests__/
    └── storage.test.ts

components/
├── button.tsx
└── button.test.tsx
```

### Test Template

```typescript
import { functionToTest } from '../module'

describe('functionToTest', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something specific', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = functionToTest(input)

    // Assert
    expect(result).toBe('expected')
  })
})
```

### Best Practices

✅ **DO:**
- Test behavior, not implementation
- Use descriptive test names
- Keep tests independent
- Follow AAA pattern (Arrange-Act-Assert)
- Test edge cases
- Use accessible queries (getByRole, getByLabel)

❌ **DON'T:**
- Test implementation details
- Create interdependent tests
- Use data-testid excessively
- Skip edge case testing
- Mock what you don't own

See [docs/development/testing-guide.md](docs/development/testing-guide.md) for detailed guidelines.

---

## Coverage Goals

### Current Coverage (Tested Modules)

| Category | Target | Current (Tested) |
|----------|--------|------------------|
| Utilities | 95% | ✅ 100% |
| Business Logic | 90% | ✅ 95.23% |
| State Management | 90% | ✅ 95% |

### Overall Project Coverage (measured 2026-09-26, 603 tests)

| Metric | Current |
|--------|--------:|
| Statements | 18.9% |
| Branches | 18.2% |
| Functions | 14.9% |
| Lines | 18.9% |

The security core and execution route are at 90–100% line coverage; the low overall number is
mostly untested UI (`components/ui`, builder page, docs pages).

### Enforced thresholds (`jest.config.js`, blocking in CI via `pnpm test:ci`)

Thresholds are set to what is **actually true**, then ratcheted up — never lowered to pass a PR.

| Scope | Statements | Branches | Functions | Lines |
|-------|-----------:|---------:|----------:|------:|
| `lib/security/ssrf.ts` | 90% | 90% | 100% | 95% |
| `lib/security/rate-limit.ts` | 95% | 85% | 100% | 95% |
| `lib/security/workflow-graph.ts` | 95% | 85% | 100% | 95% |
| `lib/security/urw.ts` | 95% | 60% | 100% | 95% |
| `lib/security/validation-engine.ts` | 95% | 90% | 100% | 95% |
| `lib/security/csp-report.ts` | 95% | 95% | 100% | 95% |
| `lib/conditions/build-expression.ts` | 95% | 95% | 100% | 95% |
| `lib/conditions/sandbox-evaluate.ts` | 95% | 90% | 100% | 95% |
| `lib/conditions/safe-evaluate.ts` | 95% | 90% | 100% | 95% |
| `lib/security/trusted-code.ts` | 95% | 90% | 100% | 95% |
| `app/api/execute-workflow/route.ts` | 90% | 85% | 90% | 95% |
| global floor (all other files) | 13% | 12% | 11% | 13% |

Files with a path-specific threshold are excluded from the global calculation.

### Coverage Roadmap

- ✅ **Phase 1**: Core utilities and business logic
- ✅ **Phase 2**: Hooks and custom React hooks
- ✅ **Phase 3**: Component tests (React Testing Library)
- ✅ **Phase 4**: Integration tests (API Routes)
- ✅ **Phase 5**: E2E infrastructure (Playwright, 5 smoke tests passing)
- ✅ **Phase 6**: Node component tests (243 tests for 7 workflow nodes)

---

## Continuous Integration

### GitHub Actions Workflow

Tests run automatically on every:
- Push to `main` or `develop` branches
- Pull request creation/update
- Pre-deployment hooks

**Workflow file**: `.github/workflows/ci.yml` — lint + type-check → `pnpm test:ci` (tests +
coverage thresholds, blocking) → build. See [docs/development/ci.md](docs/development/ci.md).

---

## Troubleshooting

### Common Issues

**Issue**: Tests failing with "Cannot find module"

**Solution**: Check module path aliases in `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
},
```

---

**Issue**: "TextEncoder is not defined"

**Solution**: Already fixed in `jest.setup.js` with polyfills.

---

**Issue**: Tests pass locally but fail in CI

**Solution**: Ensure tests don't depend on:
- Local environment variables
- System time/timezone
- File system paths
- Random data (use seeds)

---

## Performance Benchmarks

| Operation | Time | Threshold |
|-----------|------|-----------|
| Full test suite | ~0.9s | < 2s |
| Single test file | ~0.7s | < 1s |
| Coverage generation | ~6s | < 10s |
| Build verification | ~8.3s | < 30s |

---

## Contributing

### Before Submitting PRs

1. ✅ All tests must pass: `pnpm test`
2. ✅ Build must succeed: `pnpm build`
3. ✅ Lint must pass: `pnpm lint`
4. ✅ New features require tests
5. ✅ Coverage should not decrease

### Writing New Tests

1. Read [Testing Guide](docs/development/testing-guide.md)
2. Follow existing test patterns
3. Ensure tests are isolated
4. Add edge case coverage
5. Update this documentation if needed

---

## Resources

### Documentation
- [Testing Guide](docs/development/testing-guide.md) - Comprehensive testing guide
- [TDD Strategy](docs/reference/tdd_guideline/tdd-strategy-frontend.md) - TDD methodology
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

### External Resources
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Test Results Archive

### Latest Run

**Date**: January 10, 2026
**Commit**: Latest (Phase 6: Node Component Tests)
**Status**: ✅ All tests passing

**Unit & Integration Tests:**
```
Test Suites: 19 passed, 19 total
Tests:       432 passed, 432 total
Snapshots:   0 total
Time:        3.642 s
```

**E2E Tests (Smoke):**
```
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Time:        5.2 s
Browser:     Chromium
```

**Build Status**: ✅ Passing (8.3s)
- 32 routes generated
- Bundle size: 102 KB (shared chunks)
- No errors or warnings

---

## License

Tests are part of TopFlow and follow the same license as the main project.

---

**Questions or issues?** Please open an issue on GitHub or check the [Testing Guide](docs/development/testing-guide.md).
