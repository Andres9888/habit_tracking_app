import { fireEvent, render } from '@testing-library/react-native';
import type { HabitDayState } from '../../../../../features/habits/habitDayState';
import { lightColors } from '../../../../../theme/darkColors';
import { buildInsightPalette } from '../../../insightPalette';
import { MonthGridCell } from '../MonthGridCell';
import type { MonthCell } from '../monthCells';

const palette = buildInsightPalette(lightColors, false);

const STATES: HabitDayState[] = [
  'before-creation',
  'completed',
  'missed',
  'open-today',
  'paused',
  'unscheduled',
  'upcoming',
];

function cell(state: HabitDayState, hasNote = false): MonthCell {
  return { date: '2026-08-12', hasNote, state };
}

describe('MonthGridCell', () => {
  it.each(STATES)('renders the %s state', (state) => {
    const { getByText } = render(
      <MonthGridCell cell={cell(state)} palette={palette} />
    );
    expect(getByText('12')).toBeTruthy();
  });

  it('renders a blank slot without a day number', () => {
    const { queryByText } = render(
      <MonthGridCell cell={null} palette={palette} />
    );
    expect(queryByText('12')).toBeNull();
  });

  it('is inert until the card hands it an onPress', () => {
    const { queryByLabelText } = render(
      <MonthGridCell cell={cell('upcoming')} palette={palette} />
    );
    expect(queryByLabelText(/August 12/)).toBeNull();
  });

  it('opens its date and names its state and note', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <MonthGridCell
        cell={cell('missed', true)}
        palette={palette}
        onPress={onPress}
      />
    );
    fireEvent.press(getByLabelText('August 12, missed, has note'));
    expect(onPress).toHaveBeenCalledWith('2026-08-12');
  });
});
