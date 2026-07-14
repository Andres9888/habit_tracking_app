/**
 * Additional Jest setup for the whole-app E2E UI scenario suite.
 *
 * The base jest.setup.js mocks Convex, Clerk, reanimated, gesture-handler,
 * notifications, etc. Rendering full *screens* (not isolated components) pulls
 * in several native modules that the base setup leaves unmocked and that throw
 * `requireNativeModule` under jest-expo. We mock them here so real screens can
 * mount headlessly. Scoped to this suite via jest.scenarios.config.cjs so the
 * existing test suite is unaffected.
 */

const React = require('react');
const { View, Text } = require('react-native');

const mockPassthroughView = (testID) =>
  function MockView(props) {
    return React.createElement(View, { testID, ...props }, props.children);
  };

// Visual wrappers -> plain Views (children must still render)
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: mockPassthroughView('linear-gradient'),
}));
jest.mock('expo-blur', () => ({
  BlurView: mockPassthroughView('blur-view'),
}));
jest.mock('expo-image', () => ({
  Image: mockPassthroughView('expo-image'),
}));

// Audio (completion sounds)
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(async () => ({
        sound: {
          playAsync: jest.fn(async () => {}),
          unloadAsync: jest.fn(async () => {}),
          setPositionAsync: jest.fn(async () => {}),
          replayAsync: jest.fn(async () => {}),
        },
      })),
    },
    setAudioModeAsync: jest.fn(async () => {}),
  },
  InterruptionModeIOS: { DoNotMix: 0, DuckOthers: 1, MixWithOthers: 2 },
  InterruptionModeAndroid: { DoNotMix: 1, DuckOthers: 2 },
}));

// Confetti / celebration
jest.mock('react-native-confetti-cannon', () => ({
  __esModule: true,
  default: () => null,
}));

// Date picker
jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: mockPassthroughView('datetime-picker'),
}));

// Screenshot / share / store review
jest.mock('react-native-view-shot', () => ({
  __esModule: true,
  default: mockPassthroughView('view-shot'),
  captureRef: jest.fn(async () => 'file://mock.png'),
  ViewShot: mockPassthroughView('view-shot'),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => {}),
}));
jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(async () => true),
  requestReview: jest.fn(async () => {}),
  hasAction: jest.fn(async () => true),
}));

// Image picking / manipulation
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: true,
    assets: [],
  })),
  launchCameraAsync: jest.fn(async () => ({ canceled: true, assets: [] })),
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestCameraPermissionsAsync: jest.fn(async () => ({ granted: true })),
  MediaTypeOptions: { Images: 'Images' },
}));
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(async () => ({
    uri: 'file://mock.png',
    width: 100,
    height: 100,
  })),
  SaveFormat: { JPEG: 'jpeg', PNG: 'png' },
}));

// Charts (Analytics). victory-native v41 uses function-child render props on
// CartesianChart (`{({ points }) => ...}`) and an object API for Pie (Pie.Chart).
jest.mock('victory-native', () => {
  const R = require('react');
  const RNView = require('react-native').View;
  const emptyPoints = new Proxy({}, { get: () => [] });
  const CartesianChart = ({ children }) =>
    R.createElement(
      RNView,
      { testID: 'cartesian-chart' },
      typeof children === 'function'
        ? children({ points: emptyPoints })
        : children
    );
  const PolarChart = ({ children }) =>
    R.createElement(RNView, { testID: 'polar-chart' }, children);
  const Pie = {
    Chart: mockPassthroughView('pie-chart'),
    Label: () => null,
    Slice: () => null,
    SliceAngularInset: () => null,
  };
  return {
    CartesianChart,
    PolarChart,
    Pie,
    Line: () => null,
    Bar: () => null,
    Area: () => null,
    Scatter: () => null,
    useChartPressState: () => ({ state: {}, isActive: false }),
    useChartTransformState: () => ({}),
  };
});

