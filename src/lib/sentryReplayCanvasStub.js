/**
 * Metro resolver stub for `@sentry-internal/replay-canvas` (~14KB).
 *
 * See `src/lib/sentryReplayStub.js` for the full rationale — this is the
 * `<canvas>` companion to Session Replay, re-exported by the `@sentry/browser`
 * production index as `replayCanvasIntegration`. There is no DOM canvas in
 * React Native.
 *
 * Wired up in `metro.config.cjs` via `resolver.resolveRequest` for
 * `platform !== 'web'` only.
 */

exports.replayCanvasIntegration = () => ({
  name: 'ReplayCanvas',
  setupOnce() {},
});
Object.defineProperty(exports, '__esModule', { value: true });
