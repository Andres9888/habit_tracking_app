/**
 * Metro resolver stub for `react-native-purchases/dist/browser/nativeModule`.
 *
 * Why this exists: `react-native-purchases/dist/purchases.js` unconditionally
 * does `require('./browser/nativeModule')` at module scope, and that module
 * requires `@revenuecat/purchases-js-hybrid-mappings` — a ~689KB web-only
 * RevenueCat Billing implementation. The browser module is only ever *used*
 * when `shouldUseBrowserMode()` is true (web, Expo Go, Rork sandbox); on a
 * native build the real native module is used instead.
 *
 * Metro does not tree-shake, so the static require drags the whole web SDK
 * into every native bundle for code that can never run there.
 *
 * Wired up in `metro.config.cjs` via `resolver.resolveRequest`, for
 * `platform !== 'web'` only. Web keeps resolving the real module, so browser
 * mode is unaffected.
 *
 * Every method rejects with a clear message rather than failing silently, so
 * that if browser mode is ever reached on native the failure is obvious.
 */

const UNAVAILABLE_MESSAGE =
  '[revenueCatBrowserNativeModuleStub] RevenueCat browser mode is not available ' +
  'in native builds. The web-only `@revenuecat/purchases-js-hybrid-mappings` ' +
  'implementation is stubbed out in metro.config.cjs to keep ~689KB of dead ' +
  'code out of the native bundle. If this app now needs browser mode on ' +
  'native (e.g. Expo Go), remove the stub mapping from metro.config.cjs.';

function unavailable() {
  return Promise.reject(new Error(UNAVAILABLE_MESSAGE));
}

/**
 * Any property read off the stub returns the same rejecting function, so the
 * shape matches whatever `react-native-purchases` expects without having to
 * enumerate its (large, version-churning) method list.
 */
const browserNativeModuleRNPurchases = new Proxy(
  {},
  {
    get(_target, property) {
      if (property === '__esModule') return false;
      if (property === 'then') return undefined;
      if (typeof property === 'symbol') return undefined;
      return unavailable;
    },
    has() {
      return true;
    },
  }
);

exports.browserNativeModuleRNPurchases = browserNativeModuleRNPurchases;
Object.defineProperty(exports, '__esModule', { value: true });
