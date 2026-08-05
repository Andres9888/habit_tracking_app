/**
 * Scenarios S07–S10: Habit detail, completion, edit, and streak goal.
 *
 * S07 Detail view — PASS: streak, strength section, and the completion heatmap
 *   render for the opened habit.
 * S08 Complete from detail — PASS: tapping "Mark as done for today" calls the
 *   habits:toggleHabit mutation.
 * S09 Edit a habit — PASS: tapping "Edit habit" invokes the onEdit handler.
 * S10 Streak goal — PASS: the streak-goal control and its recommended option
 *   ("66d") render.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import HabitDetailScreen from '../../src/screens/HabitDetailScreen';
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
      onPause={() => {}}
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

  it('S07: shows streak, strength and the completion heatmap', async () => {
    renderDetail();
    expect(await screen.findByText('5-day streak')).toBeTruthy();
    expect(screen.getByText('Strength')).toBeTruthy();
    expect(screen.getByLabelText('Habit completion heatmap')).toBeTruthy();
  });

  it('S08: marking done for today toggles completion', async () => {
    renderDetail();
    const done = await screen.findByLabelText('Mark as done for today');
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

  it('S10: exposes the streak goal control with a recommended option', async () => {
    renderDetail();
    expect(await screen.findByLabelText('Set streak goal')).toBeTruthy();
    expect(screen.getByLabelText('66d, recommended')).toBeTruthy();
  });
});
