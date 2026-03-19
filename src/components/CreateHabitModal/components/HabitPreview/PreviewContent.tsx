/**
 * Content view for populated HabitPreview
 */
import { Animated, Text, View } from 'react-native';
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
}: PreviewContentProps) => (
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
          <View className='h-14 w-14 items-center justify-center rounded-2xl bg-stone-200'>
            <Text className='text-xl text-stone-400'>?</Text>
          </View>
        )}
      </Animated.View>
      <View className='flex-1'>
        {habitName ? (
          <Text
            className='text-lg font-semibold text-stone-800'
            numberOfLines={1}
          >
            {habitName}
          </Text>
        ) : (
          <Text className='text-lg font-semibold text-stone-400'>
            {STRINGS.CREATE_HABIT.namePrompt}
          </Text>
        )}
        <Text className='text-sm text-stone-500'>
          {getTimeOfDayLabel(timeOfDay)}
        </Text>
      </View>
    </View>
  </Animated.View>
);
