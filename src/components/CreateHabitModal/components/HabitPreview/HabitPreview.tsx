/**
 * Live preview of habit being created/edited
 */
import { Text, View } from 'react-native';
import { SkeletonCard } from '../SkeletonLoader';
import { usePreviewAnimations } from './usePreviewAnimations';
import { getAccessibilityLabel } from './helpers';
import { EmptyPreview } from './EmptyPreview';
import { PreviewContent } from './PreviewContent';
import type { HabitPreviewProps } from './types';

export const HabitPreview = ({
  habitName,
  selectedEmoji,
  selectedColor,
  timeOfDay,
}: HabitPreviewProps) => {
  const isEmpty = !habitName && !selectedEmoji;
  const animations = usePreviewAnimations(
    isEmpty,
    selectedEmoji,
    habitName,
    selectedColor
  );

  return (
    <View
      accessible
      accessibilityLabel={getAccessibilityLabel(
        isEmpty,
        habitName,
        selectedEmoji,
        timeOfDay
      )}
      accessibilityRole='summary'
      className='mb-4 mt-3 overflow-hidden rounded-2xl bg-white p-3'
      style={{
        borderColor: isEmpty ? '#e7e5e4' : selectedColor,
        borderWidth: 2,
      }}
    >
      <Text className='mb-2 text-xs font-semibold text-stone-500'>
        ✨ Live Preview
      </Text>

      {animations.showSkeleton ? (
        <View className='py-2'>
          <SkeletonCard />
        </View>
      ) : isEmpty ? (
        <EmptyPreview />
      ) : (
        <PreviewContent
          contentOpacity={animations.contentOpacity}
          contentScale={animations.contentScale}
          habitName={habitName}
          iconScale={animations.iconScale}
          pulseAnim={animations.pulseAnim}
          selectedColor={selectedColor}
          selectedEmoji={selectedEmoji}
          timeOfDay={timeOfDay}
        />
      )}
    </View>
  );
};
