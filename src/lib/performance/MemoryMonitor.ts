/**
 * Memory Monitor - Tracks memory usage for leak detection and optimization.
 */
import type { MemorySnapshot } from './types';
import { now } from './PerformanceTimer';

interface PerformanceWithMemory extends Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

export class MemoryMonitor {
  private snapshots: MemorySnapshot[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isMonitoring: boolean = false;
  private baselineUsage: number | null = null;

  static isSupported(): boolean {
    return typeof performance !== 'undefined' && 'memory' in performance;
  }

  takeSnapshot(): MemorySnapshot {
    const timestamp = now();
    if (!MemoryMonitor.isSupported()) return { estimated: true, timestamp };
    const memory = (performance as PerformanceWithMemory).memory;
    if (!memory) return { estimated: true, timestamp };
    const snapshot: MemorySnapshot = {
      estimated: false,
      jsHeapTotal: memory.totalJSHeapSize,
      jsHeapUsed: memory.usedJSHeapSize,
      timestamp,
    };
    this.snapshots.push(snapshot);
    return snapshot;
  }

  start(intervalMs: number = 5000): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.baselineUsage = this.takeSnapshot().jsHeapUsed ?? null;
    this.intervalId = setInterval(() => {
      this.takeSnapshot();
    }, intervalMs);
  }

  stop(): void {
    this.isMonitoring = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurrentUsage(): number | null {
    return this.takeSnapshot().jsHeapUsed ?? null;
  }

  getMemoryGrowth(): number | null {
    if (this.baselineUsage === null) return null;
    const current = this.getCurrentUsage();
    return current === null ? null : current - this.baselineUsage;
  }

  detectLeak(thresholdGrowthPercent: number = 50): boolean {
    if (this.snapshots.length < 5 || this.baselineUsage === null) return false;
    const recentSnapshots = this.snapshots.slice(-5);
    const avgRecent =
      recentSnapshots.reduce((sum, s) => sum + (s.jsHeapUsed ?? 0), 0) /
      recentSnapshots.length;
    return (
      ((avgRecent - this.baselineUsage) / this.baselineUsage) * 100 >
      thresholdGrowthPercent
    );
  }

  getAverageUsage(): number | null {
    const valid = this.snapshots.filter((s) => s.jsHeapUsed !== undefined);
    return valid.length === 0
      ? null
      : valid.reduce((acc, s) => acc + (s.jsHeapUsed ?? 0), 0) / valid.length;
  }

  getPeakUsage(): number | null {
    const valid = this.snapshots.filter((s) => s.jsHeapUsed !== undefined);
    return valid.length === 0
      ? null
      : Math.max(...valid.map((s) => s.jsHeapUsed ?? 0));
  }

  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }
  clear(): void {
    this.snapshots = [];
    this.baselineUsage = null;
  }

  static formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
