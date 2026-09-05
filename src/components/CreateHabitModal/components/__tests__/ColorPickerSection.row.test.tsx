/**
 * ColorPickerSection — single-row variant (spec 2a §2)
 * 10 dots spread with space-between; selected dot carries a11y selected state.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { ColorPickerSection } from '../ColorPickerSection';
import { HABIT_COLORS } from '../../constants';

const mockTriggerSelection = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSelection: mockTriggerSelection,
  }),
}));

jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

describe('ColorPickerSection - row variant', () => {
  const onSelectColor = jest.fn();
  const props = {
    colors: HABIT_COLORS,
    onSelectColor,
    selectedColor: HABIT_COLORS[3],
    variant: 'row' as const,
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders all 10 colors on one row', () => {
    const { getByTestId, getAllByRole } = render(
      <ColorPickerSection {...props} />
    );
    expect(getByTestId('color-picker-row')).toBeTruthy();
    expect(getAllByRole('button')).toHaveLength(HABIT_COLORS.length);
  });

  it('marks the selected color with accessibilityState.selected', () => {
    const { getByTestId } = render(<ColorPickerSection {...props} />);
    const selected = getByTestId('color-swatch-10B981');
    const unselected = getByTestId('color-swatch-EF4444');
    expect(selected.props.accessibilityState.selected).toBe(true);
    expect(unselected.props.accessibilityState.selected).toBe(false);
  });

  it('calls onSelectColor with haptics when a dot is pressed', () => {
    const { getByTestId } = render(<ColorPickerSection {...props} />);
    fireEvent.press(getByTestId('color-swatch-3B82F6'));
    expect(onSelectColor).toHaveBeenCalledWith('#3B82F6');
    expect(mockTriggerSelection).toHaveBeenCalled();
  });

  it('keeps a 44pt hit target', () => {
    const { getByTestId } = render(<ColorPickerSection {...props} />);
    expect(getByTestId('color-swatch-EF4444').props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });
});
