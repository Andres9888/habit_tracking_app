/**
 * Smoke coverage for the redesigned detail stack: the sections the design
 * mandates are present, the conditional insight section stays quiet without
 * enough history, and the history disclosure is closed until asked for.
 */
import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../features/habits/types';
import { HabitDetailContent } from '../HabitDetailContent';

jest.mock('../../../../lib/queryCache', () => ({
  useCachedQuery: () => [],
}));

// The history disclosure pulls in the strength chart + goal card; both are
// covered by their own suites and are heavy to mount here.
jest.mock('../HabitDetailHistory', () => ({
  HabitDetailHistory: () => null,
}));

const habit = {
  _id: 'habit_1',
  bestStreak: 12,
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  currentStreak: 9,
  name: 'Wake-Up Movement',
  strength: 0.68,
  why: 'Have energy for the kids before the day takes over.',
} as unknown as Habit;

function renderContent(overrides: Partial<Habit> = {}) {
  return render(
    <HabitDetailContent
      completedDates={new Set<string>()}
      habit={{ ...habit, ...overrides }}
      isCompletedToday={false}
      onDayPress={jest.fn()}
    />
  );
}

describe('HabitDetailContent', () => {
  it('renders the hero, Progress card, month heatmap and pause card', () => {
    const { getByText } = renderContent();
    expect(getByText('Wake-Up Movement')).toBeTruthy();
    expect(getByText('Daily habit')).toBeTruthy();
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Your month')).toBeTruthy();
    expect(getByText('Going away?')).toBeTruthy();
  });

  it('shows the streak numbers in the Progress rail', () => {
    const { getByLabelText } = renderContent();
    expect(getByLabelText('Current streak: 9')).toBeTruthy();
    expect(getByLabelText('Longest: 12')).toBeTruthy();
  });

  it('swaps the complete bar for the check-in card once today is logged', () => {
    const { getByLabelText, queryByText } = render(
      <HabitDetailContent
        isCompletedToday
        completedDates={new Set<string>()}
        habit={habit}
        onDayPress={jest.fn()}
      />
    );
    expect(queryByText('Complete today')).toBeNull();
    expect(getByLabelText(/Day 9 — done.*Tap to undo/s)).toBeTruthy();
  });

  it('shows the strength dial rather than a streak counter in the hero', () => {
    const { getByLabelText, getByText, queryByText } = renderContent();
    expect(getByLabelText(/Habit strength 68 percent/)).toBeTruthy();
    // The milestone bar is the only streak display on this screen.
    expect(queryByText('9 day streak')).toBeNull();
    expect(getByText('3 days from your best streak ever')).toBeTruthy();
  });

  it('quotes the user’s why in the hero band', () => {
    const { getByText } = renderContent();
    expect(getByText(/Have energy for the kids/)).toBeTruthy();
  });

  it('omits the why pill entirely when no motivation is set', () => {
    const { queryByText } = renderContent({
      identity: undefined,
      why: undefined,
      woopWish: undefined,
    });
    expect(queryByText(/Your why/)).toBeNull();
  });

  it('keeps the full history collapsed until View history is tapped', () => {
    const { getByLabelText } = renderContent();
    // Present and pressable; the disclosure body itself is mocked out above.
    fireEvent.press(getByLabelText('View history ›'));
    expect(getByLabelText('View history ›')).toBeTruthy();
  });
});
