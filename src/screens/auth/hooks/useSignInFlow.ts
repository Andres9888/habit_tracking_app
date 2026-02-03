/* eslint-disable max-lines-per-function */
import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail } from '../../../utils/validation';

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
      Alert.alert('Validation Error', 'Please enter a valid email address');
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
          'Error',
          'Sign in incomplete. Please check your credentials.'
        );
      }
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message?: string }> };
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      Alert.alert(
        'Error',
        clerkError.errors?.[0]?.message || 'Failed to sign in'
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
