/**
 * PerformanceMonitor - Centralized Performance & Health Tracking
 *
 * Tracks:
 * - Screen render times
 * - API response times (Convex queries)
 * - JS thread frame drops
 * - Crash-free session rate
 * - User flow breadcrumbs
 */

import { InteractionManager, Platform } from 'react-native';
import { getSentryReporter } from '../sentry/reporter/index';
import type { SentryTransaction } from '../sentry/types';

/**
 * Frame drop severity thresholds (in ms)
 */
const FRAME_DROP_THRESHOLDS = {
  minor: 16, // 1 frame at 60fps
  moderate: 32, // 2 frames
  severe: 64, // 4 frames
  critical: 100, // 6+ frames
} as const;

/**
 * API response time thresholds (in ms)
 */
const API_RESPONSE_THRESHOLDS = {
  fast: 100,
  acceptable: 300,
  slow: 1000,
  critical: 3000,
} as const;

/**
 * Screen render time thresholds (in ms)
 */
const SCREEN_RENDER_THRESHOLDS = {
  fast: 200,
  acceptable: 500,
  slow: 1000,
  critical: 2000,
} as const;

interface ScreenRenderMetrics {
  screenName: string;
  mountTime: number;
  interactiveTime?: number;
  transaction?: SentryTransaction;
}

interface ConvexQueryMetrics {
  queryName: string;
  startTime: number;
  transaction?: SentryTransaction;
}

interface FrameDropMetrics {
  timestamp: number;
  duration: number;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
}

class PerformanceMonitorService {
  private sessionStartTime: number;
  private crashFreeSession = true;
  private activeScreens = new Map<string, ScreenRenderMetrics>();
  private activeQueries = new Map<string, ConvexQueryMetrics>();
  private frameDrops: FrameDropMetrics[] = [];
  private lastFrameTime: number | null = null;
  private frameMonitorActive = false;

  constructor() {
    this.sessionStartTime = Date.now();
    this.initializeFrameMonitoring();
  }

  /**
   * Initialize JS thread frame drop monitoring
   */
  private initializeFrameMonitoring(): void {
    if (this.frameMonitorActive) return;
    this.frameMonitorActive = true;

    const monitorFrame = (): void => {
      const now = Date.now();
      if (this.lastFrameTime !== null) {
        const frameDuration = now - this.lastFrameTime;
        
        // Detect frame drops (expected: ~16ms at 60fps)
        if (frameDuration > FRAME_DROP_THRESHOLDS.minor) {
          const severity = this.categorizeFrameDrop(frameDuration);
          this.recordFrameDrop(frameDuration, severity);
        }
      }
      this.lastFrameTime = now;
      requestAnimationFrame(monitorFrame);
    };

    requestAnimationFrame(monitorFrame);
  }

  /**
   * Categorize frame drop severity
   */
  private categorizeFrameDrop(
    duration: number
  ): 'minor' | 'moderate' | 'severe' | 'critical' {
    if (duration >= FRAME_DROP_THRESHOLDS.critical) return 'critical';
    if (duration >= FRAME_DROP_THRESHOLDS.severe) return 'severe';
    if (duration >= FRAME_DROP_THRESHOLDS.moderate) return 'moderate';
    return 'minor';
  }

  /**
   * Record a frame drop event
   */
  private recordFrameDrop(
    duration: number,
    severity: 'minor' | 'moderate' | 'severe' | 'critical'
  ): void {
    const frameDrop: FrameDropMetrics = {
      duration,
      severity,
      timestamp: Date.now(),
    };

    this.frameDrops.push(frameDrop);

    // Only report severe/critical frame drops to avoid noise
    if (severity === 'severe' || severity === 'critical') {
      const reporter = getSentryReporter();
      reporter.addBreadcrumb({
        category: 'performance.frame',
        data: {
          duration,
          expectedDuration: 16,
          framesDropped: Math.floor(duration / 16),
          severity,
        },
        level: severity === 'critical' ? 'warning' : 'info',
        message: `JS thread frame drop: ${duration.toFixed(1)}ms`,
      });

      if (severity === 'critical') {
        reporter.captureMessage(
          `Critical frame drop: ${duration.toFixed(1)}ms`,
          'warning'
        );
      }
    }

    // Keep only last 100 frame drops in memory
    if (this.frameDrops.length > 100) {
      this.frameDrops = this.frameDrops.slice(-100);
    }
  }

