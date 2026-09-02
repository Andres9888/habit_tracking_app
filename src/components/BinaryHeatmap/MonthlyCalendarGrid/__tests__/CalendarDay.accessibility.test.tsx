import { render } from '@testing-library/react-native';
import { CalendarDay } from '../CalendarDay';
import type { DayData } from '../types';

describe('CalendarDay accessibility', () => {
  it('announces the canonical paused state instead of implying a miss', () => {
    const day: DayData = {
      date: new Date(2026, 7, 12),
      dateString: '2026-08-12',
      dayNumber: 12,
      isBeforeCreation: false,
      isCompleted: false,
      isCurrentMonth: true,
      isFuture: false,
      isMissed: false,
      isToday: false,
      state: 'paused',
    };
    const { getByLabelText } = render(
      <CalendarDay
        completedBg='#15803d'
        day={day}
        habitColor='#15803d'
        surfaceBg='#ffffff'
        textColors={{
          inverse: '#ffffff',
          muted: '#aaaaaa',
          primary: '#111111',
          tertiary: '#777777',
        }}
        onPress={jest.fn()}
      />
    );

    expect(getByLabelText('Day 12, paused')).toBeTruthy();
  });

  it('does not announce a miss for adjacent-month filler cells', () => {
    const day: DayData = {
      date: new Date(2026, 6, 29),
      dateString: '2026-07-29',
      dayNumber: 29,
      isBeforeCreation: false,
      isCompleted: false,
      isCurrentMonth: false,
      isFuture: false,
      isMissed: false,
      isToday: false,
      state: 'missed',
    };
    const { getByLabelText } = render(
      <CalendarDay
        completedBg='#15803d'
        day={day}
        habitColor='#15803d'
        surfaceBg='#ffffff'
        textColors={{
          inverse: '#ffffff',
          muted: '#aaaaaa',
          primary: '#111111',
          tertiary: '#777777',
        }}
        onPress={jest.fn()}
      />
    );

    expect(getByLabelText('Day 29, not available')).toBeTruthy();
  });
});
