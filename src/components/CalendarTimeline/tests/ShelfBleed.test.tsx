import React from 'react';
import { render } from '@testing-library/react-native';

import { ShelfBleed } from '../components/ShelfBleed';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: (props: Record<string, unknown>) => (
      <View testID='gradient' {...props} />
    ),
  };
});

const mockIsDark = { value: false };
jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({ colors: {}, isDark: mockIsDark.value }),
}));

describe('ShelfBleed', () => {
  afterEach(() => {
    mockIsDark.value = false;
  });

  it('renders a gradient element', () => {
    const { getByTestId } = render(<ShelfBleed />);
    expect(getByTestId('gradient')).toBeTruthy();
  });

  it('uses light shelf color by default', () => {
    const { getByTestId } = render(<ShelfBleed />);
    expect(getByTestId('gradient').props.colors).toEqual([
      '#FAF8F5',
      'transparent',
    ]);
  });

  it('uses dark shelf color when isDark', () => {
    mockIsDark.value = true;
    const { getByTestId } = render(<ShelfBleed />);
    expect(getByTestId('gradient').props.colors).toEqual([
      '#1F2937',
      'transparent',
    ]);
  });

  it('positions container absolutely at bottom: -12', () => {
    const { toJSON } = render(<ShelfBleed />);
    const tree = toJSON();
    expect(tree?.props.style).toMatchObject({
      bottom: -12,
      height: 12,
      left: 0,
      position: 'absolute',
      right: 0,
    });
  });

  it('sets pointerEvents to none', () => {
    const { toJSON } = render(<ShelfBleed />);
    expect(toJSON()?.props.pointerEvents).toBe('none');
  });
});
