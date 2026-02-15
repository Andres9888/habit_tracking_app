
import { useCallback, useState } from 'react';

import { useSignIn } from '@clerk/clerk-expo';

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

  const clearError = useCallback(() => setError(null), []);

  const handleResetPassword = useCallback(async () => {
    // Clear previous errors
    setError(null);

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Clerk password reset flow
      await signIn?.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });

      setSuccess(true);
      setError(null);
    } catch (error_: unknown) {
      if (__DEV__) console.error('Password reset error:', error_);

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
            'Failed to send reset email. Please try again.'
        );
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
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
