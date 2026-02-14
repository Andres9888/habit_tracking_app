/**
 * WOOPSectionHeader - Header row for WOOPSection
 * Uses WorkshopSectionHeader with custom trailing content for the help button.
 */

import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { HelpCircle, Pencil } from 'lucide-react-native';
import { WorkshopSectionHeader } from '../shared';
import { useThemeColors } from '../../../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WOOPSectionHeaderProps {
  hasWoop: boolean;
  onHelpPress: () => void;
}

export function WOOPSectionHeader({
  hasWoop,
  onHelpPress,
}: WOOPSectionHeaderProps) {
  const { isDark } = useThemeColors();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = isDark ? '#A8A29E' : '#A1A1AA';

  const trailingContent = (
    <>
      <AnimatedPressable
        accessibilityLabel="Learn about WOOP"
        accessibilityRole="button"
        hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
        style={[
          {
            alignItems: 'center',
            height: 24,
            justifyContent: 'center',
            width: 24,
          },
          animatedStyle,
        ]}
        onPress={onHelpPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <HelpCircle color={iconColor} size={16} />
      </AnimatedPressable>
      {hasWoop && (
        <Pencil color={iconColor} size={14} />
      )}
    </>
  );

  return (
    <WorkshopSectionHeader
      accent="stone"
      emoji="🎯"
      title="WOOP Plan"
      trailingAction={!hasWoop ? { label: 'Set up' } : undefined}
      trailingContent={trailingContent}
    />
  );
}
