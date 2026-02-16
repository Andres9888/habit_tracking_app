/* eslint-disable max-lines */
/**
 * Frame Monitor - Tracks frame timing and FPS for animation performance analysis.
 */
import type { FrameTimingData } from './types';
import { now } from './PerformanceTimer';
import {
  calculateMetrics,
  getCurrentFPS,
  getJankPercentage,
  getP95FrameTime,
} from './frameMetrics';

export { measureFrameTime } from './frameMetrics';

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
      if (this.frameTimes.length > SAMPLE_WINDOW_SIZE) this.frameTimes.shift();
      if (this.frameTimes.length === SAMPLE_WINDOW_SIZE) {
        const sample = calculateMetrics(this.frameTimes);
        this.samples.push(sample);
        this.onSample?.(sample);
      }
    }
  }

  getCurrentFPS(): number {
    return getCurrentFPS(this.frameTimes);
  }
  getJankPercentage(): number {
    return getJankPercentage(this.frameTimes);
  }
  getP95FrameTime(): number {
    return getP95FrameTime(this.frameTimes);
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
