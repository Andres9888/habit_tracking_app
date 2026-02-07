/**
 * SignInFormSection Types
 */

import type { AnimatedStyleProp, ViewStyle } from 'react-native-reanimated';

export interface SignInFormSectionProps {
  contentStyle: AnimatedStyleProp<ViewStyle>;
  emailAddress: string;
  setEmailAddress: (value: string) => void;
  emailError: string | null;
  onEmailBlur: () => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  isAnyLoading: boolean;
  canSubmit: boolean;
  oauthLoading: string | null | false;
  oauthError: string | null;
  clearError: () => void;
  handleSignIn: () => void;
  signInWithApple: () => void;
  signInWithGoogle: () => void;
  onForgotPassword: () => void;
}
