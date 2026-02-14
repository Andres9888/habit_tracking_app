/**
 * ForgotPasswordModal - Dark mode aware
 */

import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Modal from '../../../../components/Modal';
import { PasswordResetForm } from './PasswordResetForm';
import { PasswordResetSuccess } from './PasswordResetSuccess';
import { useForgotPassword } from './useForgotPassword';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { ForgotPasswordModalProps } from './types';

export function ForgotPasswordModal({
  visible,
  onClose,
}: ForgotPasswordModalProps) {
  const { colors } = useThemeColors();
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
      <View style={styles.container}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(280).springify().damping(18)}
          style={styles.header}
        >
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {success
              ? 'Check your email for reset instructions'
              : "Enter your email and we'll send you a reset link"}
          </Text>
        </Animated.View>

        {/* Content */}
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

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 4,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.35,
    lineHeight: 28,
  },
});

export default ForgotPasswordModal;
