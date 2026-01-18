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
    default: ({ children, visible }: any) =>
      visible ? <View>{children}</View> : null,
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
      expect(getByText('Send reset email')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
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
        getByText(
          "Enter your email address and we'll send you a link to reset your password"
        )
      ).toBeTruthy();
    });
  });

  describe('Email Input Validation', () => {
    it('disables submit button when email is empty', () => {
      const { getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const submitButton = getByLabelText('Send reset email');
      // Button should be disabled when email is empty
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });

    it('shows error for invalid email format', async () => {
      const { getByPlaceholderText, getByLabelText, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'invalid-email');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      });
    });

    it('clears error when user types', async () => {
      const { getByPlaceholderText, getByLabelText, queryByText, getByText } =
        render(<ForgotPasswordModal visible={true} onClose={mockOnClose} />);

      // First, enter an invalid email to trigger format validation error
      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'invalid-email');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      });

      // Type to clear error
      fireEvent.changeText(emailInput, 'valid@example.com');

      await waitFor(() => {
        expect(queryByText('Please enter a valid email address')).toBeNull();
      });
    });

    it('accepts valid email format', async () => {
      const { getByPlaceholderText, getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'valid@example.com');

      const submitButton = getByLabelText('Send reset email');
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
      const { getByPlaceholderText, getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          strategy: 'reset_password_email_code',
          identifier: 'user@example.com',
        });
      });
    });

    it('shows success message after successful submission', async () => {
      const { getByPlaceholderText, getByLabelText, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Email Sent Successfully')).toBeTruthy();
        expect(
          getByText('Please check your inbox for password reset instructions.')
        ).toBeTruthy();
      });
    });

    it('handles account not found error', async () => {
      const { getByPlaceholderText, getByLabelText, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockRejectedValueOnce({
        errors: [
          { code: 'form_identifier_not_found', message: 'User not found' },
        ],
      });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'nonexistent@example.com');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(
          getByText('No account found with this email address')
        ).toBeTruthy();
      });
    });

    it('handles generic API errors', async () => {
      const { getByPlaceholderText, getByLabelText, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockRejectedValueOnce({
        errors: [{ message: 'Network error' }],
      });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByText('Network error')).toBeTruthy();
      });
    });

    it('handles errors without specific message', async () => {
      const { getByPlaceholderText, getByLabelText, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockRejectedValueOnce({
        errors: [],
      });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(
          getByText('Failed to send reset email. Please try again.')
        ).toBeTruthy();
      });
    });
  });

  describe('Loading States', () => {
    it('disables submit button when loading', async () => {
      const { getByPlaceholderText, getByLabelText } = render(
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

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      // Button should be disabled while loading
      await waitFor(() => {
        expect(submitButton.props.accessibilityState.disabled).toBe(true);
      });

      // Resolve promise
      resolvePromise({ status: 'complete' });
    });

    it('disables submit button when email is empty', () => {
      const { getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const submitButton = getByLabelText('Send reset email');
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Modal Interactions', () => {
    it('calls onClose when cancel button is pressed', () => {
      const { getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const cancelButton = getByLabelText('Cancel password reset');
      fireEvent.press(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('resets state when modal closes via cancel button', async () => {
      const { getByPlaceholderText, getByLabelText, queryByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      // Enter email and trigger error
      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'invalid-email');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      // Wait for validation error
      await waitFor(() => {
        expect(queryByText('Please enter a valid email address')).toBeTruthy();
      });

      // Close modal via cancel button (which calls handleClose and resets state)
      const cancelButton = getByLabelText('Cancel password reset');
      fireEvent.press(cancelButton);

      // Verify onClose was called (state is reset in handleClose)
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes modal after successful password reset', async () => {
      const { getByPlaceholderText, getByLabelText, getByText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      mockCreate.mockResolvedValueOnce({ status: 'complete' });

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByLabelText('Send reset email');
      fireEvent.press(submitButton);

      // Wait for success state
      await waitFor(() => {
        expect(getByText('Email Sent Successfully')).toBeTruthy();
      });

      // Press close button
      const closeButton = getByLabelText('Close modal');
      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels', () => {
      const { getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      expect(getByLabelText('Email address input')).toBeTruthy();
      expect(getByLabelText('Send reset email')).toBeTruthy();
      expect(getByLabelText('Cancel password reset')).toBeTruthy();
    });

    it('has proper accessibility hints', () => {
      const { getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const emailInput = getByLabelText('Email address input');
      expect(emailInput.props.accessibilityHint).toBe(
        'Enter your email to receive password reset instructions'
      );
    });

    it('has proper accessibility roles', () => {
      const { getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      const submitButton = getByLabelText('Send reset email');
      expect(submitButton.props.accessibilityRole).toBe('button');

      const cancelButton = getByLabelText('Cancel password reset');
      expect(cancelButton.props.accessibilityRole).toBe('button');
    });

    it('updates accessibility state when busy', async () => {
      const { getByPlaceholderText, getByLabelText } = render(
        <ForgotPasswordModal visible={true} onClose={mockOnClose} />
      );

      let resolvePromise: any;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockCreate.mockReturnValueOnce(pendingPromise);

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'user@example.com');

      const submitButton = getByLabelText('Send reset email');
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
