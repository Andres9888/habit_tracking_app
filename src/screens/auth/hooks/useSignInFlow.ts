/* eslint-disable max-lines-per-function */
import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { useToast } from '../../../components/Toast';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail } from '../../../utils/validation';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export function useSignInFlow() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

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
<<<<<<< HEAD
      Alert.alert('Validation Error', ERROR_MESSAGES.AUTH.SIGN_IN_INVALID_EMAIL);
=======
      toast.warning('Validation Error', 'Please enter a valid email address');
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
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
        toast.error('Sign In Incomplete', 'Please check your credentials.');
      }
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message?: string }> };
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
<<<<<<< HEAD
      Alert.alert(
        'Error',
        clerkError.errors?.[0]?.message || ERROR_MESSAGES.AUTH.SIGN_IN_FAILED
      );
=======
      toast.error('Sign In Failed', clerkError.errors?.[0]?.message || 'Failed to sign in');
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
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
