/**
 * ForgotPasswordModal - OPTIMIZED: Entry animations, stagger, polish
 */

import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

  const handleSubmit = useCallback(() => {
    void handleResetPassword();
  }, [handleResetPassword]);

  return (
    <Modal
      disableBackdropClose={isLoading}
      disableGestureClose={isLoading}
      variant='centerAlert'
      visible={visible}
      onClose={handleClose}
    >
      <View className='gap-4'>
        {/* Header - OPTIMIZED: FadeInDown entry */}
        <Animated.View
          className='gap-1'
          entering={FadeInDown.duration(280).springify().damping(18)}
        >
          <Text
            className='font-bold text-stone-900'
            style={{ fontSize: 22, letterSpacing: -0.35, lineHeight: 28 }}
          >
            Reset Password
          </Text>
          <Text className='text-[15px] leading-[20px] text-stone-500'>
            {success
              ? 'Check your email for reset instructions'
              : "Enter your email and we'll send you a reset link"}
          </Text>
        </Animated.View>

        {/* Content - OPTIMIZED: FadeInDown with delay */}
        <Animated.View
          entering={FadeInDown.duration(280).delay(80).springify().damping(18)}
        >
          {success ? (
            <PasswordResetSuccess onClose={handleClose} />
          ) : (
            <PasswordResetForm
              email={email}
              error={error}
              isLoading={isLoading}
              onCancel={handleClose}
              onEmailChange={handleEmailChange}
              onSubmit={handleSubmit}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

export default ForgotPasswordModal;
