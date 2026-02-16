/* eslint-disable max-lines-per-function */
import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail } from '../../../utils/validation';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

// Map Clerk error codes to friendly messages
const getSignInErrorMessage = (error: unknown): string => {
  const clerkError = error as {
    errors?: Array<{
      code?: string;
      message?: string;
      longMessage?: string;
    }>;
  };
  const firstError = clerkError.errors?.[0];
  const errorCode = firstError?.code;

  // Specific error handling based on Clerk error codes
  if (errorCode === 'form_identifier_not_found') {
    return "We couldn't find an account with that email. Would you like to create one?";
  }
  if (errorCode === 'form_password_incorrect') {
    return "That password doesn't look right. Please check and try again.";
  }
  if (errorCode === 'session_too_long') {
    return 'Your session is too long. Please sign in again.';
  }
  if (errorCode === 'too_many_attempts') {
    return ERROR_MESSAGES.AUTH.SIGN_IN_RATE_LIMITED;
  }

  // Fall back to Clerk's message or default
  return firstError?.longMessage || firstError?.message || ERROR_MESSAGES.AUTH.SIGN_IN_FAILED;
};

export function useSignInFlow() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const emailField = useFieldValidation({
    debounceMs: 500,
    showErrorsAfterBlur: true,
    validate: validateEmail,
  });

  const handleSignIn = useCallback(async () => {
    if (!isLoaded) return;

    // Validate email before submitting
    const emailResult = emailField.validateNow();
    if (!emailResult.isValid) {
      Alert.alert('Check your email', ERROR_MESSAGES.AUTH.SIGN_IN_INVALID_EMAIL);
      return;
    }

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailField.value,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert(
          'Something went wrong',
          'Sign in incomplete. Please check your credentials and try again.'
        );
      }
    } catch (error: unknown) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      Alert.alert(
        "Couldn't sign in",
        getSignInErrorMessage(error)
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, emailField, password, setActive]);

  const canSubmit = !!emailField.value && !!password && emailField.isValid;

  return {
    canSubmit,
    emailAddress: emailField.value,
    emailError: emailField.error,
    handleSignIn,
    isLoading,
    onEmailBlur: emailField.onBlur,
    password,
    setEmailAddress: emailField.setValue,
    setPassword,
  };
}
