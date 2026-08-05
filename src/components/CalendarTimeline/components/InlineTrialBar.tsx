import React from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors as palette } from '@/theme/colors';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { getTrialBarCopy } from './InlineTrialBar.helpers';

interface InlineTrialBarProps {
  daysRemaining: number;
  onUpgrade: () => void;
}

/** Urgency-escalating trial bar with copy that intensifies as the trial ends */
export const InlineTrialBar: React.FC<InlineTrialBarProps> = ({
  daysRemaining,
  onUpgrade,
}) => {
  const copy = getTrialBarCopy(daysRemaining);
  return (
    <Pressable onPress={onUpgrade}>
      {({ pressed }) => (
        <LinearGradient
          colors={copy.gradient as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 8,
            opacity: pressed ? 0.75 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.tabBar.fontSize,
              fontWeight: fontWeights.bold,
              color: palette.text.inverse,
            }}
          >
            {copy.headline}
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.tabBar.fontSize,
              fontWeight: fontWeights.semibold,
              color: palette.streak[100],
            }}
          >
            {copy.cta}
          </Text>
        </LinearGradient>
      )}
    </Pressable>
  );
};
