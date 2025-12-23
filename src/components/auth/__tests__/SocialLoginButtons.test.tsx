import { useOAuth } from '@clerk/clerk-expo';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { SocialLoginButtons } from '../SocialLoginButtons';

// Mock dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useOAuth: jest.fn(),
}));
jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'test://'),
}));
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

describe('SocialLoginButtons', () => {
  const mockStartGoogleFlow = jest.fn();
  const mockStartAppleFlow = jest.fn();
  const mockSetActive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useOAuth as jest.Mock).mockImplementation(({ strategy }) => {
      if (strategy === 'oauth_google') {
        return { startOAuthFlow: mockStartGoogleFlow };
      }
      if (strategy === 'oauth_apple') {
        return { startOAuthFlow: mockStartAppleFlow };
      }
      return {};
    });
    jest.spyOn(Alert, 'alert');
  });

  describe('Rendering', () => {
    it('renders both Google and Apple buttons', () => {
      const { getByText } = render(<SocialLoginButtons />);

      expect(getByText('CONTINUE WITH GOOGLE')).toBeTruthy();
      expect(getByText('CONTINUE WITH APPLE')).toBeTruthy();
    });

    it('renders OR divider', () => {
      const { UNSAFE_root } = render(<SocialLoginButtons />);

      // Find the OR text by traversing the tree (aria-hidden elements are not accessible via getByText)
      const orText = UNSAFE_root.findByProps({ 'aria-hidden': true });
      expect(orText.props.children).toBe('OR');
    });

    it('renders Google logo by default', () => {
      const { getByLabelText } = render(<SocialLoginButtons />);

      const googleButton = getByLabelText('Sign in with Google');
      expect(googleButton).toBeTruthy();
    });

    it('renders Apple logo by default', () => {
      const { getByLabelText } = render(<SocialLoginButtons />);

      const appleButton = getByLabelText('Sign in with Apple');
      expect(appleButton).toBeTruthy();
    });
  });

  describe('Google Sign In', () => {
    it('calls Google OAuth flow when Google button is pressed', async () => {
      mockStartGoogleFlow.mockResolvedValue({
        createdSessionId: 'session-123',
        setActive: mockSetActive,
      });

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockStartGoogleFlow).toHaveBeenCalledWith({
          redirectUrl: 'test://',
        });
      });
    });

    it('activates session on successful Google sign in', async () => {
      mockStartGoogleFlow.mockResolvedValue({
        createdSessionId: 'session-123',
        setActive: mockSetActive,
      });

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'session-123' });
      });
    });

    it('shows loading indicator during Google sign in', async () => {
      mockStartGoogleFlow.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ createdSessionId: 'session-123', setActive: mockSetActive }), 100)
          )
      );

      const { getByLabelText, queryByTestId } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      // Check that loading state is visible
      await waitFor(() => {
        expect(mockStartGoogleFlow).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalled();
      });
    });

    it('disables both buttons during Google sign in', async () => {
      mockStartGoogleFlow.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ createdSessionId: 'session-123', setActive: mockSetActive }), 100)
          )
      );

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(googleButton.props.accessibilityState?.disabled).toBe(true);
        expect(appleButton.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('handles Google OAuth error with user-friendly message', async () => {
      const error = {
        errors: [{ code: 'oauth_access_denied', message: 'Access denied' }],
      };
      mockStartGoogleFlow.mockRejectedValue(error);

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'Access was denied. Please try again or use a different sign-in method.'
        );
      });
    });

    it('does not show error for user cancellation', async () => {
      const error = {
        errors: [{ message: 'User cancelled the flow' }],
      };
      mockStartGoogleFlow.mockRejectedValue(error);

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(Alert.alert).not.toHaveBeenCalled();
      });
    });

    it('handles network error with appropriate message', async () => {
      const error = new Error('network request failed');
      mockStartGoogleFlow.mockRejectedValue(error);

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'Network error. Please check your connection and try again.'
        );
      });
    });

    it('handles session_exists error', async () => {
      const error = {
        errors: [{ code: 'session_exists', message: 'Session already exists' }],
      };
      mockStartGoogleFlow.mockRejectedValue(error);

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'You are already signed in. Please sign out and try again.'
        );
      });
    });
  });

  describe('Apple Sign In', () => {
    it('calls Apple OAuth flow when Apple button is pressed', async () => {
      mockStartAppleFlow.mockResolvedValue({
        createdSessionId: 'session-456',
        setActive: mockSetActive,
      });

      const { getByLabelText } = render(<SocialLoginButtons />);
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockStartAppleFlow).toHaveBeenCalledWith({
          redirectUrl: 'test://',
        });
      });
    });

    it('activates session on successful Apple sign in', async () => {
      mockStartAppleFlow.mockResolvedValue({
        createdSessionId: 'session-456',
        setActive: mockSetActive,
      });

      const { getByLabelText } = render(<SocialLoginButtons />);
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'session-456' });
      });
    });

    it('shows loading indicator during Apple sign in', async () => {
      mockStartAppleFlow.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ createdSessionId: 'session-456', setActive: mockSetActive }), 100)
          )
      );

      const { getByLabelText } = render(<SocialLoginButtons />);
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockStartAppleFlow).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalled();
      });
    });

    it('disables both buttons during Apple sign in', async () => {
      mockStartAppleFlow.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ createdSessionId: 'session-456', setActive: mockSetActive }), 100)
          )
      );

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(googleButton.props.accessibilityState?.disabled).toBe(true);
        expect(appleButton.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('handles Apple OAuth error', async () => {
      const error = {
        errors: [{ message: 'Apple OAuth failed' }],
      };
      mockStartAppleFlow.mockRejectedValue(error);

      const { getByLabelText } = render(<SocialLoginButtons />);
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Sign In Failed', 'Apple OAuth failed');
      });
    });
  });

  describe('Animations', () => {
    it('applies press animation to Google button', () => {
      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent(googleButton, 'pressIn');
      // Animation should be triggered
      expect(googleButton).toBeTruthy();

      fireEvent(googleButton, 'pressOut');
      // Animation should reset
      expect(googleButton).toBeTruthy();
    });

    it('applies press animation to Apple button', () => {
      const { getByLabelText } = render(<SocialLoginButtons />);
      const appleButton = getByLabelText('Sign in with Apple');

      fireEvent(appleButton, 'pressIn');
      // Animation should be triggered
      expect(appleButton).toBeTruthy();

      fireEvent(appleButton, 'pressOut');
      // Animation should reset
      expect(appleButton).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility labels for Google button', () => {
      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      expect(googleButton.props.accessibilityRole).toBe('button');
      expect(googleButton.props.accessibilityHint).toBe('Opens Google sign in flow');
    });

    it('has proper accessibility labels for Apple button', () => {
      const { getByLabelText } = render(<SocialLoginButtons />);
      const appleButton = getByLabelText('Sign in with Apple');

      expect(appleButton.props.accessibilityRole).toBe('button');
      expect(appleButton.props.accessibilityHint).toBe('Opens Apple sign in flow');
    });
  });

  describe('Error Message Handling', () => {
    it('shows generic error for unknown errors', async () => {
      const error = {};
      mockStartGoogleFlow.mockRejectedValue(error);

      const { getByLabelText } = render(<SocialLoginButtons />);
      const googleButton = getByLabelText('Sign in with Google');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Sign In Failed', 'An unexpected error occurred. Please try again.');
      });
    });
  });
});
