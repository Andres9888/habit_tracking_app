import { PerformanceTimer } from './PerformanceTimer';

const SETTINGS_OPEN_EVENT_NAME = 'settings_opened';
const SETTINGS_OPEN_TAP_MARK = 'settings:open:tap';
const SETTINGS_OPEN_STATE_MARK = 'settings:open:state-open';
const SETTINGS_OPEN_VISIBLE_MARK = 'settings:open:first-visible';
const SETTINGS_OPEN_READY_MARK = 'settings:open:content-ready';
const SETTINGS_OPEN_VISIBLE_MEASURE = 'settings:open:tap-to-first-visible';
const SETTINGS_OPEN_READY_MEASURE = 'settings:open:tap-to-content-ready';

const timer = new PerformanceTimer();
type SettingsOpenInteractionLogger = (
  eventName: string,
  payload: { durationMs: number }
) => void;

let interactionLogger: SettingsOpenInteractionLogger | undefined;

function roundedDuration(duration: number): number {
  return Math.max(0, Math.round(duration));
}

function devLog(name: string, metadata?: Record<string, unknown>): void {
  if (__DEV__) {
    console.log(`[settings-open-timing:${name}]`, metadata ?? {});
  }
}

function logSettingsOpened(durationMs: number): void {
  if (interactionLogger) {
    interactionLogger(SETTINGS_OPEN_EVENT_NAME, { durationMs });
    return;
  }

  void import('../analytics/interactions')
    .then(({ logInteraction }) => {
      logInteraction(SETTINGS_OPEN_EVENT_NAME, { durationMs });
    })
    .catch((error_) => {
      if (__DEV__) {
        console.warn('[settings-open-timing] analytics import failed', error_);
      }
    });
}

export function setSettingsOpenTimingInteractionLogger(
  logger: SettingsOpenInteractionLogger | undefined
): void {
  interactionLogger = logger;
}

export function markSettingsOpenTap(): void {
  timer.mark(SETTINGS_OPEN_TAP_MARK);
  devLog('tap');
}

export function markSettingsOpenStateRequested(): void {
  if (!timer.getMark(SETTINGS_OPEN_TAP_MARK)) {
    timer.mark(SETTINGS_OPEN_TAP_MARK, { source: 'state' });
  }
  timer.mark(SETTINGS_OPEN_STATE_MARK);
  devLog('state-open');
}

export function markSettingsOpenFirstVisible(
  metadata?: Record<string, unknown>
): void {
  if (!timer.getMark(SETTINGS_OPEN_TAP_MARK)) {
    timer.mark(SETTINGS_OPEN_TAP_MARK, { source: 'modal' });
  }
  timer.mark(SETTINGS_OPEN_VISIBLE_MARK, metadata);
  const measure = timer.measure(
    SETTINGS_OPEN_VISIBLE_MEASURE,
    SETTINGS_OPEN_TAP_MARK,
    SETTINGS_OPEN_VISIBLE_MARK,
    metadata
  );
  if (measure) {
    devLog('first-visible', {
      ...metadata,
      durationMs: roundedDuration(measure.duration),
    });
  }
}

export function markSettingsOpenContentReady(
  metadata?: Record<string, unknown>
): void {
  if (!timer.getMark(SETTINGS_OPEN_TAP_MARK)) {
    timer.mark(SETTINGS_OPEN_TAP_MARK, { source: 'modal' });
  }
  timer.mark(SETTINGS_OPEN_READY_MARK, metadata);
  const measure = timer.measure(
    SETTINGS_OPEN_READY_MEASURE,
    SETTINGS_OPEN_TAP_MARK,
    SETTINGS_OPEN_READY_MARK,
    metadata
  );
  if (!measure) return;

  const durationMs = roundedDuration(measure.duration);
  devLog('content-ready', { ...metadata, durationMs });
  logSettingsOpened(durationMs);
}

export function clearSettingsOpenTiming(): void {
  timer.clear();
}

export function getSettingsOpenTimingSnapshot() {
  return timer.export();
}
