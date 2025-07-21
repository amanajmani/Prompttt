const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/', // Exclude Playwright e2e tests
    // Ignore setup files from being treated as test suites
    '.*/setup\\.(ts|tsx|js)$',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/setup.ts', // Exclude setup files from coverage
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock problematic ESM modules
    '^jose$': '<rootDir>/src/__mocks__/jose.js',
    '^isows$': '<rootDir>/src/__mocks__/isows.js',
    '^ws$': '<rootDir>/src/__mocks__/ws.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jose|@supabase|@panva|@auth|uuid|isows|ws)/)',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
