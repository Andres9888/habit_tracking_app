import { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { HUBERMAN_PHASES } from '../../../../constants/hubermanPhases';
import type { QuickPickCardProps } from './types';

const QuickPickCardComponent = ({
  template,
  isSelected,
  onPress,
}: QuickPickCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const phaseInfo = HUBERMAN_PHASES[template.timeOfDay];
  const { colors: themeColors } = useThemeColors();

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      accessibilityHint={`Tap to use the ${template.name} template`}
      accessibilityLabel={`Quick pick: ${template.name}, ${phaseInfo.shortLabel}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='mr-3 overflow-hidden rounded-2xl bg-white p-3'
        style={[
          {
            borderColor: isSelected ? themeColors.status.success : '#e7e5e4', // #e7e5e4 = stone-200
            borderWidth: 2,
            minWidth: 100,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Emoji with gradient background */}
        <View
          className='mb-2 h-12 w-12 items-center justify-center self-center rounded-xl'
          style={{ backgroundColor: template.color }}
        >
          <Text className='text-2xl'>{template.emoji}</Text>
        </View>

        {/* Name */}
        <Text className='mb-1 text-center text-sm font-semibold' style={{ color: themeColors.text.primary }}>
          {template.name}
        </Text>

        {/* Timing subtitle */}
        <Text className='text-center text-xs' style={{ color: themeColors.text.secondary }}>
          {phaseInfo.icon} {phaseInfo.shortLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const QuickPickCard = memo(QuickPickCardComponent);
