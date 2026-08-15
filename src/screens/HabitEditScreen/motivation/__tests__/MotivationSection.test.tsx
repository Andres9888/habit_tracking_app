import { fireEvent, render } from '@testing-library/react-native';
import { emptyMotivation } from '../motivationDraft';
import { MotivationSection } from '../MotivationSection';

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      background: '#F5F1ED',
      border: '#E7E0D7',
      card: '#FFFFFF',
      primary: { 100: '#D1FAE5', 700: '#047857' },
      text: {
        primary: '#1E241F',
        secondary: '#4A544C',
        tertiary: '#7D867E',
      },
    },
    isDark: false,
  }),
}));

describe('MotivationSection', () => {
  it('shows the why field and a live Detail preview', () => {
    const onChange = jest.fn();
    const values = {
      ...emptyMotivation(),
      why: 'Start the day with energy, not pressure.',
    };
    const { getAllByText, getByLabelText, getByText } = render(
      <MotivationSection values={values} onChange={onChange} />
    );

    expect(getByLabelText('Your why')).toBeTruthy();
    expect(getByLabelText("Who you're becoming")).toBeTruthy();
    expect(getByLabelText('Wish')).toBeTruthy();
    expect(getByLabelText('Obstacle')).toBeTruthy();
    expect(getByText('Preview on Detail')).toBeTruthy();
    expect(
      getAllByText('Start the day with energy, not pressure.').length
    ).toBeGreaterThan(0);

    fireEvent.changeText(getByLabelText('Your why'), 'Move first.');
    expect(onChange).toHaveBeenCalledWith('why', 'Move first.');
  });

  it('previews identity when why is empty', () => {
    const values = {
      ...emptyMotivation(),
      identity: 'I start moving before the day starts deciding for me.',
    };
    const { getAllByText, queryByText } = render(
      <MotivationSection values={values} onChange={jest.fn()} />
    );
    expect(getAllByText("Who you're becoming").length).toBeGreaterThan(0);
    expect(
      getAllByText('I start moving before the day starts deciding for me.')
        .length
    ).toBeGreaterThan(0);
    expect(queryByText(/Nothing shown on Detail/)).toBeNull();
  });

  it('explains when Detail will show nothing', () => {
    const { getByText } = render(
      <MotivationSection values={emptyMotivation()} onChange={jest.fn()} />
    );
    expect(
      getByText(/Nothing shown on Detail until you write a why/)
    ).toBeTruthy();
  });
});
