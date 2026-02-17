/**
 * FrequencyBadge — shows the habit's frequency schedule on the card.
 * Only renders for non-daily frequencies.
 */

import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { frequencyToLabel } from '../../CreateHabitModal/components/FrequencyPicker';

interface FrequencyBadgeProps {
  frequency?: string;
  daysOfWeek?: number[];
}

function FrequencyBadgeComponent({ frequency, daysOfWeek }: FrequencyBadgeProps) {
  const { colors: themeColors } = useThemeColors();

  // Don't show badge for daily (default) or empty frequency
  if (!frequency || frequency === 'daily') return null;

  const label = frequencyToLabel(frequency, daysOfWeek);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 2,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        backgroundColor: themeColors.card,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '500',
          color: themeColors.text.secondary,
          letterSpacing: 0.3,
        }}
      >
        🗓 {label}
      </Text>
    </View>
  );
}

export const FrequencyBadge = memo(FrequencyBadgeComponent);
