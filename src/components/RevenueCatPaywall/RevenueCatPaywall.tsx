/**
 * RevenueCatPaywall
 *
 * Native RevenueCat paywall using react-native-purchases-ui.
 * Uses the Paywall JSX component for better Expo compatibility.
 *
 * Benefits over custom paywalls:
 * - Remotely configurable (no app update needed)
 * - Built-in A/B testing support
 * - Automatic price localization
 * - Handles all edge cases (loading, errors, restore)
 */

import { Platform, Modal, View, Text, Pressable, Alert } from 'react-native';

import RevenueCatUI from 'react-native-purchases-ui';

import type { RevenueCatPaywallProps } from './types';
import { useThemeColors } from '../../theme/ThemeContext';

/**
 * Presents the RevenueCat native paywall
 *
 * On iOS/Android: Shows the full-screen paywall configured in RevenueCat dashboard
 * On Web: Shows a fallback message (RevenueCat doesn't support web)
 */
export function RevenueCatPaywall({
  visible,
  onClose,
  onPurchaseSuccess,
  onRestoreSuccess,
}: RevenueCatPaywallProps) {
  const { colors } = useThemeColors();

  // Web fallback - RevenueCat UI doesn't work on web
  if (Platform.OS === 'web') {
    if (!visible) return null;

    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={onClose}>
        accessibilityViewIsModal
        <View className='flex-1 items-center justify-center bg-black/50'>
          <View className='mx-6 rounded-2xl p-6' style={{ backgroundColor: colors.surface }}>
            <Text className='mb-2 text-center text-lg font-semibold' style={{ color: colors.text.primary }}>
              Premium Subscription
            </Text>
            <Text className='mb-4 text-center' style={{ color: colors.text.secondary }}>
              In-app purchases are not available on web. Please use the mobile
              app to subscribe.
            </Text>
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='rounded-xl bg-amber-500 px-6 py-3'
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              onPress={onClose}
            >
              <Text className='text-center font-semibold text-white'>
                Got it
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  // Don't render anything if not visible
  if (!visible) return null;

  // Use RevenueCat's Paywall JSX component (more reliable with Expo)
  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      presentationStyle='fullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      <RevenueCatUI.Paywall
        options={{
          displayCloseButton: true,
        }}
        style={{ flex: 1 }}
        onDismiss={() => {
          if (__DEV__) console.log('[RevenueCatPaywall] Dismissed');
          onClose();
        }}
        onPurchaseCancelled={() => {
          if (__DEV__) console.log('[RevenueCatPaywall] Purchase cancelled');
        }}
        onPurchaseCompleted={({ customerInfo }) => {
          if (__DEV__)
            console.log(
              '[RevenueCatPaywall] Purchase completed:',
              customerInfo
            );
          onPurchaseSuccess?.();
          onClose();
        }}
        onPurchaseError={({ error }) => {
          if (__DEV__)
            console.error('[RevenueCatPaywall] Purchase error:', error);
          Alert.alert('Purchase Failed', 'Your payment couldn\u2019t be processed. Please check your payment method and try again.');
        }}
        onRestoreCompleted={({ customerInfo }) => {
          if (__DEV__)
            console.log('[RevenueCatPaywall] Restore completed:', customerInfo);
          onRestoreSuccess?.();
          onClose();
        }}
        onRestoreError={({ error }) => {
          if (__DEV__)
            console.error('[RevenueCatPaywall] Restore error:', error);
          Alert.alert('Restore Failed', 'We couldn\u2019t find your previous purchases. Please try again or contact support.');
        }}
      />
    </Modal>
  );
}
