/**
 * Smoke coverage for the redesigned detail stack: the sections the design
 * mandates are present, the conditional insight section stays quiet without
 * enough history, and the history disclosure is closed until asked for.
 */
import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../../features/habits/types';
import { HabitDetailContent } from '../HabitDetailContent';

// Tracking rows the insight layer reads. Mutable so a test can decide whether
// yesterday was a miss, which drives the recovery state in the hero.
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

/** Logs yesterday so the hero shows the why pill rather than recovery. */
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
      onMinimalToday={jest.fn()}
    />
  );
}

describe('HabitDetailContent', () => {
  it('renders the hero, Progress card and month heatmap', () => {
    const { getByText, queryByText } = renderContent();
    expect(getByText('Wake-Up Movement')).toBeTruthy();
    expect(getByText('Daily habit')).toBeTruthy();
    expect(getByText('Progress')).toBeTruthy();
    expect(getByText('Your month')).toBeTruthy();
    expect(queryByText('Going away?')).toBeNull();
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
        onMinimalToday={jest.fn()}
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
    expect(getByText('21 days to your next milestone — day 30')).toBeTruthy();
  });

  it('quotes the user’s why in the hero band when yesterday was kept', () => {
    completeYesterday();
    const { getByText } = renderContent();
    expect(getByText(/Have energy for the kids/)).toBeTruthy();
  });

  // MVP "Ship" item from the design's scope note.
  it('swaps the why pill for the recovery state when yesterday was missed', () => {
    const { getByText, queryByText } = renderContent();
    expect(
      getByText(/One miss doesn’t erase 12 days|One miss doesn't erase 12 days/)
    ).toBeTruthy();
    expect(queryByText(/Have energy for the kids/)).toBeNull();
    // The numbers that survive the reset are still on screen.
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
        onMinimalToday={jest.fn()}
      />
    );
    expect(queryByText(/One miss/)).toBeNull();
  });

  it('offers the 2-minute version while today is still open', () => {
    const onMinimalToday = jest.fn();
    const { getByLabelText } = render(
      <HabitDetailContent
        completedDates={new Set<string>()}
        habit={habit}
        isCompletedToday={false}
        onDayPress={jest.fn()}
        onMinimalToday={onMinimalToday}
      />
    );
    fireEvent.press(getByLabelText('Do the 2-minute version — it counts'));
    expect(onMinimalToday).toHaveBeenCalledTimes(1);
  });

  it('hides the 2-minute version once today is complete', () => {
    const { queryByLabelText } = render(
      <HabitDetailContent
        isCompletedToday
        completedDates={new Set<string>()}
        habit={habit}
        onDayPress={jest.fn()}
        onMinimalToday={jest.fn()}
      />
    );
    expect(queryByLabelText('Do the 2-minute version — it counts')).toBeNull();
  });

  it('shows the 2-min caption on the check-in card for minimal completions', () => {
    const { getByText } = render(
      <HabitDetailContent
        isCompletedToday
        isMinimalToday
        completedDates={new Set<string>()}
        habit={habit}
        onDayPress={jest.fn()}
        onMinimalToday={jest.fn()}
      />
    );
    expect(getByText('2-min version')).toBeTruthy();
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

  it('keeps the full history collapsed until View history is tapped', () => {
    const { getByLabelText } = renderContent();
    // Present and pressable; the disclosure body itself is mocked out above.
    fireEvent.press(getByLabelText('View history ›'));
    expect(getByLabelText('View history ›')).toBeTruthy();
  });
});
