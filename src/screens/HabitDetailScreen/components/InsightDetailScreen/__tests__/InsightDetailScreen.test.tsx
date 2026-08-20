import { render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { InsightDetailScreen } from '../InsightDetailScreen';

const working = {
  daypart: {
    endHour: 9,
    key: 'early' as const,
    label: 'Early morning',
    phrase: 'before 9 AM',
    startHour: 0,
  },
  otherPct: 20,
  reminderInWindow: true,
  reminderTime: '6:45 AM',
  sample: 20,
  sharePct: 80,
};

jest.mock('../../../insights', () => ({
  ...jest.requireActual('../../../insights'),
  useHabitInsights: () => ({
    daysOfData: 40,
    doneDates: new Set(['2026-08-10']),
    oneFix: null,
    working,
    yearCompletions: 20,
    yearRatePct: 50,
  }),
}));

const habit = {
  _id: 'habit_1',
  createdAt: Date.parse('2026-06-01T09:00:00Z'),
  name: 'Wake-Up Movement',
} as unknown as Habit;

describe('InsightDetailScreen', () => {
  it('shows evidence for a working pattern, not coaching amber', () => {
    const { getByText, queryByText } = render(
      <InsightDetailScreen
        habit={habit}
        insightId='working'
        onEdit={jest.fn()}
      />
    );
    expect(getByText('From your log')).toBeTruthy();
    expect(getByText('Check-ins land before 9 AM.')).toBeTruthy();
    expect(getByText(/Of 20 timestamped check-ins/)).toBeTruthy();
    expect(queryByText(/needs more check-ins/)).toBeNull();
    expect(queryByText("What's working")).toBeNull();
  });

  it('uses honest empty copy when the insight id is missing', () => {
    const { getByText, queryByText } = render(
      <InsightDetailScreen habit={habit} onEdit={jest.fn()} />
    );
    expect(getByText('Nothing to show for this insight yet.')).toBeTruthy();
    expect(queryByText(/needs more check-ins/)).toBeNull();
  });
});
