/**
 * FloatingActionButton Component Tests
 *
 * Tests the circular plus button that opens the create habit modal.
 * Verifies press interaction, accessibility, and visual styling.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { iconSizes } from '../../../../theme/iconSizes';
import { shadows } from '../../../../theme/spacing';
import { FloatingActionButton } from '../FloatingActionButton';

describe('FloatingActionButton', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const onPress = jest.fn();
      const { root } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(root).toBeTruthy();
    });

    it('should render the plus icon', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(getByTestId('lucide-icon-Plus')).toBeTruthy();
    });

    it('should have circular shape styling', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(getByTestId('home-create-habit-fab').props.className).toContain(
        'rounded-full'
      );
    });
  });

  describe('Press Interaction', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not crash when pressed multiple times', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByRole('button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(3);
    });

    it('should handle onPress with custom logic', () => {
      let counter = 0;
      const onPress = () => {
        counter++;
      };
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(counter).toBe(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role as button', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByRole('button');
      expect(button).toBeDefined();
    });

    it('should have accessible label "Add habit"', () => {
      const onPress = jest.fn();
      const { getByLabelText } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByLabelText('Add habit');
      expect(button).toBeDefined();
    });

    it('should have accessible hint about opening create habit modal', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Open create habit modal');
    });

    it('should support VoiceOver/TalkBack for screen readers', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );

      const button = getByRole('button');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityLabel).toBe('Add habit');
    });
  });

  describe('Visual Design', () => {
    it('should use the primary action background token', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      const buttonStyle = StyleSheet.flatten(
        getByTestId('home-create-habit-fab').props.style
      );
      expect(buttonStyle.backgroundColor).toBe(colors.primary[600]);
    });

    it('should have shadow styling', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      const buttonStyle = StyleSheet.flatten(
        getByTestId('home-create-habit-fab').props.style
      );
      expect(buttonStyle.elevation).toBe(
        shadows.floatingActionButton.elevation
      );
    });

    it('should have proper dimensions (56x56 / 14 units)', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      const className = getByTestId('home-create-habit-fab').props.className;
      expect(className).toContain('h-14');
      expect(className).toContain('w-14');
    });

    it('should center the icon inside the button', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      const className = getByTestId('home-create-habit-fab').props.className;
      expect(className).toContain('items-center');
      expect(className).toContain('justify-center');
    });
  });

  describe('Icon Properties', () => {
    it('should render white plus icon', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(getByTestId('lucide-icon-Plus').props.color).toBe(
        colors.text.inverse
      );
    });

    it('should have proper icon size (24)', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(getByTestId('lucide-icon-Plus').props.size).toBe(iconSizes.large);
    });

    it('should have proper stroke width (2.5)', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(getByTestId('lucide-icon-Plus').props.strokeWidth).toBe(2.5);
    });
  });

  describe('Integration Requirements', () => {
    it('should work with openCreateHabitScreen handler', () => {
      const openCreateHabitScreen = jest.fn();
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={openCreateHabitScreen} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(openCreateHabitScreen).toHaveBeenCalledTimes(1);
    });

    it('should be compatible with modal state management', () => {
      let modalOpen = false;
      const openModal = () => {
        modalOpen = true;
      };
      const { getByRole } = render(
        <FloatingActionButton openCreateHabitScreen={openModal} />
      );

      expect(modalOpen).toBe(false);

      const button = getByRole('button');
      fireEvent.press(button);

      expect(modalOpen).toBe(true);
    });
  });

  describe('Component Props', () => {
    it('should require openCreateHabitScreen prop', () => {
      const onPress = jest.fn();
      const { root } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(root).toBeTruthy();
    });

    it('should accept a function as openCreateHabitScreen', () => {
      const onPress = () => console.log('Pressed');
      const { root } = render(
        <FloatingActionButton openCreateHabitScreen={onPress} />
      );
      expect(root).toBeTruthy();
    });
  });
});
