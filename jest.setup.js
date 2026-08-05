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
// expo-status-bar may not be installed; safe to skip
try {
  require.resolve('expo-status-bar');
  jest.mock('expo-status-bar', () => ({
    StatusBar: 'StatusBar',
  }));
} catch {
  // module not installed, no mock needed
}

// Mock expo-network
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(async () => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'WIFI',
  })),
  addNetworkStateListener: jest.fn((cb) => ({
    remove: jest.fn(),
  })),
  NetworkStateType: {
    NONE: 'NONE',
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
    BLUETOOTH: 'BLUETOOTH',
    ETHERNET: 'ETHERNET',
    WIMAX: 'WIMAX',
    VPN: 'VPN',
    OTHER: 'OTHER',
    UNKNOWN: 'UNKNOWN',
  },
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = jest.requireActual('react-native').View;

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
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY',
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  isAvailableAsync: jest.fn(async () => true),
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
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  removeNotificationSubscription: jest.fn(),
  getLastNotificationResponseAsync: jest.fn(async () => null),
  dismissAllNotificationsAsync: jest.fn(async () => {}),
}));

// Mock react-native-calendars (may not be installed)
try {
  require.resolve('react-native-calendars');
  jest.mock('react-native-calendars', () => ({
    Calendar: 'Calendar',
  }));
} catch {
  // module not installed, no mock needed
}

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  // Alias createElement: the css-interop babel plugin rewrites bare
  // React.createElement into a top-level import, which jest.mock forbids.
  const { createElement } = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');

  const createMockIcon = (name) => {
    return function MockIcon(props) {
      return createElement(View, {
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
  const { View, Text, ScrollView, Pressable } = jest.requireActual('react-native');

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
    makeMutable: (initial) => ({ value: initial }),
    getUseOfValueInStyleWarning: () => '',
    ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
    ReducedMotionConfig: () => null,
    useAnimatedRef: () => ({ current: null }),
    useAnimatedReaction: jest.fn(),
    useScrollViewOffset: () => ({ value: 0 }),
    measure: () => null,
    scrollTo: jest.fn(),
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
    ...(() => {
      // Create a chainable animation mock that supports any method chain
      const createChainableAnimation = () => {
        const chain = {};
        const methods = [
          'delay',
          'duration',
          'springify',
          'damping',
          'stiffness',
          'mass',
          'withInitialValues',
          'withCallback',
          'easing',
          'randomDelay',
          'reduceMotion',
          'build',
        ];
        methods.forEach((m) => {
          chain[m] = jest.fn(() => createChainableAnimation());
        });
        return chain;
      };
      return {
        FadeIn: createChainableAnimation(),
        FadeInDown: createChainableAnimation(),
        FadeInUp: createChainableAnimation(),
        FadeOut: createChainableAnimation(),
        FadeOutDown: createChainableAnimation(),
        FadeOutUp: createChainableAnimation(),
        FadeOutLeft: createChainableAnimation(),
        FadeOutRight: createChainableAnimation(),
        FadeInLeft: createChainableAnimation(),
        FadeInRight: createChainableAnimation(),
        SlideInRight: createChainableAnimation(),
        SlideOutLeft: createChainableAnimation(),
        SlideInLeft: createChainableAnimation(),
        SlideOutRight: createChainableAnimation(),
        SlideInDown: createChainableAnimation(),
        SlideInUp: createChainableAnimation(),
        SlideOutDown: createChainableAnimation(),
        SlideOutUp: createChainableAnimation(),
        ZoomIn: createChainableAnimation(),
        ZoomOut: createChainableAnimation(),
        BounceIn: createChainableAnimation(),
        BounceOut: createChainableAnimation(),
        StretchInX: createChainableAnimation(),
        StretchOutX: createChainableAnimation(),
      };
    })(),

    // Layout animations
    ...(() => {
      const createChainableLayout = () => {
        const chain = {};
        [
          'springify',
          'damping',
          'stiffness',
          'mass',
          'duration',
          'delay',
          'easing',
          'withInitialValues',
          'withCallback',
          'reduceMotion',
        ].forEach((m) => {
          chain[m] = jest.fn(() => createChainableLayout());
        });
        return chain;
      };
      return {
        LinearTransition: createChainableLayout(),
        Layout: createChainableLayout(),
        SequencedTransition: createChainableLayout(),
        FadingTransition: createChainableLayout(),
        JumpingTransition: createChainableLayout(),
        CurvedTransition: createChainableLayout(),
        EntryExitTransition: createChainableLayout(),
      };
    })(),

    // runOnJS - CRITICAL: Must be defined as a function that executes callbacks
    runOnJS: (fn) => fn,

    // runOnUI - CRITICAL: Add missing runOnUI mock (causes most test failures)
    runOnUI: (fn) => fn,

    // Additional hooks that may be missing
    useDerivedValue: (callback) => ({ value: callback() }),
    useAnimatedProps: (callback) =>
      typeof callback === 'function' ? callback() : {},
    useFrameCallback: () => ({ setActive: jest.fn(), isActive: false }),
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

// Mock reanimated-color-picker (may not be installed)
try {
  require.resolve('reanimated-color-picker');
  jest.mock('reanimated-color-picker', () => {
    const View = jest.requireActual('react-native').View;
    return {
      __esModule: true,
      default: View,
      Panel1: View,
      Panel2: View,
      Panel3: View,
      HueSlider: View,
      OpacitySlider: View,
      Swatches: View,
      Preview: View,
      ColorPicker: View,
    };
  });
} catch {
  // not installed
}

// Mock @shopify/react-native-skia if needed
jest.mock(
  '@shopify/react-native-skia',
  () => ({
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
  }),
  { virtual: true }
);

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
  // createElement aliased for the same css-interop reason as above.
  const { createElement } = jest.requireActual('react');
  const { FlatList } = jest.requireActual('react-native');

  const DraggableFlatList = (props) => {
    // Strip drag-specific props, pass rest to FlatList
    const { data, renderItem, onDragEnd, ...flatListProps } = props;

    return createElement(FlatList, {
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

  const Decorator = ({ children }) => children;

  return {
    __esModule: true,
    default: DraggableFlatList,
    ScaleDecorator: Decorator,
    OpacityDecorator: Decorator,
    ShadowDecorator: Decorator,
    NestableScrollContainer: ({ children }) => children,
    NestableDraggableFlatList: DraggableFlatList,
  };
});
