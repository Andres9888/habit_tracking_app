/**
 * Network Monitor - Tracks network request performance for API latency monitoring.
 */
import type { NetworkTiming } from './types';
import { now } from './PerformanceTimer';

export class NetworkMonitor {
  private timings: NetworkTiming[] = [];
  private pendingRequests: Map<
    string,
    { method: string; startTime: number; url: string }
  > = new Map();
  private requestIdCounter: number = 0;

  startRequest(url: string, method: string = 'GET'): string {
    const requestId = `req_${++this.requestIdCounter}`;
    this.pendingRequests.set(requestId, { method, startTime: now(), url });
    return requestId;
  }

  endRequest(
    requestId: string,
    status?: number,
    size?: number
  ): NetworkTiming | null {
    const pending = this.pendingRequests.get(requestId);
    if (!pending) {
      if (__DEV__) console.warn(`No pending request found for ID: ${requestId}`);
      return null;
    }
    const endTime = now();
    const timing: NetworkTiming = {
      duration: endTime - pending.startTime,
      endTime,
      method: pending.method,
      size,
      startTime: pending.startTime,
      status,
      url: pending.url,
    };
    this.timings.push(timing);
    this.pendingRequests.delete(requestId);
    return timing;
  }

  recordRequest(
    url: string,
    method: string,
    duration: number,
    status?: number,
    size?: number
  ): void {
    const endTime = now();
    this.timings.push({
      duration,
      endTime,
      method,
      size,
      startTime: endTime - duration,
      status,
      url,
    });
  }

  getAverageLatency(): number {
    if (this.timings.length === 0) return 0;
    return (
      this.timings.reduce((acc, t) => acc + t.duration, 0) / this.timings.length
    );
  }

  getP95Latency(): number {
    if (this.timings.length === 0) return 0;
    const sorted = [...this.timings].sort((a, b) => a.duration - b.duration);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index]?.duration ?? sorted.at(-1)?.duration ?? 0;
  }

  getErrorRate(): number {
    if (this.timings.length === 0) return 0;
    return (
      this.timings.filter((t) => t.status && t.status >= 400).length /
      this.timings.length
    );
  }

  getSlowestRequests(limit: number = 10): NetworkTiming[] {
    return [...this.timings]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }
  getRequestsByPattern(pattern: RegExp): NetworkTiming[] {
    return this.timings.filter((t) => pattern.test(t.url));
  }
  getAllTimings(): NetworkTiming[] {
    return [...this.timings];
  }
  clear(): void {
    this.timings = [];
    this.pendingRequests.clear();
  }

  getStats() {
    return {
      averageLatency: this.getAverageLatency(),
      errorRate: this.getErrorRate(),
      p95Latency: this.getP95Latency(),
      pendingCount: this.pendingRequests.size,
      totalRequests: this.timings.length,
    };
  }
}
