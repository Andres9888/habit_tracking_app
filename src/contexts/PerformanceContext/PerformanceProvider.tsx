/**
 * Performance Provider Component
 * Provides performance monitoring capabilities throughout the app.
 */

import React, { useEffect, useMemo } from 'react';
import { PerformanceContext } from './context';
import type { PerformanceConfig, PerformanceProviderProps } from './types';
import { DEFAULT_CONFIG } from './types';
import { createContextCallbacks } from './createContextCallbacks';
import { usePerformanceMonitor } from './usePerformanceMonitor';

export function PerformanceProvider({
  children,
  config: userConfig,
}: PerformanceProviderProps) {
  const config: PerformanceConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...userConfig }),
    [userConfig]
  );

  const monitor = usePerformanceMonitor(config);
  const { startMonitoring, stopMonitoring } = monitor;

  useEffect(() => {
    if (config.enabled) {
      startMonitoring();
    }
    return () => {
      stopMonitoring();
    };
  }, [config.enabled, startMonitoring, stopMonitoring]);

  const value = useMemo(() => createContextCallbacks(monitor), [monitor]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export default PerformanceProvider;
