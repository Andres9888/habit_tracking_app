// DIAGNOSTIC: capture which NativeEventEmitter call is failing.
// REMOVE THIS BLOCK ONCE THE ISSUE IS IDENTIFIED.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _RN = require('react-native');
const _OrigNEE = _RN.NativeEventEmitter;
class _PatchedNEE extends _OrigNEE {
  constructor(nativeModule: object | null | undefined, ...rest: unknown[]) {
    if (nativeModule == null) {
      const stack = new Error('NEE-NULL-DIAG').stack;
      console.warn(
        '[DIAG] new NativeEventEmitter() called with null/undefined.\n' +
          'Stack:\n' +
          stack
      );
    }
    super(nativeModule as object, ...rest);
  }
}
Object.defineProperty(_RN, 'NativeEventEmitter', {
  configurable: true,
  value: _PatchedNEE,
  writable: true,
});

// Expo expects gesture/animation runtimes to initialize before app registration.
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';

import App from './src/App';

registerRootComponent(App);
