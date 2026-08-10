/**
 * Chip rail toggle behaviour.
 *
 * A category chip is a toggle, not a radio button: tapping the chip that is
 * already active clears the filter and returns the catalog to "All". Without
 * this, the only way out of a category was to hunt for the "All" chip, which
 * the rail may have scrolled off screen.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
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

function backgroundOf(label: string) {
  return StyleSheet.flatten(screen.getByLabelText(label).props.style)
    ?.backgroundColor;
}

// A second category so the rail has an idle chip to compare paint against.
const sleepTemplate = {
  _id: 'template-2',
  _creationTime: 0,
  category: 'sleep',
  description: 'Lights out at the same time.',
  name: 'Fixed bedtime',
};

describe('catalog chip toggle', () => {
  beforeEach(() => {
    mockUseQuery.mockImplementation(() => [template, sleepTemplate]);
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

  it('never paints the All chip as selected', () => {
    render(<TemplatesScreen />);

    // At rest All IS the selection, but it must look identical to any idle
    // category chip — an ink pill here reads as an already-applied filter.
    expect(isSelected('All')).toBe(true);
    expect(backgroundOf('All')).toBe(backgroundOf('Sleep'));

    fireEvent.press(screen.getByLabelText('Health'));

    // A real category chip still gets the ink pill, so the muted treatment is
    // specific to All rather than the selected style being broken outright.
    expect(backgroundOf('Health')).not.toBe(backgroundOf('Sleep'));
    expect(backgroundOf('All')).toBe(backgroundOf('Sleep'));
  });
});
