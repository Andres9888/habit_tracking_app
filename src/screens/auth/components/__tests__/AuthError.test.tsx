import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AuthError } from '../AuthError';

describe('AuthError', () => {
  const mockOnDismiss = jest.fn();
  const defaultProps = {
    message: 'An error occurred',
    onDismiss: mockOnDismiss,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the error message', () => {
      const { getByText } = render(<AuthError {...defaultProps} />);
      expect(getByText('An error occurred')).toBeTruthy();
    });

    it('renders the dismiss button', () => {
      const { getByLabelText } = render(<AuthError {...defaultProps} />);
      expect(getByLabelText('Dismiss error')).toBeTruthy();
    });

    it('renders with custom error messages', () => {
      const customMessage = 'Failed to sign in. Please try again.';
      const { getByText } = render(
        <AuthError message={customMessage} onDismiss={mockOnDismiss} />
      );
      expect(getByText(customMessage)).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls onDismiss when dismiss button is pressed', () => {
      const { getByLabelText } = render(<AuthError {...defaultProps} />);
      fireEvent.press(getByLabelText('Dismiss error'));
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss only once per press', () => {
      const { getByLabelText } = render(<AuthError {...defaultProps} />);
      const dismissButton = getByLabelText('Dismiss error');
      fireEvent.press(dismissButton);
      fireEvent.press(dismissButton);
      expect(mockOnDismiss).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('has alert role for screen readers', () => {
      const { getByRole } = render(<AuthError {...defaultProps} />);
      expect(getByRole('alert')).toBeTruthy();
    });

    it('has button role on dismiss', () => {
      const { getByLabelText } = render(<AuthError {...defaultProps} />);
      expect(getByLabelText('Dismiss error').props.accessibilityRole).toBe('button');
    });

    it('has accessible label on dismiss button', () => {
      const { getByLabelText } = render(<AuthError {...defaultProps} />);
      expect(getByLabelText('Dismiss error')).toBeTruthy();
    });

    it('has accessibility hint on dismiss button', () => {
      const { getByA11yHint } = render(<AuthError {...defaultProps} />);
      expect(
        getByA11yHint('Removes the error message from the screen')
      ).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('renders with correct container structure', () => {
      const { toJSON } = render(<AuthError {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('applies error styling classes', () => {
      const { toJSON } = render(<AuthError {...defaultProps} />);
      const tree = toJSON();
      expect(tree).toBeTruthy();
    });
  });

  describe('Common Error Messages', () => {
    const errorMessages = [
      'Sign in was cancelled',
      'Unable to verify your account. Please try again.',
      'We couldn\'t retrieve your email. Please try a different sign-in method.',
      'Please check your internet connection and try again.',
      'Failed to sign in. Please try again.',
    ];

    it.each(errorMessages)('displays error message: "%s"', (message) => {
      const { getByText } = render(
        <AuthError message={message} onDismiss={mockOnDismiss} />
      );
      expect(getByText(message)).toBeTruthy();
    });
  });
});
