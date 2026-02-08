/**
 * SignInFormSection Types
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

export interface SignInFormSectionProps {
  contentStyle: AnimatedStyle<ViewStyle>;
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
