/* eslint-disable max-lines-per-function, max-lines */
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { getClerkErrorMessage } from '../utils/getClerkErrorMessage';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

// Map Clerk error codes to friendly messages
const getSignUpErrorMessage = (error: unknown): string => {
  const clerkError = error as {
    errors?: Array<{
      code?: string;
      message?: string;
      longMessage?: string;
    }>;
  };
  const firstError = clerkError.errors?.[0];
  const errorCode = firstError?.code;

  // Specific error handling
  if (errorCode === 'form_identifier_exists') {
    return ERROR_MESSAGES.AUTH.SIGN_UP_EMAIL_EXISTS;
  }
  if (errorCode === 'form_password_invalid') {
    return 'Password is invalid. Please choose a stronger password.';
  }
  if (errorCode === 'form_password_too_short') {
    return 'Password is too short. Use at least 8 characters.';
  }

  return getClerkErrorMessage(error, ERROR_MESSAGES.AUTH.SIGN_UP_FAILED);
};

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
        'Check your information',
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
      Alert.alert("Couldn't create account", getSignUpErrorMessage(error));
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
        'Please enter the 6-digit code from your email.'
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
        Alert.alert('Verification incomplete', ERROR_MESSAGES.AUTH.SIGN_UP_VERIFICATION_INCOMPLETE);
      }
    } catch (error: unknown) {
      if (__DEV__) console.error(JSON.stringify(error, null, 2));
      
      // Check for specific verification errors
      const clerkError = error as {
        errors?: Array<{ code?: string }>;
      };
      const errorCode = clerkError.errors?.[0]?.code;
      
      if (errorCode === 'verification_code_incorrect') {
        Alert.alert('Incorrect code', 'The code you entered is incorrect. Please check your email and try again.');
      } else {
        Alert.alert(
          "Couldn't verify",
          getClerkErrorMessage(error, ERROR_MESSAGES.AUTH.SIGN_UP_VERIFICATION_INCOMPLETE)
        );
      }
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
