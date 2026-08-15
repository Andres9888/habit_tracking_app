import type { Doc } from './_generated/dataModel';
import { computeOverviewStats } from './analyticsOverview';

function habit(overrides: Partial<Doc<'habits'>>): Doc<'habits'> {
  return {
    _creationTime: 0,
    _id: 'habit_1',
    archived: false,
    createdAt: 0,
    name: 'Run',
    userId: 'user_1',
    ...overrides,
  } as Doc<'habits'>;
}

describe('computeOverviewStats strength scale', () => {
  it('reports stored 0-1 strength as a 0-100 percentage', () => {
    const stats = computeOverviewStats([
      habit({
        _id: 'habit_strong' as Doc<'habits'>['_id'],
        bestStreak: 20,
        currentStreak: 10,
        icon: '🔥',
        name: 'Run',
        strength: 0.65,
      }),
    ]);

    expect(stats.averageStrength).toBeCloseTo(65);
    expect(stats.strongestHabit?.strength).toBeCloseTo(65);
    expect(stats.rankedHabits[0]?.strength).toBeCloseTo(65);
  });

  it('averages multiple habits on the percentage scale', () => {
    const stats = computeOverviewStats([
      habit({
        _id: 'a' as Doc<'habits'>['_id'],
        name: 'A',
        strength: 0.8,
      }),
      habit({
        _id: 'b' as Doc<'habits'>['_id'],
        name: 'B',
        strength: 0.2,
      }),
    ]);

    expect(stats.averageStrength).toBeCloseTo(50);
    expect(stats.strongestHabit?.strength).toBeCloseTo(80);
    expect(stats.weakestHabit?.strength).toBeCloseTo(20);
  });
});
