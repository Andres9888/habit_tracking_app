import { buildProductEvent, deliverProductEvent } from '../interactions';

describe('production analytics interactions', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('maps legacy events and drops private or entity-specific properties', () => {
    const event = buildProductEvent('habit_week_complete', {
      completedDate: '2026-07-13',
      habitId: 'habit-secret-id',
      habitName: 'Private habit name',
      streak: 7,
    });

    expect(event).toMatchObject({
      name: 'habit_week_completed',
      streak: 7,
    });
    expect(event).not.toHaveProperty('completedDate');
    expect(event).not.toHaveProperty('habitId');
    expect(event).not.toHaveProperty('habitName');
  });

  it('sends canonical allow-listed fields without blocking the caller', () => {
    const event = buildProductEvent('app_opened', {
      durationMs: 812,
      ignored: 'private',
      source: 'cold_start',
    });
    expect(event).not.toBeNull();
    if (!event) return;

    const send = jest.fn(() => Promise.resolve(null));
    deliverProductEvent(event, send);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        durationMs: 812,
        name: 'app_opened',
        source: 'cold_start',
      })
    );
  });

  it('does not transport unknown events', () => {
    expect(
      buildProductEvent('habit_name_changed', { habitName: 'Private' })
    ).toBeNull();
  });
});
