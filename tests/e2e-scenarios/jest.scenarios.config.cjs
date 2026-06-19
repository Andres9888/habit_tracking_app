/**
 * Dedicated Jest config for the whole-app E2E UI scenario suite.
 *
 * Mirrors the root jest.config.js but (a) restricts testMatch to this folder
 * and (b) layers an extra setup file that mocks the native modules full screens
 * pull in. Run with: npx jest -c tests/e2e-scenarios/jest.scenarios.config.cjs
 */
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

module.exports = {
  rootDir: root,
  preset: 'jest-expo',
  // jest-expo transforms app code with expo's internal babel preset (bypassing
  // babel.config.cjs). Mirror that transform but layer on a plugin that rewrites
  // dynamic import() -> require() so React.lazy() overlays render under jest.
  transform: {
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$':
      require.resolve('react-native/jest/assetFileTransformer.js'),
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        caller: { name: 'metro', bundler: 'metro', platform: 'ios' },
        configFile: require.resolve('expo/internal/babel-preset.js'),
        babelrc: false,
        plugins: [require.resolve('./dynamic-import-to-require.cjs')],
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@clerk/clerk-expo|date-fns|lucide-react-native)',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/tests/e2e-scenarios/setup.scenarios.js',
  ],
  // Files are named *.scenario.tsx (no `.test.`) so the root jest config — which
  // matches every *.test.tsx — does not pick them up without the extra mocks
  // layered here. Run only via this config (npm run test:scenarios).
  testMatch: ['<rootDir>/tests/e2e-scenarios/**/*.scenario.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '^react-native-reanimated/mock$': '<rootDir>/__mocks__/react-native-reanimated-mock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
