/**
 * ForgotPasswordModal Component
 *
 * A modal that allows users to reset their password via email.
 * Integrates with Clerk's password reset API.
 */

import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Modal from '../../../../components/Modal';
import { PasswordResetForm } from './PasswordResetForm';
import { PasswordResetSuccess } from './PasswordResetSuccess';
import { useForgotPassword } from './useForgotPassword';
import type { ForgotPasswordModalProps } from './types';

export function ForgotPasswordModal({
  visible,
  onClose,
}: ForgotPasswordModalProps) {
  const {
    email,
    error,
    isLoading,
    success,
    setEmail,
    clearError,
    handleResetPassword,
    resetState,
  } = useForgotPassword();

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      clearError();
    },
    [setEmail, clearError]
  );

  return (
    <Modal
      disableBackdropClose={isLoading}
      disableGestureClose={isLoading}
      variant='centerAlert'
      visible={visible}
      onClose={handleClose}
    >
      <View className='gap-4'>
        {/* Header */}
        <View className='gap-1'>
          <Text className='text-2xl font-extrabold tracking-tight text-stone-900'>
            Reset Password
          </Text>
          <Text className='text-sm text-stone-500'>
            {success
              ? 'Check your email for reset instructions'
              : "Enter your email address and we'll send you a link to reset your password"}
          </Text>
        </View>

        {/* Content */}
        {success ? (
          <PasswordResetSuccess onClose={handleClose} />
        ) : (
          <PasswordResetForm
            email={email}
            error={error}
            isLoading={isLoading}
            onCancel={handleClose}
            onEmailChange={handleEmailChange}
            onSubmit={handleResetPassword}
          />
        )}
      </View>
    </Modal>
  );
}

export default ForgotPasswordModal;
