// Standalone reanimated mock for tests that use jest.requireActual('react-native-reanimated/mock')
const { View, Text, ScrollView } = require('react-native');

const createAnimatedComponent = (Component) => Component;

const createChainableAnimation = () => {
  const chain = {};
  [
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
  ].forEach((m) => {
    chain[m] = () => createChainableAnimation();
  });
  return chain;
};

module.exports = {
  __esModule: true,
  default: {
    View,
    Text,
    ScrollView,
    createAnimatedComponent,
    addWhitelistedNativeProps: () => {},
  },
  View,
  Text,
  ScrollView,
  createAnimatedComponent,
  addWhitelistedNativeProps: () => {},
  useSharedValue: (initial) => ({ value: initial }),
  useAnimatedStyle: (cb) => cb() || {},
  useDerivedValue: (cb) => ({ value: cb() }),
  useAnimatedScrollHandler: () => ({}),
  useAnimatedGestureHandler: () => ({}),
  useReducedMotion: () => false,
  // Additional hooks/utilities (kept in sync with the global mock in
  // jest.setup.js) so tests that wire reanimated via
  // require('react-native-reanimated/mock') get a complete surface.
  useAnimatedProps: (callback) =>
    typeof callback === 'function' ? callback() : {},
  useAnimatedRef: () => ({ current: null }),
  useAnimatedReaction: () => {},
  useScrollViewOffset: () => ({ value: 0 }),
  useFrameCallback: () => ({ setActive: () => {}, isActive: false }),
  makeMutable: (initial) => ({ value: initial }),
  measure: () => null,
  scrollTo: () => {},
  getUseOfValueInStyleWarning: () => '',
  ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
  ReducedMotionConfig: () => null,
  withTiming: (value) => value,
  withSpring: (value) => value,
  withDelay: (delay, value) => value,
  withRepeat: (value) => value,
  withSequence: (...values) => values[values.length - 1],
  cancelAnimation: () => {},
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  interpolate: (value, inputRange, outputRange) => {
    if (value <= inputRange[0]) return outputRange[0];
    if (value >= inputRange[inputRange.length - 1])
      return outputRange[outputRange.length - 1];
    let result = outputRange[0];
    inputRange.slice(0, -1).forEach((_, i) => {
      if (value >= inputRange[i] && value <= inputRange[i + 1]) {
        const ratio =
          (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
        result = outputRange[i] + ratio * (outputRange[i + 1] - outputRange[i]);
      }
    });
    return result;
  },
  interpolateColor: (value, inputRange, outputRange) =>
    outputRange[Math.round(value)],
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  Easing: {
    linear: (t) => t,
    ease: (t) => t,
    quad: (t) => t,
    cubic: (t) => t,
    elastic: () => (t) => t,
    bezier: () => (t) => t,
    circle: (t) => t,
    back: (t) => t,
    bounce: (t) => t,
    poly: () => (t) => t,
    sin: (t) => t,
    exp: (t) => t,
    in: (e) => e,
    out: (e) => e,
    inOut: (e) => e,
  },
  FadeIn: createChainableAnimation(),
  FadeInDown: createChainableAnimation(),
  FadeInUp: createChainableAnimation(),
  FadeInLeft: createChainableAnimation(),
  FadeInRight: createChainableAnimation(),
  FadeOut: createChainableAnimation(),
  FadeOutDown: createChainableAnimation(),
  FadeOutUp: createChainableAnimation(),
  FadeOutLeft: createChainableAnimation(),
  FadeOutRight: createChainableAnimation(),
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
  LinearTransition: createChainableAnimation(),
  Layout: createChainableAnimation(),
  SequencedTransition: createChainableAnimation(),
};