  /**
   * Start tracking a screen render
   */
  startScreenRender(screenName: string): void {
    const reporter = getSentryReporter();
    const transaction = reporter.startTransaction('ui.screen.render');

    if (transaction) {
      transaction.setData('screen_name', screenName);
      transaction.setData('platform', Platform.OS);
    }

    this.activeScreens.set(screenName, {
      mountTime: Date.now(),
      screenName,
      transaction: transaction ?? undefined,
    });

    reporter.addBreadcrumb({
      category: 'navigation',
      data: { screen: screenName },
      level: 'info',
      message: `Screen render started: ${screenName}`,
    });
  }

  /**
   * Mark screen as interactive (when user can interact)
   */
  markScreenInteractive(screenName: string): void {
    const metrics = this.activeScreens.get(screenName);
    if (!metrics) return;

    const interactiveTime = Date.now();
    const renderDuration = interactiveTime - metrics.mountTime;
    metrics.interactiveTime = interactiveTime;

    const reporter = getSentryReporter();

    // Categorize render performance
    const performanceLevel = this.categorizeRenderTime(renderDuration);

    if (metrics.transaction) {
      metrics.transaction.setData('render_duration_ms', renderDuration);
      metrics.transaction.setData('performance_level', performanceLevel);
      metrics.transaction.setStatus('ok');
      metrics.transaction.finish();
    }

    reporter.addBreadcrumb({
      category: 'performance.screen',
      data: {
        performanceLevel,
        renderDuration,
        screenName,
      },
      level: performanceLevel === 'critical' ? 'warning' : 'info',
      message: `Screen interactive: ${screenName} (${renderDuration}ms)`,
    });

    // Report slow renders
    if (renderDuration > SCREEN_RENDER_THRESHOLDS.slow) {
      reporter.captureMessage(
        `Slow screen render: ${screenName} took ${renderDuration}ms`,
        performanceLevel === 'critical' ? 'warning' : 'info'
      );
    }

    this.activeScreens.delete(screenName);
  }

  /**
   * Categorize screen render time
   */
  private categorizeRenderTime(
    duration: number
  ): 'fast' | 'acceptable' | 'slow' | 'critical' {
    if (duration >= SCREEN_RENDER_THRESHOLDS.critical) return 'critical';
    if (duration >= SCREEN_RENDER_THRESHOLDS.slow) return 'slow';
    if (duration >= SCREEN_RENDER_THRESHOLDS.acceptable) return 'acceptable';
    return 'fast';
  }

  /**
   * Start tracking a Convex query
   */
  startConvexQuery(queryName: string, queryId?: string): string {
    const id = queryId ?? `${queryName}-${Date.now()}`;
    const reporter = getSentryReporter();
    const transaction = reporter.startTransaction('convex.query');

    if (transaction) {
      transaction.setData('query_name', queryName);
      transaction.setData('query_id', id);
    }

    this.activeQueries.set(id, {
      queryName,
      startTime: Date.now(),
      transaction: transaction ?? undefined,
    });

    return id;
  }

