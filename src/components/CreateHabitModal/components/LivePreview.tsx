import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

/**
 * V11 Live Preview Micro-Component
 *
 * A simple 40px preview card showing emoji + color + habit name in real-time.
 * Positioned between input and emoji picker to provide instant visual feedback.
 */

interface LivePreviewProps {
  emoji: string | null;
  color: string;
  habitName: string;
}

export const LivePreview = memo(({ emoji, color, habitName }: LivePreviewProps) => {
  const { colors } = useThemeColors();
  const displayEmoji = emoji || '🎯';
  const displayName = habitName.trim() || 'Your new habit';
  const displayColor = color || '#10b981';

  const accessibilityLabel = `Preview: ${displayEmoji} ${displayName}`;

  return (
    <View
      accessible
      accessibilityHint='This shows how your habit will appear in the list'
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='mb-3 mt-3 flex-row items-center rounded-2xl p-3 shadow-sm'
      style={{ backgroundColor: colors.card }}
    >
      <View
        accessible={false}
        className='h-10 w-10 items-center justify-center rounded-xl'
        style={{ backgroundColor: displayColor }}
      >
        <Text className='text-2xl'>{displayEmoji}</Text>
      </View>

      <Text
        accessible={false}
        className='ml-3 flex-1 text-[15px] font-medium'
        ellipsizeMode='tail'
        numberOfLines={1}
        style={{ color: colors.text.secondary }}
      >
        {displayName}
      </Text>
    </View>
  );
});

LivePreview.displayName = 'LivePreview';

export default LivePreview;
