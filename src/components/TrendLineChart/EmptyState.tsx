/**
 * EmptyState - Displayed when no trend data is available
 * Dark mode aware via useThemeColors
 */

import React from 'react';
import { View } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          marginBottom: 16,
          height: 64,
          width: 64,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
          shadowColor: isDark ? '#000' : '#10b981',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
          width: 64,
        }}
      >
        <TrendingUp color={isDark ? '#6EE7B7' : '#10b981'} size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{ marginBottom: 8, textAlign: 'center', fontWeight: '700', color: colors.text.primary, fontSize: 22, letterSpacing: -0.5 }}
      >
        No Trend Data Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{ textAlign: 'center', fontSize: 17, lineHeight: 22, color: colors.text.secondary, maxWidth: 280 }}
      >
        Track habits for at least 7 days to see trends
      </Animated.Text>
    </View>
  );
}
