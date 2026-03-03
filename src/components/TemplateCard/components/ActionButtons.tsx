/**
 * ActionButtons Component
 *
 * Preview and import action buttons for template cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Button from '../../Button/Button';
import { colors } from '../../../theme/colors';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { ActionButtonsProps } from './ActionButtons.types';

/** stone-100 — no exact token in the theme palette */
const PREVIEW_BUTTON_BG = '#f5f5f4';

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
        <Check color={colors.text.inverse} size={18} strokeWidth={3} />
        <Text style={styles.successButtonText}>Added to Habits</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.buttonRow}>
      {showPreviewCTA && onPreview && (
        <Button
          accessibilityLabel={`Preview ${name} habit`}
          icon={<Eye color={colors.text.secondary} size={18} />}
          size='medium'
          style={styles.previewButton}
          textStyle={styles.previewButtonText}
          variant='primary'
          onPress={(e: any) => {
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
          { backgroundColor: isLocked ? colors.gray[400] : iconColor },
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
    backgroundColor: PREVIEW_BUTTON_BG,
    borderRadius: borderRadius.medium,
    flex: 1,
    paddingVertical: spacing.md,
  },
  previewButtonText: { color: colors.text.secondary },
  successButton: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: '100%',
  },
  successButtonText: {
    color: colors.text.inverse,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
});
