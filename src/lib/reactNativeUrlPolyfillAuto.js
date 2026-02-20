import { Platform } from 'react-native';
import { setupURLPolyfill } from 'react-native-url-polyfill';

function canOverwriteGlobalProperty(name) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);

  if (!descriptor) {
    return true;
  }

  // Guard against accessors without setters and non-configurable properties.
  if (!descriptor.configurable) {
    return false;
  }

  if ('writable' in descriptor) {
    return descriptor.writable;
  }

  return typeof descriptor.set === 'function';
}

const globalURL = globalThis.URL;
const isGlobalURLReady =
  typeof globalURL === 'function' &&
  typeof globalThis.URLSearchParams === 'function' &&
  globalURL !== Object;
const globalURLPolyfillToken = Symbol.for('RN_URL_POLYFILL_AUTO_APPLIED');

if (Platform.OS !== 'web') {
  const canOverrideURL =
    canOverwriteGlobalProperty('URL') &&
    canOverwriteGlobalProperty('URLSearchParams');
  const alreadyApplied = globalThis[globalURLPolyfillToken] === true;

  if (!alreadyApplied && (!isGlobalURLReady || canOverrideURL)) {
    try {
      setupURLPolyfill();
      globalThis[globalURLPolyfillToken] = true;
    } catch (_error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          'URL polyfill setup skipped due to non-overwritable global.'
        );
      }
    }
  } else if (!alreadyApplied) {
    // Global URL APIs are already usable; mark as initialized to avoid redundant checks.
    globalThis[globalURLPolyfillToken] = true;
  }
}
