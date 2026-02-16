import React from 'react';
import { Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface ViewAllButtonProps {
  noteCount: number;
  onPress: () => void;
}

export function ViewAllButton({ noteCount, onPress }: ViewAllButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const { colors } = useThemeColors();

  return (
    <AnimatedPressable
      accessibilityLabel={`View all ${noteCount} notes`}
      accessibilityRole='button'
      className='flex-row items-center justify-center gap-1 rounded-xl border border-dashed py-3'
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
      onPress={handlePress}
    >
      <Text className='text-sm font-medium' style={{ color: colors.text.secondary }}>
        View all ({noteCount})
      </Text>
      <ChevronRight color={colors.text.tertiary} size={16} />
    </AnimatedPressable>
  );
}
