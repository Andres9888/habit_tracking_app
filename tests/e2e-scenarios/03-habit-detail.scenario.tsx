/**
 * Scenarios S07–S10: Habit detail, completion, edit, and streak goal.
 *
 * S07 Detail view — PASS: today's action, strength snapshot, and record routes
 *   render for the opened habit.
 * S08 Complete from detail — PASS: tapping "Complete today" calls the
 *   habits:toggleHabit mutation.
 * S09 Edit a habit — PASS: tapping "Edit habit" invokes the onEdit handler.
 * S10 Streak goal — PASS: Edit → More to customize exposes the recommended
 *   streak-goal preset.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import HabitDetailScreen from '../../src/screens/HabitDetailScreen';
import HabitEditScreen from '../../src/screens/HabitEditScreen';
import {
  getMutation,
  makeHabit,
  renderScreen,
  resetConvex,
  seedCommonQueries,
} from './harness';

function renderDetail(extra: Record<string, unknown> = {}) {
  const onEdit = jest.fn();
  renderScreen(
    <HabitDetailScreen
      habit={makeHabit({
        name: 'Morning Run',
        currentStreak: 5,
        strength: 0.62,
      })}
      visible
      onClose={() => {}}
      onEdit={onEdit}
      onArchive={() => {}}
      onDelete={() => {}}
      onOpenCalendar={() => {}}
      tracking={[]}
      {...extra}
    />
  );
  return { onEdit };
}

describe('HabitDetailScreen', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
    getMutation('habits:toggleHabit');
  });

  it("S07: shows today's action, strength and record routes", async () => {
    renderDetail();
    expect(await screen.findByText('Morning Run')).toBeTruthy();
    expect(screen.getByLabelText('Complete today')).toBeTruthy();
    expect(screen.getByLabelText(/^Habit strength 62 percent/)).toBeTruthy();
    expect(screen.getByLabelText('History')).toBeTruthy();
    expect(screen.getByLabelText('Analytics')).toBeTruthy();
  });

  it('S08: marking done for today toggles completion', async () => {
    renderDetail();
    const done = await screen.findByLabelText('Complete today');
    fireEvent.press(done);
    await waitFor(() =>
      expect(getMutation('habits:toggleHabit')).toHaveBeenCalled()
    );
  });

  it('S09: tapping Edit invokes the edit handler', async () => {
    const { onEdit } = renderDetail();
    fireEvent.press(await screen.findByLabelText('Edit habit'));
    await waitFor(() => expect(onEdit).toHaveBeenCalled());
  });

  it('S10: exposes the recommended streak goal in the edit surface', async () => {
    const habit = makeHabit({ goalDuration: 0 });
    renderScreen(
      <HabitEditScreen
        habitId={habit._id}
        initialHabit={habit}
        visible
        onClose={() => {}}
      />
    );
    fireEvent.press(
      await screen.findByLabelText('More to customize, 3 options')
    );
    expect(
      await screen.findByLabelText('7 day streak goal, STARTER')
    ).toBeTruthy();
  });
});
