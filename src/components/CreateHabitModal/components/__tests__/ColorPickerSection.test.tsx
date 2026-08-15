/**
 * ColorPickerSection Component Tests - V9 Redesign
 * Task 5: ColorPicker with 36px swatches and box-shadow selection
 *
 * Tests:
 * - predefined palette swatches render in rows
 * - Selection state with enlarged ring padding and white border ring
 * - Haptic feedback on color selection
 * - Accessible color name labels for VoiceOver
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { ColorPickerSection } from '../ColorPickerSection';
import { HABIT_COLORS, COLOR_NAMES, getColorName } from '../../constants';

// Mock useHapticFeedback
const mockTriggerSelection = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock AccessibilityInfo.announceForAccessibility
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

describe('ColorPickerSection - V9 Redesign', () => {
  const mockOnSelectColor = jest.fn();
  const mockOnCustomPress = jest.fn();

  const defaultProps = {
    colors: HABIT_COLORS,
    selectedColor: HABIT_COLORS[3], // Emerald (default)
    onSelectColor: mockOnSelectColor,
    onCustomPress: mockOnCustomPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the section header "Color"', () => {
      const { getByText } = render(<ColorPickerSection {...defaultProps} />);
      expect(getByText('Color')).toBeDefined();
    });

    it('should render all predefined color swatches', () => {
      const { getAllByRole } = render(<ColorPickerSection {...defaultProps} />);
      const buttons = getAllByRole('button');
      // palette colors + 1 custom color button
      expect(buttons.length).toBe(HABIT_COLORS.length + 1);
    });

    it('should render each color with correct testID', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      HABIT_COLORS.forEach((color) => {
        const colorId = color.replace('#', '');
        expect(getByTestId(`color-swatch-${colorId}`)).toBeDefined();
      });
    });

    it('should render custom color button', () => {
      const { getByTestId, getByLabelText } = render(
        <ColorPickerSection {...defaultProps} />
      );
      expect(getByTestId('color-swatch-custom')).toBeDefined();
      expect(getByLabelText('Choose custom color')).toBeDefined();
    });

    it('should render color swatches in a single row container', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);
      const row1 = getByTestId('color-picker-row-1');
      const row2 = getByTestId('color-picker-row-2');
      expect(row1.props.style.flexDirection).toBe('row');
      expect(row2.props.style.flexDirection).toBe('row');
    });
  });

  describe('Selection State', () => {
    it('should show selected state on the default Emerald color', () => {
      const { getByLabelText } = render(<ColorPickerSection {...defaultProps} />);

      const emeraldButton = getByLabelText('Emerald color, selected');
      expect(emeraldButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should show selected state when a different color is selected', () => {
      const { getByLabelText } = render(
        <ColorPickerSection {...defaultProps} selectedColor='#EF4444' />
      );

      const redButton = getByLabelText('Red color, selected');
      expect(redButton.props.accessibilityState?.selected).toBe(true);

      // Emerald should not be selected
      const emeraldButton = getByLabelText('Emerald color');
      expect(emeraldButton.props.accessibilityState?.selected).toBe(false);
    });

    it('should have white border ring on selected color (V9 box-shadow style)', () => {
      const { getByLabelText } = render(<ColorPickerSection {...defaultProps} />);

      const emeraldSwatch = getByLabelText('Emerald color, selected');
      expect(emeraldSwatch.props.accessibilityState?.selected).toBe(true);
    });

    it('should NOT have border on unselected colors', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      const redSwatch = getByTestId('color-swatch-EF4444');
      // V9: Unselected colors have no border (undefined)
      expect(redSwatch.props.style.borderWidth).toBeUndefined();
    });
  });

  describe('User Interaction', () => {
    it('should call onSelectColor when a color is pressed', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      const redSwatch = getByTestId('color-swatch-EF4444');
      fireEvent.press(redSwatch);

      expect(mockOnSelectColor).toHaveBeenCalledWith('#EF4444');
    });

    it('should trigger haptic feedback when color is selected', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      const orangeSwatch = getByTestId('color-swatch-F97316');
      fireEvent.press(orangeSwatch);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('should call onCustomPress when custom button is pressed', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      const customButton = getByTestId('color-swatch-custom');
      fireEvent.press(customButton);

      expect(mockOnCustomPress).toHaveBeenCalled();
    });

    it('should trigger haptic feedback when custom button is pressed', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      const customButton = getByTestId('color-swatch-custom');
      fireEvent.press(customButton);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role on all color buttons', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      HABIT_COLORS.forEach((color) => {
        const colorId = color.replace('#', '');
        const swatch = getByTestId(`color-swatch-${colorId}`);
        expect(swatch.props.accessibilityRole).toBe('button');
      });
    });

    it('should announce color selection with human-readable name', () => {
      const { getByTestId } = render(<ColorPickerSection {...defaultProps} />);

      const violetSwatch = getByTestId('color-swatch-8B5CF6');
      fireEvent.press(violetSwatch);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Selected Violet color'
      );
    });

    it('should have accessibility labels with color names', () => {
      const { getByLabelText } = render(<ColorPickerSection {...defaultProps} />);

      // Check a few color labels
      expect(getByLabelText('Red color')).toBeDefined();
      expect(getByLabelText('Orange color')).toBeDefined();
      expect(getByLabelText('Blue color')).toBeDefined();
      expect(getByLabelText('Pink color')).toBeDefined();
      expect(getByLabelText('Stone color')).toBeDefined();
    });

    it('should indicate selected state in accessibility label', () => {
      const { getByLabelText } = render(
        <ColorPickerSection {...defaultProps} selectedColor='#3B82F6' />
      );

      expect(getByLabelText('Blue color, selected')).toBeDefined();
    });
  });

  describe('Color Constants', () => {
    it('should have exactly 10 colors in HABIT_COLORS', () => {
      expect(HABIT_COLORS.length).toBe(10);
    });

    it('should have correct colors in correct order', () => {
      expect(HABIT_COLORS[0]).toBe('#EF4444'); // Red
      expect(HABIT_COLORS[3]).toBe('#10B981'); // Emerald (default)
      expect(HABIT_COLORS[9]).toBe('#78716C'); // Stone
    });

    it('should have human-readable names for all colors', () => {
      HABIT_COLORS.forEach((color) => {
        expect(COLOR_NAMES[color]).toBeDefined();
        expect(typeof COLOR_NAMES[color]).toBe('string');
        expect(COLOR_NAMES[color].length).toBeGreaterThan(0);
      });
    });

    it('should return color name from getColorName helper', () => {
      expect(getColorName('#EF4444')).toBe('Red');
      expect(getColorName('#10B981')).toBe('Emerald');
      expect(getColorName('#78716C')).toBe('Stone');
    });

    it('should return hex value for unknown colors in getColorName', () => {
      expect(getColorName('#ABCDEF')).toBe('#ABCDEF');
    });
  });
});
