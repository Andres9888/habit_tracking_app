/**
 * SortBottomSheet Component Tests
 *
 * Tests the card grid bottom sheet for selecting habit sort order.
 * Verifies 4 sort cards, direction toggles, dismiss gestures, and accessibility.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SortBottomSheet } from './SortBottomSheet';
import type { HabitSortMode } from '../../types';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

describe('SortBottomSheet', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    sortMode: 'manual' as HabitSortMode,
    onSelectSortMode: jest.fn(),
    reduceMotion: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing when visible', () => {
      const { root } = render(<SortBottomSheet {...defaultProps} />);
      expect(root).toBeTruthy();
    });

    it('should render the sheet header with "Sort Habits" title', () => {
      const { getByText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getByText('Sort Habits')).toBeTruthy();
    });

    it('should render the close button', () => {
      const { getByLabelText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getByLabelText('Close')).toBeTruthy();
    });
  });

  describe('Sort Card Grid', () => {
    it('should render all 4 sort cards', () => {
      const { getByText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getByText('Custom')).toBeTruthy();
      expect(getByText('Name')).toBeTruthy();
      expect(getByText('Strength')).toBeTruthy();
      expect(getByText('Streak')).toBeTruthy();
    });

    it('should show direction toggles for Name card', () => {
      const { getByText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getByText('A→Z')).toBeTruthy();
      expect(getByText('Z→A')).toBeTruthy();
    });

    it('should show direction toggles for Strength and Streak', () => {
      const { getAllByText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getAllByText('Low first').length).toBe(2);
      expect(getAllByText('High first').length).toBe(2);
    });

    it('should show description for Custom card (no toggle)', () => {
      const { getByText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getByText('Drag to reorder')).toBeTruthy();
    });
  });

  describe('Sort Selection', () => {
    it('should call onSelectSortMode when a card is pressed', () => {
      const onSelectSortMode = jest.fn();
      const { getByText } = render(
        <SortBottomSheet {...defaultProps} onSelectSortMode={onSelectSortMode} />
      );
      fireEvent.press(getByText('Name'));
      expect(onSelectSortMode).toHaveBeenCalledWith('name_asc');
    });

    it('should call onSelectSortMode with desc mode via toggle', () => {
      const onSelectSortMode = jest.fn();
      const { getByText } = render(
        <SortBottomSheet {...defaultProps} onSelectSortMode={onSelectSortMode} />
      );
      fireEvent.press(getByText('Z→A'));
      expect(onSelectSortMode).toHaveBeenCalledWith('name_desc');
    });

    it('should close sheet after selecting a sort option', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <SortBottomSheet {...defaultProps} onClose={onClose} />
      );
      fireEvent.press(getByText('Name'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Selected State', () => {
    it('should show selected state for Custom when sortMode is manual', () => {
      const { getAllByRole } = render(
        <SortBottomSheet {...defaultProps} sortMode="manual" />
      );
      const radioButtons = getAllByRole('radio');
      const checked = radioButtons.filter(
        (r) => r.props.accessibilityState?.checked === true
      );
      expect(checked.length).toBeGreaterThan(0);
    });

    it('should show selected state on Name card when sortMode is name_desc', () => {
      const { getAllByRole } = render(
        <SortBottomSheet {...defaultProps} sortMode="name_desc" />
      );
      const radioButtons = getAllByRole('radio');
      const checked = radioButtons.filter(
        (r) => r.props.accessibilityState?.checked === true
      );
      expect(checked.length).toBeGreaterThan(0);
    });
  });

  describe('Dismiss Gestures', () => {
    it('should call onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <SortBottomSheet {...defaultProps} onClose={onClose} />
      );
      fireEvent.press(getByLabelText('Close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is pressed', () => {
      const onClose = jest.fn();
      const { root } = render(
        <SortBottomSheet {...defaultProps} onClose={onClose} />
      );
      const backdrop = root.findByProps({ accessible: false });
      if (backdrop) {
        fireEvent.press(backdrop);
        expect(onClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have radio role for sort cards', () => {
      const { getAllByRole } = render(<SortBottomSheet {...defaultProps} />);
      const radioButtons = getAllByRole('radio');
      expect(radioButtons.length).toBe(4);
    });

    it('should have accessible close button with role', () => {
      const { getByLabelText } = render(
        <SortBottomSheet {...defaultProps} />
      );
      const closeButton = getByLabelText('Close');
      expect(closeButton).toBeTruthy();
      expect(closeButton.props.accessibilityRole).toBe('button');
    });

    it('should have accessible labels for all cards', () => {
      const { getByLabelText } = render(<SortBottomSheet {...defaultProps} />);
      expect(getByLabelText('Custom')).toBeTruthy();
      expect(getByLabelText('Name')).toBeTruthy();
      expect(getByLabelText('Strength')).toBeTruthy();
      expect(getByLabelText('Streak')).toBeTruthy();
    });
  });

  describe('Reduce Motion Support', () => {
    it('should work with reduceMotion=true', () => {
      const { root } = render(
        <SortBottomSheet {...defaultProps} reduceMotion={true} />
      );
      expect(root).toBeTruthy();
    });

    it('should work with reduceMotion=false', () => {
      const { root } = render(
        <SortBottomSheet {...defaultProps} reduceMotion={false} />
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Integration Behavior', () => {
    it('should update when sort mode changes via prop', () => {
      const { rerender, getAllByRole } = render(
        <SortBottomSheet {...defaultProps} sortMode="manual" />
      );
      rerender(<SortBottomSheet {...defaultProps} sortMode="streak_desc" />);
      const radioButtons = getAllByRole('radio');
      const checked = radioButtons.filter(
        (r) => r.props.accessibilityState?.checked === true
      );
      expect(checked.length).toBeGreaterThan(0);
    });
  });
});
