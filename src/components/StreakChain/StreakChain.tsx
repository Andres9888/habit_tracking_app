import React from 'react';
import { View, Text } from 'react-native';
import { Link2 } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { useStreakChainLogic } from './StreakChain.hooks';
import type { StreakChainProps } from './StreakChain.types';

// Re-export types for backwards compatibility
export type { DayStatus, StreakChainProps } from './StreakChain.types';

/**
 * StreakChain renders a compact chain visualization similar to the provided design.
 * - Left: label (e.g., "Reading Chain")
 * - Right: rounded pill with streak days
 * - Below: row of circles with link icon, connected by short bars
 *
 * Design language:
 * - Typography and colors align with existing app styles (#1c1917 titles, #78716c secondary, #e7e5e4 borders)
 * - Primary color uses #3B82F6 (blue)
 */
export default function StreakChain({
  label,
  statuses,
  size = 28,
}: StreakChainProps) {
  const { colors: themeColors } = useThemeColors();
  const { circleSize, iconSize, streakDays } = useStreakChainLogic(
    statuses,
    size
  );

  return (
    <View className='pb-3 pt-1'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-base font-bold tracking-tight' style={{ color: themeColors.text.primary }}>
          {label}
        </Text>
        <View
          accessibilityLabel={`${streakDays} days`}
          className='rounded-full px-2.5 py-1'
          style={{ backgroundColor: themeColors.status.premiumLight }}
        >
          <Text className='text-xs font-semibold' style={{ color: themeColors.text.primary }}>
            {streakDays} days
          </Text>
        </View>
      </View>

      <View className='flex-row items-center'>
        {statuses.map((status, idx) => {
          const isDone = status === 'done';
          const isFuture = status === 'planned'; // treat planned as future/disabled
          const connectorActive = idx < statuses.length - 1 && isDone;

          return (
            <View key={idx} className='flex-row items-center'>
              <View
                className='items-center justify-center'
                style={{
                  backgroundColor: isDone ? themeColors.status.info : themeColors.gray[200],
                  borderRadius: circleSize / 2,
                  height: circleSize,
                  opacity: isFuture ? 0.5 : 1,
                  width: circleSize,
                }}
              >
                <Link2
                  color={isDone ? themeColors.text.inverse : themeColors.text.tertiary}
                  size={iconSize}
                />
              </View>

              {idx < statuses.length - 1 ? <View
                  className='mx-1.5 h-0.5 w-[18px] rounded-sm'
                  style={{
                    backgroundColor: connectorActive ? themeColors.status.infoLight : themeColors.gray[200],
                  }}
                /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
