import { Easing } from 'react-native';

export const Motion = {
  duration: {
    fast: 100,
    base: 150,
    reveal: 180,
    emphasized: 220,
    enter: 280,
    exit: 220,
  },
  easing: {
    outEase: Easing.out(Easing.ease),
    inEase: Easing.in(Easing.ease),
    outCubic: Easing.out(Easing.cubic),
    inCubic: Easing.in(Easing.cubic),
  },
} as const;

export default Motion;

