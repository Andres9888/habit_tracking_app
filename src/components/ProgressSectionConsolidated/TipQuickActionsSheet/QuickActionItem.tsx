/**
 * QuickActionItem Component
 *
 * Individual quick action button with icon, label, and subtitle.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import type { QuickAction } from './types';
import { ICON_MAP, ACTION_COLORS } from './constants';
import { useStyles } from './styles';
import { iconSizes } from '@/theme/iconSizes';

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
  const styles = useStyles();
  const { triggerLightImpact } = useHapticFeedback();
  const Icon = ICON_MAP[action.icon];
  const colors = ACTION_COLORS[action.actionType];

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
          pressed && styles.actionItemPressed,
        ]}
        testID={`quick-action-${action.id}`}
        onPress={handlePress}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
          style={[styles.iconContainer, { backgroundColor: colors.bg }]}
        >
          <Icon color={colors.icon} size={iconSizes.medium} strokeWidth={2} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionLabel}>{action.label}</Text>
          {action.subtitle ? <Text style={styles.actionSubtitle}>{action.subtitle}</Text> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
});
