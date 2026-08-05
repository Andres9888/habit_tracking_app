/**
 * MilestoneTrack Component
 *
 * The 5-stop journey path showing how far the habit has climbed and what's
 * left to reach. Each stop uses the user's chosen emoji and that level's
 * color; the current stop is enlarged and filled, reached stops are tinted,
 * and the connector fills up to the current position. This is the section's
 * primary motivator — you can see the summit.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { useThemeColors, withAlpha } from '@/theme';

import type { LevelConfig } from '../../StrengthProgressBar/StrengthProgressBar.types';

const STOP_WIDTH = 44;

interface MilestoneTrackProps {
  /** The five levels with resolved emoji + color */
  levels: LevelConfig[];
  /** Index of the current level (0-4) */
  currentIndex: number;
}

export const MilestoneTrack = React.memo(function MilestoneTrack({
  levels,
  currentIndex,
}: MilestoneTrackProps) {
  const { colors } = useThemeColors();

  return (
    <View
      accessibilityLabel={`Level ${currentIndex + 1} of ${levels.length}`}
      accessibilityRole='progressbar'
      className='flex-row items-start'
    >
      {levels.map((level, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <React.Fragment key={level.label}>
            {i > 0 ? (
              <View
                className='mt-4 h-0.5 flex-1 rounded-full'
                style={{
                  backgroundColor: reached
                    ? colors.primary[600]
                    : colors.border,
                }}
              />
            ) : null}
            <View className='items-center' style={{ width: STOP_WIDTH }}>
              <View
                className='h-9 w-9 items-center justify-center rounded-full'
                style={{
                  backgroundColor: reached
                    ? withAlpha(colors.primary[600], 0.1)
                    : colors.background,
                  borderColor: reached ? colors.primary[600] : colors.border,
                  borderWidth: current ? 2 : 1,
                  opacity: reached ? 1 : 0.55,
                }}
              >
                <Text style={{ fontSize: current ? 18 : 15 }}>
                  {level.emoji}
                </Text>
              </View>
              <Text
                className='mt-2 text-[9px]'
                numberOfLines={1}
                style={{
                  color: current ? colors.text.primary : colors.text.tertiary,
                  fontWeight: current ? '700' : '500',
                  maxWidth: STOP_WIDTH,
                  textAlign: 'center',
                }}
              >
                {level.label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
});
