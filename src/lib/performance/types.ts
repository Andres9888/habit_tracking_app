/** Performance Measurement Types */

export interface PerformanceMark {
  metadata?: Record<string, unknown>;
  name: string;
  timestamp: number;
}

export interface PerformanceMeasure {
  duration: number;
  endMark: string;
  metadata?: Record<string, unknown>;
  name: string;
  startMark: string;
}

export interface FrameTimingData {
  fps: number;
  frameTime: number;
  jankFrames: number;
  timestamp: number;
  totalFrames: number;
}

export interface MemorySnapshot {
  estimated: boolean;
  jsHeapTotal?: number;
  jsHeapUsed?: number;
  native?: number;
  timestamp: number;
}

export interface NetworkTiming {
  duration: number;
  endTime: number;
  method: string;
  size?: number;
  startTime: number;
  status?: number;
  url: string;
}

export interface RenderTiming {
  averageRenderTime: number;
  componentName: string;
  lastRenderTime: number;
  renderCount: number;
  timestamp: number;
  totalRenderTime: number;
}

export interface PerformanceBaseline {
  averageFPS: number;
  averageFrameTime: number;
  memoryUsage: number;
  networkLatency: number;
  timestamp: number;
}

export interface PerformanceReport {
  baseline?: PerformanceBaseline;
  frameData: FrameTimingData[];
  marks: PerformanceMark[];
  measures: PerformanceMeasure[];
  memorySnapshots: MemorySnapshot[];
  networkTimings: NetworkTiming[];
  renderTimings: RenderTiming[];
  sessionDuration: number;
  sessionId: string;
  timestamp: number;
}

export interface PerformanceThresholds {
  maxFrameTime: number;
  maxMemoryUsage: number;
  maxNetworkLatency: number;
  maxRenderTime: number;
  maxStartupTime: number;
  targetFPS: number;
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxFrameTime: 16.67,
  maxMemoryUsage: 200 * 1024 * 1024,
  maxNetworkLatency: 200,
  maxRenderTime: 16,
  maxStartupTime: 3000,
  targetFPS: 60,
};
