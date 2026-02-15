/**
 * Monitor Refs Hook - Creates refs for performance monitor instances.
 */

import { useRef } from 'react';

import type { FrameTimingData } from '../../lib/performance';
import {
  FrameMonitor,
  MemoryMonitor,
  NetworkMonitor,
  PerformanceTimer,
  RenderTracker,
} from '../../lib/performance';

/**
 * Generates a unique session ID for performance monitoring sessions.
 * @returns Unique session identifier in format 'perf_{timestamp}_{random}'
 */
const generateSessionId = () =>
  `perf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

/**
 * Creates and manages refs for all performance monitoring instances.
 * 
 * Provides refs for frame monitoring, memory tracking, network monitoring,
 * render tracking, and performance timing.
 * 
 * @returns Object containing all monitor refs and callback ref
 */
export function useMonitorRefs() {
  const sessionIdRef = useRef(generateSessionId());
  const timerRef = useRef(new PerformanceTimer());
  const frameMonitorRef = useRef<FrameMonitor | null>(null);
  const memoryMonitorRef = useRef(new MemoryMonitor());
  const renderTrackerRef = useRef(new RenderTracker());
  const networkMonitorRef = useRef(new NetworkMonitor());
  const frameCallbacksRef = useRef(new Set<(data: FrameTimingData) => void>());

  return {
    frameCallbacksRef,
    frameMonitorRef,
    memoryMonitorRef,
    networkMonitorRef,
    renderTrackerRef,
    sessionIdRef,
    timerRef,
  };
}

export { generateSessionId };
