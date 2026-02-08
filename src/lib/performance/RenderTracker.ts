/**
 * Render Tracker - Tracks component render performance for optimization.
 */
import type { RenderTiming } from './types';
import { now } from './PerformanceTimer';

interface ComponentRenderData {
  lastRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  renderCount: number;
  totalRenderTime: number;
}

export class RenderTracker {
  private componentData: Map<string, ComponentRenderData> = new Map();
  private renderStack: Map<string, number> = new Map();

  startRender(componentName: string): void {
    this.renderStack.set(componentName, now());
  }

  endRender(componentName: string): number {
    const startTime = this.renderStack.get(componentName);
    if (startTime === undefined) {
      if (__DEV__) console.warn(`No start time for component: ${componentName}`);
      return 0;
    }
    const duration = now() - startTime;
    this.renderStack.delete(componentName);
    this.updateComponentData(componentName, duration);
    return duration;
  }

  recordRender(componentName: string, duration: number): void {
    this.updateComponentData(componentName, duration);
  }

  private updateComponentData(componentName: string, duration: number): void {
    const existing = this.componentData.get(componentName);
    if (existing) {
      existing.renderCount++;
      existing.totalRenderTime += duration;
      existing.lastRenderTime = duration;
      existing.maxRenderTime = Math.max(existing.maxRenderTime, duration);
      existing.minRenderTime = Math.min(existing.minRenderTime, duration);
    } else {
      this.componentData.set(componentName, {
        lastRenderTime: duration,
        maxRenderTime: duration,
        minRenderTime: duration,
        renderCount: 1,
        totalRenderTime: duration,
      });
    }
  }

  getComponentTiming(componentName: string): RenderTiming | null {
    const data = this.componentData.get(componentName);
    if (!data) return null;
    return {
      averageRenderTime: data.totalRenderTime / data.renderCount,
      componentName,
      lastRenderTime: data.lastRenderTime,
      renderCount: data.renderCount,
      timestamp: now(),
      totalRenderTime: data.totalRenderTime,
    };
  }

  getAllTimings(): RenderTiming[] {
    return [...this.componentData.entries()].map(([name, data]) => ({
      averageRenderTime: data.totalRenderTime / data.renderCount,
      componentName: name,
      lastRenderTime: data.lastRenderTime,
      renderCount: data.renderCount,
      timestamp: now(),
      totalRenderTime: data.totalRenderTime,
    }));
  }

  getSlowComponents(thresholdMs: number = 16): RenderTiming[] {
    return this.getAllTimings().filter(
      (t) => t.averageRenderTime > thresholdMs
    );
  }
  getMostRendered(limit: number = 10): RenderTiming[] {
    return this.getAllTimings()
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, limit);
  }
  clear(): void {
    this.componentData.clear();
    this.renderStack.clear();
  }

  getTotalRenderCount(): number {
    let total = 0;
    for (const data of this.componentData.values()) {
      total += data.renderCount;
    }
    return total;
  }
}
