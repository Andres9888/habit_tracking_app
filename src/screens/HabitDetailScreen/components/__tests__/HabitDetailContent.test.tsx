/**
 * Smoke coverage for the recommitment stack: hero, This week, record doors,
 * and insight line. History and Analytics are their own screens. Pause is
 * not on Detail.
 */
import { fireEvent, render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
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

const WEEKDAY_NAME = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

function completeYesterday() {
  trackingRows.push({
    _creationTime: Date.now(),
    completed: true,
    date: ymd(-1),
  });
}

function renderedStrings(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(renderedStrings);
  if (node && typeof node === 'object' && 'children' in node) {
    return renderedStrings((node as { children?: unknown }).children);
  }
  return [];
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
    onPinnedChange?: (pinned: boolean) => void;
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
      onPinnedChange={handlers.onPinnedChange}
    />
  );
}

describe('HabitDetailContent', () => {
  it('removes today’s completion obligation when today is not scheduled', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { getByLabelText, getByText, queryByLabelText, queryByText } =
      renderContent({
        daysOfWeek: [yesterday.getDay()],
      });

    expect(getByLabelText(`${ymd(-1)}, missed`)).toBeTruthy();
    expect(getByLabelText(`${ymd(0)}, not scheduled`)).toBeTruthy();

    expect(getByText('Today · not scheduled')).toBeTruthy();
    expect(getByText('Nothing is owed today.')).toBeTruthy();
    expect(getByText('Not scheduled today')).toBeTruthy();
    expect(queryByLabelText('Complete today')).toBeNull();
    expect(queryByText('Pick it back up')).toBeNull();
  });

  it('renders the hero, This week card and record doors', () => {
    const { getByText, queryByText } = renderContent();
    expect(getByText('Wake-Up Movement')).toBeTruthy();
    expect(getByText('Daily')).toBeTruthy();
    expect(getByText('This week')).toBeTruthy();
    expect(getByText('0 days logged')).toBeTruthy();
    expect(getByText('The record')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Analytics')).toBeTruthy();
    expect(queryByText('Going away?')).toBeNull();
    expect(queryByText('Pause without losing your streak')).toBeNull();
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

  it('keeps streak numbers off the week strip', () => {
    const { queryByLabelText } = renderContent();
    expect(queryByLabelText('Current streak: 9')).toBeNull();
    expect(queryByLabelText('Longest: 12')).toBeNull();
  });

  it('turns completion into confirmation with the existing secondary actions', () => {
    const { getByLabelText, getByText } = render(
      <HabitDetailContent
        isCompletedToday
        completedDates={new Set<string>()}
        habit={habit}
        onDayPress={jest.fn()}
      />
    );
    expect(getByText('Today · complete')).toBeTruthy();
    expect(getByText('You showed up today.')).toBeTruthy();
    expect(getByText('Done today')).toBeTruthy();
    expect(getByLabelText(`${ymd(0)}, done`)).toBeTruthy();
    expect(getByLabelText('Undo today’s check-in')).toBeTruthy();
    expect(getByLabelText('Add a note')).toBeTruthy();
  });

  it('puts the why before today’s action and demotes strength below it', () => {
    completeYesterday();
    const result = renderContent();
    const { getByLabelText, getByText, queryByText } = result;
    expect(getByLabelText(/Habit strength 68 percent/)).toBeTruthy();
    expect(queryByText('9 day streak')).toBeNull();
    expect(
      getByText('Habit strength · a small snapshot, not today’s task')
    ).toBeTruthy();
    expect(queryByText('Habit strength · a snapshot, not a score')).toBeNull();

    const text = renderedStrings(result.toJSON());
    expect(
      text.indexOf('Have energy for the kids before the day takes over.')
    ).toBeLessThan(text.indexOf('Complete today'));
    expect(text.indexOf('Complete today')).toBeLessThan(text.indexOf('Strong'));
    expect(text.indexOf('Strong')).toBeLessThan(text.indexOf('This week'));
  });

  it('quotes the user’s why when yesterday was kept', () => {
    completeYesterday();
    const { getByLabelText, getByText } = renderContent();
    expect(getByText(/Have energy for the kids/)).toBeTruthy();
    expect(getByLabelText(`${ymd(-1)}, done`)).toBeTruthy();
  });

  it('swaps the why card for recovery when yesterday was missed', () => {
    const result = renderContent();
    const { getByLabelText, getByText, queryByText } = result;
    expect(getByText('Pick it back up')).toBeTruthy();
    expect(getByText(/Yesterday wasn’t logged/)).toBeTruthy();
    expect(getByLabelText(`${ymd(-1)}, missed`)).toBeTruthy();
    expect(queryByText(/Have energy for the kids/)).toBeNull();
    expect(queryByText('Best streak')).toBeNull();

    const text = renderedStrings(result.toJSON());
    expect(text.indexOf('Pick it back up')).toBeLessThan(
      text.indexOf('Complete today')
    );
    expect(text.indexOf('Complete today')).toBeLessThan(text.indexOf('Strong'));
  });

  it('does not claim recovery when the week record has the scheduled completion', () => {
    const { getByLabelText, getByText, queryByText } = render(
      <HabitDetailContent
        completedDates={new Set([ymd(-1)])}
        habit={habit}
        isCompletedToday={false}
        onDayPress={jest.fn()}
      />
    );

    expect(getByText(/Have energy for the kids/)).toBeTruthy();
    expect(getByLabelText(`${ymd(-1)}, done`)).toBeTruthy();
    expect(queryByText('Pick it back up')).toBeNull();
  });

  it('names the last scheduled day when recovery follows an off day', () => {
    const lastScheduled = new Date();
    lastScheduled.setDate(lastScheduled.getDate() - 3);
    const today = new Date();
    const weekday = WEEKDAY_NAME[lastScheduled.getDay()];
    const { getByText, queryByText } = renderContent({
      daysOfWeek: [lastScheduled.getDay(), today.getDay()],
    });

    expect(getByText('Pick it back up')).toBeTruthy();
    expect(getByText(new RegExp(`${weekday} wasn’t logged`))).toBeTruthy();
    expect(queryByText(/Yesterday wasn’t logged/)).toBeNull();
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
    expect(queryByText('Pick it back up')).toBeNull();
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

  it('omits the why card entirely when no motivation is set', () => {
    completeYesterday();
    const { queryByText } = renderContent({
      identity: undefined,
      why: undefined,
      woopWish: undefined,
    });
    expect(queryByText(/Your why/)).toBeNull();
  });

  it('pins the header title only after the hero name has scrolled away', () => {
    const onPinnedChange = jest.fn();
    const { UNSAFE_getByType } = renderContent({}, { onPinnedChange });
    const scroll = UNSAFE_getByType(ScrollView);
    fireEvent.scroll(scroll, {
      nativeEvent: { contentOffset: { x: 0, y: 40 } },
    });
    expect(onPinnedChange).toHaveBeenCalledWith(false);
    fireEvent.scroll(scroll, {
      nativeEvent: { contentOffset: { x: 0, y: 200 } },
    });
    expect(onPinnedChange).toHaveBeenCalledWith(true);
  });

  it('uses the habit’s real time-of-day on the schedule line', () => {
    const { getByText, queryByText } = renderContent({
      preferredTime: 'morning',
    });
    expect(getByText('Morning routine · Daily')).toBeTruthy();
    expect(queryByText('Daily habit')).toBeNull();
  });
});
