// Built-in matchers are included in @testing-library/react-native v12.4+
// No need for separate extend-expect import

// Mock Expo import meta registry (Expo 54 compatibility)
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
  get: jest.fn(() => ({})),
};

// Polyfill structuredClone for Expo 54
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    Swipeable: View,
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    State: {},
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => []),
  useMutation: jest.fn(() => jest.fn()),
  ConvexProvider: ({ children }) => children,
  ConvexReactClient: jest.fn(),
}));

// Mock Clerk
jest.mock('@clerk/clerk-expo', () => ({
  ClerkProvider: ({ children }) => children,
  ClerkLoaded: ({ children }) => children,
  SignedIn: ({ children }) => children,
  SignedOut: () => null,
  useUser: () => ({ user: { id: 'test-user' } }),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock react-native-calendars
jest.mock('react-native-calendars', () => ({
  Calendar: 'Calendar',
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createMockIcon = (name) => {
    return function MockIcon(props) {
      return React.createElement(View, {
        testID: `lucide-icon-${name}`,
        ...props
      });
    };
  };

  return {
    Link2: createMockIcon('Link2'),
    Settings: createMockIcon('Settings'),
    ChevronLeft: createMockIcon('ChevronLeft'),
    ChevronRight: createMockIcon('ChevronRight'),
    X: createMockIcon('X'),
    Plus: createMockIcon('Plus'),
  };
});

// Mock NativeWind className support in tests
// NativeWind v4 uses className prop which needs Metro bundler
// For tests, we pass className through so tests can verify it
jest.mock('nativewind', () => ({
  styled: (Component) => Component,
}), { virtual: true });

// Mock global.css import
jest.mock('../global.css', () => ({}), { virtual: true });

// Mock clsx for className combining
jest.mock('clsx', () => {
  return function clsx(...args) {
    return args
      .flat()
      .filter(Boolean)
      .join(' ')
      .trim();
  };
});
