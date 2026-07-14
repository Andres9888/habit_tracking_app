import { logInteraction } from '../../src/lib/analytics/interactions';
import {
  clearSettingsOpenTiming,
  getSettingsOpenTimingSnapshot,
  markSettingsOpenContentReady,
  markSettingsOpenFirstVisible,
  markSettingsOpenStateRequested,
  markSettingsOpenTap,
  setSettingsOpenTimingInteractionLogger,
} from '../../src/lib/performance/settingsOpenTiming';

jest.mock('../../src/lib/analytics/interactions', () => ({
  logInteraction: jest.fn(),
}));

const mockLogInteraction = jest.mocked(logInteraction);

describe('settings open timing', () => {
  beforeEach(() => {
    clearSettingsOpenTiming();
    jest.clearAllMocks();
    setSettingsOpenTimingInteractionLogger(mockLogInteraction);
  });

  afterEach(() => {
    setSettingsOpenTimingInteractionLogger(undefined);
    clearSettingsOpenTiming();
  });

  it('records tap, state-open, first-visible, and content-ready marks', () => {
    markSettingsOpenTap();
    markSettingsOpenStateRequested();
    markSettingsOpenFirstVisible({ isLoading: true });
    markSettingsOpenContentReady({ archivedHabitsCount: 2 });

    const snapshot = getSettingsOpenTimingSnapshot();
    const markNames = snapshot.marks.map((mark) => mark.name);
    const measureNames = snapshot.measures.map((measure) => measure.name);

    expect(markNames).toEqual(
      expect.arrayContaining([
        'settings:open:tap',
        'settings:open:state-open',
        'settings:open:first-visible',
        'settings:open:content-ready',
      ])
    );
    expect(measureNames).toEqual(
      expect.arrayContaining([
        'settings:open:tap-to-first-visible',
        'settings:open:tap-to-content-ready',
      ])
    );
    expect(mockLogInteraction).toHaveBeenCalledWith('settings_opened', {
      durationMs: expect.any(Number),
    });
  });

  it('creates a fallback tap mark when Settings opens outside the bottom bar', () => {
    markSettingsOpenStateRequested();
    markSettingsOpenContentReady();

    const snapshot = getSettingsOpenTimingSnapshot();
    expect(snapshot.marks.map((mark) => mark.name)).toContain(
      'settings:open:tap'
    );
    expect(mockLogInteraction).toHaveBeenCalledWith('settings_opened', {
      durationMs: expect.any(Number),
    });
  });
});
