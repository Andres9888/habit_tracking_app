/**
 * ActionButtons Component
 *
 * Preview and import action buttons for template cards
 */

import React from 'react';
import { View, Text, type GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Eye } from 'lucide-react-native';
import Button from '../../Button/Button';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { ActionButtonsProps } from './ActionButtons.types';
import { styles } from './ActionButtons.styles';
import { triggerHaptic } from '@/utils/haptics';
import { iconSizes } from '@/theme/iconSizes';

export function ActionButtons({
  checkmarkStyle,
  iconColor,
  index,
  isImported,
  isImporting,
  isLocked,
  name,
  onImportPress,
  onPreview,
  showPreviewCTA,
}: ActionButtonsProps) {
  const testPrefix = index == null ? undefined : `templates-category-card-${index}`;
  const { colors: themeColors } = useThemeColors();

  if (isImported) {
    return (
      <Animated.View
        testID={testPrefix ? `${testPrefix}-added` : undefined}
        style={[styles.successButton, checkmarkStyle]}
      >
        <Check color='#fff' size={iconSizes.medium} strokeWidth={3} />
        <Text style={styles.successButtonText}>Added to Habits</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.buttonRow}>
      {showPreviewCTA && onPreview ? <Button
          accessibilityLabel={`Preview ${name} habit`}
          icon={<Eye color={themeColors.text.secondary} size={iconSizes.medium} />}
          size='medium'
          style={[styles.cardButton, { backgroundColor: themeColors.surface }]}
          testID={testPrefix ? `${testPrefix}-preview` : undefined}
          textStyle={{ color: themeColors.text.secondary }}
          variant='primary'
          onPress={(e: GestureResponderEvent) => {
            e.stopPropagation();
            triggerHaptic('tap');
            onPreview();
          }}
        >
          Preview
        </Button> : null}
      <Button
        accessibilityLabel={`Import ${name} habit`}
        disabled={isLocked}
        loading={isImporting}
        size='medium'
        testID={testPrefix ? `${testPrefix}-add` : undefined}
        style={[styles.cardButton, { backgroundColor: isLocked ? '#6B7280' : iconColor }]}
        variant='primary'
        onPress={onImportPress}
      >
        {isLocked ? 'Unlock with Pro' : 'Import Habit'}
      </Button>
    </View>
  );
}
