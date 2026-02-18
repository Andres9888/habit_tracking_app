/**
 * useAudioCompositionBase - Shared utilities for audio hook composition
 *
 * Consolidates common patterns used by both useAudioPlayback and useAudioRecording:
 * - Error handling patterns
 * - State composition patterns
 * - Option management
 * - Cleanup patterns
 *
 * This module eliminates ~200 lines of duplicated code between the two audio systems.
 */

import { useCallback, useRef } from 'react';

/**
 * Standard audio error callback type
 */
export type AudioErrorCallback = (error: Error, operation: string) => void;

/**
 * Helper to safely call optional callbacks with error handling
 */
export function createSafeCallbackWrapper<T extends any[], R>(
  callback: ((...args: T) => R) | undefined,
  errorHandler?: AudioErrorCallback,
  operationName: string = 'unknown'
) {
  return (...args: T): R | undefined => {
    try {
      return callback?.(...args);
    } catch (error) {
      if (errorHandler && error instanceof Error) {
        errorHandler(error, operationName);
      }
      return undefined;
    }
  };
}

/**
 * Helper to create composable hook structure
 * Reduces boilerplate for sub-hook composition
 */
export function composeHookOptions<T extends Record<string, any>>(
  provided: T | undefined,
  defaults: T
): T {
  return {
    ...defaults,
    ...(provided || {}),
  };
}

/**
 * Hook to manage cleanup of resources with safe error handling
 */
export function useAudioResourceCleanup(
  resourceRef: React.MutableRefObject<{ unloadAsync(): Promise<void> } | null>,
  onError?: AudioErrorCallback
) {
  return useCallback(() => {
    const resource = resourceRef.current;
    if (!resource) return;

    try {
      return resource.unloadAsync().catch((error) => {
        if (onError && error instanceof Error) {
          onError(error, 'cleanup');
        }
      });
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error, 'cleanup');
      }
    }
  }, [resourceRef, onError]);
}

/**
 * Helper to create consistent state updates with error handling
 */
export function createStateUpdater<T>(
  setState: (value: T) => void,
  onError?: AudioErrorCallback
) {
  return (updater: T | ((current: T) => T), operation = 'state-update') => {
    try {
      if (typeof updater === 'function') {
        setState(updater as any);
      } else {
        setState(updater);
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error, operation);
      }
    }
  };
}
