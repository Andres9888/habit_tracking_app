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
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
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

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, ScrollView, Pressable } = require('react-native');

  // Create passthrough Animated components
  const AnimatedView = View;
  const AnimatedText = Text;
  const AnimatedScrollView = ScrollView;

  // For createAnimatedComponent
  const createAnimatedComponent = (Component) => {
    return Component;
  };

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      Text: AnimatedText,
      ScrollView: AnimatedScrollView,
      createAnimatedComponent,
      addWhitelistedNativeProps: jest.fn(),
    },

    // Also export as named
    View: AnimatedView,
    Text: AnimatedText,
    ScrollView: AnimatedScrollView,
    createAnimatedComponent,
    addWhitelistedNativeProps: jest.fn(),

    // Animation functions
    useSharedValue: (initial) => ({ value: initial }),
    useAnimatedStyle: (cb) => {
      const style = cb();
      return style || {};
    },
    withTiming: (value) => value,
    withSpring: (value) => value,
    withDelay: (delay, value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[values.length - 1],
    cancelAnimation: jest.fn(),
    Easing: {
      linear: (t) => t,
      ease: (t) => t,
      quad: (t) => t,
      cubic: (t) => t,
      elastic: (bounciness) => (t) => t,
      bezier: () => (t) => t,
      circle: (t) => t,
      back: (t) => t,
      bounce: (t) => t,
      poly: (n) => (t) => t,
      sin: (t) => t,
      exp: (t) => t,
      in: (easing) => easing,
      out: (easing) => easing,
      inOut: (easing) => easing,
    },

    // Entering/Exiting animations
    FadeIn: {
      delay: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
    },
    FadeInDown: {
      delay: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
    },
    FadeOut: {
      delay: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
    },
    SlideInRight: {
      duration: jest.fn().mockReturnThis(),
    },
    SlideOutLeft: {
      duration: jest.fn().mockReturnThis(),
    },
    SlideInLeft: {
      duration: jest.fn().mockReturnThis(),
    },
    SlideOutRight: {
      duration: jest.fn().mockReturnThis(),
    },

    // Layout animations
    LinearTransition: {
      springify: jest.fn(() => ({
        damping: jest.fn().mockReturnThis(),
        stiffness: jest.fn().mockReturnThis(),
        mass: jest.fn().mockReturnThis(),
      })),
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
    },
    Layout: {
      springify: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
    },

    // runOnJS - CRITICAL: Must be defined as a function that executes callbacks
    runOnJS: (fn) => fn,

    // runOnUI - CRITICAL: Add missing runOnUI mock (causes most test failures)
    runOnUI: (fn) => fn,

    // Additional hooks that may be missing
    useDerivedValue: (callback) => ({ value: callback() }),
    useAnimatedScrollHandler: () => ({}),
    useAnimatedGestureHandler: () => ({}),
    useReducedMotion: () => false,
    interpolateColor: (value, inputRange, outputRange) => outputRange[Math.round(value)],
  };
});

// Mock @shopify/react-native-skia if needed
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Path: 'Path',
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        close: jest.fn(),
      })),
    },
  },
}));

// Mock react-native-draggable-flatlist
jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');

  const DraggableFlatList = (props) => {
    // Strip drag-specific props, pass rest to FlatList
    const { data, renderItem, onDragEnd, ...flatListProps } = props;

    return React.createElement(FlatList, {
      data,
      renderItem: ({ item, index }) => {
        // Provide mock drag handlers
        return renderItem({
          item,
          index,
          drag: jest.fn(),
          isActive: false,
          getIndex: () => index,
        });
      },
      ...flatListProps,
    });
  };

  return {
    __esModule: true,
    default: DraggableFlatList,
  };
});
