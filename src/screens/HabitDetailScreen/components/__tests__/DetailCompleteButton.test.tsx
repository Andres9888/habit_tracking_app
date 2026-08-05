import { fireEvent, render } from '@testing-library/react-native';
import { DetailCompleteButton } from '../DetailCompleteButton';

// The button now derives its band tints from useInsightPalette, which reads the
// full semantic palette — so the mock has to look like one.
jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      accent: '#059669',
      background: '#F5F1ED',
      border: '#DDD8D2',
      card: '#EDEAE5',
      cardPaper: '#F8F5F1',
      gray: { 200: '#DDD8D2', 300: '#C4BFB7', 900: '#1A1816' },
      primary: {
        100: '#d1fae5',
        400: '#34D399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
      },
      status: {
        streak: '#D97706',
        streakLight: '#FEF3C7',
        success: '#059669',
      },
      text: {
        inverse: '#fff',
        primary: '#2D2A26',
        secondary: '#6B6560',
        tertiary: '#6E6660',
      },
    },
    isDark: false,
  }),
}));

describe('DetailCompleteButton', () => {
  it('renders Complete today and fires onPress when incomplete', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DetailCompleteButton isCompletedToday={false} onPress={onPress} />
    );
    fireEvent.press(getByText('Complete today'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders Done today when already completed', () => {
    const { getByText, getByLabelText } = render(
      <DetailCompleteButton isCompletedToday onPress={jest.fn()} />
    );
    expect(getByText('Done today')).toBeTruthy();
    expect(getByLabelText('Done today, tap to undo')).toBeTruthy();
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
    fireEvent.press(getByText('Complete today'));
    expect(onPress).not.toHaveBeenCalled();
  });

  // The hero variant is a filled green block rather than an outlined bar; it
  // must still toggle.
  it('still toggles in the onBand tone used by the hero wash', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DetailCompleteButton
        isCompletedToday={false}
        tone='onBand'
        onPress={onPress}
      />
    );
    fireEvent.press(getByText('Complete today'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
