/**
 * Smoke coverage for the recommitment stack: hero, This week, record doors,
 * and insight line. History and Analytics are their own screens. Pause is
 * not on Detail.
 */
import { fireEvent, render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { HabitDetailContent } from '../HabitDetailContent';
import { formatDayShort } from '../DayDetailScreen/dayCopy';

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

function weekLabel(offsetDays: number, state: string): string {
  return `${formatDayShort(ymd(offsetDays))}, ${state}`;
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
    onRecoveryChange?: (isRecovery: boolean) => void;
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
      onRecoveryChange={handlers.onRecoveryChange}
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

    expect(getByLabelText(weekLabel(-1, 'missed'))).toBeTruthy();
    expect(getByLabelText(weekLabel(0, 'not scheduled'))).toBeTruthy();

    expect(getByText('Today · not scheduled')).toBeTruthy();
    expect(getByText('Nothing is owed today.')).toBeTruthy();
    expect(getByText('Not scheduled today')).toBeTruthy();
    expect(queryByLabelText('Complete today')).toBeNull();
    expect(
      queryByText('Yesterday got away. Today doesn’t have to.')
    ).toBeNull();
  });

  it('renders the hero, This week card and record doors', () => {
    completeYesterday();
    const { getByText, queryByText } = renderContent();
    expect(getByText('Wake-Up Movement')).toBeTruthy();
    expect(getByText('Daily')).toBeTruthy();
    expect(getByText('This week')).toBeTruthy();
    expect(getByText('1 day logged')).toBeTruthy();
    expect(getByText('The record')).toBeTruthy();
    expect(getByText('Full history')).toBeTruthy();
    expect(getByText('Runs, calendar and the year grid')).toBeTruthy();
    expect(getByText('Analytics')).toBeTruthy();
    expect(getByText('Trend, patterns and what’s working')).toBeTruthy();
    expect(queryByText('Going away?')).toBeNull();
    expect(queryByText('Pause without losing your streak')).toBeNull();
  });

  it('announces readable week dates and keeps future pips inert', () => {
    // The strip is Monday-first, so "tomorrow" is only in this week from Monday
    // through Saturday. On a Sunday the honest assertion is the other one:
    // there is no upcoming pip at all.
    const daysLeftInWeek = 6 - ((new Date().getDay() + 6) % 7);
    const { getByLabelText, queryByLabelText } = renderContent();

    if (daysLeftInWeek === 0) {
      expect(queryByLabelText(weekLabel(1, 'upcoming'))).toBeNull();
      return;
    }
    const upcoming = getByLabelText(weekLabel(daysLeftInWeek, 'upcoming'));

    expect(upcoming.props.accessibilityState).toEqual({ disabled: true });
  });

  it('opens History and Analytics from the record doors', () => {
    completeYesterday();
    const onOpenHistory = jest.fn();
    const onOpenAnalytics = jest.fn();
    const { getByLabelText } = renderContent(
      {},
      { onOpenAnalytics, onOpenHistory }
    );
    fireEvent.press(getByLabelText('Full history'));
    fireEvent.press(getByLabelText('Analytics'));
    expect(onOpenHistory).toHaveBeenCalledTimes(1);
    expect(onOpenAnalytics).toHaveBeenCalledTimes(1);
  });

  it('keeps lifecycle controls and standing scoreboards off Detail', () => {
    const { queryByLabelText, queryByText } = renderContent();

    expect(queryByText('Manage')).toBeNull();
    expect(queryByLabelText('Archive')).toBeNull();
    expect(queryByLabelText('Delete habit')).toBeNull();
    expect(queryByText('Where you stand')).toBeNull();
    expect(queryByText('Current streak')).toBeNull();
    expect(queryByText('Best streak')).toBeNull();
    expect(queryByText('Pause')).toBeNull();
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
    expect(getByText('Logged today')).toBeTruthy();
    expect(getByLabelText(weekLabel(0, 'completed'))).toBeTruthy();
    expect(getByLabelText('Logged today. Tap to undo.')).toBeTruthy();
    expect(getByLabelText('Add a note')).toBeTruthy();
  });

  it('puts the why before today’s action and demotes strength below it', () => {
    completeYesterday();
    const result = renderContent();
    const { getByLabelText, getByText, queryByText } = result;
    expect(getByLabelText(/Habit strength 68 percent/)).toBeTruthy();
    expect(
      queryByText(
        'Momentum from every check-in, weighted toward recent days. A miss dips it — it never resets.'
      )
    ).toBeTruthy();
    expect(queryByText('↑ 3')).toBeNull();
    expect(queryByText('9 day streak')).toBeNull();
    expect(
      getByText(
        'Momentum from every check-in, weighted toward recent days. A miss dips it — it never resets.'
      )
    ).toBeTruthy();
    expect(queryByText('Habit strength · a snapshot, not a score')).toBeNull();

    const text = renderedStrings(result.toJSON());
    expect(
      text.indexOf('Have energy for the kids before the day takes over.')
    ).toBeLessThan(text.indexOf('Complete today'));
    expect(text.indexOf('Complete today')).toBeLessThan(
      text.indexOf('This week')
    );
    expect(text.indexOf('This week')).toBeLessThan(text.indexOf('Strong'));
  });

  it('quotes the user’s why when yesterday was kept', () => {
    completeYesterday();
    const { getByLabelText, getByText } = renderContent();
    expect(getByText(/Have energy for the kids/)).toBeTruthy();
    expect(getByLabelText(weekLabel(-1, 'completed'))).toBeTruthy();
  });

  it('swaps the why card for recovery when yesterday was missed', () => {
    const result = renderContent();
    const { getByLabelText, getByText, queryByText } = result;
    expect(
      getByText('Yesterday got away. Today doesn’t have to.')
    ).toBeTruthy();
    expect(
      getByLabelText(
        'Yesterday got away. Today doesn’t have to. Strength dipped, not to zero, and your 12-day record still stands. The only rule that matters today: never miss twice.'
      )
    ).toBeTruthy();
    expect(getByText('Two-minute version')).toBeTruthy();
    expect(
      getByText(
        'Try two minutes of Wake-Up Movement. Stopping early still counts.'
      )
    ).toBeTruthy();
    expect(queryByText(/Showing up is the streak/)).toBeNull();
    expect(getByLabelText(weekLabel(-1, 'missed'))).toBeTruthy();
    expect(queryByText(/Have energy for the kids/)).toBeNull();
    // Strength is suppressed after a miss; the Analytics DOOR is not. Recovery
    // is the ordinary state for anyone who did not log the last scheduled day,
    // and these rows are the only route to Analytics in the app.
    expect(getByText('Analytics')).toBeTruthy();
    expect(
      queryByText(
        'Habit strength · a single snapshot. Trends live in Analytics.'
      )
    ).toBeNull();

    const text = renderedStrings(result.toJSON());
    expect(
      text.indexOf('Yesterday got away. Today doesn’t have to.')
    ).toBeLessThan(text.indexOf('Complete today'));
    expect(queryByText('Strong')).toBeNull();
  });

  it('keeps both record doors reachable during recovery', () => {
    const onOpenAnalytics = jest.fn();
    const { getByLabelText } = renderContent({}, { onOpenAnalytics });

    fireEvent.press(getByLabelText('Analytics'));

    expect(onOpenAnalytics).toHaveBeenCalledTimes(1);
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
    expect(getByLabelText(weekLabel(-1, 'completed'))).toBeTruthy();
    expect(
      queryByText('Yesterday got away. Today doesn’t have to.')
    ).toBeNull();
  });

  it('keeps a currently paused habit neutral instead of offering completion or recovery', () => {
    const { getByText, queryByLabelText, queryByText } = renderContent({
      pausedAt: Date.now() - 86_400_000,
      resumedAt: undefined,
    });

    expect(getByText('Today · paused')).toBeTruthy();
    expect(
      getByText('Check-ins resume when this habit is active again.')
    ).toBeTruthy();
    expect(queryByLabelText('Complete today')).toBeNull();
    expect(
      queryByText('Yesterday got away. Today doesn’t have to.')
    ).toBeNull();
  });

  it('does not turn a day before habit creation into recovery', () => {
    const { queryByText } = renderContent({
      createdAt: Date.now(),
    });

    expect(
      queryByText('Yesterday got away. Today doesn’t have to.')
    ).toBeNull();
  });

  it('reserves the recovery guidance slot in every hero state', () => {
    completeYesterday();
    const ready = renderContent();
    const readySlot = ready.getByTestId('hero-secondary-slot');
    const readyHeight = readySlot.props.style.height;
    ready.unmount();

    trackingRows.length = 0;
    const recovery = renderContent();
    expect(recovery.getByTestId('hero-secondary-slot').props.style.height).toBe(
      readyHeight
    );
    expect(readyHeight).toBeGreaterThan(0);
  });

  it('names the last scheduled day when recovery follows an off day', () => {
    const lastScheduled = new Date();
    lastScheduled.setDate(lastScheduled.getDate() - 3);
    const today = new Date();
    const weekday = WEEKDAY_NAME[lastScheduled.getDay()];
    const { getByText, queryByText } = renderContent({
      daysOfWeek: [lastScheduled.getDay(), today.getDay()],
    });

    expect(
      getByText(`${weekday} got away. Today doesn’t have to.`)
    ).toBeTruthy();
    expect(queryByText(/Yesterday got away/)).toBeNull();
  });

  it('reports recovery upward so the fixed header can take the same wash', () => {
    const onRecoveryChange = jest.fn();
    const recovery = renderContent({}, { onRecoveryChange });
    expect(onRecoveryChange).toHaveBeenLastCalledWith(true);
    recovery.unmount();

    onRecoveryChange.mockClear();
    completeYesterday();
    renderContent({}, { onRecoveryChange });
    expect(onRecoveryChange).toHaveBeenLastCalledWith(false);
  });

  it('keeps streak totals off the This week card', () => {
    completeYesterday();
    const { getByText, queryByText } = renderContent();

    expect(getByText('This week')).toBeTruthy();
    expect(getByText('1 day logged')).toBeTruthy();
    expect(queryByText('Current')).toBeNull();
    expect(queryByText('Longest')).toBeNull();
    expect(queryByText('Days done')).toBeNull();
    expect(queryByText(/today starts the next one/)).toBeNull();
    expect(queryByText(/from your best streak/)).toBeNull();
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
    expect(
      queryByText('Yesterday got away. Today doesn’t have to.')
    ).toBeNull();
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
