/**
 * Metro resolver stub for `@sentry-internal/replay` (~120KB).
 *
 * Why this exists: `@sentry/react-native` re-exports `@sentry/react`, which
 * does `export * from '@sentry/browser'`. The `@sentry/browser` production
 * index statically re-exports `getReplay` and `replayIntegration` from
 * `@sentry-internal/replay` — a DOM Session Replay recorder (rrweb) that
 * cannot run in React Native and that this app never enables.
 *
 * `src/lib/sentry/init/init.ts` registers no browser integrations, so
 * nothing here is ever constructed at runtime on native.
 *
 * Wired up in `metro.config.cjs` via `resolver.resolveRequest` for
 * `platform !== 'web'` only.
 */

function noopIntegration(name) {
  return () => ({
    name,
    setupOnce() {},
  });
}

exports.replayIntegration = noopIntegration('Replay');
exports.getReplay = () => undefined;
Object.defineProperty(exports, '__esModule', { value: true });
