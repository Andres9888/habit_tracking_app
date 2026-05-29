/**
 * TierJourneyStrip — 5-step strength tier progress aligned with habit card ranks.
 */

import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';

import { STRENGTH_LEVELS } from '../ProgressSectionConsolidated/types/strengthLevels';
import { getLevelFromStrength } from '../ProgressSectionConsolidated/types/levelHelpers';

export interface TierJourneyStripProps {
  strength: number;
  accentColor?: string;
}

export const TierJourneyStrip = React.memo(function TierJourneyStrip({
  strength,
  accentColor,
}: TierJourneyStripProps) {
  const { colors: themeColors } = useThemeColors();
  const safeStrength =
    typeof strength === 'number' && !Number.isNaN(strength) ? strength : 0;

  const activeIndex = useMemo(() => {
    const level = getLevelFromStrength(safeStrength);
    const index = STRENGTH_LEVELS.findIndex((l) => l.label === level.label);
    return index >= 0 ? index : 0;
  }, [safeStrength]);

  const fillPercent = useMemo(() => {
    if (STRENGTH_LEVELS.length <= 1) return 0;
    return (activeIndex / (STRENGTH_LEVELS.length - 1)) * 100;
  }, [activeIndex]);

  const trackColor = themeColors.gray[200];
  const fillColor = accentColor ?? themeColors.primary[600];

  return (
    <View
      accessibilityLabel={`Strength tier ${STRENGTH_LEVELS[activeIndex]?.label ?? 'Starting'}`}
      accessibilityRole='progressbar'
      className='mb-4'
    >
      <View className='relative mb-2 h-7 flex-row items-center justify-between'>
        <View
          className='absolute left-[8%] right-[8%] h-0.5 rounded-full'
          style={{ backgroundColor: trackColor, top: 13 }}
        />
        <View
          className='absolute left-[8%] h-0.5 rounded-full'
          style={{
            backgroundColor: fillColor,
            top: 13,
            width: `${Math.min(100, Math.max(0, fillPercent))}%`,
          }}
        />
        {STRENGTH_LEVELS.map((level, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          return (
            <View key={level.label} className='z-10 flex-1 items-center'>
              <View
                className='h-7 w-7 items-center justify-center rounded-full border-2'
                style={{
                  backgroundColor: isActive || isPast
                    ? themeColors.primary[50]
                    : themeColors.background,
                  borderColor: isActive ? fillColor : trackColor,
                  ...(isActive
                    ? {
                        shadowColor: fillColor,
                        shadowOffset: { height: 0, width: 0 },
                        shadowOpacity: 0.35,
                        shadowRadius: 4,
                      }
                    : {}),
                }}
              >
                <Text className='text-xs'>{level.emoji}</Text>
              </View>
              <Text
                className='mt-1 text-center text-[8px]'
                numberOfLines={2}
                style={{
                  color: isActive
                    ? themeColors.primary[700]
                    : themeColors.text.tertiary,
                  fontWeight: isActive ? '600' : '400',
                  maxWidth: 52,
                }}
              >
                {level.label.split(' ')[0]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});
