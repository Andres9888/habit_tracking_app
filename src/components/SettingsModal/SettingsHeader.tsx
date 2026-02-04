/**
 * SettingsHeader Component
 *
 * Modal header with title and close button.
 * Supports safe area insets for proper spacing on notched devices.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SETTINGS_COLORS } from './types';
import type { SettingsHeaderProps } from './types';

export function SettingsHeader({
  onClose,
  paddingTop = 16,
}: SettingsHeaderProps) {
  const handleClose = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  return (
    <View style={[styles.container, { paddingTop }]}>
      <Text style={styles.title}>Settings</Text>
      <Pressable
        accessibilityLabel='Close settings'
        accessibilityRole='button'
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        style={styles.closeButton}
        onPress={handleClose}
      >
        <View style={styles.closeButtonInner}>
          <X
            color={SETTINGS_COLORS.textSecondary}
            size={20}
            strokeWidth={2.5}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  closeButtonInner: {
    alignItems: 'center',
    backgroundColor: SETTINGS_COLORS.card,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  container: {
    alignItems: 'center',
    borderBottomColor: SETTINGS_COLORS.cardBorder,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
