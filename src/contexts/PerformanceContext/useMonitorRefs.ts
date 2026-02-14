/**
 * Monitor Refs Hook - Creates refs for performance monitor instances.
 */
import { useRef, type MutableRefObject } from 'react';
import {
  FrameMonitor,
  MemoryMonitor,
  NetworkMonitor,
  PerformanceTimer,
  RenderTracker,
} from '../../lib/performance';
import type { FrameTimingData } from '../../lib/performance';

const generateSessionId = () =>
  `perf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export interface MonitorRefsReturn {
  frameCallbacksRef: MutableRefObject<Set<(data: FrameTimingData) => void>>;
  frameMonitorRef: MutableRefObject<FrameMonitor | null>;
  memoryMonitorRef: MutableRefObject<MemoryMonitor>;
  networkMonitorRef: MutableRefObject<NetworkMonitor>;
  renderTrackerRef: MutableRefObject<RenderTracker>;
  sessionIdRef: MutableRefObject<string>;
  timerRef: MutableRefObject<PerformanceTimer>;
}

export function useMonitorRefs(): MonitorRefsReturn {
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
