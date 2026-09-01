import { render } from '@testing-library/react-native';

import { HeroCheckInToggle } from '../HeroCheckInToggle';

jest.mock('../../../../../theme/ThemeContext', () => ({
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

describe('HeroCheckInToggle', () => {
  it('reports the disabled state while a toggle is in flight', () => {
    const { getByLabelText } = render(
      <HeroCheckInToggle checked={false} disabled onPress={jest.fn()} />
    );

    expect(
      getByLabelText('Complete today. Tap to log today.').props
        .accessibilityState
    ).toEqual({ checked: false, disabled: true });
  });

  it('describes the unchecked state for accessibility and visible copy', () => {
    const { getByLabelText, getByText } = render(
      <HeroCheckInToggle checked={false} disabled={false} onPress={jest.fn()} />
    );

    const button = getByLabelText('Complete today. Tap to log today.');
    // `checked` is only forwarded to the platform on a checkbox-style role.
    expect(button.props.accessibilityRole).toBe('checkbox');
    expect(button.props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    expect(getByText('Complete today')).toBeTruthy();
    expect(getByText('Tap')).toBeTruthy();
  });

  it('describes the checked state for accessibility and visible copy', () => {
    const { getByLabelText, getByText } = render(
      <HeroCheckInToggle checked disabled={false} onPress={jest.fn()} />
    );

    const button = getByLabelText('Logged today. Tap to undo.');
    expect(button.props.accessibilityRole).toBe('checkbox');
    expect(button.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    expect(getByText('Logged today')).toBeTruthy();
    expect(getByText('Undo')).toBeTruthy();
  });
});
