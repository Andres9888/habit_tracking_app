/**
 * Analytics instrumentation for the Habit Library
 */

import { useRef } from 'react';
import type { BaseSegment, LandingVariant } from './useUserSegment';
import type { DetailSourcePath } from './useViewNavigation';

function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function log(event: string, payload?: Record<string, unknown>) {
  console.log('[Analytics]', event, payload ?? {});
}

export function useLibraryAnalytics(segment: BaseSegment, variant: LandingVariant) {
  const sessionId = useRef(generateSessionId()).current;
  const openFired = useRef(false);
  const variantFired = useRef(false);

  const trackLibraryOpen = (source: string) => {
    if (openFired.current) return;
    openFired.current = true;
    log('library_open', { segment, sessionId, source, variant });
  };

  const trackLandingVariantShown = () => {
    if (variantFired.current) return;
    variantFired.current = true;
    log('library_variant_shown', { segment, sessionId, variant });
  };

  const trackGuideStarted = (entryPoint: string) => {
    log('library_guide_started', { entryPoint, segment, sessionId });
  };

  const trackGuideCompleted = (payload: {
    answersArea: string;
    answersTimeBucket?: string;
    answersStyle?: string;
    recommendedIds: string[];
  }) => {
    log('library_guide_completed', { ...payload, segment, sessionId });
  };

  const trackGuideAbandoned = (stepIndex: number, totalSteps: number, timeMs: number) => {
    log('library_guide_abandoned', { segment, sessionId, stepIndex, timeMs, totalSteps });
  };

  const trackDetailOpen = (templateId: string, path: DetailSourcePath) => {
    log('library_detail_open', { path, segment, sessionId, templateId });
  };

  const trackDetailSectionViewed = (templateId: string, section: string, path: DetailSourcePath) => {
    log('library_detail_section_viewed', { path, section, segment, sessionId, templateId });
  };

  const trackLibraryAdd = (payload: {
    templateId: string;
    path: DetailSourcePath;
    fromCustomize: boolean;
    isFirstImport: boolean;
  }) => {
    log('library_add', { ...payload, segment, sessionId });
  };

  const trackDwellNoAction = (timeMs: number) => {
    log('library_dwell_no_action', { segment, sessionId, timeMs, variant });
  };

  return {
    sessionId,
    trackDetailOpen,
    trackDetailSectionViewed,
    trackDwellNoAction,
    trackGuideAbandoned,
    trackGuideCompleted,
    trackGuideStarted,
    trackLandingVariantShown,
    trackLibraryAdd,
    trackLibraryOpen,
  };
}
