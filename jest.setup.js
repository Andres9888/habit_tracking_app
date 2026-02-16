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
jest.mock('expo-asset');

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

// Mock expo-av (used by audio recording)
jest.mock('expo-av', () => ({
  Audio: {
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
    Recording: jest.fn(() => ({
      prepareToRecordAsync: jest.fn(),
      startAsync: jest.fn(),
      stopAndUnloadAsync: jest.fn(),
      getURI: jest.fn(() => 'mock-recording-uri'),
      getStatusAsync: jest.fn(async () => ({
        isRecording: false,
        durationMillis: 0,
      })),
    })),
    setAudioModeAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(async () => ({
      granted: true,
      status: 'granted',
    })),
    getPermissionsAsync: jest.fn(async () => ({
      granted: true,
      status: 'granted',
    })),
  },
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

    // Entering/Exiting animations - Create chainable animation builder
    FadeIn: (() => {
      const animation = {
        delay: jest.fn().mockReturnValue(animation),
        duration: jest.fn().mockReturnValue(animation),
        springify: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
        stiffness: jest.fn().mockReturnValue(animation),
        mass: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),
    FadeInDown: (() => {
      const animation = {
        delay: jest.fn().mockReturnValue(animation),
        duration: jest.fn().mockReturnValue(animation),
        springify: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
        stiffness: jest.fn().mockReturnValue(animation),
        mass: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),
    FadeOut: (() => {
      const animation = {
        delay: jest.fn().mockReturnValue(animation),
        duration: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),
    SlideInRight: (() => {
      const animation = {
        duration: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),
    SlideOutLeft: (() => {
      const animation = {
        duration: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),
    SlideInLeft: (() => {
      const animation = {
        duration: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),
    SlideOutRight: (() => {
      const animation = {
        duration: jest.fn().mockReturnValue(animation),
        damping: jest.fn().mockReturnValue(animation),
      };
      return animation;
    })(),

    // Layout animations - Make fully chainable
    LinearTransition: (() => {
      const transition = {
        springify: jest.fn().mockReturnValue(transition),
        damping: jest.fn().mockReturnValue(transition),
        stiffness: jest.fn().mockReturnValue(transition),
        mass: jest.fn().mockReturnValue(transition),
        duration: jest.fn().mockReturnValue(transition),
        delay: jest.fn().mockReturnValue(transition),
        easing: jest.fn().mockReturnValue(transition),
      };
      return transition;
    })(),
    Layout: (() => {
      const layout = {
        springify: jest.fn().mockReturnValue(layout),
        damping: jest.fn().mockReturnValue(layout),
        stiffness: jest.fn().mockReturnValue(layout),
        mass: jest.fn().mockReturnValue(layout),
        duration: jest.fn().mockReturnValue(layout),
        delay: jest.fn().mockReturnValue(layout),
        easing: jest.fn().mockReturnValue(layout),
      };
      return layout;
    })(),

    // runOnJS - CRITICAL: Must be defined as a function that executes callbacks
    runOnJS: (fn) => fn,

    // runOnUI - CRITICAL: Add missing runOnUI mock (causes most test failures)
    runOnUI: (fn) => fn,

    // Additional hooks that may be missing
    useDerivedValue: (callback) => ({ value: callback() }),
    useAnimatedScrollHandler: () => ({}),
    useAnimatedGestureHandler: () => ({}),
    useReducedMotion: () => false,
    interpolateColor: (value, inputRange, outputRange) =>
      outputRange[Math.round(value)],

    // Interpolate function (used by ParticleBurst, ChainLinkAnimation)
    interpolate: (value, inputRange, outputRange, extrapolation) => {
      // Simple linear interpolation for testing
      // extrapolation parameter is ignored in tests (CLAMP/EXTEND/etc)
      if (value <= inputRange[0]) return outputRange[0];
      if (value >= inputRange[inputRange.length - 1])
        return outputRange[outputRange.length - 1];
      // Find the appropriate segment
      for (let i = 0; i < inputRange.length - 1; i++) {
        if (value >= inputRange[i] && value <= inputRange[i + 1]) {
          const ratio =
            (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
          return outputRange[i] + ratio * (outputRange[i + 1] - outputRange[i]);
        }
      }
      return outputRange[0];
    },

    // Extrapolation constants (T014 ChainLinkAnimation)
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },

    // Extrapolate (deprecated, but still used in some animations)
    Extrapolate: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
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

// Mock @react-native-community/netinfo (virtual module - not installed)
jest.mock(
  '@react-native-community/netinfo',
  () => ({
    fetch: jest.fn(() =>
      Promise.resolve({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
        details: { isConnectionExpensive: false },
      })
    ),
    addEventListener: jest.fn(() => jest.fn()), // Returns unsubscribe function
    NetInfoStateType: {
      unknown: 'unknown',
      none: 'none',
      cellular: 'cellular',
      wifi: 'wifi',
      bluetooth: 'bluetooth',
      ethernet: 'ethernet',
      wimax: 'wimax',
      vpn: 'vpn',
      other: 'other',
    },
  }),
  { virtual: true }
);

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
