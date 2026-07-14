/**
 * WebFallback — shown on web where RevenueCat isn't available
 */

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { WEB_PURCHASE_FALLBACK_MESSAGE } from '../../lib/purchases';
import { colors as coreColors } from '../../theme/colors/core';
import { useThemeColors } from '../../theme/ThemeContext';

interface WebFallbackProps {
  dismissible?: boolean;
  visible: boolean;
  onClose: () => void;
}

export function WebFallback({
  dismissible = true,
  visible,
  onClose,
}: WebFallbackProps) {
  const { colors } = useThemeColors();

  if (!visible) return null;

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={dismissible ? onClose : undefined}
    >
      <View className='flex-1 items-center justify-center bg-black/50'>
        <View
          className='mx-6 rounded-2xl p-6'
          style={{ backgroundColor: colors.surface }}
        >
          <Text
            className='mb-2 text-center text-lg font-semibold'
            style={{ color: colors.text.primary }}
          >
            Premium Subscription
          </Text>
          <Text
            className='mb-4 text-center'
            style={{ color: colors.text.secondary }}
          >
            {WEB_PURCHASE_FALLBACK_MESSAGE}
          </Text>
          {dismissible ? (
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='rounded-xl px-6 py-3'
              style={({ pressed }) => ({
                backgroundColor: coreColors.primary[600],
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={onClose}
            >
              <Text className='text-center font-semibold text-white'>
                Got it
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
