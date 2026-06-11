import { fireEvent, render } from '@testing-library/react-native';
import { DetailCompleteButton } from '../DetailCompleteButton';

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      status: { success: '#22c55e' },
      text: { inverse: '#fff', primary: '#1a1a1a' },
    },
  }),
}));

describe('DetailCompleteButton', () => {
  it('renders Complete Today and fires onPress when incomplete', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DetailCompleteButton isCompletedToday={false} onPress={onPress} />
    );
    fireEvent.press(getByText('Complete Today'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders Completed Today when already completed', () => {
    const { getByText, getByLabelText } = render(
      <DetailCompleteButton isCompletedToday onPress={jest.fn()} />
    );
    expect(getByText('Completed Today')).toBeTruthy();
    expect(getByLabelText('Completed today, tap to undo')).toBeTruthy();
  });

  it('does not fire onPress while disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DetailCompleteButton
        disabled
        isCompletedToday={false}
        onPress={onPress}
      />
    );
    fireEvent.press(getByText('Complete Today'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
