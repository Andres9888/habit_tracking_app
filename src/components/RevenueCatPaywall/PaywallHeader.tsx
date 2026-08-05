/**
 * PaywallHeader — drag indicator + close button
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../theme/colors/core';
import { spacing, borderRadius as themeRadius } from '../../theme/spacing';
import { iconSizes } from '@/theme/iconSizes';

interface PaywallHeaderProps {
  onClose: () => void;
  disabled?: boolean;
  hideClose?: boolean;
}

export function PaywallHeader({
  onClose,
  disabled,
  hideClose,
}: PaywallHeaderProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacing.base,
        paddingTop: spacing.md,
      }}
    >
      {/* Drag indicator */}
      <View
        style={{
          backgroundColor: colors.gray[300],
          borderRadius: 2.5,
          height: 5,
          width: 36,
        }}
      />

      {/* Close button */}
      {hideClose ? null : (
        <Pressable
          accessibilityLabel="Close paywall"
          accessibilityRole="button"
          disabled={disabled}
          hitSlop={8}
          style={{
            alignItems: 'center',
            backgroundColor: colors.gray[200],
            borderRadius: themeRadius.full,
            height: 32,
            justifyContent: 'center',
            position: 'absolute',
            right: spacing.base,
            top: spacing.md,
            width: 32,
          }}
          onPress={onClose}
        >
          <X color={colors.gray[600]} size={iconSizes.medium} />
        </Pressable>
      )}
    </View>
  );
}
