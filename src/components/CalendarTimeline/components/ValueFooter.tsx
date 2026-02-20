import React from 'react';
import { View, Text } from 'react-native';

import { Sparkline } from './Sparkline';

interface ValueFooterProps {
  averageStrength: number;
  weekOverWeekChange: number;
  insightText?: string;
  insightEmoji?: string;
  completionByDay: Record<string, { completed: number; total: number }>;
}

const COLORS = {
  strength: '#059669', // emerald-600
  positive: '#7c3aed', // violet-600
  negative: '#ef4444', // red-500
  neutral: '#78716c', // stone-500
  label: '#a8a29e', // stone-400
  insightBg: '#fafaf9', // stone-50
  insightText: '#57534e', // stone-600
  insightBold: '#1c1917', // stone-800
  border: '#f5f5f4', // stone-100
};

/** Value footer showing sparkline, stats, and contextual insight */
export const ValueFooter: React.FC<ValueFooterProps> = ({
  averageStrength,
  weekOverWeekChange,
  insightText,
  insightEmoji = '💡',
  completionByDay,
}) => {
  const changeColor =
    weekOverWeekChange >= 0 ? COLORS.positive : COLORS.negative;
  const changePrefix = weekOverWeekChange >= 0 ? '+' : '';
  const hasStats = averageStrength > 0 || weekOverWeekChange !== 0;

  if (!hasStats && !insightText) return null;

  return (
    <View
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
      }}
    >
      {hasStats && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: insightText ? 8 : 0,
          }}
        >
          <View style={{ flex: 1 }}>
            <Sparkline completionByDay={completionByDay} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 8,
              borderLeftWidth: 1,
              borderLeftColor: COLORS.border,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '900',
                  color: COLORS.strength,
                  lineHeight: 14,
                }}
              >
                {Math.round(averageStrength)}%
              </Text>
              <Text style={{ fontSize: 7, color: COLORS.label }}>strength</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '900',
                  color: changeColor,
                  lineHeight: 14,
                }}
              >
                {changePrefix}
                {Math.round(weekOverWeekChange)}%
              </Text>
              <Text style={{ fontSize: 7, color: COLORS.label }}>
                vs last wk
              </Text>
            </View>
          </View>
        </View>
      )}

      {insightText && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: COLORS.insightBg,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 10 }}>{insightEmoji}</Text>
          <Text style={{ fontSize: 10, color: COLORS.insightText, flex: 1 }}>
            {insightText}
          </Text>
        </View>
      )}
    </View>
  );
};
