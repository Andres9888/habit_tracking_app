/**
 * useMemoryMonitor Hook - Monitor memory usage during component lifetime.
 */

import { useCallback, useEffect, useState } from 'react';

import { MemoryMonitor } from '../../lib/performance';
import { usePerformance } from './usePerformance';

interface MemoryStats {
  currentUsage: number | null;
  formattedUsage: string;
  growth: number | null;
  isSupported: boolean;
}
interface MemoryMonitorOptions {
  interval?: number;
  onHighMemory?: (usage: number) => void;
  threshold?: number;
}

const DEFAULT_THRESHOLD = 150 * 1024 * 1024; // 150MB
const DEFAULT_INTERVAL = 5000;

/**
 * Hook to monitor memory usage during component lifetime. Detects potential memory leaks.
 * @example
 * ```tsx
 * function DataHeavyComponent() {
 *   const { formattedUsage, growth } = useMemoryMonitor({ onHighMemory: (usage) => console.warn(`High memory: ${usage}`) });
 *   return <View><Text>Memory: {formattedUsage}</Text>{growth && growth > 0 && <Text>Growth: +{growth} bytes</Text>}</View>;
 * }
 * ```
 */
export function useMemoryMonitor(
  options: MemoryMonitorOptions = {}
): MemoryStats {
  const {
    interval = DEFAULT_INTERVAL,
    onHighMemory,
    threshold = DEFAULT_THRESHOLD,
  } = options;
  const { getMemoryUsage } = usePerformance();
  const isSupported = MemoryMonitor.isSupported();
  const [stats, setStats] = useState<MemoryStats>({
    currentUsage: null,
    formattedUsage: 'N/A',
    growth: null,
    isSupported,
  });
  const [initialUsage] = useState<number | null>(() => getMemoryUsage());

  const updateMemoryStats = useCallback(() => {
    const currentUsage = getMemoryUsage();
    if (currentUsage !== null) {
      const growth = initialUsage === null ? null : currentUsage - initialUsage;
      if (currentUsage > threshold && onHighMemory) {
        onHighMemory(currentUsage);
      }
      setStats({
        currentUsage,
        formattedUsage: MemoryMonitor.formatBytes(currentUsage),
        growth,
        isSupported: true,
      });
    }
  }, [getMemoryUsage, initialUsage, threshold, onHighMemory]);

  useEffect(() => {
    if (!isSupported) return;
    updateMemoryStats();
    const intervalId = setInterval(updateMemoryStats, interval);
    return () => clearInterval(intervalId);
  }, [isSupported, updateMemoryStats, interval]);

  return stats;
}
