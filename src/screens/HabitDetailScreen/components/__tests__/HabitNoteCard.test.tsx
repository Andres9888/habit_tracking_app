import { render } from '@testing-library/react-native';
import type { Habit } from '../../../features/habits/types';
import { HabitNoteCard } from '../HabitNoteCard';

jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(),
}));

const habitId = 'habit_1' as Habit['_id'];

describe('HabitNoteCard', () => {
  it("labels the field as Today's note with the new placeholder", () => {
    const { getByLabelText, getByPlaceholderText, getByText } = render(
      <HabitNoteCard
        canEdit
        date={new Date().toISOString().slice(0, 10)}
        habitId={habitId}
      />
    );
    expect(getByText("Today's note")).toBeTruthy();
    expect(getByPlaceholderText('How did it go today?')).toBeTruthy();
    expect(getByLabelText("Today's note")).toBeTruthy();
  });

  it('disables writing when the day is not complete', () => {
    const { getByPlaceholderText, getByText } = render(
      <HabitNoteCard canEdit={false} date='2026-08-01' habitId={habitId} />
    );
    expect(getByText('complete day to write')).toBeTruthy();
    expect(
      getByPlaceholderText('Complete this day to add a note')
    ).toBeTruthy();
  });

  it('keeps legacy habit-level notes reachable as About this habit', () => {
    const { getByDisplayValue, getByLabelText } = render(
      <HabitNoteCard
        canEdit
        date='2026-08-01'
        habitId={habitId}
        habitNotes='Built this during a tough week at work.'
        note='Felt solid today.'
      />
    );
    expect(getByDisplayValue('Felt solid today.')).toBeTruthy();
    expect(
      getByLabelText(
        'About this habit: Built this during a tough week at work.'
      )
    ).toBeTruthy();
  });

  it('surfaces a selected day note from the heatmap selection', () => {
    const { getByDisplayValue, getByText } = render(
      <HabitNoteCard
        canEdit
        date='2026-07-15'
        habitId={habitId}
        note='Rainy morning — still showed up.'
      />
    );
    expect(getByText('Day note')).toBeTruthy();
    expect(getByDisplayValue('Rainy morning — still showed up.')).toBeTruthy();
  });
});
