/**
 * ActionButtons Component
 *
 * Preview and import action buttons for template cards
 */

import React from 'react';
import { View, Text, StyleSheet, type GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Button from '../../Button/Button';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { ActionButtonsProps } from './ActionButtons.types';

export function ActionButtons({
  checkmarkStyle,
  iconColor,
  isImported,
  isImporting,
  isLocked,
  name,
  onImportPress,
  onPreview,
  showPreviewCTA,
}: ActionButtonsProps) {
  if (isImported) {
    return (
      <Animated.View style={[styles.successButton, checkmarkStyle]}>
        <Check color='#fff' size={18} strokeWidth={3} />
        <Text style={styles.successButtonText}>Added to Habits</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.buttonRow}>
      {showPreviewCTA && onPreview && (
        <Button
          accessibilityLabel={`Preview ${name} habit`}
          icon={<Eye color='#57534e' size={18} />}
          size='medium'
          style={styles.previewButton}
          textStyle={styles.previewButtonText}
          variant='primary'
          onPress={(e: GestureResponderEvent) => {
            e.stopPropagation();
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPreview();
          }}
        >
          Preview
        </Button>
      )}
      <Button
        accessibilityLabel={`Import ${name} habit`}
        disabled={isLocked}
        loading={isImporting}
        size='medium'
        style={[
          styles.importButton,
          { backgroundColor: isLocked ? '#6B7280' : iconColor },
        ]}
        variant='primary'
        onPress={onImportPress}
      >
        {isLocked ? 'Unlock with Pro' : 'Import Habit'}
      </Button>
    </View>
  );
}

export const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  importButton: {
    borderRadius: borderRadius.medium,
    flex: 1,
    paddingVertical: spacing.md,
  },
  previewButton: {
    backgroundColor: '#f5f5f4',
    borderRadius: borderRadius.medium,
    flex: 1,
    paddingVertical: spacing.md,
  },
  previewButtonText: { color: '#57534e' },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: '100%',
  },
  successButtonText: {
    color: '#fff',
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
});
