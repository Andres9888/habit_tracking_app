/**
 * Performance Monitoring Utility
 *
 * Tracks key startup metrics:
 * - Time to First Paint (TFP)
 * - Time to Interactive (TTI)
 * - Convex query latency
 * - Provider initialization times
 *
 * Defers reporting to requestIdleCallback to avoid blocking the app.
 */

interface PerformanceMarker {
  name: string;
  timestamp: number;
  duration?: number;
}

class PerformanceMonitor {
  private markers: Map<string, PerformanceMarker> = new Map();
  private enabled: boolean = __DEV__;

  /**
   * Mark a point in time for later measurement
   */
  mark(name: string): void {
    if (!this.enabled) return;

    this.markers.set(name, {
      name,
      timestamp: performance.now(),
    });
  }

  /**
   * Measure time between two marks or from mark to now
   */
  measure(name: string, startMark: string, endMark?: string): number {
    if (!this.enabled) return 0;

    const start = this.markers.get(startMark);
    if (!start) {
      console.warn(`[Performance] Start mark not found: ${startMark}`);
      return 0;
    }

    let endTime = performance.now();
    if (endMark) {
      const end = this.markers.get(endMark);
      if (!end) {
        console.warn(`[Performance] End mark not found: ${endMark}`);
        return 0;
      }
      endTime = end.timestamp;
    }

    const duration = endTime - start.timestamp;

    // Store measurement
    this.markers.set(name, {
      name,
      timestamp: start.timestamp,
      duration,
    });

    return duration;
  }

  /**
   * Get all recorded markers and measurements
   */
  getMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};

    this.markers.forEach((marker) => {
      if (marker.duration !== undefined) {
        metrics[marker.name] = marker.duration;
      }
    });

    return metrics;
  }

  /**
   * Report metrics to console (deferred to avoid blocking)
   */
  reportMetrics(): void {
    if (!this.enabled) return;

    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => this._logMetrics());
    } else {
      setTimeout(() => this._logMetrics(), 5000);
    }
  }

  private _logMetrics(): void {
    const metrics = this.getMetrics();
    console.group('[Performance] Startup Metrics');
    Object.entries(metrics).forEach(([name, duration]) => {
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    });
    console.groupEnd();
  }

  /**
   * Clear all markers
   */
  clear(): void {
    this.markers.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Mark app startup
if (typeof performance !== 'undefined') {
  performanceMonitor.mark('app-start');
}
