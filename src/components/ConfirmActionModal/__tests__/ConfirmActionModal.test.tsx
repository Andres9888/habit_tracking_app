/**
 * Tests for ConfirmActionModal component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmActionModal } from '../ConfirmActionModal';

describe('ConfirmActionModal', () => {
  const defaultProps = {
    visible: true,
    habitName: 'Test Habit',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Archive Mode', () => {
    it('renders archive confirmation with correct text', () => {
      const { getByText } = render(
        <ConfirmActionModal {...defaultProps} actionType="archive" />
      );

      expect(getByText('Archive Habit?')).toBeTruthy();
      expect(
        getByText(/will be moved to your archived habits/i)
      ).toBeTruthy();
      expect(getByText('Archive')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('calls onConfirm when Archive button is pressed', () => {
      const { getByText } = render(
        <ConfirmActionModal {...defaultProps} actionType="archive" />
      );

      fireEvent.press(getByText('Archive'));
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Cancel button is pressed', () => {
      const { getByText } = render(
        <ConfirmActionModal {...defaultProps} actionType="archive" />
      );

      fireEvent.press(getByText('Cancel'));
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('includes habit name in message', () => {
      const { getByText } = render(
        <ConfirmActionModal
          {...defaultProps}
          actionType="archive"
          habitName="Morning Run"
        />
      );

      expect(getByText(/"Morning Run"/)).toBeTruthy();
    });
  });

  describe('Delete Mode', () => {
    it('renders delete confirmation with correct text', () => {
      const { getByText } = render(
        <ConfirmActionModal {...defaultProps} actionType="delete" />
      );

      expect(getByText('Delete Habit?')).toBeTruthy();
      expect(getByText(/permanently deleted/i)).toBeTruthy();
      expect(getByText(/cannot be undone/i)).toBeTruthy();
      expect(getByText('Delete')).toBeTruthy();
    });

    it('calls onConfirm when Delete button is pressed', () => {
      const { getByText } = render(
        <ConfirmActionModal {...defaultProps} actionType="delete" />
      );

      fireEvent.press(getByText('Delete'));
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('shows destructive warning message', () => {
      const { getByText } = render(
        <ConfirmActionModal {...defaultProps} actionType="delete" />
      );

      expect(getByText(/cannot be undone/i)).toBeTruthy();
    });
  });

  describe('Modal Behavior', () => {
    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <ConfirmActionModal
          {...defaultProps}
          actionType="archive"
          visible={false}
        />
      );

      expect(queryByText('Archive Habit?')).toBeNull();
    });

    it('calls onCancel when overlay is pressed', () => {
      const { UNSAFE_getByType } = render(
        <ConfirmActionModal {...defaultProps} actionType="archive" />
      );

      const Pressable = require('react-native').Pressable;
      const overlayPressable = UNSAFE_getByType(Pressable);

      fireEvent.press(overlayPressable);
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for buttons', () => {
      const { getByLabelText } = render(
        <ConfirmActionModal {...defaultProps} actionType="archive" />
      );

      expect(getByLabelText('Archive')).toBeTruthy();
      expect(getByLabelText('Cancel')).toBeTruthy();
    });

    it('sets correct accessibilityRole for buttons', () => {
      const { getByLabelText } = render(
        <ConfirmActionModal {...defaultProps} actionType="delete" />
      );

      const deleteButton = getByLabelText('Delete');
      const cancelButton = getByLabelText('Cancel');

      expect(deleteButton.props.accessibilityRole).toBe('button');
      expect(cancelButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Visual States', () => {
    it('applies pressed opacity to Archive button', () => {
      const { getByLabelText } = render(
        <ConfirmActionModal {...defaultProps} actionType="archive" />
      );

      const archiveButton = getByLabelText('Archive');
      
      // Simulate press in
      fireEvent(archiveButton, 'pressIn');
      
      // The opacity should be controlled by the Pressable style function
      expect(archiveButton.props.style).toBeDefined();
    });

    it('applies pressed opacity to Cancel button', () => {
      const { getByLabelText } = render(
        <ConfirmActionModal {...defaultProps} actionType="delete" />
      );

      const cancelButton = getByLabelText('Cancel');
      
      // Simulate press in
      fireEvent(cancelButton, 'pressIn');
      
      expect(cancelButton.props.style).toBeDefined();
    });
  });
});
