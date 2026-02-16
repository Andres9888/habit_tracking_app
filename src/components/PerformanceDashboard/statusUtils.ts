/**
 * Status Utilities
 * Helper functions for determining metric status levels.
 */

import type { StatusLevel } from './types';

/** Get status level based on value vs threshold ratio */
export function getStatusLevel(value: number, threshold: number): StatusLevel {
  if (threshold === 0) return 'good';
  const ratio = value / threshold;
  if (ratio < 0.7) return 'good';
  if (ratio < 1) return 'warning';
  return 'critical';
}

/** Get FPS status based on frame rate */
export function getFPSStatus(fps: number): StatusLevel {
  if (fps >= 55) return 'good';
  if (fps >= 30) return 'warning';
  return 'critical';
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
