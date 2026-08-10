import { updateTrackingNoteGuard } from '../../../convex/habits/updateTrackingNoteGuard';

describe('updateTrackingNoteGuard', () => {
  it('rejects notes when the day is not complete', () => {
    expect(updateTrackingNoteGuard({ completed: false, exists: true })).toBe(
      'Complete the day before adding a note'
    );
  });

  it('rejects notes when no tracking row exists', () => {
    expect(updateTrackingNoteGuard({ completed: false, exists: false })).toBe(
      'Complete the day before adding a note'
    );
  });

  it('allows notes on completed days', () => {
    expect(
      updateTrackingNoteGuard({ completed: true, exists: true })
    ).toBeNull();
  });
});
