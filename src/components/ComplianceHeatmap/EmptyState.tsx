/**
 * Empty state view for ComplianceHeatmap
 * Dark mode: migrated to useThemeColors
 */

import React from 'react';
import { View } from 'react-native';
import { Grid3X3 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel="No compliance data yet. Complete habits daily to see your compliance heatmap."
      style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? colors.gray[800] : '#EFF6FF',
          borderRadius: 16,
          height: 64,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: '#3b82f6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 64,
        }}
      >
        <Grid3X3 color={isDark ? '#60A5FA' : '#3b82f6'} size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Compliance Data
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Complete habits daily to see your compliance heatmap
      </Animated.Text>
    </View>
  );
}
