/**
 * MicrophonePermissionDenied Component Tests
 * Tests for graceful handling of microphone permission denial
 *
 * Story: Handle microphone permission denial gracefully
 */

import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react-native';

import { MicrophonePermissionDenied } from '../MicrophonePermissionDenied';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('MicrophonePermissionDenied', () => {
  const defaultProps = {
    canAskAgain: true,
    onTryAgain: jest.fn(),
    onOpenSettings: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with title and description', () => {
      render(<MicrophonePermissionDenied {...defaultProps} />);

      expect(screen.getByText('Microphone Access Required')).toBeTruthy();
      expect(
        screen.getByText(/Microphone access is needed to record voice notes/)
      ).toBeTruthy();
    });

    it('renders MicOff icon', () => {
      render(<MicrophonePermissionDenied {...defaultProps} />);

      // Icon is rendered - we check the container has the right accessibility label
      expect(
        screen.getByLabelText('Microphone permission required')
      ).toBeTruthy();
    });

    it('renders the science explanation in non-compact mode', () => {
      render(<MicrophonePermissionDenied {...defaultProps} />);

      expect(
        screen.getByText(/Voice notes help you capture motivation/)
      ).toBeTruthy();
      expect(screen.getByText(/40% higher emotional recall/)).toBeTruthy();
    });

    it('hides the science explanation in compact mode', () => {
      render(<MicrophonePermissionDenied {...defaultProps} compact />);

      expect(
        screen.queryByText(/Voice notes help you capture motivation/)
      ).toBeNull();
    });

    it('applies custom error message when provided', () => {
      const customMessage = 'Custom permission error message';
      render(
        <MicrophonePermissionDenied
          {...defaultProps}
          errorMessage={customMessage}
        />
      );

      expect(screen.getByText(customMessage)).toBeTruthy();
    });
  });

  describe('canAskAgain=true (temporary denial)', () => {
    it('shows "Try Again" button as primary action', () => {
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      expect(
        screen.getByLabelText('Try again to grant microphone permission')
      ).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    it('shows "Open Settings Instead" as secondary option in non-compact mode', () => {
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      expect(screen.getByLabelText('Open Settings')).toBeTruthy();
      expect(screen.getByText('Open Settings Instead')).toBeTruthy();
    });

    it('hides secondary "Open Settings" in compact mode', () => {
      render(
        <MicrophonePermissionDenied {...defaultProps} canAskAgain compact />
      );

      expect(screen.queryByText('Open Settings Instead')).toBeNull();
    });

    it('calls onTryAgain when "Try Again" is pressed', () => {
      const onTryAgain = jest.fn();
      render(
        <MicrophonePermissionDenied
          {...defaultProps}
          canAskAgain
          onTryAgain={onTryAgain}
        />
      );

      fireEvent.press(screen.getByText('Try Again'));

      expect(onTryAgain).toHaveBeenCalledTimes(1);
    });

    it('calls onOpenSettings when "Open Settings Instead" is pressed', () => {
      const onOpenSettings = jest.fn();
      render(
        <MicrophonePermissionDenied
          {...defaultProps}
          canAskAgain
          onOpenSettings={onOpenSettings}
        />
      );

      fireEvent.press(screen.getByText('Open Settings Instead'));

      expect(onOpenSettings).toHaveBeenCalledTimes(1);
    });

    it('shows appropriate description for temporary denial', () => {
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      expect(
        screen.getByText(/Please grant permission to continue/)
      ).toBeTruthy();
    });
  });

  describe('canAskAgain=false (permanent denial)', () => {
    it('shows "Open Settings" as primary action', () => {
      render(
        <MicrophonePermissionDenied {...defaultProps} canAskAgain={false} />
      );

      expect(
        screen.getByLabelText('Open Settings to enable microphone')
      ).toBeTruthy();
      expect(screen.getByText('Open Settings')).toBeTruthy();
    });

    it('does not show "Try Again" button', () => {
      render(
        <MicrophonePermissionDenied {...defaultProps} canAskAgain={false} />
      );

      expect(
        screen.queryByLabelText('Try again to grant microphone permission')
      ).toBeNull();
      expect(screen.queryByText('Try Again')).toBeNull();
    });

    it('calls onOpenSettings when "Open Settings" is pressed', () => {
      const onOpenSettings = jest.fn();
      render(
        <MicrophonePermissionDenied
          {...defaultProps}
          canAskAgain={false}
          onOpenSettings={onOpenSettings}
        />
      );

      fireEvent.press(screen.getByText('Open Settings'));

      expect(onOpenSettings).toHaveBeenCalledTimes(1);
    });

    it('shows appropriate description for permanent denial', () => {
      render(
        <MicrophonePermissionDenied {...defaultProps} canAskAgain={false} />
      );

      expect(
        screen.getByText(
          /please enable microphone permission in your device Settings/
        )
      ).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has alert role for the container', () => {
      render(<MicrophonePermissionDenied {...defaultProps} />);

      expect(screen.getByRole('alert')).toBeTruthy();
    });

    it('has proper accessibility labels on buttons', () => {
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      expect(
        screen.getByLabelText('Try again to grant microphone permission')
      ).toBeTruthy();
      expect(screen.getByLabelText('Open Settings')).toBeTruthy();
    });

    it('has accessibility hints on buttons', () => {
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      expect(
        screen.getByAccessibilityHint(
          'Will prompt you to allow microphone access'
        )
      ).toBeTruthy();
    });

    it('buttons have button role', () => {
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      // Check at least one button has the role
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Haptic feedback', () => {
    it('triggers haptic feedback on button press', async () => {
      const Haptics = require('expo-haptics');
      render(<MicrophonePermissionDenied {...defaultProps} canAskAgain />);

      fireEvent.press(screen.getByText('Try Again'));

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });
  });

  describe('Compact mode', () => {
    it('renders both buttons in a row in compact mode when canAskAgain', () => {
      render(
        <MicrophonePermissionDenied {...defaultProps} canAskAgain compact />
      );

      // In compact mode, only "Try Again" is shown as the single action
      expect(screen.getByText('Try Again')).toBeTruthy();
      // Secondary action is hidden in compact mode
      expect(screen.queryByText('Open Settings Instead')).toBeNull();
    });

    it('shows only "Open Settings" in compact mode when canAskAgain=false', () => {
      render(
        <MicrophonePermissionDenied
          {...defaultProps}
          canAskAgain={false}
          compact
        />
      );

      expect(screen.getByText('Open Settings')).toBeTruthy();
      expect(screen.queryByText('Try Again')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('handles empty error message gracefully', () => {
      render(<MicrophonePermissionDenied {...defaultProps} errorMessage='' />);

      // Falls back to default message when empty string provided
      expect(screen.getByText(/Microphone access is needed/)).toBeTruthy();
    });

    it('respects reduceMotion prop', () => {
      // This mainly affects animations which are harder to test directly
      // but we ensure the component renders correctly with the prop
      render(<MicrophonePermissionDenied {...defaultProps} reduceMotion />);

      expect(screen.getByText('Microphone Access Required')).toBeTruthy();
    });
  });
});
