/**
 * Chip rail selection behaviour.
 *
 * Three rules, all versions of "the rail must always show where you are":
 *  - A category chip is a toggle, not a radio button. Tapping the active chip
 *    clears the filter. Without this the only exit from a category was the
 *    "All" chip, which the horizontal rail may have scrolled off screen.
 *  - "All" is selected far more often than any category, so it gets an ink
 *    outline rather than the solid pill — visible, but not shouting on every
 *    first open. Painting it fully idle was tried and reverted: a rail with
 *    nothing marked reads as unloaded rather than unfiltered.
 *  - The selected chip is never dimmed by the zero-match rule, or the view
 *    the user is currently looking at renders as disabled.
 *
 * Assertions name palette tokens rather than comparing one chip to another:
 * chip-vs-chip equality still passes when both chips drift the same way.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { lightColors } from '../../../theme/darkColors';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import { buildBrowserPalette } from '../browserPalette';
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

// Rendering without a ThemeProvider, so components resolve the ThemeContext
// default — light colors, isDark false.
const palette = buildBrowserPalette(lightColors, false);

const template = {
  _id: 'template-1',
  _creationTime: 0,
  category: 'health_fitness',
  description: 'Walk after lunch.',
  name: 'Daily walk',
};

// Two more categories, so a search can leave one chip matching, one selected
// at zero matches, and one unselected at zero matches.
const sleepTemplate = {
  _id: 'template-2',
  _creationTime: 0,
  category: 'sleep',
  description: 'Lights out at the same time.',
  name: 'Fixed bedtime',
};

const mindfulnessTemplate = {
  _id: 'template-3',
  _creationTime: 0,
  category: 'mindfulness',
  description: 'Ten slow breaths.',
  name: 'Breath break',
};

function chip(label: string) {
  return screen.getByLabelText(new RegExp(`^${label}(,|$)`));
}

function paintOf(label: string) {
  const flat = StyleSheet.flatten(chip(label).props.style) ?? {};
  return {
    background: flat.backgroundColor,
    border: flat.borderColor,
    opacity: flat.opacity,
  };
}

function isSelected(label: string) {
  return Boolean(chip(label).props.accessibilityState?.selected);
}

describe('catalog chip rail', () => {
  beforeEach(() => {
    mockUseQuery.mockImplementation(() => [
      template,
      sleepTemplate,
      mindfulnessTemplate,
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryCacheStore.reset();
  });

  it('returns to the unfiltered catalog when the active chip is tapped again', () => {
    render(<TemplatesScreen />);

    fireEvent.press(chip('Health'));
    expect(isSelected('Health')).toBe(true);
    expect(isSelected('All')).toBe(false);

    fireEvent.press(chip('Health'));
    expect(isSelected('Health')).toBe(false);
    expect(isSelected('All')).toBe(true);
  });

  it('gives All an ink outline rather than the solid pill', () => {
    render(<TemplatesScreen />);

    expect(isSelected('All')).toBe(true);
    expect(paintOf('All')).toMatchObject({
      background: palette.chipIdle,
      border: palette.chipActive,
    });
    expect(StyleSheet.flatten(screen.getByText('All').props.style)?.color).toBe(
      palette.textPrimary
    );
  });

  it('leaves unselected chips flat', () => {
    render(<TemplatesScreen />);

    expect(paintOf('Sleep')).toMatchObject({
      background: palette.chipIdle,
      border: palette.chipIdle,
    });
  });

  it('gives a chosen category the solid ink pill', () => {
    render(<TemplatesScreen />);

    fireEvent.press(chip('Health'));

    expect(paintOf('Health')).toMatchObject({
      background: palette.chipActive,
      border: palette.chipActive,
    });
  });

  it('keeps exactly one chip reporting selected', () => {
    render(<TemplatesScreen />);

    const labels = ['All', 'Health', 'Sleep'];
    expect(labels.filter(isSelected)).toEqual(['All']);

    fireEvent.press(chip('Health'));
    expect(labels.filter(isSelected)).toEqual(['Health']);

    fireEvent.press(chip('Health'));
    expect(labels.filter(isSelected)).toEqual(['All']);
  });

  it('never dims the selected chip on a zero-match search', () => {
    render(<TemplatesScreen />);

    fireEvent.press(chip('Sleep'));
    // Matches the health template only, so Sleep is selected at zero matches.
    fireEvent.changeText(screen.getByLabelText('Search habit library'), 'walk');

    expect(isSelected('Sleep')).toBe(true);
    expect(paintOf('Sleep').opacity).toBeUndefined();
    // The rule itself still applies to everything the user is not looking at.
    expect(paintOf('Mindfulness').opacity).toBe(0.45);
  });
});
