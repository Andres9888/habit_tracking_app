import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState, useEffect, useRef } from 'react';
import { ERROR_MESSAGES } from '../../../../constants/errorMessages';

interface UseForgotPasswordReturn {
  email: string;
  error: string | null;
  isLoading: boolean;
  success: boolean;
  setEmail: (email: string) => void;
  clearError: () => void;
  handleResetPassword: () => Promise<void>;
  resetState: () => void;
}

/** Email validation helper */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function useForgotPassword(): UseForgotPasswordReturn {
  const { signIn } = useSignIn();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleResetPassword = useCallback(async () => {
    // Clear previous errors
    setError(null);

    // Validate email
    if (!email.trim()) {
      setError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
      return;
    }

    if (!isValidEmail(email)) {
      setError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
      return;
    }

    setIsLoading(true);

    try {
      // Clerk password reset flow
      await signIn?.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });

      if (!isMountedRef.current) return;
      setSuccess(true);
      setError(null);
    } catch (error_: unknown) {

      if (!isMountedRef.current) return;

      // Handle common errors
      const clerkError = error_ as { errors?: Array<{ code?: string; message?: string }> };
      if (clerkError.errors?.[0]?.code === 'form_identifier_not_found') {
        setError('No account found with this email address');
      } else if (clerkError.errors?.[0]?.code === 'form_password_pwned') {
        setError(
          'This password has been compromised. Please choose a different one.'
        );
      } else {
        setError(
          clerkError.errors?.[0]?.message ||
            ERROR_MESSAGES.AUTH.PASSWORD_RESET_FAILED
        );
      }
      setSuccess(false);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [email, signIn]);

  const resetState = useCallback(() => {
    setEmail('');
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  }, []);

  return {
    clearError,
    email,
    error,
    handleResetPassword,
    isLoading,
    resetState,
    setEmail,
    success,
  };
}
