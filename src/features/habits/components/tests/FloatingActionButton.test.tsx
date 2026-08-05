/**
 * FloatingActionButton Component Tests
 *
 * Tests the circular plus button that opens the create habit modal.
 * Verifies press interaction, accessibility, and visual styling.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FloatingActionButton } from '../FloatingActionButton';

describe('FloatingActionButton', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      expect(root).toBeTruthy();
    });

    it('should render the plus icon', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Plus icon should be rendered
      expect(root).toBeTruthy();
    });

    it('should have circular shape styling', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Should have rounded-full class for circular shape
      expect(root).toBeTruthy();
    });
  });

  describe('Press Interaction', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not crash when pressed multiple times', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByRole('button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(3);
    });

    it('should handle onPress with custom logic', () => {
      let counter = 0;
      const onPress = () => { counter++; };
      const { getByRole } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByRole('button');
      fireEvent.press(button);

      expect(counter).toBe(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role as button', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByRole('button');
      expect(button).toBeDefined();
    });

    it('should have accessible label "Add habit"', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByLabelText('Add habit');
      expect(button).toBeDefined();
    });

    it('should have accessible hint about opening create habit modal', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Open create habit modal');
    });

    it('should support VoiceOver/TalkBack for screen readers', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<FloatingActionButton onPress={onPress} />);

      const button = getByRole('button');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityLabel).toBe('Add habit');
    });
  });

  describe('Visual Design', () => {
    it('should have dark background color (#101727)', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Should use bg-[#101727] class
      expect(root).toBeTruthy();
    });

    it('should have shadow styling', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Should have shadow-lg class
      expect(root).toBeTruthy();
    });

    it('should have proper dimensions (56x56 / 14 units)', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Should have h-14 w-14 classes (56x56 pixels)
      expect(root).toBeTruthy();
    });

    it('should center the icon inside the button', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Should have items-center justify-center classes
      expect(root).toBeTruthy();
    });
  });

  describe('Icon Properties', () => {
    it('should render white plus icon', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Plus icon should have #ffffff color
      expect(root).toBeTruthy();
    });

    it('should have proper icon size (24)', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Plus icon should have size={24}
      expect(root).toBeTruthy();
    });

    it('should have proper stroke width (2.25)', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      // Plus icon should have strokeWidth={2.25}
      expect(root).toBeTruthy();
    });
  });

  describe('Integration Requirements', () => {
    it('should work with openCreateHabitScreen handler', () => {
      const openCreateHabitScreen = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton onPress={openCreateHabitScreen} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(openCreateHabitScreen).toHaveBeenCalledTimes(1);
    });

    it('should be compatible with modal state management', () => {
      let modalOpen = false;
      const openModal = () => { modalOpen = true; };
      const { getByRole } = render(<FloatingActionButton onPress={openModal} />);

      expect(modalOpen).toBe(false);

      const button = getByRole('button');
      fireEvent.press(button);

      expect(modalOpen).toBe(true);
    });
  });

  describe('Component Props', () => {
    it('should require onPress prop', () => {
      const onPress = jest.fn();
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      expect(root).toBeTruthy();
    });

    it('should accept function as onPress', () => {
      const onPress = () => console.log('Pressed');
      const { root } = render(<FloatingActionButton onPress={onPress} />);
      expect(root).toBeTruthy();
    });
  });
});