// Subscriptions / RevenueCat
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    getOfferings: jest.fn(async () => ({ current: null, all: {} })),
    getCustomerInfo: jest.fn(async () => ({ entitlements: { active: {} } })),
    purchasePackage: jest.fn(async () => ({
      customerInfo: { entitlements: { active: {} } },
    })),
    restorePurchases: jest.fn(async () => ({ entitlements: { active: {} } })),
    addCustomerInfoUpdateListener: jest.fn(),
    setLogLevel: jest.fn(),
    logIn: jest.fn(async () => ({
      customerInfo: { entitlements: { active: {} } },
    })),
  },
  LOG_LEVEL: { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' },
  PURCHASES_ERROR_CODE: {},
}));
// Purchases lib — the real usePremiumData polls isPurchasesAvailable() every
// 500ms (up to 10×), scheduling long-lived timers that leak across tests and
// destabilise later scenarios. Report "available + no entitlement" up front so
// premium resolves synchronously to false with no pending timers.
jest.mock('../../src/lib/purchases', () => ({
  isPurchasesAvailable: () => true,
  initializePurchases: jest.fn(async () => {}),
  identifyUser: jest.fn(async () => {}),
  logoutPurchases: jest.fn(async () => {}),
  Purchases: {
    getCustomerInfo: jest.fn(async () => ({ entitlements: { active: {} } })),
    getOfferings: jest.fn(async () => ({ current: null, all: {} })),
    addCustomerInfoUpdateListener: jest.fn(() => ({ remove: jest.fn() })),
    removeCustomerInfoUpdateListener: jest.fn(),
    purchasePackage: jest.fn(async () => ({
      customerInfo: { entitlements: { active: {} } },
    })),
    restorePurchases: jest.fn(async () => ({ entitlements: { active: {} } })),
  },
}));

// Clerk auth — the base mock omits useAuth, which several providers/screens
// call. Provide a fully signed-in user so screens render past the auth gate.
jest.mock('@clerk/expo', () => ({
  ClerkProvider: ({ children }) => children,
  ClerkLoaded: ({ children }) => children,
  SignedIn: ({ children }) => children,
  SignedOut: () => null,
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'test-user',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user',
    sessionId: 'test-session',
    getToken: jest.fn(async () => 'test-token'),
    signOut: jest.fn(async () => {}),
  }),
  useClerk: () => ({
    signOut: jest.fn(async () => {}),
    user: { id: 'test-user' },
    session: { id: 'test-session' },
  }),
  useSSO: () => ({
    startSSOFlow: jest.fn(async () => ({
      createdSessionId: 'test-session',
      setActive: jest.fn(async () => {}),
    })),
  }),
  useOAuth: () => ({
    startOAuthFlow: jest.fn(async () => ({
      createdSessionId: 'test-session',
      setActive: jest.fn(async () => {}),
    })),
  }),
}));

// Sentry / monitoring
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  withScope: jest.fn((cb) =>
    cb({ setTag: jest.fn(), setContext: jest.fn(), setLevel: jest.fn() })
  ),
  wrap: (c) => c,
  ReactNativeTracing: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({})),
  ErrorBoundary: ({ children }) => children,
  Severity: {},
}));

// The base reanimated mock executes useDerivedValue's callback during React
// render. Several hooks bridge an animated value back to React state via
// `runOnJS(setState)` inside that callback, so the base mock turns them into a
// setState-in-render infinite loop. The real worklet runs on the UI thread
// (never during render), so the faithful mock simply does not invoke it.
// Mutate the already-mocked module: named imports compile to property access
// at the call site, so this override is picked up everywhere.
const reanimated = require('react-native-reanimated');
reanimated.useDerivedValue = () => ({ value: 0 });

// The base convex mock omits useConvex (imperative client), used by some
// modal sections. Provide a no-op client so those surfaces render.
const convexReact = require('convex/react');
convexReact.useConvex = () => ({
  query: jest.fn(async () => undefined),
  mutation: jest.fn(async () => undefined),
  action: jest.fn(async () => undefined),
  watchQuery: jest.fn(() => ({
    onUpdate: jest.fn(() => jest.fn()),
    localQueryResult: () => undefined,
  })),
});

// Keep a reference so this file is not tree-shaken to nothing
module.exports = { Text };
