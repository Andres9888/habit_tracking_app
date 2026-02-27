/**
 * ActionButtons Component
 *
 * Preview and import action buttons for template cards
 */

import React from 'react';
import { View, Text, StyleSheet, type GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Eye } from 'lucide-react-native';
import Button from '../../Button/Button';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontFamilies} from '../../../theme/typography';
import type { ActionButtonsProps } from './ActionButtons.types';
import { triggerHaptic } from '@/utils/haptics';

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
  const { colors: themeColors } = useThemeColors();

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
          icon={<Eye color={themeColors.text.secondary} size={18} />}
          size='medium'
          style={[styles.previewButton, { backgroundColor: themeColors.surface }]}
          textStyle={{ color: themeColors.text.secondary }}
          variant='primary'
          onPress={(e: GestureResponderEvent) => {
            e.stopPropagation();
            triggerHaptic('tap');
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
    borderRadius: borderRadius.medium,
    flex: 1,
    paddingVertical: spacing.md,
  },
  previewButtonText: {},
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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
});
