/**
 * Analytics Type Definitions
 * 
 * Event tracking, user properties, and analytics configuration types
 */

// ============================================================================
// Event Types
// ============================================================================

export type EventCategory = 
  | 'engagement'
  | 'conversion'
  | 'retention'
  | 'onboarding'
  | 'monetization'
  | 'feature_usage'
  | 'error'
  | 'performance';

export type EventPriority = 'low' | 'medium' | 'high' | 'critical';

export interface BaseEventProperties {
  timestamp: number;
  sessionId: string;
  userId?: string;
  category: EventCategory;
  priority?: EventPriority;
  [key: string]: unknown;
}

// ============================================================================
// User Properties
// ============================================================================

export interface UserProperties {
  userId: string;
  createdAt: number;
  lastSeenAt: number;
  
  // Retention metrics
  daysSinceInstall: number;
  daysActive: number;
  consecutiveDays: number;
  
  // Engagement
  totalSessions: number;
  totalHabitsCreated: number;
  totalCheckins: number;
  longestStreak: number;
  
  // Cohort
  userSegment?: 'power_user' | 'casual' | 'at_risk' | 'new';
  installSource?: string;
  
  // Monetization
  isPremium: boolean;
  subscriptionTier?: string;
  lifetimeValue: number;
  
  // Experiment groups
  experiments?: Record<string, string>;
  
  [key: string]: unknown;
}

// ============================================================================
// Session Tracking
// ============================================================================

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  screensVisited: string[];
  eventsCount: number;
  deepLinkSource?: string;
  deepLinkCampaign?: string;
  deepLinkParams?: Record<string, string>;
}

// ============================================================================
// Funnel Tracking
// ============================================================================

export type FunnelName = 
  | 'onboarding'
  | 'habit_creation'
  | 'subscription_purchase'
  | 'paywall_view';

export interface FunnelStep {
  funnel: FunnelName;
  step: string;
  stepIndex: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// A/B Testing
// ============================================================================

export interface ExperimentVariant {
  experimentId: string;
  variantId: string;
  assignedAt: number;
}

export interface ExperimentConfig {
  id: string;
  name: string;
  enabled: boolean;
  variants: {
    id: string;
    name: string;
    weight: number; // 0-100
  }[];
  startDate?: number;
  endDate?: number;
}

// ============================================================================
// Deep Link Analytics
// ============================================================================

export interface DeepLinkEvent {
  url: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrer?: string;
  timestamp: number;
  converted: boolean;
  params: Record<string, string>;
}

// ============================================================================
// Feature Flags
// ============================================================================

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  rolloutPercentage?: number; // 0-100
  enabledForUserIds?: string[];
  enabledForSegments?: string[];
}

// ============================================================================
// Analytics Provider Interface
// ============================================================================

export interface AnalyticsProvider {
  trackEvent(eventName: string, properties?: BaseEventProperties): void;
  setUserProperties(properties: Partial<UserProperties>): void;
  trackScreen(screenName: string, properties?: Record<string, unknown>): void;
  startSession(deepLink?: DeepLinkEvent): string;
  endSession(): void;
  trackFunnelStep(step: FunnelStep): void;
  flush(): Promise<void>;
}

// ============================================================================
// Cohort Analysis
// ============================================================================

export interface CohortData {
  cohortId: string; // e.g., "2024-02-W7"
  installDate: number;
  usersCount: number;
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
  avgSessionDuration: number;
  avgLTV: number;
}
