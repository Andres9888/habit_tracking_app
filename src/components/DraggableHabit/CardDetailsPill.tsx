import React from 'react';
import { View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import ReAnimated from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { useCardChevronNudge } from './useCardChevronNudge';
import { getChevronColor } from './CardHeader.styles';

interface CardDetailsPillProps {
  accentColor: string;
  enableChevronNudge?: boolean;
  highContrastMode: boolean;
  isCompactMode?: boolean;
  reduceMotionPreference: boolean;
}

/**
 * Quiet header disclosure chevron — signals the card opens its detail view.
 *
 * Intentionally minimal: no label, no pill background. Sits at the end of the
 * header row in the same position as before. The first visible card can run a
 * single subtle nudge while the coach hint is active.
 */
export function CardDetailsPill({
  accentColor,
  enableChevronNudge = false,
  highContrastMode,
  isCompactMode,
  reduceMotionPreference,
}: CardDetailsPillProps) {
  const { nudgeStyle } = useCardChevronNudge({
    enabled: enableChevronNudge,
    reduceMotion: reduceMotionPreference,
  });
  const chevronColor = getChevronColor(highContrastMode, accentColor);

  return (
    <ReAnimated.View className='ml-auto' style={nudgeStyle}>
      <View className='items-center justify-center'>
        <ChevronRight
          color={chevronColor}
          size={isCompactMode ? iconSizes.small : iconSizes.medium}
          strokeWidth={2}
        />
      </View>
    </ReAnimated.View>
  );
}
