/**
 * QuickActionItem Component
 *
 * Individual quick action button with icon, label, and subtitle.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { QuickAction } from './types';
import { ICON_MAP, ACTION_COLORS } from './constants';
import { styles } from './styles';

interface QuickActionItemProps {
  action: QuickAction;
  onPress: (action: QuickAction) => void;
  index: number;
  reduceMotion: boolean;
}

export const QuickActionItem = React.memo(function QuickActionItem({
  action,
  onPress,
  index,
  reduceMotion,
}: QuickActionItemProps) {
  const { triggerLightImpact } = useHapticFeedback();
  const { colors: themeColors, isDark } = useThemeColors();
  const Icon = ICON_MAP[action.icon];
  const actionColors = ACTION_COLORS[action.actionType];

  const handlePress = () => {
    triggerLightImpact();
    onPress(action);
  };

  const animationDelay = reduceMotion ? 0 : 50 + index * 50;

  return (
    <Animated.View
      entering={
        reduceMotion ? undefined : FadeIn.delay(animationDelay).duration(200)
      }
    >
      <Pressable
        accessibilityHint={action.subtitle}
        accessibilityLabel={action.label}
        accessibilityRole='button'
        style={({ pressed }) => [
          styles.actionItem,
          pressed && { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
        ]}
        testID={`quick-action-${action.id}`}
        onPress={handlePress}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
          style={[styles.iconContainer, { backgroundColor: actionColors.bg }]}
        >
          <Icon color={actionColors.icon} size={20} strokeWidth={2} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={[styles.actionLabel, { color: themeColors.text.primary }]}>{action.label}</Text>
          {action.subtitle && (
            <Text style={[styles.actionSubtitle, { color: themeColors.text.secondary }]}>{action.subtitle}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});
