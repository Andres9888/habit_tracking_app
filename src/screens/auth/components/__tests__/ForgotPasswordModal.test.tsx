/**
 * ForgotPasswordModal Component Tests
 *
 * Test suite for the password reset modal component.
 */

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ForgotPasswordModal } from '../ForgotPasswordModal';

// Mock Clerk
const mockCreate = jest.fn();
jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: () => ({
    signIn: {
      create: mockCreate,
    },
  }),
}));

// Mock Modal component
jest.mock('../../../../components/Modal', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, visible }: any) => (visible ? <View>{children}</View> : null),
  };
});

describe('ForgotPasswordModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly when visible', () => {
      const { getByText, getByPlaceholderText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      expect(getByText('Reset Password')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email address')).toBeTruthy();
      expect(getByText('SEND RESET EMAIL')).toBeTruthy();
      expect(getByText('CANCEL')).toBeTruthy();
    });

    it('does not render when not visible', () => {
      const { queryByText } = render(
        <ForgotPasswordModal visible={false} onClose={mockOnClose} />
      );

      expect(queryByText('Reset Password')).toBeNull();
    });

    it('displays helper text', () => {
      const { getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      expect(
        getByText("Enter your email address and we'll send you a link to reset your password")
      ).toBeTruthy();
    });
  });

  describe('Email Input Validation', () => {
    it('shows error when email is empty on submit', async () => {
      const { getByText, getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Please enter your email address')).toBeTruthy();
      });
    });

    it('shows error for invalid email format', async () => {
      const { getByPlaceholderText, getByA11yLabel, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'invalid-email');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      });
    });

    it('clears error when user types', async () => {
      const { getByPlaceholderText, getByA11yLabel, queryByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      // Trigger error first
      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(queryByText('Please enter your email address')).toBeTruthy();
      });

      // Type to clear error
      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'test@example.com');

      await waitFor(() => {
        expect(queryByText('Please enter your email address')).toBeNull();
      });
    });

    it('accepts valid email format', async () => {
      const { getByPlaceholderText, getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'valid@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          strategy: 'reset_password_email_code',
          identifier: 'valid@example.com',
        });
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('calls Clerk API with correct parameters', async () => {
      const { getByPlaceholderText, getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          strategy: 'reset_password_email_code',
          identifier: 'user@example.com',
        });
      });
    });

    it('shows success message after successful submission', async () => {
      const { getByPlaceholderText, getByA11yLabel, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Email Sent Successfully')).toBeTruthy();
        expect(
          getByText('Please check your inbox for password reset instructions.')
        ).toBeTruthy();
      });
    });

    it('handles account not found error', async () => {
      const { getByPlaceholderText, getByA11yLabel, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockRejectedValueOnce({
        errors: [{ code: 'form_identifier_not_found', message: 'User not found' }],
      });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'nonexistent@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('No account found with this email address')).toBeTruthy();
      });
    });

    it('handles generic API errors', async () => {
      const { getByPlaceholderText, getByA11yLabel, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockRejectedValueOnce({
        errors: [{ message: 'Network error' }],
      });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Network error')).toBeTruthy();
      });
    });

    it('handles errors without specific message', async () => {
      const { getByPlaceholderText, getByA11yLabel, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockRejectedValueOnce({
        errors: [],
      });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Failed to send reset email. Please try again.')).toBeTruthy();
      });
    });
  });

  describe('Loading States', () => {
    it('disables submit button when loading', async () => {
      const { getByPlaceholderText, getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      // Create a promise that won't resolve immediately
      let resolvePromise: any;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockCreate.mockReturnValueOnce(pendingPromise);

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      // Button should be disabled while loading
      await waitFor(() => {
        expect(submitButton.props.accessibilityState.disabled).toBe(true);
      });

      // Resolve promise
      resolvePromise({ status: 'complete' });
    });

    it('disables submit button when email is empty', () => {
      const { getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const submitButton = getByA11yLabel('Send reset email');
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Modal Interactions', () => {
    it('calls onClose when cancel button is pressed', () => {
      const { getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const cancelButton = getByA11yLabel('Cancel password reset');
      fireEvent.press(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('resets state when modal closes', async () => {
      const { getByPlaceholderText, getByA11yLabel, rerender } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      // Enter email and trigger error
      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'test@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      mockCreate.mockRejectedValueOnce({
        errors: [{ message: 'Error' }],
      });
      fireEvent.press(submitButton);

      // Close modal
      rerender(<ForgotPasswordModal visible={false} onClose={mockOnClose} />);

      // Reopen modal - state should be reset
      rerender(<ForgotPasswordModal visible={true} onClose={mockOnClose} />);

      const newEmailInput = getByPlaceholderText('Enter your email address');
      expect(newEmailInput.props.value).toBe('');
    });

    it('closes modal after successful password reset', async () => {
      const { getByPlaceholderText, getByA11yLabel, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      // Wait for success state
      await waitFor(() => {
        expect(getByText('Email Sent Successfully')).toBeTruthy();
      });

      // Press close button
      const closeButton = getByA11yLabel('Close modal');
      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', () => {
      const { getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      expect(getByA11yLabel('Email address input')).toBeTruthy();
      expect(getByA11yLabel('Send reset email')).toBeTruthy();
      expect(getByA11yLabel('Cancel password reset')).toBeTruthy();
    });

    it('has proper accessibility hints', () => {
      const { getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const emailInput = getByA11yLabel('Email address input');
      expect(emailInput.props.accessibilityHint).toBe(
        'Enter your email to receive password reset instructions'
      );
    });

    it('has proper accessibility roles', () => {
      const { getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const submitButton = getByA11yLabel('Send reset email');
      expect(submitButton.props.accessibilityRole).toBe('button');

      const cancelButton = getByA11yLabel('Cancel password reset');
      expect(cancelButton.props.accessibilityRole).toBe('button');
    });

    it('updates accessibility state when busy', async () => {
      const { getByPlaceholderText, getByA11yLabel } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      let resolvePromise: any;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockCreate.mockReturnValueOnce(pendingPromise);

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByA11yLabel('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(submitButton.props.accessibilityState.busy).toBe(true);
      });

      resolvePromise({ status: 'complete' });
    });
  });

  describe('Keyboard Handling', () => {
    it('submits form when return key is pressed', async () => {
      const { getByPlaceholderText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent(emailInput, 'submitEditing');

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          strategy: 'reset_password_email_code',
          identifier: 'user@example.com',
        });
      });
    });
  });
});
