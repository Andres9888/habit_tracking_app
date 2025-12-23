import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import SignInScreen from '../SignInScreen';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  const React = require('react');
  const { View } = require('react-native');

  return {
    ...Reanimated,
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: (callback: () => object) => callback(),
    withTiming: (toValue: number) => toValue,
    withSpring: (toValue: number) => toValue,
    withRepeat: (animation: any) => animation,
    withSequence: (...args: any[]) => args[args.length - 1],
    runOnJS: (fn: Function) => fn,
    default: {
      ...Reanimated.default,
      View: React.forwardRef((props: any, ref: any) => (
        <View ref={ref} {...props} />
      )),
    },
  };
});

// Mock dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: () => ({
    signIn: {
      create: jest.fn(),
    },
    setActive: jest.fn(),
    isLoaded: true,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  }),
}));

jest.mock('../components', () => {
  const React = require('react');
  const { TextInput, TouchableOpacity, Text, View } = require('react-native');

  return {
    AnimatedLogo: () => null,
    ForgotPasswordModal: () => null,
    SuccessOverlay: ({ visible }: { visible: boolean }) =>
      visible ? <View testID='success-overlay' /> : null,
    FormInput: (props: any) => (
      <TextInput
        testID={props.testID || 'form-input'}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}
        accessibilityLabel={props.accessibilityLabel}
      />
    ),
    PasswordInput: React.forwardRef((props: any, ref: any) => (
      <TextInput
        ref={ref}
        testID='password-input'
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={true}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}
      />
    )),
    SubmitButton: (props: any) => (
      <TouchableOpacity
        testID='submit-button'
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <Text>{props.isLoading ? props.loadingLabel : props.label}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../../../components/auth/SocialLoginButtons', () => ({
  SocialLoginButtons: () => null,
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Responsive Layout', () => {
    it('renders with ScrollView wrapper', () => {
      const { getByTestId } = render(<SignInScreen />);

      const scrollView = getByTestId('sign-in-scroll-view');
      expect(scrollView).toBeTruthy();
    });

    it('ScrollView has keyboardShouldPersistTaps set to handled', () => {
      const { getByTestId } = render(<SignInScreen />);

      const scrollView = getByTestId('sign-in-scroll-view');
      expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled');
    });

    it('applies safe area insets to content padding', () => {
      const { getByTestId } = render(<SignInScreen />);

      const scrollView = getByTestId('sign-in-scroll-view');
      const contentContainerStyle = scrollView.props.contentContainerStyle;

      // Top inset (44) + 16 = 60
      expect(contentContainerStyle.paddingTop).toBe(60);
      // Bottom inset (34) + 24 = 58
      expect(contentContainerStyle.paddingBottom).toBe(58);
      // Horizontal padding
      expect(contentContainerStyle.paddingHorizontal).toBe(24);
    });

    it('ScrollView has flexGrow: 1 for proper layout', () => {
      const { getByTestId } = render(<SignInScreen />);

      const scrollView = getByTestId('sign-in-scroll-view');
      expect(scrollView.props.contentContainerStyle.flexGrow).toBe(1);
    });
  });

  describe('Keyboard Handling', () => {
    it('email input has returnKeyType next', () => {
      const { getByPlaceholderText } = render(<SignInScreen />);

      const emailInput = getByPlaceholderText('Enter your email address');
      expect(emailInput.props.returnKeyType).toBe('next');
    });

    it('password input has returnKeyType done', () => {
      const { getByTestId } = render(<SignInScreen />);

      const passwordInput = getByTestId('password-input');
      expect(passwordInput.props.returnKeyType).toBe('done');
    });
  });

  describe('Touch Target Sizes', () => {
    it('forgot password link is rendered', () => {
      const { getByText } = render(<SignInScreen />);

      const forgotPasswordText = getByText('Forgot Password?');
      expect(forgotPasswordText).toBeTruthy();
    });

    it('sign up link is rendered when navigation callback is provided', () => {
      const mockNavigate = jest.fn();
      const { getByText } = render(
        <SignInScreen onNavigateToSignUp={mockNavigate} />
      );

      const signUpText = getByText('Sign Up');
      expect(signUpText).toBeTruthy();
    });
  });

  describe('Navigation Callback', () => {
    it('does not show sign up prompt when no callback is provided', () => {
      const { queryByText } = render(<SignInScreen />);

      expect(queryByText("Don't have an account?")).toBeNull();
    });

    it('shows sign up prompt when callback is provided', () => {
      const mockNavigate = jest.fn();
      const { getByText } = render(
        <SignInScreen onNavigateToSignUp={mockNavigate} />
      );

      expect(getByText("Don't have an account?")).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
    });

    it('calls navigation callback when sign up is pressed', () => {
      const mockNavigate = jest.fn();
      const { getByText } = render(
        <SignInScreen onNavigateToSignUp={mockNavigate} />
      );

      const signUpButton = getByText('Sign Up');
      fireEvent.press(signUpButton);

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Welcome Content', () => {
    it('displays welcome message with emoji', () => {
      const { getByText } = render(<SignInScreen />);

      expect(getByText('Welcome Back! \uD83D\uDC4B')).toBeTruthy();
    });

    it('displays subtitle text', () => {
      const { getByText } = render(<SignInScreen />);

      expect(getByText('Sign in to continue your journey')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('forgot password has proper accessibility attributes', () => {
      const { getByLabelText } = render(<SignInScreen />);

      const forgotPasswordButton = getByLabelText('Forgot password?');
      expect(forgotPasswordButton).toBeTruthy();
      expect(forgotPasswordButton.props.accessibilityRole).toBe('button');
    });

    it('sign up has proper accessibility attributes when shown', () => {
      const mockNavigate = jest.fn();
      const { getByLabelText } = render(
        <SignInScreen onNavigateToSignUp={mockNavigate} />
      );

      const signUpButton = getByLabelText('Sign up');
      expect(signUpButton).toBeTruthy();
      expect(signUpButton.props.accessibilityRole).toBe('button');
    });

    it('email input has accessibility label', () => {
      const { getByLabelText } = render(<SignInScreen />);

      const emailInput = getByLabelText('Email input');
      expect(emailInput).toBeTruthy();
    });
  });

  describe('Form State', () => {
    it('submit button is disabled when email and password are empty', () => {
      const { getByTestId } = render(<SignInScreen />);

      const submitButton = getByTestId('submit-button');
      // The disabled prop is passed to TouchableOpacity which uses accessibilityState
      expect(submitButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('submit button is disabled when only email is filled', () => {
      const { getByTestId, getByPlaceholderText } = render(<SignInScreen />);

      const emailInput = getByPlaceholderText('Enter your email address');
      fireEvent.changeText(emailInput, 'test@example.com');

      const submitButton = getByTestId('submit-button');
      expect(submitButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('submit button is enabled when both email and password are filled', () => {
      const { getByTestId, getByPlaceholderText } = render(<SignInScreen />);

      const emailInput = getByPlaceholderText('Enter your email address');
      const passwordInput = getByTestId('password-input');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId('submit-button');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });
  });
});
