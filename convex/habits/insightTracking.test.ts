import { projectInsightTracking } from './insightTracking';
import type { Doc } from '../_generated/dataModel';

describe('projectInsightTracking', () => {
  it('keeps insight fields and drops unused tracking columns', () => {
    const row = {
      _creationTime: 10,
      _id: 'tracking:1',
      completed: true,
      date: '2026-08-19',
      habitId: 'habits:1',
      minutes: 15,
      userId: 'user_1',
    } as unknown as Doc<'tracking'>;

    expect(projectInsightTracking(row)).toEqual({
      _creationTime: 10,
      completed: true,
      date: '2026-08-19',
    });
  });
});
