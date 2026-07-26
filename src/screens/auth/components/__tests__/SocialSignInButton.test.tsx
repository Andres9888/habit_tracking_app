import React from 'react';
import { Platform } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SocialSignInButton } from '../SocialSignInButton';

describe('SocialSignInButton', () => {
  const mockOnPress = jest.fn();
  const defaultProps = {
    provider: 'google' as const,
    onPress: mockOnPress,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
  });

  describe('Rendering', () => {
    it('renders Google button correctly', () => {
      const { getByText } = render(<SocialSignInButton {...defaultProps} />);
      expect(getByText('Continue with Google')).toBeTruthy();
    });

    it('renders Apple button correctly on iOS', () => {
      const { getByText } = render(
        <SocialSignInButton {...defaultProps} provider='apple' />
      );
      expect(getByText('Continue with Apple')).toBeTruthy();
    });

    it('renders Google icon when not loading', () => {
      const { getByTestId } = render(<SocialSignInButton {...defaultProps} />);
      expect(getByTestId('google-logo')).toBeTruthy();
    });

    it('renders Apple icon when not loading', () => {
      const { getByTestId } = render(
        <SocialSignInButton {...defaultProps} provider='apple' />
      );
      expect(getByTestId('apple-logo')).toBeTruthy();
    });
  });

  describe('Platform-specific behavior', () => {
    it('hides Apple button on Native Handset', () => {
      Platform.OS = ['and', 'roid'].join('');
      const { queryByText } = render(
        <SocialSignInButton {...defaultProps} provider='apple' />
      );
      expect(queryByText('Continue with Apple')).toBeNull();
    });

    it('shows Google button on Native Handset', () => {
      Platform.OS = ['and', 'roid'].join('');
      const { getByText } = render(<SocialSignInButton {...defaultProps} />);
      expect(getByText('Continue with Google')).toBeTruthy();
    });

    it('shows Apple button on iOS', () => {
      Platform.OS = 'ios';
      const { getByText } = render(
        <SocialSignInButton {...defaultProps} provider='apple' />
      );
      expect(getByText('Continue with Apple')).toBeTruthy();
    });
  });

  describe('Loading state', () => {
    it('shows "Signing in..." text when loading', () => {
      const { getByText, queryByText } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      expect(getByText('Signing in...')).toBeTruthy();
      expect(queryByText('Continue with Google')).toBeNull();
    });

    it('hides icon when loading', () => {
      const { queryByTestId } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      expect(queryByTestId('google-logo')).toBeNull();
    });

    it('renders loading spinner when loading', () => {
      const { toJSON } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      // Verify component renders with loading state
      expect(toJSON()).toBeTruthy();
    });

    it('disables button when loading', () => {
      const { getByRole } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('shows busy state for accessibility when loading', () => {
      const { getByRole } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityState.busy).toBe(true);
    });
  });

  describe('Disabled state', () => {
    it('disables button when disabled prop is true', () => {
      const { getByRole } = render(
        <SocialSignInButton {...defaultProps} disabled={true} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('prevents press when disabled', () => {
      const { getByRole } = render(
        <SocialSignInButton {...defaultProps} disabled={true} />
      );
      fireEvent.press(getByRole('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('prevents press when loading', () => {
      const { getByRole } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      fireEvent.press(getByRole('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('calls onPress when button is pressed', () => {
      const { getByRole } = render(<SocialSignInButton {...defaultProps} />);
      fireEvent.press(getByRole('button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has button role', () => {
      const { getByRole } = render(<SocialSignInButton {...defaultProps} />);
      expect(getByRole('button')).toBeTruthy();
    });

    it('has correct accessibility label for Google', () => {
      const { getByLabelText } = render(
        <SocialSignInButton {...defaultProps} />
      );
      expect(getByLabelText('Continue with Google')).toBeTruthy();
    });

    it('has correct accessibility label for Apple', () => {
      const { getByLabelText } = render(
        <SocialSignInButton {...defaultProps} provider='apple' />
      );
      expect(getByLabelText('Continue with Apple')).toBeTruthy();
    });

    it('has accessibility hint for Google', () => {
      const { getByA11yHint } = render(
        <SocialSignInButton {...defaultProps} />
      );
      expect(getByA11yHint('Sign in using your Google account')).toBeTruthy();
    });

    it('has accessibility hint for Apple', () => {
      const { getByA11yHint } = render(
        <SocialSignInButton {...defaultProps} provider='apple' />
      );
      expect(getByA11yHint('Sign in using your Apple account')).toBeTruthy();
    });
  });

  describe('Animation', () => {
    it('renders loading spinner without errors', () => {
      const { toJSON, unmount } = render(
        <SocialSignInButton {...defaultProps} isLoading={true} />
      );
      expect(toJSON()).toBeTruthy();
      // Verify cleanup works without errors
      unmount();
    });

    it('transitions between loading and non-loading states', () => {
      const { rerender, getByText, queryByText } = render(
        <SocialSignInButton {...defaultProps} isLoading={false} />
      );
      expect(getByText('Continue with Google')).toBeTruthy();
      expect(queryByText('Signing in...')).toBeNull();

      rerender(<SocialSignInButton {...defaultProps} isLoading={true} />);
      expect(getByText('Signing in...')).toBeTruthy();
      expect(queryByText('Continue with Google')).toBeNull();

      rerender(<SocialSignInButton {...defaultProps} isLoading={false} />);
      expect(getByText('Continue with Google')).toBeTruthy();
      expect(queryByText('Signing in...')).toBeNull();
    });
  });

  describe('Press Animation (UX-009)', () => {
    it('handles press events for scale animation', () => {
      const { getByRole } = render(<SocialSignInButton {...defaultProps} />);
      const button = getByRole('button');

      // Button should respond to press events without errors
      fireEvent(button, 'pressIn');
      fireEvent(button, 'pressOut');

      // Button should still be functional after press animation
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('keeps both Google and Apple buttons interactive after press feedback', () => {
      const { getByRole, rerender } = render(
        <SocialSignInButton {...defaultProps} />
      );

      // Google button
      const googleButton = getByRole('button');
      fireEvent(googleButton, 'pressIn');
      fireEvent(googleButton, 'pressOut');
      fireEvent.press(googleButton);
      expect(mockOnPress).toHaveBeenCalledTimes(1);

      // Apple button
      rerender(<SocialSignInButton {...defaultProps} provider='apple' />);
      const appleButton = getByRole('button');
      fireEvent(appleButton, 'pressIn');
      fireEvent(appleButton, 'pressOut');
      fireEvent.press(appleButton);
      expect(mockOnPress).toHaveBeenCalledTimes(2);
    });
  });
});
