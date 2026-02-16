/**
 * Analytics Service
 * 
 * Central analytics tracking service with:
 * - Event tracking with batching
 * - Session management
 * - Funnel tracking
 * - Integration with Sentry for error correlation
 */

import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AnalyticsProvider,
  BaseEventProperties,
  DeepLinkEvent,
  FunnelStep,
  SessionData,
  UserProperties,
} from './types';

const STORAGE_KEYS = {
  SESSION: '@analytics/session',
  USER_PROPERTIES: '@analytics/user_properties',
  EVENT_QUEUE: '@analytics/event_queue',
  EXPERIMENTS: '@analytics/experiments',
} as const;

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const BATCH_SIZE = 10;
const BATCH_TIMEOUT_MS = 5000;

class Analytics implements AnalyticsProvider {
  private currentSession: SessionData | null = null;
  private eventQueue: Array<{ name: string; properties: BaseEventProperties }> = [];
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private userProperties: Partial<UserProperties> = {};
  private lastActivityTime: number = Date.now();
  private sessionCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initialize();
  }

  // =========================================================================
  // Initialization
  // =========================================================================

  private async initialize(): Promise<void> {
    try {
      // Restore user properties
      const storedProps = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROPERTIES);
      if (storedProps) {
        this.userProperties = JSON.parse(storedProps);
      }

      // Restore or create session
      const storedSession = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        const session: SessionData = JSON.parse(storedSession);
        const timeSinceLastActivity = Date.now() - (session.endTime || session.startTime);
        
        if (timeSinceLastActivity < SESSION_TIMEOUT_MS) {
          // Resume existing session
          this.currentSession = session;
        } else {
          // Session expired, start new one
          await this.endSession();
          this.startSession();
        }
      } else {
        this.startSession();
      }

      // Set up session timeout check
      this.sessionCheckInterval = setInterval(() => {
        this.checkSessionTimeout();
      }, 60000); // Check every minute

      // Restore event queue
      const storedQueue = await AsyncStorage.getItem(STORAGE_KEYS.EVENT_QUEUE);
      if (storedQueue) {
        this.eventQueue = JSON.parse(storedQueue);
        this.scheduleBatchFlush();
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[Analytics] Initialization failed:', error);
      }
      Sentry.captureException(error);
    }
  }

  // =========================================================================
  // Session Management
  // =========================================================================

  startSession(deepLink?: DeepLinkEvent): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      screensVisited: [],
      eventsCount: 0,
      deepLinkSource: deepLink?.source,
      deepLinkCampaign: deepLink?.campaign,
      deepLinkParams: deepLink?.params,
    };

    this.lastActivityTime = Date.now();

    // Track deep link if present
    if (deepLink) {
      this.trackEvent('deep_link_opened', {
        timestamp: Date.now(),
        sessionId,
        category: 'engagement',
        priority: 'high',
        ...deepLink,
      });
    }

    // Persist session
    AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentSession))
      .catch((error) => {
        if (__DEV__) console.error('[Analytics] Failed to persist session:', error);
      });

    this.trackEvent('session_start', {
      timestamp: Date.now(),
      sessionId,
      category: 'engagement',
      deepLinkPresent: !!deepLink,
    });

    return sessionId;
  }

  async endSession(): Promise<void> {
    if (!this.currentSession) return;

    const endTime = Date.now();
    const duration = endTime - this.currentSession.startTime;

    this.currentSession.endTime = endTime;
    this.currentSession.duration = duration;

    // Track session end
    this.trackEvent('session_end', {
      timestamp: endTime,
      sessionId: this.currentSession.id,
      category: 'engagement',
      duration,
      screensVisited: this.currentSession.screensVisited.length,
      eventsCount: this.currentSession.eventsCount,
    });

    // Update user properties
    await this.updateUserProperties({
      lastSeenAt: endTime,
      totalSessions: (this.userProperties.totalSessions || 0) + 1,
    });

    // Clear session
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    this.currentSession = null;

    // Flush remaining events
    await this.flush();
  }

  private checkSessionTimeout(): void {
    if (!this.currentSession) return;

    const timeSinceActivity = Date.now() - this.lastActivityTime;
    if (timeSinceActivity > SESSION_TIMEOUT_MS) {
      this.endSession().catch((error) => {
        if (__DEV__) console.error('[Analytics] Session timeout error:', error);
      });
    }
  }

  private updateActivity(): void {
    this.lastActivityTime = Date.now();
  }

  // =========================================================================
  // Event Tracking
  // =========================================================================

  trackEvent(eventName: string, properties?: BaseEventProperties): void {
    this.updateActivity();

    const sessionId = this.currentSession?.id || 'no_session';
    const event = {
      name: eventName,
      properties: {
        timestamp: Date.now(),
        sessionId,
        userId: this.userProperties.userId,
        category: 'engagement' as const,
        ...properties,
      },
    };

    // Add to queue
    this.eventQueue.push(event);

    // Update session
    if (this.currentSession) {
      this.currentSession.eventsCount += 1;
    }

    // Log in dev mode
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, event.properties);
    }

    // Send to Sentry breadcrumb for error correlation
    Sentry.addBreadcrumb({
      category: 'analytics',
      message: eventName,
      data: properties,
      level: 'info',
    });

    // Schedule batch flush
    this.scheduleBatchFlush();

    // Persist queue
    AsyncStorage.setItem(STORAGE_KEYS.EVENT_QUEUE, JSON.stringify(this.eventQueue))
      .catch((error) => {
        if (__DEV__) console.error('[Analytics] Failed to persist queue:', error);
      });
  }

  trackScreen(screenName: string, properties?: Record<string, unknown>): void {
    this.updateActivity();

    // Add to session screens
    if (this.currentSession && !this.currentSession.screensVisited.includes(screenName)) {
      this.currentSession.screensVisited.push(screenName);
    }

    this.trackEvent('screen_view', {
      timestamp: Date.now(),
      sessionId: this.currentSession?.id || 'no_session',
      category: 'engagement',
      screenName,
      ...properties,
    });
  }

  // =========================================================================
  // Funnel Tracking
  // =========================================================================

  trackFunnelStep(step: FunnelStep): void {
    this.trackEvent(`funnel_${step.funnel}_${step.step}`, {
      timestamp: step.timestamp,
      sessionId: this.currentSession?.id || 'no_session',
      category: 'conversion',
      priority: 'high',
      funnel: step.funnel,
      step: step.step,
      stepIndex: step.stepIndex,
      ...step.metadata,
    });
  }

  // =========================================================================
  // User Properties
  // =========================================================================

  async setUserProperties(properties: Partial<UserProperties>): Promise<void> {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    };

    // Persist
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROPERTIES,
      JSON.stringify(this.userProperties)
    );

    // Sync to Sentry
    Sentry.setUser({
      id: this.userProperties.userId,
      segment: this.userProperties.userSegment,
    });

    // Sync custom context
    Sentry.setContext('user_properties', {
      ...this.userProperties,
    });
  }

  private async updateUserProperties(updates: Partial<UserProperties>): Promise<void> {
    await this.setUserProperties(updates);
  }

  // =========================================================================
  // Batch Flushing
  // =========================================================================

  private scheduleBatchFlush(): void {
    // Immediate flush if batch size reached
    if (this.eventQueue.length >= BATCH_SIZE) {
      this.flush().catch((error) => {
        if (__DEV__) console.error('[Analytics] Batch flush error:', error);
      });
      return;
    }

    // Schedule timeout flush
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.flush().catch((error) => {
          if (__DEV__) console.error('[Analytics] Timer flush error:', error);
        });
      }, BATCH_TIMEOUT_MS);
    }
  }

  async flush(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.eventQueue.length === 0) return;

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In a real implementation, send to your analytics backend
      // For now, we'll just log and send to Sentry
      if (__DEV__) {
        console.log('[Analytics] Flushing batch:', eventsToFlush.length, 'events');
      }

      // Send high-priority events to Sentry
      const criticalEvents = eventsToFlush.filter(
        (e) => e.properties.priority === 'critical' || e.properties.priority === 'high'
      );

      for (const event of criticalEvents) {
        Sentry.captureMessage(`Analytics: ${event.name}`, {
          level: 'info',
          extra: event.properties,
        });
      }

      // Clear persisted queue
      await AsyncStorage.removeItem(STORAGE_KEYS.EVENT_QUEUE);
    } catch (error) {
      if (__DEV__) {
        console.error('[Analytics] Flush failed:', error);
      }
      // Re-queue events on failure
      this.eventQueue = [...eventsToFlush, ...this.eventQueue];
      Sentry.captureException(error);
    }
  }

  // =========================================================================
  // Cleanup
  // =========================================================================

  cleanup(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    this.endSession().catch((error) => {
      if (__DEV__) console.error('[Analytics] Cleanup error:', error);
    });
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const analytics = new Analytics();

// ============================================================================
// Convenience Exports
// ============================================================================

export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackScreen = analytics.trackScreen.bind(analytics);
export const setUserProperties = analytics.setUserProperties.bind(analytics);
export const trackFunnelStep = analytics.trackFunnelStep.bind(analytics);
export const startSession = analytics.startSession.bind(analytics);
export const endSession = analytics.endSession.bind(analytics);
