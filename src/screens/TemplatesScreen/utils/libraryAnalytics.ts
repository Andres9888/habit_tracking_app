/**
 * Analytics for the habit library browse journey.
 */

export type TemplateImportSource =
  | 'popular'
  | 'prescription'
  | 'catalog'
  | 'details'
  | 'customize';

export type LibraryAnalyticsEvent =
  | {
      type: 'template_added';
      templateId: string;
      source: TemplateImportSource;
    }
  | { type: 'chip_selected'; goalId: string }
  | { type: 'chip_deselected'; goalId: string }
  | { type: 'details_opened'; templateId: string };

interface LibraryAnalyticsTracker {
  track(event: LibraryAnalyticsEvent): void;
}

class ConsoleLibraryAnalyticsTracker implements LibraryAnalyticsTracker {
  track(event: LibraryAnalyticsEvent): void {
    if (__DEV__) {
      console.log('[Analytics] Library:', {
        timestamp: new Date().toISOString(),
        ...event,
      });
    }
  }
}

class NoOpLibraryAnalyticsTracker implements LibraryAnalyticsTracker {
  track(_event: LibraryAnalyticsEvent): void {}
}

let tracker: LibraryAnalyticsTracker = __DEV__
  ? new ConsoleLibraryAnalyticsTracker()
  : new NoOpLibraryAnalyticsTracker();

export function setLibraryAnalyticsTracker(
  next: LibraryAnalyticsTracker
): void {
  tracker = next;
}

export function trackLibraryEvent(event: LibraryAnalyticsEvent): void {
  try {
    tracker.track(event);
  } catch (error) {
    if (__DEV__) console.error('[Analytics] Library error:', error);
  }
}
