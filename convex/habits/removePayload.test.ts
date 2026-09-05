import type { Doc, Id } from '../_generated/dataModel';
import {
  buildRemovedHabitPayload,
  type RemovedHabitPayload,
} from './removePayload';

const HABIT_ID = 'habit_1' as Id<'habits'>;
const TEMPLATE_ID = 'template_1' as Id<'templates'>;

function makeHabit(): Doc<'habits'> {
  return {
    _creationTime: 1_700_000_000_000,
    _id: HABIT_ID,
    accessibility: 0.82,
    archived: true,
    archivedAt: 1_700_000_500_000,
    clientRequestId: 'req-abc',
    createdAt: 1_699_000_000_000,
    currentStreak: 12,
    habitDecayParam: 0.175,
    habitGainParam: 0.15,
    name: 'Meditate',
    order: 3,
    pendingStrengthRecalcId: 'sched_1' as Doc<'habits'>['pendingStrengthRecalcId'],
    pendingStrengthRecalcRequestedAt: 1_700_000_400_000,
    progressEmojis: {
      automatic: '🌳',
      building: '🌿',
      developing: '🪴',
      starting: '🌱',
      strong: '🌲',
    },
    scienceNote: 'Ten minutes is enough to move the needle.',
    strength: 0.61,
    strengthAlgorithm: 'forgiving',
    strengthUpdatedAt: 1_700_000_300_000,
    totalCompletions: 40,
    totalMisses: 5,
    userId: 'user_1',
  };
}

/** The payload is stored as JSON, so assert on what survives a round trip. */
function roundTrip(payload: RemovedHabitPayload): RemovedHabitPayload {
  return JSON.parse(JSON.stringify(payload)) as RemovedHabitPayload;
}

describe('buildRemovedHabitPayload', () => {
  const payload = () =>
    roundTrip(
      buildRemovedHabitPayload(
        makeHabit(),
        [{ completed: true, date: '2026-09-01' }],
        [{ date: '2026-09-01', note: 'felt good' }],
        [{ importedAt: 1_699_000_000_000, templateId: TEMPLATE_ID }]
      )
    );

  it('keeps the fields that used to be dropped on undo', () => {
    const { habit } = payload();
    expect(habit.progressEmojis).toEqual({
      automatic: '🌳',
      building: '🌿',
      developing: '🪴',
      starting: '🌱',
      strong: '🌲',
    });
    expect(habit.strengthAlgorithm).toBe('forgiving');
    expect(habit.archived).toBe(true);
    expect(habit.archivedAt).toBe(1_700_000_500_000);
    expect(habit.accessibility).toBe(0.82);
    expect(habit.totalCompletions).toBe(40);
    expect(habit.totalMisses).toBe(5);
    expect(habit.habitDecayParam).toBe(0.175);
    expect(habit.habitGainParam).toBe(0.15);
    expect(habit.scienceNote).toBe('Ten minutes is enough to move the needle.');
  });

  it('captures templateUsage rows so habits.get keeps its template join', () => {
    expect(payload().templateUsage).toEqual([
      { importedAt: 1_699_000_000_000, templateId: TEMPLATE_ID },
    ]);
  });

  it('keeps the fields restore already relied on', () => {
    const restored = payload();
    expect(restored.habit.name).toBe('Meditate');
    expect(restored.habit.createdAt).toBe(1_699_000_000_000);
    expect(restored.habit.currentStreak).toBe(12);
    expect(restored.tracking).toEqual([{ completed: true, date: '2026-09-01' }]);
    expect(restored.dayNotes).toEqual([
      { date: '2026-09-01', note: 'felt good' },
    ]);
  });

  it('drops identity, ordering and scheduler fields that restore re-derives', () => {
    const habit = payload().habit as Record<string, unknown>;
    for (const key of [
      '_creationTime',
      '_id',
      'clientRequestId',
      'order',
      'pendingStrengthRecalcId',
      'pendingStrengthRecalcRequestedAt',
      'strengthUpdatedAt',
      'userId',
    ]) {
      expect(habit).not.toHaveProperty(key);
    }
  });
});
