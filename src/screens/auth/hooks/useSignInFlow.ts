/* eslint-disable max-lines-per-function */
import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail } from '../../../utils/validation';
import { t } from '../../../i18n';


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
      Alert.alert(t('common.error'), t('auth.validationErrorEmail'));

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
          t('common.error'),
          'Sign in incomplete. Please check your credentials.'
        );
      }
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message?: string }> };
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      Alert.alert(
        t('common.error'),
        clerkError.errors?.[0]?.message || t('auth.failedSignIn')

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
