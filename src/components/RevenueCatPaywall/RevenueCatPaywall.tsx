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

import { Platform, Modal, View, Text, Pressable } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import type { RevenueCatPaywallProps } from './types';

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
  // Web fallback - RevenueCat UI doesn't work on web
  if (Platform.OS === 'web') {
    if (!visible) return null;

    return (
      <Modal transparent visible={visible} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-6 rounded-2xl bg-white p-6">
            <Text className="mb-2 text-center text-lg font-semibold text-stone-900">
              Premium Subscription
            </Text>
            <Text className="mb-4 text-center text-stone-600">
              In-app purchases are not available on web. Please use the mobile
              app to subscribe.
            </Text>
            <Pressable
              className="rounded-xl bg-amber-500 px-6 py-3"
              onPress={onClose}
            >
              <Text className="text-center font-semibold text-white">
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
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        options={{
          displayCloseButton: true,
        }}
        onDismiss={() => {
          console.log('[RevenueCatPaywall] Dismissed');
          onClose();
        }}
        onPurchaseCompleted={({ customerInfo }) => {
          console.log('[RevenueCatPaywall] Purchase completed:', customerInfo);
          onPurchaseSuccess?.();
          onClose();
        }}
        onPurchaseCancelled={() => {
          console.log('[RevenueCatPaywall] Purchase cancelled');
        }}
        onPurchaseError={({ error }) => {
          console.error('[RevenueCatPaywall] Purchase error:', error);
        }}
        onRestoreCompleted={({ customerInfo }) => {
          console.log('[RevenueCatPaywall] Restore completed:', customerInfo);
          onRestoreSuccess?.();
          onClose();
        }}
        onRestoreError={({ error }) => {
          console.error('[RevenueCatPaywall] Restore error:', error);
        }}
      />
    </Modal>
  );
}
