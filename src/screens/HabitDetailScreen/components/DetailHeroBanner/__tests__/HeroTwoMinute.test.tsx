import { fireEvent, render } from '@testing-library/react-native';
import { HeroTwoMinute } from '../HeroTwoMinute';
import type { InsightPalette } from '../../../insightPalette';

const palette = {
  ctaGreen: '#0C7C59',
} as InsightPalette;

describe('HeroTwoMinute', () => {
  it('logs via onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <HeroTwoMinute palette={palette} onPress={onPress} />
    );
    fireEvent.press(getByLabelText('Do the 2-minute version — it counts'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <HeroTwoMinute disabled palette={palette} onPress={onPress} />
    );
    fireEvent.press(getByLabelText('Do the 2-minute version — it counts'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
