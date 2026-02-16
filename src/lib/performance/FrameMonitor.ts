/* eslint-disable max-lines */
/**
 * Frame Monitor - Tracks frame timing and FPS for animation performance analysis.
 */
import type { FrameTimingData } from './types';
import { now } from './PerformanceTimer';

const FRAME_BUDGET_MS = 16.67;
const SAMPLE_WINDOW_SIZE = 60;

export class FrameMonitor {
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;
  private isMonitoring: boolean = false;
  private samples: FrameTimingData[] = [];
  private onSample?: (data: FrameTimingData) => void;

  constructor(onSample?: (data: FrameTimingData) => void) {
    this.onSample = onSample;
  }

  start(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastFrameTime = now();
    this.frameTimes = [];
    this.scheduleFrame();
  }

  stop(): void {
    this.isMonitoring = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private scheduleFrame(): void {
    if (!this.isMonitoring) return;
    this.animationFrameId = requestAnimationFrame(() => {
      this.recordFrame();
      this.scheduleFrame();
    });
  }

  private recordFrame(): void {
    const currentTime = now();
    const frameTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    if (frameTime > 0 && frameTime < 1000) {
      this.frameTimes.push(frameTime);
      if (this.frameTimes.length > SAMPLE_WINDOW_SIZE) {
        this.frameTimes.shift();
      }
      if (this.frameTimes.length === SAMPLE_WINDOW_SIZE) {
        const sample = this.calculateMetrics();
        this.samples.push(sample);
        this.onSample?.(sample);
      }
    }
  }

  private calculateMetrics(): FrameTimingData {
    const totalFrames = this.frameTimes.length;
    const totalTime = this.frameTimes.reduce((sum, t) => sum + t, 0);
    const averageFrameTime = totalTime / totalFrames;
    return {
      fps: 1000 / averageFrameTime,
      frameTime: averageFrameTime,
      jankFrames: this.frameTimes.filter((t) => t > FRAME_BUDGET_MS).length,
      timestamp: now(),
      totalFrames,
    };
  }

  getCurrentFPS(): number {
    if (this.frameTimes.length < 2) return 0;
    const recentFrames = this.frameTimes.slice(-10);
    return (
      1000 / (recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length)
    );
  }

  getJankPercentage(): number {
    if (this.frameTimes.length === 0) return 0;
    return (
      (this.frameTimes.filter((t) => t > FRAME_BUDGET_MS).length /
        this.frameTimes.length) *
      100
    );
  }

  getP95FrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.95)] ?? sorted.at(-1) ?? 0;
  }

  getSamples(): FrameTimingData[] {
    return [...this.samples];
  }
  clear(): void {
    this.frameTimes = [];
    this.samples = [];
  }
  isActive(): boolean {
    return this.isMonitoring;
  }
}

export function measureFrameTime(): Promise<number> {
  return new Promise((resolve) => {
    const start = now();
    requestAnimationFrame(() => {
      resolve(now() - start);
    });
  });
}
