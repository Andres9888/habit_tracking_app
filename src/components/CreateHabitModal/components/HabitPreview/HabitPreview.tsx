/**
 * Live preview of habit being created/edited
 */
import { Text, View } from 'react-native';
import { SkeletonCard } from '../SkeletonLoader';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
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
      className='mb-4 mt-3 overflow-hidden rounded-2xl p-3'
      style={{
        backgroundColor: colors.card,
        borderColor: isEmpty ? colors.border : selectedColor,
        borderWidth: 2,
      }}
    >
      <Text className='mb-2 text-xs font-semibold' style={{ color: colors.text.tertiary }}>
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
