/**
 * Tracked Fetch
 * Wrapper for fetch that automatically tracks network timing.
 */

import type { NetworkMonitor } from './NetworkMonitor';

/** Wrap fetch to automatically track timing */
export function createTrackedFetch(monitor: NetworkMonitor) {
  return async function trackedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const method = init?.method ?? 'GET';
    const requestId = monitor.startRequest(url, method);

    try {
      const response = await fetch(input, init);
      const contentLength = response.headers.get('content-length');
      monitor.endRequest(
        requestId,
        response.status,
        contentLength ? Number.parseInt(contentLength, 10) : undefined
      );
      return response;
    } catch (error) {
      monitor.endRequest(requestId, 0);
      throw error;
    }
  };
}
