const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],

  // Coverage reporters
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Summary in console
    'lcov',          // For CI tools
    'html',          // HTML report for local viewing
    'json-summary',  // JSON summary for badges/tools
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage thresholds (aligned with TDD strategy doc)
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75,
    },
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ignore e2e tests (run with Playwright separately)
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/e2e/',
  ],
}

// ESM-only packages that must be transformed by babel-jest. next/jest prepends its own
// transformIgnorePatterns (which skip all of node_modules), so they are replaced after
// the Next config resolves. `(\\.pnpm/)?` + `[+/]` match pnpm store paths
// (`.pnpm/<scope>+<name>@<ver>/node_modules/<scope>/<name>`).
const ESM_PACKAGES = ['@upstash[+/]redis', '@charliesu[+/]workflow-core']

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)()
  config.transformIgnorePatterns = [
    `/node_modules/(?!(\\.pnpm/)?(${ESM_PACKAGES.join('|')}))`,
    '^.+\\.module\\.(css|sass|scss)$',
  ]
  return config
}
