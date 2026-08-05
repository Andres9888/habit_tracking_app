export default {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@clerk/clerk-expo|date-fns|lucide-react-native)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/tests/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '^react-native-reanimated/mock$':
      '<rootDir>/__mocks__/react-native-reanimated-mock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/*.d.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    // Device-driven E2E specs are not part of the unit Jest project.
    // The supported device boundary is Maestro (see tests/e2e/README.md).
    '<rootDir>/tests/e2e/.*\\.e2e\\.test\\.tsx$',
    '/worktrees/',
    '/\\.worktrees/',
    '/\\.next/',
    '<rootDir>/worktrees/',
    '<rootDir>/.worktrees/',
    '<rootDir>/website/.next/',
    '/__tests__/.*\\.snap$',
    '/tests/.*\\.snap$',
  ],
  modulePathIgnorePatterns: [
    '/worktrees/',
    '/\\.worktrees/',
    '/\\.next/',
    '<rootDir>/worktrees/',
    '<rootDir>/.worktrees/',
    '<rootDir>/website/.next/',
  ],
  watchPathIgnorePatterns: [
    '/worktrees/',
    '/\\.worktrees/',
    '/\\.next/',
    '<rootDir>/worktrees/',
    '<rootDir>/.worktrees/',
    '<rootDir>/website/.next/',
  ],
};
