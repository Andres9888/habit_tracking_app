import { PerformanceTimer } from '../../lib/performance';
import { getSentryReporter } from '../../lib/sentry/reporter';

type TemplatesModalOpenSource = 'bottomActionBar' | 'modalState';
type TemplatesModalVisibleSurface = 'modal' | 'skeleton';

interface PendingOpenTiming {
  id: number;
  source: TemplatesModalOpenSource;
  startMark: string;
}

interface TemplatesModalOpenMeasure {
  duration: number;
  source: TemplatesModalOpenSource;
  visibleSurface: TemplatesModalVisibleSurface;
}

const timer = new PerformanceTimer();
const pendingOpenTimings: PendingOpenTiming[] = [];
let nextTimingId = 0;
let lastVisibleMeasures: TemplatesModalOpenMeasure[] = [];

export function markTemplatesModalOpenIntent(
  source: TemplatesModalOpenSource
): void {
  const id = nextTimingId;
  nextTimingId += 1;
  const startMark = `habits.templatesModal.openIntent.${id}`;

  timer.mark(startMark, { source });
  pendingOpenTimings.push({ id, source, startMark });
}

export function captureTemplatesModalFirstVisible(
  visibleSurface: TemplatesModalVisibleSurface = 'modal'
): TemplatesModalOpenMeasure[] {
  if (pendingOpenTimings.length === 0) return [];

  const completed = pendingOpenTimings.splice(0).flatMap((pending) => {
    const measure = timer.measure(
      `habits.templatesModal.clickToVisible.${pending.source}`,
      pending.startMark,
      undefined,
      { source: pending.source, visibleSurface }
    );

    return measure
      ? [
          {
            duration: measure.duration,
            source: pending.source,
            visibleSurface,
          },
        ]
      : [];
  });

  lastVisibleMeasures = completed;

  const reporter = getSentryReporter();
  for (const measure of completed) {
    reporter.addBreadcrumb({
      category: 'performance',
      data: {
        durationMs: measure.duration,
        source: measure.source,
        visibleSurface: measure.visibleSurface,
      },
      message: 'Templates modal click-to-visible',
    });
  }

  if (__DEV__ && completed.length > 0) {
    console.info('[performance] templates modal click-to-visible', completed);
  }

  return completed;
}

export function getLastTemplatesModalVisibleMeasures(): TemplatesModalOpenMeasure[] {
  return lastVisibleMeasures;
}

export function resetTemplatesModalOpenPerformanceForTest(): void {
  timer.clear();
  pendingOpenTimings.splice(0);
  lastVisibleMeasures = [];
  nextTimingId = 0;
}
