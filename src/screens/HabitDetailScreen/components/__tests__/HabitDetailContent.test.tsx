/**
 * Smoke coverage for the recommitment stack: hero, Progress, record doors,
 * and pause. History and Analytics are their own screens.
 */
import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../features/habits/types';
import { HabitDetailContent } from '../HabitDetailContent';

const trackingRows: {
  completed: boolean;
  date: string;
  _creationTime: number;
}[] = [];
jest.mock('../../../../lib/queryCache', () => ({
  useCachedQuery: () => trackingRows,
}));

function ymd(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function completeYesterday() {
  trackingRows.push({
    _creationTime: Date.now(),
    completed: true,
    date: ymd(-1),
  });
}

beforeEach(() => {
  trackingRows.length = 0;
});

const habit = {
  _id: 'habit_1',
  bestStreak: 12,
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  currentStreak: 9,
  name: 'Wake-Up Movement',
  strength: 0.68,
  why: 'Have energy for the kids before the day takes over.',
} as unknown as Habit;

function renderContent(
  overrides: Partial<Habit> = {},
  handlers: {
    onOpenAnalytics?: () => void;
    onOpenHistory?: () => void;
  } = {}
) {
  return render(
    <HabitDetailContent
      completedDates={new Set<string>()}
      habit={{ ...habit, ...overrides }}
      isCompletedToday={false}
      onDayPress={jest.fn()}
      onOpenAnalytics={handlers.onOpenAnalytics}
      onOpenHistory={handlers.onOpenHistory}
    />
  );
}

describe('HabitDetailContent', () => {
  it('renders the hero, Progress card, record doors and pause card', () => {
    const { getByText } = renderContent();
    expect(getByText('Wake-Up Movement')).toBeTruthy();
    expect(getByText('Daily habit')).toBeTruthy();
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('The record')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Analytics')).toBeTruthy();
    expect(getByText('Going away?')).toBeTruthy();
  });

  it('opens History and Analytics from the record doors', () => {
    const onOpenHistory = jest.fn();
    const onOpenAnalytics = jest.fn();
    const { getByLabelText } = renderContent(
      {},
      { onOpenAnalytics, onOpenHistory }
    );
    fireEvent.press(getByLabelText('History'));
    fireEvent.press(getByLabelText('Analytics'));
    expect(onOpenHistory).toHaveBeenCalledTimes(1);
    expect(onOpenAnalytics).toHaveBeenCalledTimes(1);
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
    expect(queryByText('9 day streak')).toBeNull();
    expect(getByText('3 days from your best streak ever')).toBeTruthy();
  });

  it('quotes the user’s why in the hero band when yesterday was kept', () => {
    completeYesterday();
    const { getByText } = renderContent();
    expect(getByText(/Have energy for the kids/)).toBeTruthy();
  });

  it('swaps the why pill for the recovery state when yesterday was missed', () => {
    const { getByText, queryByText } = renderContent();
    expect(
      getByText(/One miss doesn’t erase 12 days|One miss doesn't erase 12 days/)
    ).toBeTruthy();
    expect(queryByText(/Have energy for the kids/)).toBeNull();
    expect(getByText('Best streak')).toBeTruthy();
  });

  it('keeps the recovery state away once today is logged', () => {
    completeYesterday();
    const { queryByText } = render(
      <HabitDetailContent
        isCompletedToday
        completedDates={new Set<string>()}
        habit={habit}
        onDayPress={jest.fn()}
      />
    );
    expect(queryByText(/One miss/)).toBeNull();
  });

  it('falls back to identity on Detail when why is empty', () => {
    completeYesterday();
    const { getByText } = renderContent({
      identity: 'I start moving before the day starts deciding for me.',
      why: '',
    });
    expect(getByText("Who you're becoming")).toBeTruthy();
    expect(
      getByText('I start moving before the day starts deciding for me.')
    ).toBeTruthy();
  });

  it('omits the why pill entirely when no motivation is set', () => {
    completeYesterday();
    const { queryByText } = renderContent({
      identity: undefined,
      why: undefined,
      woopWish: undefined,
    });
    expect(queryByText(/Your why/)).toBeNull();
  });
});
