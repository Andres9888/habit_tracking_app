/**
 * ToggleRow tests — the whole row must toggle, not just the Switch.
 */

import { fireEvent, render } from '@testing-library/react-native';
import { ToggleRow } from '../ToggleRow';

jest.mock('../../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      border: '#DDD8D2',
      card: '#FFFFFF',
      primary: { 600: '#10B981', 700: '#0F766E' },
      surface: '#F5F1ED',
      text: { inverse: '#FFFFFF', primary: '#2D2A26' },
    },
  }),
}));

describe('ToggleRow', () => {
  it('toggles on when the row (label area) is pressed', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <ToggleRow enabled={false} onToggle={onToggle} />
    );

    fireEvent.press(getByText('Daily Reminder'));

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('toggles off from the row when already enabled', () => {
    const onToggle = jest.fn();
    const { getByText } = render(<ToggleRow enabled onToggle={onToggle} />);

    fireEvent.press(getByText('Daily Reminder'));

    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('still toggles via the switch itself', () => {
    const onToggle = jest.fn();
    const { getByTestId } = render(
      <ToggleRow enabled={false} onToggle={onToggle} />
    );

    fireEvent(getByTestId('reminder-toggle'), 'valueChange', true);

    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