  /**
   * Complete tracking a Convex query
   */
  endConvexQuery(
    queryId: string,
    options?: { error?: Error; resultSize?: number }
  ): void {
    const metrics = this.activeQueries.get(queryId);
    if (!metrics) return;

    const endTime = Date.now();
    const duration = endTime - metrics.startTime;
    const reporter = getSentryReporter();

    // Categorize API performance
    const performanceLevel = this.categorizeAPITime(duration);

    if (metrics.transaction) {
      metrics.transaction.setData('duration_ms', duration);
      metrics.transaction.setData('performance_level', performanceLevel);
      if (options?.resultSize !== undefined) {
        metrics.transaction.setData('result_size', options.resultSize);
      }
      if (options?.error) {
        metrics.transaction.setStatus('internal_error');
        metrics.transaction.setData('error', options.error.message);
      } else {
        metrics.transaction.setStatus('ok');
      }
      metrics.transaction.finish();
    }

    reporter.addBreadcrumb({
      category: 'convex.query',
      data: {
        duration,
        error: options?.error?.message,
        performanceLevel,
        queryName: metrics.queryName,
        resultSize: options?.resultSize,
      },
      level: options?.error ? 'error' : 'info',
      message: `Convex query: ${metrics.queryName} (${duration}ms)`,
    });

    // Report slow queries
    if (duration > API_RESPONSE_THRESHOLDS.slow && !options?.error) {
      reporter.captureMessage(
        `Slow Convex query: ${metrics.queryName} took ${duration}ms`,
        performanceLevel === 'critical' ? 'warning' : 'info'
      );
    }

    this.activeQueries.delete(queryId);
  }

  /**
   * Categorize API response time
   */
  private categorizeAPITime(
    duration: number
  ): 'fast' | 'acceptable' | 'slow' | 'critical' {
    if (duration >= API_RESPONSE_THRESHOLDS.critical) return 'critical';
    if (duration >= API_RESPONSE_THRESHOLDS.slow) return 'slow';
    if (duration >= API_RESPONSE_THRESHOLDS.acceptable) return 'acceptable';
    return 'fast';
  }

  /**
   * Track user action breadcrumb
   */
  trackUserAction(
    action: string,
    data?: Record<string, unknown>
  ): void {
    const reporter = getSentryReporter();
    reporter.addBreadcrumb({
      category: 'user.action',
      data: {
        ...data,
        sessionDuration: Date.now() - this.sessionStartTime,
      },
      level: 'info',
      message: `User action: ${action}`,
    });
  }

  /**
   * Track navigation breadcrumb
   */
  trackNavigation(from: string, to: string): void {
    const reporter = getSentryReporter();
    reporter.addBreadcrumb({
      category: 'navigation',
      data: { from, to },
      level: 'info',
      message: `Navigation: ${from} → ${to}`,
    });
  }

  /**
   * Mark session as crashed (for crash-free rate tracking)
   */
  markSessionCrashed(): void {
    this.crashFreeSession = false;
    const reporter = getSentryReporter();
    reporter.addBreadcrumb({
      category: 'session',
      level: 'fatal',
      message: 'Session crashed',
    });
  }

  /**
   * Get session health metrics
   */
  getSessionHealth(): {
    crashFree: boolean;
    duration: number;
    frameDropCount: number;
    severeFrameDrops: number;
  } {
    const now = Date.now();
    const duration = now - this.sessionStartTime;
    const severeFrameDrops = this.frameDrops.filter(
      (fd) => fd.severity === 'severe' || fd.severity === 'critical'
    ).length;

    return {
      crashFree: this.crashFreeSession,
      duration,
      frameDropCount: this.frameDrops.length,
      severeFrameDrops,
    };
  }

  /**
   * Report session health summary
   */
  reportSessionHealth(): void {
    const health = this.getSessionHealth();
    const reporter = getSentryReporter();

    reporter.addBreadcrumb({
      category: 'session.health',
      data: health,
      level: 'info',
      message: `Session health: ${health.crashFree ? 'crash-free' : 'crashed'}`,
    });

    reporter.captureMessage(
      `Session health report: ${health.crashFree ? 'crash-free' : 'crashed'}, ${health.severeFrameDrops} severe frame drops`,
      'info'
    );
  }
}

// Singleton instance
let monitorInstance: PerformanceMonitorService | null = null;

/**
 * Get the PerformanceMonitor singleton instance
 */
export function getPerformanceMonitor(): PerformanceMonitorService {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitorService();
  }
  return monitorInstance;
}

/**
 * Initialize performance monitoring
 * Call this early in the app lifecycle
 */
export function initPerformanceMonitoring(): void {
  getPerformanceMonitor();
}

export type { ScreenRenderMetrics, ConvexQueryMetrics, FrameDropMetrics };
