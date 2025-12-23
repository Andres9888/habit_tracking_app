/**
 * ForgotPasswordModal Component
 *
 * A modal that allows users to reset their password via email.
 * Integrates with Clerk's password reset API.
 *
 * Features:
 * - Email input with validation
 * - Clerk API integration for password reset
 * - Success/error state handling
 * - Smooth slide-out animation
 * - Accessibility support
 */

import { useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from '../../../components/Modal';

export interface ForgotPasswordModalProps {
  /** Modal visibility */
  visible: boolean;
  /** On close callback */
  onClose: () => void;
}

/**
 * Modal for password reset flow
 */
export function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
  const { signIn } = useSignIn();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
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
      // Step 1: Create a password reset request
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      // Success - show success message
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      console.error('Password reset error:', err);

      // Handle common errors
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError('No account found with this email address');
      } else if (err.errors?.[0]?.code === 'form_password_pwned') {
        setError('This password has been compromised. Please choose a different one.');
      } else {
        setError(err.errors?.[0]?.message || 'Failed to send reset email. Please try again.');
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setEmail('');
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      variant="centerAlert"
      disableGestureClose={isLoading}
      disableBackdropClose={isLoading}
    >
      <View className="gap-4">
        {/* Header */}
        <View className="gap-1">
          <Text className="text-2xl font-extrabold tracking-tight text-stone-900">
            Reset Password
          </Text>
          <Text className="text-sm text-stone-500">
            {success
              ? 'Check your email for reset instructions'
              : 'Enter your email address and we\'ll send you a link to reset your password'}
          </Text>
        </View>

        {/* Success State */}
        {success ? (
          <View className="gap-4 py-4">
            <View className="items-center justify-center rounded-2xl bg-green-50 p-6">
              <Text className="text-5xl">✓</Text>
              <Text className="mt-2 text-center text-base font-semibold text-green-900">
                Email Sent Successfully
              </Text>
              <Text className="mt-1 text-center text-sm text-green-700">
                Please check your inbox for password reset instructions.
              </Text>
            </View>

            <TouchableOpacity
              className="items-center rounded-3xl border border-stone-900 bg-stone-900 py-4"
              onPress={handleClose}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              accessibilityHint="Closes this dialog and returns to sign in"
            >
              <Text className="text-[13px] font-bold tracking-[3px] text-white">
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Form State */
          <View className="gap-4">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-[10px] font-medium tracking-[3px] text-stone-500">
                EMAIL ADDRESS
              </Text>
              <View className="relative">
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                  className={`rounded-3xl border ${
                    error ? 'border-red-600' : 'border-stone-200'
                  } bg-white px-5 py-3.5 text-base font-medium text-stone-900`}
                  editable={!isLoading}
                  keyboardType="email-address"
                  placeholder="Enter your email address"
                  placeholderTextColor="#a8a29e"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                  onSubmitEditing={handleResetPassword}
                  returnKeyType="send"
                  accessible={true}
                  accessibilityLabel="Email address input"
                  accessibilityHint="Enter your email to receive password reset instructions"
                />
                {/* Email icon prefix */}
                <View className="absolute left-4 top-1/2 -transtone-y-1/2">
                  <Text className="text-lg">📧</Text>
                </View>
                <View className="pl-10" />
              </View>
              {/* Error message */}
              {error && (
                <Text
                  className="text-xs font-medium text-red-600"
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                >
                  {error}
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            <View className="gap-2">
              {/* Submit Button */}
              <TouchableOpacity
                className={`items-center rounded-3xl border border-stone-900 bg-stone-900 py-4 ${
                  isLoading || !email.trim() ? 'opacity-40' : ''
                }`}
                disabled={isLoading || !email.trim()}
                onPress={handleResetPassword}
                accessibilityLabel="Send reset email"
                accessibilityRole="button"
                accessibilityHint="Sends password reset instructions to your email"
                accessibilityState={{
                  disabled: isLoading || !email.trim(),
                  busy: isLoading,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-[13px] font-bold tracking-[3px] text-white">
                    SEND RESET EMAIL
                  </Text>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                className="items-center rounded-3xl border border-stone-200 bg-white py-4"
                disabled={isLoading}
                onPress={handleClose}
                accessibilityLabel="Cancel password reset"
                accessibilityRole="button"
                accessibilityHint="Closes this dialog without sending reset email"
              >
                <Text className="text-[13px] font-bold tracking-[3px] text-stone-900">
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default ForgotPasswordModal;
