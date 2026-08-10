/**
 * Chip rail toggle behaviour.
 *
 * A category chip is a toggle, not a radio button: tapping the chip that is
 * already active clears the filter and returns the catalog to "All". Without
 * this, the only way out of a category was to hunt for the "All" chip, which
 * the rail may have scrolled off screen.
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import TemplatesScreen from '../TemplatesScreen';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: () => jest.fn(),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

const mockUseQuery = useQuery as jest.Mock;

const template = {
  _id: 'template-1',
  _creationTime: 0,
  category: 'health_fitness',
  description: 'Walk after lunch.',
  name: 'Daily walk',
};

function isSelected(label: string) {
  return Boolean(
    screen.getByLabelText(label).props.accessibilityState?.selected
  );
}

describe('catalog chip toggle', () => {
  beforeEach(() => {
    mockUseQuery.mockImplementation(() => [template]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryCacheStore.reset();
  });

  it('returns to All when the active chip is tapped again', () => {
    render(<TemplatesScreen />);

    expect(isSelected('All')).toBe(true);

    fireEvent.press(screen.getByLabelText('Health'));
    expect(isSelected('Health')).toBe(true);
    expect(isSelected('All')).toBe(false);

    fireEvent.press(screen.getByLabelText('Health'));
    expect(isSelected('Health')).toBe(false);
    expect(isSelected('All')).toBe(true);
  });

  it('keeps All selected when All itself is tapped', () => {
    render(<TemplatesScreen />);

    fireEvent.press(screen.getByLabelText('All'));

    expect(isSelected('All')).toBe(true);
  });
});
