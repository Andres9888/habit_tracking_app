/**
 * Performance Timer
 * High-precision timing utilities for measuring durations.
 */

import type { PerformanceMark, PerformanceMeasure } from './types';

/** Get current high-resolution timestamp */
export function now(): number {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
}

/** Performance timer for tracking marks and measures */
export class PerformanceTimer {
  private marks: Map<string, PerformanceMark> = new Map();
  private measures: PerformanceMeasure[] = [];
  private sessionStart: number;

  constructor() {
    this.sessionStart = now();
  }

  /** Create a performance mark */
  mark(name: string, metadata?: Record<string, unknown>): PerformanceMark {
    const mark: PerformanceMark = { metadata, name, timestamp: now() };
    this.marks.set(name, mark);
    return mark;
  }

  /** Get a previously created mark */
  getMark(name: string): PerformanceMark | undefined {
    return this.marks.get(name);
  }

  /** Measure duration between two marks */
  measure(
    name: string,
    startMarkName: string,
    endMarkName?: string,
    metadata?: Record<string, unknown>
  ): PerformanceMeasure | null {
    const startMark = this.marks.get(startMarkName);
    if (!startMark) {
      if (__DEV__) console.warn(`Start mark "${startMarkName}" not found`);
      return null;
    }
    const endTimestamp = endMarkName
      ? (this.marks.get(endMarkName)?.timestamp ?? now())
      : now();
    const measure: PerformanceMeasure = {
      duration: endTimestamp - startMark.timestamp,
      endMark: endMarkName ?? 'now',
      metadata,
      name,
      startMark: startMarkName,
    };
    this.measures.push(measure);
    return measure;
  }

  /** Get session duration */
  getSessionDuration(): number {
    return now() - this.sessionStart;
  }

  /** Get all marks */
  getAllMarks(): PerformanceMark[] {
    return [...this.marks.values()];
  }

  /** Get all measures */
  getAllMeasures(): PerformanceMeasure[] {
    return [...this.measures];
  }

  /** Clear all marks and measures */
  clear(): void {
    this.marks.clear();
    this.measures = [];
  }

  /** Export data for reporting */
  export(): { marks: PerformanceMark[]; measures: PerformanceMeasure[] } {
    return { marks: this.getAllMarks(), measures: this.getAllMeasures() };
  }
}
