import type { FrameTimingData } from './types';
import { now } from './PerformanceTimer';

const FRAME_BUDGET_MS = 16.67;

export function calculateMetrics(frameTimes: number[]): FrameTimingData {
  const totalFrames = frameTimes.length;
  const totalTime = frameTimes.reduce((sum, t) => sum + t, 0);
  const averageFrameTime = totalTime / totalFrames;
  return {
    fps: 1000 / averageFrameTime,
    frameTime: averageFrameTime,
    jankFrames: frameTimes.filter((t) => t > FRAME_BUDGET_MS).length,
    timestamp: now(),
    totalFrames,
  };
}

export function getCurrentFPS(frameTimes: number[]): number {
  if (frameTimes.length < 2) return 0;
  const recentFrames = frameTimes.slice(-10);
  return 1000 / (recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length);
}

export function getJankPercentage(frameTimes: number[]): number {
  if (frameTimes.length === 0) return 0;
  return (
    (frameTimes.filter((t) => t > FRAME_BUDGET_MS).length / frameTimes.length) *
    100
  );
}

export function getP95FrameTime(frameTimes: number[]): number {
  if (frameTimes.length === 0) return 0;
  const sorted = [...frameTimes].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)] ?? sorted.at(-1) ?? 0;
}

export function measureFrameTime(): Promise<number> {
  return new Promise((resolve) => {
    const start = now();
    requestAnimationFrame(() => {
      resolve(now() - start);
    });
  });
}
