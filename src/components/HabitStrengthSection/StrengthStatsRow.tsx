/**
 * StrengthStatsRow Component
 *
 * Two-column comparison metrics (last month / last week) in the shared
 * detail-page stat idiom. Positive changes carry the single green accent.
 * ("since start" was dropped — it equalled the hero ring's current %.)
 */

import React from 'react';
import { View } from 'react-native';
import { StatColumn, StatHairline } from '@/components/ui';
import { useThemeColors } from '@/theme/ThemeContext';

import { getThemeColors } from './constants';
import type { StrengthStatsRowProps } from './types';

/** Format a delta value for display with + or - prefix. */
function formatDelta(value: number): string {
  if (value === 0) return '0%';
  return value > 0 ? `+${value}%` : `${value}%`;
}

const safe = (value: number | undefined): number =>
  typeof value === 'number' && !Number.isNaN(value) ? value : 0;

/**
 * StrengthStatsRow displays three comparison metrics in a row.
 */
export const StrengthStatsRow = React.memo(function StrengthStatsRow({
  lastMonth,
  lastWeek,
}: StrengthStatsRowProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);

  const items = [
    {
      label: 'last month',
      raw: safe(lastMonth),
      value: formatDelta(safe(lastMonth)),
    },
    {
      label: 'last week',
      raw: safe(lastWeek),
      value: formatDelta(safe(lastWeek)),
    },
  ];

  return (
    <View
      accessibilityLabel={`Statistics: ${items[0].value} last month, ${items[1].value} last week`}
      className='flex-row items-center'
      style={{
        borderTopColor: themeColors.border,
        borderTopWidth: 1,
        paddingTop: 12,
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <StatColumn
            label={item.label}
            size='compact'
            value={item.value}
            valueColor={item.raw > 0 ? sectionColors.positive : undefined}
          />
          {i < items.length - 1 ? <StatHairline /> : null}
        </React.Fragment>
      ))}
    </View>
  );
});
