import projectDirectoryPatterns from './scripts/config/project-directory-patterns.cjs';

const { createJestRootPatterns } = projectDirectoryPatterns;
const projectArtifactIgnorePatterns = createJestRootPatterns();

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
    '^reanimated-color-picker$':
      '<rootDir>/__mocks__/reanimated-color-picker.js',
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
    ...projectArtifactIgnorePatterns,
    '/__tests__/.*\\.snap$',
    '/tests/.*\\.snap$',
    '/tests/e2e/',
    '\\.e2e\\.test\\.',
    '\\.cue\\.test\\.',
    '/__tests__/home-page-redesign\\.test\\.',
    '/tests/integration/features/home-page-redesign\\.test\\.',
    '/tests/integration/features/swipe-archive-integration\\.test\\.',
  ],
  modulePathIgnorePatterns: projectArtifactIgnorePatterns,
  watchPathIgnorePatterns: projectArtifactIgnorePatterns,
};
