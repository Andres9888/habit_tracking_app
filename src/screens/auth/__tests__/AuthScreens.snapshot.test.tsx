/**
 * Auth Screens Snapshot Tests
 * Task 4.5: Visual regression tests for WelcomeScreen, SignInScreen, SignUpScreen
 *
 * Tests visual consistency of auth screens to catch unintended UI changes.
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Import screens
import WelcomeScreen from '../WelcomeScreen';
import SignInScreen from '../SignInScreen';
import SignUpScreen from '../SignUpScreen';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <View testID='linear-gradient' {...props}>
        {children}
      </View>
    ),
  };
});

// Mock ForgotPasswordModal to avoid Extrapolation.CLAMP issue from Modal component
jest.mock('../components/ForgotPasswordModal', () => {
  const { View } = require('react-native');
  return {
    ForgotPasswordModal: ({ visible }: { visible: boolean }) =>
      visible ? <View testID='forgot-password-modal' /> : null,
  };
});

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  warmUpAsync: jest.fn(),
  coolDownAsync: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  }),
}));

// Mock Clerk hooks
jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: () => ({
    signIn: { create: jest.fn() },
    setActive: jest.fn(),
    isLoaded: true,
  }),
  useSignUp: () => ({
    signUp: {
      create: jest.fn(),
      prepareEmailAddressVerification: jest.fn(),
      attemptEmailAddressVerification: jest.fn(),
    },
    setActive: jest.fn(),
    isLoaded: true,
  }),
  useSSO: () => ({
    startSSOFlow: jest.fn(),
  }),
}));

// Mock auth hooks to provide controlled state
jest.mock('../hooks/useOAuthSignIn', () => ({
  useOAuthSignIn: () => ({
    signInWithGoogle: jest.fn(),
    signInWithApple: jest.fn(),
    isLoading: null,
    error: null,
    clearError: jest.fn(),
  }),
}));

jest.mock('../hooks/useSignInFlow', () => ({
  useSignInFlow: () => ({
    emailAddress: '',
    setEmailAddress: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    isLoading: false,
    handleSignIn: jest.fn(),
    canSubmit: false,
  }),
}));

jest.mock('../hooks/useSignUpFlow', () => ({
  useSignUpFlow: () => ({
    emailAddress: '',
    setEmailAddress: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    pendingVerification: false,
    isLoading: false,
    handleSignUp: jest.fn(),
    handleVerification: jest.fn(),
  }),
}));

describe('WelcomeScreen Snapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot in welcome mode', () => {
    const tree = render(<WelcomeScreen />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('SignInScreen Snapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot with empty form', () => {
    const tree = render(<SignInScreen />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with navigation callback', () => {
    const tree = render(<SignInScreen onNavigateToSignUp={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('SignUpScreen Snapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot with empty form', () => {
    const tree = render(<SignUpScreen />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with navigation callback', () => {
    const tree = render(<SignUpScreen onNavigateToSignIn={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
