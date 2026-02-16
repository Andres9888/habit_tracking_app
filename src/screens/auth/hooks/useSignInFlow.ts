/* eslint-disable max-lines-per-function */
import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail } from '../../../utils/validation';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export function useSignInFlow() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Email validation
  const emailField = useFieldValidation({
    debounceMs: 500,
    showErrorsAfterBlur: true,
    validate: validateEmail,
  });

  const clearSignInError = useCallback(() => {
    setSignInError(null);
  }, []);

  const handleSignIn = useCallback(async () => {
    if (!isLoaded) return;

    // Validate email before submitting
    const emailResult = emailField.validateNow();
    if (!emailResult.isValid) {
      setSignInError(ERROR_MESSAGES.AUTH.SIGN_IN_INVALID_EMAIL);
      return;
    }

    setIsLoading(true);
    setSignInError(null);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailField.value,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        setSignInError('Sign in incomplete. Please check your credentials.');
      }
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message?: string }> };
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      setSignInError(
        clerkError.errors?.[0]?.message || ERROR_MESSAGES.AUTH.SIGN_IN_FAILED
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, emailField, password, setActive]);

  const canSubmit = !!emailField.value && !!password && emailField.isValid;

  return {
    canSubmit,
    clearSignInError,
    emailAddress: emailField.value,
    emailError: emailField.error,
    handleSignIn,
    isLoading,
    onEmailBlur: emailField.onBlur,
    password,
    setEmailAddress: emailField.setValue,
    setPassword,
    signInError,
  };
}
