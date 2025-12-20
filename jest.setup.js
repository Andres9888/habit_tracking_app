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

  // Mock gesture builder for Gesture.Pan() etc.
  const createMockGesture = () => ({
    activeOffsetX: jest.fn().mockReturnThis(),
    activeOffsetY: jest.fn().mockReturnThis(),
    failOffsetX: jest.fn().mockReturnThis(),
    failOffsetY: jest.fn().mockReturnThis(),
    onBegin: jest.fn().mockReturnThis(),
    onStart: jest.fn().mockReturnThis(),
    onUpdate: jest.fn().mockReturnThis(),
    onEnd: jest.fn().mockReturnThis(),
    onFinalize: jest.fn().mockReturnThis(),
    enabled: jest.fn().mockReturnThis(),
    minDistance: jest.fn().mockReturnThis(),
    minVelocity: jest.fn().mockReturnThis(),
    runOnJS: jest.fn().mockReturnThis(),
    withRef: jest.fn().mockReturnThis(),
  });

  return {
    Swipeable: View,
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Gesture: {
      Pan: () => createMockGesture(),
      Tap: () => createMockGesture(),
      LongPress: () => createMockGesture(),
      Pinch: () => createMockGesture(),
      Rotation: () => createMockGesture(),
      Fling: () => createMockGesture(),
      Race: (...gestures) => createMockGesture(),
      Simultaneous: (...gestures) => createMockGesture(),
      Exclusive: (...gestures) => createMockGesture(),
    },
    GestureDetector: ({ children }) => children,
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

// Mock expo-notifications (used by reminders)
jest.mock('expo-notifications', () => ({
  AndroidImportance: {
    HIGH: 4,
  },
  AuthorizationStatus: {
    GRANTED: 2,
  },
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
    DATE: 'date',
    MONTHLY: 'monthly',
    TIME_INTERVAL: 'timeInterval',
    WEEKLY: 'weekly',
  },
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(async () => []),
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
  scheduleNotificationAsync: jest.fn(async () => 'mock-notification-id'),
  setNotificationChannelAsync: jest.fn(async () => null),
  setNotificationHandler: jest.fn(),
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
        ...props,
      });
    };
  };

  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === '__esModule') {
          return true;
        }
        return createMockIcon(String(prop));
      },
    }
  );
});

// Mock NativeWind className support in tests
// NativeWind v4 uses className prop which needs Metro bundler
// For tests, we pass className through so tests can verify it
jest.mock(
  'nativewind',
  () => ({
    styled: (Component) => Component,
  }),
  { virtual: true }
);

// Mock global.css import
jest.mock('../global.css', () => ({}), { virtual: true });

// Mock clsx for className combining
jest.mock('clsx', () => {
  return function clsx(...args) {
    return args.flat().filter(Boolean).join(' ').trim();
  };
});
