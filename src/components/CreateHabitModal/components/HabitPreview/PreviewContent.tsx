/**
 * Content view for populated HabitPreview
 */
import { Animated, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import STRINGS from '../../../../constants/strings';
import { getTimeOfDayLabel } from './helpers';
import type { HubermanPhase } from '../../../../constants/hubermanPhases';

interface PreviewContentProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  timeOfDay?: HubermanPhase | null;
  iconScale: Animated.Value;
  contentOpacity: Animated.Value;
  contentScale: Animated.Value;
  pulseAnim: Animated.Value;
}

export const PreviewContent = ({
  habitName,
  selectedEmoji,
  selectedColor,
  timeOfDay,
  iconScale,
  contentOpacity,
  contentScale,
  pulseAnim,
}: PreviewContentProps) => {
  const { colors: themeColors } = useThemeColors();

  return (
  <Animated.View
    style={{ opacity: contentOpacity, transform: [{ scale: contentScale }] }}
  >
    <View className='flex-row items-center gap-3'>
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        {selectedEmoji ? (
          <View className='relative'>
            <Animated.View
              className='absolute inset-0 rounded-2xl'
              style={{
                backgroundColor: selectedColor,
                opacity: 0.3,
                transform: [{ scale: pulseAnim }],
              }}
            />
            <View
              className='h-14 w-14 items-center justify-center rounded-2xl'
              style={{ backgroundColor: selectedColor }}
            >
              <Text className='text-[28px]'>{selectedEmoji}</Text>
            </View>
          </View>
        ) : (
          <View className='h-14 w-14 items-center justify-center rounded-2xl' style={{ backgroundColor: themeColors.border }}>
            <Text className='text-xl' style={{ color: themeColors.text.tertiary }}>?</Text>
          </View>
        )}
      </Animated.View>
      <View className='flex-1'>
        {habitName ? (
          <Text
            className='text-lg font-semibold'
            numberOfLines={1}
            style={{ color: themeColors.text.primary }}
          >
            {habitName}
          </Text>
        ) : (
          <Text className='text-lg font-semibold' style={{ color: themeColors.text.tertiary }}>
            {STRINGS.CREATE_HABIT.namePlaceholder}
          </Text>
        )}
        <Text className='text-sm' style={{ color: themeColors.text.secondary }}>
          {getTimeOfDayLabel(timeOfDay)}
        </Text>
      </View>
    </View>
  </Animated.View>
  );
};
