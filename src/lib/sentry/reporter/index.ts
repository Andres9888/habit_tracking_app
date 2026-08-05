/**
 * Sentry Reporter Module
 */

import type { SentryReporter } from '../types';
import { isSentryInitialized } from '../init/index';
import { createNoOpReporter } from './noOpReporter';
import { createSentryReporter } from './sentryReporter';

/** Get the reporter instance (creates no-op if Sentry not initialized) */
export function getSentryReporter(): SentryReporter {
  if (!isSentryInitialized()) {
    return createNoOpReporter();
  }
  return createSentryReporter();
}

/** Convenience export for direct reporter access */
export const sentryReporter = {
  get instance(): SentryReporter {
    return getSentryReporter();
  },
};

export { createNoOpReporter } from './noOpReporter';
export { createSentryReporter } from './sentryReporter';
