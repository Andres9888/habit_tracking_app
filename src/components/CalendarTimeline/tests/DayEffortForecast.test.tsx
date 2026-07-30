import { render } from '@testing-library/react-native';
import { DayEffortForecast } from '../components/DayEffortForecast';
import { getEffortAccessibilityText } from '../components/DayCell.helpers';

describe('DayEffortForecast', () => {
  it('stays hidden when a calendar consumer has no forecast data', () => {
    const { toJSON } = render(
      <DayEffortForecast isCurrentDay isUpcoming={false} />
    );

    expect(toJSON()).toBeNull();
  });

  it('shows remaining effort for today', () => {
    const { getByLabelText, getByText } = render(
      <DayEffortForecast
        capacityMinutes={60}
        isCurrentDay
        isUpcoming={false}
        plannedMinutes={45}
        remainingMinutes={25}
      />
    );

    expect(getByText('~25m left')).toBeTruthy();
    expect(getByLabelText('About 25 minutes remaining today')).toBeTruthy();
  });

  it('announces an over-capacity future forecast', () => {
    const { getByLabelText, getByText } = render(
      <DayEffortForecast
        capacityMinutes={60}
        isCurrentDay={false}
        isUpcoming
        plannedMinutes={75}
        remainingMinutes={75}
      />
    );

    expect(getByText('75m')).toBeTruthy();
    expect(
      getByLabelText('Forecast 75 minutes, over 60 minute capacity')
    ).toBeTruthy();
  });

  it('adds effort context to the parent day-cell announcement', () => {
    expect(
      getEffortAccessibilityText({
        capacityMinutes: 60,
        isCurrentDay: false,
        isUpcoming: true,
        plannedMinutes: 75,
      })
    ).toBe('75 minute forecast, over 60 minute capacity');
    expect(
      getEffortAccessibilityText({
        isCurrentDay: true,
        isUpcoming: false,
        remainingMinutes: 25,
      })
    ).toBe('about 25 minutes remaining');
  });
});
