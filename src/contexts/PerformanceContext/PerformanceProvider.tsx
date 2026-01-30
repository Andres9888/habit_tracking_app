/**
 * Performance Provider Component
 * Provides performance monitoring capabilities throughout the app.
 * Integrates with Sentry for cloud-based performance reporting.
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { PerformanceContext } from './context';
import type { PerformanceConfig, PerformanceProviderProps } from './types';
import { DEFAULT_CONFIG } from './types';
import { createContextCallbacks } from './createContextCallbacks';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import {
  isSentryEnabled,
  reportFrameIssue,
  createSentryIssueHandler,
} from '../../lib/sentry';

export function PerformanceProvider({
  children,
  config: userConfig,
}: PerformanceProviderProps) {
  // Merge user config with Sentry issue handler if Sentry is enabled
  const sentryIssueHandler = useMemo(
    () => (isSentryEnabled() ? createSentryIssueHandler() : undefined),
    []
  );

  const config: PerformanceConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...userConfig,
      // Chain issue handlers if both exist
      onPerformanceIssue: (issue) => {
        userConfig?.onPerformanceIssue?.(issue);
        sentryIssueHandler?.(issue);
      },
    }),
    [userConfig, sentryIssueHandler]
  );

  const monitor = usePerformanceMonitor(config);
  const { startMonitoring, stopMonitoring } = monitor;

  // Subscribe to frame data for Sentry reporting
  const handleFrameData = useCallback(
    (data: Parameters<typeof reportFrameIssue>[0]) => {
      if (isSentryEnabled()) {
        reportFrameIssue(data);
      }
    },
    []
  );

  useEffect(() => {
    if (config.enabled) {
      startMonitoring();
    }

    // Subscribe to frame data if frame monitoring is enabled
    let unsubscribe: (() => void) | undefined;
    if (config.frameMonitoring && isSentryEnabled()) {
      monitor.frameCallbacksRef.current.add(handleFrameData);
      unsubscribe = () =>
        monitor.frameCallbacksRef.current.delete(handleFrameData);
    }

    return () => {
      stopMonitoring();
      unsubscribe?.();
    };
  }, [
    config.enabled,
    config.frameMonitoring,
    startMonitoring,
    stopMonitoring,
    handleFrameData,
    monitor.frameCallbacksRef,
  ]);

  const value = useMemo(() => createContextCallbacks(monitor), [monitor]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export default PerformanceProvider;
