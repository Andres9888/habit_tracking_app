/* eslint-disable max-lines-per-function */
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { getClerkErrorMessage } from '../utils/getClerkErrorMessage';
import { t } from '../../../i18n';

export function useSignUpFlow() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const emailField = useFieldValidation({
    debounceMs: 500,
    showErrorsAfterBlur: true,
    validate: validateEmail,
  });

  // Password validation
  const passwordField = useFieldValidation({
    debounceMs: 500,
    showErrorsAfterBlur: true,
    validate: validatePassword,
  });

  const handleSignUp = async () => {
    if (!isLoaded) return;

    // Validate before submitting
    const emailResult = emailField.validateNow();
    const passwordResult = passwordField.validateNow();

    if (!emailResult.isValid || !passwordResult.isValid) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before continuing'
      );
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: emailField.value,
        password: passwordField.value,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error: unknown) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      Alert.alert(t('common.error'), getClerkErrorMessage(error, t('auth.failedSignUp')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    if (!isLoaded) return;

    const normalizedCode = code.trim();

    if (normalizedCode.length !== 6) {
      Alert.alert(
        'Invalid code',
        'Please enter a valid 6-digit verification code.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: normalizedCode,
      });

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
      } else {
        if (__DEV__) console.error(JSON.stringify(attempt, null, 2));
        Alert.alert(t('common.error'), t('auth.verificationIncomplete'));
      }
    } catch (error: unknown) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      Alert.alert(
        'Error',
        getClerkErrorMessage(error, 'Failed to verify email')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emailAddress: emailField.value,
    emailError: emailField.error,
    handleSignUp,
    handleVerification,
    isFormValid: emailField.isValid && passwordField.isValid,
    isLoading,
    onEmailBlur: emailField.onBlur,
    onPasswordBlur: passwordField.onBlur,
    password: passwordField.value,
    passwordError: passwordField.error,
    pendingVerification,
    setEmailAddress: emailField.setValue,
    setPassword: passwordField.setValue,
  };
}
