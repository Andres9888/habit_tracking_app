/**
 * Metro resolver stub for `@sentry-internal/feedback` (~47KB).
 *
 * Why this exists: the `@sentry/browser` production index re-exports
 * `getFeedback` / `sendFeedback` from this package, and its `feedbackAsync.js`
 * and `feedbackSync.js` modules additionally import `buildFeedbackIntegration`,
 * `feedbackModalIntegration`, and `feedbackScreenshotIntegration`. All of it is
 * a DOM widget (shadow-root dialog + html2canvas-style screenshotting) that
 * cannot render in React Native.
 *
 * The exported names here were derived from:
 *   grep -rhoE "from '@sentry-internal/feedback'" \
 *     node_modules/@sentry/browser/build/npm/esm/
 * and must stay in sync if `@sentry/browser` is upgraded — a missing name
 * surfaces as an undefined import at bundle time, not a silent failure.
 *
 * Wired up in `metro.config.cjs` via `resolver.resolveRequest` for
 * `platform !== 'web'` only.
 */

function noopIntegrationFactory(name) {
  return () => ({
    name,
    setupOnce() {},
  });
}

// `buildFeedbackIntegration({ ... })` returns an integration *factory*, which
// `@sentry/browser` then exports as feedbackSyncIntegration/feedbackAsyncIntegration.
exports.buildFeedbackIntegration = () => noopIntegrationFactory('Feedback');
exports.feedbackModalIntegration = noopIntegrationFactory('FeedbackModal');
exports.feedbackScreenshotIntegration = noopIntegrationFactory(
  'FeedbackScreenshot'
);
exports.getFeedback = () => undefined;
exports.sendFeedback = () => Promise.resolve('');
Object.defineProperty(exports, '__esModule', { value: true });
