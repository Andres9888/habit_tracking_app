import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';
import { ScrollForMoreHint } from '../ScrollForMoreHint';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    useAnimatedStyle: (updater: () => object) => updater(),
  };
});

function shared(value: number): SharedValue<number> {
  return { value } as SharedValue<number>;
}

describe('ScrollForMoreHint', () => {
  it('labels the fade when more form content is below the viewport', () => {
    const { getByTestId, getByText } = render(
      <ScrollForMoreHint
        contentHeight={shared(1000)}
        scrollY={shared(0)}
        viewportHeight={shared(600)}
      />
    );

    expect(getByText('Scroll for more')).toBeTruthy();
    expect(
      StyleSheet.flatten(getByTestId('scroll-for-more-hint').props.style)
        .opacity
    ).toBe(1);
  });

  it('hides the hint after the user starts scrolling', () => {
    const { getByTestId } = render(
      <ScrollForMoreHint
        contentHeight={shared(1000)}
        scrollY={shared(16)}
        viewportHeight={shared(600)}
      />
    );

    expect(
      StyleSheet.flatten(getByTestId('scroll-for-more-hint').props.style)
        .opacity
    ).toBe(0);
  });
});
