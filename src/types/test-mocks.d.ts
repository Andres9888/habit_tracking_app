/**
 * Type declarations for test mock elements
 *
 * These elements are used in jest mocks for expo-blur, expo-linear-gradient, etc.
 * In React Native with JSX transform, we use ReactNative.JSX namespace.
 */

import type { ViewProps } from 'react-native';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mock-blur-view': ViewProps & { children?: React.ReactNode };
      'mock-linear-gradient': ViewProps & { children?: React.ReactNode };
    }
  }
}

// Duplicate for ReactNative namespace used by some RN setups
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'mock-blur-view': ViewProps & { children?: React.ReactNode };
      'mock-linear-gradient': ViewProps & { children?: React.ReactNode };
    }
  }
}
